import React, { useState, useEffect, useContext } from 'react'
import { AuthContext } from '../contexts/AuthContext'
import { Avatar, AvatarImage } from './ui/avatar';
import { Card, CardContent, CardTitle, CardHeader } from './ui/card';
import { Label } from './ui/label';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { BiSolidLike } from "react-icons/bi";
import { BiCommentDetail } from "react-icons/bi";
import { ShareIcon } from '@heroicons/react/24/solid';
import { IoCloseSharp } from "react-icons/io5";
import { FollowButton } from './ui/FollowButton';
import API_BASE_URL from "../lib/apiConfig.js";

export default function Post(props) {
  const { token, user } = useContext(AuthContext)
  console.log("User object in Post.jsx:", user);
  const hideUserInfo = props.hideUserInfo;
  const [posts, setPosts] = useState([]);
  const [visibleComments, setVisibleComments] = useState({});
  const [commentInputs, setCommentInputs] = useState({});
  const [comments, setComments] = useState({});
  const [likedPosts, setLikedPosts] = useState({});

  useEffect(() => {
    const fetchPosts = async () => {
      if (!token) return;
      try {
        // Remove author_id param to avoid sending undefined
        const response = await fetch(`${API_BASE_URL}/api/posts/`, {
          headers: {
            'Authorization': `Token ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch posts");
        }
        const data = await response.json();

        const likesResponse = await fetch(`${API_BASE_URL}/api/likes/`, {
          headers: {
            'Authorization': `Token ${token}`,
          },
        });
        if (!likesResponse.ok) {
          throw new Error("Failed to fetch likes");
        }
        const likesData = await likesResponse.json();
        const likedPostIds = {};
        likesData.forEach(like => {
          likedPostIds[like.post] = true;
        });

        setLikedPosts(likedPostIds);
        setPosts(data);
      } catch (error) {
        console.error("Error fetching posts or likes:", error);
      }
    };
    fetchPosts();
  }, [token]);

  const toggleComments = async (postId) => {
    if (!visibleComments[postId]) {
      // Fetch comments for the post when opening comments section
      try {
        const response = await fetch(`${API_BASE_URL}/api/comments/?post=${postId}`, {
          headers: {
            'Authorization': `Token ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error('Failed to fetch comments');
        }
        const data = await response.json();
        setComments((prev) => ({
          ...prev,
          [postId]: data,
        }));
      } catch (error) {
        console.error('Error fetching comments:', error);
      }
    }
    setVisibleComments((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }));
  };

  const handleCommentChange = (postId, value) => {
    setCommentInputs((prev) => ({
      ...prev,
      [postId]: value,
    }));
  }; 

  const handleCommentSubmit = async (postId) => {
    const comment = commentInputs[postId];
    if (!comment) return;
    try {
      const response = await fetch(`${API_BASE_URL}/api/comments/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Token ${token}`,
        },
        body: JSON.stringify({
          post: postId,
          text: comment,
        }),
      });
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Comment submission error response:", errorText);
        throw new Error("Failed to submit comment");
      }
      const newComment = await response.json();
      setComments((prev) => ({
        ...prev,
        [postId]: prev[postId] ? [newComment, ...prev[postId]] : [newComment],
      }));
      setCommentInputs((prev) => ({
        ...prev,
        [postId]: '',
      }));
    } catch (error) {
      console.error("Error submitting comment:", error);
    }
  };

  if (!posts.length) {
    return <div>No posts available</div>;
  }

  return (
    <>
      <div className="my-[1em]" >
        {posts.map((post) => (
          <div key={post.id} style={{height: '40%', width: '35%', margin: '1em  auto ', border: '1px solid #340087', borderRadius: '0.4em', /*backgroundColor: '#F7F7F8'*/ backgroundColor: '#200054' }}>
            <div className='flex flex-row justify-start items-center w-[100%]' >
              {!hideUserInfo && (
                <>
                  <Avatar square="true" className="mx-auto my-[0.5%]"  >
                    <AvatarImage src="/Profile-Photo.jpeg" alt="Profile" style={{ width: '6rem', height: '6rem' }} />
                  </Avatar>
                  <div className='flex flex-row justify-between items-start mx-auto' style={{ height: '100px', width: '43rem' }}>
                    <div className="flex flex-col justify-center">
                      <div className='ml-[2%] font-bold text-[2rem]'><span className='text-2xl w- ml-[2%]'>{post.author_username || "Anonymous"}</span></div>
                      <span className='text-[1em] w- mt-[10%] ml-[4%]' style={{ color: 'rgba(255, 248, 255, 0.67)' }}>{post.gender || "PNTS"} | {post.age || "?"}</span>
                    </div>

                    <div className='flex flex-row justify-between items-center w-full'>
                      <div className='ml-[2%]'>
                      </div>
                      <div className='mr-[0 %] flex flex-col justify-between items-end my-auto' style={({ width: '200px',height : '80px', color: 'rgba(255, 248, 255, 0.67)' })}>
                        <span className='text-[0.9em] mt-[2%] mr-[10%]'>{new Date(post.created_at).toLocaleDateString()}</span>
                        {/* <span className='text-muted ml-1'>{new Date(post.timestamp).toLocaleTimeString()}</span> */}
                        {user && post.author !== user.id && <FollowButton userId={post.author} style={{backgroundColor: '#1f1e1eff'}}/>}
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
            <Card style={{ marginBottom: '10px', backgroundColor: "#330087"}}>
              <CardHeader className="text-center text-inidigo-600" style={{ marginTop: '20px', backgroundColor: '#330087 !important' }}>
                
              </CardHeader>
              <CardContent className="overflow-hidded block rounded-lg" style={{backgroundColor: '#330087' , marginTop: '0px 0px', padding: '0px'}}>
                <Label className="overflow-hidden">
                  {post.image && <img className='w-5/6 mx-auto my-[2%] block overflow-hidden object-cover' src={post.image} style={{ height: 'auto', width: '100%' }} alt="" />}

                </Label>
                <div style={{backgroundColor: '#200054',borderRadius: '0.5rem', margin: "1rem 1rem", padding: '0.5rem', color: '#5A8DB2'}} >
                  <h3 style={{margin: '0.3rem 1rem', color: '#ffffff'}}>{post.title}</h3>
                  <p style={{marginTop:'1rem', fontSize: '0.8rem', color: '#9f9f9fff'}}>
                    {post.content}
                  </p>
                </div>
              </CardContent>
            </Card>
            <div className="flex justify-around align-center mx-auto w-[100%]" style={{  padding: '18px 0px', borderRadius: '0.25rem', backgroundColor: '#330087' }}>
              <button
                style={{ backgroundColor: '#1f2b2dff', display: 'flex', alignItems: 'center', gap: '6px' }}
                onClick={() => handleLikeToggle(post)}
              >
                <BiSolidLike style={{ width: 26, height: 26, color: likedPosts[post.id] ? '#ff0000' : '#F7F7F8' }} />
                <span style={{ color: '#F7F7F8', fontWeight: 'bold' }}>{post.likes_count || 0}</span>
              </button>
              <button style={{ backgroundColor: '#1f2b2dff' }} onClick={() => toggleComments(post.id)}>
                <label htmlFor="Comment"><BiCommentDetail style={{ width: 26, height: 26, color: '#F7F7F8' }} /></label>
                <span style={{ color: '#F7F7F8', fontWeight: 'bold' }}>{post.comments_count || 0}</span>
              </button>
              <button style={{ backgroundColor: '#1f2b2dff' }}>
                <label htmlFor="share"><ShareIcon style={{ width: 26, height: 26, color: '#F7F7F8' }} /></label>
              </button>
            </div>
            {visibleComments[post.id] && (
              <div style={{ maxHeight: '28rem', overflowY: 'auto', border: '1px solid #CDB384', marginTop: '10px', padding: '10px', borderRadius: '8px', backgroundColor: '#A3AEA2' }}>
                <div className="flex flex-row justify-between items-center">
                  <span className='text-[1rem]' style={{ color: '#1f2b2dff' }}>
                    Comments
                  </span>
                  <div> <button onClick={() => toggleComments(post.id)}><IoCloseSharp style={{ width: '0.8rem', height: '0.8rem', color: '#CDB384' }} /></button></div>
                </div>
                <hr className='w-[96%] mx-auto' style={{ color: '#CDB384' }} />
                <div className="flex justify-around">
                  <Input
                    type="text"
                    placeholder="Add a comment..."
                    value={commentInputs[post.id] || ''}
                    onChange={(e) => handleCommentChange(post.id, e.target.value)}
                    className="w-[70rem] p-2 rounded border border-gray-300"
                    style={{ width: '35rem', padding: '1rem' }}
                  />
                  <Button onClick={() => handleCommentSubmit(post.id)} className="mt-2" style={{ color: '#CDB384' }}>
                    Submit ✔️
                  </Button>
                </div>
                <hr />
                {comments[post.id] && comments[post.id].length > 0 ? (
                  comments[post.id].map((comment) => (
                    <div key={comment.id} style={{ marginBottom: '8px', borderBottom: '1px solid #ccc', paddingBottom: '4px', height: '5em', backgroundColor: '#60755A', borderRadius: '0.6em', padding: '0 1em 0 0' }}>
                      <div className="flex flex-row justify-between items-center">
                        <div className='w-[7em]'>
                          <Avatar square="true" className="mx-[0.5em] my-auto my-[10%]" style={{ marginTop: '0.4rem' }} >
                            <AvatarImage src="/Profile-Photo.jpeg" alt="Profile" style={{ width: '1.5em', height: '1.5em' }} />
                            <div className='ml-[8%]'>{comment.user_name}</div>
                          </Avatar>
                        </div>
                        <div className='text-[0.7em]' style={{ color: 'rgba(255, 248, 255, 0.67)', height: '1em' }}>
                          <span>{new Date(comment.timestamp).toLocaleDateString()}  |  {new Date(comment.timestamp).toLocaleTimeString().toUpperCase()}</span>
                        </div>
                      </div>
                      <p className='w-[85%] mx-auto my-[0%]' style={{ height: '0.5em', marginTop: '1rem' }}>
                        {comment.text}
                      </p>
                    </div>
                  ))
                ) : (
                  <p>No comments yet.</p>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </>
  )
};