import type { KnowledgeArticle } from '@/types';

// Keys for localStorage
const KEYS = {
  ARTICLES: 'revit_market_articles',
  USERS: 'revit_market_users',
  DOWNLOADS: 'revit_market_downloads',
  CURRENT_USER: 'revit_market_current_user',
  RATINGS: 'revit_market_ratings',
};

const DATA_VERSION = '4';

// Default data
import { knowledgeArticles as defaultArticles } from '@/data/families';

// Users type
export interface User {
  id: string;
  login: string;
  password: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
  createdAt: string;
}

// 🔧 Безопасный парсинг
function safeParse<T>(value: string | null, fallback: T): T {
  try {
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

// 🚀 Инициализация (БЕЗ families)
export function initializeStorage() {
  const version = localStorage.getItem('revit_market_version');

  if (version !== DATA_VERSION) {
    const defaultUsers: User[] = [
      {
        id: '1',
        login: 'admin',
        password: 'admin',
        email: 'admin@revitmarket.ru',
        name: 'Администратор',
        role: 'admin',
        createdAt: new Date().toISOString(),
      },
    ];

    localStorage.setItem(KEYS.ARTICLES, JSON.stringify(defaultArticles));
    localStorage.setItem(KEYS.USERS, JSON.stringify(defaultUsers));
    localStorage.setItem(KEYS.DOWNLOADS, JSON.stringify({}));
    localStorage.setItem(KEYS.RATINGS, JSON.stringify({}));

    localStorage.setItem('revit_market_version', DATA_VERSION);
  }
}

//
// 📚 ARTICLES
//

export function getArticles(): KnowledgeArticle[] {
  return safeParse(
    localStorage.getItem(KEYS.ARTICLES),
    defaultArticles
  );
}

export function setArticles(articles: KnowledgeArticle[]) {
  localStorage.setItem(KEYS.ARTICLES, JSON.stringify(articles));
}

export function addArticle(article: KnowledgeArticle) {
  const articles = getArticles();
  articles.push(article);
  setArticles(articles);
}

export function updateArticle(id: string, updates: Partial<KnowledgeArticle>) {
  const articles = getArticles();
  const index = articles.findIndex((a) => a.id === id);

  if (index !== -1) {
    articles[index] = { ...articles[index], ...updates };
    setArticles(articles);
  }
}

export function deleteArticle(id: string) {
  const articles = getArticles();
  setArticles(articles.filter((a) => a.id !== id));
}

//
// 👤 USERS
//

export function getUsers(): User[] {
  return safeParse(localStorage.getItem(KEYS.USERS), []);
}

export function setUsers(users: User[]) {
  localStorage.setItem(KEYS.USERS, JSON.stringify(users));
}

export function addUser(user: User) {
  const users = getUsers();
  users.push(user);
  setUsers(users);
}

export function findUserByLogin(login: string): User | undefined {
  return getUsers().find((u) => u.login === login);
}

export function findUserByEmail(email: string): User | undefined {
  return getUsers().find((u) => u.email === email);
}

//
// 🔐 CURRENT USER
//

export function getCurrentUser(): User | null {
  return safeParse(localStorage.getItem(KEYS.CURRENT_USER), null);
}

export function setCurrentUser(user: User | null) {
  if (user) {
    localStorage.setItem(KEYS.CURRENT_USER, JSON.stringify(user));
  } else {
    localStorage.removeItem(KEYS.CURRENT_USER);
  }
}

//
// ⬇️ DOWNLOADS
//

export function getDownloads(): Record<string, number> {
  return safeParse(localStorage.getItem(KEYS.DOWNLOADS), {});
}

export function recordDownload(familyId: string) {
  const downloads = getDownloads();

  downloads[familyId] = (downloads[familyId] || 0) + 1;

  localStorage.setItem(KEYS.DOWNLOADS, JSON.stringify(downloads));
}

export function getFamilyDownloads(familyId: string): number {
  return getDownloads()[familyId] || 0;
}

//
// ⭐ RATINGS (опционально, но уже готово)
//

export function getRatings(): Record<string, number> {
  return safeParse(localStorage.getItem(KEYS.RATINGS), {});
}

export function setRating(familyId: string, rating: number) {
  const ratings = getRatings();

  ratings[familyId] = rating;

  localStorage.setItem(KEYS.RATINGS, JSON.stringify(ratings));
}

export function getFamilyRating(familyId: string): number {
  return getRatings()[familyId] || 0;
}

