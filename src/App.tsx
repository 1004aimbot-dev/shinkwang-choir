import React from 'react';
import Header from './components/Header';
import Introduction from './components/Introduction';
import MissionVision from './components/MissionVision';
import Gallery from './components/Gallery';
import News from './components/News';
import Members from './components/Members';
import Recruitment from './components/Recruitment';
import Footer from './components/Footer';
import AiCompanion from './components/AiCompanion';
import { AdminProvider } from './contexts/AdminContext';

const App: React.FC = () => {
  return (
    <AdminProvider>
      <div className="min-h-screen w-full relative">
        <Header />
        <Introduction />
        <MissionVision />
        <Gallery />
        <News />
        <Members />
        <Recruitment />
        <Footer />
        <AiCompanion />
      </div>
    </AdminProvider>
  );
};

export default App;
