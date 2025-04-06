import React, { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Input } from './ui/input';
import { Button } from './ui/button';

type MeetingModalProps = {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    isJoinMeeting: boolean;
}

const MeetingModal = (props: MeetingModalProps) => {
    const [meetingUrl, setMeetingUrl] = useState<string>("");

    const createMeeting = async () => { };
    const joinMeeting = async () => { };
    const handleStart = () => { };

    return (
        <Dialog
            open={props.isOpen}
            onOpenChange={props.onClose}
        >
            <DialogContent className='sm:max-w-[425px]'>
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
                        <Button variant='outline' onClick={props.onClose}>Cancel</Button>
                        <Button onClick={handleStart} disabled={props.isJoinMeeting && !meetingUrl.trim()}>
                            {props.isJoinMeeting ? "Join meeting" : "Start meeting"}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default MeetingModal