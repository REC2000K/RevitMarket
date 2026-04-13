import { useState } from 'react';
import { LogIn, Lock, User, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { findUserByLogin, setCurrentUser } from '@/store/localStorage';

interface UserLoginPageProps {
  onLogin: () => void;
  onBack: () => void;
  onRegisterClick: () => void;
}

export function UserLoginPage({ onLogin, onBack, onRegisterClick }: UserLoginPageProps) {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!login || !password) {
      setError('Введите логин и пароль');
      return;
    }

    setIsLoading(true);

    // Find user
    const user = findUserByLogin(login);
    
    if (!user || user.password !== password) {
      setError('Неверный логин или пароль');
      setIsLoading(false);
      return;
    }

    // Save current user
    setCurrentUser(user);
    setIsLoading(false);
    onLogin();
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        {/* Back Button */}
        <button
          onClick={onBack}
          className="mb-8 text-sm text-[#6B7280] hover:text-[#1A1A1A] transition-colors"
        >
          ← Вернуться на сайт
        </button>

        <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <LogIn className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-2xl font-bold text-[#1A1A1A] mb-2">
              Вход в аккаунт
            </h1>
            <p className="text-[#6B7280]">
              Введите свои данные для входа
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Login Field */}
            <div>
              <label className="block text-sm font-medium text-[#1A1A1A] mb-2">
                Логин
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6B7280]" />
                <input
                  type="text"
                  value={login}
                  onChange={(e) => setLogin(e.target.value)}
                  placeholder="Ваш логин"
                  className="w-full h-12 pl-10 pr-4 rounded-xl border border-gray-200 bg-white text-base focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-[#1A1A1A] mb-2">
                Пароль
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6B7280]" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Ваш пароль"
                  className="w-full h-12 pl-10 pr-12 rounded-xl border border-gray-200 bg-white text-base focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6B7280] hover:text-[#1A1A1A] transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              size="lg"
              className="w-full bg-primary hover:bg-primary/90 text-white"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Вход...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <LogIn className="w-4 h-4" />
                  Войти
                </span>
              )}
            </Button>
          </form>

          {/* Register Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-[#6B7280]">
              Ещё нет аккаунта?{' '}
              <button onClick={onRegisterClick} className="text-primary font-medium hover:underline">
                Зарегистрироваться
              </button>
            </p>
          </div>

          {/* Hint */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <p className="text-xs text-[#6B7280] text-center">
              Для демонстрации используйте:<br />
              <span className="font-medium text-[#1A1A1A]">Логин: admin</span> | 
              <span className="font-medium text-[#1A1A1A]"> Пароль: admin</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
