import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext';

export function FollowingList() {
  const { token } = useContext(AuthContext);
  const [following, setFollowing] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!token) {
      setError('User not authenticated');
      setLoading(false);
      return;
    }
    const fetchFollowing = async () => {
      try {
        const response = await fetch('https://socialmedia-backend-ipwx.onrender.com/api/follows/following/', {
          headers: {
            'Authorization': 'Token ' + token,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setFollowing(data);
          setError(null);
        } else {
          setError('Failed to fetch following list');
        }
      } catch (err) {
        setError('Error fetching following list');
      } finally {
        setLoading(false);
      }
    };
    fetchFollowing();
  }, [token]);

  if (loading) {
    return <div>Loading following list...</div>;
  }

  if (error) {
    return <div style={{ color: 'red' }}>{error}</div>;
  }

  if (following.length === 0) {
    return <div>You are not following any users.</div>;
  }

  return (
    <div>
      <h3>Users You Are Following</h3>
      <ul>
        {following.map(user => (
          <li key={user.id}>{user.username}</li>
        ))}
      </ul>
    </div>
  );
}