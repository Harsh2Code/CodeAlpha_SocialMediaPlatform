import React from 'react'
import { Avatar, AvatarImage } from '/src/Components/ui/avatar';
import { Card, CardContent, CardTitle, CardHeader } from '/src/Components/ui/card';
import { Label } from '/src/Components/ui/label';
import { Button } from '/src/Components/ui/button';
import { Input } from '/src/Components/ui/input';
import { BiSolidLike } from "react-icons/bi";
import { BiCommentDetail } from "react-icons/bi";
import { ShareIcon } from '@heroicons/react/24/solid';
import Post from './Post';


export default function Account() {
    return (
        <>
            <div className='w-[80%] mx-auto mt-[2%] border-1 block' style={{ borderColor: '#6663f1', borderRadius: '4px' }} >
                <div className='flex flex-row justify-start items-center'>
                    <Avatar square="true" className="mx-auto my-auto my-[20%]" style={{ marginTop: '1rem' }} >
                        <AvatarImage src="/Profile-Photo.jpeg" alt="Profile" style={{ width: '12rem', height: '12rem' }} />
                    </Avatar>
                    <div className='flex flex-col justify-center items-start mx-auto' style={{ height: '200px', width: '60vw', border: '2px solid white' }}>
                        <div className='ml-[2%] font-bold text-[4rem] font-bold pb-[4%]'><span className='text-2xl ml-[2%]' style={{ marginBottom: '30px' }}>Name_Here </span></div>
                        <div className='flex flex-row justify-between items-center w-full'>
                            <div className='ml-[2%]'>
                                <span className='text-gray-700 ml-[2%] block'>DOB here</span>
                                <span className='text-muted ml-1 mt-[2%]'>Age Here | Gender Here</span>
                            </div>
                            <div className='mr-[4%] my-auto'>
                                <Button>Follow +</Button>
                            </div>

                        </div>
                    </div>
                </div>
                <hr />
                <div className='flex flex-col justify-start items-center mx-auto block'>
                    <Post user='true' />
                </div>
            </div>
        </>
    )
}
