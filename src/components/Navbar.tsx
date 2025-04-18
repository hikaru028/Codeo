import React from 'react'
import { ModeToggle } from './ModeToggle'
import Link from 'next/link'
import { CodeIcon } from 'lucide-react'
import { SignedIn } from '@clerk/nextjs'
import { UserButton } from '@clerk/nextjs'
import DashboardBtn from './DashboardBtn'

type Props = {}

const Navbar = (props: Props) => {
    return (
        <nav className='border-b'>
            <div className='flex h-16 items-center container px-4 mx-auto'>
                {/* left side */}
                <Link href="/" className='flex items-center text-2xl font-semibold font-mono gap-2 mr-6 hover:opacity-80 transition-opacity'>
                    <CodeIcon className='size-8 text-gray-900' />
                    <span className='bg-gradient-to-r from-gray-900 to-slate-400 bg-clip-text text-transparent'>
                        Codeo
                    </span>
                </Link>

                {/* right side */}
                <SignedIn>
                    <div className='flex items-center space-x-4 ml-auto'>
                        <DashboardBtn />
                        <ModeToggle />
                        <UserButton />
                    </div>
                </SignedIn>
            </div>
        </nav>
    )
}

export default Navbar