import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { Card, CardContent, CardTitle, CardHeader } from './ui/card';
import { Input } from './ui/input';


const Account = () => {
  const { user, token, updateUser } = useContext(AuthContext);
  const [posts, setPosts] = useState([]);
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [view, setView] = useState('posts'); // 'posts', 'followers', 'following'
  const [showProfilePictureInput, setShowProfilePictureInput] = useState(false);
  const [newProfilePictureUrl, setNewProfilePictureUrl] = useState('');
  const [showEditForm, setShowEditForm] = useState(false);
  const [editableUser, setEditableUser] = useState({
    first_name: '',
    last_name: '',
    username: '',
    nationality: '',
    date_of_birth: '',
    gender: '',
  });

  const [loadingPosts, setLoadingPosts] = useState(true);
  const [errorPosts, setErrorPosts] = useState(null);
  const [loadingFollowers, setLoadingFollowers] = useState(true);
  const [errorFollowers, setErrorFollowers] = useState(null);
  const [loadingFollowing, setLoadingFollowing] = useState(true);
  const [errorFollowing, setErrorFollowing] = useState(null);
  const [userInput, setUserInput] = useState('');

  useEffect(() => {
    if (user) {
      setEditableUser({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        username: user.username || '',
        nationality: user.nationality || '',
        date_of_birth: user.date_of_birth || '',
        gender: user.gender || '',
      });
    }
    const fetchPosts = async () => {
      if (user && user.id) { // Ensure user and user.id are defined
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
          const response = await fetch(`https://socialmedia-backend-ipwx.onrender.com/api/follows/followers/`, {
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
          const response = await fetch(`https://socialmedia-backend-ipwx.onrender.com/api/follows/following/`, {
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

  const handleProfilePictureUpdate = async (newUrl) => {
    try {
      console.log('Attempting to update profile picture with URL:', newUrl);
      const response = await fetch(`https://socialmedia-backend-ipwx.onrender.com/api/users/me/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${token}`,
        },
        body: JSON.stringify({ profile_picture: newUrl }),
      });

      console.log('API Response:', response);

      const responseText = await response.text(); // Read response body once

      if (!response.ok) {
        let errorData = {};
        try {
          errorData = JSON.parse(responseText); // Try to parse text as JSON
        } catch (e) {
          console.error('Error parsing error response as JSON:', e);
          errorData = { detail: responseText }; // Use raw text as detail if not JSON
        }
        console.error('API Error Response:', errorData);
        throw new Error(`HTTP error! status: ${response.status}, Message: ${errorData.detail || JSON.stringify(errorData)}`);
      }

      let updatedUser = {};
      try {
        updatedUser = JSON.parse(responseText); // Try to parse text as JSON
      } catch (e) {
        console.error('Error parsing success response as JSON:', e);
        throw new Error(`Failed to parse successful response as JSON. Raw response: ${responseText}`);
      }
      console.log('Raw responseText for profile picture update:', responseText);
      console.log('Parsed updatedUser for profile picture update:', updatedUser);
      
      updateUser(updatedUser); // Update user in AuthContext
      setShowProfilePictureInput(false);
    } catch (error) {
      console.error('Error updating profile picture:', error);
      alert('Failed to update profile picture.');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditableUser(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleEditSubmit = async () => {
    // Validate username format
    const usernameRegex = /^[a-zA-Z0-9._/+-]+$/;
    if (editableUser.username && !usernameRegex.test(editableUser.username)) {
      alert('Username can only contain letters, numbers, and "./+/-/_" characters.');
      return;
    }

    try {
      const response = await fetch(`https://socialmedia-backend-ipwx.onrender.com/api/users/${user.id}/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${token}`,
        },
        body: JSON.stringify(editableUser),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('API Error Response (Profile Update):', errorData);
        throw new Error(`HTTP error! status: ${response.status}, Message: ${errorData.detail || JSON.stringify(errorData)}`);
      }

      const updatedUser = await response.json();
      updateUser(updatedUser); // Update user in AuthContext
      setShowEditForm(false);
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile.');
    }
  };

  const renderContent = () => {
    switch (view) {
      case 'posts':
        if (loadingPosts) return <p>Loading posts...</p>;
        if (errorPosts) return <p className="text-red-500">Error loading posts: {errorPosts}</p>;
        return (
          <div>
            <h2 className="text-[1.5rem] font-bold mb-[4%]">My Posts</h2>
            {posts.length > 0 ? (
              posts.map(post => (
                <div key={post.id} className="p-[1%] rounded-[1rem] m-[4%]" style={{ backgroundColor: '#340087' }}>                  <p style={{ color: '#A0C5EF' }}>{post.content}</p>
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
            <h2 className="text-[1.5rem] font-bold mb-[4%]">My Followers</h2>
            {followers.length > 0 ? (
              <ul style={{ backgroundColor: '#340087' }}>
                {followers.map(follower => (
                  <li key={follower.id} className="p-[1rem] rounded-[1rem] m-[4%]" style={{ color: '#A0C5EF' }}>
                    {follower.username}
                  </li>
                ))}
              </ul>
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
            <h2 className="text-[1.5rem] font-bold mb-[4%]">I am Following</h2>
            {following.length > 0 ? (
              <ul style={{ backgroundColor: '#340087' }}>
                {following.map(followed => (
                  <li key={followed.id} className="p-[1rem] rounded-[1rem] m-[4%]" style={{ color: '#A0C5EF' }}>
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
        <img src={user.profile_picture || '/Profile-Photo.jpeg'} alt="Profile" className="w-[10rem] h-[10rem] rounded-full mr-8" />
        <button onClick={() => {
          const url = prompt("Please enter the URL for your new profile picture:");
          if (url) {
            handleProfilePictureUpdate(url);
          }
        }} className="ml-4 px-[1rem] py-2 bg-blue-500 text-white rounded " style={{ position: 'relative', left: '-3rem', top: '3rem', borderRadius: '50%', height: '2rem', width: '1rem', backgroundColor: '#18151ffb', color: '#646cff' }}>
          <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#646cff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-square-pen-icon lucide-square-pen my-auto" style={{ marginLeft: '-7px' }}>
            <path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
            <path d="M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z" />
          </svg>
        </button>
        
          <div style={
            {
              backgroundColor: 'white',
              background: 'transparent',
              backdropFilter: 'blur(10px)',
              color: '#d8d8d9',
              width: '100%',
              height: '100%',
              padding: '1rem',
              boxShadow: '8px -4px 10px #350087',
              borderRadius: '10px',
            }
          }>
            <h1 className="text-3xl font-bold">{user.username}</h1>
            <p className="text-gray-600">{user.first_name} {user.last_name}</p>
            <p className="text-gray-600">{user.nationality} | {user.date_of_birth}</p>
            <p className="text-gray-600">{user.gender}</p>
            <button onClick={() => setShowEditForm(!showEditForm)} className="mt-[2%] px-[2%] py-2 bg-blue-500 text-[#200057] bg-[#414141] focus:bg-[#313131] rounded" style={{borderRadius: '0.7rem', padding: '1rem 1.5rem', border: 'none', backgroundColor: '#353535ff', color: '#33084'}}>{showEditForm ? 'Cancel Edit' : 'Edit Profile'}</button>
          </div>
        </div>
        {/* ------------------------------------------------user Profile Editing section---------------------------------------------*/}
        {showEditForm && (
          <div className="mt-8 p-4 rounded" style={{ margin: '0.5rem 1rem', padding: '1rem 1rem', backgroundColor: '#200054', borderRadius: '1rem' }}>
            <h1 className="text-[1.5rem] my-[2%] text-center mx-auto font-bold mb-4">Edit Profile</h1>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="first_name">First Name:</label>
              <Input
                type="text"
                id="first_name"
                name="first_name"
                value={editableUser.first_name}
                onChange={handleChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-[#200057]" style={{borderRadius: '8rem', backgroundColor: '#3131313'}}
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="last_name">Last Name:</label>
              <Input
                type="text"
                id="last_name"
                name="last_name"
                value={editableUser.last_name}
                onChange={handleChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-[#200057]"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">Username:</label>
              <Input
                type="text"
                id="username"
                name="username"
                value={editableUser.username}
                onChange={handleChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-[#200057]" style={{borderRadius: '8rem', backgroundColor: '#3131313'}}
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="nationality">Nationality:</label>
              <Input
                type="text"
                id="nationality"
                name="nationality"
                value={editableUser.nationality}
                onChange={handleChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-[#200057]" style={{borderRadius: '8rem', backgroundColor: '#3131313'}}
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="date_of_birth">Date of Birth:</label>
              <Input
                type="date"
                id="date_of_birth"
                name="date_of_birth"
                value={editableUser.date_of_birth}
                onChange={handleChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-[#200057]" style={{borderRadius: '8rem', backgroundColor: '#3131313'}}
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="gender">Gender:</label>
              <Input
                type="text"
                id="gender"
                name="gender"
                value={editableUser.gender}
                onChange={handleChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline  text-[#200057]" style={{borderRadius: '8rem', backgroundColor: '#3131313'}}
              />
            </div>
            <button onClick={handleEditSubmit} className="block bg-[green]-500 hover:bg-green-700 text-white font-bold py-[2%] px-[4%] my-[2%] w-[90%] mx-auto rounded focus:outline-none focus:shadow-outline">Save Changes</button>
          </div>
        )}

        <div className="flex justify-center my--[2rem]">
          <button onClick={() => setView('posts')} className={`px-[1rem] mx-auto my-[1em] py-[1rem] ${view === 'posts' ? 'border-b-[2] border-[blue]-500' : ''}`} style={{borderRadius: '0.7rem', backgroundColor: '#353535ff',border: 'none', padding: '0.7rem 1.5rem', color : 'white'}} >Posts</button>
          <button onClick={() => setView('followers')} className={`px-4 py-2 mx-auto my-[1em] ${view === 'followers' ? 'border-b-2 border-blue-500' : ''}`} style={{borderRadius: '0.7rem', backgroundColor: '#353535ff',border: 'none', padding: '0.7rem 1.5rem', color : 'white'}} >Followers</button>
          <button onClick={() => setView('following')} className={`px-4 py-2 mx-auto my-[1em] ${view === 'following' ? 'border-b-2 border-blue-500' : ''}`} style={{borderRadius: '0.7rem', backgroundColor: '#353535ff',border: 'none', padding: '0.7rem 1.5rem', color : 'white'}} >Following</button>
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