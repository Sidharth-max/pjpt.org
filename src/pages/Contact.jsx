import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import LotusWatermark from '../components/LotusWatermark';
import { submitContact } from '../services/api';

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

export default function Contact() {
  const [formData, setFormData] = useState({ firstName: '', lastName: '', email: '', phone: '', subject: 'General Inquiry', message: '' });
  const [errors, setErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!formData.firstName) newErrors.firstName = 'First name is required';
    if (!formData.phone && !formData.email) newErrors.phone = 'Phone or Email is required';
    if (!formData.message) newErrors.message = 'Message is required';
    
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
        alert('Failed to send message. Please try again.');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className="w-full pt-20">
      
      {/* Page Hero */}
      <section className="py-20 px-4 text-center bg-off-white relative">
        <motion.div initial="hidden" animate="visible" variants={fadeUp} className="relative z-10 max-w-2xl mx-auto">
          <h1 className="font-cinzel text-4xl md:text-5xl text-gold-primary mb-4 uppercase tracking-wide">
            Get In Touch
          </h1>
          <p className="font-cormorant text-xl text-text-muted">
            Reach out for visiting information, events, or general inquiries
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
              <h3 className="font-cinzel text-2xl text-text-dark mb-6 uppercase tracking-wide">Contact Information</h3>
              <address className="not-italic font-cormorant text-lg text-text-muted space-y-2 mb-8">
                <p className="font-bold text-text-dark">Shri Avadhpuri Parasali Jain Tirth</p>
                <p>Parasali, Shamgarh, District Mandsaur</p>
                <p>Madhya Pradesh — 458883, India</p>
              </address>
              <div className="font-cormorant text-lg text-text-muted space-y-4">
                <p><strong className="text-gold-primary font-cinzel mr-2">Temple Hours:</strong> 5:30 AM – 8:30 PM</p>
                <p><strong className="text-gold-primary font-cinzel mr-2">Office Hours:</strong> 9:00 AM – 6:00 PM</p>
              </div>
              <div className="mt-8 pt-8 border-t border-gold-pale">
                <p className="font-cormorant text-text-muted italic">"For pilgrimage planning, donation details, or facility booking, please reach out via the form."</p>
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
                  <h3 className="font-cinzel text-2xl text-text-dark uppercase tracking-wide">Message Received</h3>
                  <p className="font-cormorant text-xl text-text-muted">
                    Your message has been successfully received. The temple trust will review your inquiry and respond shortly. 🙏
                  </p>
                  <button onClick={() => setIsSubmitted(false)} className="btn-gold mt-4">Send Another Message</button>
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
                      <label className="block font-cinzel text-sm text-text-dark mb-2">First Name *</label>
                      <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} className="w-full bg-off-white border-b-2 border-gold-pale focus:border-gold-primary focus:outline-none p-3 font-cormorant text-lg transition" />
                      {errors.firstName && <p className="text-gold-primary text-sm mt-1">{errors.firstName}</p>}
                    </div>
                    <div>
                      <label className="block font-cinzel text-sm text-text-dark mb-2">Last Name</label>
                      <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} className="w-full bg-off-white border-b-2 border-gold-pale focus:border-gold-primary focus:outline-none p-3 font-cormorant text-lg transition" />
                    </div>
                  </div>

                  <div>
                    <label className="block font-cinzel text-sm text-text-dark mb-2">Email Address *</label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full bg-off-white border-b-2 border-gold-pale focus:border-gold-primary focus:outline-none p-3 font-cormorant text-lg transition" />
                    {errors.email && <p className="text-gold-primary text-sm mt-1">{errors.email}</p>}
                  </div>

                  <div>
                    <label className="block font-cinzel text-sm text-text-dark mb-2">Phone Number</label>
                    <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="w-full bg-off-white border-b-2 border-gold-pale focus:border-gold-primary focus:outline-none p-3 font-cormorant text-lg transition" />
                  </div>

                  <div>
                    <label className="block font-cinzel text-sm text-text-dark mb-2">Subject</label>
                    <select name="subject" value={formData.subject} onChange={handleChange} className="w-full bg-off-white border-b-2 border-gold-pale focus:border-gold-primary focus:outline-none p-3 font-cormorant text-lg text-text-dark transition appearance-none">
                      <option>General Inquiry</option>
                      <option>Visiting Info</option>
                      <option>Donation</option>
                      <option>Event Participation</option>
                      <option>Suggestions</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-cinzel text-sm text-text-dark mb-2">Message *</label>
                    <textarea name="message" value={formData.message} onChange={handleChange} rows="4" className="w-full bg-off-white border-b-2 border-gold-pale focus:border-gold-primary focus:outline-none p-3 font-cormorant text-lg transition resize-none"></textarea>
                    {errors.message && <p className="text-gold-primary text-sm mt-1">{errors.message}</p>}
                  </div>

                  <button type="submit" disabled={isSubmitting} className="w-full bg-gold-primary text-white border-2 border-gold-primary font-cinzel uppercase tracking-wide py-4 hover:bg-transparent hover:text-gold-primary transition duration-300 disabled:opacity-50">
                    {isSubmitting ? 'Sending...' : 'Send Message'}
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
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3651.5!2d75.6!3d24.2!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3963ef1234567890%3A0xabcdef1234567890!2sParasali%2C+Madhya+Pradesh!5e0!3m2!1sen!2sin!4v1234567890" 
          className="absolute inset-0 w-full h-full border-0 grayscale opacity-80 mix-blend-multiply" 
          allowFullScreen="" 
          loading="lazy" 
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </section>

    </div>
  );
}
