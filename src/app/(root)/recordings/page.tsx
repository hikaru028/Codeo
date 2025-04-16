'use client'

import React, { useEffect, useState } from 'react'
import useGetCalls from '@/hooks/useGetCalls'
import { CallRecording } from '@stream-io/video-react-sdk'
import LoaderUI from '@/components/LoaderUI'

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

        </div>
    )
}

export default RecordingsPage