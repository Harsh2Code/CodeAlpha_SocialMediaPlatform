import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext';

const FollowersList = () => {
  const { token } = useContext(AuthContext);
  const [followers, setFollowers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFollowers = async () => {
      if (!token) {
        setError('User not authenticated');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch('https://socialmedia-backend-iwpx.onrender.com/api/followers/', {
          headers: {
            'Authorization': `Token ${token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          setFollowers(data);
        } else {
          setError('Failed to fetch followers');
        }
      } catch (err) {
        setError('Error fetching followers');
      } finally {
        setLoading(false);
      }
    };

    fetchFollowers();
  }, [token]);

  if (loading) {
    return <div>Loading followers...</div>;
  }

  if (error) {
    return <div style={{ color: 'red' }}>{error}</div>;
  }

  return (
    <div>
      <h3>Followers</h3>
      {followers.length > 0 ? (
        <ul>
          {followers.map(follower => (
            <li key={follower.id}>{follower.username}</li>
          ))}
        </ul>
      ) : (
        <p>You have no followers yet.</p>
      )}
    </div>
  );
};

export default FollowersList;