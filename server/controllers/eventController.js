import Event from '../models/Event.js';

export const getEvents = async (req, res) => {
  try {
    const { featured } = req.query;
    let query = {};
    if (featured === 'true') {
      query.isFeatured = true;
      const event = await Event.findOne(query).sort({ createdAt: -1 });
      return res.json(event || null);
    }
    const events = await Event.find(query).sort({ createdAt: -1 });
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (event) res.json(event);
    else res.status(404).json({ message: 'Event not found' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createEvent = async (req, res) => {
  try {
    const { title, date, description, category, isFeatured } = req.body;
    const image = req.file ? req.file.path : null;
    
    const event = new Event({
      title, date, description, category, isFeatured: isFeatured === 'true', image
    });

    const createdEvent = await event.save();
    res.status(201).json(createdEvent);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateEvent = async (req, res) => {
  try {
    const { title, date, description, category, isFeatured } = req.body;
    const event = await Event.findById(req.params.id);

    if (event) {
      event.title = title || event.title;
      event.date = date || event.date;
      event.description = description || event.description;
      event.category = category || event.category;
      if (isFeatured !== undefined) event.isFeatured = isFeatured === 'true' || isFeatured === true;
      if (req.file) event.image = req.file.path;

      const updatedEvent = await event.save();
      res.json(updatedEvent);
    } else {
      res.status(404).json({ message: 'Event not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (event) {
      await event.deleteOne();
      res.json({ message: 'Event removed' });
    } else {
      res.status(404).json({ message: 'Event not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
