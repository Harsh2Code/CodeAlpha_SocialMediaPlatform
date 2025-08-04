import React, { useState, useEffect, useContext } from 'react';
import { Button } from './button';
import { AuthContext } from '../../contexts/AuthContext';

export function FollowButton({ userId }) {
  const { token } = useContext(AuthContext);
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log("FollowButton mounted with userId:", userId, "token:", token);
    if (!token || !userId) {
      console.log("Missing token or userId, skipping fetch");
      setLoading(false);
      return;
    }
    const fetchFollowStatus = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/follows/${userId}/status/`, {
          headers: {
            'Authorization': "Token " + token,
          },
        });
        if (response.ok) {
          const data = await response.json();
          console.log("Follow status response data:", data);
          setIsFollowing(data.is_following);
          setError(null);
        } else {
          const errorText = await response.text();
          console.error("Failed to fetch follow status, response not ok:", errorText);
          setError('Failed to fetch follow status: ' + errorText);
        }
      } catch (error) {
        console.error('Error fetching follow status:', error);
        setError('Error fetching follow status');
      } finally {
        setLoading(false);
      }
    };
    fetchFollowStatus();
  }, [token, userId]);

  function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
      const cookies = document.cookie.split(';');
      for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        // Does this cookie string begin with the name we want?
        if (cookie.substring(0, name.length + 1) === (name + '=')) {
          cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
          break;
        }
      }
    }
    return cookieValue;
  }

  const handleFollowToggle = async () => {
    if (!token || !userId) {
      console.log("Missing token or userId, cannot toggle follow");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const url = `${API_BASE_URL}/api/follows/${userId}/${isFollowing ? 'unfollow' : 'follow'}/`;
      console.log("Sending follow toggle request to:", url);
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': "Token " + token,
          'Content-Type': 'application/json',
        },
      });
      if (response.ok) {
        console.log("Follow toggle successful, updating state");
        setIsFollowing(!isFollowing);
      } else {
        const errorData = await response.json();
        console.error('Error toggling follow:', errorData.detail);
        setError(errorData.detail || 'Error toggling follow');
      }
    } catch (error) {
      console.error('Error toggling follow:', error);
      setError('Error toggling follow');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Button disabled>Loading...</Button>;
  }

  return (
    <>
      <Button onClick={handleFollowToggle} variant="secondry" style={{ backgroundColor: isFollowing ? '#353535ff' : '#2b1f64ff' , border: 'none', boxShadow: 'none', padding: ' 1rem 2.5rem',marginTop: '1.2rem' , borderRadius: '0.5rem', color: 'white' }}>
        {isFollowing ? 'Unfollow' : 'Follow'}
      </Button>
      {error && <div style={{ color: 'red', marginTop: '0.5em' }}>{error}</div>}
    </>
  );
}