"use strict";

/** Routes for Listings */

const jsonschema = require("jsonschema");
const express = require("express");

const { BadRequestError } = require("../expressError");
const { ensureAdmin } = require("../middleware/auth");
import Listing from "../models/listing";

const listingNewSchema = require("../schemas/listingNew.json");
const listingUpdateSchema = require("../schemas/listingUpdate.json");
const listingSearchSchema = require("../schemas/listingSearch.json");

const router = new express.Router();


/** POST / {listing} -> {listing}
 *
 * Add a new Listing
 *
 */
router.post("/", async function (req, res, next) {
  //TODO: validate:
  // const validator = jsonschema.validate(req.body, listingNewSchema, {
  //   required: true,
  // });
  // if (!validator.valid) {
  //   const errs = validator.errors.map((e) => e.stack);
  //   throw new BadRequestError(errs);
  // }
  // req.body.userId = res.local.userId; //or whereever it is stored
  const listing = await Listing.create(req.body);
  return res.status(201).json({ listing });
});


/** GET / -> [{listing}, ...]
 *
 *  Get all Listings
 *
 * Optional search query:
 *
 */
router.get("/", async function (req, res, next) {
  const q = req.query;

  const validator = jsonschema.validate(q, listingSearchSchema, {
    required: true,
  });
  if (!validator.valid) {
    const errs = validator.errors.map((e) => e.stack);
    throw new BadRequestError(errs);
  }

  const jobs = await Listing.findAll(q);
  return res.json({ jobs });
});


/** GET /[listingId] => { listing }
 *
 * Get a listing by Id
 *
 */

router.get("/:id", async function (req, res, next) {
  const listing = await Listing.get(req.params.id);

  const validator = jsonschema.validate(q, listingSearchSchema, {
    required: true,
  });
  if (!validator.valid) {
    const errs = validator.errors.map((e) => e.stack);
    throw new BadRequestError(errs);
  }

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

router.patch("/:id", ensureListingOwner, async function (req, res, next) {
  const validator = jsonschema.validate(req.body, listingUpdateSchema, {
    required: true,
  });
  if (!validator.valid) {
    const errs = validator.errors.map((e) => e.stack);
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

router.delete("/:id", ensureListingOwner, async function (req, res, next) {
  await Listing.remove(req.params.id);
  return res.json({ deleted: +req.params.id });
});

module.exports = router;
