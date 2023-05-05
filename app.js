// Description: Main entry point for the application

// Importing AWS SDK
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const { S3RequestPresigner } = require('@aws-sdk/s3-request-presigner');
const { createRequest } = require('@aws-sdk/util-create-request');
const { formatUrl } = require('@aws-sdk/util-format-url');
const { Upload } = require('@aws-sdk/lib-storage');

// Importing multer
const multer = require('multer');

// Importing express
const express = require('express');
const cors = require('cors');
const { config } = require('dotenv');

// Importing routes
const listingRoutes = require('./routes/listings');
const userRoutes = require('./routes/users');
const authRoutes = require('./routes/auth');

config();

// Initializing express
const app = express();

// MIDDLEWARE: CORS
app.use(cors());
app.use(express.json());

// MIDDLEWARE: Routes
app.use('/auth', authRoutes);
app.use('/listings', listingRoutes);
app.use('/users', userRoutes);

// AWS SDK Configuration
const s3Client = new S3Client({
	region: process.env.AWS_REGION,
	credentials: {
		accessKeyId: process.env.AWS_ACCESS_KEY_ID,
		secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
	},
});

// MIDDLEWARE: Handle File Uploads
const upload = multer();

// POST: /upload-image
app.post('/upload-image', upload.single('image'), async (req, res, next) => {
	console.log('req:', req.data);
	try {
		const file = req.file;
		console.log('file:', file);
		const key = Date.now().toString() + '_' + file.originalname;
		const bucketName = process.env.AWS_S3_BUCKET_NAME;

		// Upload the file to S3
		const upload = new Upload({
			client: s3Client,
			params: {
				Bucket: bucketName,
				Key: key,
				Body: file.buffer,
				ContentType: file.mimetype,
				ContentDisposition: 'inline',
			},
		});
		console.log('upload:', upload);
		await upload.done();

		// Generate a pre-signed URL for the uploaded file
		const presigner = new S3RequestPresigner(s3Client.config);
		const getObjectCommand = new PutObjectCommand({
			Bucket: bucketName,
			Key: key,
		});
		const request = await createRequest(s3Client, getObjectCommand);
		const imageUrl = formatUrl(request, presigner);

		//TODO: fix .replace to remove baseurl
		res.send({
			message: 'Image uploaded successfully',
			imageUrl: imageUrl.replace(process.env.BUCKET_BASE_URL, ''),
		});
	} catch (error) {
		res.status(500).send({
			message: 'An error occurred while uploading the image',
			error: error.message,
		});
	}
});

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