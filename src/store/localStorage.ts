import type { Family, KnowledgeArticle } from '@/types';

// Keys for localStorage
const KEYS = {
  FAMILIES: 'revit_market_families',
  ARTICLES: 'revit_market_articles',
  USERS: 'revit_market_users',
  DOWNLOADS: 'revit_market_downloads',
  CURRENT_USER: 'revit_market_current_user',
};

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
  if (!localStorage.getItem(KEYS.FAMILIES)) {
    localStorage.setItem(KEYS.FAMILIES, JSON.stringify(defaultFamilies));
  }
  if (!localStorage.getItem(KEYS.ARTICLES)) {
    localStorage.setItem(KEYS.ARTICLES, JSON.stringify(defaultArticles));
  }
  if (!localStorage.getItem(KEYS.USERS)) {
    // Create default admin user
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
    localStorage.setItem(KEYS.USERS, JSON.stringify(defaultUsers));
  }
  if (!localStorage.getItem(KEYS.DOWNLOADS)) {
    localStorage.setItem(KEYS.DOWNLOADS, JSON.stringify({}));
  }
}

// Families
export function getFamilies(): Family[] {
  const data = localStorage.getItem(KEYS.FAMILIES);
  return data ? JSON.parse(data) : defaultFamilies;
}

export function setFamilies(families: Family[]) {
  localStorage.setItem(KEYS.FAMILIES, JSON.stringify(families));
}

export function addFamily(family: Family) {
  const families = getFamilies();
  families.push(family);
  setFamilies(families);
}

export function updateFamily(id: string, updates: Partial<Family>) {
  const families = getFamilies();
  const index = families.findIndex((f) => f.id === id);
  if (index !== -1) {
    families[index] = { ...families[index], ...updates };
    setFamilies(families);
  }
}

export function deleteFamily(id: string) {
  const families = getFamilies();
  setFamilies(families.filter((f) => f.id !== id));
}

// Articles
export function getArticles(): KnowledgeArticle[] {
  const data = localStorage.getItem(KEYS.ARTICLES);
  return data ? JSON.parse(data) : defaultArticles;
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
  const data = localStorage.getItem(KEYS.USERS);
  return data ? JSON.parse(data) : [];
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
  const data = localStorage.getItem(KEYS.CURRENT_USER);
  return data ? JSON.parse(data) : null;
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
  if (!downloads[familyId]) {
    downloads[familyId] = 0;
  }
  downloads[familyId]++;
  localStorage.setItem(KEYS.DOWNLOADS, JSON.stringify(downloads));
  
  // Also update family download count
  const families = getFamilies();
  const family = families.find((f) => f.id === familyId);
  if (family) {
    family.downloads++;
    setFamilies(families);
  }
}

export function getDownloads(): Record<string, number> {
  const data = localStorage.getItem(KEYS.DOWNLOADS);
  return data ? JSON.parse(data) : {};
}

export function getFamilyDownloads(familyId: string): number {
  const downloads = getDownloads();
  return downloads[familyId] || 0;
}
