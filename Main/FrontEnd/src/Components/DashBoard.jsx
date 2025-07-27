import React, { useContext } from 'react'
import Post from './Post'
import { AuthContext } from '../contexts/AuthContext'
import { FollowingList } from './ui/FollowingList'

export default function DashBoard() {
  const { user } = useContext(AuthContext)
  return (
    <main className="mx-auto my-[1%] items-center bg-background text-foreground min-w-[50vw] max-w-[70vw] p-[1em] rounded-md" style={{ height: 'auto', backgroundColor: '#324446' }}>
      <Post hideUserInfo={false} currentUser={user} />
      <div style={{ marginTop: '2em' }}>
        <FollowingList />
      </div>
    </main>
  )
}
