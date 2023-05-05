'use strict';

/** Routes for Listings */

const jsonschema = require('jsonschema');
const express = require('express');

const { BadRequestError } = require('../expressError');
const { ensureAdmin } = require('../middleware/auth');
const Listing = require('../models/listing');

const listingNewSchema = require('../schemas/listingNew.json');
const listingUpdateSchema = require('../schemas/listingUpdate.json');
const listingSearchSchema = require('../schemas/listingSearch.json');

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

/** GET /[listingId] => { listing }
 *
 * Get a listing by Id
 *
 */

router.get('/:id', async function (req, res, next) {
	const listing = await Listing.get(req.params.id);

	// const validator = jsonschema.validate(q, listingSearchSchema, {
	//   required: true,
	// });
	// if (!validator.valid) {
	//   const errs = validator.errors.map((e) => e.stack);
	//   throw new BadRequestError(errs);
	// }

	return res.json({ listing });
});

/** PATCH /[listingId]  { fld1, fld2, ... } => { listing }
 *
 * Data can include:
 *
 * Update an existing listing
 *
 * Authorization required: admin
 */

router.patch('/:id', async function (req, res, next) {
	const validator = jsonschema.validate(req.body, listingUpdateSchema, {
		required: true,
	});
	if (!validator.valid) {
		const errs = validator.errors.map(e => e.stack);
		throw new BadRequestError(errs);
	}

	const job = await Listing.update(req.params.id, req.body);
	return res.json({ job });
});

/** DELETE /:id  =>  { deleted: id }
 *
 * Delete a listing by id
 *
 */

router.delete('/:id', async function (req, res, next) {
	await Listing.remove(req.params.id);
	return res.json({ deleted: +req.params.id });
});

module.exports = router;
