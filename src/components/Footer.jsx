import React from 'react';
import { Link } from 'react-router-dom';
import LotusWatermark from './LotusWatermark';
import { useLang } from '../contexts/LanguageContext';

export default function Footer() {
  const { t, lang } = useLang();
  const fn = lang === 'hi' ? 'font-noto' : '';

  const links = [
    { label: t('nav.home'), path: '/' },
    { label: t('nav.about'), path: '/about' },
    { label: t('nav.gallery'), path: '/gallery' },
    { label: t('nav.visit'), path: '/visit' },
    { label: t('nav.events'), path: '/events' },
    { label: t('nav.contact'), path: '/contact' },
  ];

  return (
    <footer className="bg-text-dark text-white pt-16 pb-8 border-t border-gold-primary relative overflow-hidden">
      <div aria-hidden="true" className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none text-gold-light overflow-hidden flex items-center justify-center">
        <div className="w-[800px] h-[800px] translate-y-1/2">
           <LotusWatermark opacity={1} />
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-4 md:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">

          {/* Col 1 */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div aria-hidden="true" className="w-8 h-8 text-gold-light">
                <LotusWatermark opacity={1} />
              </div>
              <span className="font-cinzel text-gold-light text-2xl tracking-wide">
                PARASLI JAIN TIRTH
              </span>
            </div>
            <p className={`text-off-white font-cormorant italic text-lg opacity-80 ${fn}`}>
              {t('footer.tagline')}
            </p>
          </div>

          {/* Col 2 */}
          <div className="flex flex-col gap-3">
            <h4 className={`font-cinzel text-gold-light text-lg mb-2 uppercase tracking-wide ${fn}`}>{t('footer.quicklinks')}</h4>
            <div className="grid grid-cols-2 gap-2">
              {links.map((link) => (
                <Link key={link.path} to={link.path} className={`text-white/80 hover:text-gold-light transition font-cinzel text-sm uppercase tracking-wide ${fn}`}>
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Col 3 */}
          <div>
            <h4 className={`font-cinzel text-gold-light text-lg mb-4 uppercase tracking-wide ${fn}`}>{t('footer.visitus')}</h4>
            <address className={`not-italic mb-4 font-cormorant ${fn}`}>
              <a href="https://share.google/ObJ9vP3gJ7KFJ5Dzg" target="_blank" rel="noopener noreferrer" className="text-white/80 hover:text-gold-light transition-colors block">
                {t('footer.name')}<br/>
                {t('contact.info.addr1')}<br/>
                {t('contact.info.addr2')}
              </a>
            </address>
            <p className={`font-cinzel text-sm text-gold-pale opacity-90 tracking-wide mb-6 ${fn}`}>
              {t('footer.hours.label')}: {t('contact.info.temple.val')}
            </p>
            <h4 className={`font-cinzel text-gold-light text-lg mb-2 uppercase tracking-wide ${fn}`}>{t('footer.connect')}</h4>
            <a href="https://www.instagram.com/avadhpuri_parasli_jain_tirth?igsh=MTVlb21mNHZ6cXlqbQ==" target="_blank" rel="noopener noreferrer" className="text-white/80 hover:text-gold-light transition font-cinzel text-sm uppercase tracking-wide inline-block">
              Instagram
            </a>
          </div>
        </div>

        <div className={`border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-white/50 text-sm font-cormorant ${fn}`}>
          <p>© {new Date().getFullYear()} PARASLI JAIN TIRTH · {t('footer.rights')}</p>
          <p className="italic">{t('footer.built')}</p>
        </div>
      </div>
    </footer>
  );
}
