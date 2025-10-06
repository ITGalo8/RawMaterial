import React from 'react';
import { useUser } from '../contexts/UserContext';
import './Navigation.css';

const Navigation = () => {
  const { user, logout } = useUser();

  return (
    <nav className="navbar">
      <div className="nav-brand">My App</div>
      
      <div className="nav-items">
        {user ? (
          <>
            <div className="user-info">
              <span className="user-greeting">
                Hello, {user.name} 
                <span className="user-role">({user.role})</span>
              </span>
              <button onClick={logout} className="logout-btn">
                Logout
              </button>
            </div>
          </>
        ) : (
          <a href="/login" className="login-link">Login</a>
        )}
      </div>
    </nav>
  );
};

export default Navigation;