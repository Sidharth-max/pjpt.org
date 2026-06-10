import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import LotusWatermark from '../components/LotusWatermark';
import { submitContact } from '../services/api';
import { useLang } from '../contexts/LanguageContext';

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

export default function Contact() {
  const { t, lang } = useLang();
  const [formData, setFormData] = useState({ firstName: '', lastName: '', email: '', phone: '', subject: 'General Inquiry', message: '' });
  const [errors, setErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fn = lang === 'hi' ? 'font-noto' : '';

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!formData.firstName) newErrors.firstName = t('contact.error.firstname');
    if (!formData.phone && !formData.email) newErrors.phone = t('contact.error.phone');
    if (!formData.message) newErrors.message = t('contact.error.message');

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    } else {
      setIsSubmitting(true);
      try {
        await submitContact({
          name: `${formData.firstName} ${formData.lastName}`.trim(),
          email: formData.email,
          phone: formData.phone || "N/A",
          subject: formData.subject,
          message: formData.message
        });
        setIsSubmitted(true);
        setFormData({ firstName: '', lastName: '', email: '', phone: '', subject: 'General Inquiry', message: '' });
      } catch (err) {
        alert(t('contact.error.network'));
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className="w-full pt-20">
      <Helmet>
        <title>Contact Us – Parasli Jain Tirth</title>
        <meta name="description" content="Get in touch with Parasli Jain Tirth. Send us a message, find our address, phone number, and location map for this sacred Jain pilgrimage site in Madhya Pradesh, India." />
        <link rel="canonical" href="https://paraslijaintirth.com/contact" />
        <meta property="og:title" content="Contact Us – Parasli Jain Tirth" />
        <meta property="og:description" content="Get in touch with Parasli Jain Tirth. Find our address, phone number, and location map in Madhya Pradesh, India." />
        <meta property="og:url" content="https://paraslijaintirth.com/contact" />
        <meta property="og:type" content="website" />
      </Helmet>

      {/* Page Hero */}
      <section className="py-20 px-4 text-center bg-off-white relative">
        <motion.div initial="hidden" animate="visible" variants={fadeUp} className="relative z-10 max-w-2xl mx-auto">
          <h1 className={`font-cinzel text-4xl md:text-5xl text-gold-primary mb-4 uppercase tracking-wide ${fn}`}>
            {t('contact.hero.title')}
          </h1>
          <p className={`font-cormorant text-xl text-text-muted ${fn}`}>
            {t('contact.hero.subtitle')}
          </p>
        </motion.div>
      </section>

      <div className="gold-divider" />

      {/* Two Column Layout */}
      <section className="py-20 px-4 bg-white relative">
        <div className="absolute inset-0 pointer-events-none opacity-[0.02] flex items-center justify-center text-gold-primary">
          <LotusWatermark opacity={1} className="w-[800px] h-[800px]" />
        </div>
        <div className="max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 relative z-10">

          {/* Left Column: Details */}
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <div className="bg-bg-section p-10 border border-gold-light h-full flex flex-col justify-center">
              <div className="w-16 h-16 text-gold-primary mb-8">
                <LotusWatermark opacity={1} />
              </div>
              <h3 className={`font-cinzel text-2xl text-text-dark mb-6 uppercase tracking-wide ${fn}`}>{t('contact.info.title')}</h3>
              <address className={`not-italic font-cormorant text-lg text-text-muted space-y-2 mb-8 ${fn}`}>
                <p className="font-bold text-text-dark">{t('contact.info.name')}</p>
                <p>{t('contact.info.addr1')}</p>
                <p>{t('contact.info.addr2')}</p>
              </address>
              <div className={`font-cormorant text-lg text-text-muted space-y-4 ${fn}`}>
                <p><strong className="text-gold-primary font-cinzel mr-2">{t('contact.info.temple')}</strong> {t('contact.info.temple.val')}</p>
                <p><strong className="text-gold-primary font-cinzel mr-2">{t('contact.info.office')}</strong> {t('contact.info.office.val')}</p>
              </div>
              <div className="mt-8 pt-8 border-t border-gold-pale">
                <p className={`font-cormorant text-text-muted italic ${fn}`}>{t('contact.info.note')}</p>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Form */}
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <AnimatePresence mode="wait">
              {isSubmitted ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-gold-pale border border-gold-primary p-12 text-center h-full flex flex-col items-center justify-center space-y-6"
                >
                  <div className="w-20 h-20 text-gold-primary mx-auto">
                    <LotusWatermark opacity={1} />
                  </div>
                  <h3 className={`font-cinzel text-2xl text-text-dark uppercase tracking-wide ${fn}`}>{t('contact.success.title')}</h3>
                  <p className={`font-cormorant text-xl text-text-muted ${fn}`}>{t('contact.success.desc')}</p>
                  <button onClick={() => setIsSubmitted(false)} className={`btn-gold mt-4 ${fn}`}>{t('contact.success.btn')}</button>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onSubmit={handleSubmit}
                  className="space-y-6 bg-white p-2"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className={`block font-cinzel text-sm text-text-dark mb-2 ${fn}`}>{t('contact.form.firstname')}</label>
                      <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} className="w-full bg-off-white border-b-2 border-gold-pale focus:border-gold-primary focus:outline-none p-3 font-cormorant text-lg transition" />
                      {errors.firstName && <p className={`text-gold-primary text-sm mt-1 ${fn}`}>{errors.firstName}</p>}
                    </div>
                    <div>
                      <label className={`block font-cinzel text-sm text-text-dark mb-2 ${fn}`}>{t('contact.form.lastname')}</label>
                      <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} className="w-full bg-off-white border-b-2 border-gold-pale focus:border-gold-primary focus:outline-none p-3 font-cormorant text-lg transition" />
                    </div>
                  </div>

                  <div>
                    <label className={`block font-cinzel text-sm text-text-dark mb-2 ${fn}`}>{t('contact.form.email')}</label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full bg-off-white border-b-2 border-gold-pale focus:border-gold-primary focus:outline-none p-3 font-cormorant text-lg transition" />
                    {errors.email && <p className="text-gold-primary text-sm mt-1">{errors.email}</p>}
                  </div>

                  <div>
                    <label className={`block font-cinzel text-sm text-text-dark mb-2 ${fn}`}>{t('contact.form.phone')} <span className="text-gold-primary">*</span></label>
                    <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="w-full bg-off-white border-b-2 border-gold-pale focus:border-gold-primary focus:outline-none p-3 font-cormorant text-lg transition" />
                    {errors.phone && <p className={`text-gold-primary text-sm mt-1 ${fn}`}>{errors.phone}</p>}
                    <p className={`text-text-muted font-cormorant text-sm mt-1 ${fn}`}>{t('contact.form.phone.note')}</p>
                  </div>

                  <div>
                    <label className={`block font-cinzel text-sm text-text-dark mb-2 ${fn}`}>{t('contact.form.subject')}</label>
                    <select name="subject" value={formData.subject} onChange={handleChange} className="w-full bg-off-white border-b-2 border-gold-pale focus:border-gold-primary focus:outline-none p-3 font-cormorant text-lg text-text-dark transition appearance-none">
                      <option value="General Inquiry">{t('contact.form.subject.general')}</option>
                      <option value="Visiting Info">{t('contact.form.subject.visiting')}</option>
                      <option value="Donation">{t('contact.form.subject.donation')}</option>
                      <option value="Event Participation">{t('contact.form.subject.event')}</option>
                      <option value="Suggestions">{t('contact.form.subject.suggestions')}</option>
                    </select>
                  </div>

                  <div>
                    <label className={`block font-cinzel text-sm text-text-dark mb-2 ${fn}`}>{t('contact.form.message')}</label>
                    <textarea name="message" value={formData.message} onChange={handleChange} rows="4" className="w-full bg-off-white border-b-2 border-gold-pale focus:border-gold-primary focus:outline-none p-3 font-cormorant text-lg transition resize-none"></textarea>
                    {errors.message && <p className={`text-gold-primary text-sm mt-1 ${fn}`}>{errors.message}</p>}
                  </div>

                  <button type="submit" disabled={isSubmitting} className={`w-full bg-gold-primary text-white border-2 border-gold-primary font-cinzel uppercase tracking-wide py-4 hover:bg-transparent hover:text-gold-primary transition duration-300 disabled:opacity-50 ${fn}`}>
                    {isSubmitting ? t('contact.form.submitting') : t('contact.form.submit')}
                  </button>
                </motion.form>
              )}
            </AnimatePresence>
          </motion.div>

        </div>
      </section>

      <div className="gold-divider" />

      {/* Map Embed */}
      <section className="h-[500px] w-full relative">
        <div className="absolute inset-0 flex items-center justify-center bg-bg-section pointer-events-none z-0">
           <LotusWatermark className="w-64 h-64 text-gold-primary opacity-10" />
        </div>
        <iframe
          title="Google Map Parasali"
          src="https://www.google.com/maps?q=Avadhpuri+Parasali+Jain+Tirth,+Shamgarh,+Mandsaur,+Madhya+Pradesh+458883&output=embed"
          className="absolute inset-0 w-full h-full border-0 grayscale opacity-80 mix-blend-multiply"
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </section>

    </div>
  );
}
