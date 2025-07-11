import React, { useState } from 'react';
import { auth, db } from '../firebase/firebaseConfig';
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth';
import { setDoc, doc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import '../index.css';

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'Student',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false); // State to handle success message
  const provider = new GoogleAuthProvider();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false); // Reset success state on form submission

    const { name, email, password, confirmPassword, role } = formData;

    // Password matching check
    if (password !== confirmPassword) {
      setError("Passwords don't match");
      return;
    }

    try {
      setLoading(true); // Show loading indicator
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Store user info in Firestore
      await setDoc(doc(db, 'users', user.uid), {
        name,
        email,
        role,
        createdAt: new Date(),
      });

      setSuccess(true); // Set success state after account creation
      setTimeout(() => {
        navigate('/'); // Redirect to the Login page after a short delay
      }, 2000); // Delay for 2 seconds to show the success message
    } catch (err) {
      setError(err.message); // Display error message if something goes wrong
    } finally {
      setLoading(false); // Hide loading indicator
    }
  };

  const handleGoogleSignup = async () => {
    setError('');
    setSuccess(false); // Reset success state for Google signup
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Save user info to Firestore
      await setDoc(doc(db, 'users', user.uid), {
        name: user.displayName,
        email: user.email,
        role: 'Prefer not to say',
        createdAt: new Date(),
      });

      setSuccess(true); // Set success state for Google signup
      setTimeout(() => {
        navigate('/dashboard'); // Redirect to the dashboard after 2 seconds
      }, 2000); // Delay for 2 seconds to show the success message
    } catch (err) {
      setError(err.message); // Display error message if something goes wrong
    }
  };

  return (
    <div className="auth-container">
      <img src="/logo.png" alt="NileMarket Logo" className="logo" />
      <div className="auth-box">
        <h2>Create Account</h2>
        <form onSubmit={handleSignup}>
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
          <select name="role" value={formData.role} onChange={handleChange} required>
            <option value="Student">Student</option>
            <option value="Staff">Staff</option>
            <option value="Prefer not to say">Prefer not to say</option>
          </select>
          <button type="submit" disabled={loading}>
            {loading ? 'Creating...' : 'Sign Up'}
          </button>
          <button type="button" onClick={handleGoogleSignup}>
            Sign up with Google
          </button>
          {error && <p style={{ color: 'red', fontSize: '0.9rem' }}>{error}</p>}
          {success && (
            <p style={{ color: 'green', fontSize: '0.9rem' }}>
              Account created successfully! Redirecting to Login...
            </p>
          )}
        </form>
        <div className="auth-footer">
          <p>
            Already have an account?{' '}
            <span
              style={{ color: '#6A89A7', cursor: 'pointer' }}
              onClick={() => navigate('/login')}
            >
              Login
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
