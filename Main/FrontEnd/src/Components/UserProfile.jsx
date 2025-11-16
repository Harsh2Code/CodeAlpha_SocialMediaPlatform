import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext'; // Still needed for token
import { Card, CardContent, CardTitle, CardHeader } from './ui/card';

const UserProfile = ({ userId }) => {
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
    const fetchUserProfile = async () => {
      setLoadingUser(true);
      setErrorUser(null);
      try {
        const response = await fetch(`https://socialmedia-backend-ipwx.onrender.com/api/users/${userId}/`, {
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
        console.error('Error fetching user profile:', error);
        setErrorUser(error.message);
      } finally {
        setLoadingUser(false);
      }
    };

    if (userId && token) {
      fetchUserProfile();
    }
  }, [userId, token]);

  useEffect(() => {
    const fetchPosts = async () => {
      if (user && user.id) {
        setLoadingPosts(true);
        setErrorPosts(null);
        try {
          const response = await fetch(`https://socialmedia-backend-ipwx.onrender.com/api/posts/?author_id=${user.id}`, {
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
      }
    };

    const fetchFollowers = async () => {
      if (user) {
        setLoadingFollowers(true);
        setErrorFollowers(null);
        try {
          const response = await fetch(`https://socialmedia-backend-ipwx.onrender.com/api/follows/followers/?user_id=${user.id}`, {
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
      }
    };

    const fetchFollowing = async () => {
      if (user) {
        setLoadingFollowing(true);
        setErrorFollowing(null);
        try {
          const response = await fetch(`https://socialmedia-backend-ipwx.onrender.com/api/follows/following/?user_id=${user.id}`, {
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
      }
    };

    if (user) {
      fetchPosts();
      fetchFollowers();
      fetchFollowing();
    }
  }, [user, token]);

  const renderContent = () => {
    switch (view) {
      case 'posts':
        if (loadingPosts) return <p>Loading posts...</p>;
        if (errorPosts) return <p className="text-red-500">Error loading posts: {errorPosts}</p>;
        return (
          <div>
            <h2 className="text-[1.5rem] font-bold mb-[4%]">Posts</h2>
            {posts.length > 0 ? (
              posts.map(post => (
                <div key={post.id} className="p-[1%] rounded-[1rem] m-[4%]" style={{ backgroundColor: '#f7f7f7ff', borderRadius: '10px', color: 'black' }}>                  <p style={{ color: 'black' }}>{post.content}</p>
                </div>
              ))
            ) : (
              <p>No posts yet.</p>
            )}
          </div>
        );
      case 'followers':
        if (loadingFollowers) return <p>Loading followers...</p>;
        if (errorFollowers) return <p className="text-red-500">Error loading followers: {errorFollowers}</p>;
        return (
          <div>
            <h2 className="text-[1.5rem] font-bold mb-[4%]">Followers</h2>
            {followers.length > 0 ? (
              <ul style={{ backgroundColor: '#f7f7f7ff' }}>
                {followers.map(follower => (
                  <li key={follower.id} className="p-[1rem] m-[4%]" style={{ color: 'black', borderRadius: '16px' }}>
                    {follower.username}
                  </li>
                ))}
              </ul>
            ) : (
              <p>No followers yet.</p>
            )}
          </div>
        );
      case 'following':
        if (loadingFollowing) return <p>Loading following...</p>;
        if (errorFollowing) return <p className="text-red-500">Error loading following: {errorFollowing}</p>;
        return (
          <div>
            <h2 className="text-[1.5rem] font-bold mb-[4%]">Following</h2>
            {following.length > 0 ? (
              <ul style={{ backgroundColor: '#f7f7f7ff' }}>
                {following.map(followed => (
                  <li key={followed.id} className="p-[1rem] rounded-[1rem] m-[4%]" style={{ color: 'black', borderRadius: '2rem' }}>
                    {followed.username}
                  </li>
                ))}
              </ul>
            ) : (
              <p>Not following anyone.</p>
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
    return <div className="text-red-500">Error loading user profile: {errorUser}</div>;
  }

  if (!user) {
    return <div>User not found.</div>;
  }

  return (
    <div className="container mx-auto p-4 w-[80vw]">
      <div className="flex items-center mb-8">
        <img src={user.profile_picture || '/Profile-Photo.jpeg'} alt="Profile" className="w-[10rem] h-[10rem] rounded-full mr-8"  style={{ boxShadow: 'rgba(167, 167, 167, 0.79) 0px 1px 6px 5px'}}/>
        <div style={{
            backgroundColor: 'white',
            background: '#eaeaeaff',
            backdropFilter: 'blur(10px)',
            color: 'black',
            width: '100%',
            height: '100%',
            padding: '1rem',
            boxShadow: '8px -4px 10px #a7a7a7ff',
            borderRadius: '10px',
          }}>
            <h1 className="text-3xl font-bold">{user.username}</h1>
            <p className="text-gray-600">{user.first_name} {user.last_name}</p>
            <p className="text-gray-600">{user.nationality} | {user.date_of_birth}</p>
            <p className="text-gray-600">{user.gender}</p>
          </div>
        </div>

        <div className="flex justify-center my--[2rem]">
          <button onClick={() => setView('posts')} className={`px-[1rem] mx-auto my-[1em] py-[1rem] ${view === 'posts' ? 'border-b-[2] border-[blue]-500' : ''}`}>Posts</button>
          <button onClick={() => setView('followers')} className={`px-4 py-2 mx-auto my-[1em] ${view === 'followers' ? 'border-b-2 border-blue-500' : ''}`}>Followers</button>
          <button onClick={() => setView('following')} className={`px-4 py-2 mx-auto my-[1em] ${view === 'following' ? 'border-b-2 border-blue-500' : ''}`}>Following</button>
        </div>

        <div>
          <Card style={{backgroundColor: '#eaeaeaff', borderRadius: '1rem'}}>
            <CardHeader>
              <CardTitle></CardTitle>
            </CardHeader>
            <CardContent className="bg-[#eaeaeaff]" style={{backgroundColor: '#eaeaeaff', color: 'black', padding: '0 1rem', borderRadius: '1rem', boxShadow: 'rgba(51, 51, 51, 0.79) 0px 4px 12px -12px'}}>
              {renderContent()}
            </CardContent>
          </Card>
        </div>
      </div>
  );
};

export default UserProfile;