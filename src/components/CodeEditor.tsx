import { CODING_QUESTIONS, LANGUAGES } from '@/constants'
import React, { useState } from 'react'
import { ResizablePanel, ResizablePanelGroup } from './ui/resizable';
import { ScrollArea } from './ui/scroll-area';

type Props = {}

const CodeEditor = (props: Props) => {
    const [selectedQuestion, setSelectedQuestion] = useState(CODING_QUESTIONS[0]);
    const [language, setLanguage] = useState<"javascript" | "python" | "java">(LANGUAGES[0].id);
    const [code, setCode] = useState(selectedQuestion.starterCode[language]);

    const handleQuestionChange = (questionId: string) => {
        if (questionId === "") return;
        const question = CODING_QUESTIONS.find((q) => q.id === questionId);
        if (!question) return;
        setSelectedQuestion(question);
        setCode(question.starterCode[language]);
    };

    const handleLanguageChange = (newLanguage: "javascript" | "python" | "java") => {
        setLanguage(newLanguage);
        setCode(selectedQuestion.starterCode[newLanguage]);
    };

    return (
        <ResizablePanelGroup direction="vertical" className='min-h-[calc-100vh-4rem-1px]'>
            {/* Question section */}
            <ResizablePanel>
                <ScrollArea className="h-full">
                    <div className='p-6'>
                        <div className='max-w-4xl mx-auto space-y-6'>

                        </div>
                    </div>
                </ScrollArea>
            </ResizablePanel>
            {/* Code editor section */}
            <ResizablePanel></ResizablePanel>
        </ResizablePanelGroup>
    )
}

export default CodeEditor