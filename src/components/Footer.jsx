import React from 'react';
import { Link } from 'react-router-dom';
import LotusWatermark from './LotusWatermark';

export default function Footer() {
  return (
    <footer className="bg-text-dark text-white pt-16 pb-8 border-t border-gold-primary relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none text-gold-light overflow-hidden flex items-center justify-center">
        <div className="w-[800px] h-[800px] translate-y-1/2">
           <LotusWatermark opacity={1} />
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-4 md:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          
          {/* Col 1 */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 text-gold-light">
                <LotusWatermark opacity={1} />
              </div>
              <span className="font-cinzel text-gold-light text-2xl tracking-wide">
                PJPT
              </span>
            </div>
            <p className="text-off-white font-cormorant italic text-lg opacity-80">
              A living pilgrimage since Vikram Samvat 688
            </p>
          </div>

          {/* Col 2 */}
          <div className="flex flex-col gap-3">
            <h4 className="font-cinzel text-gold-light text-lg mb-2 uppercase tracking-wide">Quick Links</h4>
            <div className="grid grid-cols-2 gap-2">
              <Link to="/" className="text-white/80 hover:text-gold-light transition font-cinzel text-sm uppercase tracking-wide">Home</Link>
              <Link to="/about" className="text-white/80 hover:text-gold-light transition font-cinzel text-sm uppercase tracking-wide">About</Link>
              <Link to="/gallery" className="text-white/80 hover:text-gold-light transition font-cinzel text-sm uppercase tracking-wide">Gallery</Link>
              <Link to="/visit" className="text-white/80 hover:text-gold-light transition font-cinzel text-sm uppercase tracking-wide">Visit</Link>
              <Link to="/events" className="text-white/80 hover:text-gold-light transition font-cinzel text-sm uppercase tracking-wide">Events</Link>
              <Link to="/contact" className="text-white/80 hover:text-gold-light transition font-cinzel text-sm uppercase tracking-wide">Contact</Link>
            </div>
          </div>

          {/* Col 3 */}
          <div>
            <h4 className="font-cinzel text-gold-light text-lg mb-4 uppercase tracking-wide">Visit Us</h4>
            <address className="text-white/80 not-italic mb-4 font-cormorant">
              Shri Jain Shwetambar Parasali Tirth<br/>
              Parasali, Shamgarh<br/>
              District Mandsaur, MP — 458883
            </address>
            <p className="font-cinzel text-sm text-gold-pale opacity-90 tracking-wide">
              Open: 5:30 AM – 8:30 PM
            </p>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-white/50 text-sm font-cormorant">
          <p>© 2025 Prachin Jain Parasali Tirth · All Rights Reserved</p>
          <p className="italic">Built with devotion</p>
        </div>
      </div>
    </footer>
  );
}