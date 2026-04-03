import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../store/AuthContext';

export default function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">MO Marketplace</Link>
      </div>
      <div className="navbar-links">
        <Link to="/">Products</Link>
        {isAuthenticated ? (
          <>
            <Link to="/products/create">+ Add Product</Link>
            <span className="navbar-user">Hello, {user?.username}</span>
            <button onClick={handleLogout} className="btn btn-outline">Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register" className="btn btn-primary">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}
