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

export default function Dhwajarohan2026() {
  const { t, lang } = useLang();
  const fn = lang === 'hi' ? 'font-noto' : '';
  return (
    <div className="w-full pt-20 bg-bg-section pb-20 relative">
      <Helmet>
        <title>Dhwajarohan Mahotsav 2026 – Avadhpuri Parasali Jain Tirth</title>
        <meta name="description" content="Celebrate Dhwajarohan Mahotsav 2026 at Avadhpuri Parasali Jain Tirth – a grand Jain flag-hoisting ceremony on April 8, 2026 in Madhya Pradesh. Join thousands of devotees for this auspicious occasion." />
        <link rel="canonical" href="https://pjpt.org/events/dhwajarohan-2026" />
        <meta property="og:title" content="Dhwajarohan Mahotsav 2026 – Avadhpuri Parasali Jain Tirth" />
        <meta property="og:description" content="Celebrate Dhwajarohan Mahotsav 2026 at Avadhpuri Parasali Jain Tirth on April 8, 2026 in Madhya Pradesh. Join thousands of devotees for this auspicious Jain flag-hoisting ceremony." />
        <meta property="og:url" content="https://pjpt.org/events/dhwajarohan-2026" />
        <meta property="og:type" content="website" />
      </Helmet>
      {/* Mobile Sticky Back Button */}
      <Link
        to="/events"
        className="md:hidden fixed bottom-4 right-4 z-50 bg-white border-2 border-gold-primary text-gold-primary px-4 py-2 font-cinzel text-xs uppercase tracking-wider shadow-lg"
      >
        &larr; {t('dhwajarohan.backButton')}
      </Link>

      {/* SECTION 1 — Hero */}
      <section className="relative min-h-[60vh] flex items-center justify-center bg-white overflow-hidden text-center px-4 py-20 border-b border-gold-light">
        <div className="absolute inset-0 pointer-events-none opacity-5 flex items-center justify-center text-gold-primary">
          <LotusWatermark opacity={1} className="w-[800px] h-[800px]" />
        </div>
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="relative z-10 max-w-4xl mx-auto">
          <span className="font-noto text-gold-primary text-sm md:text-base tracking-wide block mb-6">
            {t('dhwajarohan.subheader')}
          </span>
          <h1 className="font-cinzel text-5xl md:text-7xl text-text-dark mb-2 uppercase tracking-wide">
            {t('dhwajarohan.title1')}
          </h1>
          <h2 className="font-cinzel text-4xl md:text-6xl text-text-dark mb-6 uppercase tracking-wide">
            {t('dhwajarohan.title2')}
          </h2>
          <p className="font-noto text-xl md:text-3xl text-gold-primary mb-8 font-medium">
            {t('dhwajarohan.subtitle')}
          </p>
          <p className="font-cormorant text-xl text-text-muted italic max-w-2xl mx-auto mb-10 leading-relaxed">
            {t('dhwajarohan.heroDescription')}
          </p>
          
          <div className="flex flex-col md:flex-row items-center justify-center gap-6">
            <div className="border border-gold-primary bg-gold-pale px-6 py-3 font-noto text-gold-primary text-sm md:text-base shadow-sm">
              <span className="font-bold">{t('dhwajarohan.date1Label')}</span><br/>{t('dhwajarohan.date1')}
            </div>
            <div className="border border-gold-primary bg-gold-pale px-6 py-3 font-noto text-gold-primary text-sm md:text-base shadow-sm">
              <span className="font-bold">{t('dhwajarohan.date2Label')}</span><br/>{t('dhwajarohan.date2')}
            </div>
          </div>
        </motion.div>
      </section>

      {/* SECTION 2 — Spiritual Authority */}
      <section className="py-20 px-4 bg-off-white">
        <div className="max-w-[1000px] mx-auto text-center">
          <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="font-cinzel text-3xl md:text-4xl text-gold-primary mb-12 uppercase tracking-wide">
            <span className="font-noto mr-3">{t('dhwajarohan.spiritualGuidanceLabel')}</span>· {t('dhwajarohan.spiritualGuidance')}
          </motion.h2>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="card bg-white mx-auto max-w-3xl relative">
            <div className="absolute top-0 left-0 w-24 h-24 text-gold-primary opacity-[0.03] pointer-events-none -ml-4 -mt-4">
              <LotusWatermark opacity={1} />
            </div>
            <span className="font-noto text-text-muted text-sm block mb-4 uppercase tracking-wider">{t('dhwajarohan.spiritualTitle')}</span>
            <h3 className="font-cinzel text-2xl md:text-4xl text-gold-primary mb-3 leading-tight">{t('dhwajarohan.spiritualName')}</h3>
            <h4 className="font-noto text-xl text-text-dark mb-6">{t('dhwajarohan.spiritualNameHi')}</h4>
            <p className="font-cormorant text-lg text-text-muted italic max-w-xl mx-auto">
              {t('dhwajarohan.spiritualDescription')}
            </p>
          </motion.div>
        </div>
      </section>

      {/* SECTION 3 — Bhavnistaarak Nishtha */}
      <section className="py-20 px-4 bg-bg-section border-y border-gold-light">
        <div className="max-w-[1200px] mx-auto text-center">
          <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="font-cinzel text-3xl md:text-4xl text-gold-primary mb-12 uppercase tracking-wide">
            <span className="font-noto mr-3">{t('dhwajarohan.presidingLabel')}</span>· {t('dhwajarohan.presiding')}
          </motion.h2>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="card bg-white border-t-4 border-t-gold-primary mx-auto max-w-4xl mb-12">
            <h3 className="font-cinzel text-2xl md:text-3xl text-text-dark mb-2">{t('dhwajarohan.presidingName')}</h3>
            <h4 className="font-noto text-xl md:text-2xl text-gold-primary mb-4">{t('dhwajarohan.presidingNameHi')}</h4>
            <p className="font-cormorant text-lg text-text-muted">
              {t('dhwajarohan.presidingDescription')}
            </p>
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto text-left font-noto text-text-dark">
            <div className="bg-white p-4 border border-gold-pale shadow-sm">&bull; Poo. Munipravar Shri Charitrachandrasagarji M.Sa.</div>
            <div className="bg-white p-4 border border-gold-pale shadow-sm">&bull; Poo. Munirajshri Utsavchandrasagarji M.Sa.</div>
            <div className="bg-white p-4 border border-gold-pale shadow-sm">&bull; Poo. Munirajshri Suvratchandrasagarji M.Sa.</div>
            <div className="bg-white p-4 border border-gold-pale shadow-sm">&bull; Poo. Balmunishri Shreechandrasagarji M.Sa.</div>
            <div className="bg-white p-4 border border-gold-pale shadow-sm">&bull; Poo. Balmunishri Adityachandrasagarji M.Sa.</div>
            <div className="bg-white p-4 border border-gold-pale shadow-sm">&bull; Poo. Munirajshri Mahrishchandrasagarji M.Sa.</div>
          </motion.div>
        </div>
      </section>

      {/* SECTION 4 — Dharma Prabhavak Samrajya */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-[1200px] mx-auto text-center">
          <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="font-cinzel text-3xl md:text-4xl text-gold-primary mb-12 uppercase tracking-wide">
            <span className="font-noto mr-3">{t('dhwajarohan.blessingsLabel')}</span>· {t('dhwajarohan.blessings')}
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="card bg-off-white text-left">
              <h3 className="font-cinzel text-xl text-gold-primary mb-2">1. P.P. Acharya Dev Shri Anandsagar Surishwarji M.Sa.</h3>
              <p className="font-cormorant text-text-muted italic">"Malava ke Sarvochch Upakari, Gyantirth, Aagamoddhaarak"</p>
            </motion.div>
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="card bg-off-white text-left">
              <h3 className="font-cinzel text-xl text-gold-primary mb-2">2. P.P. Acharya Dev Shri Chandrasagar Surishwarji M.Sa.</h3>
              <p className="font-cormorant text-text-muted italic">"Saubhagya Nidhan, Malavoddhaarak, Tirth Vikas Swapnadrishtha"</p>
            </motion.div>
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="card bg-off-white text-left">
              <h3 className="font-cinzel text-xl text-gold-primary mb-2">3. P.P. Upadhyay Pravar Shri Dharmasagarji M.Sa.</h3>
            </motion.div>
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="card bg-off-white text-left">
              <h3 className="font-cinzel text-xl text-gold-primary mb-2">4. P.P. Acharya Dev Shri Abhaysagarji M.Sa.</h3>
              <p className="font-cormorant text-text-muted italic">"Nageshwar Tirthoddhaarak"</p>
            </motion.div>
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="card bg-off-white text-left md:col-span-2 md:w-1/2 md:mx-auto">
              <h3 className="font-cinzel text-xl text-gold-primary mb-2">5. P.P. Acharya Dev Shri Navartnasagar Surishwarji M.Sa.</h3>
              <p className="font-cormorant text-text-muted italic">"Malavabhushan"</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* SECTION 5 — Three Day Schedule */}
      <section className="py-20 px-4 bg-bg-section border-t border-gold-light">
        <div className="max-w-[1200px] mx-auto text-center">
          <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="font-cinzel text-3xl md:text-4xl text-gold-primary mb-16 uppercase tracking-wide">
            <span className="font-noto mr-3">{t('dhwajarohan.scheduleLabel')}</span>· {t('dhwajarohan.schedule')}
          </motion.h2>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 text-left">
            {/* Day 1 */}
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="card bg-white flex flex-col">
              <div className="bg-gold-pale text-gold-primary font-noto font-bold p-4 -mx-8 -mt-8 mb-6 border-b border-gold-primary text-center">
                {t('dhwajarohan.day1Date')}
              </div>
              <h3 className="font-cinzel text-xl text-text-dark mb-2">{t('dhwajarohan.day1Event')}</h3>
              <span className="font-cinzel text-gold-primary text-sm mb-6 block">{t('dhwajarohan.day1Time')}</span>
              <div className="mt-auto">
                <span className="font-noto text-text-muted text-sm block mb-1">महापूजन के लाभार्थी:</span>
                <p className="font-cormorant text-text-dark leading-tight italic">
                  Sv. Bheerulalji Sv. Surajbai ki Divya Kripa se — Mahaveer Prasad Manjula, Kamalchand Manjula, Sv. Dhannalal Manjula Salecha Bohra Parivar, Suvasra
                </p>
              </div>
            </motion.div>

            {/* Day 2 */}
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="card bg-white flex flex-col">
              <div className="bg-gold-pale text-gold-primary font-noto font-bold p-4 -mx-8 -mt-8 mb-6 border-b border-gold-primary text-center">
                {t('dhwajarohan.day2Date')}
              </div>
              <h3 className="font-cinzel text-xl text-text-dark mb-2">{t('dhwajarohan.day2Event')}</h3>
              <span className="font-cinzel text-gold-primary text-sm mb-6 block">{t('dhwajarohan.day2Time')}</span>
              <div className="mt-auto">
                <span className="font-noto text-text-muted text-sm block mb-1">महापूजन के लाभार्थी:</span>
                <p className="font-cormorant text-text-dark leading-tight italic">
                  Shrimati Shardadevi Vijay Prakash Dheeng Parivar, Dag<br/>
                  Shah Shri Laxmichand Ji Manakchand Ji Lodha Parivar, Bhawanimandi
                </p>
              </div>
            </motion.div>

            {/* Day 3 */}
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="card bg-white flex flex-col border-2 border-gold-primary shadow-lg transform lg:-translate-y-4">
              <div className="bg-gold-primary text-white font-noto font-bold p-4 -mx-8 -mt-8 mb-6 text-center">
                {t('dhwajarohan.day3Date')}
              </div>
              <ul className="space-y-4 font-noto text-text-dark mb-8">
                <li className="flex gap-4 border-b border-gold-pale pb-2"><span className="font-cinzel text-gold-primary w-20 shrink-0">8:30 AM</span> <span>ध्वजा की शोभायात्रा (Dhwaja Shobhayatra)</span></li>
                <li className="flex gap-4 border-b border-gold-pale pb-2"><span className="font-cinzel text-gold-primary w-20 shrink-0">9:15 AM</span> <span>पूज्यश्री के प्रवचन (Pravachan)</span></li>
                <li className="flex gap-4 border-b border-gold-pale pb-2"><span className="font-cinzel text-gold-primary w-20 shrink-0">9:30 AM</span> <span>सत्तरभेदी महापूजन (Sattarbhedi Mahapujan)</span></li>
                <li className="flex gap-4 border-b border-gold-pale pb-2 font-bold"><span className="font-cinzel text-gold-primary w-20 shrink-0">10:30 AM</span> <span>ध्वजारोहण (Dhwajarohan)</span></li>
                <li className="flex gap-4"><span className="font-cinzel text-gold-primary w-20 shrink-0">11:30 AM</span> <span>नगर चौरासी — स्वामीवात्सल्य (Nagar Chaurasi)</span></li>
              </ul>
              <div className="mt-auto bg-off-white p-4 -mx-4 -mb-4 border border-gold-pale">
                <span className="font-noto text-text-muted text-sm block mb-1">महापूजन के लाभार्थी:</span>
                <p className="font-cormorant text-text-dark leading-tight italic">
                  Matushri Shrimati Kamala Devi Sujanmal Ji Ramshana ke Divya Ashirvad se — Vijay Jain, Virendra Jain, Mahendra Jain, Sanjay Jain evam Ramshana Parivar, Suvasra
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* SECTION 6 — Festival Attractions */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-[1200px] mx-auto text-center">
          <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="font-cinzel text-3xl md:text-4xl text-gold-primary mb-12 uppercase tracking-wide">
            <span className="font-noto mr-3">{t('dhwajarohan.highlightsLabel')}</span>· {t('dhwajarohan.highlights')}
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10 text-left">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="card bg-off-white">
              <span className="text-3xl mb-4 block">🎭</span>
              <h3 className="font-noto font-bold text-lg text-text-dark mb-1">Didhikarak (Cultural Performance)</h3>
              <p className="font-cormorant text-text-muted">Shri Anilji Haran, Limdi</p>
            </motion.div>
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="card bg-off-white">
              <span className="text-3xl mb-4 block">🎵</span>
              <h3 className="font-noto font-bold text-lg text-text-dark mb-1">Sangeetkaar (Music)</h3>
              <p className="font-cormorant text-text-muted">Shreyans Dhak, Narayangadh evam Neev Nahar, Fatehpura</p>
            </motion.div>
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="card bg-off-white">
              <span className="text-3xl mb-4 block">🎠</span>
              <h3 className="font-noto font-bold text-lg text-text-dark mb-1">Special Procession</h3>
              <p className="font-cormorant text-text-muted">Deekshaarthi Sanyam Sandeepkumar Mehta (Ramganjmandi) ka Varshidan ka Varghoda</p>
            </motion.div>
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="card bg-off-white">
              <span className="text-3xl mb-4 block">🙏</span>
              <h3 className="font-noto font-bold text-lg text-text-dark mb-1">Nightly Devotion</h3>
              <p className="font-cormorant text-text-muted">Pratideen Paramatma ki Ratri Bhakti</p>
            </motion.div>
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="card bg-off-white">
              <span className="text-3xl mb-4 block">🍱</span>
              <h3 className="font-noto font-bold text-lg text-text-dark mb-1">Swamivatslya</h3>
              <p className="font-cormorant text-text-muted">Teenon Din Navkarsi — Dono Samay Swamivatsalya</p>
            </motion.div>
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="card bg-off-white">
              <span className="text-3xl mb-4 block">🌸</span>
              <h3 className="font-noto font-bold text-lg text-text-dark mb-1">Daily Abhishek</h3>
              <p className="font-cormorant text-text-muted">Pratideen Pratah: Shanti Dhara Path se Paramatma ka Abhishek</p>
            </motion.div>
          </div>
          <motion.p initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="font-cormorant text-text-muted italic max-w-3xl mx-auto">
            Decoration by: Arihant Tent evam Event, Nageshwar Unhel<br/>
            Special: The offerings for Sheela Sthaapan ceremony on 19 April 2026 will be announced on 8 April 2026.
          </motion.p>
        </div>
      </section>

      {/* SECTION 7 — Chief Guests */}
      <section className="py-20 px-4 bg-bg-section border-t border-gold-light">
        <div className="max-w-[1200px] mx-auto text-center">
          <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="font-cinzel text-3xl md:text-4xl text-gold-primary mb-12 uppercase tracking-wide">
            <span className="font-noto mr-3">{t('dhwajarohan.guestsLabel')}</span>· {t('dhwajarohan.guests')}
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-left">
            {[
              { name: "Shri Pramodji Jain Bhaya", desc: "Vidhayak, Jeevadaya Premi, Purv Mantri Cabinet Mantri Raj." },
              { name: "Shri Dineshji Babulalji Shah", desc: "World One Tower, Mumbai" },
              { name: "Shri Sampatji Jain", desc: "Lodha Park, Mumbai" },
              { name: "Shri Sunilji Shah", desc: "Lodha Park, Mumbai" },
              { name: "Shri Pareshji Dhoka", desc: "Limdi" },
              { name: "Shri Samataben Sanjayji Jain Lakheri", desc: "Sirodi (Raj.)" },
              { name: "Shri Mukeshji Nemichandji Bhairulalji Jain", desc: "Suvasra Wala, Ujjain" }
            ].map((guest, idx) => (
              <motion.div key={idx} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="bg-white p-6 border border-gold-light shadow-sm flex flex-col justify-center">
                <h3 className="font-cinzel text-lg text-text-dark mb-2 leading-tight">{guest.name}</h3>
                <p className="font-cormorant text-text-muted text-sm leading-snug">{guest.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 8 — Temple Trust Contact */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-[1000px] mx-auto text-center">
          <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="font-cinzel text-3xl md:text-4xl text-gold-primary mb-12 uppercase tracking-wide">
            <span className="font-noto mr-3">{t('dhwajarohan.organiserLabel')}</span>· {t('dhwajarohan.organiser')}
          </motion.h2>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="card bg-off-white mx-auto">
            <h3 className="font-cinzel text-2xl md:text-3xl text-gold-primary mb-2">Shri Avadhpuri Parasali Jain Tirth Pedhi</h3>
            <p className="font-cormorant text-lg text-text-muted mb-8 pb-8 border-b border-gold-pale">Po. Parasali – 458883, Jila Mandsaur (M.P.)</p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 font-noto text-text-dark text-left md:text-center">
              <div>
                <span className="block text-gold-primary font-bold mb-2">संरक्षक</span>
                <p>Dr. Moolchand Gokhru<br/>Mansingh Kothari</p>
              </div>
              <div>
                <span className="block text-gold-primary font-bold mb-2">अध्यक्ष</span>
                <p>Vismay Vijayaprakashji Dheeng<br/>94145 68007</p>
              </div>
              <div>
                <span className="block text-gold-primary font-bold mb-2">उपाध्यक्ष</span>
                <p>Nirmalkumar Chordia<br/>Mahendrakumar Patwa</p>
              </div>
              
              <div>
                <span className="block text-gold-primary font-bold mb-2">सचिव</span>
                <p>Prasanna Lodha<br/>98295 47006</p>
              </div>
              <div>
                <span className="block text-gold-primary font-bold mb-2">सहसचिव</span>
                <p>Mohanlal Kothari<br/>94068 38764</p>
              </div>
              <div>
                <span className="block text-gold-primary font-bold mb-2">कोषाध्यक्ष</span>
                <p>Roopchand Dangi<br/>99817 02977</p>
              </div>
              
              <div className="md:col-span-3 pt-4 border-t border-gold-pale">
                <span className="inline-block text-gold-primary font-bold mr-2">ट्रस्टीगण:</span>
                <span>Kamalkumar Salecha Bohra, Ashokkumar Kumath, Vijaykumar Chordia, Rakeshkumar Chordia, Vijaykumar Ramshana</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* SECTION 9 — Connect With Us */}
      <section className="py-20 px-4 bg-bg-section border-t border-gold-light">
        <div className="max-w-[1200px] mx-auto text-center">
          <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="font-noto text-3xl md:text-4xl text-gold-primary mb-12 tracking-wide">
            {t('dhwajarohan.connectTitle')}
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 text-left">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="bg-white p-6 border-l-4 border-[#25D366] shadow-sm flex flex-col justify-center">
              <span className="font-noto font-bold text-lg text-text-dark mb-1">{t('dhwajarohan.whatsappLabel')}</span>
              <a href="https://chat.whatsapp.com/EZJTMgrnbUN1nx9JgcCDe8" target="_blank" rel="noopener noreferrer" className="font-cinzel text-gold-primary hover:text-gold-light transition-colors mb-2 inline-block">AVADHPURI PARASALI</a>
            </motion.div>
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="bg-white p-6 border-l-4 border-[#E1306C] shadow-sm flex flex-col justify-center">
              <span className="font-noto font-bold text-lg text-text-dark mb-1">{t('dhwajarohan.instagramLabel')}</span>
              <a href="https://www.instagram.com/avadhpuri_parasli_jain_tirth?igsh=MTVlb21mNHZ6cXlqbQ==" target="_blank" rel="noopener noreferrer" className="font-cinzel text-gold-primary hover:text-gold-light transition-colors mb-2 inline-block break-words break-all">@AVADHPURI_PARASALI_JAIN_TIRTH</a>
            </motion.div>
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="bg-white p-6 border-l-4 border-[#EA4335] shadow-sm flex flex-col justify-center">
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
