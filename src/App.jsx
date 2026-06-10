import { BrowserRouter, Routes, Route, Outlet, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import { LanguageProvider } from './contexts/LanguageContext';

import Home from './pages/Home';
import About from './pages/About';
import Gallery from './pages/Gallery';
import Visit from './pages/Visit';
import Events from './pages/Events';
import Dhwajarohan2026 from './pages/events/Dhwajarohan2026';
import SanskarUtsav2026 from './pages/events/SanskarUtsav2026';
import Contact from './pages/Contact';
import Admin from './pages/Admin';

function MainLayout() {
  return (
    <div className="flex flex-col min-h-screen w-full overflow-x-hidden">
      <a href="#main-content" className="skip-link">Skip to content</a>
      <Navbar />
      <main id="main-content" className="flex-grow w-full">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

function App() {
  // Show the Sanskar Utsav camp page as the home page through the end of June 14, 2026,
  // then automatically switch back to the original Home page.
  const showSanskarUtsav = new Date() < new Date('2026-06-15T00:00:00+05:30');

  return (
    <LanguageProvider>
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          {/* Public routes wrapped with Navbar and Footer */}
          <Route element={<MainLayout />}>
            <Route path="/" element={showSanskarUtsav ? <SanskarUtsav2026 /> : <Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/visit" element={<Visit />} />
            <Route path="/events" element={<Events />} />
            <Route path="/events/dhwajarohan-2026" element={<Dhwajarohan2026 />} />
            <Route path="/events/sanskar-utsav-2026" element={<SanskarUtsav2026 />} />
            {/* Redirect any dynamic event ID URLs (e.g. /events/:mongoId) to /events.
                These were previously included in the sitemap but have no dedicated page. */}
            <Route path="/events/:id" element={<Navigate to="/events" replace />} />
            <Route path="/contact" element={<Contact />} />

            {/* Catch-all route to prevent blank pages and soft 404s */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>

          {/* Admin route isolated completely */}
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </BrowserRouter>
    </LanguageProvider>
  );
}

export default App;
