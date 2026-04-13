import { Search, Box, Menu, X, User, Shield, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import type { Page } from '@/types';
import type { User as UserType } from '@/store/localStorage';

interface HeaderProps {
  currentPage: Page;
  onPageChange: (page: Page) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onAdminClick?: () => void;
  onLoginClick?: () => void;
  onRegisterClick?: () => void;
  onLogoutClick?: () => void;
  currentUser?: UserType | null;
}

export function Header({ 
  currentPage, 
  onPageChange, 
  searchQuery, 
  onSearchChange, 
  onAdminClick,
  onLoginClick,
  onRegisterClick,
  onLogoutClick,
  currentUser
}: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems: { label: string; page: Page }[] = [
    { label: 'Главная', page: 'home' },
    { label: 'Каталог', page: 'catalog' },
    { label: 'База знаний', page: 'knowledge' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div 
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => onPageChange('home')}
          >
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Box className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-[#1A1A1A]">Revit Market</span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <button
                key={item.page}
                onClick={() => onPageChange(item.page)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  currentPage === item.page
                    ? 'text-primary bg-primary/5'
                    : 'text-[#6B7280] hover:text-[#1A1A1A] hover:bg-gray-100'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Search Bar - Desktop */}
          <div className="hidden lg:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280]" />
              <input
                type="text"
                placeholder="Поиск семейств..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full h-10 pl-10 pr-4 rounded-full border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="hidden md:flex items-center gap-2">
            {currentUser ? (
              <>
                <span className="text-sm text-[#6B7280]">
                  {currentUser.name}
                </span>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-[#6B7280]"
                  onClick={onLogoutClick}
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Выйти
                </Button>
              </>
            ) : (
              <>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-[#6B7280]"
                  onClick={onLoginClick}
                >
                  <User className="w-4 h-4 mr-2" />
                  Войти
                </Button>
                <Button 
                  size="sm" 
                  className="bg-primary hover:bg-primary/90 text-white"
                  onClick={onRegisterClick}
                >
                  Регистрация
                </Button>
              </>
            )}
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-[#6B7280]"
              onClick={onAdminClick}
            >
              <Shield className="w-4 h-4 mr-2" />
              Админ
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-gray-100"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="w-5 h-5 text-[#1A1A1A]" />
            ) : (
              <Menu className="w-5 h-5 text-[#1A1A1A]" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-100">
            {/* Mobile Search */}
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280]" />
              <input
                type="text"
                placeholder="Поиск семейств..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full h-10 pl-10 pr-4 rounded-full border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:border-primary"
              />
            </div>

            {/* Mobile Nav */}
            <nav className="flex flex-col gap-1">
              {navItems.map((item) => (
                <button
                  key={item.page}
                  onClick={() => {
                    onPageChange(item.page);
                    setMobileMenuOpen(false);
                  }}
                  className={`px-4 py-3 rounded-lg text-sm font-medium text-left transition-colors ${
                    currentPage === item.page
                      ? 'text-primary bg-primary/5'
                      : 'text-[#6B7280] hover:text-[#1A1A1A] hover:bg-gray-100'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </nav>

            {/* Mobile Actions */}
            <div className="flex flex-col gap-2 mt-4 pt-4 border-t border-gray-100">
              {currentUser ? (
                <>
                  <div className="px-4 py-2 text-sm text-[#1A1A1A]">
                    {currentUser.name}
                  </div>
                  <Button 
                    variant="ghost" 
                    className="justify-start text-[#6B7280]"
                    onClick={onLogoutClick}
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Выйти
                  </Button>
                </>
              ) : (
                <>
                  <Button 
                    variant="ghost" 
                    className="justify-start text-[#6B7280]"
                    onClick={onLoginClick}
                  >
                    <User className="w-4 h-4 mr-2" />
                    Войти
                  </Button>
                  <Button 
                    className="bg-primary hover:bg-primary/90 text-white"
                    onClick={onRegisterClick}
                  >
                    Регистрация
                  </Button>
                </>
              )}
              <Button 
                variant="ghost" 
                className="justify-start text-[#6B7280]"
                onClick={onAdminClick}
              >
                <Shield className="w-4 h-4 mr-2" />
                Админ-панель
              </Button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
