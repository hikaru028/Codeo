import React from 'react'
import { CallRecording } from '@stream-io/video-react-sdk'
import toast from 'react-hot-toast'
import { format } from 'date-fns'
import { calculateRecordingDuration } from '@/lib/utils'
import { Card, CardContent, CardFooter, CardHeader } from './ui/card'
import { Calendar1Icon, ClockIcon, CopyIcon, PlayIcon } from 'lucide-react'
import { Button } from './ui/button'

type Props = {
    recording: CallRecording
}

const RecordingCard = (prop: Props) => {
    const handleCopyLink = async () => {
        try {
            await navigator.clipboard.writeText(prop.recording.url);
            toast.success("Link copied to clipboard");
        } catch (error) {
            toast.error("Failed to copy link to clipboard");
        }
    }

    const formattedStartTime = prop.recording.start_time
        ? format(new Date(prop.recording.start_time), "MMMM dd, yyyy 'at' h:mm a")
        : "Unknown";

    const duration = prop.recording.start_time && prop.recording.end_time
        ? calculateRecordingDuration(prop.recording.start_time, prop.recording.end_time)
        : "Unknown";


    return (
        <Card className='group hover:shadow-md transition-all'>
            {/* Header */}
            <CardHeader className='space-y-1'>
                <div className='space-y-2'>
                    <div className='flex flex-col gap-1.5'>
                        <div className='flex items-center text-sm text-muted-foreground gap-2'>
                            <Calendar1Icon className='h-3.5 w-3.5' />
                            <span>{formattedStartTime}</span>
                        </div>
                        <div className='flex items-center text-sm text-muted-foreground gap-2'>
                            <ClockIcon className='h-3.5 w-3.5' />
                            <span>{duration}</span>
                        </div>
                    </div>
                </div>
            </CardHeader>

            {/* Content */}
            <CardContent>
                <div
                    className='w-full aspect-video bg-muted/50 rounded-lg flex items-center justify-center cursor-pointer group'
                    onClick={() => window.open(prop.recording.url, '_blank')}
                >
                    <div className='size-12 rounded-full bg-background/90 flex items-center justify-center group-hover:bg-primary transition-colors'>
                        <PlayIcon className='size-6 text-muted-foreground group-hover:text-primary-foreground transition-colors' />
                    </div>
                </div>
            </CardContent>
            <CardFooter className='gap-2'>
                <Button className='flex-1' onClick={() => window.open(prop.recording.url, '_blank')}>
                    <PlayIcon className='size-4 mr-2' />
                    Play Recording
                </Button>
                <Button variant="secondary" onClick={handleCopyLink}>
                    <CopyIcon className='size-4' />
                </Button>
            </CardFooter>
        </Card>
    )
}

export default RecordingCard