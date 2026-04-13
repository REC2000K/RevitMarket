import { Box, Github, Send, Mail } from 'lucide-react';

export function Footer() {
  const footerLinks = {
    'Каталог': ['Все семейства', 'Популярные', 'Новые', 'Категории'],
    'База знаний': ['Уроки', 'Статьи', 'Чек-листы', 'FAQ'],
    'Помощь': ['Как скачать', 'Как загрузить', 'Требования', 'Поддержка'],
    'О проекте': ['О нас', 'Контакты', 'Партнёрам', 'Блог'],
  };

  return (
    <footer className="bg-[#1A1A1A] text-white">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-3 lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Box className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">Revit Market</span>
            </div>
            <p className="text-gray-400 text-sm mb-6 max-w-xs">
              База знаний и семейств для Autodesk Revit. Скачивайте, учитесь, делитесь опытом.
            </p>
            <div className="flex items-center gap-3">
              <a
                href="#"
                className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-[#0066FF] transition-colors"
              >
                <Github className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-[#0066FF] transition-colors"
              >
                <Send className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-[#0066FF] transition-colors"
              >
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h3 className="font-semibold text-white mb-4">{title}</h3>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-gray-400 text-sm hover:text-white transition-colors"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-gray-400 text-sm">
            © 2024 Revit Market. Все права защищены.
          </p>
          <div className="flex items-center gap-6">
            <a href="#" className="text-gray-400 text-sm hover:text-white transition-colors">
              Политика конфиденциальности
            </a>
            <a href="#" className="text-gray-400 text-sm hover:text-white transition-colors">
              Условия использования
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
