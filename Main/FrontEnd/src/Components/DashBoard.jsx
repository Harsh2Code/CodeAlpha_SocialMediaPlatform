import React from 'react'
import Post from './Post'

export default function DashBoard() {
  return (
    <main className="mx-auto my-[1%] items-center bg-background text-foreground w-[40vw] rounded-md" style={{ height: 'auto', border: '4px solid #6663f1' }}>
      <Post />
    </main>
  )
}
