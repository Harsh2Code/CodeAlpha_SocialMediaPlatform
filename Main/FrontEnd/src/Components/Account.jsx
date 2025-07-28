import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { Card, CardContent, CardTitle, CardHeader } from './ui/card';


const Account = () => {
  const { user, token } = useContext(AuthContext);
  const [posts, setPosts] = useState([]);
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [view, setView] = useState('posts'); // 'posts', 'followers', 'following'

  const [loadingPosts, setLoadingPosts] = useState(true);
  const [errorPosts, setErrorPosts] = useState(null);
  const [loadingFollowers, setLoadingFollowers] = useState(true);
  const [errorFollowers, setErrorFollowers] = useState(null);
  const [loadingFollowing, setLoadingFollowing] = useState(true);
  const [errorFollowing, setErrorFollowing] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      if (user && user.id) { // Ensure user and user.id are defined
        setLoadingPosts(true);
        setErrorPosts(null);
        try {
          const response = await fetch(`http://localhost:8000/api/posts/?author_id=${user.id}`, {
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
      }
    };

    const fetchFollowing = async () => {
      if (user) {
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
      }
    };

    fetchPosts();
    fetchFollowers();
    fetchFollowing();
  }, [user, token]);

  const renderContent = () => {
    switch (view) {
      case 'posts':
        if (loadingPosts) return <p>Loading posts...</p>;
        if (errorPosts) return <p className="text-red-500">Error loading posts: {errorPosts}</p>;
        return (
          <div>
            <h2 className="text-2xl font-bold mb-4">My Posts</h2>
            {posts.length > 0 ? (
              posts.map(post => (
                <div key={post.id} className="p-[1%] rounded-[1rem] mb-4" style={{backgroundColor: '#340087'}}>
                  <h3 className="text-xl font-[2em]">{post.title}</h3>
                  <p style={{color: '#A0C5EF'}}>{post.content}</p>
                </div>
              ))
            ) : (
              <p>You have no posts yet.</p>
            )}
          </div>
        );
      case 'followers':
        if (loadingFollowers) return <p>Loading followers...</p>;
        if (errorFollowers) return <p className="text-red-500">Error loading followers: {errorFollowers}</p>;
        return (
          <div>
            <h2 className="text-2xl font-bold mb-4">My Followers</h2>
            {posts.length > 0 ? (
              posts.map(post => (
                <div key={post.id} className="p-[1%] rounded-[1rem] mb-4" style={{backgroundColor: '#340087'}}>
                  <h3 className="text-xl font-[2em]">{post.title}</h3>
                  <p style={{color: '#A0C5EF'}}>{post.content}</p>
                </div>
              ))
            ) : (
              <p>You have no followers yet.</p>
            )}
          </div>
        );
      case 'following':
        if (loadingFollowing) return <p>Loading following...</p>;
        if (errorFollowing) return <p className="text-red-500">Error loading following: {errorFollowing}</p>;
        return (
          <div>
            <h2 className="text-2xl font-bold mb-4">I am Following</h2>
            {following.length > 0 ? (
              <ul  style={{backgroundColor: '#340087'}}>
                {following.map(followed => (
                  <li key={followed.id} className="p-[1rem] rounded-[1rem] mb-4" style={{color: '#A0C5EF'}}>
                    {followed.username}
                  </li>
                ))}
              </ul>
            ) : (
              <p>You are not following anyone.</p>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  if (!user) {
    return <div>Loading user data...</div>;
  }

  return (
    <div className="container mx-auto p-4 w-[80vw]">
      <div className="flex items-center mb-8">
        <img src={user.profile_picture_url || '/Profile-Photo.jpeg'} alt="Profile" className="w-24 h-24 rounded-full mr-8" />
        <div>
          <h1 className="text-3xl font-bold">{user.username}</h1>
          <p className="text-gray-600">{user.first_name} {user.last_name}</p>
          <p className="text-gray-600">{user.nationality}</p>
        </div>
      </div>

      <div className="flex justify-center my--[2rem]">
        <button onClick={() => setView('posts')} className={`px-[1rem] mx-auto my-[1em] py-[1rem] ${view === 'posts' ? 'border-b-[2] border-[blue]-500' : ''}`}>Posts</button>
        <button onClick={() => setView('followers')} className={`px-4 py-2 mx-auto my-[1em] ${view === 'followers' ? 'border-b-2 border-blue-500' : ''}`}>Followers</button>
        <button onClick={() => setView('following')} className={`px-4 py-2 mx-auto my-[1em] ${view === 'following' ? 'border-b-2 border-blue-500' : ''}`}>Following</button>
      </div>

      <div>
        <Card>
          <CardHeader>
            <CardTitle></CardTitle>
          </CardHeader>
          <CardContent>
            {renderContent()}
          </CardContent>
        </Card>


      </div>
    </div>
  );
};

export default Account;