"use client"

import { Button } from "@/components/ui/button";
import { QUICK_ACTIONS } from "@/constants";
import { useUserRole } from "@/hooks/useUserRole";
import { SignInButton } from "@clerk/nextjs";
import ActionCard from "@/components/ActionCard";

export default function Home() {
  const { isCandidate, isInterviewer, isLoading } = useUserRole();
  const handleQuickAction = (title: string) => { };

  return (
    <div className="container max-w-7xl mx-auto p-6">
      {/* welcome */}
      <div className='rounded-lg bg-card p-6 border shadow-sm mb-10'>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-slate-200 bg-clip-text text-transparent">
          Welcome back!
        </h1>
        <p className="text-muted-foreground mt-2">
          {isInterviewer
            ? "Manage your interviews and review candidates effectively"
            : "Access your upcoming interviews and preparations"
          }
        </p>
      </div>
      {isInterviewer ? (
        <>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {QUICK_ACTIONS.map((action, index) => (
              <ActionCard
                key={action.title}
                action={action}
                onClick={() => handleQuickAction(action.title)}
              />
            ))}
          </div>
        </>

      ) : (
        <>
          <div className="">
            show candidate view
          </div>
        </>
      )}
    </div>
  );
}
