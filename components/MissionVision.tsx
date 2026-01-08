import React, { useEffect, useRef, useState } from 'react';

const useOnScreen = (options: IntersectionObserverInit) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
        observer.disconnect();
      }
    }, options);

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [options]);

  return [ref, isVisible] as const;
};

const MissionVision: React.FC = () => {
  const [missionRef, isMissionVisible] = useOnScreen({ threshold: 0.1 });
  const [visionRef, isVisionVisible] = useOnScreen({ threshold: 0.1 });

  return (
    <section className="py-32 px-6 bg-white dark:bg-[#2a2615]">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-24 items-start">
        <div ref={missionRef} className={`space-y-10 md:pr-12 md:border-r border-slate-100 dark:border-gray-700/50 transition-all duration-1000 ${isMissionVisible ? 'animate-fade-in-up' : 'opacity-0 translate-y-8'}`}>
          <h4 className="font-serif text-3xl text-slate-900 dark:text-white font-light tracking-tight">사명 (Mission)</h4>
          <div className="w-20 h-px bg-primary/60"></div>
          <p className="text-slate-700 dark:text-slate-300 leading-loose font-light keep-all text-base md:text-lg tracking-normal">
            교리적으로 풍성하고 음악적으로 탁월한 예배를 인도하며, 퍼포먼스가 아닌 오직 하나님의 영광에 집중합니다. 우리는 전례를 돕고 회중이 하나 되어 목소리를 높일 수 있도록 돕는 것을 목표로 합니다.
          </p>
        </div>
        <div ref={visionRef} className={`space-y-10 transition-all duration-1000 delay-200 ${isVisionVisible ? 'animate-fade-in-up' : 'opacity-0 translate-y-8'}`}>
          <h4 className="font-serif text-3xl text-slate-900 dark:text-white font-light tracking-tight">비전 (Vision)</h4>
          <div className="w-20 h-px bg-primary/60"></div>
          <p className="text-slate-700 dark:text-slate-300 leading-loose font-light keep-all text-base md:text-lg tracking-normal">
            믿음과 음악적 재능이 함께 성장하는 영적 가족이 되는 것입니다. 우리는 단순한 노래 모임을 넘어, 섬김을 통해 그리스도의 사랑을 반영하는 제자 공동체를 꿈꿉니다.
          </p>
        </div>
      </div>
    </section>
  );
};

export default MissionVision;