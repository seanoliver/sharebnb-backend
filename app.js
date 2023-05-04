import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { S3RequestPresigner } from "@aws-sdk/s3-request-presigner";
import { createRequest } from "@aws-sdk/util-create-request";
import { formatUrl } from "@aws-sdk/util-format-url";
import { Upload } from "@aws-sdk/lib-storage";
import express from "express";
import multer from "multer";
import { config } from "dotenv";
import cors from "cors";

// Bringing in dotenv variables
config();

const app = express();

// MIDDLEWARE: CORS
app.use(cors());

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
app.post("/upload-image", upload.single("image"), async (req, res) => {
  console.log("req:", req.data);
  try {
    const file = req.file;
    console.log("file:", file);
    const key = Date.now().toString() + "_" + file.originalname;
    const bucketName = process.env.AWS_S3_BUCKET_NAME;

    // Upload the file to S3
    const upload = new Upload({
      client: s3Client,
      params: {
        Bucket: bucketName,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
        ContentDisposition: "inline",
      },
    });
    console.log("upload:", upload);
    await upload.done();

    // Generate a pre-signed URL for the uploaded file
    const presigner = new S3RequestPresigner(s3Client.config);
    const getObjectCommand = new PutObjectCommand({
      Bucket: bucketName,
      Key: key,
    });
    const request = await createRequest(s3Client, getObjectCommand);
    const imageUrl = formatUrl(request, presigner);

    res.send({
      message: "Image uploaded successfully",
      imageUrl: imageUrl.replace(BUCKET_BASE_URL, ""),
    });
  } catch (error) {
    res.status(500).send({
      message: "An error occurred while uploading the image",
      error: error.message,
    });
  }
});

// Start the Express server
app.listen(3001, () => {
  console.log("Express server is running on port 3001");
});
