import type { Family, KnowledgeArticle } from '@/types';

// Keys for localStorage
const KEYS = {
  FAMILIES: 'revit_market_families',
  ARTICLES: 'revit_market_articles',
  USERS: 'revit_market_users',
  DOWNLOADS: 'revit_market_downloads',
  CURRENT_USER: 'revit_market_current_user',
};
const DATA_VERSION = '3';

// Default data
import { families as defaultFamilies, knowledgeArticles as defaultArticles } from '@/data/families';

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

// Initialize storage with default data
export function initializeStorage() {
  // ВСЕГДА перезаписываем families
  localStorage.setItem(KEYS.FAMILIES, JSON.stringify(defaultFamilies));

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
    localStorage.setItem('revit_market_version', DATA_VERSION);
  }
}


// Families
function safeParse<T>(value: string | null, fallback: T): T {
  try {
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

export function getFamilies(): Family[] {
  return safeParse(
    localStorage.getItem(KEYS.FAMILIES),
    defaultFamilies
  );
}

export function setFamilies(families: Family[]) {
  localStorage.setItem(KEYS.FAMILIES, JSON.stringify(families));
}

export function addFamily(family: Family) {
  const families = getFamilies();

  const updated = [...families, family];

  setFamilies(updated);
}

export function updateFamily(id: string, updates: Partial<Family>) {
  const families = getFamilies();

  const updated = families.map((f) =>
    f.id === id ? { ...f, ...updates } : f
  );

  setFamilies(updated);
}

export function deleteFamily(id: string) {
  const families = getFamilies();

  const updated = families.filter((f) => f.id !== id);

  setFamilies(updated);
}

// Articles
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

// Users
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
  const users = getUsers();
  return users.find((u) => u.login === login);
}

export function findUserByEmail(email: string): User | undefined {
  const users = getUsers();
  return users.find((u) => u.email === email);
}

// Current User Session
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

// Downloads counter

export function recordDownload(familyId: string) {
  const downloads = getDownloads();

  downloads[familyId] = (downloads[familyId] || 0) + 1;

  localStorage.setItem(KEYS.DOWNLOADS, JSON.stringify(downloads));
}

export function getDownloads(): Record<string, number> {
  return safeParse(localStorage.getItem(KEYS.DOWNLOADS), {});
}

export function getFamilyDownloads(familyId: string): number {
  const downloads = getDownloads();
  return downloads[familyId] || 0;
}
