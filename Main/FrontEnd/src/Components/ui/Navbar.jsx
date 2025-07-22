import React from "react"
import { Avatar } from '/src/components/ui/avatar.jsx'
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
} from '@heroicons/react/24/solid'
import { InboxIcon, MagnifyingGlassIcon } from '@heroicons/react/24/solid'

const iconSize = 26

const navItems = [
  { label: 'Home', url: '/' },
  { label: 'Events', url: '/events' },
  { label: 'Orders', url: '/orders' },
  { label: 'Broadcasts', url: '/broadcasts' },
  { label: 'Settings', url: '/settings' },
]

function TeamDropdownMenu() {
  return (
    <DropdownMenu className="min-w-80 lg:min-w-64" anchor="bottom start">
      <DropdownMenuItem href="/teams/1/settings">
        <Cog8ToothIcon style={{ width: iconSize, height: iconSize }} />
        <DropdownMenuLabel>Settings</DropdownMenuLabel>
      </DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem href="/teams/1">
        <Avatar slot="icon" src="/tailwind-logo.svg" />
        <DropdownMenuLabel>Tailwind Labs</DropdownMenuLabel>
      </DropdownMenuItem>
      <DropdownMenuItem href="/teams/2">
        <Avatar slot="icon" initials="WC" className="bg-purple-500 text-white" />
        <DropdownMenuLabel>Workcation</DropdownMenuLabel>
      </DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem href="/teams/create">
        <PlusIcon style={{ width: iconSize, height: iconSize }} />
        <DropdownMenuLabel>New team&hellip;</DropdownMenuLabel>
      </DropdownMenuItem>
    </DropdownMenu>
  )
}

// Navbar component
export function Navbar({ children }) {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 w-full bg-gray-900 text-white shadow-md ms-8">
      <div className="w-[96vw] mx-auto flex items-center flex-nowrap justify-between">
        {children}
      </div>
    </nav>
  )
}

// NavbarItem component
export function NavbarItem({ href, current, children, ...props }) {
  return (
    <a
      href={href}
      aria-current={current ? "page" : undefined}
      className={`hover:text-gray-300 ${current ? "font-bold" : ""}`}
      {...props}
    >
      {children}
    </a>
  )
}

// NavbarSection component
export function NavbarSection({ children, className = "", ...props }) {
  return (
    <div className={`flex items-center ${className}`} {...props}>
      {children}
    </div>
  )
}

// NavbarDivider component
export function NavbarDivider({ className = "", ...props }) {
  return (
    <div
      className={`border-l border-gray-700 mx-4 h-6 ${className}`}
      {...props}
    />
  )
}

// NavbarSpacer component
export function NavbarSpacer() {
  return <div className="flex-grow" />
}

export default Navbar
