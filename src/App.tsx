import { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/sections/Footer';
import { HomePage } from '@/pages/HomePage';
import { CatalogPage } from '@/pages/CatalogPage';
import { KnowledgePage } from '@/pages/KnowledgePage';
import { FamilyDetailPage } from '@/pages/FamilyDetailPage';
import { AdminLoginPage } from '@/pages/AdminLoginPage';
import { AdminDashboardPage } from '@/pages/AdminDashboardPage';
import { UserLoginPage } from '@/pages/UserLoginPage';
import { RegisterPage } from '@/pages/RegisterPage';
import { initializeStorage, getCurrentUser, setCurrentUser } from '@/store/localStorage';
import type { Page, Family } from '@/types';
import './App.css';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [selectedFamily, setSelectedFamily] = useState<Family | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [currentUser, setCurrentUserState] = useState(() => getCurrentUser());

  // Initialize localStorage on app start
  useEffect(() => {
    initializeStorage();
  }, []);

  const handlePageChange = (page: Page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFamilyClick = (family: Family) => {
    setSelectedFamily(family);
    setCurrentPage('family-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackFromDetail = () => {
    setCurrentPage('catalog');
    setSelectedFamily(null);
  };

  const handleCategoryClick = (categoryId: string) => {
    setActiveCategory(categoryId);
    setCurrentPage('catalog');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAdminClick = () => {
    if (isAdminLoggedIn) {
      setCurrentPage('admin-dashboard' as Page);
    } else {
      setCurrentPage('admin-login' as Page);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAdminLogin = () => {
    setIsAdminLoggedIn(true);
    setCurrentPage('admin-dashboard' as Page);
  };

  const handleAdminLogout = () => {
    setIsAdminLoggedIn(false);
    setCurrentPage('home');
  };

  const handleUserLogin = () => {
    setCurrentUserState(getCurrentUser());
    setCurrentPage('home');
  };

  const handleUserLogout = () => {
    setCurrentUser(null);
    setCurrentUserState(null);
    setCurrentPage('home');
  };

  const handleUserRegister = () => {
    setCurrentUserState(getCurrentUser());
    setCurrentPage('home');
  };

  const handleBackFromAdmin = () => {
    setCurrentPage('home');
  };

  // Admin pages
  if (currentPage === 'admin-login') {
    return (
      <AdminLoginPage 
        onLogin={handleAdminLogin} 
        onBack={handleBackFromAdmin} 
      />
    );
  }

  if (currentPage === 'admin-dashboard') {
    return (
      <AdminDashboardPage 
        onLogout={handleAdminLogout} 
        onBack={handleBackFromAdmin} 
      />
    );
  }

  // User auth pages
  if (currentPage === 'login') {
    return (
      <UserLoginPage
        onLogin={handleUserLogin}
        onBack={handleBackFromAdmin}
        onRegisterClick={() => setCurrentPage('register' as Page)}
      />
    );
  }

  if (currentPage === 'register') {
    return (
      <RegisterPage
        onRegister={handleUserRegister}
        onBack={handleBackFromAdmin}
        onLoginClick={() => setCurrentPage('login' as Page)}
      />
    );
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return (
          <HomePage
            onCatalogClick={() => handlePageChange('catalog')}
            onKnowledgeClick={() => handlePageChange('knowledge')}
            onCategoryClick={handleCategoryClick}
            onFamilyClick={handleFamilyClick}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            activeCategory={activeCategory}
            onActiveCategoryChange={setActiveCategory}
          />
        );
      case 'catalog':
        return (
          <CatalogPage
            onFamilyClick={handleFamilyClick}
            initialCategory={activeCategory}
          />
        );
      case 'knowledge':
        return <KnowledgePage />;
      case 'family-detail':
        if (selectedFamily) {
          return (
            <FamilyDetailPage
              family={selectedFamily}
              onBack={handleBackFromDetail}
              onFamilyClick={handleFamilyClick}
            />
          );
        }
        return <CatalogPage onFamilyClick={handleFamilyClick} />;
      default:
        return (
          <HomePage
            onCatalogClick={() => handlePageChange('catalog')}
            onKnowledgeClick={() => handlePageChange('knowledge')}
            onCategoryClick={handleCategoryClick}
            onFamilyClick={handleFamilyClick}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            activeCategory={activeCategory}
            onActiveCategoryChange={setActiveCategory}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header
        currentPage={currentPage}
        onPageChange={handlePageChange}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onAdminClick={handleAdminClick}
        onLoginClick={() => setCurrentPage('login' as Page)}
        onRegisterClick={() => setCurrentPage('register' as Page)}
        onLogoutClick={handleUserLogout}
        currentUser={currentUser}
      />
      <main className="flex-1">{renderPage()}</main>
      <Footer />
    </div>
  );
}

export default App;
