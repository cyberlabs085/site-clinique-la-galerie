import React, { useState, useEffect, useRef } from 'react';
import {
  Calendar,
  Clock,
  Phone,
  MapPin,
  CheckCircle2,
  Sparkles,
  Shield,
  Activity,
  ChevronRight,
  ChevronLeft,
  Star,
  ArrowRight,
  X,
  Send,
  HelpCircle,
  Smile,
  Zap,
  Award,
  Layers,
  ChevronDown,
  Eye,
  Sliders,
  Scan,
  Check,
  HeartHandshake,
  UserCheck,
  RotateCw,
  RotateCcw,
  Menu
} from 'lucide-react';

import dentalBefore from './assets/dental_before.jpg';
import dentalAfter from './assets/dental_after.jpg';
import clinicConsultation from './assets/clinic_consultation.jpg';
import clinicCare from './assets/clinic_care.jpg';

export default function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCare, setSelectedCare] = useState('Facettes Céramique & Smile Design');
  const [selectedDate, setSelectedDate] = useState('Demain');
  const [selectedSlot, setSelectedSlot] = useState('11:00');
  const [patientName, setPatientName] = useState('');
  const [patientPhone, setPatientPhone] = useState('');
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [activeFaq, setActiveFaq] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isHeroCalendarOpen, setIsHeroCalendarOpen] = useState(false);
  const [isModalCalendarOpen, setIsModalCalendarOpen] = useState(false);
  const [isHeroTimeOpen, setIsHeroTimeOpen] = useState(false);
  const [isModalTimeOpen, setIsModalTimeOpen] = useState(false);

  // Créneaux horaires de consultation
  const morningSlots = ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00'];
  const afternoonSlots = ['14:30', '15:00', '15:30', '16:00', '16:30', '17:00'];

  // Prochains 7 jours ouvrés pour le calendrier de réservation
  const upcomingDays = React.useMemo(() => {
    const list = [];
    const dayNames = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
    const shortDays = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
    const months = ['Janv', 'Févr', 'Mars', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sept', 'Oct', 'Nov', 'Déc'];

    const now = new Date();
    for (let i = 1; i <= 7; i++) {
      const d = new Date(now);
      d.setDate(now.getDate() + i);
      const isSunday = d.getDay() === 0;
      list.push({
        shortDay: shortDays[d.getDay()],
        dayNum: d.getDate(),
        month: months[d.getMonth()],
        isSunday,
        label: `${dayNames[d.getDay()]} ${d.getDate()} ${months[d.getMonth()]}`
      });
    }
    return list;
  }, []);

  // Plateau Technique Auto-Cycle State (0: Scanner, 1: Simulation, 2: Anesthésie)
  const [activePlateauIndex, setActivePlateauIndex] = useState(0);
  const [plateauProgress, setPlateauProgress] = useState(0);
  const [isPlateauPaused, setIsPlateauPaused] = useState(false);
  const [isCardFlipped, setIsCardFlipped] = useState(false); // Pivotement 3D Recto/Verso

  // Before/After Slider State with Auto-Gliding Animation
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isUserDragging, setIsUserDragging] = useState(false);

  // Dynamic Testimonial Carousel State
  const [activeTestimonialIdx, setActiveTestimonialIdx] = useState(0);
  const [isTestimonialAutoplay, setIsTestimonialAutoplay] = useState(true);

  // Animated Counters for Hero
  const [counterSatisfaction, setCounterSatisfaction] = useState(0);
  const [counterPrecision, setCounterPrecision] = useState(0);

  // Canvas Refs
  const canvasRef = useRef(null);
  const cursorAuraRef = useRef(null);

  // 1. Mouse Follower Aura (Subtle luxury glow on desktop)
  useEffect(() => {
    const handleMouseMoveGlobal = (e) => {
      if (cursorAuraRef.current) {
        cursorAuraRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
      }
    };
    window.addEventListener('mousemove', handleMouseMoveGlobal);
    return () => window.removeEventListener('mousemove', handleMouseMoveGlobal);
  }, []);

  // 2. Animated Counters on mount
  useEffect(() => {
    const duration = 1800;
    const startTime = Date.now();

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      setCounterSatisfaction(Number((ease * 99.4).toFixed(1)));
      setCounterPrecision(Math.round(ease * 15));

      if (progress >= 1) clearInterval(interval);
    }, 30);

    return () => clearInterval(interval);
  }, []);

  // 3. Auto-Cycle the 3 Innovation Cards (6 seconds per card, paused when user flips card to read)
  useEffect(() => {
    if (isPlateauPaused || isCardFlipped) return;
    const DURATION = 6000;
    let startTime = Date.now();

    const timer = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min((elapsed / DURATION) * 100, 100);
      setPlateauProgress(pct);

      if (elapsed >= DURATION) {
        startTime = Date.now();
        setActivePlateauIndex((prev) => (prev + 1) % 3);
        setPlateauProgress(0);
        setIsCardFlipped(false);
      }
    }, 40);

    return () => clearInterval(timer);
  }, [activePlateauIndex, isPlateauPaused, isCardFlipped]);

  // 4. Auto-Glide Slider for Before / After
  useEffect(() => {
    if (isUserDragging || activePlateauIndex !== 1) return;
    let angle = 0;
    const glideTimer = setInterval(() => {
      angle += 0.035;
      const pos = 50 + Math.sin(angle) * 32;
      setSliderPosition(pos);
    }, 35);
    return () => clearInterval(glideTimer);
  }, [isUserDragging, activePlateauIndex]);

  // 5. Autoplay Testimonial Carousel
  useEffect(() => {
    if (!isTestimonialAutoplay) return;
    const timer = setInterval(() => {
      setActiveTestimonialIdx((prev) => (prev + 1) % 6);
    }, 4500);
    return () => clearInterval(timer);
  }, [isTestimonialAutoplay]);

  // 6. Canvas 3D Medical Radar Background
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationId;
    let width = (canvas.width = canvas.parentElement.offsetWidth);
    let height = (canvas.height = canvas.parentElement.offsetHeight);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.offsetWidth;
      height = canvas.height = canvas.parentElement.offsetHeight;
    };
    window.addEventListener('resize', handleResize);

    const particles = Array.from({ length: 42 }, (_, i) => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.45,
      vy: (Math.random() - 0.5) * 0.45,
      radius: Math.random() * 2 + 1,
      color: i % 2 === 0 ? 'rgba(2, 132, 199, 0.5)' : 'rgba(16, 185, 129, 0.4)'
    }));

    let angle = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      angle += 0.01;
      const cx = width * 0.82;
      const cy = height * 0.42;
      const radius = 240;

      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(2, 132, 199, 0.09)';
      ctx.lineWidth = 1;
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(cx, cy, radius * 0.55, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(2, 132, 199, 0.07)';
      ctx.stroke();

      particles.forEach((p, idx) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();

        for (let j = idx + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dist = Math.hypot(p.x - p2.x, p.y - p2.y);
          if (dist < 95) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(2, 132, 199, ${0.14 * (1 - dist / 95)})`;
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }
      });

      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationId);
    };
  }, []);

  // 3D Tilt Card handler
  const handleMouseMove = (e, cardId) => {
    const card = document.getElementById(cardId);
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -6;
    const rotateY = ((x - centerX) / centerX) * 6;

    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    card.style.setProperty('--mouse-x', `${(x / rect.width) * 100}%`);
    card.style.setProperty('--mouse-y', `${(y / rect.height) * 100}%`);
  };

  const handleMouseLeave = (cardId) => {
    const card = document.getElementById(cardId);
    if (!card) return;
    card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
  };

  // 6 Pôles de Soins Signature
  const soins = [
    {
      id: 'soin-1',
      title: 'Facettes Céramique & Smile Design',
      category: 'HAUTE ESTHÉTIQUE',
      desc: 'Conception sur-mesure de votre sourire idéal. Céramique biocompatible ultra-fine, translucidité naturelle et résultat définitif en 2 séances.',
      badge: 'Signature Almadies',
      delay: '2 Rendez-vous',
      tagColor: 'text-[#0284C7] bg-[#E0F2FE]'
    },
    {
      id: 'soin-2',
      title: 'Implantologie Guidée 3D',
      category: 'CHIRURGIE AVANCÉE',
      desc: 'Remplacement dentaire fixe avec planification informatique 3D. Chirurgie mini-invasive sans douleur et intégration osseuse ultra-rapide.',
      badge: 'Zéro Douleur',
      delay: 'Planification 3D',
      tagColor: 'text-[#059669] bg-[#DCFCE7]'
    },
    {
      id: 'soin-3',
      title: 'Blanchiment Dentaire Laser',
      category: 'ÉCLAT IMMÉDIAT',
      desc: 'Éclaircissement médical haute sécurité sous contrôle du praticien. Gagnez jusqu’à 4 teintes d’éclat en une seule séance de 45 minutes.',
      badge: 'Séance 45 min',
      delay: 'Résultat direct',
      tagColor: 'text-[#D97706] bg-[#FEF3C7]'
    },
    {
      id: 'soin-4',
      title: 'Alignement Invisible & Gouttières',
      category: 'ORTHODONTIE ADULTE',
      desc: 'Alignement discret sans bagues métalliques. Gouttières transparentes amovibles adaptées aux professionnels exigeants de Dakar.',
      badge: '100% Invisible',
      delay: 'Suivi digitalisé',
      tagColor: 'text-[#7C3AED] bg-[#EDE9FE]'
    },
    {
      id: 'soin-5',
      title: 'Soins Conservateurs & Céramique',
      category: 'SANTÉ DENTAIRE',
      desc: 'Inlays et onlays en céramique pure pour préserver la dent naturelle sans amalgame métallique disgracieux.',
      badge: 'Préservation',
      delay: 'Séance unique',
      tagColor: 'text-[#0284C7] bg-[#E0F2FE]'
    },
    {
      id: 'soin-6',
      title: 'Urgences & Douleurs Bucco-Dentaires',
      category: 'PRIORITÉ ABSOLUE',
      desc: 'Prise en charge rapide du lundi au samedi pour les rages de dents, fractures ou urgences esthétiques aux Almadies.',
      badge: 'Prioritaire',
      delay: 'Jour même',
      tagColor: 'text-[#DC2626] bg-[#FEE2E2]'
    }
  ];

  // 6 Témoignages Patients Réels & Vérifiés
  const reviews = [
    {
      name: 'Dr. Aminata Diop',
      role: 'Médecin spécialiste, Almadies',
      text: 'Le cadre est d’une pureté clinique irréprochable et apaisant. La pose de mes facettes en céramique a complètement sublimé mon sourire sans aucune sensibilité ni douleur.',
      rating: 5,
      care: 'Smile Design Céramique',
      date: 'Il y a 2 semaines'
    },
    {
      name: 'Marc-Antoine V.',
      role: 'Directeur Général, Expatrié Ngor/Almadies',
      text: 'Expatrié à Dakar depuis 4 ans, je n’ai jamais vu un cabinet dentaire aussi technologiquement avancé. Scanner 3D en direct, zéro pâte étouffante et un timing respecté à la minute près.',
      rating: 5,
      care: 'Implantologie Guidée 3D',
      date: 'Il y a 1 mois'
    },
    {
      name: 'Fatou Binetou S.',
      role: 'Entrepreneure & Fondatrice, Dakar Plateau',
      text: 'Le blanchiment laser a donné un éclat immédiat et spectaculaire à mon sourire juste avant mon mariage. L’équipe médicale est d’une bienveillance et d’une écoute exceptionnelles.',
      rating: 5,
      care: 'Blanchiment Laser 45 min',
      date: 'Il y a 3 semaines'
    },
    {
      name: 'Cheikh Tidiane B.',
      role: 'Cadre Financier, Fann Résidence',
      text: 'J’hésitais depuis des années à porter des bagues métalliques. Leurs gouttières invisibles sont totalement imperceptibles lors de mes comités de direction. Résultat impressionnant.',
      rating: 5,
      care: 'Alignement Invisible',
      date: 'Il y a 1 mois'
    },
    {
      name: 'Sophie Lecomte',
      role: 'Représentante Coopération Internationale, Almadies',
      text: 'Prise en charge en urgence un samedi matin pour une fracture dentaire. En moins de 45 minutes, la réparation en céramique était invisible. Une réactivité qui force le respect.',
      rating: 5,
      care: 'Urgence Esthétique',
      date: 'Il y a 5 jours'
    },
    {
      name: 'Babacar Ndiaye',
      role: 'Architecte d’Intérieur, Ngor',
      text: 'L’approche architecturale et esthétique du sourire à La Galerie est unique à Dakar. Remplacement d’anciens amalgames par de la céramique pure : biocompatible et invisible.',
      rating: 5,
      care: 'Soins Conservateurs Céramique',
      date: 'Il y a 2 mois'
    }
  ];

  // FAQ
  const faqs = [
    {
      q: 'Comment se déroule la prise de rendez-vous en ligne ?',
      a: 'Vous choisissez votre soin et votre créneau en 30 secondes sur cette page. Notre secrétariat médical vous confirme immédiatement votre créneau sur WhatsApp avec les détails d’accès à la clinique.'
    },
    {
      q: 'Les soins sont-ils douloureux ?',
      a: 'Absolument pas. La clinique utilise l’anesthésie ostéocentrale assistée par ordinateur. Même pour les implants ou les extractions, le confort du patient est absolu et vous repartez sans lèvre engourdie.'
    },
    {
      q: 'Prenez-vous en charge les urgences le samedi ?',
      a: 'Oui, la clinique est ouverte le samedi de 09h00 à 13h30 pour assurer le suivi et la prise en charge prioritaire des urgences dentaires sur rendez-vous.'
    },
    {
      q: 'Où se situe exactement la clinique aux Almadies ?',
      a: 'Nous sommes situés dans le quartier résidentiel paisible des Almadies (proche de la route des Almadies et de Ngor), avec un parking sécurisé réservé aux patients.'
    }
  ];

  // Soumission WhatsApp directe
  const handleFinalBooking = (e) => {
    e.preventDefault();
    const message = `Bonjour Clinique Dentaire La Galerie ! 🦷✨
Je souhaite réserver une consultation via votre plateforme en ligne :
• Soin souhaité : ${selectedCare}
• Date souhaitée : ${selectedDate}
• Créneau horaire : ${selectedSlot}
• Nom complet : ${patientName}
• Téléphone WhatsApp : ${patientPhone}

Merci de me confirmer la disponibilité de ce créneau.`;

    const waUrl = `https://wa.me/221786509595?text=${encodeURIComponent(message)}`;
    window.open(waUrl, '_blank');
    setBookingSuccess(true);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] relative selection:bg-sky-200 overflow-x-hidden">

      {/* Lueur d'Aura Suiveuse de Curseur (Desktop) */}
      <div ref={cursorAuraRef} className="cursor-aura hidden lg:block" />

      {/* =========================================================================
          1. TOP BANNER LIVE & CONTACT DIRECT (MOBILE-FIRST LUXE)
          ========================================================================= */}
      <div className="bg-[#0B1329] text-white text-[11px] sm:text-xs py-2 px-3 sm:px-6 border-b border-slate-800 relative z-30">
        <div className="max-w-7xl mx-auto flex items-center justify-between font-mono">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2 sm:h-2.5 sm:w-2.5 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 sm:h-2.5 sm:w-2.5 bg-emerald-500"></span>
            </span>
            <span className="text-slate-200 font-semibold truncate">
              <span className="sm:hidden">OUVERT • ALMADIES</span>
              <span className="hidden sm:inline">CLINIQUE OUVERTE • ALMADIES, DAKAR</span>
            </span>
            <span className="hidden md:inline text-slate-500">|</span>
            <span className="hidden md:inline text-slate-400">Scanner 3D & Prise de RDV</span>
          </div>

          <div className="flex items-center gap-3 sm:gap-4 text-slate-300 shrink-0">
            <span className="hidden sm:inline">Lun - Sam : 09h – 17h30</span>
            <a href="tel:+221786509595" className="hover:text-sky-300 transition flex items-center gap-1.5 font-bold text-sky-400">
              <Phone className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-sky-400 shrink-0" />
              <span>+221 78 650 95 95</span>
            </a>
          </div>
        </div>
      </div>

      {/* =========================================================================
          2. NAVBAR PRESTIGE FLOTTANTE AVEC MENU MOBILE RESPONSIVE
          ========================================================================= */}
      <nav className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between">

          {/* Logo Officiel La Galerie */}
          <a href="#" className="flex items-center gap-2.5 sm:gap-3 group">
            <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl bg-[#0F172A] flex items-center justify-center text-white shadow-md shadow-slate-900/10 group-hover:scale-105 transition shrink-0">
              <svg width="20" height="20" className="sm:w-6 sm:h-6" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="100" height="100" rx="25" fill="#0F172A"/>
                <path d="M30 40C30 25 70 25 70 40C70 60 55 75 50 82C45 75 30 60 30 40Z" fill="none" stroke="#38BDF8" strokeWidth="7"/>
                <circle cx="50" cy="45" r="9" fill="#10B981"/>
              </svg>
            </div>
            <div>
              <div className="font-display font-bold text-base sm:text-lg tracking-tight text-[#0F172A]">
                LA GALERIE
              </div>
              <div className="text-[9px] sm:text-[10px] font-mono tracking-wider sm:tracking-widest text-[#0284C7] uppercase font-semibold">
                Dentaire • Almadies
              </div>
            </div>
          </a>

          {/* Liens Desktop */}
          <div className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-600">
            <a href="#soins" className="hover:text-[#0284C7] transition">Soins d'Excellence</a>
            <a href="#technologie" className="hover:text-[#0284C7] transition flex items-center gap-1.5">
              <span>Plateau Clinique</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            </a>
            <a href="#experience" className="hover:text-[#0284C7] transition">L'Écrin Almadies</a>
            <a href="#avis" className="hover:text-[#0284C7] transition">Témoignages (6)</a>
            <a href="#faq" className="hover:text-[#0284C7] transition">FAQ</a>
          </div>

          {/* Boutons Action Header */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => setIsModalOpen(true)}
              className="btn-magnetic bg-[#0F172A] hover:bg-[#1E293B] text-white text-xs sm:text-sm font-bold px-3 py-2 sm:px-5 sm:py-2.5 rounded-xl shadow-lg shadow-slate-900/15 flex items-center gap-1.5 sm:gap-2 cursor-pointer"
            >
              <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#38BDF8]" />
              <span className="hidden sm:inline">Prendre Rendez-vous</span>
              <span className="sm:hidden text-xs">Prendre RDV</span>
            </button>

            {/* Hamburger Toggle (Mobile) */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 flex items-center justify-center transition cursor-pointer"
              aria-label="Menu de navigation"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Tiroir de Navigation Mobile */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-b border-slate-200 px-5 py-4 space-y-3 shadow-2xl animate-fade-in">
            <a
              href="#soins"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block py-2 text-sm font-bold text-slate-800 hover:text-[#0284C7] transition border-b border-slate-100"
            >
              Soins d'Excellence
            </a>
            <a
              href="#technologie"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center justify-between py-2 text-sm font-bold text-slate-800 hover:text-[#0284C7] transition border-b border-slate-100"
            >
              <span>Plateau Clinique 3D</span>
              <span className="text-[10px] font-mono bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold">
                EN DIRECT
              </span>
            </a>
            <a
              href="#experience"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block py-2 text-sm font-bold text-slate-800 hover:text-[#0284C7] transition border-b border-slate-100"
            >
              L'Écrin Almadies
            </a>
            <a
              href="#avis"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block py-2 text-sm font-bold text-slate-800 hover:text-[#0284C7] transition border-b border-slate-100"
            >
              Témoignages Patients (6)
            </a>
            <a
              href="#faq"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block py-2 text-sm font-bold text-slate-800 hover:text-[#0284C7] transition border-b border-slate-100"
            >
              Questions Fréquentes
            </a>

            <div className="pt-2 flex gap-2">
              <a
                href="https://wa.me/221786509595"
                target="_blank"
                rel="noreferrer"
                className="flex-1 bg-[#25D366] text-white text-xs font-bold py-2.5 rounded-xl text-center flex items-center justify-center gap-1.5 shadow-sm"
              >
                <span>WhatsApp Cabinet</span>
              </a>
              <a
                href="tel:+221786509595"
                className="flex-1 bg-slate-900 text-white text-xs font-bold py-2.5 rounded-xl text-center flex items-center justify-center gap-1.5 shadow-sm"
              >
                <Phone className="w-3.5 h-3.5 text-sky-400" />
                <span>Appeler</span>
              </a>
            </div>
          </div>
        )}
      </nav>

      {/* =========================================================================
          3. HERO SECTION CLINIQUE PURE AVEC MODULE LIVE
          ========================================================================= */}
      <section className="relative overflow-hidden pt-10 pb-20 lg:pt-14 lg:pb-28">
        <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-0" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">

            {/* Colonne Gauche : Titre Statutaire & Autorité */}
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-50 border border-sky-200 text-sky-800 text-xs font-mono font-semibold mb-6 shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-[#0284C7] animate-spin" style={{ animationDuration: '6s' }} />
                <span>CHIRURGIE DENTAIRE & HAUTE ESTHÉTIQUE • ALMADIES</span>
              </div>

              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#0F172A] tracking-tight leading-[1.08] mb-6">
                L’Art de Sublimer<br />
                <span className="font-serif italic font-normal text-[#0284C7] text-5xl sm:text-6xl lg:text-7xl">
                  Votre Sourire à Dakar.
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-600 leading-relaxed mb-8 max-w-xl">
                La Clinique Dentaire <strong>La Galerie</strong> allie l'exigence médicale internationale, les technologies de pointe et un confort absolu au cœur des Almadies.
              </p>

              {/* Télémétrie d'Autorité Interactive avec Compteurs Animés */}
              <div className="grid grid-cols-3 gap-4 p-4 rounded-2xl bg-white/90 backdrop-blur-sm border border-slate-200/90 shadow-sm max-w-lg mb-8 hover:shadow-md transition">
                <div>
                  <div className="font-display text-2xl font-bold text-[#0F172A]">{counterSatisfaction}%</div>
                  <div className="text-[11px] font-mono text-slate-500 uppercase">Satisfaction</div>
                </div>
                <div className="border-x border-slate-100 px-3">
                  <div className="font-display text-2xl font-bold text-[#059669]">ZÉRO</div>
                  <div className="text-[11px] font-mono text-slate-500 uppercase">Douleur</div>
                </div>
                <div>
                  <div className="font-display text-2xl font-bold text-[#0284C7]">{counterPrecision} µm</div>
                  <div className="text-[11px] font-mono text-slate-500 uppercase">Précision 3D</div>
                </div>
              </div>

              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-4">
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="btn-magnetic bg-[#0284C7] hover:bg-[#0369A1] text-white font-bold text-sm sm:text-base px-7 py-3.5 rounded-xl shadow-lg shadow-sky-600/25 flex items-center gap-2"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Réserver une consultation</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </button>

                <a
                  href="https://wa.me/221786509595?text=Bonjour%20Clinique%20Dentaire%20La%20Galerie,%20je%20souhaite%20un%20renseignement."
                  target="_blank"
                  rel="noreferrer"
                  className="btn-magnetic bg-emerald-50 text-[#059669] hover:bg-emerald-100 font-bold text-sm sm:text-base px-6 py-3.5 rounded-xl border border-emerald-200 flex items-center gap-2"
                >
                  {/* Vrai SVG WhatsApp officiel */}
                  <svg viewBox="0 0 32 32" className="w-4 h-4 fill-[#059669]" xmlns="http://www.w3.org/2000/svg">
                    <path d="M16 2C8.28 2 2 8.28 2 16c0 2.72.78 5.26 2.14 7.42L2 30l6.76-2.1c2.1 1.28 4.56 2.1 7.24 2.1 7.72 0 14-6.28 14-14S23.72 2 16 2zm0 25.56c-2.3 0-4.44-.68-6.24-1.84l-.44-.28-4.64 1.44 1.46-4.52-.3-.48c-1.3-2.04-1.98-4.4-1.98-6.88 0-6.68 5.44-12.12 12.14-12.12 6.68 0 12.12 5.44 12.12 12.12 0 6.68-5.44 12.16-12.12 12.16zm6.66-9.1c-.36-.18-2.14-1.06-2.48-1.18-.34-.12-.58-.18-.82.18-.24.36-.94 1.18-1.16 1.42-.22.24-.44.26-.8.08-.36-.18-1.52-.56-2.9-1.8-1.08-.96-1.8-2.14-2.02-2.5-.22-.36-.02-.56.16-.74.16-.16.36-.42.54-.62.18-.2.24-.36.36-.58.12-.22.06-.42-.04-.6-.1-.18-.82-1.98-1.12-2.72-.3-.72-.6-.62-.82-.64h-.7c-.24 0-.62.1-.94.44-.32.36-1.24 1.22-1.24 2.96 0 1.74 1.28 3.42 1.46 3.66.18.24 2.5 3.82 6.06 5.36.84.36 1.5.58 2.02.74.86.28 1.64.24 2.26.14.7-.1 2.14-.88 2.44-1.72.3-.84.3-1.56.22-1.72-.1-.14-.34-.24-.7-.42z"/>
                  </svg>
                  <span>Poser une question WhatsApp</span>
                </a>
              </div>
            </div>

            {/* Colonne Droite : Module Express Prise de RDV Directe 30s */}
            <div className="lg:col-span-5">
              <div className="float-element bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-2xl shadow-slate-900/10 relative">
                <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
                  <div>
                    <span className="text-[11px] font-mono text-[#0284C7] font-bold uppercase tracking-wider flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-[#0284C7] animate-ping"></span>
                      MODULE EXPRESS SANS DÉPLACEMENT
                    </span>
                    <h3 className="font-display text-lg font-bold text-[#0F172A]">
                      Planifier un Rendez-vous
                    </h3>
                  </div>
                  <span className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <Zap className="w-4 h-4" />
                  </span>
                </div>

                <form onSubmit={handleFinalBooking} className="space-y-4">
                  <div>
                    <label className="block text-xs font-mono font-bold text-slate-700 uppercase mb-2">
                      1. Type de Soin Souhaité
                    </label>
                    <select
                      value={selectedCare}
                      onChange={(e) => setSelectedCare(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0284C7]"
                    >
                      <option value="Facettes Céramique & Smile Design">Facettes Céramique & Smile Design</option>
                      <option value="Implantologie Guidée 3D">Implantologie Guidée 3D</option>
                      <option value="Blanchiment Dentaire Laser">Blanchiment Dentaire Laser</option>
                      <option value="Alignement Invisible & Gouttières">Alignement Invisible / Gouttières</option>
                      <option value="Soins Conservateurs & Céramique">Soins Conservateurs & Inlays</option>
                      <option value="Urgences & Douleurs Bucco-Dentaires">Urgence Dentaire Prioritaire</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-mono font-bold text-slate-700 uppercase mb-2 flex items-center justify-between">
                      <span>2. Jour Préféré</span>
                      <span className="text-[11px] text-[#0284C7] font-semibold lowercase">
                        {selectedDate && selectedDate !== 'Aujourd’hui' && selectedDate !== 'Demain' && selectedDate !== 'Cette semaine'
                          ? `✓ ${selectedDate}`
                          : ''}
                      </span>
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { key: 'Aujourd’hui', label: 'Aujourd’hui' },
                        { key: 'Demain', label: 'Demain' },
                        { key: 'Cette semaine', label: 'Cette semaine 📅' }
                      ].map((item) => (
                        <button
                          type="button"
                          key={item.key}
                          onClick={() => {
                            if (item.key === 'Cette semaine') {
                              setIsHeroCalendarOpen(!isHeroCalendarOpen);
                              if (selectedDate === 'Aujourd’hui' || selectedDate === 'Demain') {
                                setSelectedDate('Cette semaine');
                              }
                            } else {
                              setSelectedDate(item.key);
                              setIsHeroCalendarOpen(false);
                            }
                          }}
                          className={`py-2 text-xs font-bold rounded-lg border transition cursor-pointer flex items-center justify-center gap-1 ${
                            (selectedDate === item.key || (item.key === 'Cette semaine' && isHeroCalendarOpen))
                              ? 'bg-[#0F172A] text-white border-[#0F172A] shadow-sm'
                              : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          <span>{item.label}</span>
                        </button>
                      ))}
                    </div>

                    {/* Calendrier Interactif Dépliable */}
                    {isHeroCalendarOpen && (
                      <div className="mt-2.5 p-3.5 bg-slate-50 border-2 border-sky-300 rounded-2xl space-y-2.5 animate-fade-in shadow-inner">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-mono font-bold text-[#0284C7] flex items-center gap-1.5 uppercase tracking-wider text-[11px]">
                            <Calendar className="w-3.5 h-3.5 text-[#0284C7]" />
                            Choisir un jour de consultation
                          </span>
                          <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 font-bold">
                            Ouvert Lun – Sam
                          </span>
                        </div>

                        {/* Grille des 7 prochains jours */}
                        <div className="grid grid-cols-4 sm:grid-cols-7 gap-1.5">
                          {upcomingDays.map((d, idx) => (
                            <button
                              key={idx}
                              type="button"
                              disabled={d.isSunday}
                              onClick={() => {
                                setSelectedDate(d.label);
                              }}
                              className={`p-1.5 rounded-xl border text-center transition flex flex-col items-center justify-between cursor-pointer ${
                                d.isSunday
                                  ? 'opacity-40 bg-slate-100 border-slate-200 cursor-not-allowed'
                                  : selectedDate === d.label
                                  ? 'bg-[#0284C7] text-white border-[#0284C7] shadow-md scale-[1.03]'
                                  : 'bg-white hover:bg-sky-50 text-slate-800 border-slate-200 hover:border-sky-300'
                              }`}
                            >
                              <span className="text-[9px] font-mono font-bold uppercase">
                                {d.shortDay}
                              </span>
                              <span className="text-sm font-extrabold my-0.5">
                                {d.dayNum}
                              </span>
                              <span className="text-[9px] font-mono opacity-80">
                                {d.isSunday ? 'Fermé' : d.month}
                              </span>
                            </button>
                          ))}
                        </div>

                        {/* Sélecteur de date libre */}
                        <div className="pt-2 border-t border-slate-200 flex items-center justify-between gap-2 text-xs">
                          <span className="text-[11px] font-mono text-slate-500">Autre date :</span>
                          <input
                            type="date"
                            min={new Date().toISOString().split('T')[0]}
                            onChange={(e) => {
                              if (e.target.value) {
                                const parts = e.target.value.split('-');
                                const d = new Date(parts[0], parts[1] - 1, parts[2]);
                                const dayNames = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
                                const months = ['Janv', 'Févr', 'Mars', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sept', 'Oct', 'Nov', 'Déc'];
                                setSelectedDate(`${dayNames[d.getDay()]} ${d.getDate()} ${months[d.getMonth()]}`);
                              }
                            }}
                            className="bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-xs text-slate-800 font-mono focus:outline-none focus:ring-1 focus:ring-[#0284C7]"
                          />
                        </div>

                        {selectedDate && selectedDate !== 'Cette semaine' && (
                          <div className="bg-sky-50 text-[#0369A1] text-xs font-mono font-bold py-1.5 px-3 rounded-xl flex items-center justify-between border border-sky-200">
                            <span className="flex items-center gap-1.5 truncate">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                              <span className="truncate">{selectedDate}</span>
                            </span>
                            <button
                              type="button"
                              onClick={() => setIsHeroCalendarOpen(false)}
                              className="text-[10px] bg-[#0284C7] hover:bg-[#0369A1] text-white px-2.5 py-1 rounded-lg font-bold shrink-0 transition cursor-pointer"
                            >
                              Valider ✓
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-mono font-bold text-slate-700 uppercase mb-2 flex items-center justify-between">
                      <span>3. Créneau Horaire</span>
                      <span className="text-[11px] text-[#0284C7] font-semibold lowercase">
                        {selectedSlot ? `✓ ${selectedSlot}` : ''}
                      </span>
                    </label>
                    <div className="grid grid-cols-4 gap-2">
                      {['09:30', '11:00', '15:00'].map((slot) => (
                        <button
                          type="button"
                          key={slot}
                          onClick={() => {
                            setSelectedSlot(slot);
                            setIsHeroTimeOpen(false);
                          }}
                          className={`py-2 text-xs font-mono font-bold rounded-lg border transition cursor-pointer ${
                            selectedSlot === slot && !isHeroTimeOpen
                              ? 'bg-[#0284C7] text-white border-[#0284C7] shadow-sm'
                              : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          {slot}
                        </button>
                      ))}
                      <button
                        type="button"
                        onClick={() => setIsHeroTimeOpen(!isHeroTimeOpen)}
                        className={`py-2 text-xs font-bold rounded-lg border transition cursor-pointer flex items-center justify-center gap-1 ${
                          isHeroTimeOpen || !['09:30', '11:00', '15:00'].includes(selectedSlot)
                            ? 'bg-[#0F172A] text-white border-[#0F172A] shadow-sm'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        <Clock className="w-3 h-3 text-[#38BDF8]" />
                        <span>Autre 🕒</span>
                      </button>
                    </div>

                    {/* Panneau Dépliable de Tous les Horaires */}
                    {isHeroTimeOpen && (
                      <div className="mt-2.5 p-3.5 bg-slate-50 border-2 border-sky-300 rounded-2xl space-y-3 animate-fade-in shadow-inner">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-mono font-bold text-[#0284C7] flex items-center gap-1.5 uppercase tracking-wider text-[11px]">
                            <Clock className="w-3.5 h-3.5 text-[#0284C7]" />
                            Choisir une heure de passage
                          </span>
                          <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 font-bold">
                            Sur rendez-vous
                          </span>
                        </div>

                        {/* Matinée */}
                        <div>
                          <div className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                            <span>☀️ Matin (09h00 – 13h00)</span>
                          </div>
                          <div className="grid grid-cols-4 sm:grid-cols-7 gap-1.5">
                            {morningSlots.map((slot) => (
                              <button
                                key={slot}
                                type="button"
                                onClick={() => setSelectedSlot(slot)}
                                className={`py-1.5 rounded-lg border text-xs font-mono font-bold transition cursor-pointer text-center ${
                                  selectedSlot === slot
                                    ? 'bg-[#0284C7] text-white border-[#0284C7] shadow-md scale-[1.03]'
                                    : 'bg-white hover:bg-sky-50 text-slate-800 border-slate-200 hover:border-sky-300'
                                }`}
                              >
                                {slot}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Après-midi */}
                        <div>
                          <div className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                            <span>⛅ Après-midi (14h30 – 17h30)</span>
                          </div>
                          <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5">
                            {afternoonSlots.map((slot) => (
                              <button
                                key={slot}
                                type="button"
                                onClick={() => setSelectedSlot(slot)}
                                className={`py-1.5 rounded-lg border text-xs font-mono font-bold transition cursor-pointer text-center ${
                                  selectedSlot === slot
                                    ? 'bg-[#0284C7] text-white border-[#0284C7] shadow-md scale-[1.03]'
                                    : 'bg-white hover:bg-sky-50 text-slate-800 border-slate-200 hover:border-sky-300'
                                }`}
                              >
                                {slot}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Heure Précise Libre */}
                        <div className="pt-2 border-t border-slate-200 flex items-center justify-between gap-2 text-xs">
                          <span className="text-[11px] font-mono text-slate-500">Heure personnalisée :</span>
                          <input
                            type="time"
                            min="09:00"
                            max="18:00"
                            step="900"
                            value={selectedSlot.includes(':') ? selectedSlot.slice(0, 5) : '11:00'}
                            onChange={(e) => {
                              if (e.target.value) {
                                setSelectedSlot(e.target.value);
                              }
                            }}
                            className="bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-xs text-slate-800 font-mono focus:outline-none focus:ring-1 focus:ring-[#0284C7]"
                          />
                        </div>

                        {/* Confirmation badge */}
                        <div className="bg-sky-50 text-[#0369A1] text-xs font-mono font-bold py-1.5 px-3 rounded-xl flex items-center justify-between border border-sky-200">
                          <span className="flex items-center gap-1.5 truncate">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            <span>Créneau retenu : {selectedSlot}</span>
                          </span>
                          <button
                            type="button"
                            onClick={() => setIsHeroTimeOpen(false)}
                            className="text-[10px] bg-[#0284C7] hover:bg-[#0369A1] text-white px-2.5 py-1 rounded-lg font-bold shrink-0 transition cursor-pointer"
                          >
                            Valider ✓
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="space-y-3 pt-2">
                    <input
                      type="text"
                      required
                      placeholder="Votre Nom & Prénom"
                      value={patientName}
                      onChange={(e) => setPatientName(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0284C7]"
                    />
                    <input
                      type="tel"
                      required
                      placeholder="Numéro WhatsApp (ex: +221 77 ...)"
                      value={patientPhone}
                      onChange={(e) => setPatientPhone(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0284C7]"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full btn-magnetic bg-[#059669] hover:bg-[#047857] text-white font-bold py-3.5 rounded-xl shadow-lg shadow-emerald-700/20 text-sm flex items-center justify-center gap-2 mt-4"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Confirmer sur WhatsApp Direct</span>
                  </button>

                  <p className="text-[11px] text-center text-slate-400 font-mono">
                    🔒 Confirmation instantanée • Zéro déplacement nécessaire
                  </p>
                </form>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* =========================================================================
          4. SECTION SOINS SIGNATURE (3D TILT CARDS DYNAMIQUES)
          ========================================================================= */}
      <section id="soins" className="py-20 bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">

          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-mono font-bold text-[#0284C7] uppercase tracking-widest bg-sky-50 px-3 py-1 rounded-full border border-sky-200">
              NOS PÔLES D'EXPERTISE
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-[#0F172A] tracking-tight mt-4">
              Des Soins Dentaires d'Exception aux Almadies
            </h2>
            <p className="text-slate-600 mt-3 text-sm sm:text-base">
              Chaque acte est exécuté avec une précision microscopique pour préserver l'intégrité biologique et révéler la beauté naturelle de votre visage.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {soins.map((s) => (
              <div
                key={s.id}
                id={s.id}
                onMouseMove={(e) => handleMouseMove(e, s.id)}
                onMouseLeave={() => handleMouseLeave(s.id)}
                className="card-3d-tilt relative bg-[#F8FAFC] border border-slate-200/90 rounded-2xl p-7 hover:border-sky-300 hover:shadow-xl transition-all flex flex-col justify-between"
              >
                <div className="glare-effect"></div>

                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className={`text-[10px] font-mono font-bold px-2.5 py-1 rounded-md ${s.tagColor}`}>
                      {s.category}
                    </span>
                    <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-[#0284C7]" />
                      {s.delay}
                    </span>
                  </div>

                  <h3 className="font-display text-xl font-bold text-[#0F172A] mb-3 leading-snug">
                    {s.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6">
                    {s.desc}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-200/70 flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <Award className="w-3.5 h-3.5 text-[#059669]" />
                    {s.badge}
                  </span>
                  <button
                    onClick={() => {
                      setSelectedCare(s.title);
                      setIsModalOpen(true);
                    }}
                    className="text-xs font-bold text-[#0284C7] hover:text-[#0369A1] flex items-center gap-1 group"
                  >
                    <span>Réserver</span>
                    <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition" />
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* =========================================================================
          5. EXPÉRIENCE CLINIQUE PRESTIGE (SANS LOOK HACKER / DEV)
             AVEC VRAIES PHOTOS CLINIQUES, CHARGEMENT INSTANTANÉ ET DÉFILEMENT AUTO
          ========================================================================= */}
      <section id="technologie" className="py-20 bg-[#0B132B] text-white relative overflow-hidden">
        {/* Lueurs douces chaleureuses médicales */}
        <div className="absolute top-0 right-10 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-10 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">

          <div className="flex flex-col lg:grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Colonne Gauche : Titre + Onglets Tactiles (Mobile) + 3 Cartes Verticales (Desktop) */}
            <div className="w-full lg:col-span-6">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-xs font-mono font-bold text-sky-300 uppercase tracking-widest bg-sky-950/80 px-3.5 py-1 rounded-full border border-sky-800/80">
                  CONFORT & INNOVATION CLINIQUE
                </span>
                <span className="text-[11px] font-mono text-emerald-400 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  DÉMONSTRATION EN DIRECT
                </span>
              </div>

              <h2 className="font-display text-2xl sm:text-4xl font-extrabold tracking-tight mb-4 sm:mb-6 leading-tight">
                L’Excellence Médicale :<br />
                <span className="text-[#38BDF8]">Zéro Pâte, Zéro Douleur, Zéro Stress.</span>
              </h2>
              <p className="text-slate-300 text-xs sm:text-base leading-relaxed mb-6 sm:mb-8">
                À la Clinique La Galerie, nous avons réinventé chaque étape du parcours patient pour éliminer l'anxiété et vous offrir une expérience digne des plus hauts standards internationaux.
              </p>

              {/* ONGLETS MOBILES SEULEMENT (lg:hidden) - SITUÉS DIRECTEMENT AU-DESSUS DE LA VITRINE */}
              <div className="lg:hidden flex gap-1.5 p-1.5 bg-slate-900/95 rounded-2xl border border-slate-800 mb-6 shadow-xl">
                {[
                  { idx: 0, label: 'Scanner 3D', icon: Scan },
                  { idx: 1, label: 'Smile Design', icon: Sparkles },
                  { idx: 2, label: 'Sans Douleur', icon: HeartHandshake }
                ].map((tab) => (
                  <button
                    key={tab.idx}
                    onClick={() => {
                      setActivePlateauIndex(tab.idx);
                      setPlateauProgress(0);
                      setIsCardFlipped(false);
                    }}
                    className={`flex-1 py-2.5 px-1.5 rounded-xl text-xs font-bold font-mono flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      activePlateauIndex === tab.idx
                        ? 'bg-[#0284C7] text-white shadow-lg shadow-sky-500/30 border border-sky-400'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <tab.icon className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">{tab.label}</span>
                  </button>
                ))}
              </div>

              {/* 3 Cartes Médicales Auto-Défilantes (DESKTOP SEULEMENT : hidden lg:block) */}
              <div
                className="hidden lg:block space-y-4"
                onMouseEnter={() => setIsPlateauPaused(true)}
                onMouseLeave={() => setIsPlateauPaused(false)}
              >
                {[
                  {
                    idx: 0,
                    title: 'Scanner 3D Sans Empreinte en Pâte',
                    desc: 'Fini le porte-empreinte froid et la pâte suffocante. Une caméra optique ultra-fine numérise votre sourire en 3 minutes.',
                    sub: 'Confort absolu • Précision microscopique 15 µm',
                    icon: Scan
                  },
                  {
                    idx: 1,
                    title: 'Simulation Smile Design Avant / Après',
                    desc: 'Visualisez la transformation réelle de vos dents sur écran haute définition avant même de débuter le traitement.',
                    sub: 'Vraies photos cliniques • Métamorphose immédiate',
                    icon: Sparkles
                  },
                  {
                    idx: 2,
                    title: 'Anesthésie Ostéocentrale Sans Douleur',
                    desc: 'Diffusion électronique ultra-douce. La dent soignée est insensibilisée sans engourdir ni geler vos lèvres.',
                    sub: 'Zéro sensation d’aiguille • Sourire libre en sortant',
                    icon: HeartHandshake
                  }
                ].map((item) => {
                  const isActive = activePlateauIndex === item.idx;
                  const IconComp = item.icon;
                  return (
                    <div
                      key={item.idx}
                      onClick={() => {
                        setActivePlateauIndex(item.idx);
                        setPlateauProgress(0);
                        setIsCardFlipped(false);
                      }}
                      className={`relative overflow-hidden cursor-pointer transition-all duration-300 p-5 rounded-2xl border flex gap-4 ${
                        isActive
                          ? 'bg-slate-800/90 border-sky-400 shadow-xl shadow-sky-500/10 scale-[1.015]'
                          : 'bg-slate-800/40 border-slate-700/60 hover:bg-slate-800/60 hover:border-slate-600'
                      }`}
                    >
                      {/* Barre de progression fluide */}
                      {isActive && (
                        <div
                          className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-[#0284C7] to-emerald-400 transition-all duration-100 ease-linear shadow-[0_0_12px_#38BDF8]"
                          style={{ width: `${plateauProgress}%` }}
                        />
                      )}

                      <div
                        className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-all ${
                          isActive
                            ? 'bg-[#0284C7] text-white font-bold shadow-md shadow-sky-500/30'
                            : 'bg-sky-500/15 text-sky-300'
                        }`}
                      >
                        <IconComp className="w-5 h-5" />
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <h4 className="font-bold text-sm sm:text-base text-white tracking-tight">{item.title}</h4>
                          {isActive && (
                            <span className="text-[10px] font-mono text-sky-300 bg-sky-950/80 px-2.5 py-0.5 rounded-full border border-sky-700/80 font-bold shrink-0">
                              EN DIRECT
                            </span>
                          )}
                        </div>
                        <p className="text-xs sm:text-sm text-slate-300 mt-1 leading-relaxed">{item.desc}</p>
                        <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-700/60">
                          <p className="text-[11px] font-mono text-emerald-400 flex items-center gap-1.5 font-medium">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                            {item.sub}
                          </p>
                          {isActive && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setIsCardFlipped(!isCardFlipped);
                              }}
                              className="text-[11px] font-mono text-sky-300 hover:text-white flex items-center gap-1 transition bg-sky-950/60 px-2 py-0.5 rounded border border-sky-800/80"
                            >
                              <RotateCw className="w-3 h-3" />
                              <span>{isCardFlipped ? 'Photo direct' : 'Avantages ↷'}</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="hidden lg:flex mt-4 text-[11px] font-mono text-slate-400 items-center justify-between">
                <span>Défilement automatique continu</span>
                <span>Cliquez pour pivoter la carte 3D</span>
              </div>
            </div>

            {/* Colonne Droite : Vitrine Médicale Prestige avec Flip 3D (Face Avant / Verso) */}
            <div className="w-full lg:col-span-6">
              <div className="relative rounded-3xl overflow-hidden border border-slate-700/80 shadow-2xl bg-gradient-to-b from-slate-900 to-[#0F172A] p-5 sm:p-7">
                
                {/* En-tête Prestigieux Clinique avec bouton de Pivotement 3D */}
                <div className="flex items-center justify-between pb-3.5 border-b border-slate-800 mb-4 text-xs text-slate-300">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></div>
                    <span className="font-display font-bold tracking-wide text-white uppercase text-xs sm:text-sm">
                      CLINIQUE DENTAIRE LA GALERIE
                    </span>
                  </div>
                  <button
                    onClick={() => setIsCardFlipped(!isCardFlipped)}
                    className="flex items-center gap-1.5 font-mono text-[11px] text-sky-300 bg-sky-950/80 hover:bg-sky-900 px-3 py-1.5 rounded-full border border-sky-600/70 transition shadow-sm cursor-pointer group"
                    title="Pivoter la carte en 3D pour découvrir les coulisses et avantages"
                  >
                    <RotateCw className={`w-3.5 h-3.5 transition-transform duration-500 ${isCardFlipped ? 'rotate-180 text-amber-300' : 'text-sky-300'}`} />
                    <span>{isCardFlipped ? '↶ Revenir au direct' : '↷ Retourner la carte 3D'}</span>
                  </button>
                </div>

                {/* Cadre Visuel Principal avec Flip 3D (Perspective & Preserve-3D) */}
                <div className="relative min-h-[460px] sm:min-h-[490px] rounded-2xl perspective-1200">
                  <div
                    className={`relative w-full h-full min-h-[460px] sm:min-h-[490px] rounded-2xl transition-transform duration-700 transform-style-3d ${
                      isCardFlipped ? 'rotate-y-180' : ''
                    }`}
                  >

                    {/* ========================================================
                        FACE AVANT (RECTO : EXPÉRIENCE EN DIRECT & VRAIES PHOTOS)
                        ======================================================== */}
                    <div className="absolute inset-0 w-full h-full rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden flex flex-col justify-between p-4 sm:p-5 backface-hidden shadow-2xl">

                      {/* MODE 0 : SCANNER 3D OPTIQUE */}
                      {activePlateauIndex === 0 && (
                        <div className="relative h-full flex flex-col justify-between">
                          <img
                            src={clinicConsultation}
                            alt="Consultation numérique et scanner 3D à la Clinique La Galerie"
                            className="absolute inset-0 w-full h-full object-cover object-center"
                            loading="eager"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>

                          {/* Badge Supérieur */}
                          <div className="relative z-10 flex justify-between items-center text-xs">
                            <span className="bg-[#0F172A]/85 backdrop-blur-md text-sky-300 font-mono text-[11px] px-3 py-1 rounded-full border border-sky-500/30">
                              Numérisation Optique 3D
                            </span>
                            <span className="bg-emerald-950/80 text-emerald-300 font-mono text-[10px] px-2.5 py-1 rounded-full border border-emerald-700/80 font-bold">
                              ZÉRO NAUSÉE
                            </span>
                          </div>

                          {/* Cartouche d'explication au bas de la photo */}
                          <div className="relative z-10 bg-slate-900/95 backdrop-blur-md p-4 sm:p-5 rounded-2xl border border-slate-700/80 mt-auto shadow-2xl">
                            <h4 className="font-display font-bold text-sm sm:text-base text-white">
                              Empreinte Numérique en 3 Minutes
                            </h4>
                            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                              Le praticien projette votre sourire sur grand écran. Zéro pâte, confort absolu et précision médicale au micron.
                            </p>
                            <div className="mt-3.5 pt-2.5 border-t border-slate-700/80 flex items-center justify-between gap-2">
                              <span className="text-[11px] font-mono text-emerald-400 flex items-center gap-1">
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                Précision 15 microns
                              </span>
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setIsCardFlipped(true);
                                  }}
                                  className="bg-sky-950/80 hover:bg-sky-900 text-sky-300 font-mono text-[11px] px-3 py-1.5 rounded-lg border border-sky-700/70 transition flex items-center gap-1 cursor-pointer"
                                >
                                  <span>Avantages ↷</span>
                                </button>
                                <button
                                  onClick={() => setIsModalOpen(true)}
                                  className="bg-white hover:bg-slate-100 text-[#0F172A] font-bold text-xs sm:text-sm px-4 py-2 rounded-xl transition shadow-md cursor-pointer"
                                >
                                  Prendre RDV →
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* MODE 1 : VRAIE COMPARAISON AVANT / APRÈS */}
                      {activePlateauIndex === 1 && (
                        <div className="relative h-full flex flex-col justify-between">
                          <div className="flex justify-between items-center text-xs text-slate-300 z-10 mb-2">
                            <span className="text-sky-300 font-bold font-mono text-[11px] flex items-center gap-1.5">
                              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                              MÉTAMORPHOSE DU SOURIRE (AVANT / APRÈS)
                            </span>
                            <span className="text-amber-300 text-[10px] font-mono">DÉFILE AUTOMATIQUEMENT ↔</span>
                          </div>

                          <div
                            className="relative flex-1 min-h-[220px] rounded-xl overflow-hidden border border-slate-700 select-none cursor-ew-resize"
                            onMouseDown={() => setIsUserDragging(true)}
                            onMouseUp={() => setIsUserDragging(false)}
                            onTouchStart={() => setIsUserDragging(true)}
                            onTouchEnd={() => setIsUserDragging(false)}
                          >
                            <img
                              src={dentalAfter}
                              alt="Après : Sourire parfait avec facettes céramique et blanchiment"
                              className="absolute inset-0 w-full h-full object-cover object-center"
                              loading="eager"
                            />
                            <div className="absolute top-3 right-3 z-10 pointer-events-none">
                              <span className="text-[10px] font-mono font-bold bg-emerald-950/90 text-emerald-300 border border-emerald-600 px-2.5 py-1 rounded-md shadow-lg backdrop-blur-sm">
                                APRÈS : FACETTES CÉRAMIQUE
                              </span>
                            </div>

                            <div
                              className="absolute inset-y-0 left-0 overflow-hidden border-r-2 border-amber-400 shadow-[0_0_15px_rgba(251,191,36,0.6)]"
                              style={{ width: `${sliderPosition}%` }}
                            >
                              <img
                                src={dentalBefore}
                                alt="Avant : Dents naturelles avec taches et teinte terne"
                                className="absolute inset-0 w-full h-full object-cover object-center max-w-none"
                                style={{ width: '100%', height: '100%', minWidth: '100%' }}
                                loading="eager"
                              />
                              <div className="absolute top-3 left-3 z-10 pointer-events-none">
                                <span className="text-[10px] font-mono font-bold bg-amber-950/90 text-amber-300 border border-amber-600 px-2.5 py-1 rounded-md shadow-lg backdrop-blur-sm">
                                  AVANT TRAITEMENT
                                </span>
                              </div>
                            </div>

                            <div
                              className="absolute top-0 bottom-0 w-8 -ml-4 flex items-center justify-center z-30 pointer-events-none"
                              style={{ left: `${sliderPosition}%` }}
                            >
                              <div className="w-8 h-8 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center shadow-2xl font-extrabold text-xs border-2 border-white">
                                ↔
                              </div>
                            </div>
                          </div>

                          <div className="pt-2.5 flex items-center gap-3 z-10">
                            <span className="text-[10px] font-mono font-bold text-amber-400">AVANT</span>
                            <input
                              type="range"
                              min="5"
                              max="95"
                              value={sliderPosition}
                              onMouseDown={() => setIsUserDragging(true)}
                              onMouseUp={() => setIsUserDragging(false)}
                              onTouchStart={() => setIsUserDragging(true)}
                              onTouchEnd={() => setIsUserDragging(false)}
                              onChange={(e) => {
                                setIsUserDragging(true);
                                setSliderPosition(Number(e.target.value));
                              }}
                              className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-sky-400"
                            />
                            <span className="text-[10px] font-mono font-bold text-emerald-400">APRÈS</span>
                          </div>

                          <div className="mt-2.5 pt-2.5 border-t border-slate-700/80 flex items-center justify-between gap-2 z-10">
                            <span className="text-[11px] font-mono text-amber-300 flex items-center gap-1">
                              <Sparkles className="w-3.5 h-3.5" />
                              Céramique e.max
                            </span>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setIsCardFlipped(true);
                                }}
                                className="bg-amber-950/80 hover:bg-amber-900 text-amber-300 font-mono text-[11px] px-3 py-1.5 rounded-lg border border-amber-600/60 transition flex items-center gap-1 cursor-pointer"
                              >
                                <span>Protocole ↷</span>
                              </button>
                              <button
                                onClick={() => setIsModalOpen(true)}
                                className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs sm:text-sm px-4 py-2 rounded-xl transition shadow-md cursor-pointer"
                              >
                                Simuler mon sourire →
                              </button>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* MODE 2 : ANESTHÉSIE OSTÉOCENTRALE & SÉRÉNITÉ */}
                      {activePlateauIndex === 2 && (
                        <div className="relative h-full flex flex-col justify-between">
                          <img
                            src={clinicCare}
                            alt="Soin dentaire sans douleur à la Clinique La Galerie"
                            className="absolute inset-0 w-full h-full object-cover object-center"
                            loading="eager"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent"></div>

                          <div className="relative z-10 flex justify-between items-center text-xs">
                            <span className="bg-[#0F172A]/85 backdrop-blur-md text-emerald-300 font-mono text-[11px] px-3 py-1 rounded-full border border-emerald-500/30">
                              Sérénité & Confort Médical
                            </span>
                            <span className="bg-emerald-950/80 text-emerald-300 font-mono text-[10px] px-2.5 py-1 rounded-full border border-emerald-700/80 font-bold">
                              100% SANS DOULEUR
                            </span>
                          </div>

                          <div className="relative z-10 bg-slate-900/95 backdrop-blur-md p-4 sm:p-5 rounded-2xl border border-slate-700/80 mt-auto shadow-2xl">
                            <h4 className="font-display font-bold text-sm sm:text-base text-white">
                              Dites Adieu à la Peur du Dentiste
                            </h4>
                            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                              Grâce à l’anesthésie ostéocentrale assistée par micro-processeur, seule la dent soignée est insensibilisée. Repartez immédiatement avec le sourire libre, sans lèvre gelée.
                            </p>
                            <div className="mt-3.5 pt-2.5 border-t border-slate-700/80 flex items-center justify-between gap-2">
                              <span className="text-[11px] font-mono text-emerald-400 flex items-center gap-1">
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                Zéro seringue visible
                              </span>
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setIsCardFlipped(true);
                                  }}
                                  className="bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 font-mono text-[11px] px-3 py-1.5 rounded-lg border border-emerald-600/60 transition flex items-center gap-1 cursor-pointer"
                                >
                                  <span>La Science ↷</span>
                                </button>
                                <button
                                  onClick={() => setIsModalOpen(true)}
                                  className="bg-emerald-500 hover:bg-emerald-400 text-[#0F172A] font-bold text-xs sm:text-sm px-4 py-2 rounded-xl transition shadow-md cursor-pointer"
                                >
                                  Réserver sans peur →
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                    </div>

                    {/* ========================================================
                        FACE ARRIÈRE (VERSO 3D : COULISSES, SCIENCE & AVANTAGES)
                        ======================================================== */}
                    <div className="absolute inset-0 w-full h-full rounded-2xl bg-gradient-to-br from-slate-900 via-[#0B1329] to-slate-950 border-2 border-sky-500/40 shadow-2xl p-4 sm:p-5 flex flex-col justify-between backface-hidden rotate-y-180">

                      {/* VERSO MODE 0 : AVANTAGES EMPREINTE OPTIQUE 3D */}
                      {activePlateauIndex === 0 && (
                        <div className="h-full flex flex-col justify-between">
                          <div>
                            <div className="flex items-center justify-between pb-2.5 border-b border-sky-500/20 mb-3">
                              <span className="text-[10px] font-mono font-bold text-sky-400 uppercase tracking-widest bg-sky-950/80 px-2.5 py-1 rounded-md border border-sky-700/60">
                                VERSO • AVANTAGES PATIENTS
                              </span>
                              <button
                                onClick={() => setIsCardFlipped(false)}
                                className="text-xs text-slate-300 hover:text-white flex items-center gap-1.5 bg-slate-800/80 hover:bg-slate-700 px-3 py-1 rounded-lg transition border border-slate-700 cursor-pointer"
                              >
                                <RotateCcw className="w-3.5 h-3.5 text-sky-400" />
                                <span>↶ Face photo</span>
                              </button>
                            </div>

                            <h4 className="font-display font-bold text-base sm:text-lg text-white">
                              Pourquoi vous allez adorer l'empreinte 3D
                            </h4>
                            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                              À La Galerie, nous avons banni la pâte à empreinte étouffante au profit d'un parcours fluide et apaisant.
                            </p>

                            <div className="grid grid-cols-1 gap-2.5 mt-3">
                              <div className="bg-slate-900/80 p-2.5 sm:p-3 rounded-xl border border-slate-800 flex items-start gap-3">
                                <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                                  <CheckCircle2 className="w-4 h-4" />
                                </div>
                                <div>
                                  <h5 className="text-xs font-bold text-white">Zéro haut-le-cœur ni étouffement</h5>
                                  <p className="text-[11px] text-slate-300 leading-snug">
                                    Une tête optique miniature glisse avec douceur sans aucun goût désagréable ni réflexe nauséeux.
                                  </p>
                                </div>
                              </div>

                              <div className="bg-slate-900/80 p-2.5 sm:p-3 rounded-xl border border-slate-800 flex items-start gap-3">
                                <div className="w-7 h-7 rounded-lg bg-sky-500/20 text-sky-400 flex items-center justify-center shrink-0 mt-0.5">
                                  <Zap className="w-4 h-4" />
                                </div>
                                <div>
                                  <h5 className="text-xs font-bold text-white">Précision optique 15 microns</h5>
                                  <p className="text-[11px] text-slate-300 leading-snug">
                                    Vos couronnes et facettes s'ajustent au millimètre dès le premier jour, sans retouche douloureuse.
                                  </p>
                                </div>
                              </div>

                              <div className="bg-slate-900/80 p-2.5 sm:p-3 rounded-xl border border-slate-800 flex items-start gap-3">
                                <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
                                  <Layers className="w-4 h-4" />
                                </div>
                                <div>
                                  <h5 className="text-xs font-bold text-white">Dossier numérique archivé à vie</h5>
                                  <p className="text-[11px] text-slate-300 leading-snug">
                                    Vos scans 3D restent sécurisés en cabinet pour tout besoin futur ou suivi à l'international.
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="pt-3 pb-1 border-t border-slate-800 mt-auto flex items-center justify-between gap-3">
                            <span className="text-[11px] font-mono text-sky-300 flex items-center gap-1.5 shrink-0">
                              <Clock className="w-3.5 h-3.5 text-sky-400" />
                              Numérisation : 3 min chrono
                            </span>
                            <button
                              onClick={() => setIsModalOpen(true)}
                              className="bg-[#0284C7] hover:bg-sky-500 text-white font-bold text-xs sm:text-sm px-4 py-2 rounded-xl transition shadow-lg shadow-sky-600/30 flex items-center gap-1.5 shrink-0 cursor-pointer"
                            >
                              <span>Prendre RDV Numérique →</span>
                            </button>
                          </div>
                        </div>
                      )}

                      {/* VERSO MODE 1 : PROTOCOLE SMILE DESIGN */}
                      {activePlateauIndex === 1 && (
                        <div className="h-full flex flex-col justify-between">
                          <div>
                            <div className="flex items-center justify-between pb-2.5 border-b border-amber-500/20 mb-3">
                              <span className="text-[10px] font-mono font-bold text-amber-400 uppercase tracking-widest bg-amber-950/80 px-2.5 py-1 rounded-md border border-amber-700/60">
                                VERSO • LE PROTOCOLE EN 3 ÉTAPES
                              </span>
                              <button
                                onClick={() => setIsCardFlipped(false)}
                                className="text-xs text-slate-300 hover:text-white flex items-center gap-1.5 bg-slate-800/80 hover:bg-slate-700 px-3 py-1 rounded-lg transition border border-slate-700 cursor-pointer"
                              >
                                <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
                                <span>↶ Comparateur</span>
                              </button>
                            </div>

                            <h4 className="font-display font-bold text-base sm:text-lg text-white">
                              La Création de Votre Sourire d'Exception
                            </h4>
                            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                              Un sourire éclatant et naturel, sculpté selon la morphologie unique de votre visage.
                            </p>

                            <div className="grid grid-cols-1 gap-2.5 mt-3">
                              <div className="bg-slate-900/80 p-2.5 sm:p-3 rounded-xl border border-slate-800 flex items-start gap-3">
                                <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 font-mono font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                                  01
                                </div>
                                <div>
                                  <h5 className="text-xs font-bold text-white">Bilan Morphologique & Studio Photo</h5>
                                  <p className="text-[11px] text-slate-300 leading-snug">
                                    Étude de l'axe des lèvres, de la carnation et du blanc de l’œil pour harmoniser la teinte.
                                  </p>
                                </div>
                              </div>

                              <div className="bg-slate-900/80 p-2.5 sm:p-3 rounded-xl border border-slate-800 flex items-start gap-3">
                                <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 font-mono font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                                  02
                                </div>
                                <div>
                                  <h5 className="text-xs font-bold text-white">Validation 3D Avant de Commencer</h5>
                                  <p className="text-[11px] text-slate-300 leading-snug">
                                    Vous validez la forme exacte et la translucidité sur écran 4K avant toute intervention en bouche.
                                  </p>
                                </div>
                              </div>

                              <div className="bg-slate-900/80 p-2.5 sm:p-3 rounded-xl border border-slate-800 flex items-start gap-3">
                                <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 font-mono font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                                  03
                                </div>
                                <div>
                                  <h5 className="text-xs font-bold text-white">Facettes Céramiques e.max (Garantie 15+ ans)</h5>
                                  <p className="text-[11px] text-slate-300 leading-snug">
                                    Pose indolore de céramique biocompatible ultra-résistante aux taches de café, thé et épices.
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="pt-3 pb-1 border-t border-slate-800 mt-auto flex items-center justify-between gap-3">
                            <span className="text-[11px] font-mono text-amber-300 flex items-center gap-1.5 shrink-0">
                              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                              Délai : 48h à 72h
                            </span>
                            <button
                              onClick={() => setIsModalOpen(true)}
                              className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs sm:text-sm px-4 py-2 rounded-xl transition shadow-lg shadow-amber-500/20 flex items-center gap-1.5 shrink-0 cursor-pointer"
                            >
                              <span>Planifier mon Smile Design →</span>
                            </button>
                          </div>
                        </div>
                      )}

                      {/* VERSO MODE 2 : SCIENCE DU SOIN INDOLORE */}
                      {activePlateauIndex === 2 && (
                        <div className="h-full flex flex-col justify-between">
                          <div>
                            <div className="flex items-center justify-between pb-2.5 border-b border-emerald-500/20 mb-3">
                              <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-widest bg-emerald-950/80 px-2.5 py-1 rounded-md border border-emerald-700/60">
                                VERSO • SCIENCE SANS DOULEUR
                              </span>
                              <button
                                onClick={() => setIsCardFlipped(false)}
                                className="text-xs text-slate-300 hover:text-white flex items-center gap-1.5 bg-slate-800/80 hover:bg-slate-700 px-3 py-1 rounded-lg transition border border-slate-700 cursor-pointer"
                              >
                                <RotateCcw className="w-3.5 h-3.5 text-emerald-400" />
                                <span>↶ Face soin</span>
                              </button>
                            </div>

                            <h4 className="font-display font-bold text-base sm:text-lg text-white">
                              Comment nous avons éliminé la douleur
                            </h4>
                            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                              Le système QuickSleeper diffuse le produit au rythme exact de la résistance tissulaire par micro-gouttes.
                            </p>

                            <div className="grid grid-cols-1 gap-2.5 mt-3">
                              <div className="bg-slate-900/80 p-2.5 sm:p-3 rounded-xl border border-slate-800 flex items-start gap-3">
                                <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                                  <Shield className="w-4 h-4" />
                                </div>
                                <div>
                                  <h5 className="text-xs font-bold text-white">Aucune seringue métallique terrifiante</h5>
                                  <p className="text-[11px] text-slate-300 leading-snug">
                                    L'appareil a l'allure élégante et rassurante d'un simple stylo médical électronique.
                                  </p>
                                </div>
                              </div>

                              <div className="bg-slate-900/80 p-2.5 sm:p-3 rounded-xl border border-slate-800 flex items-start gap-3">
                                <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                                  <CheckCircle2 className="w-4 h-4" />
                                </div>
                                <div>
                                  <h5 className="text-xs font-bold text-white">Seule la dent ciblée s'endort</h5>
                                  <p className="text-[11px] text-slate-300 leading-snug">
                                    Pas de lèvre engourdie, pas de joue déformée ni de langue anesthésiée pendant des heures.
                                  </p>
                                </div>
                              </div>

                              <div className="bg-slate-900/80 p-2.5 sm:p-3 rounded-xl border border-slate-800 flex items-start gap-3">
                                <div className="w-7 h-7 rounded-lg bg-sky-500/20 text-sky-400 flex items-center justify-center shrink-0 mt-0.5">
                                  <Smile className="w-4 h-4" />
                                </div>
                                <div>
                                  <h5 className="text-xs font-bold text-white">Reprise normale de votre journée</h5>
                                  <p className="text-[11px] text-slate-300 leading-snug">
                                    Vous pouvez sortir du cabinet, parler distinctement en réunion ou déjeuner sans aucune gêne.
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="pt-3 pb-1 border-t border-slate-800 mt-auto flex items-center justify-between gap-3">
                            <span className="text-[11px] font-mono text-emerald-400 flex items-center gap-1.5 shrink-0">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                              Zéro effet bouche engourdie
                            </span>
                            <button
                              onClick={() => setIsModalOpen(true)}
                              className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs sm:text-sm px-4 py-2 rounded-xl transition shadow-lg shadow-emerald-500/20 flex items-center gap-1.5 shrink-0 cursor-pointer"
                            >
                              <span>Prendre RDV sans stress →</span>
                            </button>
                          </div>
                        </div>
                      )}

                    </div>

                  </div>
                </div>
              </div>

              {/* Note d'aide Mobile sous la vitrine */}
              <div className="lg:hidden mt-3 text-[11px] font-mono text-slate-400 flex items-center justify-between px-2">
                <span className="flex items-center gap-1.5 text-slate-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse"></span>
                  Touchez les onglets en haut pour changer
                </span>
                <span className="text-sky-300 font-bold">Flip 3D actif ↷</span>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* =========================================================================
          6. TÉMOIGNAGES CLIENTS ANIMÉS (CARROUSEL INTERACTIF + DÉFILEMENT FLUIDE)
          ========================================================================= */}
      <section id="avis" className="py-20 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">

          {/* En-tête avec Note d'Autorité */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div>
              <span className="text-xs font-mono font-bold text-[#059669] uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                PATIENTS VÉRIFIÉS • ALMADIES & DAKAR
              </span>
              <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-[#0F172A] tracking-tight mt-4">
                Ce que Disent Nos Patients
              </h2>
              <p className="text-slate-600 mt-2 text-sm sm:text-base">
                Retours d'expérience authentiques de personnalités, cadres et résidents des Almadies.
              </p>
            </div>

            {/* Badge Google Reviews */}
            <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-200 self-start md:self-auto">
              <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center font-bold text-[#0F172A] text-sm">
                4.9
              </div>
              <div>
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                  ))}
                </div>
                <div className="text-[11px] font-mono text-slate-500 mt-0.5">
                  128+ avis vérifiés à Dakar
                </div>
              </div>
            </div>
          </div>

          {/* Carrousel Dynamique Grand Format */}
          <div
            className="relative bg-gradient-to-br from-[#F8FAFC] to-sky-50/40 border border-slate-200/90 rounded-3xl p-8 sm:p-12 shadow-sm mb-12 transition-all duration-300"
            onMouseEnter={() => setIsTestimonialAutoplay(false)}
            onMouseLeave={() => setIsTestimonialAutoplay(true)}
          >
            <div className="max-w-3xl mx-auto">
              {/* Étoiles & Soin */}
              <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
                <div className="flex text-amber-400">
                  {[...Array(reviews[activeTestimonialIdx].rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-amber-400" />
                  ))}
                </div>
                <span className="text-xs font-mono font-semibold text-[#0284C7] bg-white px-3 py-1 rounded-full border border-sky-200 shadow-sm">
                  {reviews[activeTestimonialIdx].care}
                </span>
              </div>

              {/* Texte Témoignage */}
              <blockquote className="font-serif italic text-2xl sm:text-3xl text-[#0F172A] leading-relaxed mb-8">
                “{reviews[activeTestimonialIdx].text}”
              </blockquote>

              {/* Auteur */}
              <div className="flex items-center justify-between border-t border-slate-200/80 pt-6">
                <div>
                  <div className="font-display font-bold text-base text-[#0F172A]">
                    {reviews[activeTestimonialIdx].name}
                  </div>
                  <div className="text-xs font-mono text-slate-500">
                    {reviews[activeTestimonialIdx].role} • {reviews[activeTestimonialIdx].date}
                  </div>
                </div>

                {/* Boutons Suivant / Précédent */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() =>
                      setActiveTestimonialIdx((prev) => (prev === 0 ? reviews.length - 1 : prev - 1))
                    }
                    className="w-10 h-10 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 flex items-center justify-center transition shadow-sm"
                    aria-label="Témoignage précédent"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() =>
                      setActiveTestimonialIdx((prev) => (prev + 1) % reviews.length)
                    }
                    className="w-10 h-10 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 flex items-center justify-center transition shadow-sm"
                    aria-label="Témoignage suivant"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Indicateurs Dots */}
              <div className="flex justify-center gap-2 mt-6">
                {reviews.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveTestimonialIdx(idx)}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      activeTestimonialIdx === idx ? 'w-8 bg-[#0284C7]' : 'w-2 bg-slate-300'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Défilement Continu Marquee (Les 6 témoignages) */}
          <div className="relative w-full overflow-hidden py-4">
            <div className="marquee-track flex gap-6">
              {[...reviews, ...reviews].map((r, i) => (
                <div
                  key={i}
                  className="w-80 sm:w-96 p-6 rounded-2xl bg-white border border-slate-200 shadow-sm shrink-0 flex flex-col justify-between hover:border-sky-300 hover:shadow-md transition"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex text-amber-400">
                        {[...Array(r.rating)].map((_, idx) => (
                          <Star key={idx} className="w-3.5 h-3.5 fill-amber-400" />
                        ))}
                      </div>
                      <span className="text-[10px] font-mono text-[#0284C7] bg-sky-50 px-2 py-0.5 rounded">
                        {r.care}
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-600 italic leading-relaxed line-clamp-3">
                      “{r.text}”
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <div className="font-bold text-xs text-[#0F172A]">{r.name}</div>
                      <div className="text-[10px] font-mono text-slate-400">{r.role}</div>
                    </div>
                    <span className="text-[10px] font-mono text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded">
                      Vérifié
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* =========================================================================
          7. L'ÉCRIN ALMADIES & PROTOCOLE D'ACCUEIL
          ========================================================================= */}
      <section id="experience" className="py-20 bg-[#F1F5F9] border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-6 space-y-6">
              <span className="text-xs font-mono font-bold text-[#0284C7] uppercase tracking-widest bg-sky-100 px-3 py-1 rounded-full border border-sky-300">
                CADRE MÉDICAL PRIVÉ
              </span>
              <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-[#0F172A] tracking-tight">
                L’Écrin des Almadies :<br />
                Sérénité, Confidentialité, Excellence.
              </h2>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                Conçu comme une galerie d'art contemporain et un sanctuaire de santé, notre cabinet a été pensé pour dissiper toute appréhension liée aux soins dentaires.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                {[
                  { title: 'Salon d’Accueil Privé', desc: 'Thé, infusion et musique acoustique apaisante.' },
                  { title: 'Parking Sécurisé Réservé', desc: 'Accès direct et gardiennage permanent aux Almadies.' },
                  { title: 'Ponctualité Rigoureuse', desc: 'Zéro salle d’attente encombrée, respect de votre temps.' },
                  { title: 'Dossier Numérique 3D', desc: 'Accès sécurisé à vos radiographies et scanners sur mobile.' }
                ].map((item, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-sm">
                    <h4 className="font-bold text-xs sm:text-sm text-[#0F172A] flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#059669]" />
                      {item.title}
                    </h4>
                    <p className="text-[11px] text-slate-500 mt-1">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Carte & Contact Rapide */}
            <div className="lg:col-span-6">
              <div className="rounded-3xl overflow-hidden bg-white border border-slate-200 shadow-xl p-6 sm:p-8">
                <div className="flex items-center gap-3 pb-6 border-b border-slate-100">
                  <div className="w-12 h-12 rounded-2xl bg-sky-50 text-[#0284C7] flex items-center justify-center font-bold">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-display font-bold text-base text-[#0F172A]">
                      Clinique Dentaire La Galerie
                    </h4>
                    <p className="text-xs font-mono text-slate-500">
                      Almadies, Dakar (Sénégal) • Proche Route des Almadies
                    </p>
                  </div>
                </div>

                <div className="py-6 space-y-2.5 font-mono text-xs">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between py-2 border-b border-slate-100 gap-1">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0"></span>
                      <span className="text-slate-700 font-semibold">Lundi – Jeudi</span>
                    </div>
                    <div className="font-bold text-slate-900 tracking-tight text-[11px] sm:text-xs pl-4 sm:pl-0">
                      09h00 – 13h00 <span className="text-slate-300 font-normal">|</span> 14h30 – 17h30
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between py-2 border-b border-slate-100 gap-1">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0"></span>
                      <span className="text-slate-700 font-semibold">Vendredi</span>
                    </div>
                    <div className="font-bold text-slate-900 tracking-tight text-[11px] sm:text-xs pl-4 sm:pl-0">
                      09h00 – 13h00 <span className="text-slate-300 font-normal">|</span> 15h30 – 17h30
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between py-2 border-b border-slate-100 gap-1">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0"></span>
                      <span className="text-slate-700 font-semibold">Samedi</span>
                    </div>
                    <div className="font-bold text-slate-900 tracking-tight text-[11px] sm:text-xs pl-4 sm:pl-0 flex items-center gap-1.5 flex-wrap">
                      <span>09h00 – 13h30</span>
                      <span className="text-[10px] font-sans font-medium text-[#0284C7] bg-sky-50 px-1.5 py-0.5 rounded">Soins & Urgences</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between py-2 text-slate-400">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-slate-300 shrink-0"></span>
                      <span>Dimanche</span>
                    </div>
                    <span className="text-[10px] font-sans font-medium bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">Fermé</span>
                  </div>
                </div>

                <button
                  onClick={() => setIsModalOpen(true)}
                  className="w-full btn-magnetic bg-[#0F172A] hover:bg-[#1E293B] text-white font-bold py-3.5 rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md shadow-slate-900/10"
                >
                  <Calendar className="w-4 h-4 text-[#38BDF8]" />
                  <span>Réserver un Créneau Prioritaire</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* =========================================================================
          8. FAQ INTERACTIVE ACCORDÉON
          ========================================================================= */}
      <section id="faq" className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">

          <div className="text-center mb-12">
            <span className="text-xs font-mono font-bold text-[#0284C7] uppercase tracking-widest bg-sky-50 px-3 py-1 rounded-full border border-sky-200">
              RÉPONSES CLAIRES
            </span>
            <h2 className="font-display text-3xl font-extrabold text-[#0F172A] tracking-tight mt-4">
              Questions Fréquentes
            </h2>
          </div>

          <div className="space-y-4">
            {faqs.map((f, i) => (
              <div
                key={i}
                className="border border-slate-200 rounded-2xl overflow-hidden transition"
              >
                <button
                  onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                  className="w-full p-5 text-left font-display font-bold text-sm sm:text-base text-[#0F172A] flex items-center justify-between hover:bg-slate-50 transition"
                >
                  <span>{f.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-[#0284C7] transition-transform duration-200 ${
                      activeFaq === i ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {activeFaq === i && (
                  <div className="px-5 pb-5 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3 bg-slate-50/50">
                    {f.a}
                  </div>
                )}
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* =========================================================================
          9. FOOTER INSTITUTIONNEL PRESTIGE
          ========================================================================= */}
      <footer className="bg-[#0F172A] text-white pt-16 pb-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-slate-800">
            <div className="md:col-span-2">
              <div className="font-display font-bold text-xl text-white tracking-tight">
                CLINIQUE DENTAIRE LA GALERIE
              </div>
              <div className="text-xs font-mono text-[#38BDF8] mt-1 uppercase tracking-widest">
                Chirurgie & Haute Esthétique du Sourire • Almadies
              </div>
              <p className="text-xs text-slate-400 mt-4 max-w-sm leading-relaxed">
                Cabinet dentaire d'avant-garde aux Almadies. Plateau technique de pointe, facettes en céramique, implantologie assistée par ordinateur et prise de rendez-vous en ligne immédiate.
              </p>
            </div>

            <div>
              <div className="font-mono text-xs font-bold text-[#38BDF8] uppercase tracking-wider mb-4">
                PÔLES MÉDICAUX
              </div>
              <ul className="space-y-2 text-xs text-slate-400">
                <li>Facettes Céramique & Smile Design</li>
                <li>Implantologie Guidée 3D</li>
                <li>Blanchiment Dentaire Laser</li>
                <li>Alignement Invisible (Gouttières)</li>
                <li>Soins Conservateurs Inlays</li>
                <li>Urgences Bucco-Dentaires</li>
              </ul>
            </div>

            <div>
              <div className="font-mono text-xs font-bold text-[#38BDF8] uppercase tracking-wider mb-4">
                CONTACT DIRECT
              </div>
              <div className="space-y-3 text-xs text-slate-400">
                <p>📍 Almadies, Dakar (Sénégal)</p>
                <p>📞 +221 78 650 95 95</p>
                <p>⏰ Lun - Sam : 09h00 - 17h30</p>
                <div className="pt-2">
                  <a
                    href="https://wa.me/221786509595"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-emerald-400 font-mono text-xs hover:underline"
                  >
                    <svg viewBox="0 0 32 32" className="w-4 h-4 fill-emerald-400" xmlns="http://www.w3.org/2000/svg">
                      <path d="M16 2C8.28 2 2 8.28 2 16c0 2.72.78 5.26 2.14 7.42L2 30l6.76-2.1c2.1 1.28 4.56 2.1 7.24 2.1 7.72 0 14-6.28 14-14S23.72 2 16 2zm0 25.56c-2.3 0-4.44-.68-6.24-1.84l-.44-.28-4.64 1.44 1.46-4.52-.3-.48c-1.3-2.04-1.98-4.4-1.98-6.88 0-6.68 5.44-12.12 12.14-12.12 6.68 0 12.12 5.44 12.12 12.12 0 6.68-5.44 12.16-12.12 12.16zm6.66-9.1c-.36-.18-2.14-1.06-2.48-1.18-.34-.12-.58-.18-.82.18-.24.36-.94 1.18-1.16 1.42-.22.24-.44.26-.8.08-.36-.18-1.52-.56-2.9-1.8-1.08-.96-1.8-2.14-2.02-2.5-.22-.36-.02-.56.16-.74.16-.16.36-.42.54-.62.18-.2.24-.36.36-.58.12-.22.06-.42-.04-.6-.1-.18-.82-1.98-1.12-2.72-.3-.72-.6-.62-.82-.64h-.7c-.24 0-.62.1-.94.44-.32.36-1.24 1.22-1.24 2.96 0 1.74 1.28 3.42 1.46 3.66.18.24 2.5 3.82 6.06 5.36.84.36 1.5.58 2.02.74.86.28 1.64.24 2.26.14.7-.1 2.14-.88 2.44-1.72.3-.84.3-1.56.22-1.72-.1-.14-.34-.24-.7-.42z"/>
                    </svg>
                    <span>WhatsApp Secrétariat</span>
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] font-mono text-slate-500">
            <div>
              © {new Date().getFullYear()} Clinique Dentaire La Galerie. Tous droits réservés.
            </div>
            <div>
              Prototype interactif haute fidélité conçu par <strong className="text-slate-300">Daro TECH</strong>
            </div>
          </div>
        </div>
      </footer>

      {/* =========================================================================
          10. BOUTON FLOTTANT WHATSAPP PERMANENT (SEULEMENT LE LOGO OFFICIEL FLOTTANT)
          ========================================================================= */}
      <a
        href="https://wa.me/221786509595?text=Bonjour%20Clinique%20Dentaire%20La%20Galerie,%20je%20souhaite%20prendre%20rendez-vous."
        target="_blank"
        rel="noreferrer"
        className="whatsapp-float-btn fixed bottom-6 right-6 z-50 w-14 h-14 sm:w-16 sm:h-16 bg-[#25D366] text-white rounded-full shadow-2xl flex items-center justify-center cursor-pointer transition-transform duration-300 hover:scale-110 active:scale-95 group"
        aria-label="Contacter la Clinique La Galerie sur WhatsApp (+221 78 650 95 95)"
        title="WhatsApp Direct Clinique La Galerie (+221 78 650 95 95)"
      >
        {/* VRAI LOGO OFFICIEL VECTORIEL WHATSAPP (SANS TEXTE) */}
        <svg viewBox="0 0 32 32" className="w-8 h-8 sm:w-9 sm:h-9 fill-white shrink-0 group-hover:scale-110 transition-transform" xmlns="http://www.w3.org/2000/svg">
          <path d="M16 2C8.28 2 2 8.28 2 16c0 2.72.78 5.26 2.14 7.42L2 30l6.76-2.1c2.1 1.28 4.56 2.1 7.24 2.1 7.72 0 14-6.28 14-14S23.72 2 16 2zm0 25.56c-2.3 0-4.44-.68-6.24-1.84l-.44-.28-4.64 1.44 1.46-4.52-.3-.48c-1.3-2.04-1.98-4.4-1.98-6.88 0-6.68 5.44-12.12 12.14-12.12 6.68 0 12.12 5.44 12.12 12.12 0 6.68-5.44 12.16-12.12 12.16zm6.66-9.1c-.36-.18-2.14-1.06-2.48-1.18-.34-.12-.58-.18-.82.18-.24.36-.94 1.18-1.16 1.42-.22.24-.44.26-.8.08-.36-.18-1.52-.56-2.9-1.8-1.08-.96-1.8-2.14-2.02-2.5-.22-.36-.02-.56.16-.74.16-.16.36-.42.54-.62.18-.2.24-.36.36-.58.12-.22.06-.42-.04-.6-.1-.18-.82-1.98-1.12-2.72-.3-.72-.6-.62-.82-.64h-.7c-.24 0-.62.1-.94.44-.32.36-1.24 1.22-1.24 2.96 0 1.74 1.28 3.42 1.46 3.66.18.24 2.5 3.82 6.06 5.36.84.36 1.5.58 2.02.74.86.28 1.64.24 2.26.14.7-.1 2.14-.88 2.44-1.72.3-.84.3-1.56.22-1.72-.1-.14-.34-.24-.7-.42z"/>
        </svg>
      </a>

      {/* =========================================================================
          11. MODALE FLOTTANTE DE PRISE DE RDV EN 30 SECONDES SANS DÉPLACEMENT
          ========================================================================= */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
          <div className="relative bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="mb-6">
              <span className="text-[11px] font-mono text-[#0284C7] font-bold uppercase tracking-wider">
                RÉSERVATION SANS DÉPLACEMENT
              </span>
              <h3 className="font-display text-xl font-bold text-[#0F172A] mt-1">
                Prendre Rendez-vous
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Cabinet médical aux Almadies • Consultation personnalisée
              </p>
            </div>

            {bookingSuccess ? (
              <div className="text-center py-8 space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h4 className="font-display font-bold text-lg text-[#0F172A]">
                  Demande Transmise sur WhatsApp !
                </h4>
                <p className="text-xs text-slate-600 max-w-sm mx-auto">
                  Notre équipe médicale vous a ouvert votre fil de discussion WhatsApp. Nous vous confirmons votre horaire dans les plus brefs délais.
                </p>
                <button
                  onClick={() => {
                    setBookingSuccess(false);
                    setIsModalOpen(false);
                  }}
                  className="bg-[#0F172A] text-white text-xs font-bold px-6 py-2.5 rounded-xl"
                >
                  Fermer
                </button>
              </div>
            ) : (
              <form onSubmit={handleFinalBooking} className="space-y-4">
                <div>
                  <label className="block text-xs font-mono font-bold text-slate-700 uppercase mb-1.5">
                    Soin Sélectionné
                  </label>
                  <select
                    value={selectedCare}
                    onChange={(e) => setSelectedCare(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0284C7]"
                  >
                    <option value="Facettes Céramique & Smile Design">Facettes Céramique & Smile Design</option>
                    <option value="Implantologie Guidée 3D">Implantologie Guidée 3D</option>
                    <option value="Blanchiment Dentaire Laser">Blanchiment Dentaire Laser</option>
                    <option value="Alignement Invisible & Gouttières">Alignement Invisible / Gouttières</option>
                    <option value="Soins Conservateurs & Céramique">Soins Conservateurs & Inlays</option>
                    <option value="Urgences & Douleurs Bucco-Dentaires">Urgence Dentaire Prioritaire</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono font-bold text-slate-700 uppercase mb-2 flex items-center justify-between">
                    <span>Date Souhaitée</span>
                    <span className="text-[11px] text-[#0284C7] font-semibold lowercase">
                      {selectedDate && selectedDate !== 'Aujourd’hui' && selectedDate !== 'Demain' && selectedDate !== 'Cette semaine'
                        ? `✓ ${selectedDate}`
                        : ''}
                    </span>
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { key: 'Aujourd’hui', label: 'Aujourd’hui' },
                      { key: 'Demain', label: 'Demain' },
                      { key: 'Cette semaine', label: 'Cette semaine 📅' }
                    ].map((item) => (
                      <button
                        type="button"
                        key={item.key}
                        onClick={() => {
                          if (item.key === 'Cette semaine') {
                            setIsModalCalendarOpen(!isModalCalendarOpen);
                            if (selectedDate === 'Aujourd’hui' || selectedDate === 'Demain') {
                              setSelectedDate('Cette semaine');
                            }
                          } else {
                            setSelectedDate(item.key);
                            setIsModalCalendarOpen(false);
                          }
                        }}
                        className={`py-2 text-xs font-bold rounded-lg border transition cursor-pointer flex items-center justify-center gap-1 ${
                          (selectedDate === item.key || (item.key === 'Cette semaine' && isModalCalendarOpen))
                            ? 'bg-[#0F172A] text-white border-[#0F172A] shadow-sm'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        <span>{item.label}</span>
                      </button>
                    ))}
                  </div>

                  {/* Calendrier Modal Dépliable */}
                  {isModalCalendarOpen && (
                    <div className="mt-2.5 p-3.5 bg-slate-50 border-2 border-sky-300 rounded-2xl space-y-2.5 animate-fade-in shadow-inner">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-mono font-bold text-[#0284C7] flex items-center gap-1.5 uppercase tracking-wider text-[11px]">
                          <Calendar className="w-3.5 h-3.5 text-[#0284C7]" />
                          Choisir un jour de consultation
                        </span>
                        <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 font-bold">
                          Lun – Sam
                        </span>
                      </div>

                      <div className="grid grid-cols-4 sm:grid-cols-7 gap-1.5">
                        {upcomingDays.map((d, idx) => (
                          <button
                            key={idx}
                            type="button"
                            disabled={d.isSunday}
                            onClick={() => setSelectedDate(d.label)}
                            className={`p-1.5 rounded-xl border text-center transition flex flex-col items-center justify-between cursor-pointer ${
                              d.isSunday
                                ? 'opacity-40 bg-slate-100 border-slate-200 cursor-not-allowed'
                                : selectedDate === d.label
                                ? 'bg-[#0284C7] text-white border-[#0284C7] shadow-md scale-[1.03]'
                                : 'bg-white hover:bg-sky-50 text-slate-800 border-slate-200 hover:border-sky-300'
                            }`}
                          >
                            <span className="text-[9px] font-mono font-bold uppercase">{d.shortDay}</span>
                            <span className="text-sm font-extrabold my-0.5">{d.dayNum}</span>
                            <span className="text-[9px] font-mono opacity-80">{d.isSunday ? 'Fermé' : d.month}</span>
                          </button>
                        ))}
                      </div>

                      <div className="pt-2 border-t border-slate-200 flex items-center justify-between gap-2 text-xs">
                        <span className="text-[11px] font-mono text-slate-500">Autre date :</span>
                        <input
                          type="date"
                          min={new Date().toISOString().split('T')[0]}
                          onChange={(e) => {
                            if (e.target.value) {
                              const parts = e.target.value.split('-');
                              const d = new Date(parts[0], parts[1] - 1, parts[2]);
                              const dayNames = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
                              const months = ['Janv', 'Févr', 'Mars', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sept', 'Oct', 'Nov', 'Déc'];
                              setSelectedDate(`${dayNames[d.getDay()]} ${d.getDate()} ${months[d.getMonth()]}`);
                            }
                          }}
                          className="bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-xs text-slate-800 font-mono focus:outline-none focus:ring-1 focus:ring-[#0284C7]"
                        />
                      </div>

                      {selectedDate && selectedDate !== 'Cette semaine' && (
                        <div className="bg-sky-50 text-[#0369A1] text-xs font-mono font-bold py-1.5 px-3 rounded-xl flex items-center justify-between border border-sky-200">
                          <span className="flex items-center gap-1.5 truncate">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            <span className="truncate">{selectedDate}</span>
                          </span>
                          <button
                            type="button"
                            onClick={() => setIsModalCalendarOpen(false)}
                            className="text-[10px] bg-[#0284C7] hover:bg-[#0369A1] text-white px-2.5 py-1 rounded-lg font-bold shrink-0 transition cursor-pointer"
                          >
                            Valider ✓
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-mono font-bold text-slate-700 uppercase mb-2 flex items-center justify-between">
                    <span>Créneau Horaire</span>
                    <span className="text-[11px] text-[#0284C7] font-semibold lowercase">
                      {selectedSlot ? `✓ ${selectedSlot}` : ''}
                    </span>
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {['09:30', '11:00', '15:00'].map((slot) => (
                      <button
                        type="button"
                        key={slot}
                        onClick={() => {
                          setSelectedSlot(slot);
                          setIsModalTimeOpen(false);
                        }}
                        className={`py-2 text-xs font-mono font-bold rounded-lg border transition cursor-pointer ${
                          selectedSlot === slot && !isModalTimeOpen
                            ? 'bg-[#0284C7] text-white border-[#0284C7] shadow-sm'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {slot}
                      </button>
                    ))}
                    <button
                      type="button"
                      onClick={() => setIsModalTimeOpen(!isModalTimeOpen)}
                      className={`py-2 text-xs font-bold rounded-lg border transition cursor-pointer flex items-center justify-center gap-1 ${
                        isModalTimeOpen || !['09:30', '11:00', '15:00'].includes(selectedSlot)
                          ? 'bg-[#0F172A] text-white border-[#0F172A] shadow-sm'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      <Clock className="w-3 h-3 text-[#38BDF8]" />
                      <span>Autre 🕒</span>
                    </button>
                  </div>

                  {/* Panneau Dépliable Modal de Tous les Horaires */}
                  {isModalTimeOpen && (
                    <div className="mt-2.5 p-3.5 bg-slate-50 border-2 border-sky-300 rounded-2xl space-y-3 animate-fade-in shadow-inner">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-mono font-bold text-[#0284C7] flex items-center gap-1.5 uppercase tracking-wider text-[11px]">
                          <Clock className="w-3.5 h-3.5 text-[#0284C7]" />
                          Choisir une heure de passage
                        </span>
                        <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 font-bold">
                          Cabinet Almadies
                        </span>
                      </div>

                      {/* Matin */}
                      <div>
                        <div className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                          <span>☀️ Matin (09h00 – 13h00)</span>
                        </div>
                        <div className="grid grid-cols-4 sm:grid-cols-7 gap-1.5">
                          {morningSlots.map((slot) => (
                            <button
                              key={slot}
                              type="button"
                              onClick={() => setSelectedSlot(slot)}
                              className={`py-1.5 rounded-lg border text-xs font-mono font-bold transition cursor-pointer text-center ${
                                selectedSlot === slot
                                  ? 'bg-[#0284C7] text-white border-[#0284C7] shadow-md scale-[1.03]'
                                  : 'bg-white hover:bg-sky-50 text-slate-800 border-slate-200 hover:border-sky-300'
                              }`}
                            >
                              {slot}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Après-midi */}
                      <div>
                        <div className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                          <span>⛅ Après-midi (14h30 – 17h30)</span>
                        </div>
                        <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5">
                          {afternoonSlots.map((slot) => (
                            <button
                              key={slot}
                              type="button"
                              onClick={() => setSelectedSlot(slot)}
                              className={`py-1.5 rounded-lg border text-xs font-mono font-bold transition cursor-pointer text-center ${
                                selectedSlot === slot
                                  ? 'bg-[#0284C7] text-white border-[#0284C7] shadow-md scale-[1.03]'
                                  : 'bg-white hover:bg-sky-50 text-slate-800 border-slate-200 hover:border-sky-300'
                              }`}
                            >
                              {slot}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Heure Précise Libre */}
                      <div className="pt-2 border-t border-slate-200 flex items-center justify-between gap-2 text-xs">
                        <span className="text-[11px] font-mono text-slate-500">Heure personnalisée :</span>
                        <input
                          type="time"
                          min="09:00"
                          max="18:00"
                          step="900"
                          value={selectedSlot.includes(':') ? selectedSlot.slice(0, 5) : '11:00'}
                          onChange={(e) => {
                            if (e.target.value) {
                              setSelectedSlot(e.target.value);
                            }
                          }}
                          className="bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-xs text-slate-800 font-mono focus:outline-none focus:ring-1 focus:ring-[#0284C7]"
                        />
                      </div>

                      {/* Confirmation badge */}
                      <div className="bg-sky-50 text-[#0369A1] text-xs font-mono font-bold py-1.5 px-3 rounded-xl flex items-center justify-between border border-sky-200">
                        <span className="flex items-center gap-1.5 truncate">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span>Créneau retenu : {selectedSlot}</span>
                        </span>
                        <button
                          type="button"
                          onClick={() => setIsModalTimeOpen(false)}
                          className="text-[10px] bg-[#0284C7] hover:bg-[#0369A1] text-white px-2.5 py-1 rounded-lg font-bold shrink-0 transition cursor-pointer"
                        >
                          Valider ✓
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-mono font-bold text-slate-700 uppercase mb-1.5">
                    Nom Complet du Patient
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Madame Diop"
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs sm:text-sm placeholder-slate-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono font-bold text-slate-700 uppercase mb-1.5">
                    Numéro WhatsApp
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="Ex: +221 77 ..."
                    value={patientPhone}
                    onChange={(e) => setPatientPhone(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs sm:text-sm placeholder-slate-400"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full btn-magnetic bg-[#059669] hover:bg-[#047857] text-white font-bold py-3.5 rounded-xl shadow-lg shadow-emerald-700/20 text-xs sm:text-sm flex items-center justify-center gap-2 mt-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Envoyer la demande sur WhatsApp (+221 78 650 95 95)</span>
                </button>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
