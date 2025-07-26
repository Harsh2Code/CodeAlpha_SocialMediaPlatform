import React, { useState, useEffect } from 'react'
import { Avatar, AvatarImage } from '/src/Components/ui/avatar';
import { Card, CardContent, CardTitle, CardHeader } from '/src/Components/ui/card';
import { Label } from '/src/Components/ui/label';
import { Button } from '/src/Components/ui/button';
import { Input } from '/src/Components/ui/input';
import { BiSolidLike } from "react-icons/bi";
import { BiCommentDetail } from "react-icons/bi";
import { ShareIcon } from '@heroicons/react/24/solid';

export default function Post(props) {
  const hideUserInfo = props.hideUserInfo;
  const [posts, setPosts] = useState([]);
  const [visibleComments, setVisibleComments] = useState({});
  const [commentInputs, setCommentInputs] = useState({});
  const [comments, setComments] = useState({});

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/postslisttest/");
        if (!response.ok) {
          throw new Error("Failed to fetch posts");
        }
        const data = await response.json();
        setPosts(data);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };
    fetchPosts();
  }, []);

  const toggleComments = async (postId) => {
    if (!visibleComments[postId]) {
      // Fetch comments for the post when opening comments section
      try {
        const response = await fetch(`http://localhost:8000/api/comments/?post=${postId}`, {
          headers: {
            'Authorization': `Token ${props.token}`,
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

  const handleCommentSubmit = (postId) => {
    const comment = commentInputs[postId];
    if (!comment) return;
    // TODO: Implement comment submission logic (e.g., API call)
    console.log(`Submitting comment for post ${postId}: ${comment}`);
    // Clear input after submission
    setCommentInputs((prev) => ({
      ...prev,
      [postId]: '',
    }));
  };

  if (!posts.length) {
    return <div>No posts available</div>;
  }

  return (
    <>
    <div className= "my-[1em]"  >
      {posts.map((post) => (
        <div key={post.id}  style={{padding: "1em", width: '80%', margin: '1em auto' , border: '1px solid #6663f1', borderRadius: '0.8em'}}>
          <div className='flex flex-row justify-start items-center w-[100%]' style={{backgroundColor: 'rgba(95, 95, 95, 1)', padding: '18px 0px', borderRadius: '1rem'}}>
            {!hideUserInfo && (
              <>
                <Avatar square="true" className="mx-auto my-auto my-[20%]" style={{ marginTop: '1rem' }} >
                  <AvatarImage src="/Profile-Photo.jpeg" alt="Profile" style={{ width: '6rem', height: '6rem' }} />
                </Avatar>
                <div className='flex flex-row justify-between items-start mx-auto' style={{ height: '100px', width: '70%' }}>
                  <div className="flex flex-col justify-center">
                    <div className='ml-[2%] font-bold text-[2rem]'><span className='text-2xl w- ml-[2%]'>{post.user || "Anonymous"}</span></div>
                    <span className='text-[1em] w- mt-[10%] ml-[4%]' style={{color: 'rgba(255, 248, 255, 0.67)'}}>{post.gender || "PNTS"} | {post.age || "?"}</span>
                  </div>
                  
                  <div className='flex flex-row justify-between items-center w-full'>
                    <div className='ml-[2%]'>
                    </div>
                    <div className='mr-[0 %] flex flex-col items-end my-auto' style={({width: '200px',color: 'rgba(255, 248, 255, 0.67)'})}>
                      <span className='text-[0.9em] mt-[2%] mr-[10%]'>{new Date(post.timestamp).toLocaleDateString()}</span>
                      {/* <span className='text-muted ml-1'>{new Date(post.timestamp).toLocaleTimeString()}</span> */}
                      {post.user !== props.currentUser && <Button className="mt-[10%] mr-[10%]">Follow +</Button>}
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
          <Card style={{ marginBottom: '20px' }}>
            <CardHeader className="text-center text-inidigo-600" style={{ marginTop: '20px' }}>
              <CardTitle className="text-xl text-indigo-600" style={{ color: "#6663f1" }}>{post.content}</CardTitle>
            </CardHeader>
            <CardContent className="overflow-hidded block rounded-lg" >
              <Label className="overflow-hidden">
                {post.image_url && <img className='w-5/6 mx-auto my-auto rounded-[2%] block overflow-hidden object-cover' src={post.image_url} alt="" />}
              </Label>
              <p>
                {post.content}
              </p>
            </CardContent>
          </Card>
          <hr className='w-[95%]' style={{ border: '1px solid grey' }} />
          <div className="flex justify-between align-center w-5/6 mx-auto my-[3%]">
            <button>
              <label htmlFor="like"><BiSolidLike style={{ width: 26, height: 26, color: '#6366f1' }} /></label>
            </button>
            <button onClick={() => toggleComments(post.id)}>
              <label htmlFor="Comment"><BiCommentDetail style={{ width: 26, height: 26, color: '#6366f1' }} /></label>
            </button>
            <button>
              <label htmlFor="share"><ShareIcon style={{ width: 26, height: 26, color: '#6366f1' }} /></label>
            </button>
          </div>
          {visibleComments[post.id] && (
            <div style={{ maxHeight: '200px', overflowY: 'auto', border: '1px solid #6663f1', marginTop: '10px', padding: '10px', borderRadius: '8px' }}>
              {comments[post.id] && comments[post.id].length > 0 ? (
                comments[post.id].map((comment) => (
                  <div key={comment.id} style={{ marginBottom: '8px', borderBottom: '1px solid #ccc', paddingBottom: '4px' }}>
                    <strong>{comment.user}</strong>: {comment.text}
                  </div>
                ))
              ) : (
                <p>No comments yet.</p>
              )}
              <Input
                type="text"
                placeholder="Add a comment..."
                value={commentInputs[post.id] || ''}
                onChange={(e) => handleCommentChange(post.id, e.target.value)}
                className="w-full p-2 rounded border border-gray-300"
              />
              <Button onClick={() => handleCommentSubmit(post.id)} className="mt-2">
                Submit
              </Button>
            </div>
          )}
        </div>
      ))}
    </div>
    <hr style={{border: '1px solid white'}}/>
    </>
  )
};
