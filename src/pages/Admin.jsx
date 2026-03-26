import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, CheckCircle2, AlertTriangle, XCircle, Copy, Eye, Filter, Search, Trash2, Check, Image as ImageIcon, Video as VideoIcon, UploadCloud } from 'lucide-react';
import { getImages, uploadImage, deleteImage, getEvents, createEvent, updateEvent, deleteEvent, getMessages, deleteMessage } from '../services/api';

const formatBytes = (bytes = 0) => {
  if (!bytes) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB'];
  const power = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  const value = bytes / Math.pow(1024, power);
  return `${value.toFixed(value >= 10 ? 0 : 1)} ${units[power]}`;
};

const formatDuration = (seconds = 0) => {
  if (!seconds || !isFinite(seconds)) return '—';
  if (seconds < 1) return '<1s';
  const mins = Math.floor(seconds / 60);
  const secs = Math.round(seconds % 60);
  return mins > 0 ? `${mins}m ${secs.toString().padStart(2, '0')}s` : `${secs}s`;
};

const VIDEO_EXTENSIONS = /\.(mp4|webm|ogg|mov)$/i;
const GALLERY_CATEGORIES = ['All', 'Temple', 'Idol', 'Festivals', 'Events', 'Nature'];

const formatDateLabel = (dateString) => {
  if (!dateString) return '—';
  try {
    return new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  } catch (error) {
    console.error('Invalid date provided to formatDateLabel:', error);
    return '—';
  }
};

export default function Admin() {
  const [auth, setAuth] = useState(false);
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState('gallery');

  const [images, setImages] = useState([]);
  const [imgForm, setImgForm] = useState({ title: '', category: 'Temple' });
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploadingImg, setUploadingImg] = useState(false);
  const [activeUploads, setActiveUploads] = useState([]);
  const [galleryFilters, setGalleryFilters] = useState({ category: 'All', search: '', sort: 'newest', mediaType: 'all' });
  const [galleryLoading, setGalleryLoading] = useState(false);
  const [galleryError, setGalleryError] = useState('');
  const [copiedImageId, setCopiedImageId] = useState(null);
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedImageIds, setSelectedImageIds] = useState([]);
  const [bulkDeleting, setBulkDeleting] = useState(false);
  const uploadControllers = useRef(new Map());
  const removalTimers = useRef(new Map());
  const fileInputRef = useRef(null);
  const copyTimerRef = useRef(null);

  const [events, setEvents] = useState([]);
  const [messages, setMessages] = useState([]);
  const [eventForm, setEventForm] = useState({ id: null, title: '', date: '', description: '', category: '', isFeatured: false, file: null });
  const [uploadingEvent, setUploadingEvent] = useState(false);
  const [notification, setNotification] = useState('');
  
  // Custom Alert / Confirm Modal State
  const [dialogState, setDialogState] = useState({ 
    isOpen: false, 
    type: 'alert', // 'alert' | 'confirm'
    title: '', 
    message: '', 
    onConfirm: null 
  });

  const adminPass = import.meta.env.VITE_ADMIN_PASSWORD;
  const allowMediaDelete = import.meta.env.VITE_ALLOW_MEDIA_DELETE === 'true';

  useEffect(() => {
    if (auth) {
      fetchImages();
      fetchEvents();
      fetchMessages();
    }
  }, [auth]);

  useEffect(() => {
    return () => {
      uploadControllers.current.forEach(controller => controller.abort());
      removalTimers.current.forEach(timer => clearTimeout(timer));
      if (copyTimerRef.current) clearTimeout(copyTimerRef.current);
    };
  }, []);

  useEffect(() => {
    if (!isSelectionMode && selectedImageIds.length) {
      setSelectedImageIds([]);
    }
  }, [isSelectionMode, selectedImageIds.length]);

  useEffect(() => {
    setSelectedImageIds(prev => prev.filter(id => images.some(img => img._id === id)));
  }, [images]);

  const showToast = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(''), 3000);
  };

  const showAlert = (message, title = 'Attention') => {
    setDialogState({ isOpen: true, type: 'alert', title, message, onConfirm: null });
  };

  const showConfirm = (message, onConfirm, title = 'Confirm Action') => {
    setDialogState({ isOpen: true, type: 'confirm', title, message, onConfirm });
  };

  const closeDialog = () => {
    setDialogState(prev => ({ ...prev, isOpen: false }));
  };

  const getStatusMeta = (status) => {
    switch (status) {
      case 'completed':
        return { label: 'Completed', color: 'text-green-600', icon: <CheckCircle2 size={18} /> };
      case 'canceled':
        return { label: 'Cancelled', color: 'text-text-muted', icon: <XCircle size={18} /> };
      case 'error':
        return { label: 'Failed', color: 'text-red-500', icon: <AlertTriangle size={18} /> };
      default:
        return { label: 'Uploading', color: 'text-gold-primary', icon: <Loader2 size={18} className="animate-spin" /> };
    }
  };

  const updateUploadState = (uploadId, updates) => {
    setActiveUploads(prev => prev.map(upload => upload.id === uploadId ? { ...upload, ...updates } : upload));
  };

  const scheduleUploadRemoval = (uploadId, delay = 4000) => {
    if (removalTimers.current.has(uploadId)) {
      clearTimeout(removalTimers.current.get(uploadId));
    }
    const timer = setTimeout(() => {
      setActiveUploads(prev => prev.filter(upload => upload.id !== uploadId));
      removalTimers.current.delete(uploadId);
    }, delay);
    removalTimers.current.set(uploadId, timer);
  };

  const cancelUpload = (uploadId) => {
    const controller = uploadControllers.current.get(uploadId);
    if (controller) controller.abort();
  };

  const cancelAllUploads = () => {
    uploadControllers.current.forEach(controller => controller.abort());
  };

  const filteredImages = useMemo(() => {
    const query = galleryFilters.search.trim().toLowerCase();
    const base = images.filter(img => {
      const categoryMatch = galleryFilters.category === 'All' || img.category === galleryFilters.category;
      const isVideo = VIDEO_EXTENSIONS.test(img.url || '');
      const mediaMatch =
        galleryFilters.mediaType === 'all' ||
        (galleryFilters.mediaType === 'videos' && isVideo) ||
        (galleryFilters.mediaType === 'images' && !isVideo);
      const searchMatch =
        !query ||
        (img.title || '').toLowerCase().includes(query) ||
        (img.category || '').toLowerCase().includes(query);
      return categoryMatch && mediaMatch && searchMatch;
    });

    return base.sort((a, b) => {
      const aTime = Date.parse(a.uploadedAt || '') || 0;
      const bTime = Date.parse(b.uploadedAt || '') || 0;
      switch (galleryFilters.sort) {
        case 'oldest':
          return aTime - bTime;
        case 'title-asc':
          return (a.title || '').localeCompare(b.title || '');
        case 'title-desc':
          return (b.title || '').localeCompare(a.title || '');
        default:
          return bTime - aTime;
      }
    });
  }, [images, galleryFilters]);

  const galleryStats = useMemo(() => {
    const total = images.length;
    let videos = 0;
    images.forEach(img => {
      if (VIDEO_EXTENSIONS.test(img.url || '')) videos += 1;
    });
    const photos = Math.max(total - videos, 0);
    const latestTimestamp = images.reduce((latest, img) => {
      const timestamp = Date.parse(img.uploadedAt || '') || 0;
      return timestamp > latest ? timestamp : latest;
    }, 0);

    const perCategory = GALLERY_CATEGORIES.filter(category => category !== 'All').map(category => ({
      category,
      count: images.filter(img => img.category === category).length
    }));

    return {
      total,
      videos,
      photos,
      latestUpload: latestTimestamp ? new Date(latestTimestamp) : null,
      perCategory
    };
  }, [images]);

  const selectionCount = selectedImageIds.length;

  const fetchMessages = async () => {
    try {
      const data = await getMessages();
      setMessages(data);
    } catch (err) {
      console.error(err);
      showAlert('Unable to load contact form submissions right now. Please refresh and try again.', 'Messages Error');
    }
  };

  const fetchImages = async () => {
    try {
      setGalleryLoading(true);
      setGalleryError('');
      const data = await getImages('All');
      setImages(data);
    } catch (err) {
      console.error(err);
      setGalleryError('Unable to load media items. Please retry once your connection is stable.');
      showAlert('Unable to load the gallery items. Please retry after a moment.', 'Gallery Error');
    } finally {
      setGalleryLoading(false);
    }
  };

  const fetchEvents = async () => {
    try {
      const data = await getEvents();
      setEvents(data);
    } catch (err) {
      console.error(err);
      showAlert('Unable to load events at this moment. Please refresh and try again.', 'Events Error');
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === adminPass) setAuth(true);
    else showAlert('Incorrect password. Please try again.', 'Authentication Failed');
  };

  const generateFileKey = (file) => `${file.name}-${file.lastModified}-${file.size}`;

  const handleFileSelection = (filesList) => {
    const incoming = Array.from(filesList || []);
    if (!incoming.length) return;
    setSelectedFiles(prev => {
      const existingKeys = new Set(prev.map(generateFileKey));
      const merged = [...prev];
      incoming.forEach(file => {
        const key = generateFileKey(file);
        if (!existingKeys.has(key)) {
          merged.push(file);
          existingKeys.add(key);
        }
      });
      return merged;
    });
  };

  const handleFileInputChange = (event) => {
    handleFileSelection(event.target.files);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleDropFiles = (event) => {
    event.preventDefault();
    handleFileSelection(event.dataTransfer.files);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'copy';
  };

  const removeSelectedFile = (fileKey) => {
    setSelectedFiles(prev => prev.filter(file => generateFileKey(file) !== fileKey));
  };

  const clearSelectedFiles = () => {
    setSelectedFiles([]);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const enableSelectionMode = () => {
    if (!allowMediaDelete) {
      showAlert('Media deletion is disabled in this environment configurations.', 'Action Blocked');
      return;
    }
    setIsSelectionMode(true);
  };

  const exitSelectionMode = () => {
    setIsSelectionMode(false);
    setSelectedImageIds([]);
  };

  const toggleImageSelection = (imageId) => {
    setSelectedImageIds(prev => (
      prev.includes(imageId)
        ? prev.filter(id => id !== imageId)
        : [...prev, imageId]
    ));
  };

  const selectAllFiltered = () => {
    if (!allowMediaDelete) {
      showAlert('Media deletion is disabled in this environment configurations.', 'Action Blocked');
      return;
    }
    if (!isSelectionMode) setIsSelectionMode(true);
    setSelectedImageIds(filteredImages.map(img => img._id));
  };

  const handleBulkDelete = () => {
    if (!allowMediaDelete) {
      showAlert('Media deletion is disabled in this environment configurations.', 'Action Blocked');
      return;
    }
    if (selectedImageIds.length === 0) {
      showAlert('Please select at least one media item to delete.', 'No Media Selected');
      return;
    }

    showConfirm(
      `Are you sure you want to delete ${selectedImageIds.length} media item${selectedImageIds.length > 1 ? 's' : ''}? This action cannot be undone.`,
      async () => {
        try {
          setBulkDeleting(true);
          const ids = [...selectedImageIds];
          const results = await Promise.allSettled(ids.map(id => deleteImage(id)));
          const successes = results.filter(result => result.status === 'fulfilled').length;
          const failures = ids.length - successes;

          if (successes) {
            showToast(successes > 1 ? 'Selected media deleted successfully' : 'Media deleted successfully');
            await fetchImages();
          }

          if (failures) {
            showAlert('Some media could not be deleted. Please try again.', 'Partial Deletion');
          }
        } catch (error) {
          console.error(error);
          showAlert('Failed to delete the selected media. Please try again.', 'Deletion Failed');
        } finally {
          setBulkDeleting(false);
          exitSelectionMode();
        }
      },
      'Delete Selected Media'
    );
  };

  // Gallery Handlers
  const handleImageUpload = async (e) => {
    e.preventDefault();
    const files = [...selectedFiles];
    if (!files.length || !imgForm.title) return showAlert('Please select file(s) and provide a title before uploading.', 'Missing Requirements');
    setUploadingImg(true);

    const uploadTasks = files.map((file, index) => {
      const uploadId = `${file.name}-${Date.now()}-${index}`;
      const controller = new AbortController();
      const startedAt = Date.now();

      uploadControllers.current.set(uploadId, controller);
      setActiveUploads(prev => ([
        ...prev,
        {
          id: uploadId,
          name: file.name,
          size: file.size,
          category: imgForm.category,
          progress: 0,
          eta: 'Calculating…',
          status: 'uploading'
        }
      ]));

      const fd = new FormData();
      fd.append('title', files.length > 1 ? `${imgForm.title} - ${file.name}` : imgForm.title);
      fd.append('category', imgForm.category);
      fd.append('file', file);

      return uploadImage(fd, {
        signal: controller.signal,
        onUploadProgress: (event) => {
          if (!event.total) return;
          const progress = Math.round((event.loaded / event.total) * 100);
          const elapsedSeconds = (Date.now() - startedAt) / 1000;
          const speed = event.loaded / Math.max(elapsedSeconds, 0.001);
          const remainingSeconds = speed > 0 ? (event.total - event.loaded) / speed : 0;
          updateUploadState(uploadId, {
            progress,
            eta: remainingSeconds ? `${formatDuration(remainingSeconds)} remaining` : 'Finishing…'
          });
        }
      })
        .then(() => {
          updateUploadState(uploadId, { progress: 100, eta: 'Completed', status: 'completed' });
          scheduleUploadRemoval(uploadId);
          return true;
        })
        .catch(error => {
          if (controller.signal.aborted) {
            updateUploadState(uploadId, { status: 'canceled', eta: 'Cancelled' });
            scheduleUploadRemoval(uploadId);
            return 'aborted';
          }
          updateUploadState(uploadId, { status: 'error', eta: 'Failed' });
          scheduleUploadRemoval(uploadId);
          throw error;
        })
        .finally(() => {
          uploadControllers.current.delete(uploadId);
        });
    });

    try {
      const results = await Promise.allSettled(uploadTasks);
      const hasFailure = results.some(result => result.status === 'rejected');
      const successfulUploads = results.filter(result => result.status === 'fulfilled' && result.value === true).length;

      if (successfulUploads > 0) {
        showToast(successfulUploads > 1 ? 'Media files uploaded successfully' : 'Media uploaded successfully');
        setImgForm({ title: '', category: 'Temple' });
        clearSelectedFiles();
        fetchImages();
      }

      if (hasFailure) {
        showAlert('Some uploads failed. Please clearly check your network and try again.', 'Upload Incomplete');
      }
    } catch (err) {
      showAlert('A critical error occurred while trying to upload media.', 'Upload Failed');
    } finally {
      setUploadingImg(false);
    }
  };

  const handleImageDelete = async (id) => {
    if (!allowMediaDelete) {
      showAlert('Media deletion is disabled in this environment configurations.', 'Action Blocked');
      return;
    }
    
    showConfirm('Are you sure you want to delete this image? This action cannot be undone.', async () => {
      try {
        await deleteImage(id);
        showToast('Image deleted successfully');
        fetchImages();
      } catch (err) {
        showAlert('Failed to delete the image. Please try again.', 'Error');
      }
    });
  };

  const handleCopyImageUrl = async (image) => {
    try {
      if (!navigator?.clipboard) throw new Error('Clipboard API unavailable');
      await navigator.clipboard.writeText(image.url);
      if (copyTimerRef.current) clearTimeout(copyTimerRef.current);
      setCopiedImageId(image._id);
      copyTimerRef.current = setTimeout(() => setCopiedImageId(null), 2000);
      showToast('Media link copied to clipboard');
    } catch (err) {
      console.error(err);
      showAlert('Unable to copy the media link automatically. Please copy it manually instead.', 'Copy Failed');
    }
  };

  const handleOpenMedia = (url) => {
    if (!url) return;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const updateGalleryFilter = (key, value) => {
    setGalleryFilters(prev => ({ ...prev, [key]: value }));
  };

  const resetGalleryFilters = () => {
    setGalleryFilters({ category: 'All', search: '', sort: 'newest', mediaType: 'all' });
  };

  // Event Handlers
  const handleEventSubmit = async (e) => {
    e.preventDefault();
    if (!eventForm.title || !eventForm.date || !eventForm.description) return showAlert('Please fill out the title, date, and description fields.', 'Missing Information');
    setUploadingEvent(true);
    
    const fd = new FormData();
    fd.append('title', eventForm.title);
    fd.append('date', eventForm.date);
    fd.append('description', eventForm.description);
    fd.append('category', eventForm.category);
    fd.append('isFeatured', eventForm.isFeatured);
    if (eventForm.file) fd.append('image', eventForm.file);

    try {
      if (eventForm.id) {
        await updateEvent(eventForm.id, fd);
        showToast('Event updated successfully');
      } else {
        await createEvent(fd);
        showToast('Event created successfully');
      }
      setEventForm({ id: null, title: '', date: '', description: '', category: '', isFeatured: false, file: null });
      fetchEvents();
    } catch (err) {
      showAlert('Failed to save the event. Please try again.', 'Error');
    } finally {
      setUploadingEvent(false);
    }
  };

  const handleEventDelete = async (id) => {
    showConfirm('Are you sure you want to delete this event? This action cannot be undone.', async () => {
      try {
        await deleteEvent(id);
        showToast('Event deleted successfully');
        fetchEvents();
      } catch (err) {
        showAlert('Failed to delete the event. Please try again.', 'Error');
      }
    });
  };

  const handleMessageDelete = async (id) => {
    showConfirm('Are you sure you want to delete this message? This action cannot be undone.', async () => {
      try {
        await deleteMessage(id);
        showToast('Message deleted successfully');
        fetchMessages();
      } catch (err) {
        showAlert('Failed to delete the message. Please try again.', 'Error');
      }
    });
  };

  const editEvent = (evt) => {
    setEventForm({
      id: evt._id,
      title: evt.title,
      date: evt.date,
      description: evt.description,
      category: evt.category || '',
      isFeatured: evt.isFeatured,
      file: null
    });
    setActiveTab('events');
    window.scrollTo(0, 0);
  };

  if (!auth) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-bg-section">
        <form onSubmit={handleLogin} className="card text-center max-w-sm w-full">
          <h2 className="font-cinzel text-2xl text-gold-primary mb-6">Admin Login</h2>
          <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} className="w-full bg-off-white border-b-2 border-gold-pale focus:border-gold-primary focus:outline-none p-3 font-cormorant text-lg mb-6" />
          <button type="submit" className="btn-gold w-full">Login</button>
        </form>
      </div>
    );
  }

  return (
    <div className="relative z-0 isolate min-h-screen overflow-hidden">
      <div className="w-full h-full overflow-y-auto pt-20 pb-32 bg-off-white">
        {notification && (
          <div className="fixed top-24 right-4 bg-green-500 text-white px-6 py-3 shadow-lg z-[9999] font-cormorant text-lg rounded-sm">
            {notification}
          </div>
        )}

        {/* Custom Dialog / Modal */}
        <AnimatePresence>
          {dialogState.isOpen && (
            <>
              <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9998]"
                onClick={closeDialog}
              />
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 20 }} 
                animate={{ opacity: 1, scale: 1, y: 0 }} 
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-sm bg-white border border-gold-light shadow-2xl z-[9999] p-6 overflow-hidden"
              >
                <div className="flex items-start mb-4">
                  <div className={`p-2 rounded-full mr-4 ${dialogState.type === 'alert' && dialogState.title.includes('Failed') ? 'bg-red-100 text-red-600' : 'bg-gold-pale text-gold-primary'}`}>
                    {dialogState.type === 'alert' && dialogState.title.includes('Failed') ? <AlertTriangle size={24} /> : <AlertTriangle size={24} />}
                  </div>
                  <div>
                    <h3 className="font-cinzel text-xl text-text-dark mb-1">{dialogState.title}</h3>
                    <p className="font-cormorant text-text-muted text-lg leading-snug">{dialogState.message}</p>
                  </div>
                </div>
                
                <div className="flex justify-end gap-3 mt-6">
                  {dialogState.type === 'confirm' && (
                    <button 
                      onClick={closeDialog}
                      className="px-5 py-2 font-cinzel text-sm border border-gold-light text-text-muted hover:bg-bg-section transition uppercase tracking-wide"
                    >
                      Cancel
                    </button>
                  )}
                  <button 
                    onClick={() => {
                      if (dialogState.onConfirm) dialogState.onConfirm();
                      closeDialog();
                    }}
                    className={`px-5 py-2 font-cinzel text-sm text-white transition uppercase tracking-wide
                      ${dialogState.type === 'confirm' ? 'bg-red-500 hover:bg-red-600' : 'bg-gold-primary hover:bg-gold-light'}`}
                  >
                    {dialogState.type === 'confirm' ? 'Confirm' : 'Okay'}
                  </button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

      <div className="max-w-[1200px] mx-auto px-4">
        <h1 className="font-cinzel text-4xl text-text-dark mb-8 uppercase tracking-wide">Admin Dashboard</h1>

        <div className="flex flex-wrap gap-4 mb-8">
          <button onClick={() => setActiveTab('gallery')} className={`font-cinzel uppercase px-6 py-2 transition-colors ${activeTab === 'gallery' ? 'bg-gold-primary text-white' : 'border border-gold-light text-text-dark bg-white'}`}>Gallery</button>
          <button onClick={() => setActiveTab('events')} className={`font-cinzel uppercase px-6 py-2 transition-colors ${activeTab === 'events' ? 'bg-gold-primary text-white' : 'border border-gold-light text-text-dark bg-white'}`}>Events</button>
          <button onClick={() => setActiveTab('messages')} className={`font-cinzel uppercase px-6 py-2 transition-colors ${activeTab === 'messages' ? 'bg-gold-primary text-white' : 'border border-gold-light text-text-dark bg-white'}`}>Messages</button>
        </div>

        {activeTab === 'gallery' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="bg-white p-8 border border-gold-light shadow-sm mb-12">
              <h2 className="font-cinzel text-2xl mb-6 text-gold-primary">Upload Media</h2>
              <form onSubmit={handleImageUpload} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="font-cinzel text-sm uppercase tracking-wide text-text-dark">Title Prefix</label>
                    <input
                      type="text"
                      value={imgForm.title}
                      onChange={e => setImgForm(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="e.g., Rath Yatra 2026"
                      className="w-full border border-gold-light px-4 py-2 font-cormorant text-lg bg-off-white/60 focus:outline-none focus:border-gold-primary"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="font-cinzel text-sm uppercase tracking-wide text-text-dark">Category</label>
                    <select
                      value={imgForm.category}
                      onChange={e => setImgForm(prev => ({ ...prev, category: e.target.value }))}
                      className="w-full border border-gold-light px-4 py-2 font-cormorant text-lg bg-off-white/60 focus:outline-none focus:border-gold-primary"
                    >
                      {GALLERY_CATEGORIES.filter(category => category !== 'All').map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div
                  onDrop={handleDropFiles}
                  onDragOver={handleDragOver}
                  className="border-2 border-dashed border-gold-light rounded-sm bg-bg-section/60 px-6 py-10 text-center transition hover:border-gold-primary"
                >
                  <div className="flex flex-col items-center gap-3">
                    <UploadCloud size={40} className="text-gold-primary" />
                    <p className="font-cinzel text-lg text-text-dark">Drag & drop media files here</p>
                    <p className="text-sm text-text-muted font-cormorant">JPG, PNG, WEBP or MP4 up to 40 MB each</p>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="btn-gold px-6 py-2"
                    >
                      Browse Files
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      accept="image/*,video/*"
                      onChange={handleFileInputChange}
                      className="hidden"
                    />
                  </div>
                </div>

                {selectedFiles.length > 0 && (
                  <div className="border border-gold-light bg-white rounded-sm p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <p className="font-cinzel text-sm text-text-dark uppercase tracking-wide">Selected Files ({selectedFiles.length})</p>
                        <p className="text-xs text-text-muted font-cormorant">Each file will inherit the title prefix above.</p>
                      </div>
                      <button type="button" onClick={clearSelectedFiles} className="text-xs font-cinzel uppercase tracking-wide text-red-500 hover:text-red-600">
                        Clear All
                      </button>
                    </div>
                    <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                      {selectedFiles.map(file => {
                        const fileKey = generateFileKey(file);
                        const isVideo = VIDEO_EXTENSIONS.test(file.type || file.name);
                        return (
                          <div key={fileKey} className="flex items-center justify-between gap-3 border border-gold-pale/60 bg-off-white px-3 py-2 rounded-sm">
                            <div className="flex items-center gap-3 min-w-0">
                              <span className={`w-8 h-8 rounded-full flex items-center justify-center ${isVideo ? 'bg-purple-100 text-purple-600' : 'bg-gold-pale text-gold-primary'}`}>
                                {isVideo ? <VideoIcon size={16} /> : <ImageIcon size={16} />}
                              </span>
                              <div className="min-w-0">
                                <p className="font-cinzel text-sm text-text-dark truncate" title={file.name}>{file.name}</p>
                                <p className="text-xs font-cormorant text-text-muted">{formatBytes(file.size)}</p>
                              </div>
                            </div>
                            <button type="button" onClick={() => removeSelectedFile(fileKey)} className="text-xs font-cinzel uppercase tracking-wide text-red-500 hover:text-red-600">
                              Remove
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                <div className="flex flex-wrap items-center gap-3">
                  <button
                    type="submit"
                    disabled={uploadingImg || selectedFiles.length === 0}
                    className="btn-gold px-6 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {uploadingImg ? 'Uploading…' : selectedFiles.length ? `Upload ${selectedFiles.length} File${selectedFiles.length > 1 ? 's' : ''}` : 'Upload Files'}
                  </button>
                  {selectedFiles.length > 0 && (
                    <button
                      type="button"
                      onClick={clearSelectedFiles}
                      className="text-xs font-cinzel uppercase tracking-wide border px-4 py-2 transition border-gold-light text-text-dark hover:bg-bg-section"
                    >
                      Clear Selection
                    </button>
                  )}
                  <p className="text-xs text-text-muted font-cormorant">Tip: You can mix images and videos in one batch.</p>
                </div>

                {activeUploads.length > 0 && (
                  <div className="border border-gold-light bg-white rounded-sm p-5 space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <p className="font-cinzel text-sm text-text-dark uppercase tracking-wide">Upload Queue</p>
                        <p className="text-xs text-text-muted font-cormorant">Tracking {activeUploads.length} file{activeUploads.length > 1 ? 's' : ''} in progress</p>
                      </div>
                      <button
                        type="button"
                        onClick={cancelAllUploads}
                        className="text-xs font-cinzel uppercase tracking-wide border px-3 py-1.5 transition border-red-300 text-red-500 hover:bg-red-50"
                      >
                        Cancel All
                      </button>
                    </div>
                    <div className="space-y-4">
                      <AnimatePresence initial={false}>
                        {activeUploads.map(upload => {
                          const statusMeta = getStatusMeta(upload.status);
                          return (
                            <motion.div
                              key={upload.id}
                              layout
                              initial={{ opacity: 0, y: 12 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -12 }}
                              className="border border-gold-pale/60 rounded-sm bg-bg-section p-3 shadow-sm"
                            >
                              <div className="flex flex-wrap items-center gap-3">
                                <div className="flex-1 min-w-[200px]">
                                  <p className="font-cinzel text-sm text-text-dark truncate" title={upload.name}>{upload.name}</p>
                                  <p className="text-xs font-cormorant text-text-muted">{formatBytes(upload.size)} • {upload.eta}</p>
                                </div>
                                <div className={`flex items-center gap-1 text-xs font-cinzel uppercase tracking-wide ${statusMeta.color}`}>
                                  {statusMeta.icon}
                                  {statusMeta.label}
                                </div>
                                {upload.status === 'uploading' && (
                                  <button
                                    type="button"
                                    onClick={() => cancelUpload(upload.id)}
                                    className="text-xs font-cinzel uppercase tracking-wide border px-3 py-1.5 transition border-gold-light text-text-dark hover:bg-white"
                                  >
                                    Cancel
                                  </button>
                                )}
                              </div>

                              <div className="mt-3 h-2 bg-white rounded-full overflow-hidden border border-gold-pale/60">
                                <div
                                  className={`h-full transition-all duration-300 ${
                                    upload.status === 'error'
                                      ? 'bg-red-500'
                                      : upload.status === 'canceled'
                                      ? 'bg-text-muted/60'
                                      : upload.status === 'completed'
                                      ? 'bg-green-500'
                                      : 'bg-gold-primary'
                                  }`}
                                  style={{ width: `${Math.max(upload.progress, 2)}%` }}
                                />
                              </div>
                            </motion.div>
                          );
                        })}
                      </AnimatePresence>
                    </div>
                  </div>
                )}
              </form>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="p-4 border border-gold-light bg-white shadow-sm">
                <p className="text-xs font-cinzel uppercase tracking-widest text-text-muted">Total Media</p>
                <div className="mt-2 flex items-center gap-3">
                  <span className="p-2 rounded-full bg-gold-pale text-gold-primary"><ImageIcon size={18} /></span>
                  <p className="font-cinzel text-3xl text-text-dark">{galleryStats.total}</p>
                </div>
              </div>
              <div className="p-4 border border-gold-light bg-white shadow-sm">
                <p className="text-xs font-cinzel uppercase tracking-widest text-text-muted">Photos</p>
                <div className="mt-2 flex items-center gap-3">
                  <span className="p-2 rounded-full bg-green-50 text-green-600"><ImageIcon size={18} /></span>
                  <p className="font-cinzel text-3xl text-text-dark">{galleryStats.photos}</p>
                </div>
              </div>
              <div className="p-4 border border-gold-light bg-white shadow-sm">
                <p className="text-xs font-cinzel uppercase tracking-widest text-text-muted">Videos</p>
                <div className="mt-2 flex items-center gap-3">
                  <span className="p-2 rounded-full bg-purple-50 text-purple-600"><VideoIcon size={18} /></span>
                  <p className="font-cinzel text-3xl text-text-dark">{galleryStats.videos}</p>
                </div>
              </div>
              <div className="p-4 border border-gold-light bg-white shadow-sm">
                <p className="text-xs font-cinzel uppercase tracking-widest text-text-muted">Last Update</p>
                <div className="mt-2 flex items-center gap-3">
                  <span className="p-2 rounded-full bg-bg-section text-text-muted"><Loader2 size={18} /></span>
                  <p className="font-cinzel text-lg text-text-dark">{galleryStats.latestUpload ? formatDateLabel(galleryStats.latestUpload) : '—'}</p>
                </div>
              </div>
            </div>

            {galleryError && (
              <div className="bg-red-50 border border-red-200 p-4 mb-6 flex flex-wrap items-center justify-between gap-3">
                <p className="text-red-700 font-cormorant">{galleryError}</p>
                <button type="button" onClick={fetchImages} className="font-cinzel text-xs uppercase tracking-wide text-red-600 border border-red-300 px-4 py-1 hover:bg-red-100">
                  Retry Loading
                </button>
              </div>
            )}

            <div className="bg-white p-5 border border-gold-light shadow-sm mb-10">
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <Filter size={18} className="text-gold-primary" />
                <h3 className="font-cinzel text-xl text-text-dark">Gallery Filters</h3>
                <button type="button" onClick={resetGalleryFilters} className="ml-auto text-xs font-cinzel uppercase tracking-wide text-text-muted hover:text-text-dark">
                  Reset
                </button>
              </div>
              <div className="flex flex-wrap gap-2 mb-5">
                {GALLERY_CATEGORIES.map(category => (
                  <button
                    key={category}
                    type="button"
                    onClick={() => updateGalleryFilter('category', category)}
                    className={`px-3 py-1 text-xs font-cinzel uppercase tracking-wide border transition ${
                      galleryFilters.category === category ? 'bg-gold-primary text-white border-gold-primary' : 'border-gold-light text-text-dark bg-white'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="relative">
                  <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                  <input
                    type="search"
                    value={galleryFilters.search}
                    onChange={e => updateGalleryFilter('search', e.target.value)}
                    placeholder="Search by title or category"
                    className="w-full border border-gold-light pl-9 pr-3 py-2 font-cormorant focus:outline-none focus:border-gold-primary"
                  />
                </div>
                <div>
                  <select
                    value={galleryFilters.sort}
                    onChange={e => updateGalleryFilter('sort', e.target.value)}
                    className="w-full border border-gold-light px-3 py-2 font-cormorant focus:outline-none focus:border-gold-primary"
                  >
                    <option value="newest">Newest first</option>
                    <option value="oldest">Oldest first</option>
                    <option value="title-asc">Title A → Z</option>
                    <option value="title-desc">Title Z → A</option>
                  </select>
                </div>
                <div className="flex items-center gap-2">
                  {['all', 'images', 'videos'].map(type => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => updateGalleryFilter('mediaType', type)}
                      className={`flex-1 px-3 py-2 text-xs font-cinzel uppercase tracking-wide border transition ${
                        galleryFilters.mediaType === type ? 'bg-text-dark text-white border-text-dark' : 'border-gold-light text-text-dark'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>
              <div className="mt-5 flex flex-wrap gap-2 text-xs text-text-muted">
                {galleryStats.perCategory.map(({ category, count }) => (
                  <span key={category} className="px-3 py-1 border border-gold-light bg-bg-section font-cinzel uppercase tracking-wider">{category}: {count}</span>
                ))}
              </div>
            </div>

            <div className="bg-white p-5 border border-gold-light shadow-sm mb-8 flex flex-wrap items-center gap-4">
              <div>
                <p className="font-cinzel text-sm text-text-dark uppercase tracking-wide">Bulk Actions</p>
                <p className="text-xs text-text-muted font-cormorant">Select multiple media items to delete them together.</p>
              </div>
              {allowMediaDelete ? (
                <div className="flex flex-wrap items-center gap-2 ml-auto">
                  {isSelectionMode ? (
                    <>
                      <span className="text-sm font-cinzel text-text-dark uppercase tracking-wide">Selected: {selectionCount}</span>
                      <button
                        type="button"
                        onClick={selectAllFiltered}
                        disabled={filteredImages.length === 0 || selectionCount === filteredImages.length}
                        className="text-xs font-cinzel uppercase tracking-wide border px-3 py-1.5 transition border-gold-light text-text-dark disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        Select Visible
                      </button>
                      <button
                        type="button"
                        onClick={exitSelectionMode}
                        className="text-xs font-cinzel uppercase tracking-wide border px-3 py-1.5 transition border-gold-light text-text-dark"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={handleBulkDelete}
                        disabled={selectionCount === 0 || bulkDeleting}
                        className="flex items-center gap-2 text-xs font-cinzel uppercase tracking-wide border px-4 py-2 transition border-red-500 text-red-600 hover:bg-red-50 disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        {bulkDeleting && <Loader2 size={14} className="animate-spin" />}
                        <Trash2 size={14} /> Delete Selected
                      </button>
                    </>
                  ) : (
                    <button
                      type="button"
                      onClick={enableSelectionMode}
                      disabled={filteredImages.length === 0}
                      className="text-xs font-cinzel uppercase tracking-wide border px-4 py-2 transition border-gold-light text-text-dark hover:bg-bg-section disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      Enable Selection
                    </button>
                  )}
                </div>
              ) : (
                <p className="text-xs font-cormorant text-red-600 ml-auto">Media deletion is disabled for this deployment.</p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {galleryLoading && (
                <div className="col-span-full flex justify-center py-12 text-gold-primary">
                  <Loader2 className="animate-spin" size={32} />
                </div>
              )}

              {!galleryLoading && filteredImages.length === 0 && (
                <div className="col-span-full bg-bg-section border border-gold-light p-8 text-center">
                  <p className="font-cinzel text-lg text-text-dark">No media matches the current filters.</p>
                  <button type="button" onClick={resetGalleryFilters} className="btn-gold mt-4">
                    Clear filters
                  </button>
                </div>
              )}

              {filteredImages.map(img => {
                const isVideo = VIDEO_EXTENSIONS.test(img.url || '');
                const isSelected = selectedImageIds.includes(img._id);
                const cardClasses = `bg-white rounded-sm shadow-sm overflow-hidden group relative ${
                  isSelected ? 'border-2 border-gold-primary ring-1 ring-gold-primary/40' : 'border border-gold-light'
                } ${isSelectionMode ? 'cursor-pointer' : ''}`;

                return (
                  <div
                    key={img._id}
                    className={cardClasses}
                    onClick={isSelectionMode ? () => toggleImageSelection(img._id) : undefined}
                  >
                    <div className="relative">
                      {isVideo ? (
                        <video
                          src={img.url}
                          className="w-full aspect-square object-cover bg-black"
                          controls
                          playsInline
                          preload="metadata"
                        />
                      ) : (
                        <img src={img.url} alt={img.title} className="w-full aspect-square object-cover" loading="lazy" />
                      )}
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-3">
                        <button
                          type="button"
                          onClick={event => { event.stopPropagation(); handleOpenMedia(img.url); }}
                          className="bg-white/90 text-text-dark px-3 py-1 text-xs font-cinzel uppercase tracking-wide flex items-center gap-1"
                        >
                          <Eye size={14} /> View
                        </button>
                        <button
                          type="button"
                          onClick={event => { event.stopPropagation(); handleCopyImageUrl(img); }}
                          className="bg-white/90 text-text-dark px-3 py-1 text-xs font-cinzel uppercase tracking-wide flex items-center gap-1"
                        >
                          <Copy size={14} /> {copiedImageId === img._id ? 'Copied' : 'Copy'}
                        </button>
                      </div>
                      {isVideo && <span className="absolute top-3 left-3 bg-black/70 text-white text-[10px] font-cinzel px-2 py-0.5 uppercase tracking-wide">Video</span>}
                      {isSelectionMode && (
                        <button
                          type="button"
                          aria-pressed={isSelected}
                          onClick={event => { event.stopPropagation(); toggleImageSelection(img._id); }}
                          className={`absolute top-3 right-3 w-7 h-7 rounded-full border-2 flex items-center justify-center transition ${
                            isSelected ? 'bg-gold-primary border-gold-primary text-white' : 'bg-white border-gold-light text-transparent'
                          }`}
                        >
                          <Check size={14} />
                        </button>
                      )}
                    </div>
                    <div className="p-3 space-y-2">
                      <div className="flex items-baseline justify-between gap-2">
                        <p className="font-cinzel text-sm text-text-dark truncate" title={img.title}>{img.title || 'Untitled Media'}</p>
                        <span className="text-[10px] font-cinzel uppercase tracking-widest text-text-muted">{formatDateLabel(img.uploadedAt)}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs bg-gold-pale text-gold-primary px-2 py-0.5 inline-flex items-center gap-1">
                          {img.category || 'Uncategorized'}
                        </span>
                        <button
                          onClick={event => { event.stopPropagation(); handleImageDelete(img._id); }}
                          disabled={!allowMediaDelete}
                          className={`text-xs font-cinzel uppercase tracking-wide border px-2 py-1 transition ${
                            allowMediaDelete ? 'border-red-300 text-red-500 hover:bg-red-50' : 'border-gold-light text-text-muted cursor-not-allowed'
                          }`}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}

        {activeTab === 'events' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="bg-white p-8 border border-gold-light shadow-sm mb-12">
              <h2 className="font-cinzel text-2xl mb-6 text-gold-primary">{eventForm.id ? 'Edit Event' : 'Create New Event'}</h2>
              <form onSubmit={handleEventSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-cinzel text-sm text-text-dark mb-2">Title</label>
                    <input type="text" value={eventForm.title} onChange={e => setEventForm({...eventForm, title: e.target.value})} className="w-full border-b-2 border-gold-pale focus:outline-none p-2 font-cormorant" required />
                  </div>
                  <div>
                    <label className="block font-cinzel text-sm text-text-dark mb-2">Date (e.g., March 2025)</label>
                    <input type="text" value={eventForm.date} onChange={e => setEventForm({...eventForm, date: e.target.value})} className="w-full border-b-2 border-gold-pale focus:outline-none p-2 font-cormorant" required />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block font-cinzel text-sm text-text-dark mb-2">Description</label>
                    <textarea value={eventForm.description} onChange={e => setEventForm({...eventForm, description: e.target.value})} className="w-full border-b-2 border-gold-pale focus:outline-none p-2 font-cormorant resize-none" rows="3" required />
                  </div>
                  <div>
                    <label className="block font-cinzel text-sm text-text-dark mb-2">Category (Optional)</label>
                    <input type="text" value={eventForm.category} onChange={e => setEventForm({...eventForm, category: e.target.value})} className="w-full border-b-2 border-gold-pale focus:outline-none p-2 font-cormorant" />
                  </div>
                  <div>
                    <label className="block font-cinzel text-sm text-text-dark mb-2">Image (Optional)</label>
                    <input type="file" onChange={e => setEventForm({...eventForm, file: e.target.files[0]})} className="w-full text-sm font-cormorant" accept="image/*" />
                  </div>
                  <div className="flex items-center mt-6">
                    <input type="checkbox" id="isFeatured" checked={eventForm.isFeatured} onChange={e => setEventForm({...eventForm, isFeatured: e.target.checked})} className="mr-2 w-4 h-4 accent-gold-primary" />
                    <label htmlFor="isFeatured" className="font-cinzel text-sm text-text-dark">Mark as Featured Event</label>
                  </div>
                </div>
                <div className="flex gap-4 pt-4">
                  <button type="submit" disabled={uploadingEvent} className="btn-gold disabled:opacity-50">
                    {uploadingEvent ? 'Saving...' : 'Save Event'}
                  </button>
                  {eventForm.id && (
                    <button type="button" onClick={() => setEventForm({ id: null, title: '', date: '', description: '', category: '', isFeatured: false, file: null })} className="font-cinzel text-sm text-text-muted hover:text-text-dark transition">
                      Cancel Edit
                    </button>
                  )}
                </div>
              </form>
            </div>

            <div className="space-y-4">
              {events.map(evt => (
                <div key={evt._id} className="bg-white border border-gold-light p-6 flex flex-col md:flex-row items-center gap-6 shadow-sm">
                  {evt.image ? (
                    <img src={evt.image} className="w-32 h-32 object-cover border border-gold-pale" alt={evt.title} />
                  ) : (
                    <div className="w-32 h-32 bg-bg-section flex items-center justify-center text-gold-primary/30 text-xs font-cinzel text-center border border-gold-pale">No Image</div>
                  )}
                  <div className="flex-grow">
                    {evt.isFeatured && <span className="bg-gold-primary text-white text-xs font-cinzel px-2 py-1 mb-2 inline-block">Featured</span>}
                    <h3 className="font-cinzel text-xl text-text-dark">{evt.title} <span className="text-sm text-gold-primary ml-2">{evt.date}</span></h3>
                    <p className="font-cormorant text-text-muted mt-2 max-w-2xl line-clamp-2">{evt.description}</p>
                  </div>
                  <div className="flex flex-col gap-2 min-w-[100px]">
                    <button onClick={() => editEvent(evt)} className="btn-gold px-4 py-1 text-center w-full">Edit</button>
                    <button onClick={() => handleEventDelete(evt._id)} className="border-1.5 border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition font-cinzel uppercase text-sm px-4 py-1 text-center w-full">Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {activeTab === 'messages' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="bg-white p-8 border border-gold-light shadow-sm mb-12">
              <h2 className="font-cinzel text-2xl mb-6 text-gold-primary">Contact Form Submissions</h2>
              {messages.length === 0 ? (
                <p className="text-text-muted font-cormorant text-lg">No messages received yet.</p>
              ) : (
                <div className="space-y-6">
                  {messages.map(msg => (
                    <div key={msg._id} className="border-b border-gold-pale pb-6 relative group">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-noto font-bold text-lg text-text-dark">{msg.name}</h3>
                          <p className="text-sm font-cormorant text-text-muted">
                            <span className="font-bold">Email:</span> {msg.email} <span className="mx-2">|</span>
                            <span className="font-bold">Phone:</span> {msg.phone}
                          </p>
                          <p className="text-sm font-cormorant text-gold-primary mt-1">
                            <span className="font-bold">Subject:</span> {msg.subject}
                          </p>
                        </div>
                        <p className="text-xs text-text-muted font-cormorant">
                          {new Date(msg.createdAt).toLocaleString()}
                        </p>
                      </div>
                      <div className="mt-4 bg-bg-section p-4 border-l-4 border-gold-primary">
                        <p className="font-cormorant whitespace-pre-wrap">{msg.message}</p>
                      </div>
                      <button onClick={() => handleMessageDelete(msg._id)} className="absolute top-0 right-0 bg-red-500 text-white w-8 h-8 flex items-center justify-center opacity-0 group-hover:opacity-100 transition shadow-lg rounded">X</button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </div>
      </div>
    </div>
  );
}
