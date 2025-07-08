import React, { useState } from 'react';
import { db, auth } from '../firebase/firebaseConfig';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import cloudinary from '../cloudinary';  // Correct the path to go one level up

import '../index.css';

const UploadItem = () => {
  const navigate = useNavigate();
  const user = auth.currentUser;

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('Electronics');
  const [contactNumber, setContactNumber] = useState(''); // Contact number field
  const [image, setImage] = useState(null); // Only one image allowed
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e) => {
    const selected = e.target.files[0]; // Allow only one image
    if (!selected) {
      setError('No image selected.');
      return;
    }
    setError('');
    setImage(selected);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return navigate('/login');
    if (!title || !description || !price || !image || !contactNumber) {
      setError('Please fill all fields and upload an image.');
      return;
    }

    // Validate price to ensure it's a number greater than 0
    if (isNaN(price) || price <= 0) {
      setError('Please enter a valid price.');
      return;
    }

    try {
      setLoading(true);

      // Upload the image to Cloudinary
      const formData = new FormData();
      formData.append('file', image);
      formData.append('upload_preset', 'uploadImg');  // Replace with your upload preset
      formData.append('cloud_name', 'dmybkmqs6');  // Replace with your Cloudinary Cloud Name

      const response = await fetch('https://api.cloudinary.com/v1_1/dmybkmqs6/image/upload', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      const imageUrl = result.secure_url;  // The URL of the uploaded image

      // Save item to Firestore
      await addDoc(collection(db, 'items'), {
        title,
        description,
        price: parseFloat(price), // Store price as a number
        category,
        contactNumber, // Store contact number
        imageUrl,
        sellerId: user.uid,
        sellerEmail: user.email,
        createdAt: serverTimestamp(),
      });

      navigate('/dashboard');
    } catch (err) {
      setError('Upload failed. Please try again.');
      console.error('Error during upload:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <img src="/logo.png" alt="NileMarket Logo" className="logo" />
      <div className="auth-box" style={{ maxWidth: '600px' }}>
        <h2>Upload Item for Sale</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Title of the Item"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <select value={category} onChange={(e) => setCategory(e.target.value)} required>
            <option value="Electronics">Electronics</option>
            <option value="Books">Books</option>
            <option value="Clothing">Clothing</option>
            <option value="Shoes">Shoes</option>
            <option value="Hostel Essentials">Hostel Essentials</option>
            <option value="Others">Snacks</option>
          </select>

          <textarea
            placeholder="Extended description (condition, location, extra info)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows="4"
            required
            style={{
              padding: '0.75rem',
              borderRadius: '8px',
              border: '1px solid #6A89A7',
              backgroundColor: '#BDDDFC',
              color: '#384959',
              resize: 'vertical',
            }}
          />

          <input
            type="number"
            placeholder="Price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />

          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            required
          />
          <small>Upload 1 image only</small>

          <input
            type="text"
            placeholder="Contact Number"
            value={contactNumber}
            onChange={(e) => setContactNumber(e.target.value)}
            required
          />

          <button type="submit" disabled={loading}>
            {loading ? 'Uploading...' : 'Upload for Sale'}
          </button>
          {error && <p style={{ color: 'red', fontSize: '0.9rem' }}>{error}</p>}
        </form>
      </div>
    </div>
  );
};

export default UploadItem;
