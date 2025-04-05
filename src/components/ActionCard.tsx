import { QuickActionType } from '@/constants'
import { Card } from './ui/card'
import React from 'react'

type Props = {
    action: QuickActionType,
    onClick: () => void
}

const ActionCard = (props: Props) => {
    return (
        <Card
            className='group relative overflow-hidden hover:border-primary/50 transition-all duration-300 hover:shadow-lg cursor-pointer'
            onClick={props.onClick}
        >
            {/* Action gradient */}
            <div className={`absolute inset-0 bg-gradient-to-br ${props.action.gradient} opacity-100 group-hover:opacity-50 transition-opacity`} />

            {/* Action content wrapper */}
            <div className='relative p-6 size-full'>
                {/* Action icon */}
                <div className={`w-12 h-12 rounded-full flex items-center justify-center bg-${props.action.color}/10 group-hover:scale-110 transition-transform`}>
                    <props.action.icon className={`w-6 h-6 text-${props.action.color}`} />
                </div>
                {/* Action details */}
                <div className='space-y-1'>
                    <h3 className='font-semibold text-xl group-hover:text-primary transition-colors'>
                        {props.action.title}
                    </h3>
                    <p className='text-sm text-muted-foreground'>
                        {props.action.description}
                    </p>
                </div>
            </div>

        </Card>
    )
}

export default ActionCard