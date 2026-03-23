import React, { useEffect, useState, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ArrowRight, Camera, Facebook, Instagram, Mail, MessageCircle, Filter } from 'lucide-react';
import { SERVICES } from '../constants.tsx';

const ServiceDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const service = SERVICES.find(s => s.slug === slug);
  const [activeFilter, setActiveFilter] = useState<string>('All');

  const categories = useMemo(() => {
    return ['All', 'Weddings', 'Events', 'Portraits', 'Birthdays'];
  }, []);

  const allPortfolioImages = useMemo(() => {
    return SERVICES.flatMap(s => 
      s.portfolio.map(img => ({
        url: img,
        category: s.title.includes('Wedding') ? 'Weddings' : 
                  s.title.includes('Event') ? 'Events' : 
                  s.title.includes('Birthday') ? 'Birthdays' : 'Portraits',
        serviceTitle: s.title
      }))
    );
  }, []);

  const filteredImages = useMemo(() => {
    if (activeFilter === 'All') return allPortfolioImages;
    return allPortfolioImages.filter(img => img.category === activeFilter);
  }, [activeFilter, allPortfolioImages]);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (service) {
      const initialFilter = service.title.includes('Wedding') ? 'Weddings' : 
                            service.title.includes('Event') ? 'Events' : 
                            service.title.includes('Birthday') ? 'Birthdays' : 'Portraits';
      setActiveFilter(initialFilter);
    }
  }, [slug, service]);

  if (!service) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-studio-dark text-white p-6 text-center">
        <div className="glass p-12 rounded-[3rem] max-w-md">
          <h2 className="text-3xl font-serif mb-4">Service Not Found</h2>
          <p className="text-white/60 mb-8">The service you are looking for doesn't exist or has been moved.</p>
          <Link 
            to="/"
            className="bg-gold text-black px-8 py-3 rounded-full font-bold hover:bg-white transition-all inline-block"
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-studio-dark text-white relative">
      {/* Back Button */}
      <Link 
        to="/" 
        className="fixed top-6 left-6 z-[60] glass p-3 rounded-full text-gold hover:text-white hover:bg-gold/20 transition-all flex items-center gap-2 group"
      >
        <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
        <span className="text-xs font-bold uppercase tracking-widest hidden md:block">Back to Home</span>
      </Link>

      {/* Hero Section */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src={service.image} 
            alt={service.title} 
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
            <Link to="/" className="flex flex-col items-center group mb-8">
              <Camera className="w-8 h-8 text-gold group-hover:rotate-12 transition-transform mb-2" />
              <div className="flex flex-col items-center leading-none">
                <span className="text-5xl font-script text-gold">KR RASH</span>
                <span className="text-lg font-serif tracking-[0.3em] uppercase text-white/70 -mt-1">Studio</span>
              </div>
            </Link>
            <h1 className="text-4xl md:text-6xl font-serif mb-6 leading-snug">
              {service.title}
            </h1>
            <p className="text-lg md:text-xl text-white/70 max-w-2xl mx-auto leading-relaxed">
              {service.description}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Detailed Description & Portfolio */}
      <section className="py-24 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start mb-24">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-serif mb-8">Our Approach to <span className="gold-text italic">{service.title}</span></h2>
              <p className="text-white/60 text-lg leading-relaxed mb-8">
                {service.longDescription}
              </p>
              <div className="flex flex-wrap gap-4">
                <Link 
                  to="/#booking"
                  className="bg-gold text-black px-8 py-4 rounded-full font-bold hover:bg-white transition-all flex items-center gap-2"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate('/#booking');
                    setTimeout(() => {
                      document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' });
                    }, 100);
                  }}
                >
                  Book This Service <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative rounded-[3rem] overflow-hidden aspect-video group"
            >
              <img 
                src={service.image} 
                alt={service.title} 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" 
                referrerPolicy="no-referrer" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            </motion.div>
          </div>

          {/* Filterable Portfolio */}
          <div className="space-y-12">
            <div className="flex flex-col md:flex-row justify-between items-center gap-8">
              <h3 className="text-3xl font-serif">Visual <span className="gold-text">Portfolio</span></h3>
              
              <div className="flex flex-wrap justify-center gap-3 p-2 glass rounded-2xl">
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setActiveFilter(cat)}
                    className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${activeFilter === cat ? 'bg-gold text-black' : 'hover:bg-white/10 text-white/60'}`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <motion.div 
              layout
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              <AnimatePresence mode='popLayout'>
                {filteredImages.map((img, idx) => (
                  <motion.div
                    layout
                    key={`${img.url}-${idx}`}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.4 }}
                    className={`rounded-2xl overflow-hidden h-72 relative group`}
                  >
                    <img 
                      src={img.url} 
                      alt={`${img.category} Portfolio`} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                      referrerPolicy="no-referrer" 
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                      <span className="text-xs font-bold uppercase tracking-widest bg-gold text-black px-3 py-1 rounded-full">
                        {img.category}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-24 px-6 md:px-12">
        <div className="max-w-4xl mx-auto glass rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 p-12 opacity-10">
            <Camera className="w-32 h-32" />
          </div>
          <h2 className="text-4xl md:text-5xl font-serif mb-6">Ready to Capture Your Story?</h2>
          <p className="text-white/60 mb-10 text-lg">
            Let's discuss your vision and create something beautiful together.
          </p>
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <Link 
              to="/#booking" 
              className="bg-gold text-black px-12 py-4 rounded-full font-bold hover:bg-white transition-all"
              onClick={(e) => {
                e.preventDefault();
                navigate('/#booking');
                setTimeout(() => {
                  document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              }}
            >
              Book Now
            </Link>
            <a href="tel:0715181098" className="border border-white/20 px-12 py-4 rounded-full font-bold hover:bg-white/10 transition-all">
              Call Us
            </a>
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
};

export default ServiceDetail;
