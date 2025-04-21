import { useUser } from '@clerk/nextjs';
import { useStreamVideoClient } from '@stream-io/video-react-sdk'
import React, { useState } from 'react'
import { api } from '../../../../convex/_generated/api';
import { useMutation, useQuery } from 'convex/react';
import toast from 'react-hot-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import UserInfo from '@/components/UserInfo';
import { LoaderIcon, XIcon } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { TIME_SLOTS } from '@/constants';

type Props = {}

const InterviewScheduleUI = (props: Props) => {
    const client = useStreamVideoClient();
    const { user } = useUser();
    const [open, setOpen] = useState<boolean>(false);
    const [isCreating, setIsCreating] = useState<boolean>(false);
    const interviews = useQuery(api.interviews.getAllInterviews) ?? [];
    const users = useQuery(api.users.getAllUsers) ?? [];
    const createInterview = useMutation(api.interviews.createInterview);
    const candidates = users?.filter((user) => user.role === 'candidate');
    const interviewers = users?.filter((user) => user.role === 'interviewer');

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        date: new Date(),
        time: '09:00',
        candidateId: '',
        interviewerIds: user?.id ? [user.id] : [], // Default is the current interviewer
    })

    const scheduleMeeting = async () => {
        if (!client || !user) return;

        if (!formData.candidateId || formData.interviewerIds.length === 0) {
            toast.error('Please select a candidate and at least one interviewer.');
            return;
        }

        setIsCreating(true);

        try {
            const { title, description, date, time, candidateId, interviewerIds } = formData;
            const [hours, minutes] = time.split(':');
            const meetingData = new Date(date);
            meetingData.setHours(parseInt(hours), parseInt(minutes), 0);

            const id = crypto.randomUUID();
            const call = client.call('default', id);

            await call.getOrCreate({
                data: {
                    starts_at: meetingData.toISOString(),
                    custom: {
                        description: title,
                        additionalDetails: description,
                    }
                }
            });

            await createInterview({
                title,
                description,
                startTime: meetingData.getTime(),
                status: 'upcoming',
                streamCallId: id,
                candidateId,
                interviewerIds,
            });

            setOpen(false);
            toast.success('Interview scheduled successfully.')

            setFormData({
                title: '',
                description: '',
                date: new Date(),
                time: '09:00',
                candidateId: '',
                interviewerIds: user?.id ? [user.id] : [],
            });

        } catch (error) {
            toast.error('An error occurred while scheduling the interview. Please try again later.');
        } finally {
            setIsCreating(false);
        }
    }

    const addInterviewer = (interviewerId: string) => {
        if (!formData.interviewerIds.includes(interviewerId)) {
            setFormData((prev) => ({
                ...prev,
                interviewerIds: [...prev.interviewerIds, interviewerId],
            }));
        }
    }

    const removeInterviewer = (interviewerId: string) => {
        if (interviewerId === user?.id) return;
        setFormData((prev) => ({
            ...prev,
            interviewerIds: prev.interviewerIds.filter((id) => id !== interviewerId),
        }));
    }

    const selectedInterviewers = interviewers?.filter((interviewer) =>
        formData.interviewerIds.includes(interviewer.clerkId)
    );

    const availableInterviewers = interviewers.filter((interviewer) =>
        !formData.interviewerIds.includes(interviewer.clerkId)
    );


    return (
        <div className='container max-w-7xl mx-auto p-6 space-y-8'>
            <div className='flex items-center justify-between'>
                {/* Header */}
                <div>
                    <h1 className='text-3xl font-bold'>Interview Schedule</h1>
                    <p className='text-muted-foreground mt-1'>Manage your interview schedule</p>
                </div>
                {/* Add Interview Button */}
                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                        <Button size='lg'>Schedule Interview</Button>
                    </DialogTrigger>
                    <DialogContent className='sm:max-w-[500px] h-[calc(100vh-200px)] overflow-auto'>
                        <DialogHeader>
                            <DialogTitle>Schedule Interview</DialogTitle>
                        </DialogHeader>
                        <div className='space-y-4 py-4'>
                            {/* Title */}
                            <div className='space-y-2'>
                                <label className='text-sm font-medium'>Title</label>
                                <Input
                                    placeholder='Interview title'
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                />
                            </div>
                            {/* Description */}
                            <div className='space-y-2'>
                                <label htmlFor='title' className='text-sm font-medium'>Description</label>
                                <Textarea
                                    placeholder='Interview description'
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    rows={3}
                                />
                            </div>
                            {/* Candidate */}
                            <div className='space-y-2'>
                                <label className='text-sm font-medium'>Candidate</label>
                                <Select
                                    value={formData.candidateId}
                                    onValueChange={(candidateId) => setFormData({ ...formData, candidateId })}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder='Select candidate' />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {candidates?.map((candidate) => (
                                            <SelectItem key={candidate.clerkId} value={candidate.clerkId}>
                                                <UserInfo user={candidate} />
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            {/* Interviewer */}
                            <div className='space-y-2'>
                                <label className='text-sm font-medium'>Interviewers</label>
                                <div className='flex flex-wrap gap-2 mb-2'>
                                    {selectedInterviewers.map((interviewer) => (
                                        <div key={interviewer.clerkId} className='inline-flex items-center gap-2 bg-secondary px-2 py-1 rounded-md text-sm'>
                                            <UserInfo user={interviewer} />
                                            {interviewer.clerkId !== user?.id && (
                                                <button
                                                    type='button'
                                                    onClick={() => removeInterviewer(interviewer.clerkId)}
                                                    className='hover:text-destructive transition-colors'
                                                >
                                                    <XIcon className='size-4' />
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                </div>
                                {availableInterviewers.length > 0 &&
                                    <Select onValueChange={addInterviewer}>
                                        <SelectTrigger>
                                            <SelectValue placeholder='Add Interviewer' />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {availableInterviewers.map((interviewer) => (
                                                <SelectItem key={interviewer.clerkId} value={interviewer.clerkId}>
                                                    <UserInfo user={interviewer} />
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                }
                            </div>
                            {/* Date & time */}
                            <div className='flex justify-start'>
                                <div className='space-y-2'>
                                    <label htmlFor='title' className='text-sm font-medium'>Date</label>
                                    <Calendar
                                        mode='single'
                                        selected={formData.date}
                                        onSelect={(date) => date && setFormData({ ...formData, date })}
                                        disabled={(date) => date < new Date()}
                                        className='rounded-md border'
                                    />
                                </div>
                                <div className='apace-y-2'>
                                    <label htmlFor='title' className='text-sm font-medium'>Time</label>
                                    <Select
                                        value={formData.time}
                                        onValueChange={(time) => setFormData({ ...formData, time })}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder='Select time' />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {TIME_SLOTS.map((time) => (
                                                <SelectItem key={time} value={time}>
                                                    {time}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            {/* Action buttons */}
                            <div className='flex justify-end gap-3 pt-4'>
                                <Button
                                    variant='outline'
                                    onClick={() => setOpen(false)}
                                >
                                    Cancel
                                </Button>
                                <Button>
                                    {isCreating ? (
                                        <>
                                            <LoaderIcon />
                                            Scheduling
                                        </>
                                    ) : (
                                        "Schedule Interview"
                                    )}
                                </Button>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>
        </div >
    )
}

export default InterviewScheduleUI