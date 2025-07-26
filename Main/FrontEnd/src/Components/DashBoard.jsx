import React from 'react'
import Post from './Post'

export default function DashBoard() {
  const dummyUser = { id: 1, name: "Test User" }; // Dummy user object for testing
  return (
    <main className="mx-auto my-[1%] items-center bg-background text-foreground min-w-[50vw] max-w-[70vw] p-[1em] rounded-md" style={{ height: 'auto' }}>
      <Post hideUserInfo={false} currentUser={dummyUser} />
    </main>
  )
}
