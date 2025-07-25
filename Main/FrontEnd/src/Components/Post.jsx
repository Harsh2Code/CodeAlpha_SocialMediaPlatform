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

  if (!posts.length) {
    return <div>No posts available</div>;
  }

  return (
    <div>
      {posts.map((post) => (
        <div key={post.id}>
          <div className='flex flex-row justify-start items-center'>
            {!hideUserInfo && (
              <>
                <Avatar square="true" className="mx-auto my-auto my-[20%]" style={{ marginTop: '1rem' }} >
                  <AvatarImage src="/Profile-Photo.jpeg" alt="Profile" style={{ width: '6rem', height: '6rem' }} />
                </Avatar>
                <div className='flex flex-col justify-center items-start mx-auto' style={{ height: '100px', width: '30vw', border: '2px solid white' }}>
                  <div className='ml-[2%] font-bold text-[2rem]'><span className='text-2xl w- ml-[2%]'>{post.user || "Anonymous"}</span></div>
                  <div className='flex flex-row justify-between items-center w-full'>
                    <div className='ml-[2%]'>
                      <span className='text-gray-700 ml-[2%]'>{new Date(post.timestamp).toLocaleDateString()}</span> |
                      <span className='text-muted ml-1'>{new Date(post.timestamp).toLocaleTimeString()}</span>
                    </div>
                    <div className='mr-[4%] my-auto'>
                      <Button>Follow +</Button>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
          <hr className='w-[95%]' style={{ border: '1px solid grey' }} />
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
            <button>
              <label htmlFor="Comment"><BiCommentDetail style={{ width: 26, height: 26, color: '#6366f1' }} /></label>
            </button>
            <button>
              <label htmlFor="share"><ShareIcon style={{ width: 26, height: 26, color: '#6366f1' }} /></label>
            </button>
          </div>
        </div>
      ))}
    </div>
  )
};
