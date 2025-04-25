import React, { FC, useState } from 'react'
import { Id } from '../../convex/_generated/dataModel'
import { useMutation, useQuery } from 'convex/react'
import { api } from '../../convex/_generated/api'
import toast from 'react-hot-toast'
import { MessageSquareIcon, StarIcon } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { ScrollArea } from './ui/scroll-area'
import { Avatar, AvatarFallback } from './ui/avatar'
import { AvatarImage } from '@radix-ui/react-avatar'
import { getInterviewerInfo } from '@/lib/utils'
import { format } from 'date-fns'
import { Select, SelectContent, SelectItem, SelectTrigger } from './ui/select'
import { SelectValue } from '@radix-ui/react-select'
import { Label } from './ui/label'

type CommentDialogProps = {
    interviewId: Id<"interviews">
}

const CommentDialog: FC<CommentDialogProps> = ({ interviewId }) => {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [comment, setComment] = useState<string>("");
    const [rating, setRating] = useState<string>('0');
    const stars: number[] = [1, 2, 3, 4, 5];

    const addComment = useMutation(api.comments.addComment);
    const users = useQuery(api.users.getAllUsers);
    const existingComments = useQuery(api.comments.getComments, { interviewId });

    const handleSubmit = async () => {
        if (!comment.trim()) return toast.error("Comment cannot be empty");

        try {
            await addComment({
                interviewId: interviewId,
                content: comment.trim(),
                rating: parseInt(rating),
            })

            toast.success("Comment added successfully");
            setComment("");
            setRating('0');
            setIsOpen(false);
        } catch (error) {
            toast.error("Failed to add comment");
        }
    }

    const renderStars = (rating: number): JSX.Element => {
        return (
            <div>
                {stars.map((starValue) => (
                    <StarIcon
                        key={starValue}
                        className={`size-4 ${starValue <= rating ? 'fill-primary text-primary' : 'text-muted-foreground'}`}
                    />
                ))}
            </div>
        )
    }

    if (existingComments === undefined || users === undefined) return null

    return (
        <Dialog
            open={isOpen}
            onOpenChange={setIsOpen}
        >
            <DialogTrigger asChild>
                <Button variant='secondary' className='size-4 mr-2'>
                    <MessageSquareIcon className='size-4 mr-2' />
                    Add comment
                </Button>
            </DialogTrigger>

            <DialogContent className='sm:max-w-[600px]'>
                <DialogHeader>
                    <DialogTitle>Interview Comment</DialogTitle>
                </DialogHeader>
                <div className='space-y-6'>
                    {existingComments.length > 0 && (
                        <div className='space-y-4'>
                            <div className='flex items-center justify-between'>
                                <h4 className='text-sm font-medium'>Previous Comment</h4>
                                <Badge variant='outline'>
                                    {existingComments.length} Comment{existingComments.length > 1 && "s"}
                                </Badge>
                            </div>

                            <ScrollArea className='h-[240px]'>
                                <div className='space-y-4'>
                                    {existingComments.map((comment, index) => {
                                        const interviewer = getInterviewerInfo(users, comment.interviewerId)
                                        return (
                                            <div key={index} className='rounded-lg border p-4 space-y-3'>
                                                <div className='flex items-center justify-between'>
                                                    <div className='flex items-center gap-2'>
                                                        <Avatar className='size-8'>
                                                            <AvatarImage src={interviewer.image} />
                                                            <AvatarFallback>{interviewer.initials}</AvatarFallback>
                                                        </Avatar>
                                                        <div>
                                                            <p className='text-sm front-medium'>{interviewer.name}</p>
                                                            <p className='text-sm text-muted-foreground'>
                                                                {format(comment._creationTime, 'MMM d, yyyy ・ h:mm a')}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    {renderStars(comment.rating)}
                                                </div>
                                                <p className='text-sm text-muted-foreground'>{comment.content}</p>
                                            </div>
                                        );
                                    })}
                                </div>
                            </ScrollArea>
                        </div>
                    )}

                    <div className='space-y-4'>
                        <div className='space-y-2'>
                            <Label>Rating</Label>
                            <Select value={rating} onValueChange={setRating}>
                                <SelectTrigger>
                                    <SelectValue placeholder='Select rating' />
                                </SelectTrigger>
                                <SelectContent>
                                    {stars.map((value) => (
                                        <SelectItem key={value} value={value.toString()}>
                                            <div className='flex items-center gap-2'>{renderStars(value)}</div>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default CommentDialog