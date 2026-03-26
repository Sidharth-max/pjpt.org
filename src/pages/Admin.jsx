import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Loader2, CheckCircle2, AlertTriangle, XCircle } from 'lucide-react';
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

export default function Admin() {
  const [auth, setAuth] = useState(false);
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState('gallery');

  const [images, setImages] = useState([]);
  const [imgForm, setImgForm] = useState({ title: '', category: 'All', files: [] });
  const [uploadingImg, setUploadingImg] = useState(false);
  const [activeUploads, setActiveUploads] = useState([]);
  const uploadControllers = useRef(new Map());
  const removalTimers = useRef(new Map());

  const [events, setEvents] = useState([]);
  const [messages, setMessages] = useState([]);
  const [eventForm, setEventForm] = useState({ id: null, title: '', date: '', description: '', category: '', isFeatured: false, file: null });
  const [uploadingEvent, setUploadingEvent] = useState(false);
  const [notification, setNotification] = useState('');

  const adminPass = import.meta.env.VITE_ADMIN_PASSWORD;

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
    };
  }, []);

  const showToast = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(''), 3000);
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

  const fetchMessages = async () => {
    try {
      const data = await getMessages();
      setMessages(data);
    } catch (err) { console.error(err); }
  };

  const fetchImages = async () => {
    try {
      const data = await getImages('All');
      setImages(data);
    } catch (err) { console.error(err); }
  };

  const fetchEvents = async () => {
    try {
      const data = await getEvents();
      setEvents(data);
    } catch (err) { console.error(err); }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === adminPass) setAuth(true);
    else alert('Incorrect password');
  };

  // Gallery Handlers
  const handleImageUpload = async (e) => {
    e.preventDefault();
    const files = Array.from(imgForm.files || []);
    if (!files.length || !imgForm.title) return alert('File(s) and Title required');
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
        setImgForm({ title: '', category: 'All', files: [] });
        const fileInput = document.getElementById('gallery-file-upload');
        if (fileInput) fileInput.value = '';
        fetchImages();
      }

      if (hasFailure) {
        alert('Some uploads failed. Please try again.');
      }
    } catch (err) {
      alert('Upload failed');
    } finally {
      setUploadingImg(false);
    }
  };

  const handleImageDelete = async (id) => {
    if (!window.confirm('Delete this image?')) return;
    try {
      await deleteImage(id);
      showToast('Image deleted');
      fetchImages();
    } catch (err) {
      alert('Delete failed');
    }
  };

  // Event Handlers
  const handleEventSubmit = async (e) => {
    e.preventDefault();
    if (!eventForm.title || !eventForm.date || !eventForm.description) return alert('Missing required fields');
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
        showToast('Event updated');
      } else {
        await createEvent(fd);
        showToast('Event created');
      }
      setEventForm({ id: null, title: '', date: '', description: '', category: '', isFeatured: false, file: null });
      fetchEvents();
    } catch (err) {
      alert('Save failed');
    } finally {
      setUploadingEvent(false);
    }
  };

  const handleEventDelete = async (id) => {
    if (!window.confirm('Delete this event?')) return;
    try {
      await deleteEvent(id);
      showToast('Event deleted');
      fetchEvents();
    } catch (err) {
      alert('Delete failed');
    }
  };

  const handleMessageDelete = async (id) => {
    if (!window.confirm('Delete this message?')) return;
    try {
      await deleteMessage(id);
      showToast('Message deleted');
      fetchMessages();
    } catch (err) {
      alert('Delete failed');
    }
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

      <div className="max-w-[1200px] mx-auto px-4">
        <h1 className="font-cinzel text-4xl text-text-dark mb-8 uppercase tracking-wide">Admin Dashboard</h1>

        <div className="flex space-x-4 mb-8">
          <button onClick={() => setActiveTab('gallery')} className={`font-cinzel uppercase px-6 py-2 transition-colors ${activeTab === 'gallery' ? 'bg-gold-primary text-white' : 'border border-gold-light text-text-dark bg-white'}`}>Gallery</button>
          <button onClick={() => setActiveTab('events')} className={`font-cinzel uppercase px-6 py-2 transition-colors ${activeTab === 'events' ? 'bg-gold-primary text-white' : 'border border-gold-light text-text-dark bg-white'}`}>Events</button>
          <button onClick={() => setActiveTab('messages')} className={`font-cinzel uppercase px-6 py-2 transition-colors ${activeTab === 'messages' ? 'bg-gold-primary text-white' : 'border border-gold-light text-text-dark bg-white'}`}>Messages</button>
        </div>

        {activeTab === 'gallery' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="bg-white p-8 border border-gold-light shadow-sm mb-12">
              <h2 className="font-cinzel text-2xl mb-6 text-gold-primary">Upload Media</h2>
              <form onSubmit={handleImageUpload} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                <div>
                  <label className="block font-cinzel text-sm text-text-dark mb-2">Title</label>
                  <input type="text" value={imgForm.title} onChange={e => setImgForm({...imgForm, title: e.target.value})} className="w-full border-b-2 border-gold-pale focus:border-gold-primary focus:outline-none p-2 font-cormorant" required />
                </div>
                <div>
                  <label className="block font-cinzel text-sm text-text-dark mb-2">Category</label>
                  <select value={imgForm.category} onChange={e => setImgForm({...imgForm, category: e.target.value})} className="w-full border-b-2 border-gold-pale focus:border-gold-primary focus:outline-none p-2 font-cormorant">
                    {['All', 'Temple', 'Idol', 'Festivals', 'Events', 'Nature'].map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block font-cinzel text-sm text-text-dark mb-2">Media Files</label>
                  <input id="gallery-file-upload" type="file" multiple onChange={e => setImgForm({...imgForm, files: e.target.files})} className="w-full text-sm font-cormorant" accept="image/*,video/*" required />
                </div>
                <button type="submit" disabled={uploadingImg} className="btn-gold h-[42px] disabled:opacity-50">
                  {uploadingImg ? 'Uploading...' : 'Upload'}
                </button>
              </form>
            </div>

            {activeUploads.length > 0 && (
              <div className="bg-white p-6 border border-gold-light shadow-sm mb-12">
                <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                  <div>
                    <h3 className="font-cinzel text-xl text-text-dark">Live Uploads</h3>
                    <p className="text-sm text-text-muted font-cormorant">Track progress, ETA, and cancel uploads in real time.</p>
                  </div>
                  <button
                    type="button"
                    onClick={cancelAllUploads}
                    disabled={!activeUploads.some(upload => upload.status === 'uploading')}
                    className="font-cinzel text-sm uppercase tracking-wide border px-4 py-2 transition disabled:opacity-40 disabled:cursor-not-allowed border-gold-light text-text-dark hover:bg-gold-primary hover:text-white"
                  >
                    Cancel All
                  </button>
                </div>

                <div className="space-y-4">
                  {activeUploads.map(upload => {
                    const statusMeta = getStatusMeta(upload.status);
                    const isInProgress = upload.status === 'uploading';
                    return (
                      <div key={upload.id} className="p-4 border border-gold-pale bg-bg-section rounded-sm shadow-inner">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                          <div>
                            <p className="font-cinzel text-base text-text-dark break-all">{upload.name}</p>
                            <p className="text-xs text-text-muted font-cormorant mt-1">
                              {formatBytes(upload.size)} • {upload.eta || 'Calculating…'}
                            </p>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className={`flex items-center gap-1 text-sm ${statusMeta.color}`}>
                              {statusMeta.icon}
                              <span className="font-cinzel text-xs uppercase tracking-wide">{statusMeta.label}</span>
                            </div>
                            <button
                              type="button"
                              onClick={() => cancelUpload(upload.id)}
                              disabled={!isInProgress}
                              className="font-cinzel text-xs uppercase tracking-wide border px-3 py-1 transition disabled:opacity-40 disabled:cursor-not-allowed border-red-200 text-red-600 hover:bg-red-500 hover:text-white"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                        <div className="mt-3 h-2 bg-white/60 rounded-full overflow-hidden">
                          <div
                            className={`h-full transition-all duration-300 ${upload.status === 'error' ? 'bg-red-400' : upload.status === 'canceled' ? 'bg-text-muted' : 'bg-gold-primary'}`}
                            style={{ width: `${upload.progress}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {images.map(img => {
                const isVideo = img.url.match(/\.(mp4|webm|ogg|mov)$/i);
                return (
                  <div key={img._id} className="bg-white border border-gold-light p-2 relative group">
                    {isVideo ? (
                      <video src={img.url} className="w-full aspect-square object-cover mb-2" muted loop playsInline />
                    ) : (
                      <img src={img.url} alt={img.title} className="w-full aspect-square object-cover mb-2" />
                    )}
                    <p className="font-cinzel text-sm truncate">{img.title}</p>
                    <span className="text-xs bg-gold-pale text-gold-primary px-2 py-0.5 mt-1 inline-block">{img.category}</span>
                    <button onClick={() => handleImageDelete(img._id)} className="absolute top-4 right-4 bg-red-500 text-white w-8 h-8 flex items-center justify-center opacity-0 group-hover:opacity-100 transition shadow-lg">X</button>
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
