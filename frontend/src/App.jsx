import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Stories from './pages/Stories';
import Categories from './pages/Categories';
import TermsAndConditions from './pages/TermsAndConditions';
import StoryDetail from './pages/StoryDetail';
import ChapterReader from './pages/ChapterReader';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ChangePassword from './pages/auth/ChangePassword';
import Profile from './pages/Profile';
import EditProfile from './pages/EditProfile';
import UserProfile from './pages/UserProfile';
import Favorites from './pages/Favorites';
import AllNotifications from './pages/AllNotifications';
import AdminDashboard from './pages/admin/AdminDashboard';
import CreateStory from './pages/admin/CreateStory';
import EditStory from './pages/admin/EditStory';
import ManageChapters from './pages/admin/ManageChapters';
import EditChapter from './pages/admin/EditChapter';
import './index.css';

function App() {
  return (
    <Router>
      <Routes>
        {/* Admin routes - full layout without Header/Footer/padding */}
        <Route path="/admin" element={
          <div className="flex flex-col min-h-screen bg-background-light dark:bg-background-dark">
            <Header />
            <AdminDashboard />
            <Footer />
          </div>
        } />
        <Route path="/admin/create-story" element={
          <div className="flex flex-col min-h-screen bg-background-light dark:bg-background-dark">
            <Header />
            <CreateStory />
            <Footer />
          </div>
        } />
        <Route path="/admin/edit-story/:id" element={
          <div className="flex flex-col min-h-screen bg-background-light dark:bg-background-dark">
            <Header />
            <EditStory />
            <Footer />
          </div>
        } />
        <Route path="/admin/manage-chapters/:storyId" element={
          <div className="flex flex-col min-h-screen bg-background-light dark:bg-background-dark">
            <Header />
            <ManageChapters />
            <Footer />
          </div>
        } />
        <Route path="/admin/edit-chapter/:storyId/:chapterId" element={
          <div className="flex flex-col min-h-screen bg-background-light dark:bg-background-dark">
            <Header />
            <EditChapter />
            <Footer />
          </div>
        } />

        {/* Regular routes - with container padding */}
        <Route path="/*" element={
          <div className="flex flex-col min-h-screen bg-background-light dark:bg-background-dark">
            <Header />
            <div className="flex-grow px-4 sm:px-8 md:px-16 lg:px-24 xl:px-40 flex flex-1 justify-center py-5">
              <div className="w-full max-w-[1200px]">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/stories" element={<Stories />} />
                  <Route path="/categories" element={<Categories />} />
                  <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
                  <Route path="/story/:id" element={<StoryDetail />} />
                  <Route path="/chapter/:storyId/:chapterNumber" element={<ChapterReader />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/change-password" element={<ChangePassword />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/edit-profile" element={<EditProfile />} />
                  <Route path="/user-profile" element={<UserProfile />} />
                  <Route path="/favorites" element={<Favorites />} />
                  <Route path="/notifications" element={<AllNotifications />} />
                </Routes>
              </div>
            </div>
            <Footer />
          </div>
        } />
      </Routes>
    </Router>
  );
}

export default App;
