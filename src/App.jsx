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
  MessageCircle,
  HelpCircle,
  Smile,
  Zap,
  Award,
  Layers,
  ChevronDown,
  Eye,
  Sliders,
  Scan,
  Cpu,
  Check
} from 'lucide-react';

export default function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCare, setSelectedCare] = useState('Facettes Céramique & Smile Design');
  const [selectedDate, setSelectedDate] = useState('Demain');
  const [selectedSlot, setSelectedSlot] = useState('11:00');
  const [patientName, setPatientName] = useState('');
  const [patientPhone, setPatientPhone] = useState('');
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [activeFaq, setActiveFaq] = useState(null);

  // Terminal 3D Mode & Simulation State
  const [terminalMode, setTerminalMode] = useState('scanner'); // 'scanner' | 'simulation' | 'anesthesia'
  const [sliderPosition, setSliderPosition] = useState(50); // for before/after slider (0 to 100)
  const [telemetryPoints, setTelemetryPoints] = useState(1428500);

  // Dynamic Testimonial Carousel State
  const [activeTestimonialIdx, setActiveTestimonialIdx] = useState(0);
  const [isTestimonialAutoplay, setIsTestimonialAutoplay] = useState(true);

  // Canvas radar animation ref
  const canvasRef = useRef(null);

  // Live telemetry pulse
  useEffect(() => {
    const interval = setInterval(() => {
      setTelemetryPoints((prev) => prev + Math.floor((Math.random() - 0.45) * 120));
    }, 800);
    return () => clearInterval(interval);
  }, []);

  // Autoplay Testimonial Carousel
  useEffect(() => {
    if (!isTestimonialAutoplay) return;
    const timer = setInterval(() => {
      setActiveTestimonialIdx((prev) => (prev + 1) % 6);
    }, 4500);
    return () => clearInterval(timer);
  }, [isTestimonialAutoplay]);

  // Canvas 3D Medical Radar Background
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
      radius: Math.random() * 2.2 + 1,
      color: i % 2 === 0 ? 'rgba(2, 132, 199, 0.45)' : 'rgba(16, 185, 129, 0.35)'
    }));

    let angle = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Radar scan line
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

      // Sweeping radar arm
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + Math.cos(angle) * radius, cy + Math.sin(angle) * radius);
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.15)';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Particles & Mesh Interconnects
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
            ctx.strokeStyle = `rgba(2, 132, 199, ${0.13 * (1 - dist / 95)})`;
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
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] relative selection:bg-sky-200">

      {/* =========================================================================
          1. TOP BANNER LIVE & CONTACT DIRECT
          ========================================================================= */}
      <div className="bg-[#0F172A] text-white text-xs py-2 px-4 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-2 font-mono">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <span className="text-slate-200 font-semibold">CLINIQUE OUVERTE • ALMADIES, DAKAR</span>
            <span className="hidden md:inline text-slate-500">|</span>
            <span className="hidden md:inline text-slate-400">Scanner 3D & Prise de RDV en ligne</span>
          </div>
          <div className="flex items-center gap-4 text-slate-300">
            <span className="hidden sm:inline">Lun - Sam : 09h00 – 17h30</span>
            <a href="tel:+221786509595" className="hover:text-sky-400 transition flex items-center gap-1 font-bold text-sky-300">
              <Phone className="w-3.5 h-3.5 text-sky-400" /> +221 78 650 95 95
            </a>
          </div>
        </div>
      </div>

      {/* =========================================================================
          2. NAVBAR PRESTIGE FLOTTANTE
          ========================================================================= */}
      <nav className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">

          {/* Logo Officiel La Galerie */}
          <a href="#" className="flex items-center gap-3 group">
            <div className="w-11 h-11 rounded-2xl bg-[#0F172A] flex items-center justify-center text-white shadow-md shadow-slate-900/10 group-hover:scale-105 transition">
              <svg width="24" height="24" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="100" height="100" rx="25" fill="#0F172A"/>
                <path d="M30 40C30 25 70 25 70 40C70 60 55 75 50 82C45 75 30 60 30 40Z" fill="none" stroke="#38BDF8" strokeWidth="7"/>
                <circle cx="50" cy="45" r="9" fill="#10B981"/>
              </svg>
            </div>
            <div>
              <div className="font-display font-bold text-lg tracking-tight text-[#0F172A]">
                LA GALERIE
              </div>
              <div className="text-[10px] font-mono tracking-widest text-[#0284C7] uppercase font-semibold">
                Clinique Dentaire • Almadies
              </div>
            </div>
          </a>

          {/* Liens Desktop */}
          <div className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-600">
            <a href="#soins" className="hover:text-[#0284C7] transition">Soins d'Excellence</a>
            <a href="#technologie" className="hover:text-[#0284C7] transition flex items-center gap-1.5">
              <span>Plateau 3D</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            </a>
            <a href="#experience" className="hover:text-[#0284C7] transition">L'Écrin Almadies</a>
            <a href="#avis" className="hover:text-[#0284C7] transition">Témoignages (6)</a>
            <a href="#faq" className="hover:text-[#0284C7] transition">FAQ</a>
          </div>

          {/* Bouton RDV Header */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsModalOpen(true)}
              className="btn-magnetic bg-[#0F172A] hover:bg-[#1E293B] text-white text-xs sm:text-sm font-bold px-5 py-2.5 rounded-xl shadow-lg shadow-slate-900/15 flex items-center gap-2"
            >
              <Calendar className="w-4 h-4 text-[#38BDF8]" />
              <span>Prendre Rendez-vous</span>
            </button>
          </div>
        </div>
      </nav>

      {/* =========================================================================
          3. HERO SECTION CLINIQUE PURE AVEC MODULE LIVE
          ========================================================================= */}
      <section className="relative overflow-hidden pt-10 pb-20 lg:pt-14 lg:pb-28">
        {/* Canvas Biomédical 3D d'arrière-plan */}
        <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-0" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">

            {/* Colonne Gauche : Titre Statutaire & Autorité */}
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-50 border border-sky-200 text-sky-800 text-xs font-mono font-semibold mb-6">
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
                La Clinique Dentaire <strong>La Galerie</strong> allie l'exigence médicale internationale, les technologies 3D de pointe et un confort absolu au cœur des Almadies.
              </p>

              {/* Télémétrie d'Autorité Interactive */}
              <div className="grid grid-cols-3 gap-4 p-4 rounded-2xl bg-white/90 backdrop-blur-sm border border-slate-200/90 shadow-sm max-w-lg mb-8 hover:shadow-md transition">
                <div>
                  <div className="font-display text-2xl font-bold text-[#0F172A]">99.4%</div>
                  <div className="text-[11px] font-mono text-slate-500 uppercase">Satisfaction</div>
                </div>
                <div className="border-x border-slate-100 px-3">
                  <div className="font-display text-2xl font-bold text-[#059669]">ZÉRO</div>
                  <div className="text-[11px] font-mono text-slate-500 uppercase">Douleur</div>
                </div>
                <div>
                  <div className="font-display text-2xl font-bold text-[#0284C7]">15 µm</div>
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
                  <MessageCircle className="w-4 h-4 text-emerald-600" />
                  <span>Poser une question WhatsApp</span>
                </a>
              </div>
            </div>

            {/* Colonne Droite : Module Express Prise de RDV Directe 30s */}
            <div className="lg:col-span-5">
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xl shadow-slate-900/5 relative">
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
                  {/* Choix du soin */}
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

                  {/* Choix du jour */}
                  <div>
                    <label className="block text-xs font-mono font-bold text-slate-700 uppercase mb-2">
                      2. Jour Préféré
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {['Aujourd’hui', 'Demain', 'Cette semaine'].map((d) => (
                        <button
                          type="button"
                          key={d}
                          onClick={() => setSelectedDate(d)}
                          className={`py-2 text-xs font-bold rounded-lg border transition ${
                            selectedDate === d
                              ? 'bg-[#0F172A] text-white border-[#0F172A] shadow-sm'
                              : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          {d}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Choix du créneau */}
                  <div>
                    <label className="block text-xs font-mono font-bold text-slate-700 uppercase mb-2">
                      3. Créneau Horaire
                    </label>
                    <div className="grid grid-cols-4 gap-2">
                      {['09:30', '11:00', '15:00', '16:30'].map((slot) => (
                        <button
                          type="button"
                          key={slot}
                          onClick={() => setSelectedSlot(slot)}
                          className={`py-1.5 text-xs font-mono font-bold rounded-lg border transition ${
                            selectedSlot === slot
                              ? 'bg-[#0284C7] text-white border-[#0284C7] shadow-sm'
                              : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          {slot}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Coordonnées */}
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
          5. PLATEAU TECHNIQUE & SIMULATEUR 3D INTERACTIF EN DIRECT
          ========================================================================= */}
      <section id="technologie" className="py-20 bg-[#0F172A] text-white relative overflow-hidden">
        {/* Lueur d'ambiance laser */}
        <div className="absolute top-1/4 -right-20 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-10 left-10 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Colonne Gauche : Argumentaire & Sélecteur Interactif */}
            <div className="lg:col-span-6">
              <span className="text-xs font-mono font-bold text-[#38BDF8] uppercase tracking-widest bg-sky-950 px-3 py-1 rounded-full border border-sky-800">
                HAUTE TECHNOLOGIE DENTAIRE
              </span>
              <h2 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight mt-4 mb-6 leading-tight">
                Zéro Pâte, Zéro Douleur.<br />
                <span className="text-[#38BDF8]">La Révolution Numérique 3D.</span>
              </h2>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-8">
                À la Clinique La Galerie, nous avons banni les anciennes empreintes en pâte suffocante et les gestes invasifs. Vos dents sont numérisées en 3D en temps réel avec une précision de 15 microns.
              </p>

              {/* 3 Cartes Cliquables qui pilotent le Terminal 3D */}
              <div className="space-y-4">
                {[
                  {
                    id: 'scanner',
                    title: 'Scanner Intra-Oral 3D Couleur',
                    desc: 'Numérisation complète de vos mâchoires en 3 minutes sans aucun contact désagréable.',
                    sub: 'Précision optique 15 µm • Zéro nausée'
                  },
                  {
                    id: 'simulation',
                    title: 'Modélisation Smile Design Avant / Après',
                    desc: 'Visualisez le résultat de vos facettes ou implants sur écran géant 4K avant même de débuter le traitement.',
                    sub: 'Simulation esthétique instantanée'
                  },
                  {
                    id: 'anesthesia',
                    title: 'Anesthésie Ostéocentrale Assistée',
                    desc: 'Engourdissement réservé strictement à la dent soignée. Vous reparlez et souriez sans lèvre gelée.',
                    sub: 'Zéro seringue visible • Zéro douleur'
                  }
                ].map((item) => (
                  <div
                    key={item.id}
                    onClick={() => setTerminalMode(item.id)}
                    className={`cursor-pointer transition-all duration-200 p-4 rounded-xl border flex gap-4 ${
                      terminalMode === item.id
                        ? 'bg-slate-800/90 border-[#38BDF8] shadow-lg shadow-sky-500/10 scale-[1.01]'
                        : 'bg-slate-800/40 border-slate-700/60 hover:bg-slate-800/60 hover:border-slate-600'
                    }`}
                  >
                    <div
                      className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 transition ${
                        terminalMode === item.id
                          ? 'bg-[#38BDF8] text-[#0F172A] font-bold'
                          : 'bg-sky-500/20 text-[#38BDF8]'
                      }`}
                    >
                      {terminalMode === item.id ? <Check className="w-5 h-5" /> : <Scan className="w-5 h-5" />}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-sm text-white">{item.title}</h4>
                        {terminalMode === item.id && (
                          <span className="text-[10px] font-mono text-[#38BDF8] bg-sky-950/80 px-2 py-0.5 rounded border border-sky-800">
                            ACTIF
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-400 mt-1 leading-relaxed">{item.desc}</p>
                      <p className="text-[11px] font-mono text-emerald-400 mt-1.5 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                        {item.sub}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Colonne Droite : Terminal 3D Dynamique & Interactif */}
            <div className="lg:col-span-6">
              <div className="relative rounded-3xl overflow-hidden border border-slate-700 shadow-2xl bg-slate-900 p-5 sm:p-7">
                
                {/* Header Moniteur */}
                <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-5 font-mono text-xs text-slate-400">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block"></span>
                    <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block"></span>
                    <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block"></span>
                    <span className="ml-2 font-bold text-slate-300">TERMINAL 3D LA GALERIE</span>
                  </div>
                  <span className="text-emerald-400 flex items-center gap-1.5 font-bold">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                    CALIBRATION OPTIQUE OK
                  </span>
                </div>

                {/* Écran Moniteur Principal */}
                <div className="relative aspect-[4/3] rounded-2xl bg-[#090D16] border border-slate-800 overflow-hidden flex flex-col justify-between p-5">

                  {/* Mode 1 : SCANNER 3D INTRA-ORAL AVEC FAISCEAU LASER DYNAMIQUE */}
                  {terminalMode === 'scanner' && (
                    <div className="relative h-full flex flex-col justify-between">
                      {/* Ligne laser qui balaie de haut en bas */}
                      <div className="scan-laser-beam absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#38BDF8] to-transparent shadow-[0_0_15px_#38BDF8] pointer-events-none z-20"></div>

                      {/* Télémétrie en haut */}
                      <div className="flex justify-between items-start text-[11px] font-mono text-slate-400 z-10">
                        <div>
                          <div className="text-[#38BDF8] font-bold">MODE : CAPTURE VOLUMÉTRIQUE</div>
                          <div>CAPTEUR : 4K HD OPTICAL</div>
                        </div>
                        <div className="text-right">
                          <div className="text-emerald-400">POINTS 3D : {telemetryPoints.toLocaleString()}</div>
                          <div>PRÉCISION : 14.8 µm</div>
                        </div>
                      </div>

                      {/* Maillage 3D central stylisé */}
                      <div className="my-auto text-center relative z-10 py-4">
                        <div className="relative inline-block">
                          <div className="w-24 h-24 rounded-full bg-sky-500/10 border border-sky-500/30 flex items-center justify-center mx-auto mb-3 shadow-[0_0_30px_rgba(56,189,248,0.2)]">
                            <Activity className="w-12 h-12 text-[#38BDF8] animate-pulse" />
                          </div>
                          {/* Ondes concentriques */}
                          <div className="wave-ring absolute inset-0 rounded-full border border-sky-400/40 pointer-events-none"></div>
                        </div>
                        <div className="font-display font-bold text-lg text-white">
                          Reconstruction d'Arcade Dentaire en Direct
                        </div>
                        <p className="text-xs text-slate-400 max-w-xs mx-auto mt-1 font-mono">
                          Échantillonnage en temps réel sans empreinte physique
                        </p>
                      </div>

                      {/* Barre de progression & CTA */}
                      <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono z-10">
                        <span className="text-slate-400 flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-[#38BDF8] animate-pulse"></span>
                          FLUX ULTRA-HAUTE DÉFINITION
                        </span>
                        <button
                          onClick={() => setIsModalOpen(true)}
                          className="bg-[#38BDF8] hover:bg-sky-400 text-[#0F172A] font-bold text-[11px] px-3.5 py-1.5 rounded-lg transition"
                        >
                          Tester en cabinet →
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Mode 2 : SIMULATEUR SLIDER AVANT / APRÈS LE TRAITEMENT */}
                  {terminalMode === 'simulation' && (
                    <div className="relative h-full flex flex-col justify-between">
                      <div className="flex justify-between items-center text-[11px] font-mono text-slate-400 z-10 mb-2">
                        <span className="text-[#38BDF8] font-bold">SIMULATION DU SOURIRE (SLIDER INTERACTIF)</span>
                        <span className="text-amber-300">FAIRE GLISSER LE CURSEUR ↔</span>
                      </div>

                      {/* Cadre de comparaison Avant / Après */}
                      <div className="relative flex-1 rounded-xl overflow-hidden bg-slate-900 border border-slate-700 select-none">
                        {/* Côté Après (Smile Design parfait) */}
                        <div className="absolute inset-0 bg-gradient-to-r from-sky-950 via-slate-900 to-[#0F172A] flex flex-col items-center justify-center p-4 text-center">
                          <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-950/80 px-2.5 py-1 rounded-full border border-emerald-800 mb-2">
                            APRÈS : SMILE DESIGN CÉRAMIQUE
                          </span>
                          <div className="font-serif italic text-3xl sm:text-4xl text-[#38BDF8] font-normal">
                            Éclat Parfait & Harmonie Naturelle
                          </div>
                          <p className="text-xs text-slate-300 mt-2 font-mono">Teinte BL1 Blanc Naturel • Zéro Défaut</p>
                        </div>

                        {/* Côté Avant (Masqué dynamiquement selon slider) */}
                        <div
                          className="absolute inset-y-0 left-0 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border-r-2 border-amber-400 flex flex-col items-center justify-center p-4 text-center overflow-hidden"
                          style={{ width: `${sliderPosition}%` }}
                        >
                          <div className="min-w-[280px]">
                            <span className="text-[10px] font-mono font-bold text-amber-400 bg-amber-950/80 px-2.5 py-1 rounded-full border border-amber-800 mb-2 inline-block">
                              AVANT TRAITEMENT
                            </span>
                            <div className="font-sans font-bold text-xl sm:text-2xl text-slate-300">
                              Dents Tachées & Espacement
                            </div>
                            <p className="text-xs text-slate-400 mt-2 font-mono">Teinte terne • Émail ébréché</p>
                          </div>
                        </div>

                        {/* Poignée du curseur */}
                        <div
                          className="absolute top-0 bottom-0 w-8 -ml-4 flex items-center justify-center cursor-ew-resize z-30"
                          style={{ left: `${sliderPosition}%` }}
                        >
                          <div className="w-7 h-7 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center shadow-lg font-bold text-xs">
                            ↔
                          </div>
                        </div>
                      </div>

                      {/* Contrôle Slider */}
                      <div className="pt-3 flex items-center gap-3 z-10">
                        <span className="text-[10px] font-mono text-slate-400">AVANT</span>
                        <input
                          type="range"
                          min="5"
                          max="95"
                          value={sliderPosition}
                          onChange={(e) => setSliderPosition(Number(e.target.value))}
                          className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-[#38BDF8]"
                        />
                        <span className="text-[10px] font-mono text-[#38BDF8]">APRÈS</span>
                      </div>
                    </div>
                  )}

                  {/* Mode 3 : ANESTHÉSIE OSTÉOCENTRALE SANS AIGUILLE */}
                  {terminalMode === 'anesthesia' && (
                    <div className="relative h-full flex flex-col justify-between">
                      <div className="flex justify-between items-start text-[11px] font-mono text-slate-400 z-10">
                        <span className="text-[#059669] font-bold">SYSTÈME QUICK-SLEEPER ASSISTÉ</span>
                        <span className="text-emerald-400">CONFORT : 100% SANS DOULEUR</span>
                      </div>

                      <div className="my-auto text-center py-4">
                        <div className="w-20 h-20 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto mb-3 shadow-[0_0_25px_rgba(16,185,129,0.2)]">
                          <Shield className="w-10 h-10 text-emerald-400" />
                        </div>
                        <h4 className="font-display font-bold text-lg text-white">
                          Diffusion Électronique Micro-Gouttes
                        </h4>
                        <p className="text-xs text-slate-400 max-w-sm mx-auto mt-2">
                          La pression est régulée par micro-processeur en fonction de la résistance osseuse. Résultat : vous ne sentez strictement rien.
                        </p>
                      </div>

                      <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs font-mono z-10">
                        <span className="text-emerald-400 flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          Lèvre normale, pas d'engourdissement
                        </span>
                        <button
                          onClick={() => setIsModalOpen(true)}
                          className="bg-emerald-500 hover:bg-emerald-400 text-[#0F172A] font-bold text-[11px] px-3.5 py-1.5 rounded-lg transition"
                        >
                          Prendre RDV sans peur →
                        </button>
                      </div>
                    </div>
                  )}

                </div>
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

                <div className="py-6 space-y-3 font-mono text-xs">
                  <div className="flex justify-between py-1.5 border-b border-slate-100">
                    <span className="text-slate-500">Lundi – Jeudi :</span>
                    <span className="font-bold text-slate-800">09h00 – 13h00 / 14h30 – 17h30</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-slate-100">
                    <span className="text-slate-500">Vendredi :</span>
                    <span className="font-bold text-slate-800">09h00 – 13h00 / 15h30 – 17h30</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-slate-100">
                    <span className="text-slate-500">Samedi :</span>
                    <span className="font-bold text-slate-800">09h00 – 13h30 (Urgences & Soins)</span>
                  </div>
                  <div className="flex justify-between py-1.5 text-slate-400">
                    <span>Dimanche :</span>
                    <span>Fermé</span>
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
                Cabinet dentaire d'avant-garde aux Almadies. Plateau technique 3D, facettes en céramique, implantologie assistée par ordinateur et prise de rendez-vous en ligne immédiate.
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
                    <MessageCircle className="w-3.5 h-3.5" />
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
          10. BOUTON FLOTTANT WHATSAPP PERMANENT (CONVERSION MAXIMALE)
          ========================================================================= */}
      <a
        href="https://wa.me/221786509595?text=Bonjour%20Clinique%20Dentaire%20La%20Galerie,%20je%20souhaite%20prendre%20rendez-vous."
        target="_blank"
        rel="noreferrer"
        className="whatsapp-float-btn fixed bottom-6 right-6 z-50 bg-[#25D366] text-white p-3.5 sm:px-5 sm:py-3.5 rounded-full shadow-2xl flex items-center gap-2.5 font-bold text-xs sm:text-sm tracking-wide"
      >
        <MessageCircle className="w-5 h-5 fill-white text-[#25D366]" />
        <span className="hidden sm:inline">Prendre RDV WhatsApp</span>
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

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-mono font-bold text-slate-700 uppercase mb-1.5">
                      Date Souhaitée
                    </label>
                    <select
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-800"
                    >
                      <option value="Aujourd’hui">Aujourd’hui</option>
                      <option value="Demain">Demain</option>
                      <option value="Dans 48h">Dans 48 heures</option>
                      <option value="Cette semaine">Cette semaine</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-mono font-bold text-slate-700 uppercase mb-1.5">
                      Créneau Horaire
                    </label>
                    <select
                      value={selectedSlot}
                      onChange={(e) => setSelectedSlot(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-800"
                    >
                      <option value="09:30 (Matin)">09:30 (Matin)</option>
                      <option value="11:00 (Matin)">11:00 (Matin)</option>
                      <option value="15:00 (Après-midi)">15:00 (Après-midi)</option>
                      <option value="16:30 (Fin de journée)">16:30 (Fin de journée)</option>
                    </select>
                  </div>
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
