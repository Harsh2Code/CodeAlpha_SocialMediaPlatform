
import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../contexts/AuthContext'
import { Avatar, AvatarImage } from './ui/avatar'
import { House, Plus } from 'lucide-react'
import API_BASE_URL from "../lib/apiConfig.js";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuContent,
} from './ui/dropdown-menu'
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
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandList,
  CommandItem,
} from "./ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "./ui/popover"
import { Button } from './ui/button'
import {Label} from './ui/label'
 
const frameworks = []

function Navbar() {
  const { user, logout, token } = useContext(AuthContext)
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState("")
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true)
      setError(null)
      try {
        console.log("Fetching users with token:", token)
        const response = await fetch(`${API_BASE_URL}/api/users/`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${token}`,
          },
        })
        console.log("Response status:", response.status)
        if (!response.ok) {
          const text = await response.text()
          console.error("Response text on error:", text)
          throw new Error('Failed to fetch users')
        }
        const data = await response.json()
        console.log("Fetched users data:", data)
        console.log("Users data type:", typeof data)
        console.log("Users data length:", Array.isArray(data) ? data.length : "Not an array")
        setUsers(data)
      } catch (err) {
        console.error("Fetch users error:", err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    if (token) {
      fetchUsers()
    }
  }, [token])

  const handleLogout = () => {
    logout()
  }

  return (
    <div
      className="bg-muted block border-2xl"
      style={{
        width: '96vw',
        height: '60px',
        backgroundColor: '#111111',
        overflow: 'hidden',
        borderBottom: '1px solid #6366f1',
        boxShadow: '2px 2px 5px #646cff',
        color: 'white',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0em 16px',
        position: 'fixed',
        top: 0,
        left: '0.25%',
        right: '0.5%',
        zIndex: 50,
      }}
    >
      <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }}>
        <Avatar square="true">
          <AvatarImage
            href="https://thvnext.bing.com/th/id/OIP.3Slw0SehxPBEnPmaoZ3i-wHaEc?w=302&h=181&c=7&r=0&o=7&cb=thvnext&dpr=1.2&pid=1.7&rm=3"
            alt="Profile"
            style={{ width: '26px', height: '26px' }}
          />
        </Avatar>
        <span style={{ marginLeft: '8px', color: '#646cff', fontWeight:'bolder', fontSize: '2em'}}>SPOTT</span>
      </div>
      <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '20px' }}>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="w-[24rem] justify-between"
              style={{ backgroundColor: '#273638ae', color: '#646cff',borderRadius: '8rem' }}
            >
              {value
                ? users.find((user) => user.id === value)?.username
                : "Select user..."}
              <MagnifyingGlassIcon style={{ width: 26, height: 26, color: '#646cff' }} />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[200px] p-0" style={{ backgroundColor: '#1f2b2dff' }}>
            <Command>
              <CommandInput
                placeholder="Search user..."
                value={value}
                onValueChange={(searchQuery) => {
                  console.log("Search query:", searchQuery);
                  setValue(searchQuery);
                }}
                style={{ color: '#646cff' }}
              />
              <CommandList>
                <CommandEmpty>No user found.</CommandEmpty>
                <CommandGroup>
                  {loading && <div className="p-2 text-center text-gray-400">Loading...</div>}
                  {error && <div className="p-2 text-center text-red-500">{error}</div>}
                {!loading && !error && users.filter((user) => {
                  // Debug: Log each user object to see its structure
                  console.log("User object:", user);
                  return user.username && user.username.toLowerCase().includes(value.toLowerCase());
                }).map((user) => (
                    <CommandItem
                      key={user.id}
                      value={user.username}
                      onSelect={(currentValue) => {
                        const selectedUser = users.find(user => user.username === currentValue);
                        if (selectedUser) {
                          navigate(`/users/${selectedUser.id}`);
                          setValue(""); // Clear search bar after selection
                          setOpen(false);
                        }
                      }}
                    >
                      {user.username}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>
      <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '12px' }}>
        <Label>
          <Button href style={{ border: 'none', background: 'transparent' }}>
            <a href="/" style={{ color: '#646cff', textDecoration: 'none', marginRight: '12px' }}>
              <House style={{width: 26, height: 26, color: '#646cff'}} />
            </a>
          </Button>
        </Label>
        <Label>
          <Button style={{ border: 'none', background: 'transparent' }}>
            <a href="/create" style={{ color: '#646cff', textDecoration: 'none', marginRight: '12px' }}>
              <Plus style={{width: 26, height: 26, color: '#646cff'}} />
            </a>
          </Button>
        </Label>
        <InboxIcon style={{ width: 26, height: 26, color: '#646cff' }} />
        {!user ? (
          <>
            <a href="/login" style={{ color: '#646cff', textDecoration: 'none', marginRight: '12px' }}>
              Login
            </a>
            <a href="/register" style={{ color: '#646cff', textDecoration: 'none' }}>
              Register
            </a>
          </>
        ) : (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Avatar square="true" style={{ cursor: 'pointer',background: 'transparent', backdropFilter: 'blur(10px)', padding: '1rem', borderRadius: '2rem' }}>
                <AvatarImage src={user.profile_picture_url || '/Profile-Photo.jpeg'} alt="Profile" style={{ width: '26px', height: '26px', borderRadius: '50%', borderRadius: '8rem' }} />
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" style={{background: 'transparent', backdropFilter: 'blur(10px)', padding: '1rem'}}>
              <DropdownMenuLabel>{user.name || 'User'}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} >
                <Label style={{color: 'red'}}>
                  <ArrowRightStartOnRectangleIcon className="mr-2 h-4 w-4" width={25} height={25} />
                  Logout
                </Label>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate('/account')} >
                <Label style={{color: 'white'}}>
                  <UserIcon className=" block mr-2 h-4 w-4" width={25} height={25} />
                <a href="/account" style={{ color: '#646cff', textDecoration: 'none' }}>
                  Accounts
                </a>
                </Label>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </div>
  )
}

export default Navbar