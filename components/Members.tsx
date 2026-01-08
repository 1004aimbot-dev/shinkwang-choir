import React, { useState, useEffect, useRef } from 'react';
import { useAdmin } from '../contexts/AdminContext';

// Interfaces
type VoicePartType = 'Leader' | 'Soprano' | 'Alto' | 'Tenor' | 'Bass';

interface MemberProfile {
  id: number;
  name: string;
  role?: string;
  part: VoicePartType;
  imageSrc: string;
  bio: string; 
}

interface VoiceGroupProps {
  part: string;
  members: MemberProfile[];
  onMemberClick: (member: MemberProfile) => void;
  isAdmin: boolean;
  onEdit: (member: MemberProfile) => void;
  onDelete: (id: number) => void;
  onAdd: () => void;
  onSort: () => void;
}

const initialMembers: MemberProfile[] = [
  {
    id: 1,
    name: "김민수",
    role: "지휘자",
    part: 'Leader',
    imageSrc: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80",
    bio: "지난 20여 년간 지휘봉을 잡으며 깨달은 것은, 최고의 음악은 최고의 영성에서 나온다는 사실입니다. 단순히 소리를 맞추는 것을 넘어, 하나님이 기뻐하시는 거룩한 울림을 만들어가기 위해 매주 대원들과 함께 호흡합니다."
  },
  {
    id: 2,
    name: "이지영",
    role: "반주자",
    part: 'Leader',
    imageSrc: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=300&q=80",
    bio: "피아노 건반 하나하나에 기도를 담습니다. 반주자는 단순히 노래를 돕는 역할이 아니라, 예배의 분위기를 영적으로 조율하는 사명자라고 생각합니다."
  },
  {
    id: 3,
    name: "박준형",
    role: "부지휘자",
    part: 'Leader',
    imageSrc: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=300&q=80",
    bio: "젊은 열정으로 찬양대에 새로운 활력을 불어넣고 있습니다. 지휘자님을 보필하며 파트 연습을 체계적으로 이끌고, 특히 청년 대원들이 찬양대 안에서 잘 정착할 수 있도록 멘토링하는 역할에 큰 보람을 느낍니다."
  },
  { id: 4, part: 'Soprano', name: "박소희", imageSrc: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80", bio: "소프라노 파트장으로서 가장 높은 음역을 담당하지만, 마음은 가장 겸손한 자세를 잃지 않으려 노력합니다." },
  { id: 5, part: 'Soprano', name: "김지은", imageSrc: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80", bio: "모태신앙이 아니었기에 찬양의 가사 한 구절 한 구절이 제게는 더욱 절실하게 다가옵니다." },
  { id: 6, part: 'Soprano', name: "최하나", imageSrc: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=150&q=80", bio: "어린 시절 주일학교 성가대부터 시작해 지금까지 찬양의 자리를 떠나지 않았습니다." },
  { id: 7, part: 'Soprano', name: "이수진", imageSrc: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=150&q=80", bio: "처음 교회에 나왔을 때, 찬양대의 찬양을 듣고 하염없이 눈물을 흘렸던 기억이 납니다." },
  { id: 8, part: 'Alto', name: "정미경", imageSrc: "https://images.unsplash.com/photo-1554151228-14d9def656ec?auto=format&fit=crop&w=150&q=80", bio: "알토는 멜로디를 빛나게 해주는 어머니와 같은 파트입니다." },
  { id: 9, part: 'Alto', name: "한예슬", imageSrc: "https://images.unsplash.com/photo-1598550874175-4d7112ee7f43?auto=format&fit=crop&w=150&q=80", bio: "음악 전공자로서 자칫 기술적인 부분에만 치우칠 수 있음을 늘 경계합니다." },
  { id: 10, part: 'Alto', name: "강민지", imageSrc: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&q=80", bio: "치열한 직장 생활 속에서 지치고 상한 마음을 안고 주일 예배에 옵니다." }, 
  { id: 11, part: 'Alto', name: "윤서연", imageSrc: "https://images.unsplash.com/photo-1520813792240-56fc4a3765a7?auto=format&fit=crop&w=150&q=80", bio: "육아로 인해 잠시 내려놓았던 찬양의 자리에 다시 섰을 때의 감격을 잊을 수 없습니다." },
  { id: 12, part: 'Tenor', name: "김동현", imageSrc: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80", bio: "테너는 찬양의 화려함과 호소력을 담당한다고 생각합니다." },
  { id: 13, part: 'Tenor', name: "이준호", imageSrc: "https://images.unsplash.com/photo-1504257432389-52343af06ae3?auto=format&fit=crop&w=150&q=80", bio: "사회에서는 각자의 위치에서 치열하게 살아가지만, 이곳에서는 '형제'라는 이름으로 하나가 됩니다." },
  { id: 14, part: 'Tenor', name: "박성우", imageSrc: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=150&q=80", bio: "할아버지, 아버지에 이어 3대째 찬양대로 섬기고 있습니다." },
  { id: 15, part: 'Bass', name: "최영재", imageSrc: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80", bio: "건물의 기초가 튼튼해야 하듯, 베이스는 찬양의 영적, 음악적 토대를 담당합니다." },
  { id: 16, part: 'Bass', name: "임현우", imageSrc: "https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?auto=format&fit=crop&w=150&q=80", bio: "세상에서는 내 목소리를 높여야 살아남지만, 찬양대에서는 내 소리를 낮추고 남의 소리를 들어야 조화가 이루어짐을 배웁니다." },
  { id: 17, part: 'Bass', name: "김상훈", imageSrc: "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?auto=format&fit=crop&w=150&q=80", bio: "은퇴 후 제2의 인생을 찬양 봉사로 시작했습니다. 늦은 나이에 악보를 보는 것이 쉽지는 않지만..." },
];

// --- Components ---

const MemberEditorModal: React.FC<{ isOpen: boolean; onClose: () => void; onSave: (data: MemberProfile) => void; initialData?: MemberProfile; defaultPart?: VoicePartType }> = ({ isOpen, onClose, onSave, initialData, defaultPart }) => {
  const [formData, setFormData] = useState<MemberProfile>({
    id: 0,
    name: '',
    part: defaultPart || 'Soprano',
    role: '',
    imageSrc: '',
    bio: ''
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({
        id: Date.now(),
        name: '',
        part: defaultPart || 'Soprano',
        role: '',
        imageSrc: '',
        bio: ''
      });
    }
  }, [initialData, isOpen, defaultPart]);

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

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-slate-900 p-8 rounded-sm shadow-xl w-full max-w-lg relative max-h-[90vh] overflow-y-auto">
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
           <span className="material-icons">close</span>
        </button>
        <h3 className="font-serif text-xl text-slate-900 dark:text-white mb-6">{initialData ? '대원 정보 수정' : '새 대원 추가'}</h3>
        
        <div className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-1">
                <label className="text-xs text-slate-500 uppercase">Part</label>
                <select 
                    value={formData.part} 
                    onChange={e => setFormData({...formData, part: e.target.value as VoicePartType})}
                    className="w-full p-2 border-b border-slate-300 dark:border-slate-700 bg-transparent outline-none focus:border-primary dark:text-white dark:bg-slate-800"
                >
                    <option value="Leader">Leadership</option>
                    <option value="Soprano">Soprano</option>
                    <option value="Alto">Alto</option>
                    <option value="Tenor">Tenor</option>
                    <option value="Bass">Bass</option>
                </select>
            </div>
            <div className="flex-1">
                <label className="text-xs text-slate-500 uppercase">Name</label>
                <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full p-2 border-b border-slate-300 dark:border-slate-700 bg-transparent outline-none focus:border-primary dark:text-white" />
            </div>
          </div>
          <div>
            <label className="text-xs text-slate-500 uppercase">Role (Optional)</label>
            <input type="text" value={formData.role || ''} onChange={e => setFormData({...formData, role: e.target.value})} className="w-full p-2 border-b border-slate-300 dark:border-slate-700 bg-transparent outline-none focus:border-primary dark:text-white" placeholder="예: 지휘자, 파트장" />
          </div>
          
          {/* Image Upload Section */}
          <div>
            <label className="text-xs text-slate-500 uppercase mb-2 block">Profile Image</label>
            <div className="flex items-center gap-4 mb-3">
                <div className="w-16 h-16 rounded-full overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex-shrink-0 relative">
                    {formData.imageSrc ? (
                        <img src={formData.imageSrc} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-300">
                            <span className="material-icons">person</span>
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
            <label className="text-xs text-slate-500 uppercase">Bio</label>
            <textarea value={formData.bio} onChange={e => setFormData({...formData, bio: e.target.value})} rows={4} className="w-full p-2 border-b border-slate-300 dark:border-slate-700 bg-transparent outline-none focus:border-primary resize-none dark:text-white" />
          </div>
        </div>

        <button onClick={() => onSave(formData)} className="w-full mt-8 bg-slate-900 dark:bg-white text-white dark:text-slate-900 py-3 rounded-sm hover:opacity-90 transition-opacity">
          저장하기
        </button>
      </div>
    </div>
  );
};

const MemberModal: React.FC<{ member: MemberProfile | null; onClose: () => void }> = ({ member, onClose }) => {
  const [isRendered, setIsRendered] = useState(false);
  const [displayMember, setDisplayMember] = useState<MemberProfile | null>(null);

  useEffect(() => {
    if (member) {
        setDisplayMember(member);
        setIsRendered(true);
    }
  }, [member]);

  const handleAnimationEnd = () => {
    if (!member) setIsRendered(false);
  };

  if (!isRendered) return null;

  const content = displayMember;

  return (
    <div 
      className={`fixed inset-0 z-[100] flex items-center justify-center p-4 transition-all duration-300 ${member ? 'opacity-100' : 'opacity-0'}`}
      onTransitionEnd={handleAnimationEnd}
    >
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      <div 
        className={`relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-sm shadow-2xl overflow-hidden transform transition-all duration-300 ${member ? 'scale-100 translate-y-0' : 'scale-95 translate-y-8'}`}
      >
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-black/10 dark:bg-white/10 hover:bg-black/20 dark:hover:bg-white/20 text-slate-800 dark:text-white transition-colors"
        >
          <span className="material-icons">close</span>
        </button>

        <div className="flex flex-col md:flex-row">
          <div className="w-full md:w-1/2 aspect-square md:aspect-auto relative">
            <img 
              src={content?.imageSrc} 
              alt={content?.name} 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent md:hidden"></div>
            <div className="absolute bottom-4 left-4 text-white md:hidden">
                <h3 className="font-serif text-2xl font-bold">{content?.name}</h3>
                <p className="text-primary text-sm font-medium uppercase tracking-widest">{content?.role || content?.part}</p>
            </div>
          </div>
          <div className="w-full md:w-1/2 p-8 md:p-10 flex flex-col justify-center">
            <div className="hidden md:block mb-6">
                <p className="text-primary text-xs font-bold uppercase tracking-[0.2em] mb-2">{content?.role || content?.part}</p>
                <h3 className="font-serif text-3xl text-slate-900 dark:text-white">{content?.name}</h3>
            </div>
            
            <div className="w-10 h-px bg-slate-300 dark:bg-slate-700 mb-6 hidden md:block"></div>
            
            <div className="prose dark:prose-invert">
                <p className="text-slate-600 dark:text-slate-300 font-light leading-loose text-sm md:text-base keep-all">
                    "{content?.bio}"
                </p>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 flex items-center gap-3">
                <span className="material-icons text-slate-400 text-sm">church</span>
                <span className="text-xs text-slate-500 uppercase tracking-wider">Seongnam Shingwang Church</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const LeaderCard: React.FC<MemberProfile & { onClick: () => void; isAdmin: boolean; onEdit: (m: MemberProfile) => void; onDelete: (id: number) => void }> = ({ id, name, role, imageSrc, onClick, isAdmin, onEdit, onDelete, ...props }) => (
  <figure 
    className="flex flex-col items-center group animate-fade-in select-none cursor-pointer relative"
  >
    <div className="relative w-40 h-40 md:w-48 md:h-48 mb-6 rounded-full overflow-hidden shadow-lg border-2 border-transparent group-hover:border-primary/50 transition-all duration-500" onClick={onClick}>
      <img 
        src={imageSrc} 
        alt={name} 
        className="w-full h-full object-cover filter grayscale group-hover:grayscale-0 transition-all duration-500 transform group-hover:scale-110 pointer-events-none"
      />
      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
        <span className="material-icons text-white text-3xl drop-shadow-lg">visibility</span>
      </div>
    </div>
    <figcaption className="text-center" onClick={onClick}>
        <h4 className="font-serif text-2xl text-slate-900 dark:text-white font-normal mb-1 tracking-tight group-hover:text-primary transition-colors">{name}</h4>
        <p className="text-sm text-primary font-medium tracking-widest uppercase">{role}</p>
    </figcaption>

    {isAdmin && (
       <div className="absolute top-0 right-0 flex flex-col gap-2 z-20">
          <button onClick={(e) => { e.stopPropagation(); onEdit({ id, name, role, imageSrc, ...props } as MemberProfile); }} className="p-2 bg-white rounded-full shadow-md text-slate-600 hover:text-primary transition-colors">
             <span className="material-icons text-xs">edit</span>
          </button>
          <button onClick={(e) => { e.stopPropagation(); onDelete(id); }} className="p-2 bg-white rounded-full shadow-md text-slate-600 hover:text-red-500 transition-colors">
             <span className="material-icons text-xs">delete</span>
          </button>
       </div>
    )}
  </figure>
);

const LeaderCarousel: React.FC<{ leaders: MemberProfile[]; onMemberClick: (member: MemberProfile) => void; isAdmin: boolean; onEdit: (m: MemberProfile) => void; onDelete: (id: number) => void }> = ({ leaders, onMemberClick, isAdmin, onEdit, onDelete }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Safe index check
  const safeIndex = currentIndex >= leaders.length ? 0 : currentIndex;

  if (leaders.length === 0) return <div className="text-center py-10 text-slate-400">등록된 리더가 없습니다.</div>;

  const nextSlide = () => setCurrentIndex((prev) => (prev + 1) % leaders.length);
  const prevSlide = () => setCurrentIndex((prev) => (prev - 1 + leaders.length) % leaders.length);

  return (
    <div className="relative max-w-lg mx-auto px-12">
      <button onClick={prevSlide} className="absolute left-0 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-gray-800 text-slate-400 dark:text-slate-600 transition-colors z-10" aria-label="Previous Leader">
        <span className="material-icons">chevron_left</span>
      </button>

      <div className="w-full flex justify-center py-4">
        <div>
           <LeaderCard 
              {...leaders[safeIndex]} 
              onClick={() => onMemberClick(leaders[safeIndex])}
              isAdmin={isAdmin}
              onEdit={onEdit}
              onDelete={onDelete}
           />
        </div>
      </div>

      <button onClick={nextSlide} className="absolute right-0 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-gray-800 text-slate-400 dark:text-slate-600 transition-colors z-10" aria-label="Next Leader">
        <span className="material-icons">chevron_right</span>
      </button>

      <div className="flex justify-center gap-2 mt-8">
        {leaders.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${idx === safeIndex ? 'bg-primary w-6' : 'bg-slate-300 dark:bg-slate-700 hover:bg-primary/50'}`}
          />
        ))}
      </div>
    </div>
  );
};

const VoicePart: React.FC<VoiceGroupProps> = ({ part, members, onMemberClick, isAdmin, onEdit, onDelete, onAdd, onSort }) => (
  <div className="text-center">
    <div className="relative inline-block mb-8">
        <h5 className="font-serif text-xl text-slate-800 dark:text-white font-light tracking-widest">
            {part}
        </h5>
        <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-8 h-px bg-slate-300 dark:bg-slate-700"></span>
        {isAdmin && (
            <div className="absolute left-full ml-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                 <button onClick={onSort} className="w-6 h-6 flex items-center justify-center bg-slate-100 hover:bg-slate-200 text-slate-500 rounded-full transition-colors shadow-sm" title={`${part} 이름순 정렬`}>
                    <span className="material-icons text-[10px]">sort_by_alpha</span>
                </button>
                <button onClick={onAdd} className="w-6 h-6 flex items-center justify-center bg-slate-100 hover:bg-primary hover:text-white rounded-full transition-colors text-slate-400 shadow-sm" title={`${part} 대원 추가`}>
                    <span className="material-icons text-[10px]">add</span>
                </button>
            </div>
        )}
    </div>
    
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-6 gap-y-10 justify-items-center">
      {members.map((member) => (
        <figure 
          key={member.id} 
          className="flex flex-col items-center group w-24 cursor-pointer relative"
        >
          <div className="w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden bg-slate-100 dark:bg-slate-800 mb-3 relative shadow-md" onClick={() => onMemberClick(member)}>
             <img 
                src={member.imageSrc} 
                alt={member.name}
                className="w-full h-full object-cover opacity-80 group-hover:opacity-100 filter grayscale group-hover:grayscale-0 transition-all duration-300 pointer-events-none"
             />
             <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </div>
          <figcaption onClick={() => onMemberClick(member)}>
            <p className="text-sm text-slate-700 dark:text-slate-300 font-light tracking-wide group-hover:text-primary transition-colors text-center decoration-slate-300 group-hover:underline underline-offset-4 decoration-1">{member.name}</p>
          </figcaption>

          {isAdmin && (
            <div className="absolute -top-2 -right-2 flex gap-1 z-20">
                <button onClick={(e) => { e.stopPropagation(); onEdit(member); }} className="w-6 h-6 flex items-center justify-center bg-white rounded-full shadow-sm text-slate-600 hover:text-primary transition-colors">
                    <span className="material-icons text-[10px]">edit</span>
                </button>
                <button onClick={(e) => { e.stopPropagation(); onDelete(member.id); }} className="w-6 h-6 flex items-center justify-center bg-white rounded-full shadow-sm text-slate-600 hover:text-red-500 transition-colors">
                    <span className="material-icons text-[10px]">close</span>
                </button>
            </div>
          )}
        </figure>
      ))}
    </div>
  </div>
);

const Members: React.FC = () => {
  const { isAdmin } = useAdmin();
  const [isVisible, setIsVisible] = useState(false);
  const [members, setMembers] = useState<MemberProfile[]>([]);
  const [selectedMember, setSelectedMember] = useState<MemberProfile | null>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);

  // Editor State
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<MemberProfile | undefined>(undefined);
  const [targetPart, setTargetPart] = useState<VoicePartType>('Soprano');

  useEffect(() => {
    const saved = localStorage.getItem('shingwang_members');
    if (saved) {
        setMembers(JSON.parse(saved));
    } else {
        setMembers(initialMembers);
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

  useEffect(() => {
    if (members.length > 0) {
        localStorage.setItem('shingwang_members', JSON.stringify(members));
    }
  }, [members]);

  // CRUD Handlers
  const handleDelete = (id: number) => {
    if (window.confirm("정말로 이 대원을 삭제하시겠습니까?")) {
        setMembers(prev => prev.filter(m => m.id !== id));
    }
  };

  const handleEdit = (member: MemberProfile) => {
    setEditingMember(member);
    setTargetPart(member.part);
    setIsEditorOpen(true);
  };

  const handleAdd = (part: VoicePartType) => {
    setEditingMember(undefined);
    setTargetPart(part);
    setIsEditorOpen(true);
  };

  const handleSort = (part: string) => {
    if (window.confirm(`${part} 파트 대원들을 이름순(가나다)으로 정렬하시겠습니까?`)) {
        setMembers(prev => {
            const partMembers = prev.filter(m => m.part === part);
            const otherMembers = prev.filter(m => m.part !== part);
            
            partMembers.sort((a, b) => a.name.localeCompare(b.name, 'ko'));
            
            return [...otherMembers, ...partMembers];
        });
    }
  };

  const handleSave = (data: MemberProfile) => {
    if (editingMember) {
        setMembers(prev => prev.map(m => m.id === data.id ? data : m));
    } else {
        setMembers(prev => [...prev, data]);
    }
    setIsEditorOpen(false);
  };

  const getMembersByPart = (part: string) => members.filter(m => m.part === part);

  return (
    <>
      <section className="py-40 px-6 bg-background-light dark:bg-background-dark">
        <div className="max-w-6xl mx-auto">
          <h3 
            ref={titleRef} 
            className={`font-serif text-3xl md:text-4xl text-center text-slate-900 dark:text-white mb-24 font-light tracking-tight transition-all duration-1000 ${isVisible ? 'animate-fade-in-up' : 'opacity-0 translate-y-8'}`}
          >
            섬기는 분들
          </h3>
          
          <div className="space-y-24">
            {/* Leaders Section */}
            <div className="text-center relative">
              <h4 className="text-xs md:text-sm font-normal uppercase tracking-[0.25em] text-slate-400 mb-12 inline-block relative">
                 Leadership
                 {isAdmin && (
                    <button onClick={() => handleAdd('Leader')} className="absolute -right-8 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center bg-slate-100 hover:bg-primary hover:text-white rounded-full transition-colors text-slate-400 shadow-sm" title="리더 추가">
                        <span className="material-icons text-xs">add</span>
                    </button>
                 )}
              </h4>
              <LeaderCarousel 
                 leaders={getMembersByPart('Leader')} 
                 onMemberClick={setSelectedMember} 
                 isAdmin={isAdmin}
                 onEdit={handleEdit}
                 onDelete={handleDelete}
              />
            </div>
            
            <div className="w-px h-24 bg-gradient-to-b from-transparent via-slate-200 dark:via-gray-800 to-transparent mx-auto"></div>
            
            {/* Voices Section */}
            <div>
              <h4 className="text-xs md:text-sm font-normal uppercase tracking-[0.25em] text-slate-400 mb-16 text-center">Voices</h4>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-20">
                <VoicePart 
                    part="Soprano" 
                    members={getMembersByPart('Soprano')} 
                    onMemberClick={setSelectedMember} 
                    isAdmin={isAdmin}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onAdd={() => handleAdd('Soprano')}
                    onSort={() => handleSort('Soprano')}
                />
                <VoicePart 
                    part="Alto" 
                    members={getMembersByPart('Alto')} 
                    onMemberClick={setSelectedMember} 
                    isAdmin={isAdmin}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onAdd={() => handleAdd('Alto')}
                    onSort={() => handleSort('Alto')}
                />
                <VoicePart 
                    part="Tenor" 
                    members={getMembersByPart('Tenor')} 
                    onMemberClick={setSelectedMember} 
                    isAdmin={isAdmin}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onAdd={() => handleAdd('Tenor')}
                    onSort={() => handleSort('Tenor')}
                />
                <VoicePart 
                    part="Bass" 
                    members={getMembersByPart('Bass')} 
                    onMemberClick={setSelectedMember} 
                    isAdmin={isAdmin}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onAdd={() => handleAdd('Bass')}
                    onSort={() => handleSort('Bass')}
                />
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <MemberModal member={selectedMember} onClose={() => setSelectedMember(null)} />
      
      <MemberEditorModal 
        isOpen={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
        onSave={handleSave}
        initialData={editingMember}
        defaultPart={targetPart}
      />
    </>
  );
};

export default Members;