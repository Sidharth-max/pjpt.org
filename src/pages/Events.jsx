import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import LotusWatermark from '../components/LotusWatermark';
import { recurringEvents } from '../data/content';
import { getEvents } from '../services/api';
import { useLang } from '../contexts/LanguageContext';

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

// Hardcoded events will be translated in JSX using t() function

export default function Events() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const { t, lang } = useLang();
  const fn = lang === 'hi' ? 'font-noto' : '';

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const data = await getEvents();
      setEvents(data);
    } catch (error) {
      console.error("Failed to fetch events", error);
    } finally {
      setLoading(false);
    }
  };

  // Build hardcoded upcoming events from translations
  const hardcodedUpcomingEvents = [
    {
      _id: "varshitap-2026",
      title: t('events.upcoming.varshitap.title'),
      hindi: t('events.upcoming.varshitap.title.hi'),
      date: t('events.upcoming.varshitap.date'),
      description: t('events.upcoming.varshitap.description'),
      location: t('events.upcoming.varshitap.location')
    },
    {
      _id: "sheela-2026",
      title: t('events.upcoming.sheela.title'),
      hindi: t('events.upcoming.sheela.title.hi'),
      date: t('events.upcoming.sheela.date'),
      description: t('events.upcoming.sheela.description'),
      location: t('events.upcoming.sheela.location')
    }
  ];

  const regularEventsFromAPI = events.filter(e => !e.isFeatured);
  const allRegularEvents = [...hardcodedUpcomingEvents, ...regularEventsFromAPI];

  return (
    <div className="w-full pt-20">
      <Helmet>
        <title>Events &amp; Festivals – Parasli Jain Tirth</title>
        <meta name="description" content="Discover upcoming events and annual festivals at Parasli Jain Tirth, including Paryushan, Mahavir Jayanti, Varshitap, and other sacred Jain celebrations in Madhya Pradesh." />
        <link rel="canonical" href="https://paraslijaintirth.com/events" />
        <meta property="og:title" content="Events &amp; Festivals – Parasli Jain Tirth" />
        <meta property="og:description" content="Discover upcoming events and annual festivals at Parasli Jain Tirth, including Paryushan, Mahavir Jayanti, Varshitap, and other sacred Jain celebrations." />
        <meta property="og:url" content="https://paraslijaintirth.com/events" />
        <meta property="og:type" content="website" />
      </Helmet>

      {/* Page Hero */}
      <section className="py-20 px-4 text-center bg-white relative">
        <motion.div initial="hidden" animate="visible" variants={fadeUp} className="relative z-10 max-w-3xl mx-auto">
          <h1 className={`font-cinzel text-4xl md:text-5xl text-gold-primary mb-4 uppercase tracking-wide ${fn}`}>
            {t('events.hero.title')}
          </h1>
          <p className={`font-cormorant text-xl text-text-muted ${fn}`}>
            {t('events.hero.subtitle')}
          </p>
        </motion.div>
      </section>

      <div className="gold-divider" />

      {/* Featured Event - Hardcoded */}
      <section className="py-20 px-4 bg-bg-section min-h-[40vh]">
        <div className="max-w-[1000px] mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="relative bg-white border border-gold-primary shadow-sm overflow-hidden flex flex-col md:flex-row">

            {/* Image Placeholder */}
            <div className="w-full md:w-2/5 bg-off-white flex items-center justify-center min-h-[300px] relative border-b md:border-b-0 md:border-r border-gold-pale overflow-hidden group">
              <div className="absolute top-4 left-4 bg-gold-primary text-white font-cinzel text-xs py-1 px-3 uppercase tracking-wider z-10">
                {t('events.featured.badge')}
              </div>
              <div className="text-gold-primary opacity-10">
                <LotusWatermark opacity={1} className="w-48 h-48" />
              </div>
            </div>

            {/* Content */}
            <div className="p-8 md:p-12 w-full md:w-3/5 flex flex-col justify-center relative">
              <div className="absolute bottom-0 right-0 w-48 h-48 text-gold-primary opacity-[0.03] pointer-events-none -mr-10 -mb-10 rotate-45">
                <LotusWatermark opacity={1} />
              </div>
              <span className="font-cinzel text-gold-primary text-sm uppercase tracking-wide block mb-2">{t('events.featured.dates')}</span>
              <h2 className={`font-cinzel text-3xl md:text-4xl text-text-dark mb-1 ${fn}`}>
                {lang === 'hi' ? t('events.featured.title.hi') : t('events.featured.title')}
              </h2>
              {lang !== 'hi' && (
                <h3 className="font-noto text-xl text-gold-primary mb-4 font-medium">{t('events.featured.title.hi')}</h3>
              )}
              <p className={`font-cormorant text-lg text-text-muted mb-6 leading-relaxed ${fn}`}>
                {t('events.featured.description')}
              </p>
              <div>
                <Link to="/events/dhwajarohan-2026" className={`btn-gold inline-block uppercase text-sm ${fn}`}>{t('events.viewdetails')}</Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <div className="gold-divider" />

      {/* Dynamic Backend Events + Hardcoded Upcoming Grid */}
      {allRegularEvents.length > 0 && (
        <>
          <section className="py-20 bg-white px-4">
            <div className="max-w-[1200px] mx-auto">
              <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className={`font-cinzel text-3xl text-center mb-16 text-text-dark uppercase tracking-wide ${fn}`}>
                {t('events.upcoming.title')}
              </motion.h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {allRegularEvents.map((event) => (
                  <motion.div key={event._id} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={fadeUp} className="card group overflow-hidden flex flex-col">
                    {event.image && (
                       <div className="w-full h-48 -mx-8 -mt-8 mb-6 overflow-hidden relative">
                         <img src={event.image} alt={event.title} className="absolute inset-0 w-full h-full object-cover" />
                       </div>
                    )}
                    <span className="font-cinzel text-gold-primary text-xs uppercase tracking-wider block mb-2">{event.date}</span>
                    <h3 className={`font-cinzel text-xl text-text-dark mb-1 leading-snug ${fn}`}>
                      {lang === 'hi' && event.hindi ? event.hindi : event.title}
                    </h3>
                    {event.hindi && lang !== 'hi' && <h4 className="font-noto text-lg text-gold-primary mb-3">{event.hindi}</h4>}
                    {!event.hindi && <div className="mb-3"></div>}

                    <p className={`font-cormorant text-text-muted leading-relaxed flex-grow ${fn}`}>
                      {event.description}
                    </p>
                    {event.location && (
                      <div className="mt-4 pt-4 border-t border-gold-pale text-sm font-cinzel text-gold-primary tracking-wide">
                        {event.location}
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
          <div className="gold-divider" />
        </>
      )}

      {/* Annual Events Grid (Static defaults) */}
      <section className="py-20 bg-off-white px-4">
        <div className="max-w-[1200px] mx-auto">
          <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className={`font-cinzel text-3xl text-center mb-16 text-text-dark uppercase tracking-wide ${fn}`}>
            {t('events.annual.title')}
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {recurringEvents.map((event, idx) => (
              <motion.div key={idx} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={fadeUp} className="card bg-white group border-gold-pale">
                <div className="absolute -top-10 -right-10 w-32 h-32 text-gold-primary opacity-5 transition-transform duration-500 group-hover:scale-150 rotate-45 pointer-events-none">
                  <LotusWatermark opacity={1} />
                </div>
                <h3 className={`font-cinzel text-lg text-gold-primary mb-3 leading-snug ${fn}`}>
                  {lang === 'hi' && event.titleHi ? event.titleHi : event.title}
                </h3>
                <p className={`font-cormorant text-text-muted leading-relaxed ${fn}`}>
                  {lang === 'hi' && event.descriptionHi ? event.descriptionHi : event.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <div className="gold-divider" />

      {/* CTA */}
      <section className="py-24 px-4 bg-white text-center relative overflow-hidden">
         <div className="absolute inset-0 pointer-events-none opacity-5 flex items-center justify-center text-gold-primary">
            <LotusWatermark opacity={1} className="w-[800px] h-[800px]" />
         </div>
         <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="relative z-10 max-w-2xl mx-auto">
           <h2 className={`font-cinzel text-3xl mb-6 text-text-dark uppercase tracking-wide ${fn}`}>{t('events.cta.title')}</h2>
           <p className={`font-cormorant text-xl text-text-muted mb-10 ${fn}`}>{t('events.cta.desc')}</p>
           <Link to="/contact" className="btn-gold bg-transparent border-gold-primary text-text-dark hover:text-white px-8 py-4">
             {t('events.cta.btn')}
           </Link>
         </motion.div>
      </section>

    </div>
  );
}
