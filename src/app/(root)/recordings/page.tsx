'use client'

import React, { useEffect, useState } from 'react'
import useGetCalls from '@/hooks/useGetCalls'
import { CallRecording } from '@stream-io/video-react-sdk'
import LoaderUI from '@/components/LoaderUI'
import { ScrollArea } from '@/components/ui/scroll-area'

type Props = {}

const RecordingsPage = (props: Props) => {
    const { calls, isLoading } = useGetCalls();
    const [recordings, setRecordings] = useState<CallRecording[]>([]);

    useEffect(() => {
        const fetchRecordings = async () => {
            if (!calls) return;

            try {
                const callData = await Promise.all(calls.map((call) => call.queryRecordings()));
                const allRecordings = callData.flatMap((call) => call.recordings);

                setRecordings(allRecordings)
            } catch (error) {
                console.log("Error fetching recordings: ", error);
            }
        }
    }, [calls]);

    if (isLoading) return <LoaderUI />

    return (
        <div className=''>
            <h1>Recordings</h1>
            <p>
                {recordings.length} {recordings.length === 1 ? "recording" : "recordings"} available
            </p>

            {/* Recording screen */}
            <ScrollArea>
                {recordings.length > 0 ? (
                    <div>
                        {recordings.map((r) => (
                            <RecordingCard key={r.end_time} recording={r} />
                        ))}
                    </div>
                )}
            </ScrollArea>
        </div>

    )
}

export default RecordingsPage