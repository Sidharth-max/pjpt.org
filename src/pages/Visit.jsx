import React from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import LotusWatermark from '../components/LotusWatermark';
import { useLang } from '../contexts/LanguageContext';

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

export default function Visit() {
  const { t, lang } = useLang();
  const fn = lang === 'hi' ? 'font-noto' : '';

  const infoCards = [
    { titleKey: 'visit.info.temple.title', descKey: 'visit.info.temple.desc', icon: '🕉️' },
    { titleKey: 'visit.info.bhojan.title', descKey: 'visit.info.bhojan.desc', icon: '🥣' },
    { titleKey: 'visit.info.accomm.title', descKey: 'visit.info.accomm.desc', icon: '🛏️' },
    { titleKey: 'visit.info.besttime.title', descKey: 'visit.info.besttime.desc', icon: '✨' },
  ];

  const guidelines = [
    'visit.guidelines.g1',
    'visit.guidelines.g2',
    'visit.guidelines.g3',
    'visit.guidelines.g4',
    'visit.guidelines.g5',
    'visit.guidelines.g6',
  ];

  return (
    <div className="w-full pt-20">
      <Helmet>
        <title>Plan Your Visit – Avadhpuri Parasali Jain Tirth</title>
        <meta name="description" content="Plan your pilgrimage to Avadhpuri Parasali Jain Tirth. Find directions, visiting hours, temple guidelines, accommodation information, and how to reach this sacred Jain site in Madhya Pradesh." />
        <link rel="canonical" href="https://pjpt.org/visit" />
        <meta property="og:title" content="Plan Your Visit – Avadhpuri Parasali Jain Tirth" />
        <meta property="og:description" content="Plan your pilgrimage to Avadhpuri Parasali Jain Tirth. Find directions, visiting hours, temple guidelines, and accommodation information in Madhya Pradesh." />
        <meta property="og:url" content="https://pjpt.org/visit" />
        <meta property="og:type" content="website" />
      </Helmet>

      {/* Page Hero */}
      <section className="py-20 px-4 text-center bg-off-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] text-gold-primary opacity-[0.03] pointer-events-none -mr-20 -mt-20">
          <LotusWatermark opacity={1} />
        </div>
        <motion.div initial="hidden" animate="visible" variants={fadeUp} className="relative z-10">
          <h1 className={`font-cinzel text-4xl md:text-5xl text-gold-primary mb-4 uppercase tracking-wide ${fn}`}>
            {t('visit.hero.title')}
          </h1>
          <p className={`font-cormorant text-xl text-text-muted ${fn}`}>
            {t('visit.hero.subtitle')}
          </p>
        </motion.div>
      </section>

      <div className="gold-divider" />

      {/* Info Grid */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          {infoCards.map((item, idx) => (
            <motion.div key={idx} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={fadeUp} className="card relative text-center">
              <div className="text-3xl mb-4">{item.icon}</div>
              <h3 className={`font-cinzel text-xl text-text-dark mb-3 uppercase ${fn}`}>{t(item.titleKey)}</h3>
              <p className={`font-cormorant text-text-muted ${fn}`}>{t(item.descKey)}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <div className="gold-divider" />

      {/* How To Reach */}
      <section className="py-20 px-4 bg-bg-section relative">
        <div className="max-w-[1200px] mx-auto">
          <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className={`font-cinzel text-3xl md:text-4xl text-center mb-16 text-text-dark uppercase tracking-wide ${fn}`}>
            {t('visit.reach.title')}
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="bg-white p-8 border border-gold-light text-center">
              <div className="w-12 h-12 mx-auto mb-4 text-gold-primary">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path></svg>
              </div>
              <h3 className={`font-cinzel text-lg text-gold-primary mb-2 uppercase ${fn}`}>{t('visit.reach.air.title')}</h3>
              <p className={`font-cormorant text-text-muted ${fn}`}>{t('visit.reach.air.desc')}</p>
            </motion.div>
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="bg-white p-8 border border-gold-light text-center">
              <div className="w-12 h-12 mx-auto mb-4 text-gold-primary">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h8a1 1 0 001-1zM13 16h4m0 0v-5m0 5h4"></path></svg>
              </div>
              <h3 className={`font-cinzel text-lg text-gold-primary mb-2 uppercase ${fn}`}>{t('visit.reach.train.title')}</h3>
              <p className={`font-cormorant text-text-muted ${fn}`}>{t('visit.reach.train.desc')}</p>
            </motion.div>
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="bg-white p-8 border border-gold-light text-center">
              <div className="w-12 h-12 mx-auto mb-4 text-gold-primary">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"></path></svg>
              </div>
              <h3 className={`font-cinzel text-lg text-gold-primary mb-2 uppercase ${fn}`}>{t('visit.reach.road.title')}</h3>
              <p className={`font-cormorant text-text-muted ${fn}`}>{t('visit.reach.road.desc')}</p>
            </motion.div>
          </div>
        </div>
      </section>

      <div className="gold-divider" />

      {/* Map Embed & Address */}
      <section className="py-20 px-4 bg-white text-center">
        <div className="max-w-[1000px] mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="card inline-block w-full max-w-2xl bg-off-white mb-12">
            <h3 className={`font-cinzel text-2xl text-gold-primary mb-4 uppercase ${fn}`}>{t('visit.address.title')}</h3>
            <p className={`font-cormorant text-xl text-text-dark ${fn}`}>{t('visit.address.name')}</p>
            <p className={`font-cormorant text-lg text-text-muted ${fn}`}>{t('visit.address.line1')}</p>
            <p className={`font-cormorant text-lg text-text-muted ${fn}`}>{t('visit.address.line2')}</p>
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="w-full h-[400px] bg-bg-section border border-gold-light flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 pointer-events-none opacity-10 flex items-center justify-center text-gold-primary">
              <LotusWatermark opacity={1} className="w-64 h-64" />
            </div>
            <iframe
              title="Google Map"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3651.5!2d75.6!3d24.2!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3963ef1234567890%3A0xabcdef1234567890!2sParasali%2C+Madhya+Pradesh!5e0!3m2!1sen!2sin!4v1234567890"
              className="absolute inset-0 w-full h-full border-0"
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </motion.div>
        </div>
      </section>

      <div className="gold-divider" />

      {/* Rules & Guidelines */}
      <section className="py-20 px-4 bg-bg-section">
        <div className="max-w-[800px] mx-auto">
          <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className={`font-cinzel text-3xl text-center mb-10 text-text-dark uppercase tracking-wide ${fn}`}>
            {t('visit.guidelines.title')}
          </motion.h2>

          <motion.ul initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className={`space-y-4 font-cormorant text-lg text-text-muted bg-white p-8 md:p-12 border border-gold-light shadow-sm ${fn}`}>
            {guidelines.map((key, idx) => (
              <li key={idx} className="flex items-start">
                <span className="text-gold-primary mr-3 text-2xl leading-none">&bull;</span>
                <span>{t(key)}</span>
              </li>
            ))}
          </motion.ul>
        </div>
      </section>

    </div>
  );
}
