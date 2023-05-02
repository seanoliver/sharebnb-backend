import AWS from 'aws-sdk';
import express from 'express';
import multer from 'multer';
import multers3 from 'multer-s3';

const app = express();

// Configure the AWS SDK
AWS.config.update({
  region: 'us-west-1',
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

// Create an S3 client
const s3 = new AWS.S3();

// Create a Multer middleware to handle file uploads
const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.AWS_S3_BUCKET_NAME,
    acl: 'public-read', // Set access control for the uploaded files
    key: function (req, file, cb) {
      cb(null, Date.now().toString() + '_' + file.originalname);
    }
  })
});

// Implement a route to upload an image to Amazon S3
app.post('/upload-image', upload.single('image'), (req, res) => {
  res.send({
    message: 'Image uploaded successfully',
    imageUrl: req.file.location
  });
});

// Start the Express server
app.listen(3000, () => {
  console.log('Express server is running on port 3000');
});