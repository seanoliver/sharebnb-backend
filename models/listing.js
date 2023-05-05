'use strict';
const db = require('../db');

const { sqlForPartialUpdate } = require('../helpers/sql');
const { NotFoundError } = require('../expressError');

const HOSTNAME = process.env.BUCKET_BASE_URL;

/** Listing
 *
 */
class Listing {
	static async create(data) {
		console.log("data:", data);
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
                      owner_id
                      )
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
				data.userId,
			]
		);
		const listing = result.rows[0];
			console.log("listing:", listing);
		const newPhoto = await db.query(
			`INSERT INTO photos (
        listing_id, photo_url
      )
      VALUES($1, $2)
      RETURNING
        id as photoId
        `,
			[listing.listingid, data.imageUrl]
		);
		listing.photos = newPhoto.rows[0];
		return listing;
	}

	/** Create WHERE clause for filters, to be used by functions that query
	 * with filters.
	 *
	 * searchFilters (all optional):
	 * - minPrice
	 * - maxPrice
	 * - genre
	 *
	 * Returns {
	 *  where: "WHERE minPrice >= $1 AND name ILIKE $2",
	 *  vals: [10000, '%pool%']
	 * }
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

	/** Find all listings (optional filter on searchFilters).
	 *
	 * searchFilters (all optional):
	 * - minPrice
	 * - maxPrice
	 * - genre
	 *
	 * Returns [{ listingId, name, description, price, street, city, state, zip, genre, ownerId }, ...]
	 * */

	static async findAll({ minPrice, maxPrice, genre } = {}) {
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

	/** Given a listing id, return data about listing.
	 *
	 * Returns { listingId, name, description, price, street, city, state, zip, genre, ownerId }
	 *
	 * Throws NotFoundError if not found.
	 **/

	static async get(id) {
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
        WHERE id = $1`,
			[id]
		);

		const listing = listingRes.rows[0];

		if (!listing) throw new NotFoundError(`No listing: ${id}`);
		const result = await db.query(
			`SELECT photo_url
        FROM photos
        WHERE listing_id = $1`,
			[listing.listingid]
		);
			const photoUrl = result.rows[0].photo_url;
			console.log("photoUrl:", photoUrl);
		listing.photoUrl = photoUrl;
		console.log("listing!!!:", listing);
		return listing;
	}

	/** Update listing data with `data`.
	 *
	 * This is a "partial update" --- it's fine if data doesn't contain
	 * all the fields; this only changes provided ones.
	 *
	 * Data can include: { name, description, price, street, city, state, zip, genre }
	 *
	 * Returns: { listingId, name, description, price, street, city, state, zip, genre, ownerId }
	 *
	 * Throws NotFoundError if not found.
	 */

	static async update(id, data) {
		const { setCols, values } = sqlForPartialUpdate(data, {});
		const idVarIdx = '$' + (values.length + 1);

		const querySql = `
        UPDATE listings
        SET ${setCols}
        WHERE id = ${idVarIdx}
        RETURNING id as listingId,
        name,
        description,
        price,
        street,
        city,
        state,
        zip,
        genre,
        owner_id as ownerId`;
		const result = await db.query(querySql, [...values, id]);
		const listing = result.rows[0];

		if (!listing) throw new NotFoundError(`No listing: ${id}`);

		return listing;
	}

	/** Delete given listing from database; returns undefined.
	 *
	 * Throws NotFoundError if company not found.
	 **/

	static async remove(id) {
		const result = await db.query(
			`DELETE
         FROM listing
         WHERE id = $1
         RETURNING id`,
			[id]
		);
		const listing = result.rows[0];

		if (!listing) throw new NotFoundError(`No listing: ${id}`);
	}
}


module.exports = Listing;
