import { useState } from 'react';
import { UserPlus, Mail, Lock, User as UserIcon, Eye, EyeOff, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { addUser, findUserByLogin, findUserByEmail, setCurrentUser } from '@/store/localStorage';
import type { User } from '@/store/localStorage';

interface RegisterPageProps {
  onRegister: () => void;
  onBack: () => void;
  onLoginClick: () => void;
}

export function RegisterPage({ onRegister, onBack, onLoginClick }: RegisterPageProps) {
  const [formData, setFormData] = useState({
    name: '',
    login: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!formData.name || !formData.login || !formData.email || !formData.password) {
      setError('Все поля обязательны для заполнения');
      return;
    }

    if (formData.password.length < 4) {
      setError('Пароль должен быть не менее 4 символов');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Пароли не совпадают');
      return;
    }

    if (!formData.email.includes('@')) {
      setError('Введите корректный email');
      return;
    }

    setIsLoading(true);

    // Check if user exists
    const existingLogin = findUserByLogin(formData.login);
    if (existingLogin) {
      setError('Пользователь с таким логином уже существует');
      setIsLoading(false);
      return;
    }

    const existingEmail = findUserByEmail(formData.email);
    if (existingEmail) {
      setError('Пользователь с таким email уже существует');
      setIsLoading(false);
      return;
    }

    // Create user
    const newUser: User = {
      id: Date.now().toString(),
      login: formData.login,
      password: formData.password,
      email: formData.email,
      name: formData.name,
      role: 'user',
      createdAt: new Date().toISOString(),
    };

    addUser(newUser);
    setCurrentUser(newUser);
    setSuccess(true);
    setIsLoading(false);

    setTimeout(() => {
      onRegister();
    }, 1500);
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm text-center">
            <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-[#1A1A1A] mb-2">
              Регистрация успешна!
            </h2>
            <p className="text-[#6B7280] mb-6">
              Добро пожаловать, {formData.name}!
            </p>
            <Button onClick={onRegister} className="w-full bg-primary hover:bg-primary/90 text-white">
              Перейти на сайт
            </Button>
          </div>
        </div>
      </div>
    );
  }

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
              <UserPlus className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-2xl font-bold text-[#1A1A1A] mb-2">
              Создать аккаунт
            </h1>
            <p className="text-[#6B7280]">
              Зарегистрируйтесь для доступа ко всем функциям
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name Field */}
            <div>
              <label className="block text-sm font-medium text-[#1A1A1A] mb-2">
                Имя
              </label>
              <div className="relative">
                <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6B7280]" />
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ваше имя"
                  className="w-full h-12 pl-10 pr-4 rounded-xl border border-gray-200 bg-white text-base focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
                />
              </div>
            </div>

            {/* Login Field */}
            <div>
              <label className="block text-sm font-medium text-[#1A1A1A] mb-2">
                Логин
              </label>
              <div className="relative">
                <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6B7280]" />
                <input
                  type="text"
                  value={formData.login}
                  onChange={(e) => setFormData({ ...formData, login: e.target.value })}
                  placeholder="Придумайте логин"
                  className="w-full h-12 pl-10 pr-4 rounded-xl border border-gray-200 bg-white text-base focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
                />
              </div>
            </div>

            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-[#1A1A1A] mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6B7280]" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="your@email.com"
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
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="Минимум 4 символа"
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

            {/* Confirm Password Field */}
            <div>
              <label className="block text-sm font-medium text-[#1A1A1A] mb-2">
                Подтвердите пароль
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6B7280]" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  placeholder="Повторите пароль"
                  className="w-full h-12 pl-10 pr-12 rounded-xl border border-gray-200 bg-white text-base focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6B7280] hover:text-[#1A1A1A] transition-colors"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
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
                  Регистрация...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <UserPlus className="w-4 h-4" />
                  Зарегистрироваться
                </span>
              )}
            </Button>
          </form>

          {/* Login Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-[#6B7280]">
              Уже есть аккаунт?{' '}
              <button onClick={onLoginClick} className="text-primary font-medium hover:underline">
                Войти
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
