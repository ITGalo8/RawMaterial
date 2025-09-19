import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSignOutAlt } from 'react-icons/fa';
import './Logout.css';
import Api from '../../auth/Api'

const Logout = ({ onLogout }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      // Get refresh token before removing it
      const refreshToken = localStorage.getItem('refreshToken');
      
      // Clear all local storage items
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('userData');
      localStorage.removeItem('userId');

      // Make logout API call if refresh token exists
      if (refreshToken) {
        await Api.post(
          '/auth/logout',
          { refreshToken },
          { 
            withCredentials: true,
            headers: {
              'Content-Type': 'application/json'
            }
          }
        );
      }

      // Clear axios default headers
      delete Api.defaults.headers.common['Authorization'];
      
      // Navigate to login page
      navigate('Login', { replace: true });
      
      // Execute callback if provided
      if (typeof onLogout === 'function') {
        onLogout();
      }
      
    } catch (error) {
      console.error('Logout Error:', error);
      
      // Still proceed with client-side cleanup even if server logout fails
      navigate('/', { replace: true });
      
      if (typeof onLogout === 'function') {
        onLogout();
      }
    }
  };

  return (
    <div className="logout-container">
      <button 
        onClick={handleLogout} 
        className="logout-button"
        aria-label="Logout"
      >
        <FaSignOutAlt className="logout-icon" />
        <span>Logout</span>
      </button>
    </div>
  );
};

export default Logout;