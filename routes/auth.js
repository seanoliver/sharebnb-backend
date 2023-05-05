'use strict';

/** Routes for authentication. */

const jsonschema = require('jsonschema');

const User = require('../models/user');
const express = require('express');
const { createToken } = require('../helpers/tokens');
const userAuthSchema = require('../schemas/userAuth.json');
const userRegisterSchema = require('../schemas/userRegister.json');
const { BadRequestError } = require('../expressError');

// Initialize router
const router = new express.Router();

/**
 * Authenticate user and return a JWT token.
 * @route POST /auth/login
 * @param {Object} req - Request with username and password in body.
 * @param {Object} res - Response object.
 * @param {Function} next - Next middleware.
 * @returns {Object} JWT token for authentication.
 * @throws {BadRequestError} If validation fails.
 * @throws {Error} If authentication fails.
 * @authorization None
 */
router.post('/login', async function (req, res, next) {
	const validator = jsonschema.validate(req.body, userAuthSchema, {
		required: true,
	});
	if (!validator.valid) {
		const errs = validator.errors.map(e => e.stack);
		throw new BadRequestError(errs);
	}

	const { username, password } = req.body;
	const user = await User.authenticate(username, password);
	const token = createToken(user);
	return res.json({ token });
});

/**
 * Register a new user and return a JWT token.
 * @route POST /auth/register
 * @param {Object} req - Request with user data in body.
 * @param {Object} res - Response object.
 * @param {Function} next - Next middleware.
 * @returns {Object} JWT token for authentication.
 * @throws {BadRequestError} If validation fails.
 * @throws {Error} If registration fails.
 * @authorization None
 */
router.post('/register', async function (req, res, next) {
	const validator = jsonschema.validate(req.body, userRegisterSchema, {
		required: true,
	});

	if (!validator.valid) {
		const errs = validator.errors.map(e => e.stack);
		throw new BadRequestError(errs);
	}

	const newUser = await User.register({ ...req.body });
	const token = createToken(newUser);
	return res.status(201).json({ token });
});

module.exports = router;
