import React from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import LotusWatermark from '../../components/LotusWatermark';
import { useLang } from '../../contexts/LanguageContext';

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

// Attraction cards — emoji + translation key
const attractions = [
  { icon: '🌿', key: 'sanskar.attr1' },
  { icon: '🙏', key: 'sanskar.attr2' },
  { icon: '📖', key: 'sanskar.attr3' },
  { icon: '🎁', key: 'sanskar.attr4' },
  { icon: '💬', key: 'sanskar.attr5' },
  { icon: '🏆', key: 'sanskar.attr6' },
  { icon: '✨', key: 'sanskar.attr7' }
];

// Registration / enquiry contacts (names kept in Hindi as on the invitation)
const contacts = [
  { city: 'इंदौर', name: 'जयंत खाबिया', phone: '7987548476' },
  { city: 'इंदौर', name: 'शुभम पटवा', phone: '9039741867' },
  { city: 'उज्जैन', name: 'पिंकेश', phone: '9179153333' },
  { city: 'बड़ौद', name: 'आयुष', phone: '7067053636' },
  { city: 'रतलाम', name: 'गणतंत्रजी मेहता', phone: '9424021516' },
  { city: 'सूरत', name: 'रुचिक शाह', phone: '9925751950' },
  { city: 'मुंबई', name: 'हर्षिल', phone: '9969545565' },
  { city: 'नागेश्वर', name: 'पारसजी', phone: '9887244477' },
  { city: 'डग', name: 'कविश', phone: '7849873562' },
  { city: 'रामगंजमंडी', name: 'अंशुल', phone: '9214803918' },
  { city: 'फतेहपुरा', name: 'नींव', phone: '8160272726' },
  { city: '—', name: 'अक्षत आवर', phone: '7597688231' }
];

export default function SanskarUtsav2026() {
  const { t } = useLang();
  return (
    <div className="w-full pt-20 bg-bg-section pb-20 relative">
      <Helmet>
        <title>Sanskar Utsav 2026 – Youth Camp at Parasli Jain Tirth</title>
        <meta name="description" content="Sanskar Utsav 2026 – a 2-day values camp for boys aged 12–21 on 12–13 June 2026 at Shri Parasli Jain Tirth, under the shelter of the 1400-year-old Shri Adinath Dada." />
        <link rel="canonical" href="https://paraslijaintirth.com/events/sanskar-utsav-2026" />
        <meta property="og:title" content="Sanskar Utsav 2026 – Youth Camp at Parasli Jain Tirth" />
        <meta property="og:description" content="A 2-day values camp for boys aged 12–21 on 12–13 June 2026 at Shri Parasli Jain Tirth." />
        <meta property="og:url" content="https://paraslijaintirth.com/events/sanskar-utsav-2026" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://paraslijaintirth.com/sanskar-utsav-2026.jpg" />
      </Helmet>

      {/* Mobile Sticky Back Button */}
      <Link
        to="/events"
        className="md:hidden fixed bottom-4 right-4 z-50 bg-white border-2 border-gold-primary text-gold-primary px-4 py-2 font-cinzel text-xs uppercase tracking-wider shadow-lg"
      >
        &larr; {t('sanskar.backButton')}
      </Link>

      {/* SECTION 1 — Hero */}
      <section className="relative min-h-[60vh] flex items-center justify-center bg-white overflow-hidden text-center px-4 py-20 border-b border-gold-light">
        <div className="absolute inset-0 pointer-events-none opacity-5 flex items-center justify-center text-gold-primary">
          <LotusWatermark opacity={1} className="w-[800px] h-[800px]" />
        </div>
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="relative z-10 max-w-4xl mx-auto">
          <span className="font-noto text-gold-primary text-sm md:text-base tracking-wide block mb-2">
            {t('sanskar.salutation1')}
          </span>
          <span className="font-noto text-text-muted text-xs md:text-sm tracking-wide block mb-6">
            {t('sanskar.salutation2')}
          </span>
          <p className="font-noto text-gold-primary text-sm md:text-base mb-4">{t('sanskar.triveni')}</p>
          <h1 className="font-cinzel text-5xl md:text-7xl text-text-dark mb-2 uppercase tracking-wide">
            {t('sanskar.title')}
          </h1>
          <h2 className="font-noto text-2xl md:text-3xl text-gold-primary mb-6">{t('sanskar.titleHi')}</h2>
          <p className="font-noto text-lg md:text-2xl text-gold-primary mb-3 font-medium">
            {t('sanskar.tagline')}
          </p>
          <p className="font-noto text-base md:text-lg text-text-dark mb-8">{t('sanskar.forTeens')}</p>
          <p className="font-cormorant text-xl text-text-muted italic max-w-2xl mx-auto mb-10 leading-relaxed">
            {t('sanskar.heroDescription')}
          </p>

          <div className="flex flex-col md:flex-row items-center justify-center gap-6 mb-8">
            <div className="border border-gold-primary bg-gold-pale px-6 py-3 font-noto text-gold-primary text-sm md:text-base shadow-sm">
              <span className="font-bold">{t('sanskar.date1Label')}</span><br/>{t('sanskar.date1')}
            </div>
            <div className="border border-gold-primary bg-gold-pale px-6 py-3 font-noto text-gold-primary text-sm md:text-base shadow-sm">
              <span className="font-bold">{t('sanskar.date2Label')}</span><br/>{t('sanskar.date2')}
            </div>
          </div>

          <div className="inline-block bg-gold-primary text-white px-6 py-2 font-noto text-sm md:text-base shadow-md">
            {t('sanskar.eligibility')}
          </div>
        </motion.div>
      </section>

      {/* SECTION 2 — Blessings */}
      <section className="py-20 px-4 bg-off-white">
        <div className="max-w-[1000px] mx-auto text-center">
          <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="font-cinzel text-3xl md:text-4xl text-gold-primary mb-12 uppercase tracking-wide">
            <span className="font-noto mr-3">{t('sanskar.blessingsLabel')}</span>· {t('sanskar.blessings')}
          </motion.h2>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="card bg-white mx-auto max-w-3xl relative">
            <div className="absolute top-0 left-0 w-24 h-24 text-gold-primary opacity-[0.03] pointer-events-none -ml-4 -mt-4">
              <LotusWatermark opacity={1} />
            </div>
            <h3 className="font-cinzel text-2xl md:text-3xl text-gold-primary mb-3 leading-tight">{t('sanskar.blessingName')}</h3>
            <h4 className="font-noto text-xl text-text-dark">{t('sanskar.blessingNameHi')}</h4>
          </motion.div>
        </div>
      </section>

      {/* SECTION 3 — Presiding Saints */}
      <section className="py-20 px-4 bg-bg-section border-y border-gold-light">
        <div className="max-w-[1000px] mx-auto text-center">
          <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="font-cinzel text-3xl md:text-4xl text-gold-primary mb-12 uppercase tracking-wide">
            <span className="font-noto mr-3">{t('sanskar.presidingLabel')}</span>· {t('sanskar.presiding')}
          </motion.h2>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="card bg-white border-t-4 border-t-gold-primary mx-auto max-w-3xl">
            <p className="font-cormorant text-lg md:text-xl text-text-dark leading-relaxed">
              {t('sanskar.presidingDescription')}
            </p>
          </motion.div>
        </div>
      </section>

      {/* SECTION 4 — Attractions */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-[1200px] mx-auto text-center">
          <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="font-cinzel text-3xl md:text-4xl text-gold-primary mb-12 uppercase tracking-wide">
            <span className="font-noto mr-3">{t('sanskar.attractionsLabel')}</span>· {t('sanskar.attractions')}
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
            {attractions.map((item, idx) => (
              <motion.div key={idx} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="card bg-off-white flex items-start gap-4">
                <span className="text-3xl shrink-0">{item.icon}</span>
                <p className="font-noto text-lg text-text-dark leading-snug">{t(item.key)}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 5 — Important Notes */}
      <section className="py-20 px-4 bg-bg-section border-t border-gold-light">
        <div className="max-w-[1000px] mx-auto text-center">
          <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="font-cinzel text-3xl md:text-4xl text-gold-primary mb-12 uppercase tracking-wide">
            <span className="font-noto mr-3">{t('sanskar.notesLabel')}</span>· {t('sanskar.notes')}
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left max-w-3xl mx-auto">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="card bg-white border-l-4 border-gold-primary">
              <p className="font-noto text-text-dark leading-relaxed">{t('sanskar.note1')}</p>
            </motion.div>
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="card bg-white border-l-4 border-gold-primary">
              <p className="font-noto text-text-dark leading-relaxed">{t('sanskar.note2')}</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* SECTION 6 — Official Invitation Poster */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-[1000px] mx-auto text-center">
          <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="font-cinzel text-3xl md:text-4xl text-gold-primary mb-12 uppercase tracking-wide">
            {t('sanskar.posterLabel')}
          </motion.h2>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <img
              src="/sanskar-utsav-2026.jpg"
              alt="Sanskar Utsav 2026 invitation poster"
              className="mx-auto w-full max-w-md border-4 border-gold-pale shadow-lg"
            />
          </motion.div>
        </div>
      </section>

      {/* SECTION 7 — Organiser & Contacts */}
      <section className="py-20 px-4 bg-bg-section border-t border-gold-light">
        <div className="max-w-[1100px] mx-auto text-center">
          <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="font-cinzel text-3xl md:text-4xl text-gold-primary mb-4 uppercase tracking-wide">
            <span className="font-noto mr-3">{t('sanskar.organiserLabel')}</span>· {t('sanskar.organiser')}
          </motion.h2>
          <motion.p initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="font-noto text-xl text-text-dark mb-12">
            {t('sanskar.organiserName')}
          </motion.p>

          <motion.h3 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="font-cinzel text-lg text-gold-primary mb-8 uppercase tracking-wider">
            {t('sanskar.contactsLabel')}
          </motion.h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-left">
            {contacts.map((c, idx) => (
              <motion.div key={idx} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="bg-white p-4 border border-gold-light shadow-sm flex flex-col">
                <span className="font-noto text-gold-primary text-sm font-bold">{c.city}</span>
                <span className="font-noto text-text-dark">{c.name}</span>
                <a href={`tel:${c.phone}`} className="font-cinzel text-gold-primary hover:text-gold-light transition-colors mt-1">{c.phone}</a>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 8 — Connect With Us */}
      <section className="py-20 px-4 bg-white border-t border-gold-light">
        <div className="max-w-[1200px] mx-auto text-center">
          <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="font-noto text-3xl md:text-4xl text-gold-primary mb-12 tracking-wide">
            {t('sanskar.connectTitle')}
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="bg-off-white p-6 border-l-4 border-[#25D366] shadow-sm flex flex-col justify-center">
              <span className="font-noto font-bold text-lg text-text-dark mb-1">{t('dhwajarohan.whatsappLabel')}</span>
              <a href="https://chat.whatsapp.com/EZJTMgrnbUN1nx9JgcCDe8" target="_blank" rel="noopener noreferrer" className="font-cinzel text-gold-primary hover:text-gold-light transition-colors mb-2 inline-block">PARASLI JAIN TIRTH</a>
            </motion.div>
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="bg-off-white p-6 border-l-4 border-[#E1306C] shadow-sm flex flex-col justify-center">
              <span className="font-noto font-bold text-lg text-text-dark mb-1">{t('dhwajarohan.instagramLabel')}</span>
              <a href="https://www.instagram.com/avadhpuri_parasli_jain_tirth?igsh=MTVlb21mNHZ6cXlqbQ==" target="_blank" rel="noopener noreferrer" className="font-cinzel text-gold-primary hover:text-gold-light transition-colors mb-2 inline-block break-words break-all">@PARASLI_JAIN_TIRTH</a>
            </motion.div>
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="bg-off-white p-6 border-l-4 border-[#EA4335] shadow-sm flex flex-col justify-center">
              <span className="font-noto font-bold text-lg text-text-dark mb-1">{t('dhwajarohan.mapsLabel')}</span>
              <a href="https://share.google/ObJ9vP3gJ7KFJ5Dzg" target="_blank" rel="noopener noreferrer" className="font-cinzel text-gold-primary hover:text-gold-light transition-colors mb-2 inline-block">{t('dhwajarohan.mapsLink')}</a>
              <p className="font-cormorant text-text-muted text-sm mt-1">{t('dhwajarohan.mapsLocation')}</p>
            </motion.div>
          </div>
        </div>
      </section>

    </div>
  );
}
