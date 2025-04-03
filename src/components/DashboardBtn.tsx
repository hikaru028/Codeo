"use client";

import Link from 'next/link';
import React from 'react'
import { Button } from './ui/button';
import { SparkleIcon } from 'lucide-react';
import { useUserRole } from '@/hooks/UseUserRole';

type Props = {}

const DashboardBtn = (props: Props) => {
    const { isCandidate, isLoading } = useUserRole();

    if (isCandidate || isLoading) return null;

    return (
        <Link href={"/dashboard"}>
            <Button>
                <SparkleIcon className='size-4' />
                Dashboard
            </Button>
        </Link>
    )
}

export default DashboardBtn