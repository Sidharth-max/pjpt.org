import React, { useState, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react';
import LotusWatermark from '../components/LotusWatermark';
import VideoPlayer from '../components/VideoPlayer';
import { getImages } from '../services/api';
import { useLang } from '../contexts/LanguageContext';

const DOMAIN = 'https://pjpt.org';
const SITE_NAME = 'Avadhpuri Parasali Jain Tirth';
const SITE_THUMBNAIL = `${DOMAIN}/og-image.jpg`;

const deriveThumbnail = (videoUrl) => {
  const clean = (videoUrl || '').split('?')[0];
  const candidate = clean.replace(/\.(mp4|webm|ogg|mov)$/i, '.jpg');
  return candidate !== clean ? candidate : SITE_THUMBNAIL;
};

const filterKeys = ['all', 'temple', 'idol', 'festivals', 'events', 'nature'];

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

const VIDEO_REGEX = /\.(mp4|webm|ogg|mov)(\?.*)?$/i;
const normalizeMediaUrl = (url = '') => {
  const sanitized = (url ?? '').replace(/\+/g, '%20');
  return sanitized.includes('?') ? `${sanitized}&v=2` : `${sanitized}?v=2`;
};
const isVideo = (url = '') => VIDEO_REGEX.test(url);

export default function Gallery() {
  const { t, lang } = useLang();
  const fn = lang === 'hi' ? 'font-noto' : '';
  const [activeFilter, setActiveFilter] = useState(t('gallery.filter.all'));
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const [galleryItems, setGalleryItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchImages();
  }, [activeFilter]);

  // Inject VideoObject JSON-LD structured data for all loaded videos so
  // Google can discover and index them (SPA pages aren't crawled for <video> tags).
  const jsonLdRef = useRef(null);
  useEffect(() => {
    const videos = galleryItems.filter(item => isVideo(item.url));
    if (jsonLdRef.current) {
      jsonLdRef.current.remove();
      jsonLdRef.current = null;
    }
    if (videos.length === 0) return;

    const schema = {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: `${SITE_NAME} — Video Gallery`,
      url: `${DOMAIN}/gallery`,
      numberOfItems: videos.length,
      itemListElement: videos.map((v, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        item: {
          '@type': 'VideoObject',
          name: v.title || v.category || 'Jain Tirth Video',
          description: v.altText
            ? v.altText
            : `${v.category} video from ${SITE_NAME}. A sacred Jain pilgrimage site in Madhya Pradesh, India.`,
          thumbnailUrl: deriveThumbnail(v.url),
          contentUrl: (v.url || '').split('?')[0],
          uploadDate: new Date(v.uploadedAt).toISOString(),
          embedUrl: `${DOMAIN}/gallery`,
          publisher: {
            '@type': 'Organization',
            name: SITE_NAME,
            url: DOMAIN,
            logo: {
              '@type': 'ImageObject',
              url: `${DOMAIN}/favicon.svg`,
            },
          },
          isFamilyFriendly: true,
          inLanguage: ['hi', 'en'],
          regionsAllowed: 'IN',
        },
      })),
    };

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(schema);
    document.head.appendChild(script);
    jsonLdRef.current = script;

    return () => {
      if (jsonLdRef.current) {
        jsonLdRef.current.remove();
        jsonLdRef.current = null;
      }
    };
  }, [galleryItems]);

  const fetchImages = async () => {
    setLoading(true);
    try {
      // Map translated filter back to API category
      const categoryMap = {
        [t('gallery.filter.all')]: 'All',
        [t('gallery.filter.temple')]: 'Temple',
        [t('gallery.filter.idol')]: 'Idol',
        [t('gallery.filter.festivals')]: 'Festivals',
        [t('gallery.filter.events')]: 'Events',
        [t('gallery.filter.nature')]: 'Nature'
      };
      const apiCategory = categoryMap[activeFilter] || 'All';
      const data = await getImages(apiCategory);
      // Give each an alternating aspect ratio to maintain masonry feel (images only)
      const itemsWithAspect = data.map((item, i) => ({
        ...item,
        url: normalizeMediaUrl(item.url),
        aspectRatio: i % 3 === 0 ? 'aspect-square' : i % 2 === 0 ? 'aspect-video' : 'aspect-[3/4]'
      }));
      setGalleryItems(itemsWithAspect);
    } catch (error) {
      console.error("Failed to fetch images", error);
    } finally {
      setLoading(false);
    }
  };

  const openLightbox = (index) => {
    setLightboxIndex(index);
  };
  const closeLightbox = () => setLightboxIndex(null);
  const prevImage = (e) => { if (e) e.stopPropagation(); setLightboxIndex(prev => prev > 0 ? prev - 1 : galleryItems.length - 1); };
  const nextImage = (e) => { if (e) e.stopPropagation(); setLightboxIndex(prev => prev < galleryItems.length - 1 ? prev + 1 : 0); };
  const currentItem = lightboxIndex !== null ? galleryItems[lightboxIndex] : null;

  // Keyboard Navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (lightboxIndex === null) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') prevImage();
      if (e.key === 'ArrowRight') nextImage();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxIndex, galleryItems.length]);

  // Lock body scroll when lightbox is open
  useEffect(() => {
    if (lightboxIndex !== null) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [lightboxIndex]);

  return (
    <div className="w-full pt-20 bg-bg-section min-h-screen">
      <Helmet>
        <title>Gallery – Temple Images &amp; Videos | Avadhpuri Parasali Jain Tirth</title>
        <meta name="description" content="Browse the photo and video gallery of Avadhpuri Parasali Jain Tirth – featuring the temple, idols, festivals, events, and the natural surroundings of this sacred Jain pilgrimage site." />
        <link rel="canonical" href="https://pjpt.org/gallery" />
        <meta property="og:title" content="Gallery – Temple Images &amp; Videos | Avadhpuri Parasali Jain Tirth" />
        <meta property="og:description" content="Browse photos and videos of Avadhpuri Parasali Jain Tirth – temple, idols, festivals, and events at this sacred Jain pilgrimage site in Madhya Pradesh." />
        <meta property="og:url" content="https://pjpt.org/gallery" />
        <meta property="og:type" content="website" />
      </Helmet>

      {/* Header */}
      <section className="py-16 px-4 text-center">
        <motion.h1 initial="hidden" animate="visible" variants={fadeUp} className={`font-cinzel text-4xl md:text-5xl text-gold-primary mb-6 uppercase tracking-wide ${fn}`}>
          {t('gallery.title')}
        </motion.h1>
        <motion.p initial="hidden" animate="visible" variants={fadeUp} className={`font-cormorant text-xl text-text-muted max-w-2xl mx-auto ${fn}`}>
          {t('gallery.subtitle')}
        </motion.p>
      </section>

      {/* Filters */}
      <section className="px-4 mb-12">
        <div className="flex flex-wrap justify-center gap-4 max-w-[1000px] mx-auto">
          {filterKeys.map(key => {
            const label = t(`gallery.filter.${key}`);
            return (
              <button
                key={key}
                onClick={() => setActiveFilter(label)}
                className={`font-cinzel text-sm uppercase tracking-wider px-6 py-2 border transition-all duration-300 ${
                  activeFilter === label
                    ? 'border-gold-primary bg-gold-primary text-white'
                    : 'border-gold-light text-text-dark hover:border-gold-primary hover:text-gold-primary bg-white'
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>
      </section>

      {/* Masonry Grid or Empty State */}
      <section className="px-4 pb-24 max-w-[1200px] mx-auto min-h-[40vh]">
        {loading ? (
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div 
                key={i} 
                className={`w-full ${i % 3 === 0 ? 'aspect-square' : i % 2 === 0 ? 'aspect-video' : 'aspect-[3/4]'} bg-white border border-gold-light animate-pulse flex items-center justify-center break-inside-avoid mb-6`}
              >
                <div className="w-1/3 h-1/3 text-gold-primary opacity-20">
                  <LotusWatermark opacity={1} />
                </div>
              </div>
            ))}
          </div>
        ) : galleryItems.length > 0 ? (
          <motion.div layout className="columns-1 sm:columns-2 lg:columns-3 gap-6">
            <AnimatePresence>
              {galleryItems.map((item, index) => {
                const videoItem = isVideo(item.url);
                const ratioClass = videoItem ? '' : item.aspectRatio;
                return (
                  <motion.div
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                    key={item._id}
                    className="break-inside-avoid mb-6 inline-block w-full"
                  >
                    <div 
                      className={`relative w-full ${ratioClass} bg-white border border-gold-light overflow-hidden group cursor-pointer shadow-sm hover:shadow-lg transition-all duration-300`}
                      onClick={() => openLightbox(index)}
                    >
                      {videoItem ? (
                        <div className="relative w-full aspect-video bg-black overflow-hidden">
                          <video
                            src={item.url}
                            className="w-full h-full object-contain"
                            preload="metadata"
                            playsInline
                            onContextMenu={e => e.preventDefault()}
                          />
                          <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/50 transition-colors duration-300">
                            <div className="w-14 h-14 rounded-full bg-gold-primary/80 flex items-center justify-center text-white">
                              <svg viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7 ml-1"><path d="M8 5v14l11-7z"/></svg>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <img
                          src={item.url}
                          alt={item.altText || item.title}
                          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                          onContextMenu={e => e.preventDefault()}
                          onDragStart={e => e.preventDefault()}
                        />
                      )}
                      
                      {/* Hover Overlay */}
                      {!videoItem && (
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center pointer-events-none">
                          <ZoomIn className="text-white mb-2" size={32} />
                          <span className="font-cinzel text-white tracking-widest text-sm">{item.category}</span>
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>
        ) : (
          <div className="flex flex-col items-center justify-center pt-12 pb-24 text-center">
            <div className="w-32 h-32 text-gold-primary opacity-30 mb-6">
              <LotusWatermark opacity={1} />
            </div>
            <p className={`font-cormorant italic text-2xl text-gold-primary max-w-md mx-auto ${fn}`}>
              {activeFilter === t('gallery.filter.all')
                ? t('gallery.empty.all')
                : t('gallery.empty.filter').replace('%filter%', activeFilter)}
            </p>
          </div>
        )}
      </section>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {lightboxIndex !== null && galleryItems.length > 0 && currentItem && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4"
            onClick={closeLightbox}
          >
            <button onClick={closeLightbox} className="absolute top-6 right-6 text-white hover:text-gold-light transition z-10">
              <X size={36} />
            </button>
            
            <button onClick={prevImage} className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:text-gold-light p-2 transition z-10">
              <ChevronLeft size={48} />
            </button>
            <button onClick={nextImage} className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-gold-light p-2 transition z-10">
              <ChevronRight size={48} />
            </button>

            {(() => {
              const currentIsVideo = isVideo(currentItem.url);
              const modalRatio = currentIsVideo ? '' : currentItem.aspectRatio;
              return (
                <motion.div
                  key={currentItem._id}
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  className={`relative bg-black w-full max-w-5xl ${modalRatio} ${currentIsVideo ? '' : 'min-h-[50vh]'} flex flex-col border border-gold-primary/30 overflow-hidden`}
                  onClick={e => e.stopPropagation()}
                >
                  {currentIsVideo ? (
                <>
                  <VideoPlayer
                    src={currentItem.url}
                    className="w-full object-contain"
                    style={{ maxHeight: 'calc(85vh - 72px)' }}
                    autoPlay
                  />
                  <div className="bg-black/70 backdrop-blur p-4 text-center shrink-0">
                    <h3 className="font-cinzel text-xl text-white uppercase tracking-wide">{currentItem.title}</h3>
                    <p className="font-cormorant text-gold-light mt-1">{t('gallery.category')}: {currentItem.category}</p>
                  </div>
                </>
              ) : (
                <img
                  src={currentItem.url}
                  alt={currentItem.altText || currentItem.title}
                  className="w-full h-full object-contain"
                  onContextMenu={e => e.preventDefault()}
                  onDragStart={e => e.preventDefault()}
                />
              )}
              {!currentIsVideo && (
                <div className="absolute bottom-0 inset-x-0 bg-black/70 backdrop-blur p-4 text-center">
                  <h3 className="font-cinzel text-xl text-white uppercase tracking-wide">{currentItem.title}</h3>
                  <p className="font-cormorant text-gold-light mt-1">{t('gallery.category')}: {currentItem.category}</p>
                </div>
              )}
                </motion.div>
              );
            })()}
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
