import React from 'react';
import { motion } from 'framer-motion';
import LotusWatermark from '../components/LotusWatermark';
import { timelineEvents } from '../data/history';

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
};

export default function About() {
  return (
    <div className="w-full pt-20">
      {/* Page Hero */}
      <section className="relative h-[50vh] flex items-center justify-center bg-white overflow-hidden text-center px-4">
        <div className="absolute inset-0 pointer-events-none opacity-5 flex items-center justify-center text-gold-primary">
          <LotusWatermark opacity={1} className="w-[600px] h-[600px]" />
        </div>
        <motion.div initial="hidden" animate="visible" variants={fadeUp} className="relative z-10">
          <span className="font-cinzel text-gold-primary text-sm uppercase tracking-wide block mb-4">Our Sacred Heritage</span>
          <h1 className="font-cinzel text-4xl md:text-6xl text-text-dark mb-4 uppercase tracking-wide">
            History of AVADHPURI PARASALI JAIN TIRTH
          </h1>
          <p className="font-cormorant text-xl md:text-2xl text-text-muted italic">
            A living pilgrimage since Vikram Samvat 688 · 631 CE
          </p>
        </motion.div>
      </section>

      <div className="gold-divider" />

      {/* Intro Paragraphs */}
      <section className="py-20 px-4 bg-bg-section">
        <div className="max-w-4xl mx-auto space-y-6 text-center">
          <motion.h2 
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
            className="font-cinzel text-3xl md:text-4xl text-center mb-10 text-text-dark uppercase tracking-wide"
          >
             AVADHPURI PARASALI JAIN TIRTH: A Divine Legacy and Present Glory
          </motion.h2>
          <motion.p initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="font-cormorant text-xl text-text-muted leading-relaxed">
            Parasali is an ancient, miraculous, and spiritual Jain pilgrimage site located in the Malwa region of Madhya Pradesh. It lies in the Mandsaur district, 10 km east of Shamgarh station on the Mumbai-Delhi railway line, and just 42 km from the renowned Nageshwar Tirth.
          </motion.p>
          <motion.ul initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-left font-cormorant text-xl text-text-muted leading-relaxed space-y-4 pt-4">
            <li className="flex items-start">
              <span className="text-gold-primary mr-3 text-2xl leading-none">&bull;</span>
              <span>Even though there is not a single Jain household in Parasali, the grand temple — resembling a divine vimana (celestial chariot) — houses a total of 26 magnificent idols, including the main deity, Lord Adinath.</span>
            </li>
            <li className="flex items-start">
              <span className="text-gold-primary mr-3 text-2xl leading-none">&bull;</span>
              <span>The primary idol of Lord Adinath, seated in lotus posture and measuring 76.2 cm in height, was consecrated in Vikram Samvat 688 (631 CE). It is believed that the idol emerged naturally from the earth and could not be moved, leading to its establishment at this very spot.</span>
            </li>
            <li className="flex items-start">
              <span className="text-gold-primary mr-3 text-2xl leading-none">&bull;</span>
              <span>Unique features include a necklace around the idol's neck and bangles on its hands that are naturally carved from the same stone — a rarity in idol craftsmanship.</span>
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
            className="font-cinzel text-3xl md:text-4xl text-center mb-20 text-text-dark uppercase tracking-wide"
          >
            Chronicles of Devotion
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
                      <h3 className="font-cinzel text-xl text-text-dark mb-3 leading-snug">{event.title}</h3>
                      <p className="font-cormorant text-text-muted">{event.description}</p>
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
            className="font-cinzel text-3xl md:text-4xl text-center mb-16 text-text-dark uppercase tracking-wide"
          >
            🌼 Miracles and Beliefs
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: "Saffron Showers from the Sky", desc: "A longstanding belief holds that when a soul destined for liberation visits this tirth, saffron showers from the sky — a tradition that has continued for years." },
              { title: "Sacred Rivers of Circumambulation", desc: "The tirth is surrounded by natural rivers that form a divine circumambulation path around it — as if nature itself guards the sacred ground." },
              { title: "Freedom from Rebirth in Hell", desc: "It is said that anyone who sincerely offers prayers here five times will never be reborn in hell — such is the spiritual power of this ancient site." },
              { title: "Eternal Water Abundance", desc: "The site has never experienced a shortage of water — even during the great famine of 1899-1900, the tirth remained blessed and self-sufficient." }
            ].map((miracle, idx) => (
              <motion.div 
                key={idx}
                initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
                className="bg-white p-8 border-t-2 border-gold-primary shadow-sm hover:shadow-lg transition duration-300"
              >
                <div className="w-10 h-10 mb-6 text-gold-primary opacity-50">
                  <LotusWatermark opacity={1} />
                </div>
                <h3 className="font-cinzel text-lg text-text-dark mb-3 uppercase tracking-wide">{miracle.title}</h3>
                <p className="font-cormorant text-text-muted">{miracle.desc}</p>
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
            className="font-cinzel text-3xl md:text-4xl mb-10 text-text-dark uppercase tracking-wide"
          >
            🛕 The Sacred Idols
          </motion.h2>
          
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="card inline-block w-full max-w-3xl bg-off-white text-left mt-8 relative">
             <div className="absolute top-0 right-0 w-32 h-32 text-gold-primary opacity-[0.03] pointer-events-none -mr-8 -mt-8">
               <LotusWatermark opacity={1} />
             </div>
             <h3 className="font-cinzel text-2xl text-gold-primary mb-6">Shri Adinath Bhagwan — The Primary Deity</h3>
             
             <div className="grid grid-cols-1 md:grid-cols-3 gap-y-4 font-cormorant text-lg text-text-dark mb-6 border-b border-gold-pale pb-6">
                <div className="font-bold text-gold-primary md:col-span-1">Posture</div>
                <div className="md:col-span-2">Lotus (Padmasana)</div>
                
                <div className="font-bold text-gold-primary md:col-span-1">Height</div>
                <div className="md:col-span-2">76.2 cm</div>
                
                <div className="font-bold text-gold-primary md:col-span-1">Consecrated</div>
                <div className="md:col-span-2">631 CE (VS 688)</div>
                
                <div className="font-bold text-gold-primary md:col-span-1">Origin</div>
                <div className="md:col-span-2">Self-manifested from the earth</div>
                
                <div className="font-bold text-gold-primary md:col-span-1">Special Features</div>
                <div className="md:col-span-2">Naturally carved necklace and bangles from the same stone — an unmatched rarity in Jain idol craftsmanship</div>
             </div>
             
             <p className="font-cormorant text-lg text-text-muted italic">
               The temple — resembling a divine vimana (celestial chariot) — houses a total of 26 magnificent idols. Remarkably, there is not a single Jain household in the village of Parasali itself, yet this grand temple has stood and flourished for over 1400 years through divine grace alone.
             </p>
          </motion.div>
        </div>
      </section>

    </div>
  );
}
