'use strict';

/** Convenience middleware to handle common auth cases in routes. */

const jwt = require('jsonwebtoken');
const { SECRET_KEY } = require('../config');
const { UnauthorizedError } = require('../expressError');

/**
 * Middleware to authenticate user using JWT token.
 * If a valid token is provided, store the token payload on res.locals.
 * No error if no token provided or token is invalid.
 * @param {Object} req - Request object.
 * @param {Object} res - Response object.
 * @param {Function} next - Next middleware.
 */
function authenticateJWT(req, res, next) {
	const authHeader = req.headers?.authorization;
	if (authHeader) {
		const token = authHeader.replace(/^[Bb]earer /, '').trim();
		try {
			res.locals.user = jwt.verify(token, SECRET_KEY);
		} catch (err) {
			// Ignore invalid tokens (but don't store user!)
		}
	}
	return next();
}

/**
 * Middleware to ensure user is logged in.
 * Raises Unauthorized error if user is not logged in.
 * @param {Object} req - Request object.
 * @param {Object} res - Response object.
 * @param {Function} next - Next middleware.
 * @throws {UnauthorizedError} If user is not logged in.
 */
function isLoggedIn(req, res, next) {
	if (res.locals.user?.username) return next();
	throw new UnauthorizedError();
}

/**
 * Middleware to ensure current user is account owner.
 * @param {Object} req - Request object with username in params.
 * @param {Object} res - Response object with user in locals.
 * @param {Function} next - Next middleware.
 * @throws {UnauthorizedError} If current user is not account owner.
 */
function isCorrectUser(req, res, next) {
  try {
    const user = res.locals.user;
    if (user.username === req.params.username) {
      return next();
    }
    throw new UnauthorizedError();
  } catch (err) {
    return next(err);
  }
}


/**
 * Middleware to ensure current user is the owner of the listing.
 */
function isListingOwner(req, res, next) {
  try {
    const user = res.locals.user;


/**
 * Middleware to confirm user is owner of listing
 */
// TODO: Test this.
function ensureListingOwner(req, res, next) {
	if (res.locals.user?.id === req.params.owner_id) return next();
	throw new UnauthorizedError();
}



module.exports = {
	authenticateJWT,
	isLoggedIn,
  isCorrectUser,
	// ensureAdmin,
	// ensureCorrectUserOrAdmin,
};
