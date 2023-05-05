'use strict';

/** Routes for Listings */

const jsonschema = require('jsonschema');
const express = require('express');

const { BadRequestError, NotFoundError } = require('../expressError');
const { ensureAdmin } = require('../middleware/auth');
const Listing = require('../models/listing');

const listingNewSchema = require('../schemas/listingNew.json');
const listingUpdateSchema = require('../schemas/listingUpdate.json');
const listingSearchSchema = require('../schemas/listingSearch.json');

// Initialize router
const router = new express.Router();

/**
 * Add new listing.
 * @route POST /listings/
 * @param {Object} req - Request with new listing data.
 * @param {Object} res - Response object.
 * @param {Function} next - Next middleware.
 * @returns {Object} New listing object.
 * @throws {BadRequestError} If request body invalid.
 */
router.post('/', async function (req, res, next) {
	const validator = jsonschema.validate(req.body, listingNewSchema, {
		required: true,
	});

	if (!validator.valid) {
		const errs = validator.errors.map(e => e.stack);
		throw new BadRequestError(errs);
	}
	// req.body.userId = res.locals.userId;
	// TODO: Populate request body with res.locals.userId once validation is
	// enabled.

	const listing = await Listing.create(req.body);
	return res.status(201).json({ listing });
});

/**
 * Get all listings with optional search query.
 * @route GET /
 * @param {Object} req - Request with query parameters.
 * @param {Object} res - Response object.
 * @param {Function} next - Next middleware.
 * @returns {Array} Array of listings [{listing}, ...].
 * @throws {BadRequestError} If query params don't match listingSearchSchema.
 */
router.get('/', async function (req, res, next) {
	const q = req.query;

	// Parse price query params to integers.
	if (q.minPrice !== undefined) q.minPrice = parseInt(q.minPrice, 10);
	if (q.maxPrice !== undefined) q.maxPrice = parseInt(q.maxPrice, 10);

	const validator = jsonschema.validate(q, listingSearchSchema, {
		required: true,
	});

	if (!validator.valid) {
		const errs = validator.errors.map(e => e.stack);
		throw new BadRequestError(errs);
	}
	const listings = await Listing.findAll(q);
	return res.json({ listings });
});

/**
 * Get listing by ID.
 * @route GET /[listingId]
 * @param {Object} req - Request with listing ID in params.
 * @param {Object} res - Response object.
 * @param {Function} next - Next middleware.
 * @returns {Object} Listing: { listing }.
 */
router.get('/:id', async function (req, res, next) {
	const listing = await Listing.get(req.params.id);
	return res.json({ listing });
});

// TODO: Support adding and removing photos from a listing.

/**
 * Update existing listing.
 * @route PATCH /[listingId]
 * @param {Object} req - Request with listing ID in params and update data in body.
 * @param {Object} res - Response object.
 * @param {Function} next - Next middleware.
 * @returns {Object} Updated listing: { listing }.
 * @throws {BadRequestError} If request body doesn't match listingUpdateSchema.
 * @requires Authorization: owner
 */
router.patch('/:id', async function (req, res, next) {
	// TODO: Add validation for owner authorization: isListingOwner

	const validator = jsonschema.validate(req.body, listingUpdateSchema, {
		required: true,
	});

	if (!validator.valid) {
		const errs = validator.errors.map(e => e.stack);
		throw new BadRequestError(errs);
	}

	const listing = await Listing.update(req.params.id, req.body);
	return res.json({ listing });
});

/**
 * Delete listing by ID; returns { deleted: listingId }.
 * @route DELETE /:id
 * @param {Object} req - Request with listing ID in params.
 * @param {Object} res - Response object.
 * @param {Function} next - Next middleware.
 * @returns {Object} Deleted listing ID: { deleted: listingId }.
 * @throws {BadRequestError} If no listing ID provided.
 */
router.delete('/:id', async function (req, res, next) {
	// TODO: Add isAccountOwner middleware

	let listingId = req.params.id;

	if (!listingId) throw new BadRequestError('No listing ID provided');

	listingId = parseInt(listingId, 10);
	await Listing.remove(listingId);

	return res.json({ deleted: listingId });
});

module.exports = router;
