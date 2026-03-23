import React, { useState, useRef, useEffect, Component, ErrorInfo, ReactNode } from 'react';
import { 
  BrowserRouter as Router, 
  Routes, 
  Route, 
  Link, 
  useLocation,
  useNavigate
} from 'react-router-dom';
import { 
  Camera, 
  Heart, 
  Cake, 
  Users, 
  Star, 
  Phone, 
  Mic, 
  MicOff, 
  Loader2, 
  ChevronRight,
  Instagram,
  Facebook,
  Mail,
  Calendar,
  Clock,
  CheckCircle2,
  LogOut,
  LogIn,
  Quote,
  ArrowRight,
  MessageCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { GoogleGenAI } from "@google/genai";
import { 
  db, 
  auth, 
  googleProvider, 
  signInWithPopup, 
  signOut, 
  collection, 
  addDoc, 
  onSnapshot, 
  query, 
  orderBy, 
  limit, 
  serverTimestamp,
  handleFirestoreError,
  OperationType
} from './firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { SERVICES } from './constants';
import ServiceDetail from './components/ServiceDetail';
import { BookingData, TestimonialData } from './types';

// --- Error Boundary ---
interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false, error: null };
  props: ErrorBoundaryProps;

  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.props = props;
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      let errorMessage = "Something went wrong.";
      try {
        const parsedError = JSON.parse(this.state.error?.message || "{}");
        if (parsedError.error) {
          errorMessage = parsedError.error;
        }
      } catch (e) {
        errorMessage = this.state.error?.message || errorMessage;
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-studio-dark text-white p-6 text-center">
          <div className="glass p-12 rounded-[3rem] max-w-md">
            <h2 className="text-3xl font-serif mb-4">Oops!</h2>
            <p className="text-white/60 mb-8">{errorMessage}</p>
            <button 
              onClick={() => window.location.reload()}
              className="bg-gold text-black px-8 py-3 rounded-full font-bold hover:bg-white transition-all"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// --- Constants ---
// SERVICES moved to constants.tsx

// --- Components ---

// --- Booking System ---
const BookingSystem = () => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState<BookingData>({
    serviceType: SERVICES[0].title,
    date: '',
    time: '',
    clientName: '',
    clientEmail: '',
    clientPhone: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const path = 'bookings';
      await addDoc(collection(db, path), {
        ...formData,
        status: 'pending',
        createdAt: serverTimestamp()
      });
      setSuccess(true);
      setLoading(false);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'bookings');
    }
  };

  if (success) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass p-12 rounded-[3rem] text-center max-w-xl mx-auto"
      >
        <CheckCircle2 className="w-20 h-20 text-gold mx-auto mb-6" />
        <h3 className="text-3xl font-serif mb-4">Booking Confirmed!</h3>
        <p className="text-white/60 mb-8">
          Thank you, {formData.clientName}. We've received your request for {formData.serviceType} on {formData.date} at {formData.time}. We'll contact you shortly.
        </p>
        <button 
          onClick={() => { setSuccess(false); setStep(1); setFormData({ ...formData, date: '', time: '' }); }}
          className="bg-gold text-black px-8 py-3 rounded-full font-bold hover:bg-white transition-all"
        >
          Make Another Booking
        </button>
      </motion.div>
    );
  }

  return (
    <div className="glass p-8 md:p-12 rounded-[3rem] max-w-4xl mx-auto">
      <div className="flex justify-center gap-12 mb-12">
        {[1, 2].map((s) => (
          <div key={s} className="flex flex-col items-center gap-2">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${step >= s ? 'bg-gold text-black' : 'bg-white/10 text-white/40'}`}>
              {s}
            </div>
            <span className={`text-[10px] uppercase tracking-widest ${step >= s ? 'text-gold' : 'text-white/40'}`}>
              {s === 1 ? 'Service' : 'Schedule & Details'}
            </span>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit}>
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div 
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              {SERVICES.map((service) => (
                <button
                  key={service.title}
                  type="button"
                  onClick={() => { setFormData({ ...formData, serviceType: service.title }); setStep(2); }}
                  className={`p-6 rounded-3xl border text-left transition-all ${formData.serviceType === service.title ? 'border-gold bg-gold/10' : 'border-white/10 hover:border-white/30'}`}
                >
                  <div className="flex items-center gap-4 mb-2">
                    <div className="p-2 bg-gold/10 rounded-xl text-gold">{service.icon}</div>
                    <h4 className="font-bold">{service.title}</h4>
                  </div>
                  <p className="text-xs text-white/40">{service.description}</p>
                </button>
              ))}
            </motion.div>
          )}

          {step === 2 && (
            <motion.div 
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest text-white/40 flex items-center gap-2">
                    <Calendar className="w-3 h-3" /> Select Date
                  </label>
                  <input 
                    type="date" 
                    required
                    min={new Date().toISOString().split('T')[0]}
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl focus:border-gold outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest text-white/40 flex items-center gap-2">
                    <Clock className="w-3 h-3" /> Select Time
                  </label>
                  <select 
                    required
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl focus:border-gold outline-none appearance-none"
                  >
                    <option value="" className="bg-studio-dark">Choose a time slot</option>
                    {['09:00 AM', '10:00 AM', '11:00 AM', '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM'].map(t => (
                      <option key={t} value={t} className="bg-studio-dark">{t}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t border-white/5">
                <input 
                  type="text" 
                  placeholder="Full Name" 
                  required
                  value={formData.clientName}
                  onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl focus:border-gold outline-none"
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input 
                    type="email" 
                    placeholder="Email Address" 
                    required
                    value={formData.clientEmail}
                    onChange={(e) => setFormData({ ...formData, clientEmail: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl focus:border-gold outline-none"
                  />
                  <input 
                    type="tel" 
                    placeholder="Phone Number" 
                    required
                    value={formData.clientPhone}
                    onChange={(e) => setFormData({ ...formData, clientPhone: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl focus:border-gold outline-none"
                  />
                </div>
              </div>

              <div className="flex gap-4">
                <button type="button" onClick={() => setStep(1)} className="flex-1 border border-white/10 py-4 rounded-2xl hover:bg-white/5 transition-all">Back</button>
                <button 
                  type="submit" 
                  disabled={loading}
                  className="flex-1 bg-gold text-black font-bold py-4 rounded-2xl hover:bg-white transition-all flex items-center justify-center gap-2"
                >
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Confirm Booking'}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </form>
    </div>
  );
};

const Testimonials = () => {
  const [testimonials, setTestimonials] = useState<TestimonialData[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [newReview, setNewReview] = useState("");
  const [rating, setRating] = useState(5);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (u) => setUser(u));
    
    const q = query(collection(db, 'testimonials'), orderBy('createdAt', 'desc'), limit(10));
    const unsubscribeSnapshot = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as TestimonialData));
      setTestimonials(data);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'testimonials');
    });

    return () => {
      unsubscribeAuth();
      unsubscribeSnapshot();
    };
  }, []);

  const handleSignIn = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error("Sign in error:", error);
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newReview) return;
    setSubmitting(true);
    try {
      await addDoc(collection(db, 'testimonials'), {
        clientName: user.displayName || user.email?.split('@')[0] || 'Anonymous',
        review: newReview,
        rating,
        createdAt: serverTimestamp()
      });
      setNewReview("");
      setSubmitting(false);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'testimonials');
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-serif mb-4">Client Stories</h2>
        <p className="text-white/60">What our clients say about their experience with KR Rash Studio.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        {testimonials.map((t) => (
          <motion.div 
            key={t.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="glass p-8 rounded-3xl relative"
          >
            <Quote className="w-10 h-10 text-gold/20 absolute top-6 right-6" />
            <div className="flex gap-1 mb-4">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className={`w-4 h-4 ${i < t.rating ? 'text-gold fill-gold' : 'text-white/10'}`} />
              ))}
            </div>
            <p className="text-white/80 italic mb-6 leading-relaxed">"{t.review}"</p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center text-gold font-bold">
                {t.clientName.charAt(0)}
              </div>
              <p className="font-bold text-sm tracking-widest uppercase">{t.clientName}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="glass p-8 md:p-12 rounded-[3rem] max-w-2xl mx-auto">
        {!user ? (
          <div className="text-center">
            <h4 className="text-2xl font-serif mb-4">Share Your Experience</h4>
            <p className="text-white/60 mb-8 text-sm">Sign in with Google to leave a review and help others choose KR Rash Studio.</p>
            <button 
              onClick={handleSignIn}
              className="bg-white text-black px-8 py-4 rounded-full font-bold hover:bg-gold transition-all flex items-center justify-center gap-3 mx-auto"
            >
              <LogIn className="w-5 h-5" /> Sign in with Google
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmitReview} className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img src={user.photoURL || ''} alt={user.displayName || ''} className="w-10 h-10 rounded-full border border-gold/20" />
                <div>
                  <p className="font-bold text-sm">{user.displayName}</p>
                  <button onClick={() => signOut(auth)} className="text-[10px] uppercase tracking-widest text-gold hover:text-white flex items-center gap-1">
                    <LogOut className="w-3 h-3" /> Sign Out
                  </button>
                </div>
              </div>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((s) => (
                  <button key={s} type="button" onClick={() => setRating(s)}>
                    <Star className={`w-5 h-5 ${s <= rating ? 'text-gold fill-gold' : 'text-white/10'}`} />
                  </button>
                ))}
              </div>
            </div>
            <textarea 
              placeholder="Write your review here..."
              required
              rows={4}
              value={newReview}
              onChange={(e) => setNewReview(e.target.value)}
              className="w-full bg-white/5 border border-white/10 p-6 rounded-3xl focus:border-gold outline-none resize-none"
            />
            <button 
              type="submit" 
              disabled={submitting}
              className="w-full bg-gold text-black font-bold py-4 rounded-2xl hover:bg-white transition-all flex items-center justify-center gap-2"
            >
              {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Post Review'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

function AppContent() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace('#', '');
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [location]);

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    if (location.pathname !== '/') {
      navigate('/#' + id);
    } else {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <div className="min-h-screen selection:bg-gold selection:text-black">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 glass py-3 px-6 md:px-12 flex justify-between items-center">
        <Link to="/" className="flex flex-col items-center group">
          <Camera className="w-4 h-4 text-gold group-hover:rotate-12 transition-transform mb-1" />
          <div className="flex flex-col items-center leading-none">
            <span className="text-2xl font-script text-gold">KR RASH</span>
            <span className="text-[10px] font-serif tracking-[0.3em] uppercase text-white/70 -mt-1">Studio</span>
          </div>
        </Link>
        <div className="hidden md:flex gap-8 text-sm uppercase tracking-widest font-medium">
          <a href="#services" onClick={(e) => scrollToSection(e, 'services')} className="hover:text-gold transition-colors">Services</a>
          <a href="#booking" onClick={(e) => scrollToSection(e, 'booking')} className="hover:text-gold transition-colors">Booking</a>
          <a href="#testimonials" onClick={(e) => scrollToSection(e, 'testimonials')} className="hover:text-gold transition-colors">Reviews</a>
          <a href="#contact" onClick={(e) => scrollToSection(e, 'contact')} className="hover:text-gold transition-colors">Contact</a>
        </div>
        <a href="#booking" onClick={(e) => scrollToSection(e, 'booking')} className="bg-gold text-black px-6 py-2 rounded-full text-sm font-bold hover:bg-white transition-all">
          Book Now
        </a>
      </nav>

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&q=80&w=2000" 
            alt="Hero Background" 
            className="w-full h-full object-cover opacity-40"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-studio-dark/20 via-studio-dark/60 to-studio-dark" />
        </div>

        <div className="relative z-10 text-center px-4 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-7xl font-serif mb-6 leading-snug">
              Capturing <span className="italic gold-text">Eternal</span> Memories
            </h1>
            <p className="text-lg md:text-xl text-white/70 mb-10 max-w-2xl mx-auto leading-relaxed">
              ඔබේ ජීවිතයේ ලස්සනම අවස්තා... සදාකාලික මතකයක් කරගන්න. <br/>
              <span className="text-white">Professional photography that tells your unique story.</span>
            </p>
            <div className="flex flex-col md:flex-row gap-4 justify-center">
              <a href="#booking" onClick={(e) => scrollToSection(e, 'booking')} className="bg-white text-black px-8 py-4 rounded-full font-bold hover:bg-gold transition-all flex items-center justify-center gap-2">
                Book a Session <ChevronRight className="w-4 h-4" />
              </a>
              <a href="#contact" onClick={(e) => scrollToSection(e, 'contact')} className="border border-white/20 px-8 py-4 rounded-full font-bold hover:bg-white/10 transition-all">
                Contact Us
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-24 px-6 md:px-12 bg-studio-dark">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-serif mb-4">Our Expertise</h2>
            <div className="w-24 h-1 bg-gold mx-auto" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {SERVICES.map((service, idx) => (
              <Link
                key={idx}
                to={`/services/${service.slug}`}
                className="group relative h-[450px] rounded-3xl overflow-hidden glass block"
              >
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.6 }}
                  className="absolute inset-0"
                >
                  <img 
                    src={service.image} 
                    alt={service.title} 
                    className="w-full h-full object-cover opacity-40 group-hover:opacity-60 transition-opacity duration-500"
                    referrerPolicy="no-referrer"
                  />
                </motion.div>
                <div className="absolute inset-0 bg-gradient-to-t from-studio-dark via-transparent to-transparent" />
                <div className="absolute bottom-0 p-8 text-left w-full">
                  <div className="bg-gold p-3 rounded-2xl w-fit mb-4 text-black group-hover:scale-110 transition-transform">
                    {service.icon}
                  </div>
                  <h3 className="text-2xl font-serif mb-2">{service.title}</h3>
                  <p className="text-white/60 text-sm leading-relaxed mb-4">
                    {service.description}
                  </p>
                  <div className="flex items-center gap-2 text-gold text-xs font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                    View Details <ArrowRight className="w-3 h-3" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Booking Section */}
      <section id="booking" className="py-24 px-6 md:px-12 bg-studio-gray">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-serif mb-4">Online Booking</h2>
          <p className="text-white/60 mb-12 max-w-xl mx-auto">
            Select your service, choose a date, and secure your session in minutes.
          </p>
          <BookingSystem />
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-24 px-6 md:px-12 bg-studio-dark">
        <Testimonials />
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-24 px-6 md:px-12 bg-studio-dark">
        <div className="max-w-7xl mx-auto">
          <div className="glass rounded-[3rem] p-12 md:p-20 overflow-hidden relative">
            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div className="text-left">
                <h2 className="text-4xl md:text-6xl font-serif mb-8">Let's Create <br/><span className="gold-text">Magic</span> Together</h2>
                <div className="space-y-6">
                  <a href="tel:0715181098" className="flex items-center gap-4 text-xl hover:text-gold transition-colors">
                    <div className="p-3 bg-white/5 rounded-2xl"><Phone className="w-6 h-6" /></div>
                    071-5181098
                  </a>
                  <div className="flex gap-4 pt-4">
                    <a href="https://www.facebook.com/share/19skzj9e3U/" target="_blank" rel="noopener noreferrer" className="p-4 bg-white/5 rounded-2xl text-[#1877F2] hover:bg-white/10 transition-all"><Facebook className="w-6 h-6" /></a>
                    <a href="https://wa.me/94715181098" target="_blank" rel="noopener noreferrer" className="p-4 bg-white/5 rounded-2xl text-[#25D366] hover:bg-white/10 transition-all"><MessageCircle className="w-6 h-6" /></a>
                  </div>
                </div>
              </div>
              <div className="bg-black/40 p-8 rounded-3xl border border-white/5">
                <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                  <div className="grid grid-cols-2 gap-4">
                    <input type="text" placeholder="Name" className="bg-white/5 border border-white/10 p-4 rounded-2xl focus:outline-none focus:border-gold transition-colors" />
                    <input type="email" placeholder="Email" className="bg-white/5 border border-white/10 p-4 rounded-2xl focus:outline-none focus:border-gold transition-colors" />
                  </div>
                  <select className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl focus:outline-none focus:border-gold transition-colors appearance-none">
                    <option className="bg-studio-dark">Wedding Photography</option>
                    <option className="bg-studio-dark">Birthday Party</option>
                    <option className="bg-studio-dark">Event Coverage</option>
                    <option className="bg-studio-dark">Portrait Session</option>
                  </select>
                  <textarea placeholder="Tell us about your event..." rows={4} className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl focus:outline-none focus:border-gold transition-colors" />
                  <button className="w-full bg-gold text-black font-bold py-4 rounded-2xl hover:bg-white transition-all uppercase tracking-widest">
                    Send Message
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 px-6 border-t border-white/5 text-center text-white/40 text-sm bg-studio-dark">
        <div className="max-w-7xl mx-auto flex flex-col items-center gap-8">
          <Link to="/" className="flex flex-col items-center group mb-4">
            <Camera className="w-10 h-10 text-gold group-hover:rotate-12 transition-transform mb-2" />
            <div className="flex flex-col items-center leading-none">
              <span className="text-6xl font-script text-gold">KR RASH</span>
              <span className="text-xl font-serif tracking-[0.4em] uppercase text-white/70 -mt-1">Studio</span>
            </div>
          </Link>
          <div className="space-y-4">
            <div className="flex justify-center gap-4">
              <a href="https://www.facebook.com/share/19skzj9e3U/" target="_blank" rel="noopener noreferrer" className="text-[#1877F2] hover:opacity-80 transition-opacity"><Facebook className="w-5 h-5" /></a>
              <a href="https://wa.me/94715181098" target="_blank" rel="noopener noreferrer" className="text-[#25D366] hover:opacity-80 transition-opacity"><MessageCircle className="w-5 h-5" /></a>
            </div>
            <p>© 2026 KR Rash Studio. All rights reserved. | Captured with Passion.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <Router>
        <Routes>
          <Route path="/" element={<AppContent />} />
          <Route path="/services/:slug" element={<ServiceDetail />} />
        </Routes>
      </Router>
    </ErrorBoundary>
  );
}
