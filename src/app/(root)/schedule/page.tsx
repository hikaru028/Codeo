'use client'

import LoaderUI from '@/components/LoaderUI'
import { useUserRole } from '@/hooks/useUserRole'
import { useRouter } from 'next/navigation'
import React from 'react'
import InterviewScheduleUI from './InterviewScheduleUI'

type Props = {}

const SchedulePage = (props: Props) => {
    const router = useRouter();

    const { isInterviewer, isLoading } = useUserRole();

    if (isLoading) return <LoaderUI />
    if (!isInterviewer) return router.push('/');

    return (
        <InterviewScheduleUI />
    )
}

export default SchedulePage