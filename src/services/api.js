import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? "" : "http://localhost:5000");

const api = axios.create({ baseURL: BASE_URL });

// Image API
export const getImages = (category) => 
  api.get(`/api/images${category && category !== 'All' ? `?category=${category}` : ''}`).then(res => res.data);

export const uploadImage = (formData) => 
  api.post('/api/images/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }).then(res => res.data);

export const deleteImage = (id) => 
  api.delete(`/api/images/${id}`).then(res => res.data);


// Event API
export const getEvents = () => 
  api.get('/api/events').then(res => res.data);

export const getFeaturedEvent = () => 
  api.get('/api/events?featured=true').then(res => res.data);

export const createEvent = (formData) => 
  api.post('/api/events', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }).then(res => res.data);

export const updateEvent = (id, formData) => 
  api.put(`/api/events/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }).then(res => res.data);

export const deleteEvent = (id) => 
  api.delete(`/api/events/${id}`).then(res => res.data);

// Message API
export const submitContact = (data) => 
  api.post('/api/messages', data).then(res => res.data);

export const getMessages = () => 
  api.get('/api/messages').then(res => res.data);

export const deleteMessage = (id) => 
  api.delete(`/api/messages/${id}`).then(res => res.data);
