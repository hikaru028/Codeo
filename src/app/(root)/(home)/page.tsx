"use client"

import { Button } from "@/components/ui/button";
import { QUICK_ACTIONS } from "@/constants";
import { useUserRole } from "@/hooks/useUserRole";
import { SignInButton } from "@clerk/nextjs";
import ActionCard from "@/components/ActionCard";
import MeetingModal from "@/components/MeetingModal";
import { useQuery } from "convex/react";
import { useState } from "react";
import { api } from "../../../../convex/_generated/api";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const { isCandidate, isInterviewer, isLoading } = useUserRole();
  const interviews = useQuery(api.interviews.getMyInterviews);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [modalType, setModalType] = useState<"start" | "join">();

  if (isLoading) return <p>Loading...</p>

  const handleQuickAction = (title: string) => {
    switch (title) {
      case "New Call":
        setModalType("start");
        setShowModal(true);
        break;
      case "Join Interview":
        setModalType("join");
        setShowModal(true);
        break;
      default:
        router.push(`/${title.toLowerCase()}`)
    }
  };
  return (
    <div className="container max-w-7xl mx-auto p-6">
      {/* welcome */}
      <div className='p-6 mb-10'>
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

          <MeetingModal
            isOpen={showModal}
            onClose={() => setShowModal(false)}
            title={modalType === "join" ? "Join Meeting" : "Start Meeting"}
            isJoinMeeting={modalType === "join"}
          />
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
