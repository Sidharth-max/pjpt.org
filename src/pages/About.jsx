import React from 'react';
import { motion } from 'framer-motion';
import LotusWatermark from '../components/LotusWatermark';
import { timelineEvents } from '../data/history';
import { useLang } from '../contexts/LanguageContext';

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
};

export default function About() {
  const { t, lang } = useLang();
  const fn = lang === 'hi' ? 'font-noto' : '';

  const miracles = [
    { titleKey: 'about.miracles.m1.title', descKey: 'about.miracles.m1.desc' },
    { titleKey: 'about.miracles.m2.title', descKey: 'about.miracles.m2.desc' },
    { titleKey: 'about.miracles.m3.title', descKey: 'about.miracles.m3.desc' },
    { titleKey: 'about.miracles.m4.title', descKey: 'about.miracles.m4.desc' },
  ];

  return (
    <div className="w-full pt-20">
      {/* Page Hero */}
      <section className="relative h-[50vh] flex items-center justify-center bg-white overflow-hidden text-center px-4">
        <div className="absolute inset-0 pointer-events-none opacity-5 flex items-center justify-center text-gold-primary">
          <LotusWatermark opacity={1} className="w-[600px] h-[600px]" />
        </div>
        <motion.div initial="hidden" animate="visible" variants={fadeUp} className="relative z-10">
          <span className={`font-cinzel text-gold-primary text-sm uppercase tracking-wide block mb-4 ${fn}`}>{t('about.hero.badge')}</span>
          <h1 className={`font-cinzel text-4xl md:text-6xl text-text-dark mb-4 uppercase tracking-wide ${fn}`}>
            {t('about.hero.title')}
          </h1>
          <p className={`font-cormorant text-xl md:text-2xl text-text-muted italic ${fn}`}>
            {t('about.hero.subtitle')}
          </p>
        </motion.div>
      </section>

      <div className="gold-divider" />

      {/* Intro Paragraphs */}
      <section className="py-20 px-4 bg-bg-section">
        <div className="max-w-4xl mx-auto space-y-6 text-center">
          <motion.h2
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
            className={`font-cinzel text-3xl md:text-4xl text-center mb-10 text-text-dark uppercase tracking-wide ${fn}`}
          >
            {t('about.intro.title')}
          </motion.h2>
          <motion.p initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className={`font-cormorant text-xl text-text-muted leading-relaxed ${fn}`}>
            {t('about.intro.p1')}
          </motion.p>
          <motion.ul initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className={`text-left font-cormorant text-xl text-text-muted leading-relaxed space-y-4 pt-4 ${fn}`}>
            <li className="flex items-start">
              <span className="text-gold-primary mr-3 text-2xl leading-none">&bull;</span>
              <span>{t('about.intro.b1')}</span>
            </li>
            <li className="flex items-start">
              <span className="text-gold-primary mr-3 text-2xl leading-none">&bull;</span>
              <span>{t('about.intro.b2')}</span>
            </li>
            <li className="flex items-start">
              <span className="text-gold-primary mr-3 text-2xl leading-none">&bull;</span>
              <span>{t('about.intro.b3')}</span>
            </li>
          </motion.ul>
        </div>
      </section>

      <div className="gold-divider" />

      {/* Visual Timeline */}
      <section className="py-20 md:py-32 px-4 bg-white relative">
        <div className="max-w-[1000px] mx-auto">
          <motion.h2
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
            className={`font-cinzel text-3xl md:text-4xl text-center mb-20 text-text-dark uppercase tracking-wide ${fn}`}
          >
            {t('about.timeline.title')}
          </motion.h2>

          <div className="relative">
            {/* Vertical Line */}
            <div className="absolute left-[20px] md:left-1/2 top-0 bottom-0 w-[1px] bg-gold-light transform md:-translate-x-1/2 opacity-50" />

            <div className="space-y-16">
              {timelineEvents.map((event, idx) => (
                <motion.div
                  key={idx}
                  initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeUp}
                  className={`relative flex flex-col md:flex-row items-center gap-8 ${
                    idx % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                  }`}
                >
                  {/* Timeline Dot */}
                  <div className="absolute left-[20px] md:left-1/2 w-3 h-3 bg-gold-primary rounded-full transform -translate-x-1/2 outline outline-4 outline-white z-10" />

                  <div className={`w-full pl-12 md:pl-0 md:w-1/2 ${idx % 2 === 0 ? 'md:pr-16 md:text-right' : 'md:pl-16 md:text-left'}`}>
                    <div className="card inline-block w-full text-left">
                      <span className="font-cinzel text-gold-primary font-bold text-lg block mb-2">{event.label ? `${event.label} / ${event.year}` : event.year}</span>
                      <h3 className={`font-cinzel text-xl text-text-dark mb-3 leading-snug ${fn}`}>
                        {lang === 'hi' && event.titleHi ? event.titleHi : event.title}
                      </h3>
                      <p className={`font-cormorant text-text-muted ${fn}`}>
                        {lang === 'hi' && event.descriptionHi ? event.descriptionHi : event.description}
                      </p>
                    </div>
                  </div>
                  <div className="hidden md:block w-1/2" />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="gold-divider" />

      {/* Miracles & Beliefs */}
      <section className="py-20 md:py-32 px-4 bg-bg-section relative">
        <div className="max-w-[1200px] mx-auto">
          <motion.h2
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
            className={`font-cinzel text-3xl md:text-4xl text-center mb-16 text-text-dark uppercase tracking-wide ${fn}`}
          >
            {t('about.miracles.title')}
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {miracles.map((miracle, idx) => (
              <motion.div
                key={idx}
                initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
                className="bg-white p-8 border-t-2 border-gold-primary shadow-sm hover:shadow-lg transition duration-300"
              >
                <div className="w-10 h-10 mb-6 text-gold-primary opacity-50">
                  <LotusWatermark opacity={1} />
                </div>
                <h3 className={`font-cinzel text-lg text-text-dark mb-3 uppercase tracking-wide ${fn}`}>{t(miracle.titleKey)}</h3>
                <p className={`font-cormorant text-text-muted ${fn}`}>{t(miracle.descKey)}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <div className="gold-divider" />

      {/* Temple Idols Info */}
      <section className="py-20 md:py-32 px-4 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h2
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
            className={`font-cinzel text-3xl md:text-4xl mb-10 text-text-dark uppercase tracking-wide ${fn}`}
          >
            {t('about.idols.title')}
          </motion.h2>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="card inline-block w-full max-w-3xl bg-off-white text-left mt-8 relative">
             <div className="absolute top-0 right-0 w-32 h-32 text-gold-primary opacity-[0.03] pointer-events-none -mr-8 -mt-8">
               <LotusWatermark opacity={1} />
             </div>
             <h3 className={`font-cinzel text-2xl text-gold-primary mb-6 ${fn}`}>{t('about.idols.subtitle')}</h3>

             <div className={`grid grid-cols-1 md:grid-cols-3 gap-y-4 font-cormorant text-lg text-text-dark mb-6 border-b border-gold-pale pb-6 ${fn}`}>
                <div className="font-bold text-gold-primary md:col-span-1">{t('about.idols.posture')}</div>
                <div className="md:col-span-2">{t('about.idols.posture.val')}</div>

                <div className="font-bold text-gold-primary md:col-span-1">{t('about.idols.height')}</div>
                <div className="md:col-span-2">{t('about.idols.height.val')}</div>

                <div className="font-bold text-gold-primary md:col-span-1">{t('about.idols.consecrated')}</div>
                <div className="md:col-span-2">{t('about.idols.consecrated.val')}</div>

                <div className="font-bold text-gold-primary md:col-span-1">{t('about.idols.origin')}</div>
                <div className="md:col-span-2">{t('about.idols.origin.val')}</div>

                <div className="font-bold text-gold-primary md:col-span-1">{t('about.idols.features')}</div>
                <div className="md:col-span-2">{t('about.idols.features.val')}</div>
             </div>

             <p className={`font-cormorant text-lg text-text-muted italic ${fn}`}>
               {t('about.idols.desc')}
             </p>
          </motion.div>
        </div>
      </section>

    </div>
  );
}
