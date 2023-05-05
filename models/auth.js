'use strict';

/** Routes for Users */
const bcrypt = require('bcrypt');
const jsonschema = require('jsonschema');
const express = require('express');
const { BadRequestError } = require('../expressError');
const User = require('../models/user');
const userUpdateSchema = require('../schemas/userUpdate.json');

const router = express.Router();

/** POST: register new user
 *
 * Accepts JSON: { username, password }
 * Returns JSON: { message }
 *
 */
router.post('/register', (req, res) => {
	const { username, password } = req.body;

	bcrypt.hash(password, 10, (err, hashedPassword) => {
		if (err) {
			return res.status(500).json({ error: err.message });
		}

		const newUser = new User({ username, password: hashedPassword });

		newUser.register(err => {
			if (err) {
				return res.status(500).json({ error: err.message });
			}
			res.status(201).json({ message: 'User registered successfully' });
		});
	});
});

/** POST: login user
 *
 * Accepts JSON: { username, password }
 * Returns JSON: { message }
 *
 */
router.post('/login', (req, res) => {
	res.status(200).json({ message: 'Logged in successfully' });
});