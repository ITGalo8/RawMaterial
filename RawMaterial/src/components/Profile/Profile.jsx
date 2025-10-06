// components/Profile.js
import React from 'react';
import { useUser } from '../contexts/UserContext';
import './Profile.css';

const Profile = () => {
  const { user } = useUser();

  if (!user) {
    return <div>Please log in to view your profile.</div>;
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h2>Profile Information</h2>
      </div>
      
      <div className="profile-content">
        <div className="profile-avatar">
          <div className="avatar-circle">
            {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>
        </div>
        
        <div className="profile-details">
          <div className="detail-item">
            <label>Full Name:</label>
            <span>{user.name || 'Not provided'}</span>
          </div>
          
          <div className="detail-item">
            <label>Email:</label>
            <span>{user.email}</span>
          </div>
          
          <div className="detail-item">
            <label>Role:</label>
            <span className={`role-badge role-${user.role?.toLowerCase()}`}>
              {user.role}
            </span>
          </div>
          
          <div className="detail-item">
            <label>User ID:</label>
            <span>{user.id}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;