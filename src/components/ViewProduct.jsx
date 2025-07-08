import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { db } from "../firebase/firebaseConfig"; // Adjusted path to point to firebaseconfig.js
 // Ensure Firebase is initialized in this file
import { doc, getDoc } from 'firebase/firestore'; // Firestore functions
import './ViewProduct.css'; // Import custom styling for this component

const ViewProduct = () => {
  const { id } = useParams(); // Get the item ID from the URL (e.g., /view/:id)
  const [item, setItem] = useState(null);

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const docRef = doc(db, 'items', id); // Get the Firestore document for the item using the ID
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          setItem(docSnap.data()); // Save item data to state
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.error("Error fetching document: ", error);
      }
    };

    fetchItem();
  }, [id]); // Trigger the fetch whenever the ID changes

  if (!item) return <div>Loading...</div>; // Display loading message while fetching data

  return (
    <div className="view-product">
      <h1>{item.title}</h1>
      <div className="product-images">
        {item.images.map((image, index) => (
          <img key={index} src={image} alt={item.title} className="product-image" />
        ))}
      </div>
      <p>{item.description}</p>
      <p>Price: ${item.price}</p>
      <button className="back-button" onClick={() => window.history.back()}>Back to Dashboard</button>
    </div>
  );
};

export default ViewProduct;
