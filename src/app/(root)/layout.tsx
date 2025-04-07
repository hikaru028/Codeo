import React from 'react'
import StreamClientProvider from '@/components/providers/StreamClientProvider'

type Props = {}

const layout = ({ children }: { children: React.ReactNode }) => {
    return (
        <StreamClientProvider>{children}</StreamClientProvider>
    )
}

export default layout