'use strict';

const db = require('../db');
const bcrypt = require('bcrypt');
const { sqlForPartialUpdate } = require('../helpers/sql');
const {
	NotFoundError,
	BadRequestError,
	UnauthorizedError,
} = require('../expressError');

const { BCRYPT_WORK_FACTOR } = require('../config.js');

class User {
	/**
	 * Authenticate user with provided username and password.
	 * @param {string} username - Username for authentication.
	 * @param {string} password - Password for authentication.
	 * @returns {Object} Authenticated user data: { id, username, firstName, lastName, email }
	 * @throws {UnauthorizedError} If user not found or password is incorrect.
	 */
	static async authenticate(username, password) {
		// Try to find the user first
		const result = await db.query(
			`SELECT id,
							username,
							password,
							first_name AS "firstName",
							last_name  AS "lastName",
							email
				 FROM users
				WHERE username = $1`,
			[username]
		);

		const user = result.rows[0];

		if (user) {
			// Compare hashed password to a new hash from password
			const isValid = await bcrypt.compare(password, user.password);
			if (isValid === true) {
				delete user.password;
				return user;
			}
		}

		throw new UnauthorizedError('Invalid username/password');
	}

	/**
	 * Register a new user with provided data.
	 * @param {Object} data - User data for registration.
	 * @param {string} data.username - Username.
	 * @param {string} data.password - Password.
	 * @param {string} data.firstName - First name.
	 * @param {string} data.lastName - Last name.
	 * @param {string} data.email - Email.
	 * @returns {Object} Registered user data: { username, firstName, lastName, email }
	 * @throws {BadRequestError} If username is a duplicate.
	 */
	static async register({ username, password, firstName, lastName, email }) {
		const duplicateCheck = await db.query(
			`SELECT username
     		 FROM users
     		WHERE username = $1`,
			[username]
		);

		if (duplicateCheck.rows.length > 0) {
			throw new BadRequestError(`Duplicate username: ${username}`);
		}

		const hashedPassword = await bcrypt.hash(password, BCRYPT_WORK_FACTOR);

		const result = await db.query(
			`INSERT INTO users
     							 (username, password, first_name, last_name, email)
     				VALUES ($1, $2, $3, $4, $5)
     		 RETURNING id, username, first_name AS "firstName",
				           last_name AS "lastName", email`,
			[username, hashedPassword, firstName, lastName, email]
		);

		const user = result.rows[0];

		return user;
	}

	/**
	 * Get list of all users.
	 * @returns {Array} Users: [{ id, username, firstName, lastName, email }, ...]
	 */
	static async getAll() {
		const result = await db.query(
			`SELECT id,
							username,
							first_name AS firstName,
							last_name AS lastName,
							email
				 FROM users
		 ORDER BY username`
		);
		return result.rows;
	}

	/**
	 * Get data about user by username.
	 * @param {string} username - The username of the user to retrieve.
	 * @returns {Object} User data:
	 *   { id, username, firstName, lastName, listings, bookings, conversations }
	 *   - listings: [{ id, name, description, price, street, city, state, zip, genre }]
	 *   - bookings: [{ id, owner_id, renter_id, listing_id, created_at }]
	 *   - conversations: [{ id, renter_id, owner_id, listing_id }]
	 * @throws {NotFoundError} If user not found.
	 */
	static async get(username) {
		const userResult = await db.query(
			`SELECT id, username, first_name AS firstName, last_name AS lastName, email
       FROM users
      WHERE username = $1`,
			[username]
		);
		const user = userResult.rows[0];
		if (!user) throw new NotFoundError(`User not found: ${username}`);

		const listingsResult = await db.query(
			`SELECT id, name, description, price, street, city, state, zip, genre
         FROM listings
        WHERE owner_id = $1
     ORDER BY id`,
			[user.id]
		);
		user.listings = listingsResult.rows;

		const bookingsResult = await db.query(
			`SELECT id, owner_id, renter_id, listing_id, created_at
         FROM bookings
        WHERE renter_id = $1
     ORDER BY id`,
			[user.id]
		);
		user.bookings = bookingsResult.rows;

		const conversationsResult = await db.query(
			`SELECT id, renter_id, owner_id, listing_id
		  	 FROM conversations
				WHERE owner_id = $1 OR renter_id = $1
		 ORDER BY id`,
			[user.id]
		);
		user.conversations = conversationsResult.rows;

		return user;
	}

	/**
	 * Update user data with provided fields (partial update).
	 * @param {number} username - The username of the user to update.
	 * @param {Object} data - Data to update: { firstName, lastName, password, email }
	 * @returns {Object} Updated user data: { id, username, firstName, lastName, email }
	 * @throws {NotFoundError} If user not found.
	 */
	static async update(username, data) {
		// If password is being updated, hash it
		if (data.password) {
			data.password = await bcrypt.hash(data.password, BCRYPT_WORK_FACTOR);
		}

		const { setCols, values } = sqlForPartialUpdate(data, {
			firstName: 'first_name',
			lastName: 'last_name',
		});

		const usernameVarIndex = '$' + (values.length + 1);

		const querySql = `
			UPDATE users
				 SET ${setCols}
			 WHERE username = ${usernameVarIndex}
	 RETURNING id,
						 first_name AS "firstName",
						 last_name AS "lastName",
						 email`;

		const result = await db.query(querySql, [...values, username]);
		const user = result.rows[0];

		if (!user) throw new NotFoundError(`No user: ${username}`);

		delete user.password;
		return user;
	}

	/**
	 * Delete user by username; returns undefined.
	 * @param {string} username - The username of the user to delete.
	 * @throws {NotFoundError} If user not found.
	 */
	static async remove(username) {
		const result = await db.query(
			`DELETE
         FROM users
        WHERE username = $1
    RETURNING username`,
			[username]
		);
		const user = result.rows[0];

		if (!user) throw new NotFoundError(`No user: ${username}`);
	}
}

module.exports = User;
