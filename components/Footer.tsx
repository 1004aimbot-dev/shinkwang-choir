import React from 'react';
import { useAdmin } from '../contexts/AdminContext';

const Footer: React.FC = () => {
  const { isAdmin, openLoginModal, logout } = useAdmin();

  return (
    <footer className="bg-background-dark text-slate-300 py-24 px-6 border-t border-slate-800">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-12">
        <div className="space-y-8">
          <h2 className="font-serif text-2xl text-white font-light tracking-wide">글로리아 찬양대</h2>
          <p className="text-xs md:text-sm tracking-widest uppercase font-light text-slate-500">성남신광교회</p>
          <div className="flex items-center gap-4 text-sm md:text-base font-light text-slate-400 leading-none tracking-wide">
            <span className="material-icons text-base opacity-50">location_on</span>
            <span>경기도 성남시 분당구 예배로 123</span>
          </div>
          <div className="flex items-center gap-4 text-sm md:text-base font-light text-slate-400 leading-none tracking-wide">
            <span className="material-icons text-base opacity-50">email</span>
            <span>choir@shingwang.church</span>
          </div>
        </div>
        
        <div className="flex flex-col md:items-end space-y-6">
          <a className="text-xs md:text-sm uppercase tracking-widest text-slate-500 hover:text-primary transition-colors" href="#">교회 본당 홈페이지</a>
          <a className="text-xs md:text-sm uppercase tracking-widest text-slate-500 hover:text-primary transition-colors" href="#">유튜브 채널</a>
          
          <div className="relative w-full md:w-72 h-36 bg-gray-900/50 rounded-sm overflow-hidden mt-8 border border-slate-800">
            <img 
              alt="Abstract map showing location of Seongnam" 
              className="w-full h-full object-cover opacity-30 grayscale" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCjM0FOtzvhAbX5VgbOrT9Sc-go33mODFuT1douawSVKvfTeWu8ZR6jou8PrJNZxCZVaplYElzqzDU1W3fC0yWPDoxxUoSGVOnLcaiZx9IsHKPx0oDfblr100UQasgiX5ADkH8N4Y-j2zsdVSq1d9NFihYqHgWZqTCQwdgFxa6PHNdVTStlmVRO_pY_7nJcmLKeUb3iQ8zaxnoz9dHe0AvSSCRvphpGIJmvbVnkI9iTMXZCYUBQ_A1Fbzo0F3OIlUYgJm0EOJ1UXPI"
            />
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <span className="text-xs uppercase tracking-[0.2em] text-white/60">오시는 길</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto mt-20 pt-10 border-t border-slate-800/50 text-center md:text-left flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-xs text-slate-600 font-light tracking-wide">© 2023 Gloria Choir. All rights reserved. Soli Deo Gloria.</p>
        <button 
          onClick={isAdmin ? logout : openLoginModal}
          className="text-xs text-slate-700 hover:text-primary transition-colors flex items-center gap-1"
        >
          <span className="material-icons text-xs">{isAdmin ? 'logout' : 'settings'}</span>
          {isAdmin ? '관리자 로그아웃' : '관리자 로그인'}
        </button>
      </div>
    </footer>
  );
};

export default Footer;