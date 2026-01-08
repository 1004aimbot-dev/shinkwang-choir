import React, { useEffect, useRef, useState } from 'react';
import { useAdmin } from '../contexts/AdminContext';

interface IntroData {
  welcome: string;
  title: string;
  content: string;
}

const initialIntroData: IntroData = {
  welcome: "Welcome",
  title: "예배를 향한 마음",
  content: `글로리아 찬양대는 성남신광교회 1부 예배 가운데 찬양으로 예배의 문을 여는 공동체입니다.

한 사람의 소리가 아닌 함께 드리는 고백으로 성도들의 마음이 하나님께 향하도록 겸손히 섬기고 있습니다.`
};

const IntroEditorModal: React.FC<{ isOpen: boolean; onClose: () => void; onSave: (data: IntroData) => void; initialData: IntroData }> = ({ isOpen, onClose, onSave, initialData }) => {
  const [formData, setFormData] = useState<IntroData>(initialIntroData);

  useEffect(() => {
    if (isOpen) {
      setFormData(initialData);
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fade-in">
      <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-2xl w-full max-w-lg relative border border-slate-200 dark:border-slate-700">
        <button onClick={onClose} className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
           <span className="material-icons">close</span>
        </button>
        <h3 className="font-serif text-2xl text-slate-900 dark:text-white mb-8 font-medium">소개글 수정</h3>
        
        <div className="space-y-6">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Sub Title (Welcome)</label>
            <input 
                type="text" 
                value={formData.welcome} 
                onChange={e => setFormData({...formData, welcome: e.target.value})} 
                className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 dark:text-white transition-all" 
                placeholder="Ex: Welcome"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Title</label>
            <input 
                type="text" 
                value={formData.title} 
                onChange={e => setFormData({...formData, title: e.target.value})} 
                className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 dark:text-white transition-all"
                placeholder="Ex: 예배를 향한 마음"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Content</label>
            <textarea 
                value={formData.content} 
                onChange={e => setFormData({...formData, content: e.target.value})} 
                rows={8}
                className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 resize-none dark:text-white leading-relaxed transition-all" 
                placeholder="소개 내용을 입력하세요."
            />
          </div>
        </div>

        <button 
          onClick={() => onSave(formData)} 
          className="w-full mt-8 bg-primary text-slate-900 font-medium py-3 rounded-xl hover:bg-amber-400 transition-colors shadow-sm active:scale-[0.98]"
        >
          저장하기
        </button>
      </div>
    </div>
  );
};

const Introduction: React.FC = () => {
  const { isAdmin } = useAdmin();
  const [isVisible, setIsVisible] = useState(false);
  const [data, setData] = useState<IntroData>(initialIntroData);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  
  const titleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load saved data
    const saved = localStorage.getItem('shingwang_intro');
    if (saved) {
        try {
            setData(JSON.parse(saved));
        } catch (e) {
            setData(initialIntroData);
        }
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

    if (titleRef.current) {
      observer.observe(titleRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleSave = (newData: IntroData) => {
      setData(newData);
      localStorage.setItem('shingwang_intro', JSON.stringify(newData));
      setIsEditorOpen(false);
  };

  return (
    <section className="py-40 px-6 md:px-12 bg-background-light dark:bg-background-dark" id="introduction">
      <div className="max-w-4xl mx-auto text-center space-y-12 relative group">
        
        {/* Admin Edit Button */}
        {isAdmin && (
            <button 
                onClick={() => setIsEditorOpen(true)}
                className="absolute top-0 right-0 p-2 bg-white dark:bg-slate-800 rounded-full shadow-md text-slate-400 hover:text-primary transition-all opacity-0 group-hover:opacity-100"
                title="소개글 수정"
            >
                <span className="material-icons text-sm">edit</span>
            </button>
        )}

        <div 
          ref={titleRef} 
          className={`transition-all duration-1000 ${isVisible ? 'animate-fade-in-up' : 'opacity-0 translate-y-8'}`}
        >
          <span className="text-primary font-normal tracking-[0.25em] text-xs md:text-sm uppercase block mb-2">{data.welcome}</span>
          <h3 className="font-serif text-3xl md:text-5xl text-slate-900 dark:text-white font-light leading-snug tracking-tight keep-all">
            {data.title}
          </h3>
        </div>
        <div className="text-slate-700 dark:text-slate-300 leading-extra-loose font-light text-lg md:text-xl tracking-normal keep-all whitespace-pre-line">
          {data.content}
        </div>
        <div className="flex justify-center pt-10">
          <span className="material-icons text-primary/30 text-4xl">music_note</span>
        </div>
      </div>

      <IntroEditorModal 
        isOpen={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
        onSave={handleSave}
        initialData={data}
      />
    </section>
  );
};

export default Introduction;