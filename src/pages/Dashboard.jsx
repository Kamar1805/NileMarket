import React, { useState, useEffect } from 'react';
import '../index.css';
import { auth, db } from '../firebase/firebaseConfig';
import { signOut, onAuthStateChanged } from 'firebase/auth';
import { collection, onSnapshot, doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  const [items, setItems] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('recent');
  const [loading, setLoading] = useState(true);

  // Track auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
    });
    return () => unsubscribe();
  }, []);

  // Fetch and filter items
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'items'), (snapshot) => {
      const fetched = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toMillis?.() || Date.now(),
      }));

      // If user is logged in, hide items they removed
      const visibleItems = user
        ? fetched.filter(item => !item.removedBy?.includes(user.uid))
        : fetched;

      setItems(visibleItems);
      setFiltered(visibleItems);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]); // Re-run when user logs in/out

  // Apply search and sort
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

  const handleRemove = async (itemId) => {
    if (!user) {
      alert('Login required to remove an item.');
      return navigate('/login');
    }

    const itemRef = doc(db, 'items', itemId);

    if (window.confirm('Are you sure you want to remove this item from your dashboard?')) {
      try {
        await updateDoc(itemRef, {
          removedBy: arrayUnion(user.uid),
        });
        setFiltered((prev) => prev.filter(item => item.id !== itemId));
      } catch (error) {
        console.error('Error removing item:', error);
      }
    }
  };

  const handleView = (itemId) => {
    if (!user) {
      alert('Please login to view product details.');
      return navigate('/login');
    }
    navigate(`/view/${itemId}`);
  };

  const handleContact = (number) => {
    if (!user) {
      alert('Please login to contact the seller.');
      return navigate('/login');
    }
    alert(`Contact Buyer: ${number}`);
  };

  return (
    <div>
      {/* NAVBAR */}
      <nav className="nav-bar">
        <img src="/logon.png" alt="NileMarket Logo" className="logo" />
        <div className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
          ☰
        </div>
        <ul className={`nav-links ${menuOpen ? 'show' : ''}`}>
          <li onClick={() => navigate('/dashboard')}>Home</li>
          <li onClick={() => navigate('/AboutPage')}>About</li>
          {user && <li onClick={() => navigate('/upload')}>Sell Item</li>}
          {!user && <li onClick={() => navigate('/login')}>Login</li>}
          <li onClick={() => alert('My Profile page coming soon!')}>My Profile</li>
          {user && <li onClick={handleLogout}>Logout</li>}
        </ul>
      </nav>

      {/* SEARCH + FILTERS */}
      <div className="feed-container">
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
                {user && (
                  <button
                    onClick={() => handleRemove(item.id)}
                    className="remove-button"
                    aria-label="Not Interested"
                  >
                    ❌
                  </button>
                )}
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
                  onClick={() => handleContact(item.contactNumber)}
                  className="contact-button"
                >
                  Contact Buyer
                </button>
                <button
                  onClick={() => handleView(item.id)}
                  className="view-button"
                >
                  View Product
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-links">
            <a href="/about" className="footer-link">About Us</a>
            <a href="/contact" className="footer-link">Contact</a>
            <a href="/privacy" className="footer-link">Privacy Policy</a>
          </div>
        </div>
        <br /><br />
        <p>&copy; 2025 NileAnHub. All Rights Reserved.</p>
      </footer>
    </div>
  );
};

export default Dashboard;
