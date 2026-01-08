import React, { useState, useEffect, useRef } from 'react';
import { useAdmin } from '../contexts/AdminContext';

// --- Types & Interfaces ---

interface EventData {
  id: number;
  dateStr: string;
  year: number;
  month: number;
  day: number;
  title: string;
  desc: string;
}

// --- Helper Functions ---

const today = new Date();
const currentYear = today.getFullYear();
const currentMonth = today.getMonth(); // 0-indexed

const getRelativeDate = (monthOffset: number, day: number): Omit<EventData, 'id' | 'title' | 'desc'> => {
  const d = new Date(currentYear, currentMonth + monthOffset, day);
  const year = d.getFullYear();
  const month = d.getMonth() + 1; // 1-indexed for display/data
  const dateStr = `${year}. ${String(month).padStart(2, '0')}. ${String(d.getDate()).padStart(2, '0')}`;
  return { dateStr, day: d.getDate(), month, year };
};

const getInitialEvents = (): EventData[] => [
  { 
    id: 1, 
    ...getRelativeDate(0, 12),
    title: "정기 찬양 수련회", 
    desc: "이번 주 토요일 기도원에서 기도와 연습을 위한 모임을 갖습니다." 
  },
  { 
    id: 2, 
    ...getRelativeDate(0, 5),
    title: "특별 찬양 준비 리허설", 
    desc: "다가오는 절기 발표를 위한 특별 리허설이 화요일 저녁 7시에 시작됩니다." 
  },
  { 
    id: 3, 
    ...getRelativeDate(-1, 28),
    title: "새 가운 봉헌", 
    desc: "새로 기증받은 찬양대 가운 봉헌식이 오전 예배 중에 있었습니다." 
  },
  { 
    id: 4, 
    ...getRelativeDate(1, 24),
    title: "연합 예배 특별 찬양", 
    desc: "전교인이 함께하는 연합 예배에서 특별 찬양으로 영광 돌립니다." 
  },
  { 
    id: 5, 
    ...getRelativeDate(1, 31),
    title: "월례 기도회", 
    desc: "한 달을 마무리하고 새로운 달을 준비하는 은혜의 시간입니다." 
  },
];

// --- Sub Components ---

const Calendar: React.FC<{ events: EventData[]; isAdmin: boolean; onDateClick: (y: number, m: number, d: number) => void }> = ({ events, isAdmin, onDateClick }) => {
  // Initialize with current date
  const [currentDate, setCurrentDate] = useState(new Date()); 

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth(); // 0-indexed

  // Calendar Logic
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay(); // 0 = Sun
  
  const blanks = Array.from({ length: firstDayOfMonth }, (_, i) => i);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const isEventDay = (day: number) => {
    return events.some(e => e.year === year && e.month === (month + 1) && e.day === day);
  };

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  return (
    <div className="bg-white dark:bg-gray-900 p-6 md:p-8 rounded-sm border border-slate-100 dark:border-gray-800 shadow-sm h-full select-none">
      <div className="flex justify-between items-end mb-8 border-b border-slate-100 dark:border-gray-800 pb-4">
        <div>
          <span className="text-xs font-bold tracking-widest text-primary uppercase block mb-1">Schedule</span>
          <h4 className="font-serif text-2xl text-slate-900 dark:text-white transition-all duration-300">
            {monthNames[month]} {year}
          </h4>
        </div>
        <div className="flex space-x-1">
            <button onClick={prevMonth} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-gray-800 transition-colors text-slate-500 active:scale-95" aria-label="Previous Month">
                <span className="material-icons text-sm">chevron_left</span>
            </button>
            <button onClick={nextMonth} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-gray-800 transition-colors text-slate-500 active:scale-95" aria-label="Next Month">
                <span className="material-icons text-sm">chevron_right</span>
            </button>
        </div>
      </div>
      
      <div className="grid grid-cols-7 gap-2 mb-4 text-center">
        {['S','M','T','W','T','F','S'].map(d => (
          <div key={d} className="text-xs font-bold text-slate-400 dark:text-slate-600 font-sans">{d}</div>
        ))}
      </div>
      
      <div className="grid grid-cols-7 gap-2 md:gap-4 text-center">
        {blanks.map((_, i) => <div key={`blank-${i}`} className="aspect-square" />)}
        {days.map(day => {
          const hasEvent = isEventDay(day);
          const isToday = day === new Date().getDate() && month === new Date().getMonth() && year === new Date().getFullYear();
          
          return (
            <div 
                key={day} 
                onClick={() => isAdmin && onDateClick(year, month + 1, day)}
                className={`aspect-square flex items-center justify-center relative group ${isAdmin ? 'cursor-pointer hover:bg-primary/10 rounded-full transition-colors' : ''}`}
                title={isAdmin ? "일정 추가하기" : undefined}
            >
              <div className={`w-8 h-8 md:w-10 md:h-10 flex items-center justify-center rounded-full text-sm font-medium transition-all duration-300 ${hasEvent ? 'bg-primary text-slate-900 shadow-md scale-110 font-bold' : isToday ? 'bg-slate-100 dark:bg-slate-800 text-primary font-bold border border-primary/30' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-gray-800'}`}>
                {day}
              </div>
              {hasEvent && (
                 <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-600"></div>
              )}
            </div>
          )
        })}
      </div>
      
      <div className="mt-8 pt-6 border-t border-slate-100 dark:border-gray-800 flex items-center justify-center gap-6">
         <div className="flex items-center gap-2 text-xs text-slate-500">
            <span className="w-2 h-2 rounded-full bg-primary"></span>
            <span>Event</span>
         </div>
         <div className="flex items-center gap-2 text-xs text-slate-500">
            <span className="w-2 h-2 rounded-full bg-slate-200 dark:bg-gray-700"></span>
            <span>No Schedule</span>
         </div>
      </div>
    </div>
  );
};

interface NewsItemProps {
  event: EventData;
  highlight?: boolean;
  isAdmin: boolean;
  onEdit: (event: EventData) => void;
  onDelete: (id: number) => void;
}

const NewsItem: React.FC<NewsItemProps> = ({ event, highlight, isAdmin, onEdit, onDelete }) => (
  <div className={`relative p-8 border-l-2 transition-all duration-500 animate-fade-in group ${highlight ? 'border-primary bg-background-light dark:bg-background-dark/50' : 'border-transparent hover:border-slate-200 dark:hover:border-gray-700'}`}>
    <div className="flex items-center justify-between mb-2">
      <div className="flex items-center gap-3">
          <span className="material-icons text-primary text-sm">event</span>
          <span className="text-xs tracking-widest text-slate-500 dark:text-slate-400 uppercase font-medium">{event.dateStr}</span>
      </div>
      {isAdmin && (
        <div className="flex gap-1 relative z-20">
          <button 
            type="button"
            onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onEdit(event);
            }} 
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-400 hover:text-primary transition-all duration-200 cursor-pointer shadow-sm bg-white dark:bg-slate-800 border border-transparent hover:border-slate-300 dark:hover:border-slate-600" 
            title="수정"
          >
            <span className="material-icons text-sm pointer-events-none">edit</span>
          </button>
          <button 
            type="button"
            onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onDelete(event.id);
            }} 
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-red-50 dark:hover:bg-red-900/30 text-slate-400 hover:text-red-500 transition-all duration-200 cursor-pointer shadow-sm bg-white dark:bg-slate-800 border border-transparent hover:border-red-200 dark:hover:border-red-800" 
            title="삭제"
          >
            <span className="material-icons text-sm pointer-events-none">delete</span>
          </button>
        </div>
      )}
    </div>
    <h5 className="font-serif text-xl text-slate-800 dark:text-white mb-3 font-normal tracking-tight">{event.title}</h5>
    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-light keep-all">
      {event.desc}
    </p>
  </div>
);

// --- Modals ---

const EventEditorModal: React.FC<{ isOpen: boolean; onClose: () => void; onSave: (e: Omit<EventData, 'id'> | EventData) => void; initialData?: EventData }> = ({ isOpen, onClose, onSave, initialData }) => {
  const [formData, setFormData] = useState({
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
    day: new Date().getDate(),
    title: '',
    desc: ''
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        year: initialData.year,
        month: initialData.month,
        day: initialData.day,
        title: initialData.title,
        desc: initialData.desc
      });
    } else {
      const d = new Date();
      setFormData({
        year: d.getFullYear(),
        month: d.getMonth() + 1,
        day: d.getDate(),
        title: '',
        desc: ''
      });
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = () => {
    const dateStr = `${formData.year}. ${String(formData.month).padStart(2, '0')}. ${String(formData.day).padStart(2, '0')}`;
    onSave({
      ...formData,
      dateStr,
      id: (initialData && initialData.id) ? initialData.id : Date.now(), 
    } as EventData);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-slate-900 p-8 rounded-sm shadow-xl w-full max-w-md relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
           <span className="material-icons">close</span>
        </button>
        <h3 className="font-serif text-xl text-slate-900 dark:text-white mb-6">{initialData && initialData.id ? '일정 수정' : '새 일정 추가'}</h3>
        
        <div className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="text-xs text-slate-500 uppercase">Year</label>
              <input type="number" value={formData.year} onChange={e => setFormData({...formData, year: parseInt(e.target.value)})} className="w-full p-2 border-b border-slate-300 dark:border-slate-700 bg-transparent outline-none focus:border-primary dark:text-white" />
            </div>
            <div className="flex-1">
              <label className="text-xs text-slate-500 uppercase">Month</label>
              <input type="number" min="1" max="12" value={formData.month} onChange={e => setFormData({...formData, month: parseInt(e.target.value)})} className="w-full p-2 border-b border-slate-300 dark:border-slate-700 bg-transparent outline-none focus:border-primary dark:text-white" />
            </div>
            <div className="flex-1">
              <label className="text-xs text-slate-500 uppercase">Day</label>
              <input type="number" min="1" max="31" value={formData.day} onChange={e => setFormData({...formData, day: parseInt(e.target.value)})} className="w-full p-2 border-b border-slate-300 dark:border-slate-700 bg-transparent outline-none focus:border-primary dark:text-white" />
            </div>
          </div>
          <div>
            <label className="text-xs text-slate-500 uppercase">Title</label>
            <input type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full p-2 border-b border-slate-300 dark:border-slate-700 bg-transparent outline-none focus:border-primary dark:text-white" placeholder="행사명" />
          </div>
          <div>
            <label className="text-xs text-slate-500 uppercase">Description</label>
            <textarea value={formData.desc} onChange={e => setFormData({...formData, desc: e.target.value})} rows={3} className="w-full p-2 border-b border-slate-300 dark:border-slate-700 bg-transparent outline-none focus:border-primary resize-none dark:text-white" placeholder="상세 내용" />
          </div>
        </div>

        <button 
          onClick={handleSubmit}
          className="w-full mt-8 bg-slate-900 dark:bg-white text-white dark:text-slate-900 py-3 rounded-sm hover:opacity-90 transition-opacity"
        >
          저장하기
        </button>
      </div>
    </div>
  );
};

// --- Main Component ---

const News: React.FC = () => {
  const { isAdmin, openLoginModal } = useAdmin(); // Use Context
  const [isVisible, setIsVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [events, setEvents] = useState<EventData[]>([]);
  
  // Modals State
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<EventData | undefined>(undefined);

  const titleRef = useRef<HTMLDivElement>(null);

  // Initialize data
  useEffect(() => {
    const savedEvents = localStorage.getItem('shingwang_choir_events');
    if (savedEvents) {
        try {
            setEvents(JSON.parse(savedEvents));
        } catch (e) {
            setEvents(getInitialEvents());
        }
    } else {
        setEvents(getInitialEvents());
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    if (titleRef.current) observer.observe(titleRef.current);
    return () => observer.disconnect();
  }, []);

  // Persist Events
  useEffect(() => {
    if (events.length > 0) {
        localStorage.setItem('shingwang_choir_events', JSON.stringify(events));
    }
  }, [events]);

  const handleDelete = (id: number) => {
    if (window.confirm("정말로 이 일정을 삭제하시겠습니까?")) {
        setEvents(prev => prev.filter(e => e.id !== id));
    }
  };

  const handleEdit = (event: EventData) => {
    setEditingEvent(event);
    setIsEditorOpen(true);
  };

  const handleAddNew = () => {
    setEditingEvent(undefined);
    setIsEditorOpen(true);
  };

  const handleDateClick = (year: number, month: number, day: number) => {
    if (!isAdmin) return;
    // Pre-fill date with 0 id to indicate new event
    setEditingEvent({
        id: 0,
        year,
        month,
        day,
        dateStr: '',
        title: '',
        desc: ''
    });
    setIsEditorOpen(true);
  };

  const handleSaveEvent = (eventData: EventData) => {
    setEvents(prev => {
        let updatedEvents;
        if (editingEvent && editingEvent.id !== 0) {
            updatedEvents = prev.map(e => e.id === eventData.id ? eventData : e);
        } else {
            updatedEvents = [...prev, eventData];
        }
        
        // Sort by date ascending
        return updatedEvents.sort((a, b) => {
            const dateA = new Date(a.year, a.month - 1, a.day).getTime();
            const dateB = new Date(b.year, b.month - 1, b.day).getTime();
            return dateA - dateB;
        });
    });
    setIsEditorOpen(false);
  };

  // Sort logic already handled in save, but ensuring display is also sorted safety
  const sortedEvents = [...events].sort((a, b) => {
     const dateA = new Date(a.year, a.month - 1, a.day).getTime();
     const dateB = new Date(b.year, b.month - 1, b.day).getTime();
     return dateA - dateB; 
  });

  const displayEvents = isExpanded ? sortedEvents : sortedEvents.slice(0, 3);

  return (
    <section className="py-32 px-6 bg-white dark:bg-[#2a2615] border-y border-slate-100 dark:border-gray-800/50" id="news">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
            
            {/* Left Column: Title & Calendar */}
            <div className="lg:col-span-5 space-y-12">
                <div ref={titleRef} className={`text-left transition-all duration-1000 ${isVisible ? 'animate-fade-in-up' : 'opacity-0 translate-y-8'}`}>
                    <div className="flex items-center gap-3 mb-6">
                        <h3 className="font-serif text-3xl md:text-5xl text-slate-900 dark:text-white font-light tracking-tight">찬양대 소식</h3>
                        <button 
                            onClick={() => !isAdmin && openLoginModal()}
                            className={`p-2 rounded-full transition-colors ${isAdmin ? 'text-primary' : 'text-slate-300 hover:text-slate-400'}`}
                            title={isAdmin ? "관리자 모드 활성화됨" : "관리자 로그인"}
                        >
                            <span className="material-icons text-xl">{isAdmin ? 'lock_open' : 'lock'}</span>
                        </button>
                    </div>
                    <p className="text-slate-600 dark:text-slate-400 font-light tracking-wide text-sm md:text-base leading-relaxed">
                        글로리아 찬양대의 주요 일정과 소식을 전해드립니다.<br/>
                        함께 기도하며 준비하는 은혜로운 시간들입니다.
                    </p>
                </div>
                <Calendar 
                    events={events} 
                    isAdmin={isAdmin}
                    onDateClick={handleDateClick}
                />
            </div>

            {/* Right Column: News List */}
            <div className="lg:col-span-7 flex flex-col justify-center">
                {isAdmin && (
                    <div className="flex justify-end mb-4">
                        <button 
                            onClick={handleAddNew}
                            className="flex items-center gap-2 px-4 py-2 bg-primary text-slate-900 rounded-sm text-sm font-medium hover:bg-amber-400 transition-colors"
                        >
                            <span className="material-icons text-sm">add</span>
                            일정 추가
                        </button>
                    </div>
                )}

                <div className="divide-y divide-slate-100 dark:divide-gray-800">
                    {displayEvents.length > 0 ? (
                        displayEvents.map((event, index) => (
                            <NewsItem 
                                key={event.id}
                                event={event}
                                highlight={index === 0}
                                isAdmin={isAdmin}
                                onEdit={handleEdit}
                                onDelete={handleDelete}
                            />
                        ))
                    ) : (
                        <div className="py-12 text-center text-slate-400 font-light">
                            등록된 일정이 없습니다.
                        </div>
                    )}
                    
                    {events.length > 3 && (
                        <div className="pt-8 pl-8">
                            <button 
                                onClick={(e) => { e.preventDefault(); setIsExpanded(!isExpanded); }}
                                className="inline-flex items-center text-sm font-medium text-slate-900 dark:text-white hover:text-primary transition-colors group focus:outline-none"
                            >
                                {isExpanded ? "일정 접기" : "전체 일정 보기"}
                                <span className={`material-icons text-sm ml-2 transition-transform duration-300 ${isExpanded ? '-rotate-90' : 'group-hover:translate-x-1'}`}>
                                    {isExpanded ? 'expand_less' : 'arrow_forward'}
                                </span>
                            </button>
                        </div>
                    )}
                </div>
            </div>

        </div>
      </div>
      
      <EventEditorModal 
        isOpen={isEditorOpen} 
        onClose={() => setIsEditorOpen(false)} 
        onSave={handleSaveEvent}
        initialData={editingEvent}
      />
    </section>
  );
};

export default News;
