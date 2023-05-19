'use strict';

/** Routes for Users */
const jsonschema = require('jsonschema');
const express = require('express');
const { BadRequestError } = require('../expressError');
const User = require('../models/user');
const userUpdateSchema = require('../schemas/userUpdate.json');
const { isLoggedIn, isCorrectUser } = require('../middleware/auth');

// Initialize router
const router = new express.Router();

/**
 * Get list of all users.
 * @route GET /
 * @param {Object} req - Request object.
 * @param {Object} res - Response object.
 * @param {Function} next - Next middleware.
 * @returns {Object} Users: { users: [{username, firstName, lastName, email}, ...] }
 */
router.get('/', isLoggedIn, async function (req, res, next) {
	const users = await User.getAll();
	return res.json({ users });
});

/**
 * Get data about user by username.
 * @route GET /[username]
 * @param {Object} req - Request with username in params.
 * @param {Object} res - Response object.
 * @param {Function} next - Next middleware.
 * @returns {Object} User data:
 *   { id, username, firstName, lastName, listings, bookings, conversations }
 *   - listings: [{ id, name, description, price, street, city, state, zip, genre }]
 *   - bookings: [{ id, owner_id, renter_id, listing_id, created_at }]
 *   - conversations: [{ id, renter_id, owner_id, listing_id }]
 */
router.get('/:username', isLoggedIn, async function (req, res, next) {
	const user = await User.get(req.params.username);
	return res.json({ user });
});

/**
 * Update user data by username; returns updated user.
 * @route PATCH /[username]
 * @param {Object} req - Request with username in params and data in body.
 * @param {Object} res - Response object.
 * @param {Function} next - Next middleware.
 * @returns {Object} Updated user: { username, firstName, lastName, email, isAdmin }
 * @throws {AuthorizationError} If not same user as :username.
 * @throws {BadRequestError} If request body fails validation.
 */
router.patch(
	'/:username',
	isLoggedIn,
	isCorrectUser,
	async (req, res, next) => {
		const validator = jsonschema.validate(req.body, userUpdateSchema, {
			required: true,
		});

		if (!validator.valid) {
			const errs = validator.errors.map(e => e.stack);
			throw new BadRequestError(errs);
		}

		const user = await User.update(req.params.username, req.body);
		return res.json({ user });
	}
);

/**
 * Delete user by username; returns { deleted: username }.
 * @route DELETE /[username]
 * @param {Object} req - Request with username in params.
 * @param {Object} res - Response object.
 * @param {Function} next - Next middleware.
 * @returns {Object} Deleted user: { deleted: username }
 * @throws {AuthorizationError} If not same user as :username.
 */
router.delete(
	'/:username',
	isLoggedIn,
	isCorrectUser,
	async function (req, res, next) {
		await User.remove(req.params.username);
		return res.json({ deleted: req.params.username });
	}
);

module.exports = router;
