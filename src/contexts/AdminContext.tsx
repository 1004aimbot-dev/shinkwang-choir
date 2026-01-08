import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';

interface AdminContextType {
  isAdmin: boolean;
  login: (password: string) => boolean;
  logout: () => void;
  isLoginModalOpen: boolean;
  openLoginModal: () => void;
  closeLoginModal: () => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const AdminProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  // Check session storage on load
  useEffect(() => {
    const sessionAdmin = sessionStorage.getItem('shingwang_admin');
    if (sessionAdmin === 'true') {
      setIsAdmin(true);
    }
  }, []);

  const login = (password: string) => {
    if (password === '1234') {
      setIsAdmin(true);
      sessionStorage.setItem('shingwang_admin', 'true');
      setIsLoginModalOpen(false);
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAdmin(false);
    sessionStorage.removeItem('shingwang_admin');
  };

  const openLoginModal = () => setIsLoginModalOpen(true);
  const closeLoginModal = () => setIsLoginModalOpen(false);

  return (
    <AdminContext.Provider value={{ isAdmin, login, logout, isLoginModalOpen, openLoginModal, closeLoginModal }}>
      {children}
      <AdminLoginModal 
        isOpen={isLoginModalOpen} 
        onClose={closeLoginModal} 
        onLogin={login} 
      />
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};

// Internal Modal Component
const AdminLoginModal: React.FC<{ isOpen: boolean; onClose: () => void; onLogin: (pw: string) => boolean }> = ({ isOpen, onClose, onLogin }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [showForgotMsg, setShowForgotMsg] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setPassword('');
      setError(false);
      setShowForgotMsg(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (onLogin(password)) {
      setPassword('');
      setError(false);
    } else {
      setError(true);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-slate-900 p-8 rounded-sm shadow-xl w-full max-w-sm relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
           <span className="material-icons">close</span>
        </button>
        <h3 className="font-serif text-xl text-slate-900 dark:text-white mb-6">관리자 로그인</h3>
        <input 
          type="password" 
          value={password}
          onChange={(e) => { setPassword(e.target.value); setError(false); }}
          placeholder="비밀번호 (1234)"
          className="w-full mb-2 p-3 border-b border-slate-300 dark:border-slate-700 bg-transparent focus:border-primary outline-none transition-colors dark:text-white"
          onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
          autoFocus
        />
        {error && <p className="text-red-500 text-xs mb-4">비밀번호가 올바르지 않습니다.</p>}
        <button 
          onClick={handleSubmit}
          className="w-full mt-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 py-3 rounded-sm hover:opacity-90 transition-opacity"
        >
          확인
        </button>

        <div className="mt-4 text-center">
            {showForgotMsg ? (
                <p className="text-xs text-slate-500 dark:text-slate-400 animate-fade-in">
                    Please contact the administrator for password resets.
                </p>
            ) : (
                <button 
                    onClick={() => setShowForgotMsg(true)}
                    className="text-xs text-slate-400 hover:text-primary transition-colors underline"
                >
                    Forgot Password?
                </button>
            )}
        </div>
      </div>
    </div>
  );
};
