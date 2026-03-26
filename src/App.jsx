import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';

import Home from './pages/Home';
import About from './pages/About';
import Gallery from './pages/Gallery';
import Visit from './pages/Visit';
import Events from './pages/Events';
import Dhwajarohan2026 from './pages/events/Dhwajarohan2026';
import Contact from './pages/Contact';
import Admin from './pages/Admin';

function MainLayout() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

function App() {
  // Automatically switch back to the original Home page after the event ends on April 8, 2026.
  const isEventOver = new Date() > new Date('2026-04-09T00:00:00+05:30');

  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        {/* Public routes wrapped with Navbar and Footer */}
        <Route element={<MainLayout />}>
          <Route path="/" element={isEventOver ? <Home /> : <Dhwajarohan2026 />} />
          <Route path="/about" element={<About />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/visit" element={<Visit />} />
          <Route path="/events" element={<Events />} />
          <Route path="/events/dhwajarohan-2026" element={<Dhwajarohan2026 />} />
          <Route path="/contact" element={<Contact />} />
        </Route>
        
        {/* Admin route isolated completely */}
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
