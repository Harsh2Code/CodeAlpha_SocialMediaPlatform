import React from 'react'
import { Avatar, AvatarImage } from '/src/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuContent,
} from '/src/components/ui/dropdown-menu'
import {
  ArrowRightStartOnRectangleIcon,
  ChevronDownIcon,
  Cog8ToothIcon,
  LightBulbIcon,
  PlusIcon,
  ShieldCheckIcon,
  UserIcon,
  InboxIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/24/solid'

function Navbar() {
  return (
    <div className='bg-muted block border-2xl' style={{ width: '96vw', height: '60px',backgroundColor: '#212121ff', overflow: 'hidden' ,borderBottom: '1px solid #6366f1',boxShadow: '2px 2px 5px #6663f1',
 color: 'white', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: '0 16px', position: 'fixed', top: 0, left: '1%', right: '1%', zIndex: 50 }}>
      <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }}>
        <Avatar square="true" >
          <AvatarImage src="/Profile-Photo.jpeg" alt="Profile" style={{width: '26px', height: '26px'}}/>
        </Avatar>
        <span style={{ marginLeft: '8px', color:'#6366f1' }}>Main</span>
        {/* <ChevronDownIcon style={{ width: 26, height: 26, marginLeft: '4px' }} /> */}
      </div>
      <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '20px' }}>
        <a href="/" style={{ color: '#6663f1', textDecoration: 'none' }}>Home</a>
        <a href="/events" style={{ color: '#6663f1', textDecoration: 'none' }}>Events</a>
        <a href="/orders" style={{ color: '#6663f1', textDecoration: 'none' }}>Orders</a>
      </div>
      <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '12px' }}>
        <MagnifyingGlassIcon style={{ width: 26, height: 26, color: '#6366f1' }} />
        <InboxIcon style={{ width: 26, height: 26 , color: '#6366f1'}} />
        <Avatar square="true" >
          <AvatarImage src="/Profile-Photo.jpeg" alt="Profile" style={{width: '26px', height: '26px'}} />
        </Avatar>
      </div>
    </div>
  )
}

export default Navbar
