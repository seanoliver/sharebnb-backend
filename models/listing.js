'use strict';
const db = require('../db');

const { sqlForPartialUpdate } = require('../helpers/sql');
const { NotFoundError } = require('../expressError');

const HOSTNAME = process.env.BUCKET_BASE_URL;

/**
 * Represents a listing.
 */
class Listing {
	/**
	 * Create new listing.
	 * @route POST /listings
	 * @param {Object} data - Data for new listing:
	 *   { name, description, price, street, city, state, zip, genre, ownerId,
	 *     imageUrl (optional) }
	 * @returns {Object} Created listing:
	 *   { listingId, name, description, price, street, city, state, zip, genre,
	 *     ownerId, photos (optional) }
	 */
	static async create(data) {
		console.log('data:', data);
		const result = await db.query(
			`
    INSERT INTO listings (name,
                          description,
                          price,
                          street,
                          city,
                          state,
                          zip,
                          genre,
                          owner_id)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    RETURNING
        id as listingId,
        name,
        description,
        price,
        street,
        city,
        state,
        zip,
        genre,
        owner_id as ownerId
        `,
			[
				data.name,
				data.description,
				data.price,
				data.street,
				data.city,
				data.state,
				data.zip,
				data.genre,
				data.ownerId,
			]
		);

		const listing = result.rows[0];

		// Check if there is an image url
		// If so, insert into photos table
		// TODO: FYI to Huse that we are making image optional
		if (data.imageUrl) {
			const resultPhoto = await db.query(
				`INSERT INTO photos (
          listing_id, photo_url
        )
        VALUES($1, $2)
        RETURNING
          id as photoId
          `,
				[listing.listingid, data.imageUrl]
			);

			listing.photos = resultPhoto.rows[0];
		}

		return listing;
	}

	/**
	 * Create WHERE clause for filters used by query functions.
	 * @param {Object} searchFilters - Filters (optional): minPrice, maxPrice, genre.
	 * @returns {Object} WHERE clause and values:
	 *   { where: "WHERE minPrice >= $1 AND name ILIKE $2", vals: [10000, '%pool%'] }
	 */
	static _filterWhereBuilder({ minPrice, maxPrice, genre }) {
		let whereParts = [];
		let vals = [];

		if (minPrice !== undefined) {
			vals.push(minPrice);
			whereParts.push(`price >= $${vals.length}`);
		}

		if (maxPrice !== undefined) {
			vals.push(maxPrice);
			whereParts.push(`price <= $${vals.length}`);
		}

		if (genre !== undefined) {
			vals.push(`%${genre}%`);
			whereParts.push(`genre ILIKE $${vals.length}`);
		}

		const where =
			whereParts.length > 0 ? 'WHERE ' + whereParts.join(' AND ') : '';

		return { where, vals };
	}

	/**
	 * Find all listings with optional filters.
	 * @param {Object} searchFilters - Filters (optional): minPrice, maxPrice, genre.
	 * @returns {Array} Listings:
	 *   [{ listingId, name, description, price, street, city, state, zip, genre,
	 *      ownerId }, ...]
	 */
	static async findAll({ minPrice, maxPrice, genre } = {}) {
		// TODO: Add schema validation for minPrice, maxPrice, genre
		// TODO: Add validation for minPrice < maxPrice
		// TODO: Update genres in schema validator once we have a list of genres
		const { where, vals } = this._filterWhereBuilder({
			minPrice,
			maxPrice,
			genre,
		});

		const listingRes = await db.query(
			`
     SELECT id as listingId,
            name,
            description,
            price,
            street,
            city,
            state,
            zip,
            genre,
            owner_id as ownerId
        FROM listings
            ${where}`,
			vals
		);

		return listingRes.rows;
	}

	/**
	 * Get data about listing by ID.
	 * @param {number} listingId - The ID of the listing to retrieve.
	 * @returns {Object} Listing data:
	 *   { listingId, name, description, price, street, city, state, zip, genre, ownerId, photoUrl }
	 * @throws {NotFoundError} If listing not found.
	 */
	static async get(listingId) {
		const listingResult = await db.query(
			`
      SELECT id AS listingId,
             name,
             description,
             price,
             street,
             city,
             state,
             zip,
             genre,
             owner_id AS ownerId
        FROM listings
       WHERE id = $1`,
			[listingId]
		);

		const listing = listingResult.rows[0];

		if (!listing) throw new NotFoundError(`No listing: ${listingId}`);

		const photoResult = await db.query(
			`SELECT photo_url AS photoUrl
       FROM photos
      WHERE listing_id = $1`,
			[listing.listingId]
		);

		const photo = photoResult.rows[0];
		if (photo) listing.photoUrl = photo.photoUrl;

		return listing;
	}

	/**
	 * Update listing data with provided fields.
	 * This is a "partial update" - only changes provided fields.
	 * @param {number} listingId - The ID of the listing to update.
	 * @param {Object} data - Data to update:
	 *   { name, description, price, street, city, state, zip, genre }
	 * @returns {Object} Updated listing data:
	 *   { listingId, name, description, price, street, city, state, zip, genre, ownerId }
	 * @throws {NotFoundError} If listing not found.
	 */
	static async update(listingId, data) {
		const { setCols, values } = sqlForPartialUpdate(data, {});
		const idVarIdx = '$' + (values.length + 1);

		const querySql = `
    UPDATE listings
    SET ${setCols}
    WHERE id = ${idVarIdx}
    RETURNING id AS listingId,
              name,
              description,
              price,
              street,
              city,
              state,
              zip,
              genre,
              owner_id AS ownerId`;
		const result = await db.query(querySql, [...values, listingId]);
		const listing = result.rows[0];

		if (!listing) throw new NotFoundError(`No listing: ${listingId}`);

		return listing;
	}

	/**
	 * Delete listing from database; returns undefined.
	 * @param {number} listingId - The ID of the listing to delete.
	 * @throws {NotFoundError} If listing not found.
	 */
	static async remove(listingId) {
		const result = await db.query(
			`DELETE
       FROM listings
       WHERE id = $1
       RETURNING id`,
			[listingId]
		);

		const listing = result.rows[0];

		if (!listing) throw new NotFoundError(`No listing: ${listingId}`);
	}
}

module.exports = Listing;
