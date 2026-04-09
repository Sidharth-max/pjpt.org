import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import LotusWatermark from '../components/LotusWatermark';
import { highlights } from '../data/content';
import { useLang } from '../contexts/LanguageContext';
import { getImages } from '../services/api';

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.2 } }
};

export default function Home() {
  const { t, lang } = useLang();
  const fontClass = lang === 'hi' ? 'font-noto' : '';
  const [homeImages, setHomeImages] = useState([]);
  const [bannerImages, setBannerImages] = useState([]);
  const [currentImgIndex, setCurrentImgIndex] = useState(0);

  useEffect(() => {
    const fetchHomeImages = async () => {
      try {
        const hData = await getImages('Home');
        if (Array.isArray(hData)) setHomeImages(hData);
        else if (hData && hData.images) setHomeImages(hData.images);

        const bData = await getImages('Banner');
        if (Array.isArray(bData)) setBannerImages(bData);
        else if (bData && bData.images) setBannerImages(bData.images);
      } catch (err) {
        console.error('Failed to fetch home images:', err);
      }
    };
    fetchHomeImages();
  }, []);

  useEffect(() => {
    if (homeImages.length > 1) {
      const interval = setInterval(() => {
        setCurrentImgIndex(prev => (prev + 1) % homeImages.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [homeImages]);

  return (
    <div className="w-full">
      <Helmet>
        <title>Avadhpuri Parasali Jain Tirth – Sacred Pilgrimage in Madhya Pradesh</title>
        <meta name="description" content="Visit Avadhpuri Parasali Jain Tirth, a historic Jain pilgrimage site in Madhya Pradesh, India, established in Vikram Samvat 688. Explore the temple, gallery, and upcoming events." />
        <link rel="canonical" href="https://pjpt.org/" />
        <meta property="og:title" content="Avadhpuri Parasali Jain Tirth – Sacred Pilgrimage in Madhya Pradesh" />
        <meta property="og:description" content="Visit Avadhpuri Parasali Jain Tirth, a historic Jain pilgrimage site in Madhya Pradesh, India, established in Vikram Samvat 688." />
        <meta property="og:url" content="https://pjpt.org/" />
        <meta property="og:type" content="website" />
      </Helmet>
      {/* Hero Section */}
      <section className="relative z-[1] h-screen flex items-center justify-center overflow-hidden bg-bg-section">
        {/* Dynamic Background Slider */}
        <div className="absolute inset-0 z-0">
          <AnimatePresence mode="wait">
            {homeImages.length > 0 ? (
              <motion.div
                key={homeImages[currentImgIndex]._id || currentImgIndex}
                initial={{ opacity: 0, scale: 1.1 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className="absolute inset-0"
              >
                <img
                  src={homeImages[currentImgIndex].url}
                  alt={homeImages[currentImgIndex].altText || "Avadhpuri Parasali Jain Tirth"}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40" />
              </motion.div>
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-white to-[#F9F6F0]">
                <div className="absolute inset-0 flex items-center justify-center text-gold-light opacity-5">
                  <div className="w-[800px] h-[800px]">
                    <LotusWatermark opacity={1} />
                  </div>
                </div>
              </div>
            )}
          </AnimatePresence>
        </div>

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 w-full h-full to-black/50 z-10" />

        {/* Hero Content */}
        <motion.div
          className="relative z-20 text-center px-4 w-full max-w-[1000px]"
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          <motion.div variants={fadeUp} className={`font-cinzel text-gold-light text-sm md:text-base tracking-wide uppercase mb-6 drop-shadow-md ${fontClass}`}>
            {t('home.hero.badge')}
          </motion.div>
          <motion.h1 variants={fadeUp} className={`font-cinzel text-white text-5xl md:text-7xl lg:text-[80px] leading-tight drop-shadow-lg mb-2 text-center uppercase ${fontClass}`}>
            {t('home.hero.title')}
          </motion.h1>
          <motion.h2 variants={fadeUp} className={`font-cormorant italic text-white text-4xl md:text-6xl drop-shadow-lg mb-8 text-center uppercase ${fontClass}`}>
            {t('home.hero.subtitle')}
          </motion.h2>

          <motion.div variants={fadeUp} className="w-20 h-[1px] bg-gold-light mx-auto mb-8 box-shadow-gold" />

          <motion.p variants={fadeUp} className={`font-cormorant text-white text-lg md:text-2xl mb-12 max-w-[700px] mx-auto opacity-90 drop-shadow-md leading-relaxed ${fontClass}`}>
            {t('home.hero.tagline')}
          </motion.p>

          <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link to="/about" className="btn-gold bg-gold-primary hover:bg-gold-light border-gold-primary text-white w-full sm:w-auto text-center px-8 py-3 text-sm">
              {t('home.hero.cta.explore')}
            </Link>
            <Link to="/visit" className="btn-white bg-transparent border-white text-white hover:bg-white hover:text-text-dark w-full sm:w-auto text-center px-8 py-3 text-sm">
              {t('home.hero.cta.visit')}
            </Link>
          </motion.div>
        </motion.div>

        {/* Bouncing Chevron */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 text-white opacity-70"
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 9l6 6 6-6"/>
          </svg>
        </motion.div>
      </section>

      <div className="gold-divider" />

      {/* Quick Info Cards */}
      <section className="py-20 md:py-32 px-4 bg-off-white relative">
        <div className="max-w-[1200px] mx-auto">
          <motion.h2
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeUp}
            className={`font-cinzel text-3xl md:text-4xl text-center mb-16 text-text-dark uppercase tracking-wide ${fontClass}`}
          >
            {t('home.info.title')}
          </motion.h2>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={staggerContainer}
          >
            {[
              { title: t('home.info.darshan.title'), icon: '🕘', line1: t('home.info.darshan.line1'), line2: t('home.info.darshan.line2') },
              { title: t('home.info.reach.title'), icon: '📍', line1: t('home.info.reach.line1'), line2: t('home.info.reach.line2') },
              { title: t('home.info.bhojan.title'), icon: '🍽️', line1: t('home.info.bhojan.line1'), line2: t('home.info.bhojan.line2') },
            ].map((info, idx) => (
              <motion.div key={idx} variants={fadeUp} className="card text-center group">
                <div className="absolute inset-0 pointer-events-none text-gold-primary opacity-[0.03] flex items-center justify-center">
                  <div className="w-48 h-48"><LotusWatermark opacity={1}/></div>
                </div>
                <div className="text-4xl mb-6">{info.icon}</div>
                <h3 className={`font-cinzel text-lg mb-4 text-gold-primary uppercase ${fontClass}`}>{info.title}</h3>
                <p className={`font-cormorant text-text-muted mb-2 ${fontClass}`}>{info.line1}</p>
                <p className={`font-cormorant text-text-muted ${fontClass}`}>{info.line2}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <div className="gold-divider" />

      {/* About Intro (Split Layout) */}
      <section className="py-20 md:py-32 px-4 bg-bg-section relative overflow-hidden">
        <div className="absolute -left-32 -top-32 w-96 h-96 text-gold-light opacity-5 pointer-events-none">
           <LotusWatermark opacity={1} />
        </div>
        <div className="max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <blockquote className={`font-cormorant italic text-3xl md:text-5xl text-gold-primary leading-tight border-l-2 border-gold-light pl-8 ${fontClass}`}>
              {t('home.about.quote')}
            </blockquote>
          </motion.div>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="space-y-6">
            <p className={`text-text-muted ${fontClass}`}>{t('home.about.p1')}</p>
            <p className={`text-text-muted ${fontClass}`}>{t('home.about.p2')}</p>
            <p className={`text-text-muted pb-4 ${fontClass}`}>{t('home.about.p3')}</p>
            <Link to="/about" className={`inline-block font-cinzel text-gold-primary uppercase tracking-wide text-sm border-b border-gold-primary pb-1 hover:text-gold-light hover:border-gold-light transition ${fontClass}`}>
              {t('home.about.readmore')}
            </Link>
          </motion.div>
        </div>
      </section>

      <div className="gold-divider" />

      {/* Key Highlights */}
      <section className="py-20 md:py-32 px-4 bg-white relative">
        <div className="max-w-[1200px] mx-auto">
          <motion.h2
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
            className={`font-cinzel text-3xl md:text-4xl text-center mb-16 uppercase tracking-wide ${fontClass}`}
          >
            {t('home.highlights.title')}
          </motion.h2>

          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}
          >
            {highlights.map((item, idx) => (
              <motion.div key={idx} variants={fadeUp} className="text-center p-6 bg-off-white border border-border-gold rounded-sm hover:-translate-y-2 transition duration-300">
                <div className="w-12 h-12 mx-auto mb-6 text-gold-primary">
                  <LotusWatermark opacity={1} />
                </div>
                <h3 className={`font-cinzel text-lg mb-4 text-text-dark ${fontClass}`}>
                  {lang === 'hi' && item.titleHi ? item.titleHi : item.title}
                </h3>
                <p className={`font-cormorant text-text-muted text-base leading-relaxed ${fontClass}`}>
                  {lang === 'hi' && item.descriptionHi ? item.descriptionHi : item.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <div className="gold-divider" />

      {/* Visit CTA Banner */}
      <section className="py-24 px-4 text-center relative overflow-hidden bg-gold-pale border-y border-gold-light">
        <div className="absolute inset-0 z-0">
          {bannerImages.length > 0 ? (
            <img 
              src={bannerImages[0].url} 
              alt={bannerImages[0].altText || "Visit Avadhpuri Parasali"} 
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="absolute inset-0 pointer-events-none opacity-10 flex items-center justify-center text-gold-primary">
                <LotusWatermark opacity={1} className="w-[1000px] h-[1000px] absolute" />
            </div>
          )}
          <div className="absolute inset-0 bg-gold-pale/80 backdrop-blur-[2px]" />
        </div>
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="relative z-10 max-w-2xl mx-auto">
          <h2 className={`font-cinzel text-4xl mb-6 text-text-dark uppercase tracking-wide ${fontClass}`}>{t('home.cta.title')}</h2>
          <p className={`font-cormorant text-xl text-text-muted mb-10 ${fontClass}`}>{t('home.cta.desc')}</p>
          <Link to="/visit" className="btn-gold bg-transparent border-gold-primary text-text-dark hover:text-white px-8 py-4">
            {t('home.cta.btn')}
          </Link>
        </motion.div>
      </section>

      <div className="gold-divider" />

      {/* Latest Event */}
      <section className="py-20 md:py-32 px-4 bg-white">
        <div className="max-w-[1000px] mx-auto text-center">
          <motion.h2
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
            className={`font-cinzel text-3xl md:text-4xl text-center mb-16 uppercase tracking-wide ${fontClass}`}
          >
            {t('home.recent.title')}
          </motion.h2>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="card text-left max-w-3xl mx-auto flex flex-col md:flex-row gap-8 items-center group">
            <div className="w-full md:w-1/3 aspect-square bg-bg-section flex items-center justify-center text-gold-light border border-gold-transparent overflow-hidden">
               <LotusWatermark opacity={0.2} className="w-32 h-32 transition-transform duration-700 group-hover:scale-110" />
            </div>
            <div className="w-full md:w-2/3">
              <span className="font-noto text-gold-primary text-sm uppercase tracking-wider block mb-2 font-bold">{t('home.recent.badge')}</span>
              <h3 className={`font-cinzel text-2xl mb-2 text-text-dark ${fontClass}`}>{t('home.recent.event.title')}</h3>
              <span className={`font-cinzel text-gold-primary text-xs uppercase tracking-wider block mb-4 ${fontClass}`}>{t('home.recent.event.date')}</span>
              <p className={`font-cormorant text-text-muted mb-6 ${fontClass}`}>{t('home.recent.event.desc')}</p>
              <Link to="/events/dhwajarohan-2026" className={`font-cinzel text-gold-primary text-sm uppercase tracking-wide hover:text-gold-light transition ${fontClass}`}>
                {t('home.recent.event.link')}
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
