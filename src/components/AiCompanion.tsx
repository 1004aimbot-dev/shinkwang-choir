import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";

// -- Type Definitions for Web Speech API --
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

// Helper to format text with clickable links and bold text
const formatResponseText = (text: string) => {
  // Split by bold markers (**text**)
  const parts = text.split(/(\*\*.*?\*\*)/g);
  
  return parts.map((part, index) => {
    // Handle Bold Text
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={index} className="font-bold text-slate-900 dark:text-white bg-primary/10 px-1 rounded-sm">
          {part.slice(2, -2)}
        </strong>
      );
    }
    
    // Handle URLs in regular text
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const subParts = part.split(urlRegex);
    
    return subParts.map((subPart, subIndex) => {
      if (subPart.match(urlRegex)) {
        return (
          <a 
            key={`${index}-${subIndex}`} 
            href={subPart} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-primary hover:underline break-all"
          >
            {subPart}
          </a>
        );
      }
      return <React.Fragment key={`${index}-${subIndex}`}>{subPart}</React.Fragment>;
    });
  });
};

const AiCompanion: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<'up' | 'down' | null>(null);
  
  // Voice Feedback State
  const [isRecording, setIsRecording] = useState(false);
  const [voiceNote, setVoiceNote] = useState('');
  const [showVoiceInput, setShowVoiceInput] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  
  useEffect(() => {
    if (isOpen && !response) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen, response]);

  // Auto-scroll to bottom when loading or response changes
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [isLoading, response, isOpen, showVoiceInput]);

  const handleGenerate = async (e: React.FormEvent | React.KeyboardEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    setIsLoading(true);
    setResponse(null);
    setFeedback(null);
    setVoiceNote('');
    setShowVoiceInput(false);
    
    try {
      // Initialize Gemini Client
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      const systemInstruction = `
        당신은 '글로리아 찬양대'의 AI 영성 도우미입니다. 
        사용자가 자신의 감정이나 상황을 이야기하면, 따뜻하고 정중한 어조(존댓말)로 위로와 추천을 해주세요.
        **모든 답변은 반드시 한국어(Korean)로 작성해야 합니다.**
        
        **디자인/가독성 지침 (매우 중요)**:
        1. 텍스트의 가독성을 위해 **핵심 키워드, 성경 구절의 장절(예: 시편 23:1), 찬양 곡명**은 반드시 **굵게(Bold)** 처리해주세요. (예: **주님**)
        2. 각 섹션 사이에는 반드시 빈 줄을 두 번 넣어 구분감을 주세요.
        3. 유튜브 링크나 영상은 제공하지 마세요.

        [응답 구조]
        1. **[말씀]** : 상황에 딱 맞는 성경 구절을 적어주세요. (핵심 구절과 **장절**을 굵게)
        
        2. **[위로]** : 따뜻한 위로와 격려의 메시지를 2-3문장으로 전해주세요. (**핵심 위로 단어**를 굵게)
        
        3. **[추천 찬양]** : 이 상황에 어울리는 찬양곡 3곡의 제목을 추천해 주세요.
           - 1. **곡명** - 추천 이유
           - 2. **곡명** - 추천 이유
           - 3. **곡명** - 추천 이유
      `;

      const result = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: input,
        config: {
          systemInstruction: systemInstruction,
        },
      });

      setResponse(result.text || "죄송합니다. 응답을 생성할 수 없습니다.");
      
    } catch (error) {
      console.error("Error generating content:", error);
      setResponse("일시적인 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.");
    } finally {
      setIsLoading(false);
    }
  };

  const resetChat = () => {
    setIsLoading(false);
    setResponse(null);
    setFeedback(null);
    setVoiceNote('');
    setShowVoiceInput(false);
    setInput('');
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const handleFeedback = (type: 'up' | 'down') => {
    const newFeedback = feedback === type ? null : type;
    setFeedback(newFeedback);

    // Persist to local storage
    if (newFeedback) {
        saveToLocalStorage({
            type: 'rating',
            rating: newFeedback,
        });
    }
  };

  const handleVoiceRecord = () => {
    if (isRecording) {
        setIsRecording(false);
        return;
    }

    if (!('webkitSpeechRecognition' in window)) {
        alert("이 브라우저는 음성 인식을 지원하지 않습니다.");
        return;
    }

    const recognition = new window.webkitSpeechRecognition();
    recognition.lang = 'ko-KR';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
        setIsRecording(true);
        setShowVoiceInput(true);
    };

    recognition.onend = () => {
        setIsRecording(false);
    };

    recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setVoiceNote(prev => prev ? prev + ' ' + transcript : transcript);
    };

    recognition.onerror = (event: any) => {
        console.error("Speech recognition error", event.error);
        setIsRecording(false);
    };

    recognition.start();
  };

  const handleSaveVoiceNote = () => {
      if (!voiceNote.trim()) return;
      
      saveToLocalStorage({
          type: 'voice_note',
          text: voiceNote
      });

      alert("소중한 의견이 저장되었습니다.");
      setShowVoiceInput(false);
      setVoiceNote('');
  };

  const saveToLocalStorage = (data: any) => {
    try {
        const feedbackItem = {
            timestamp: new Date().toISOString(),
            originalInput: input,
            ...data
        };
        
        const stored = localStorage.getItem('ai_companion_feedback');
        const history = stored ? JSON.parse(stored) : [];
        history.push(feedbackItem);
        
        if (history.length > 50) history.shift();
        
        localStorage.setItem('ai_companion_feedback', JSON.stringify(history));
    } catch (e) {
        console.error("Failed to save feedback to localStorage", e);
    }
  };

  return (
    <>
      {/* Floating Action Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 rounded-full shadow-lg transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:scale-110 hover:shadow-xl active:scale-95 ${
          isOpen 
            ? 'bg-slate-800 text-white rotate-180' 
            : 'bg-primary text-slate-900 animate-bounce-slow'
        }`}
        aria-label="AI 찬양 큐레이터"
      >
        <span className={`material-icons text-2xl transition-transform duration-500 ${isOpen ? 'rotate-45' : ''}`}>
             {isOpen ? 'add' : 'auto_awesome'}
        </span>
      </button>

      {/* Chat Window */}
      <div 
        className={`fixed bottom-24 right-6 z-50 w-[90vw] md:w-[400px] bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-200 dark:border-slate-700 rounded-2xl shadow-2xl overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] origin-bottom-right ${
          isOpen 
            ? 'opacity-100 scale-100 translate-y-0' 
            : 'opacity-0 scale-90 translate-y-10 pointer-events-none'
        }`}
      >
        {/* Header */}
        <div className="bg-primary/10 dark:bg-slate-800 p-4 border-b border-primary/20 dark:border-slate-700 flex justify-between items-center">
          <div>
            <h5 className="font-serif text-slate-900 dark:text-white font-medium">글로리아 AI 큐레이터</h5>
            <p className="text-xs text-slate-500 dark:text-slate-400">당신의 마음에 맞는 찬양과 말씀을 찾아드립니다.</p>
          </div>
          <button onClick={resetChat} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-transform hover:rotate-180 duration-500" title="초기화">
             <span className="material-icons text-sm">refresh</span>
          </button>
        </div>

        {/* Body */}
        <div className="p-5 max-h-[60vh] overflow-y-auto bg-slate-50/50 dark:bg-transparent scroll-smooth" ref={scrollRef}>
          {!response ? (
            <div className="space-y-6">
               <div className="flex gap-3 items-start animate-message-in">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-1 hover:scale-110 transition-transform duration-300">
                     <span className="material-icons text-primary text-sm">smart_toy</span>
                  </div>
                  <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 p-4 rounded-2xl rounded-tl-none text-sm text-slate-700 dark:text-slate-300 shadow-sm leading-relaxed hover:scale-[1.01] hover:-translate-y-0.5 transition-all duration-300 origin-top-left">
                    안녕하세요! 오늘 하루는 어떠셨나요?<br/>
                    현재 마음 상태나 기도 제목을 나눠주시면, 
                    함께 부르면 좋을 찬양과 말씀을 전해드릴게요.
                  </div>
               </div>
               
               <form onSubmit={handleGenerate} className="mt-4 animate-message-in" style={{ animationDelay: '150ms' }}>
                  <textarea
                    ref={inputRef}
                    value={input}
                    onChange={(e) => {
                      setInput(e.target.value);
                      e.target.style.height = 'auto';
                      e.target.style.height = `${e.target.scrollHeight}px`;
                    }}
                    placeholder="예: 마음이 너무 불안해요, 새로운 시작이 두려워요..."
                    className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl p-4 text-base focus:bg-white dark:focus:bg-slate-800 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none resize-none min-h-[56px] max-h-[250px] text-slate-800 dark:text-slate-200 placeholder-slate-400 transition-colors duration-200 ease-in-out custom-scrollbar leading-relaxed"
                    disabled={isLoading}
                    onKeyDown={(e) => {
                        if(e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleGenerate(e);
                        }
                    }}
                  />
                  <button 
                    type="submit"
                    disabled={!input.trim() || isLoading}
                    className="w-full mt-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 py-3 rounded-xl text-sm font-medium hover:opacity-90 transition-all duration-300 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-md hover:shadow-lg hover:-translate-y-0.5"
                  >
                    {isLoading ? (
                      <>
                        <span className="material-icons animate-spin text-sm">autorenew</span>
                        기도하며 찾는 중...
                      </>
                    ) : (
                      <>
                        찬양 추천 받기
                        <span className="material-icons text-sm">send</span>
                      </>
                    )}
                  </button>
               </form>
            </div>
          ) : (
            <div className="space-y-6 pb-4">
                {/* User Message Bubble */}
                <div className="flex justify-end animate-message-in origin-bottom-right">
                    <div className="bg-primary text-slate-900 px-5 py-3 rounded-2xl rounded-tr-none text-sm shadow-md max-w-[85%] font-medium leading-relaxed hover:scale-[1.02] hover:-translate-y-0.5 transition-all duration-300">
                        {input}
                    </div>
                </div>

                {/* AI Response Bubble */}
                <div className="flex gap-3 items-start animate-message-in origin-bottom-left" style={{ animationDelay: '200ms' }}>
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-1 hover:rotate-12 transition-transform duration-300">
                     <span className="material-icons text-primary text-sm">auto_awesome</span>
                  </div>
                  <div className="space-y-4 w-full">
                      <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 px-5 py-4 rounded-2xl rounded-tl-none text-sm text-slate-700 dark:text-slate-300 shadow-sm leading-loose whitespace-pre-line hover:shadow-md transition-shadow duration-300">
                        {/* Render cleaned response text with clickable links and bold text */}
                        {formatResponseText(response)}
                        
                        {/* Feedback & Voice Section */}
                        <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-700 flex flex-col gap-3 opacity-0 animate-fade-in animation-delay-600">
                            <div className="flex items-center justify-between">
                                <span className="text-xs text-slate-400 dark:text-slate-500">답변이 도움이 되셨나요?</span>
                                <div className="flex gap-2">
                                    <button 
                                        onClick={handleVoiceRecord}
                                        className={`p-1.5 rounded-full transition-all active:scale-90 flex items-center justify-center ${isRecording ? 'bg-red-100 text-red-500 animate-pulse ring-2 ring-red-200' : 'hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 dark:text-slate-500 hover:scale-110'}`}
                                        title="음성으로 의견 남기기"
                                    >
                                        <span className="material-icons text-sm">{isRecording ? 'mic' : 'mic_none'}</span>
                                    </button>
                                    <div className="w-px h-6 bg-slate-200 dark:bg-slate-700 mx-1"></div>
                                    <button 
                                        onClick={() => handleFeedback('up')}
                                        className={`p-1.5 rounded-full transition-all active:scale-90 flex items-center justify-center hover:scale-110 ${feedback === 'up' ? 'bg-primary/20 text-primary scale-110' : 'hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 dark:text-slate-500'}`}
                                        title="좋아요"
                                    >
                                        <span className="material-icons text-sm">thumb_up</span>
                                    </button>
                                    <button 
                                        onClick={() => handleFeedback('down')}
                                        className={`p-1.5 rounded-full transition-all active:scale-90 flex items-center justify-center hover:scale-110 ${feedback === 'down' ? 'bg-red-100 dark:bg-red-900/30 text-red-500 dark:text-red-400 scale-110' : 'hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 dark:text-slate-500'}`}
                                        title="별로예요"
                                    >
                                        <span className="material-icons text-sm">thumb_down</span>
                                    </button>
                                </div>
                            </div>

                            {/* Voice Feedback Input Area */}
                            {showVoiceInput && (
                                <div className="animate-fade-in-up bg-slate-50 dark:bg-slate-900/50 rounded-lg p-3 border border-slate-200 dark:border-slate-700">
                                    <p className="text-xs text-slate-500 mb-2 flex items-center gap-1">
                                        <span className="material-icons text-[12px]">{isRecording ? 'graphic_eq' : 'keyboard_voice'}</span>
                                        {isRecording ? '듣고 있습니다...' : '음성 기록 (수정 가능)'}
                                    </p>
                                    <textarea 
                                        value={voiceNote}
                                        onChange={(e) => setVoiceNote(e.target.value)}
                                        className="w-full text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md p-2 focus:border-primary outline-none dark:text-slate-200 resize-none transition-shadow focus:shadow-sm"
                                        rows={2}
                                        placeholder="마이크 버튼을 눌러 의견을 말씀해주세요."
                                    />
                                    <div className="flex justify-end mt-2">
                                        <button 
                                            onClick={handleSaveVoiceNote}
                                            disabled={!voiceNote.trim()}
                                            className="text-xs bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-3 py-1.5 rounded-md hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-105 active:scale-95"
                                        >
                                            저장하기
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                      </div>
                      
                      <div className="flex justify-center">
                          <button 
                            onClick={resetChat}
                            className="text-xs text-slate-400 flex items-center gap-1 hover:text-primary transition-colors py-2 group"
                          >
                            <span className="material-icons text-[14px] group-hover:rotate-180 transition-transform duration-500">refresh</span>
                            다른 이야기 나누기
                          </button>
                      </div>
                  </div>
                </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default AiCompanion;
