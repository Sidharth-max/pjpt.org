import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react';
import LotusWatermark from '../components/LotusWatermark';
import VideoPlayer from '../components/VideoPlayer';
import { getImages } from '../services/api';
import { useLang } from '../contexts/LanguageContext';

const filters = ['All', 'Temple', 'Idol', 'Festivals', 'Events', 'Nature'];

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
  const [activeFilter, setActiveFilter] = useState('All');
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const [galleryItems, setGalleryItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [playingVideos, setPlayingVideos] = useState({});
  const videoRefs = useRef({});

  useEffect(() => {
    fetchImages();
  }, [activeFilter]);

  const fetchImages = async () => {
    setLoading(true);
    try {
      const data = await getImages(activeFilter);
      // Give each an alternating aspect ratio to maintain masonry feel (images only)
      const itemsWithAspect = data.map((item, i) => ({
        ...item,
        url: normalizeMediaUrl(item.url),
        aspectRatio: i % 3 === 0 ? 'aspect-square' : i % 2 === 0 ? 'aspect-video' : 'aspect-[3/4]'
      }));
      setGalleryItems(itemsWithAspect);
      setPlayingVideos({});
    } catch (error) {
      console.error("Failed to fetch images", error);
    } finally {
      setLoading(false);
    }
  };

  const pauseVideo = (id) => {
    const node = videoRefs.current[id];
    if (node && !node.paused) {
      node.pause();
    }
    setPlayingVideos(prev => {
      if (prev[id] === false) return prev;
      return { ...prev, [id]: false };
    });
  };

  const openLightbox = (index) => {
    // Pause all currently playing background videos
    Object.keys(playingVideos).forEach(id => {
      if (playingVideos[id]) pauseVideo(id);
    });
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

  const toggleVideoPlayback = (event, id) => {
    event.stopPropagation();
    const node = videoRefs.current[id];
    if (!node) return;
    
    if (node.paused) {
      const playPromise = node.play();
      if (playPromise !== undefined) {
        playPromise.then(() => {
          setPlayingVideos(prev => ({ ...prev, [id]: true }));
        }).catch(error => {
          console.error("Video play was interrupted:", error);
          setPlayingVideos(prev => ({ ...prev, [id]: false }));
        });
      } else {
        setPlayingVideos(prev => ({ ...prev, [id]: true }));
      }
    } else {
      node.pause();
      setPlayingVideos(prev => ({ ...prev, [id]: false }));
    }
  };

  return (
    <div className="w-full pt-20 bg-bg-section min-h-screen">
      
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
          {filters.map(filter => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`font-cinzel text-sm uppercase tracking-wider px-6 py-2 border transition-all duration-300 ${
                activeFilter === filter 
                  ? 'border-gold-primary bg-gold-primary text-white' 
                  : 'border-gold-light text-text-dark hover:border-gold-primary hover:text-gold-primary bg-white'
              }`}
            >
              {filter}
            </button>
          ))}
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
                        <div className="relative w-full aspect-video bg-black flex items-center justify-center" onClick={e => e.stopPropagation()}>
                          <VideoPlayer
                            ref={node => {
                              if (node) {
                                videoRefs.current[item._id] = node;
                              } else {
                                delete videoRefs.current[item._id];
                              }
                            }}
                            src={item.url}
                            className="w-full h-full max-h-[460px] object-contain"
                            onEnded={() => pauseVideo(item._id)}
                          />
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
              {activeFilter === 'All'
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
            className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-sm flex items-center justify-center p-4"
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
                  />
                  <div className="bg-black/70 backdrop-blur p-4 text-center shrink-0">
                    <h3 className="font-cinzel text-xl text-white uppercase tracking-wide">{currentItem.title}</h3>
                    <p className="font-cormorant text-gold-light mt-1">Category: {currentItem.category}</p>
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
                  <p className="font-cormorant text-gold-light mt-1">Category: {currentItem.category}</p>
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
