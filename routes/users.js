'use strict';

/** Routes for Users */
const bcrypt = require('bcrypt');
const jsonschema = require('jsonschema');
const express = require('express');
const { BadRequestError } = require('../expressError');
const User = require('../models/user');
const userUpdateSchema = require('../schemas/userUpdate.json');

const router = express.Router();

/** GET / => { users: [ {username, firstName, lastName, email }, ... ] }
 *
 * Returns list of all users.
 *
 **/

router.get('/', async function (req, res, next) {
	const users = await User.getAll();
	return res.json({ users });
});

/** GET /[username] => { user }
 *
 * Returns { username, firstName, lastName, jobs }
 *   where jobs is { id, title, companyHandle, companyName, state }
 *
 **/

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
