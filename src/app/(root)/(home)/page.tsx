"use client"

import { Button } from "@/components/ui/button";
import { useUserRole } from "@/hooks/useUserRole";
import { SignInButton } from "@clerk/nextjs";

export default function Home() {
  const { isCandidate, isInterviewer, isLoading } = useUserRole()
  return (
    <div className="container max-w-7xl mx-auto p-6">
      {/* welcome */}
      <div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">
          Welcome back!
        </h1>
        <p className="text-muted-foreground mt-2">
          {isInterviewer ? (
            <>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4">
                show sth here
              </div>
            </>

          ) : (
            <>
              <div className="">
                show candidate view
              </div>
            </>
          )
          }
        </p>
      </div>
    </div>
  );
}
