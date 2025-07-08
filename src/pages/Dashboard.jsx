import React, { useState, useEffect } from 'react';
import '../index.css';
import { auth, db } from '../firebase/firebaseConfig';
import { signOut } from 'firebase/auth';
import { collection, onSnapshot, doc, updateDoc, arrayUnion } from 'firebase/firestore'; // Import necessary Firestore methods
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();
  const user = auth.currentUser;
  const [menuOpen, setMenuOpen] = useState(false);

  const [items, setItems] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('recent');
  const [loading, setLoading] = useState(true);
  const [confirmDelete, setConfirmDelete] = useState(null); // To store the item being deleted

  useEffect(() => {
    // Real-time listener using onSnapshot
    const unsubscribe = onSnapshot(collection(db, 'items'), (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toMillis?.() || Date.now(),
      }));
      setItems(data);
      setFiltered(data);
      setLoading(false); // Set loading to false when data is fetched
    });

    // Cleanup the listener when the component unmounts
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (items.length === 0) return;

    let results = [...items];

    if (searchTerm.trim()) {
      results = results.filter(item =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    switch (sortBy) {
      case 'lowest':
        results.sort((a, b) => a.price - b.price);
        break;
      case 'highest':
        results.sort((a, b) => b.price - a.price);
        break;
      default:
        results.sort((a, b) => b.createdAt - a.createdAt);
        break;
    }

    setFiltered(results);
  }, [searchTerm, sortBy, items]);

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/');
  };

  // Function to handle removal of an item
  const handleRemove = async (itemId) => {
    const itemRef = doc(db, 'items', itemId);

    // Show confirmation dialog before deleting
    if (window.confirm('Are you sure you want to delete this item from your dashboard?')) {
      try {
        // Update the Firestore document to mark the item as removed for the current user
        await updateDoc(itemRef, {
          removedBy: arrayUnion(user.uid),  // Add user ID to the "removedBy" array
        });
        // Optionally, update the UI to reflect the removal locally
        setFiltered((prevFiltered) => prevFiltered.filter(item => item.id !== itemId));
      } catch (error) {
        console.error('Error removing item:', error);
      }
    }
  };

  return (
    <div>
      {/* NAVBAR */}
      <nav className="nav-bar">
        <img src="/logo.png" alt="NileMarket Logo" className="logo" />
        <div className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
          ☰
        </div>
        <ul className={`nav-links ${menuOpen ? 'show' : ''}`}>
          <li onClick={() => navigate('/dashboard')}>Home</li>
          <li onClick={() => navigate('/AboutPage')}>About</li>
          {user && <li onClick={() => navigate('/upload')}>Sell Item</li>}
          <li onClick={() => alert('My Profile page coming soon!')}>My Profile</li>
          <li onClick={handleLogout}>Logout</li>
        </ul>
      </nav>

      {/* SEARCH + FILTERS */}
      <div className="feed-container">
        {/* SEARCH BAR */}
        <div className="search-wrapper">
          <div className="search-group">
            <input
              type="text"
              placeholder="Search for items..."
              className="search-bar"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button className="search-button">Search</button>
          </div>
        </div>

        {/* FILTER DROPDOWN */}
        <div className="filter-container">
          <label htmlFor="filter">Filter:</label>
          <select
            id="filter"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="recent">Recently Uploaded</option>
            <option value="lowest">Lowest Price</option>
            <option value="highest">Highest Price</option>
          </select>
        </div>

        {/* FEED */}
        {loading ? (
          <p style={{ textAlign: 'center' }}>Loading items...</p>
        ) : filtered.length === 0 ? (
          <p style={{ textAlign: 'center' }}>No items match your search.</p>
        ) : (
          <div className="item-grid">
            {filtered.map((item) => (
              <div key={item.id} className="item-card">
                <button
                  onClick={() => handleRemove(item.id)}
                  className="remove-button"
                  aria-label="Not Interested"
                >
                  ❌
                </button>
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="item-image"
                />
                <h3>{item.title}</h3>
                <p>
                  <strong>₦{item.price.toLocaleString()}</strong>
                </p>
                <p style={{ fontSize: '0.9rem' }}>
                  {item.description.slice(0, 80)}...
                </p>
                <p style={{ fontSize: '0.8rem', color: '#6A89A7' }}>
                  Seller: {item.sellerEmail}
                </p>
                <button
                  onClick={() => alert(`Contact Buyer: ${item.contactNumber}`)}
                  className="contact-button"
                >
                  Contact Buyer
                </button>
                <button
                  onClick={() => navigate(`/view/${item.id}`)}
                  className="view-button"
                >
                  View Product
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
