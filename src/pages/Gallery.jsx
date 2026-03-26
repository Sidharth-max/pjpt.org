import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react';
import LotusWatermark from '../components/LotusWatermark';
import { getImages } from '../services/api';

const filters = ['All', 'Temple', 'Idol', 'Festivals', 'Events', 'Nature'];

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

export default function Gallery() {
  const [activeFilter, setActiveFilter] = useState('All');
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const [galleryItems, setGalleryItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchImages();
  }, [activeFilter]);

  const fetchImages = async () => {
    setLoading(true);
    try {
      const data = await getImages(activeFilter);
      // Give each an alternating aspect ratio to maintain masonry feel
      const itemsWithAspect = data.map((item, i) => ({
        ...item,
        aspectRatio: i % 3 === 0 ? 'aspect-square' : i % 2 === 0 ? 'aspect-video' : 'aspect-[3/4]'
      }));
      setGalleryItems(itemsWithAspect);
    } catch (error) {
      console.error("Failed to fetch images", error);
    } finally {
      setLoading(false);
    }
  };

  const openLightbox = (index) => setLightboxIndex(index);
  const closeLightbox = () => setLightboxIndex(null);
  const prevImage = (e) => { e.stopPropagation(); setLightboxIndex(prev => prev > 0 ? prev - 1 : galleryItems.length - 1); };
  const nextImage = (e) => { e.stopPropagation(); setLightboxIndex(prev => prev < galleryItems.length - 1 ? prev + 1 : 0); };

  return (
    <div className="w-full pt-20 bg-bg-section min-h-screen">
      
      {/* Header */}
      <section className="py-16 px-4 text-center">
        <motion.h1 initial="hidden" animate="visible" variants={fadeUp} className="font-cinzel text-4xl md:text-5xl text-gold-primary mb-6 uppercase tracking-wide">
          Divine Gallery
        </motion.h1>
        <motion.p initial="hidden" animate="visible" variants={fadeUp} className="font-cormorant text-xl text-text-muted max-w-2xl mx-auto">
          Experience the serene beauty, ancient architecture, and vibrant festivals of AVADHPURI PARASALI JAIN TIRTH.
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
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div 
                key={i} 
                className={`w-full ${i % 3 === 0 ? 'aspect-square' : i % 2 === 0 ? 'aspect-video' : 'aspect-[3/4]'} bg-white border border-gold-light animate-pulse flex items-center justify-center`}
              >
                <div className="w-1/3 h-1/3 text-gold-primary opacity-20">
                  <LotusWatermark opacity={1} />
                </div>
              </div>
            ))}
          </div>
        ) : galleryItems.length > 0 ? (
          <motion.div layout className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
            <AnimatePresence>
              {galleryItems.map((item, index) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  key={item._id}
                  className="break-inside-avoid"
                >
                  <div 
                    className={`relative w-full ${item.aspectRatio} bg-white border border-gold-light overflow-hidden group cursor-pointer shadow-sm hover:shadow-lg transition-all duration-300`}
                    onClick={() => openLightbox(index)}
                  >
                    {item.url.match(/\.(mp4|webm|ogg|mov)$/i) ? (
                      <video 
                        src={item.url} 
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                        muted loop playsInline autoPlay
                      />
                    ) : (
                      <img 
                        src={item.url} 
                        alt={item.title} 
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                      />
                    )}
                    
                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center pointer-events-none">
                      <ZoomIn className="text-white mb-2" size={32} />
                      <span className="font-cinzel text-white tracking-widest text-sm">{item.category}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          <div className="flex flex-col items-center justify-center pt-12 pb-24 text-center">
            <div className="w-32 h-32 text-gold-primary opacity-30 mb-6">
              <LotusWatermark opacity={1} />
            </div>
            <p className="font-cormorant italic text-2xl text-gold-primary max-w-md mx-auto">
              Gallery coming soon. Check back after Pratishtha Mahotsav 2025.
            </p>
          </div>
        )}
      </section>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {lightboxIndex !== null && galleryItems.length > 0 && (
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

            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className={`relative bg-black w-full max-w-5xl max-h-[85vh] ${galleryItems[lightboxIndex].aspectRatio} min-h-[50vh] flex flex-col border border-gold-primary/30`}
              onClick={e => e.stopPropagation()}
            >
              {galleryItems[lightboxIndex].url.match(/\.(mp4|webm|ogg|mov)$/i) ? (
                <video 
                  src={galleryItems[lightboxIndex].url}
                  className="w-full h-full object-contain" 
                  controls autoPlay
                />
              ) : (
                <img 
                  src={galleryItems[lightboxIndex].url} 
                  alt={galleryItems[lightboxIndex].title} 
                  className="w-full h-full object-contain" 
                />
              )}
              <div className="absolute bottom-0 inset-x-0 bg-black/70 backdrop-blur p-4 text-center">
                <h3 className="font-cinzel text-xl text-white uppercase tracking-wide">{galleryItems[lightboxIndex].title}</h3>
                <p className="font-cormorant text-gold-light mt-1">Category: {galleryItems[lightboxIndex].category}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
