import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { useAuth } from './context/AuthContext';
import { supabase } from './supabaseClient';

/* ── LAYOUT COMPONENTS ── */
import Navbar from './components/layout/Navbar/Navbar';
import Footer from './components/layout/Footer/Footer';
import MobileBottomNav from './components/layout/MobileBottomNav/MobileBottomNav';
import MobileTopBar from './components/layout/MobileTopBar/MobileTopBar';

/* ── UI COMPONENTS ── */
import CustomAlert from './components/ui/CustomAlert/CustomAlert';

/* ── PAGES ── */
import Home from './pages/Core/Home/Home';
import Login from './pages/Auth/Login/Login';
import Register from './pages/Auth/Register/Register';
import ForgotPassword from './pages/Auth/ForgotPassword/ForgotPassword';
import UpdatePassword from './pages/Auth/UpdatePassword/UpdatePassword';
import Posts from './pages/Posts/Main/Posts';
import CreatePost from './pages/Posts/Create/CreatePost';
import EditPost from './pages/Posts/Edit/EditPost';
import Profile from './pages/Profile/Main/Profile';
import PublicProfile from './pages/Profile/Public/PublicProfile';
import EditProfile from './pages/Profile/Edit/EditProfile';
import Reviews from './pages/Reviews/Reviews';
import About from './pages/Core/About/About';
import Contact from './pages/Core/Contact/Contact';
import SearchPage from './pages/Search/SearchPage';
import NotFound from './pages/Core/NotFound/NotFound';

/* ── ADMIN COMPONENTS ── */
import AdminRoute from './components/routing/AdminRoute';
import AdminLayout from './pages/Admin/AdminLayout/AdminLayout';
import AdminDashboard from './pages/Admin/Dashboard/AdminDashboard';
import AdminUsers from './pages/Admin/Users/AdminUsers';
import AdminPosts from './pages/Admin/Posts/AdminPosts';

/* ── CONTEXT & PROVIDERS ── */
import { AuthProvider } from './context/AuthContext';
import { AlertProvider } from './context/AlertContext';

const App = () => {
  return (
    <AuthProvider>
      <AlertProvider>
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </AlertProvider>
    </AuthProvider>
  );
};

const AppContent = () => {
  const location = useLocation();
  const { user } = useAuth();

  // ── Heartbeat for Active Users ──
  useEffect(() => {
    if (!user) return;

    const updateLastSeen = async () => {
      try {
        await supabase
          .from('profiles')
          .update({ last_seen_at: new Date().toISOString() })
          .eq('id', user.id);
      } catch (err) {
        console.error('Heartbeat error:', err);
      }
    };

    // Initial update
    updateLastSeen();

    // Update every 2 minutes
    const interval = setInterval(updateLastSeen, 2 * 60 * 1000);

    return () => clearInterval(interval);
  }, [user]);
  
  // Full-screen immersive forms (no global headers or footers)
  const isFullScreenForm = location.pathname === '/create-post' || location.pathname.startsWith('/edit-post/');
  
  // Routes where the mobile bottom navigation should be hidden
  const hideBottomNavRoutes = ['/', '/login', '/register', '/about', '/contact', '/forgot-password', '/update-password', '/create-post'];
  
  // Check if we should show bottom nav (exclude hidden routes and dynamic edit routes)
  const shouldShowBottomNav = !hideBottomNavRoutes.includes(location.pathname) && !isFullScreenForm;
  
  const isAuthPage = ['/login', '/register', '/forgot-password', '/update-password'].includes(location.pathname);
  const isAdminRoute = location.pathname.startsWith('/admin');

  // Footer should only show where the mobile nav is hidden (Home, About, Contact, Auth) - EXCEPT on full-screen forms
  const shouldShowFooter = !shouldShowBottomNav && !isFullScreenForm && !isAdminRoute;

  // Global UI elements visibility
  const showNavbar = !isFullScreenForm && !isAdminRoute;
  const showMobileTopBar = !isFullScreenForm && !isAdminRoute;
  const showMobileBottomNav = shouldShowBottomNav && !isAdminRoute;

  return (
    <>
      {showNavbar && <Navbar />}
      {showMobileTopBar && <MobileTopBar />}
      <CustomAlert />
      <main className={isAdminRoute ? 'admin-main-wrapper' : shouldShowBottomNav ? 'main-with-nav' : isAuthPage ? 'auth-main' : ''}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/update-password" element={<UpdatePassword />} />
          <Route path="/create-post" element={<CreatePost />} />
          <Route path="/posts" element={<Posts />} />
          <Route path="/edit-post/:id" element={<EditPost />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/profile/:id" element={<PublicProfile />} />
          <Route path="/profile/:id/posts" element={<Posts />} />
          <Route path="/profile/:id/reviews" element={<Reviews />} />
          <Route path="/edit-profile" element={<EditProfile />} />
          <Route path="/reviews" element={<Reviews />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/search" element={<SearchPage />} />
          
          {/* ── ADMIN ROUTES ── */}
          <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
            <Route index element={<AdminDashboard />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="posts" element={<AdminPosts />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      {shouldShowFooter && <Footer hasBottomNav={shouldShowBottomNav} />}
      {showMobileBottomNav && <MobileBottomNav />}
    </>
  );
};

export default App;