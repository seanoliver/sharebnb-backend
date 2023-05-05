// Description: Main entry point for the application

// Importing express
const express = require('express');
const cors = require('cors');
const { config } = require('dotenv');
const { NotFoundError } = require('./expressError');

// Importing routes
const listingRoutes = require('./routes/listings');
const userRoutes = require('./routes/users');
const authRoutes = require('./routes/auth');
const uploadRoutes = require('./routes/upload');

config();

// Initializing express
const app = express();

// MIDDLEWARE: CORS
app.use(cors());
app.use(express.json());

// MIDDLEWARE: Routes
app.use('/auth', authRoutes);
app.use('/upload', uploadRoutes);
app.use('/listings', listingRoutes);
app.use('/users', userRoutes);

/** Handle 404 errors -- this matches everything */
app.use(function (req, res, next) {
	throw new NotFoundError();
});

/** Generic error handler; anything unhandled goes here. */
app.use(function (err, req, res, next) {
	if (process.env.NODE_ENV !== 'test') console.error(err.stack);
	const status = err.status || 500;
	const message = err.message;

	return res.status(status).json({
		error: { message, status },
	});
});

module.exports = app;