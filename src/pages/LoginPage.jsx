import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiRequest } from '../api/client.js';
import { useAuth } from '../providers/AuthProvider.jsx';
import dpoDpsBadge from '../assets/dpodps.png';

const roleRoute = {
  admin: '/admin',
  nurse: '/nurse',
  doctor: '/doctor'
};

const LoginPage = () => {
  const { login, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated && user) {
      navigate(roleRoute[user.role] || '/nurse', { replace: true });
    }
  }, [isAuthenticated, user, navigate]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await apiRequest('/api/auth/login', {
        method: 'POST',
        data: form
      });
      login(response);
      navigate(roleRoute[response.user.role], { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-layout">
      <div className="login-branding">
        <img src="/branding.jpeg" alt="MICU Branding" className="branding-image" />
      </div>
      <div className="login-panel">
        <img src="/logo.svg.png" alt="UP Seal" className="up-seal" />
        <div className="login-content">
          <h2 className="login-title">Welcome Back!</h2>
          <p className="login-subtitle">Please log in to your account</p>
          <form onSubmit={handleSubmit} className="login-form">
            <label className="login-label">
              Username
              <input
                className="login-input"
                value={form.username}
                onChange={(e) => setForm((prev) => ({ ...prev, username: e.target.value }))}
                placeholder="Enter your username"
              />
            </label>
            <label className="login-label">
              Password
              <input
                className="login-input"
                type="password"
                value={form.password}
                onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))}
                placeholder="Enter your password"
              />
            </label>
            {error && <p className="error">{error}</p>}
            <button className="btn-login" type="submit" disabled={loading}>
              {loading ? 'Signing in...' : 'Log In'}
            </button>
          </form>
          <div className="privacy-footer">
            <img src={dpoDpsBadge} alt="DPO/DPS Registered" className="privacy-badge" />
            <a href="#" className="privacy-link">
              UP Privacy Policy
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;


