import React, { useState, useEffect, useRef } from 'react';

const InfoCard: React.FC<{ icon: string; title: string; content: React.ReactNode }> = ({ icon, title, content }) => (
  <div className="text-center">
    <div className="w-12 h-12 border border-primary/20 rounded-full flex items-center justify-center mx-auto mb-8 text-primary">
      <span className="material-icons text-xl">{icon}</span>
    </div>
    <h4 className="font-normal font-serif text-lg text-slate-800 dark:text-white mb-4 tracking-tight">{title}</h4>
    <p className="text-sm md:text-base text-slate-600 dark:text-slate-400 font-light leading-loose keep-all tracking-normal">
      {content}
    </p>
  </div>
);

const ApplicationModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    part: 'Soprano',
    experience: ''
  });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success'>('idle');

  useEffect(() => {
    if(isOpen) {
        setFormData({ name: '', phone: '', part: 'Soprano', experience: '' });
        setStatus('idle');
        document.body.style.overflow = 'hidden';
    } else {
        document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    // Simulate API call
    setTimeout(() => {
        setStatus('success');
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
        <div className="bg-white dark:bg-slate-900 p-8 md:p-10 rounded-sm shadow-2xl w-full max-w-lg relative max-h-[90vh] overflow-y-auto">
            <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
                <span className="material-icons">close</span>
            </button>
            
            {status === 'success' ? (
                <div className="text-center py-10 animate-fade-in">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 text-primary mb-6">
                        <span className="material-icons text-4xl">check</span>
                    </div>
                    <h3 className="font-serif text-2xl text-slate-900 dark:text-white mb-4">지원서가 접수되었습니다</h3>
                    <p className="text-slate-600 dark:text-slate-400 font-light leading-relaxed mb-8">
                        글로리아 찬양대에 지원해 주셔서 감사합니다.<br/>
                        담당자가 검토 후 입력하신 연락처로<br/>
                        개별 연락드리겠습니다.
                    </p>
                    <button onClick={onClose} className="px-8 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-sm hover:opacity-90 transition-opacity text-sm">
                        닫기
                    </button>
                </div>
            ) : (
                <>
                    <h3 className="font-serif text-2xl text-slate-900 dark:text-white mb-2">입단 지원서</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 font-light mb-8">찬양으로 함께 예배할 당신을 환영합니다.</p>
                    
                    <form onSubmit={handleSubmit} className="space-y-6 text-left">
                        <div>
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 block">성함</label>
                            <input 
                                type="text" 
                                required 
                                value={formData.name}
                                onChange={e => setFormData({...formData, name: e.target.value})}
                                className="w-full bg-transparent border-b border-slate-300 dark:border-slate-700 py-2 focus:border-primary focus:outline-none transition-colors dark:text-white"
                                placeholder="홍길동"
                            />
                        </div>
                        <div>
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 block">연락처</label>
                            <input 
                                type="tel" 
                                required 
                                value={formData.phone}
                                onChange={e => setFormData({...formData, phone: e.target.value})}
                                className="w-full bg-transparent border-b border-slate-300 dark:border-slate-700 py-2 focus:border-primary focus:outline-none transition-colors dark:text-white"
                                placeholder="010-1234-5678"
                            />
                        </div>
                        <div>
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 block">희망 파트</label>
                            <div className="relative">
                                <select 
                                    value={formData.part}
                                    onChange={e => setFormData({...formData, part: e.target.value})}
                                    className="w-full bg-transparent border-b border-slate-300 dark:border-slate-700 py-2 focus:border-primary focus:outline-none transition-colors dark:text-white appearance-none cursor-pointer bg-none"
                                >
                                    <option value="Soprano" className="dark:bg-slate-800">Soprano (여성 고음)</option>
                                    <option value="Alto" className="dark:bg-slate-800">Alto (여성 저음)</option>
                                    <option value="Tenor" className="dark:bg-slate-800">Tenor (남성 고음)</option>
                                    <option value="Bass" className="dark:bg-slate-800">Bass (남성 저음)</option>
                                    <option value="Unsure" className="dark:bg-slate-800">아직 잘 모르겠습니다</option>
                                </select>
                                <span className="material-icons absolute right-0 top-2 text-slate-400 pointer-events-none text-sm">expand_more</span>
                            </div>
                        </div>
                        <div>
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 block">신앙 / 찬양대 경력</label>
                            <textarea 
                                required
                                rows={3}
                                value={formData.experience}
                                onChange={e => setFormData({...formData, experience: e.target.value})}
                                className="w-full bg-transparent border-b border-slate-300 dark:border-slate-700 py-2 focus:border-primary focus:outline-none transition-colors dark:text-white resize-none leading-relaxed"
                                placeholder="간략한 신앙 소개와 찬양대 경험 유무를 적어주세요."
                            ></textarea>
                        </div>
                        
                        <div className="pt-6">
                            <button 
                                type="submit" 
                                disabled={status === 'submitting'}
                                className="w-full bg-primary text-slate-900 py-4 rounded-sm hover:bg-amber-400 transition-colors font-medium flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {status === 'submitting' ? (
                                    <>
                                        <span className="material-icons animate-spin text-sm">refresh</span>
                                        제출 중...
                                    </>
                                ) : (
                                    <>
                                        지원서 제출하기
                                        <span className="material-icons text-sm">send</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </>
            )}
        </div>
    </div>
  );
};

const ContactForm: React.FC = () => {
  const [formState, setFormState] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success'>('idle');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    
    // Simulate network request
    setTimeout(() => {
      setStatus('success');
      setFormState({ name: '', email: '', message: '' });
      // Reset status after showing success message for a while (optional)
      setTimeout(() => setStatus('idle'), 5000);
    }, 1500);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormState(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  if (status === 'success') {
    return (
      <div className="text-center py-12 animate-fade-in bg-slate-50 dark:bg-slate-800/30 rounded-sm">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 mb-6">
            <span className="material-icons text-3xl">check_circle</span>
        </div>
        <h4 className="font-serif text-xl text-slate-900 dark:text-white mb-2">메시지가 전송되었습니다</h4>
        <p className="text-sm text-slate-500 dark:text-slate-400">문의해 주셔서 감사합니다. 빠른 시일 내에 답변 드리겠습니다.</p>
        <button 
            onClick={() => setStatus('idle')}
            className="mt-6 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 underline"
        >
            추가 문의하기
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-8 text-left mt-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-2 group">
          <label htmlFor="name" className="text-xs uppercase tracking-widest text-slate-500 dark:text-slate-400 font-medium group-focus-within:text-primary transition-colors">Name</label>
          <input 
            required
            type="text" 
            id="name" 
            name="name"
            value={formState.name}
            onChange={handleChange}
            className="w-full bg-transparent border-b border-slate-300 dark:border-slate-700 py-3 focus:border-primary focus:outline-none transition-colors text-slate-800 dark:text-slate-200 placeholder-slate-400/30 text-base"
            placeholder="성함"
          />
        </div>
        <div className="space-y-2 group">
          <label htmlFor="email" className="text-xs uppercase tracking-widest text-slate-500 dark:text-slate-400 font-medium group-focus-within:text-primary transition-colors">Email</label>
          <input 
            required
            type="email" 
            id="email" 
            name="email"
            value={formState.email}
            onChange={handleChange}
            className="w-full bg-transparent border-b border-slate-300 dark:border-slate-700 py-3 focus:border-primary focus:outline-none transition-colors text-slate-800 dark:text-slate-200 placeholder-slate-400/30 text-base"
            placeholder="이메일 주소"
          />
        </div>
      </div>
      <div className="space-y-2 group">
        <label htmlFor="message" className="text-xs uppercase tracking-widest text-slate-500 dark:text-slate-400 font-medium group-focus-within:text-primary transition-colors">Message</label>
        <textarea 
          required
          id="message" 
          name="message"
          rows={4}
          value={formState.message}
          onChange={handleChange}
          className="w-full bg-transparent border-b border-slate-300 dark:border-slate-700 py-3 focus:border-primary focus:outline-none transition-colors text-slate-800 dark:text-slate-200 resize-none placeholder-slate-400/30 text-base leading-relaxed"
          placeholder="궁금하신 내용을 자유롭게 적어주세요."
        ></textarea>
      </div>
      <div className="text-center pt-8">
        <button 
          type="submit" 
          disabled={status === 'submitting'}
          className="inline-flex items-center px-10 py-3 bg-slate-800 dark:bg-white text-white dark:text-slate-900 rounded-sm hover:bg-slate-700 dark:hover:bg-slate-200 transition-all text-xs uppercase tracking-[0.15em] disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
        >
          {status === 'submitting' ? (
             <>
               <span className="material-icons animate-spin text-sm mr-2">refresh</span>
               Sending...
             </>
          ) : (
             <>
               문의하기
               <span className="material-icons text-sm ml-2">send</span>
             </>
          )}
        </button>
      </div>
    </form>
  );
};

const Recruitment: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const titleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
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

  return (
    <section className="py-32 px-6 bg-white dark:bg-[#2a2615]" id="join-us">
      <div className="max-w-5xl mx-auto">
        <div className="bg-background-light dark:bg-background-dark border border-slate-100 dark:border-gray-800/50 rounded-sm p-8 md:p-20 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-px bg-primary/40"></div>
          
          <div ref={titleRef} className={`text-center mb-16 transition-all duration-1000 ${isVisible ? 'animate-fade-in-up' : 'opacity-0 translate-y-8'}`}>
            <h3 className="font-serif text-3xl md:text-4xl text-slate-900 dark:text-white mb-8 font-light tracking-tight">찬양대 모집</h3>
            <p className="text-slate-700 dark:text-slate-300 font-light leading-relaxed max-w-2xl mx-auto keep-all text-base md:text-lg tracking-normal">
              성남신광교회 세례교인으로서 예배를 사모하는 마음을 가진 분들을 환영합니다.
            </p>
          </div>

          {/* Recruitment Video Section */}
          <div className="mb-20 rounded-sm overflow-hidden shadow-lg border border-slate-200 dark:border-gray-700/50 relative group cursor-pointer">
            {/* Placeholder for video - in production use a real iframe or video tag */}
            <div className="aspect-video bg-gray-900 relative flex items-center justify-center overflow-hidden">
                <img 
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDIcmZx62EtBPFX3ok515lf3ie9rVjabbla_Z05JSNuyvULIgt4m-bmHJH63Bxo4tIhNP2dG-nGW266aS1US1dhPGaa3KlOBPqE7N9QPtTY9BWd8yflf-WVXmYqi3rh90xrN7lnWyzrR_ztqgwgC7VIqZDrUkTtMnc0B9XolBdPtZsX-A-hQTGGJGxJJK7VHSP82EVr2xJSgu5gBHn4oL0ZItLQuxg0UzkpCzu5Qifta2o48cFmMHRhqVQNoxXKVARUrTtHDQtvjlA" 
                    alt="Choir Video Thumbnail" 
                    className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 md:w-20 md:h-20 bg-primary/90 rounded-full flex items-center justify-center pl-1 group-hover:scale-110 transition-transform duration-300 shadow-xl">
                        <span className="material-icons text-white text-3xl md:text-4xl">play_arrow</span>
                    </div>
                </div>
                <div className="absolute bottom-6 left-6 text-white text-left">
                    <p className="text-xs font-bold uppercase tracking-widest mb-1">Introduction</p>
                    <h5 className="text-xl font-serif">글로리아 찬양대 소개 영상</h5>
                </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
            <InfoCard 
              icon="schedule" 
              title="연습 시간" 
              content={<>주일<br/>오전 08:00 ~ 08:45<br/>오전 10:20 ~ 11:20<br/>본당 4층 찬양대실</>} 
            />
            <InfoCard 
              icon="library_music" 
              title="자격 요건" 
              content={<>세례교인<br/>새신자 교육 이수자</>} 
            />
            <InfoCard 
              icon="how_to_reg" 
              title="지원 절차" 
              content={<>지원서 작성<br/>간단한 오디션<br/>면담</>} 
            />
          </div>
          
          <div className="text-center mb-16">
            <button 
                onClick={() => setIsModalOpen(true)}
                className="inline-flex items-center px-12 py-4 bg-primary text-slate-900 rounded-sm font-normal hover:bg-primary/90 hover:scale-105 active:scale-95 transition-all shadow-sm text-sm uppercase tracking-[0.15em] keep-all"
            >
              지원하기
            </button>
          </div>

          <div className="w-full h-px bg-gradient-to-r from-transparent via-slate-200 dark:via-slate-700 to-transparent my-16"></div>

          <div className="text-center mb-8">
             <h4 className="font-serif text-2xl text-slate-800 dark:text-white mb-3">Online Inquiry</h4>
             <p className="text-sm text-slate-500 dark:text-slate-400 font-light">찬양대 활동에 대해 궁금한 점이 있으신가요?</p>
          </div>
          
          <ContactForm />

        </div>
      </div>
      
      <ApplicationModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </section>
  );
};

export default Recruitment;
