import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

const UserProfile = () => {
  const { userId } = useParams();
  const { token } = useContext(AuthContext);
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [view, setView] = useState('posts'); // 'posts', 'followers', 'following'

  const [loadingUser, setLoadingUser] = useState(true);
  const [errorUser, setErrorUser] = useState(null);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [errorPosts, setErrorPosts] = useState(null);
  const [loadingFollowers, setLoadingFollowers] = useState(true);
  const [errorFollowers, setErrorFollowers] = useState(null);
  const [loadingFollowing, setLoadingFollowing] = useState(true);
  const [errorFollowing, setErrorFollowing] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      setLoadingUser(true);
      setErrorUser(null);
      try {
        const response = await fetch(`http://localhost:8000/api/users/${userId}/`, {
          headers: {
            'Authorization': `Token ${token}`
          }
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setUser(data);
      } catch (error) {
        console.error('Error fetching user:', error);
        setErrorUser(error.message);
      } finally {
        setLoadingUser(false);
      }
    };

    const fetchPosts = async () => {
      setLoadingPosts(true);
      setErrorPosts(null);
      try {
        const response = await fetch(`http://localhost:8000/api/posts/?author_id=${userId}`, {
          headers: {
            'Authorization': `Token ${token}`
          }
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setPosts(data);
      } catch (error) {
        console.error('Error fetching posts:', error);
        setErrorPosts(error.message);
      } finally {
        setLoadingPosts(false);
      }
    };

    const fetchFollowers = async () => {
      setLoadingFollowers(true);
      setErrorFollowers(null);
      try {
        const response = await fetch(`http://localhost:8000/api/follows/followers/`, {
          headers: {
            'Authorization': `Token ${token}`
          }
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setFollowers(data);
      } catch (error) {
        console.error('Error fetching followers:', error);
        setErrorFollowers(error.message);
      } finally {
        setLoadingFollowers(false);
      }
    };

    const fetchFollowing = async () => {
      setLoadingFollowing(true);
      setErrorFollowing(null);
      try {
        const response = await fetch(`http://localhost:8000/api/follows/following/`, {
          headers: {
            'Authorization': `Token ${token}`
          }
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setFollowing(data);
      } catch (error) {
        console.error('Error fetching following:', error);
        setErrorFollowing(error.message);
      } finally {
        setLoadingFollowing(false);
      }
    };

    fetchUser();
    fetchPosts();
    fetchFollowers();
    fetchFollowing();
  }, [userId, token]);

  const renderContent = () => {
    switch (view) {
      case 'posts':
        if (loadingPosts) return <p>Loading posts...</p>;
        if (errorPosts) return <p className="text-red-500">Error loading posts: {errorPosts}</p>;
        return (
          <div>
            <h2 className="text-2xl font-bold mb-4">Posts</h2>
            {posts.length > 0 ? (
              posts.map(post => (
                <div key={post.id} className="border p-4 rounded-lg mb-4">
                  <h3 className="text-xl font-bold">{post.title}</h3>
                  <p>{post.content}</p>
                </div>
              ))
            ) : (
              <p>This user has no posts yet.</p>
            )}
          </div>
        );
      case 'followers':
        if (loadingFollowers) return <p>Loading followers...</p>;
        if (errorFollowers) return <p className="text-red-500">Error loading followers: {errorFollowers}</p>;
        return (
          <div>
            <h2 className="text-2xl font-bold mb-4">Followers</h2>
            {followers.length > 0 ? (
              <ul>
                {followers.map(follower => (
                  <li key={follower.id} className="border p-4 rounded-lg mb-4">
                    {follower.username}
                  </li>
                ))}
              </ul>
            ) : (
              <p>This user has no followers yet.</p>
            )}
          </div>
        );
      case 'following':
        if (loadingFollowing) return <p>Loading following...</p>;
        if (errorFollowing) return <p className="text-red-500">Error loading following: {errorFollowing}</p>;
        return (
          <div>
            <h2 className="text-2xl font-bold mb-4">Following</h2>
            {following.length > 0 ? (
              <ul>
                {following.map(followed => (
                  <li key={followed.id} className="border p-4 rounded-lg mb-4">
                    {followed.username}
                  </li>
                ))}
              </ul>
            ) : (
              <p>This user is not following anyone.</p>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  if (loadingUser) {
    return <div>Loading user data...</div>;
  }

  if (errorUser) {
    return <div className="text-red-500">Error loading user: {errorUser}</div>;
  }

  if (!user) {
    return <div>User not found.</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex items-center mb-8">
        <img src={user.profile_picture_url || '/Profile-Photo.jpeg'} alt="Profile" className="w-24 h-24 rounded-full mr-8" />
        <div>
          <h1 className="text-3xl font-bold">{user.username}</h1>
          <p className="text-gray-600">{user.bio}</p>
        </div>
      </div>

      <div className="flex justify-center mb-8">
        <button onClick={() => setView('posts')} className={`px-4 py-2 ${view === 'posts' ? 'border-b-2 border-blue-500' : ''}`}>Posts</button>
        <button onClick={() => setView('followers')} className={`px-4 py-2 ${view === 'followers' ? 'border-b-2 border-blue-500' : ''}`}>Followers</button>
        <button onClick={() => setView('following')} className={`px-4 py-2 ${view === 'following' ? 'border-b-2 border-blue-500' : ''}`}>Following</button>
      </div>

      <div>
        {renderContent()}
      </div>
    </div>
  );
};

export default UserProfile;