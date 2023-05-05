// Importing express
const express = require('express');

// Importing AWS SDK
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const { S3RequestPresigner } = require('@aws-sdk/s3-request-presigner');
const { createRequest } = require('@aws-sdk/util-create-request');
const { formatUrl } = require('@aws-sdk/util-format-url');
const { Upload } = require('@aws-sdk/lib-storage');

// Importing multer
const multer = require('multer');

// MIDDLEWARE: Handle File Uploads
const upload = multer();

// AWS SDK Configuration
const s3Client = new S3Client({
	region: process.env.AWS_REGION,
	credentials: {
		accessKeyId: process.env.AWS_ACCESS_KEY_ID,
		secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
	},
});

// Initialize router
const router = new express.Router();

/**
 * Upload an image to AWS S3 and return a pre-signed URL.
 * @route POST /upload-image
 * @param {Object} req - Request with image file in body.
 * @param {Object} res - Response object.
 * @param {Function} next - Next middleware.
 * @returns {Object} Response with message and imageUrl.
 * @throws {Error} If an error occurs during upload.
 */
router.post('/image', upload.single('image'), async (req, res, next) => {
  try {
    const file = req.file;
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


module.exports = router;
