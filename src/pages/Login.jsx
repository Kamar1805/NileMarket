import React, { useState } from 'react';
import { auth, db } from '../firebase/firebaseConfig';
import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';  // Import Link for navigation
import '../index.css';

const Login = () => {
  const navigate = useNavigate();
  const provider = new GoogleAuthProvider();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError('');
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Check if user already exists in Firestore
      const userRef = doc(db, 'users', user.uid);
      const docSnap = await getDoc(userRef);

      if (!docSnap.exists()) {
        // New user, add to Firestore
        await setDoc(userRef, {
          name: user.displayName,
          email: user.email,
          role: 'Prefer not to say',
          createdAt: new Date(),
        });
      }

      navigate('/');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="auth-container">
      <img src="/NILEANHUB.png" alt="NileMarket Logo" className="logo" />
      <div className="auth-box">
        <h2>Login to NileMarket</h2>
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
          <button type="button" onClick={handleGoogleLogin}>
            Login with Google
          </button>
          {error && <p style={{ color: 'red', fontSize: '0.9rem' }}>{error}</p>}
        </form>

        {/* Sign Up Link */}
        <div className="sign-up-link">
          <p>
            Don't have an account?{' '}
            <Link to="/signup" style={{ color: '#6A89A7' }}>Sign Up</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
