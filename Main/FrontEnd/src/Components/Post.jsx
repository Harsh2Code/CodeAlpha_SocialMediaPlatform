import React from 'react'
import { Avatar, AvatarImage } from '/src/Components/ui/avatar';
import { Card, CardContent, CardTitle, CardHeader } from '/src/Components/ui/card';
import { Label } from '/src/Components/ui/label';
import { Button } from '/src/Components/ui/button';
import { Input } from '/src/Components/ui/input';
import { BiSolidLike } from "react-icons/bi";
import { BiCommentDetail } from "react-icons/bi";
import { ShareIcon } from '@heroicons/react/24/solid';


export default function Post() {
  return (
    <div>
        <div className='flex flex-row justify-start items-center'>
        <Avatar square="true" className="mx-auto my-auto my-[20%]" style={{ marginTop: '1rem' }} >
          <AvatarImage src="/Profile-Photo.jpeg" alt="Profile" style={{ width: '6rem', height: '6rem' }} />
        </Avatar>
        <div className='flex flex-col justify-center items-start mx-auto' style={{ height: '100px', width: '30vw', border: '2px solid white' }}>
          <div className='ml-[2%] font-bold text-[2rem]'><span className='text-2xl w- ml-[2%]'>Name_Here </span></div>
          <div className='flex flex-row justify-between items-center w-full'>
            <div className='ml-[2%]'>
              <span className='text-gray-700 ml-[2%]'>Date here</span> |
              <span className='text-muted ml-1'>Day Here</span>
            </div>
            <div className='mr-[4%] my-auto'>
              <Button>Follow +</Button>
            </div>

          </div>
        </div>
      </div>
      <hr className='w-[95%]' style={{ border: '1px solid grey' }} />
      <Card style={{ marginBottom: '20px' }}>
        <CardHeader className="text-center text-inidigo-600" style={{ marginTop: '20px' }}>
          <CardTitle className="text-xl text-indigo-600" style={{ color: "#6663f1" }}></CardTitle>
        </CardHeader>
        <CardContent className="overflow-hidded block rounded-lg" >
          <Label className="overflow-hidden">
            <img className='w-5/6 mx-auto my-auto rounded-[2%] block overflow-hidden object-cover' src="/Profile-Photo.jpeg" href="#" alt="" />
          </Label>
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
  )
};
