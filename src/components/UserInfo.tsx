import React, { FC } from 'react'
import { Doc } from '../../convex/_generated/dataModel'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { UserCircleIcon } from 'lucide-react'

type User = {
    user: Doc<'users'>
}

const UserInfo: FC<User> = ({ user }) => {
    return (
        <div className='flex items-center gap-2'>
            <Avatar className='size-6'>
                <AvatarImage src={user.image} />
                <AvatarFallback>
                    <UserCircleIcon className='size-4' />
                </AvatarFallback>
            </Avatar>
            <span>{user.name}</span>
        </div>
    )
}

export default UserInfo