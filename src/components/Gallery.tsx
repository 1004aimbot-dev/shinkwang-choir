import React, { useState, useEffect, useRef } from 'react';
import { useAdmin } from '../contexts/AdminContext';

// --- Interfaces ---

interface CarouselSlideData {
  id: number;
  imageSrc: string;
  title: string;
  desc: string;
}

interface GalleryItemData {
  id: number;
  imageSrc: string;
  alt: string;
  category: string;
  title: string;
  date: string;
}

// --- Initial Data (Fixed URLs) ---

const initialSlides: CarouselSlideData[] = [
  {
    id: 1,
    imageSrc: "https://images.unsplash.com/photo-1438232992991-995b7058bbb3?auto=format&fit=crop&w=1200&q=80",
    title: "2023 부활절 칸타타",
    desc: "주님의 부활을 기뻐하며 드린 찬양"
  },
  {
    id: 2,
    imageSrc: "https://images.unsplash.com/photo-1507838153414-b4b713384ebd?auto=format&fit=crop&w=1200&q=80",
    title: "가을 특별 찬양",
    desc: "온 맘 다해 드리는 예배"
  },
  {
    id: 3,
    imageSrc: "https://images.unsplash.com/photo-1512389142860-9c449e58a543?auto=format&fit=crop&w=1200&q=80",
    title: "성탄 전야제",
    desc: "아기 예수님의 탄생을 축하하며"
  }
];

const initialGalleryData: GalleryItemData[] = [
  { 
    id: 1,
    imageSrc: "https://images.unsplash.com/photo-1516280440614-6697288d5d38?auto=format&fit=crop&w=800&q=80",
    alt: "Sheet music resting on a stand in warm light",
    category: "Easter Service",
    title: "부활절 칸타타",
    date: "2023년 4월"
  },
  { 
    id: 2,
    imageSrc: "https://images.unsplash.com/photo-1459749411177-d4a428c37ae5?auto=format&fit=crop&w=800&q=80",
    alt: "Choir members singing in robes, blurred background",
    category: "Regular Sunday",
    title: "시편 23편",
    date: "2023년 10월"
  },
  { 
    id: 3,
    imageSrc: "https://images.unsplash.com/photo-1542621334-a254cf47733d?auto=format&fit=crop&w=800&q=80",
    alt: "Detail of pipe organ in a church",
    category: "Christmas Eve",
    title: "성탄 전야 미사",
    date: "2022년 12월"
  }
];

// --- Sub Components ---

interface GalleryItemProps extends GalleryItemData {
  isAdmin: boolean;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}

const GalleryItem: React.FC<GalleryItemProps> = ({ id, imageSrc, alt, category, title, date, isAdmin, onEdit, onDelete }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const parallaxRef = useRef<HTMLDivElement>(null);
  const isVisible = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible.current = entry.isIntersecting;
        if (entry.isIntersecting) {
            updateParallax(); 
        }
      },
      { rootMargin: "100px 0px" } 
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    let ticking = false;

    const updateParallax = () => {
      if (!containerRef.current || !parallaxRef.current || !isVisible.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const elementCenter = rect.top + rect.height / 2;
      const viewportCenter = viewportHeight / 2;
      const relativePosition = elementCenter - viewportCenter;
      const speed = 0.08;
      const offset = relativePosition * speed;
      parallaxRef.current.style.transform = `translateY(${offset}px)`;
    };

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          updateParallax();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', updateParallax, { passive: true });
    updateParallax();

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', updateParallax);
    };
  }, []);

  return (
    <div className="group relative overflow-hidden rounded-sm bg-transparent">
      <div 
        ref={containerRef}
        className="aspect-[4/3] overflow-hidden rounded-sm shadow-sm bg-gray-100 dark:bg-gray-900 relative isolate"
      >
        <div 
          ref={parallaxRef}
          className="absolute inset-[-10%] w-[120%] h-[120%] will-change-transform"
        >
          <img 
            alt={alt}
            loading="lazy"
            className="w-full h-full object-cover transition-all duration-700 ease-out group-hover:scale-110 grayscale group-hover:grayscale-0 opacity-90 group-hover:opacity-100" 
            src={imageSrc} 
          />
        </div>
        
        {/* Admin Overlay */}
        {isAdmin && (
          <div className="absolute top-2 right-2 flex gap-2 z-20">
             <button onClick={() => onEdit(id)} className="p-2 bg-white/90 rounded-full text-slate-800 hover:text-primary shadow-sm hover:scale-110 transition-transform">
                <span className="material-icons text-sm">edit</span>
             </button>
             <button onClick={() => onDelete(id)} className="p-2 bg-white/90 rounded-full text-slate-800 hover:text-red-600 shadow-sm hover:scale-110 transition-transform">
                <span className="material-icons text-sm">delete</span>
             </button>
          </div>
        )}
      </div>
      <div className="pt-8">
        <p className="text-xs font-medium text-primary tracking-[0.15em] uppercase mb-4 transition-colors duration-300 group-hover:text-amber-400">{category}</p>
        <h4 className="text-xl font-serif text-slate-800 dark:text-white font-light tracking-tight transition-colors duration-300 group-hover:text-primary">{title}</h4>
        <p className="mt-3 text-xs md:text-sm text-slate-500 dark:text-slate-400 font-light tracking-wide">{date}</p>
      </div>
    </div>
  );
};

const Carousel: React.FC<{ 
    slides: CarouselSlideData[]; 
    isAdmin: boolean;
    onEdit: (slide: CarouselSlideData) => void;
    onDelete: (id: number) => void;
    onAdd: () => void;
}> = ({ slides, isAdmin, onEdit, onDelete, onAdd }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // Guard against empty slides
  if (!slides || slides.length === 0) {
      return (
          <div className="relative w-full h-[400px] bg-slate-100 dark:bg-slate-800 rounded-sm mb-20 flex items-center justify-center">
             <div className="text-center">
                <p className="text-slate-500 mb-4">등록된 배너가 없습니다.</p>
                {isAdmin && (
                    <button onClick={onAdd} className="px-5 py-2 bg-primary text-slate-900 rounded-sm text-sm font-medium">
                        첫 배너 추가하기
                    </button>
                )}
             </div>
          </div>
      );
  }

  const safeIndex = currentIndex >= slides.length ? 0 : currentIndex;
  const currentSlide = slides[safeIndex];

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="relative w-full h-[400px] md:h-[600px] overflow-hidden rounded-sm mb-20 group bg-slate-900">
      {/* Slides Stacking Context for Cross-fade */}
      {slides.map((slide, index) => (
        <div 
            key={slide.id}
            className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${index === safeIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
        >
            <div 
                className="absolute inset-0 w-full h-full bg-cover bg-center"
                style={{ backgroundImage: `url(${slide.imageSrc})` }}
            />
            {/* Dark Overlay */}
            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors duration-300"></div>

            {/* Text Content */}
            <div className="absolute bottom-10 left-6 md:left-12 text-white p-4 max-w-lg z-20">
                <h4 
                    className={`text-3xl font-serif mb-2 drop-shadow-md transition-all duration-1000 delay-300 ${index === safeIndex ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
                >
                    {slide.title}
                </h4>
                <p 
                    className={`text-sm md:text-base font-light opacity-90 drop-shadow-sm transition-all duration-1000 delay-500 ${index === safeIndex ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
                >
                    {slide.desc}
                </p>
            </div>
        </div>
      ))}
      
      {/* Admin Controls */}
      {isAdmin && (
        <div className="absolute top-4 right-4 z-40 flex gap-2">
            <button 
                onClick={() => onEdit(currentSlide)} 
                className="p-2 bg-white/90 hover:bg-white rounded-full text-slate-800 shadow-md transition-all hover:scale-105"
                title="배너 수정"
            >
                <span className="material-icons text-sm">edit</span>
            </button>
            <button 
                onClick={() => onDelete(currentSlide.id)} 
                className="p-2 bg-white/90 hover:bg-white rounded-full text-red-600 shadow-md transition-all hover:scale-105"
                title="배너 삭제"
            >
                <span className="material-icons text-sm">delete</span>
            </button>
            <button 
                onClick={onAdd} 
                className="p-2 bg-primary/90 hover:bg-primary rounded-full text-slate-900 shadow-md transition-all hover:scale-105"
                title="새 배너 추가"
            >
                <span className="material-icons text-sm">add</span>
            </button>
        </div>
      )}

      {slides.length > 1 && (
        <>
            <button onClick={prevSlide} className="absolute top-1/2 left-4 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 flex items-center justify-center bg-white/10 hover:bg-white/30 rounded-full text-white backdrop-blur-sm transition-all z-30" aria-label="Previous slide">
                <span className="material-icons">chevron_left</span>
            </button>
            <button onClick={nextSlide} className="absolute top-1/2 right-4 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 flex items-center justify-center bg-white/10 hover:bg-white/30 rounded-full text-white backdrop-blur-sm transition-all z-30" aria-label="Next slide">
                <span className="material-icons">chevron_right</span>
            </button>
            
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2 z-30">
                {slides.map((_, idx) => (
                <button
                    key={idx}
                    onClick={() => setCurrentIndex(idx)}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${idx === safeIndex ? 'bg-white w-6' : 'bg-white/40 hover:bg-white/60'}`}
                />
                ))}
            </div>
        </>
      )}
    </div>
  );
};

// --- Editor Modal ---
type EditorMode = 'gallery' | 'slide';

interface EditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  initialData?: any;
  mode: EditorMode;
}

const EditorModal: React.FC<EditorModalProps> = ({ isOpen, onClose, onSave, initialData, mode }) => {
  // Common State
  const [formData, setFormData] = useState<any>({
    id: 0,
    imageSrc: '',
    title: '',
    // Gallery specific
    category: '',
    date: '',
    alt: '',
    // Slide specific
    desc: ''
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({
        id: Date.now(),
        imageSrc: '',
        title: '',
        category: '',
        date: '',
        alt: '',
        desc: ''
      });
    }
  }, [initialData, isOpen, mode]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
            setFormData({ ...formData, imageSrc: reader.result as string });
        };
        reader.readAsDataURL(file);
    }
  };

  if (!isOpen) return null;

  const isSlide = mode === 'slide';
  const titleText = isSlide ? (initialData ? '배너 수정' : '새 배너 추가') : (initialData ? '사진 수정' : '새 사진 추가');

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-slate-900 p-8 rounded-sm shadow-xl w-full max-w-lg relative max-h-[90vh] overflow-y-auto">
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
           <span className="material-icons">close</span>
        </button>
        <h3 className="font-serif text-xl text-slate-900 dark:text-white mb-6">{titleText}</h3>
        
        <div className="space-y-4">
           {/* Image Upload Section */}
           <div>
            <label className="text-xs text-slate-500 uppercase mb-2 block">Image</label>
            <div className="flex items-center gap-4 mb-3">
                <div className="w-16 h-16 rounded-md overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex-shrink-0 relative">
                    {formData.imageSrc ? (
                        <img src={formData.imageSrc} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-300">
                            <span className="material-icons">image</span>
                        </div>
                    )}
                </div>
                <div className="flex-1">
                    <label className="cursor-pointer inline-flex items-center gap-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 px-4 py-2 rounded-sm text-sm transition-colors mb-2">
                        <span className="material-icons text-sm">upload_file</span>
                        사진 파일 선택
                        <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                    </label>
                    <p className="text-[10px] text-slate-400">파일을 선택하거나 아래에 URL을 입력하세요.</p>
                </div>
            </div>
            <input 
                type="text" 
                value={formData.imageSrc} 
                onChange={e => setFormData({...formData, imageSrc: e.target.value})} 
                className="w-full p-2 border-b border-slate-300 dark:border-slate-700 bg-transparent outline-none focus:border-primary dark:text-white text-sm" 
                placeholder="https://..." 
            />
          </div>

          <div>
            <label className="text-xs text-slate-500 uppercase">Title</label>
            <input 
                type="text" 
                value={formData.title} 
                onChange={e => setFormData({...formData, title: e.target.value})} 
                className="w-full p-2 border-b border-slate-300 dark:border-slate-700 bg-transparent outline-none focus:border-primary dark:text-white" 
                placeholder="제목" 
            />
          </div>
          
          {isSlide ? (
             <div>
                <label className="text-xs text-slate-500 uppercase">Description</label>
                <textarea 
                    value={formData.desc} 
                    onChange={e => setFormData({...formData, desc: e.target.value})} 
                    rows={3}
                    className="w-full p-2 border-b border-slate-300 dark:border-slate-700 bg-transparent outline-none focus:border-primary resize-none dark:text-white" 
                    placeholder="설명 문구" 
                />
             </div>
          ) : (
             <>
                <div className="flex gap-4">
                    <div className="flex-1">
                        <label className="text-xs text-slate-500 uppercase">Category</label>
                        <input 
                            type="text" 
                            value={formData.category} 
                            onChange={e => setFormData({...formData, category: e.target.value})} 
                            className="w-full p-2 border-b border-slate-300 dark:border-slate-700 bg-transparent outline-none focus:border-primary dark:text-white" 
                            placeholder="예: Easter" 
                        />
                    </div>
                    <div className="flex-1">
                        <label className="text-xs text-slate-500 uppercase">Date</label>
                        <input 
                            type="text" 
                            value={formData.date} 
                            onChange={e => setFormData({...formData, date: e.target.value})} 
                            className="w-full p-2 border-b border-slate-300 dark:border-slate-700 bg-transparent outline-none focus:border-primary dark:text-white" 
                            placeholder="예: 2023년 4월" 
                        />
                    </div>
                </div>
                <div>
                    <label className="text-xs text-slate-500 uppercase">Alt Text (Accessibility)</label>
                    <input 
                        type="text" 
                        value={formData.alt} 
                        onChange={e => setFormData({...formData, alt: e.target.value})} 
                        className="w-full p-2 border-b border-slate-300 dark:border-slate-700 bg-transparent outline-none focus:border-primary dark:text-white" 
                        placeholder="이미지 설명" 
                    />
                </div>
             </>
          )}
        </div>

        <button onClick={() => onSave(formData)} className="w-full mt-8 bg-slate-900 dark:bg-white text-white dark:text-slate-900 py-3 rounded-sm hover:opacity-90 transition-opacity">
          저장하기
        </button>
      </div>
    </div>
  );
};


const Gallery: React.FC = () => {
  const { isAdmin } = useAdmin();
  const [isVisible, setIsVisible] = useState(false);
  
  // Data States
  const [slides, setSlides] = useState<CarouselSlideData[]>([]);
  const [items, setItems] = useState<GalleryItemData[]>([]);
  
  const titleRef = useRef<HTMLDivElement>(null);
  
  // Modal State
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editorMode, setEditorMode] = useState<EditorMode>('gallery');
  const [editingItem, setEditingItem] = useState<any>(undefined);

  useEffect(() => {
    // Load Slides
    const savedSlides = localStorage.getItem('shingwang_carousel');
    if (savedSlides) {
        setSlides(JSON.parse(savedSlides));
    } else {
        setSlides(initialSlides);
    }

    // Load Gallery Items
    const savedGallery = localStorage.getItem('shingwang_gallery');
    if (savedGallery) {
        setItems(JSON.parse(savedGallery));
    } else {
        setItems(initialGalleryData);
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

  // Persist Slides
  useEffect(() => {
    if (slides.length > 0) {
        localStorage.setItem('shingwang_carousel', JSON.stringify(slides));
    }
  }, [slides]);

  // Persist Gallery Items
  useEffect(() => {
    if (items.length > 0) {
        localStorage.setItem('shingwang_gallery', JSON.stringify(items));
    }
  }, [items]);

  // --- Handlers for Slides ---
  const handleAddSlide = () => {
    setEditorMode('slide');
    setEditingItem(undefined);
    setIsEditorOpen(true);
  };

  const handleEditSlide = (slide: CarouselSlideData) => {
    setEditorMode('slide');
    setEditingItem(slide);
    setIsEditorOpen(true);
  };

  const handleDeleteSlide = (id: number) => {
    if (window.confirm("정말로 이 배너를 삭제하시겠습니까?")) {
        setSlides(prev => prev.filter(s => s.id !== id));
    }
  };

  // --- Handlers for Gallery Items ---
  const handleAddItem = () => {
    setEditorMode('gallery');
    setEditingItem(undefined);
    setIsEditorOpen(true);
  };

  const handleEditItem = (id: number) => {
    const item = items.find(i => i.id === id);
    if (item) {
        setEditorMode('gallery');
        setEditingItem(item);
        setIsEditorOpen(true);
    }
  };

  const handleDeleteItem = (id: number) => {
    if (window.confirm("정말로 이 사진을 삭제하시겠습니까?")) {
        setItems(prev => prev.filter(item => item.id !== id));
    }
  };

  // --- Common Save Handler ---
  const handleSave = (data: any) => {
    if (editorMode === 'slide') {
        if (editingItem) {
            setSlides(prev => prev.map(s => s.id === data.id ? data : s));
        } else {
            setSlides(prev => [...prev, data]);
        }
    } else {
        if (editingItem) {
            setItems(prev => prev.map(item => item.id === data.id ? data : item));
        } else {
            setItems(prev => [data, ...prev]);
        }
    }
    setIsEditorOpen(false);
  };

  return (
    <section className="py-40 px-6 bg-background-light dark:bg-background-dark" id="praise-videos">
      <div className="max-w-7xl mx-auto">
        <div ref={titleRef} className={`text-center mb-16 space-y-6 transition-all duration-1000 ${isVisible ? 'animate-fade-in-up' : 'opacity-0 translate-y-8'}`}>
          <h3 className="font-serif text-3xl md:text-5xl text-slate-900 dark:text-white font-light leading-snug tracking-tight">예배와 찬양</h3>
          <p className="text-slate-600 dark:text-slate-400 font-light tracking-widest text-sm md:text-base">주님을 향한 우리의 섬김.</p>
        </div>
        
        <Carousel 
            slides={slides} 
            isAdmin={isAdmin}
            onEdit={handleEditSlide}
            onDelete={handleDeleteSlide}
            onAdd={handleAddSlide}
        />

        {isAdmin && (
            <div className="flex justify-end mb-8">
                <button onClick={handleAddItem} className="flex items-center gap-2 px-5 py-2.5 bg-primary text-slate-900 rounded-sm hover:bg-amber-400 transition-colors shadow-sm text-sm font-medium">
                    <span className="material-icons text-sm">add_a_photo</span>
                    사진 추가
                </button>
            </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mt-20">
          {items.map(item => (
             <GalleryItem 
                key={item.id}
                {...item}
                isAdmin={isAdmin}
                onEdit={handleEditItem}
                onDelete={handleDeleteItem}
             />
          ))}
        </div>
      </div>
      
      <EditorModal 
         isOpen={isEditorOpen}
         mode={editorMode}
         onClose={() => setIsEditorOpen(false)}
         onSave={handleSave}
         initialData={editingItem}
      />
    </section>
  );
};

export default Gallery;
