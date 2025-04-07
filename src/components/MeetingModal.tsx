import React, { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Input } from './ui/input';
import { Button } from './ui/button';
import useMeetingActions from '@/hooks/useMeetingActions';

type MeetingModalProps = {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    isJoinMeeting: boolean;
}

const MeetingModal = (props: MeetingModalProps) => {
    const [meetingUrl, setMeetingUrl] = useState<string>("");
    const { createInstantMeeting, joinMeeting } = useMeetingActions();

    const handleStart = () => {
        if (props.isJoinMeeting) {
            // if it's a full URL extract meeting ID
            const meetingId = meetingUrl.split("/").pop();
            if (meetingId) {
                joinMeeting(meetingId);
            }
        } else {
            createInstantMeeting();
        }

        setMeetingUrl("");
        props.onClose();
    };

    return (
        <Dialog
            open={props.isOpen}
            onOpenChange={props.onClose}
        >
            <DialogContent className='sm:max-w-[425px] bg-slate-100'>
                <DialogHeader>
                    <DialogTitle>{props.title}</DialogTitle>
                </DialogHeader>
                <div className='space-y-4 px'>
                    {props.isJoinMeeting && (
                        <Input
                            placeholder='Paste meeting link here'
                            value={meetingUrl}
                            onChange={(e) => setMeetingUrl(e.target.value)}
                        />
                    )}
                    <div className='flex justify-end gap-3'>
                        <Button variant='default' onClick={props.onClose}>Cancel</Button>
                        <Button variant='outline' onClick={handleStart} disabled={props.isJoinMeeting && !meetingUrl.trim()}>
                            {props.isJoinMeeting ? "Join meeting" : "Start meeting"}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default MeetingModal