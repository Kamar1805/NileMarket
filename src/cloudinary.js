// src/cloudinary.js
import { Cloudinary } from 'cloudinary-core';

// Set up Cloudinary with your cloud name
const cloudinary = new Cloudinary({
  cloud_name: 'dmybkmqs6',  // Replace with your Cloud Name
  secure: true,  // Secure URLs for better performance
});

export default cloudinary;
