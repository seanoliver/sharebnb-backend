'use strict';

/** Routes for Users */
const jsonschema = require('jsonschema');
const express = require('express');
const { BadRequestError } = require('../expressError');
const User = require('../models/user');
const userUpdateSchema = require('../schemas/userUpdate.json');

const router = express.Router();

/**
 * Get list of all users.
 * @route GET /
 * @param {Object} req - Request object.
 * @param {Object} res - Response object.
 * @param {Function} next - Next middleware.
 * @returns {Object} Users: { users: [{username, firstName, lastName, email}, ...] }
 */
router.get('/', async function (req, res, next) {
	// TODO: Add isLoggedIn middleware
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
router.get('/:username', async function (req, res, next) {
	const user = await User.get(req.params.username);
	return res.json({ user });
});

/** PATCH /[username] { user } => { user }
 *
 * Data can include:
 *   { firstName, lastName, password, email }
 *
 * Returns { username, firstName, lastName, email, isAdmin }
 *
 * Authorization required: same-user-as-:username
 **/

router.patch('/:username', async function (req, res, next) {
	// TODO: Add isLoggedIn middleware
	// TODO: Add isAccountOwner middleware
	const validator = jsonschema.validate(req.body, userUpdateSchema, {
		required: true,
	});
	if (!validator.valid) {
		const errs = validator.errors.map(e => e.stack);
		throw new BadRequestError(errs);
	}

	const user = await User.update(req.params.username, req.body);
	return res.json({ user });
});

/** DELETE /[username]  =>  { deleted: username }
 *
 * Authorization required: same-user-as-:username
 **/

router.delete('/:username', async function (req, res, next) {
	await User.remove(req.params.username);
	return res.json({ deleted: req.params.username });
});

module.exports = router;
