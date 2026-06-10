import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import LotusWatermark from './LotusWatermark';
import { useLang } from '../contexts/LanguageContext';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { lang, setLang, t } = useLang();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 80);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const links = [
    { name: t('nav.home'), path: '/' },
    { name: t('nav.about'), path: '/about' },
    { name: t('nav.gallery'), path: '/gallery' },
    { name: t('nav.visit'), path: '/visit' },
    { name: t('nav.events'), path: '/events' },
    { name: t('nav.contact'), path: '/contact' },
  ];

  const sidebarVariants = {
    open: { x: 0, transition: { type: 'spring', stiffness: 300, damping: 30 } },
    closed: { x: '100%', transition: { type: 'spring', stiffness: 300, damping: 30 } }
  };

  // Toggle this flag to true when you are ready to show the Donate buttons
  const showDonateButton = false;

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? 'bg-white shadow-[0_2px_12px_rgba(0,0,0,0.06)] h-16 border-b border-gold-light' : 'bg-white/95 h-20 border-b border-gold-pale'
        }`}
      >
        <div className="max-w-[1200px] mx-auto px-4 md:px-8 h-full flex items-center justify-between">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-8 h-8 text-gold-primary">
              <LotusWatermark opacity={1} />
            </div>
            <span className="font-cinzel text-gold-primary text-xl md:text-2xl tracking-wide group-hover:text-gold-light transition-colors">
              PARASLI JAIN TIRTH
            </span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-8">
            {links.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className="relative font-cinzel text-sm uppercase tracking-wide text-text-dark group py-2"
                >
                  <span className={`transition-colors ${isActive ? 'text-gold-primary' : 'group-hover:text-gold-primary'}`}>
                    {link.name}
                  </span>
                  <span
                    className={`absolute bottom-0 left-0 w-full h-[1.5px] bg-gold-primary transform origin-left transition-transform duration-300 ease-out ${
                      isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                    }`}
                  />
                </Link>
              );
            })}

            {/* Language Toggle */}
            <button
              onClick={() => setLang(lang === 'en' ? 'hi' : 'en')}
              className="font-cinzel text-xs uppercase tracking-wider px-3 py-1 border border-gold-light text-gold-primary hover:bg-gold-primary hover:text-white hover:border-gold-primary transition-colors"
              aria-label="Toggle language"
            >
              {lang === 'en' ? 'हिं' : 'EN'}
            </button>
          </div>

          {/* Desktop CTA */}
          {showDonateButton && (
            <div className="hidden md:block">
              <button className="btn-gold">Donate</button>
            </div>
          )}

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-text-dark p-2 focus:outline-none focus:text-gold-primary transition"
            onClick={() => setIsOpen(true)}
          >
            <Menu size={28} />
          </button>
        </div>
      </nav>

      {/* Mobile Overlay Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm md:hidden"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              layout
              variants={sidebarVariants}
              initial="closed"
              animate="open"
              exit="closed"
              className="absolute right-0 top-0 bottom-0 w-3/4 max-w-sm bg-white shadow-2xl p-6 flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-12">
                <span className="font-cinzel text-gold-primary text-xl">{t('nav.menu')}</span>
                <button onClick={() => setIsOpen(false)} className="text-text-dark hover:text-gold-primary transition p-1">
                  <X size={28} />
                </button>
              </div>

              <div className="flex flex-col gap-6">
                {links.map((link, i) => (
                  <motion.div
                    key={link.path}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * i }}
                  >
                    <Link
                      to={link.path}
                      onClick={() => setIsOpen(false)}
                      className={`block font-cinzel text-lg tracking-wide ${
                        location.pathname === link.path ? 'text-gold-primary' : 'text-text-dark'
                      }`}
                    >
                      {link.name}
                    </Link>
                  </motion.div>
                ))}
              </div>

              <div className="mt-8">
                {/* Mobile Language Toggle */}
                <button
                  onClick={() => { setLang(lang === 'en' ? 'hi' : 'en'); setIsOpen(false); }}
                  className="font-cinzel text-sm uppercase tracking-wider px-4 py-2 border border-gold-light text-gold-primary hover:bg-gold-primary hover:text-white transition-colors w-full"
                >
                  {lang === 'en' ? 'हिंदी में देखें' : 'View in English'}
                </button>
              </div>

              <div className="mt-auto">
                {showDonateButton && (
                  <button className="btn-gold w-full text-center">Donate</button>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
