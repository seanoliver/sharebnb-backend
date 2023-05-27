const pgp = require('pg-promise')();
const faker = require('faker');

const db = pgp({
	host: 'localhost',
	port: 5432,
	database: 'your_database_name',
	user: 'your_username',
	password: 'your_password',
});

async function populateData(n) {
	try {
		await db.tx(async t => {
			for (let i = 0; i < n; i++) {
				const username = `username${i}`;
				const firstName = faker.name.firstName();
				const lastName = faker.name.lastName();
				const password = faker.internet.password();
				const email = faker.internet.email();
				await t.none(
					'INSERT INTO users(username, first_name, last_name, password, email) VALUES($1, $2, $3, $4, $5)',
					[username, firstName, lastName, password, email]
				);
			}

			for (let i = 0; i < n; i++) {
				const name = `ListingName${i}`;
				const description = faker.lorem.paragraph();
				const price = faker.random.number({ min: 20, max: 100 });
				const street = faker.address.streetName();
				const city = faker.address.city();
				const state = faker.address.stateAbbr();
				const zip = faker.address.zipCode().substring(0, 5);
				const genre = faker.music.genre();
				const ownerId = faker.random.number({ min: 1, max: n });
				await t.none(
					'INSERT INTO listings(name, description, price, street, city, state, zip, genre, owner_id) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9)',
					[name, description, price, street, city, state, zip, genre, ownerId]
				);
			}

			for (let i = 0; i < n; i++) {
				const renterId = faker.random.number({ min: 1, max: n });
				const ownerId = faker.random.number({ min: 1, max: n });
				const listingId = faker.random.number({ min: 1, max: n });
				await t.none(
					'INSERT INTO conversations(renter_id, owner_id, listing_id) VALUES($1, $2, $3)',
					[renterId, ownerId, listingId]
				);
			}

			for (let i = 0; i < n; i++) {
				const conversationId = faker.random.number({ min: 1, max: n });
				const senderId = faker.random.number({ min: 1, max: n });
				const body = faker.lorem.sentences();
				await t.none(
					'INSERT INTO messages(conversation_id, sender_id, body) VALUES($1, $2, $3)',
					[conversationId, senderId, body]
				);
			}

			for (let i = 0; i < n; i++) {
				const ownerId = faker.random.number({ min: 1, max: n });
				const renterId = faker.random.number({ min: 1, max: n });
				const listingId = faker.random.number({ min: 1, max: n });
				await t.none(
					'INSERT INTO bookings(owner_id, renter_id, listing_id) VALUES($1, $2, $3)',
					[ownerId, renterId, listingId]
				);
			}

			for (let i = 0; i < n; i++) {
				const day = faker.date.future();
				const available = faker.random.boolean();
				const listingId = faker.random.number({ min: 1, max: n });
				const bookingId = faker.random.number({ min: 1, max: n });
				await t.none(
					'INSERT INTO bookable_days(day, available, listing_id, booking_id) VALUES($1, $2, $3, $4)',
					[day, available, listingId, bookingId]
				);
			}

			for (let i = 0; i < n; i++) {
				const listingId = faker.random.number({ min: 1, max: n });
				const photoUrl = faker.internet.url();
				await t.none(
					'INSERT INTO photos(listing_id, photo_url) VALUES($1, $2)',
					[listingId, photoUrl]
				);
			}
		});
	} catch (error) {
		console.error('ERROR:', error.message || error);
	}
}

populateData(10); // replace 10 with the number of rows you want for each table
