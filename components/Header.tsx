import React, { useState, useEffect } from 'react';

const Header: React.FC = () => {
  const [isDark, setIsDark] = useState(false);

  // Initialize theme based on localStorage or system preference
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
      setIsDark(true);
      document.documentElement.classList.add('dark');
    } else {
      setIsDark(false);
      document.documentElement.classList.remove('dark');
    }
  }, []);

  // Toggle theme handler
  const toggleTheme = () => {
    if (isDark) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      setIsDark(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setIsDark(true);
    }
  };

  // Smooth scroll handler
  const handleScrollTo = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="relative w-full h-screen min-h-[700px] flex flex-col justify-center items-center text-center overflow-hidden bg-[#fdfcf8] dark:bg-[#1a1810]">
      {/* Dark Mode Toggle Button */}
      <button 
        onClick={toggleTheme}
        className="absolute top-6 right-6 z-50 p-3 rounded-full bg-white/30 dark:bg-black/30 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 text-slate-800 dark:text-slate-200 hover:bg-white/50 dark:hover:bg-black/50 transition-all duration-300 shadow-sm group"
        aria-label={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
      >
        <span className="material-icons text-xl group-hover:rotate-12 transition-transform duration-300">
          {isDark ? 'light_mode' : 'dark_mode'}
        </span>
      </button>

      <div className="absolute inset-0 w-full h-full z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bible-texture opacity-100"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[90vw] h-[90vw] max-w-[1400px] max-h-[1400px] bg-[radial-gradient(circle,_rgba(255,253,240,0.6)_0%,_rgba(255,255,255,0)_70%)] dark:bg-amber-800/10 blur-[80px]"></div>
      </div>
      
      <div className="relative z-10 px-6 max-w-6xl mx-auto space-y-14">
        <div className="space-y-8">
          <h2 className="opacity-0 animate-fade-in-up text-slate-700 dark:text-slate-400 font-serif font-light tracking-[0.2em] text-sm md:text-base uppercase">
            성남신광교회 1부 찬양대 글로리아
          </h2>
          {/* Font size reduced by 5px across breakpoints: 48px->43px, 60px->55px, 72px->67px */}
          <h1 className="opacity-0 animate-fade-in-up animation-delay-200 font-serif text-[43px] md:text-[55px] lg:text-[67px] text-slate-900 dark:text-white font-extrabold leading-tight tracking-tight keep-all">
            하나님께 영광을,<br />
            예배의 첫 시간을<br className="md:hidden" /> 찬양으로 올려드립니다
          </h1>
        </div>
        
        <div className="opacity-0 animate-fade-in-up animation-delay-400 w-16 h-px bg-slate-400 dark:bg-slate-600 mx-auto"></div>
        
        <p className="opacity-0 animate-fade-in-up animation-delay-400 text-base md:text-lg lg:text-xl text-slate-800 dark:text-slate-300 font-light max-w-3xl mx-auto leading-extra-loose tracking-normal keep-all">
          우리는 찬양이 기도가 되고, 우리의 노래가 예배가 되기를 소망합니다.<br className="hidden md:block" />
          가장 정결한 마음으로 주님을 높여드리는 거룩한 시간입니다.
        </p>
        
        <div className="opacity-0 animate-fade-in-up animation-delay-600 pt-10 flex flex-col md:flex-row gap-5 justify-center items-center">
          <a 
            className="inline-flex items-center justify-center px-10 py-4 min-w-[180px] border border-slate-400 dark:border-slate-600 text-slate-900 dark:text-slate-200 rounded-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors duration-300 font-normal text-sm md:text-base tracking-wide cursor-pointer" 
            href="#praise-videos"
            onClick={(e) => handleScrollTo(e, 'praise-videos')}
          >
            주일 찬양 보기
          </a>
          <a 
            className="inline-flex items-center justify-center px-10 py-4 min-w-[180px] bg-slate-900 dark:bg-white text-white dark:text-slate-900 border border-transparent rounded-sm hover:bg-slate-800 dark:hover:bg-gray-200 transition-colors duration-300 font-normal text-sm md:text-base tracking-wide cursor-pointer" 
            href="#join-us"
            onClick={(e) => handleScrollTo(e, 'join-us')}
          >
            새 단원 문의
          </a>
        </div>
      </div>
    </header>
  );
};

export default Header;