import React from 'react'
import { LoaderIcon } from 'lucide-react'

type Props = {}

const LoaderUI = (props: Props) => {
    // h-16 + 1px for border in navbar => 65px
    return (
        <div className='h-[calc(100vh-4rem-1px)] flex items-center justify-center'>
            <LoaderIcon className='h-8 w-8 text-muted-foreground animate-spin' />
        </div>
    )
}

export default LoaderUI