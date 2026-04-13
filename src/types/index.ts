export interface Family {
  id: string;
  name: string;
  description: string;
  category: string;
  subcategory?: string;
  image: string;
  author: string;
  rating: number;
  downloads: number;
  revitVersion: string;
  fileSize: string;
  fileFormat: 'rfa' | 'rvt' | 'rft';
  tags: string[];
  dateAdded: string;
  preview?: string[];
  downloadPath: string,
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  count: number;
  color?: string;
}

export interface KnowledgeArticle {
  id: string;
  title: string;
  description: string;
  category: string;
  icon: string;
  readTime: string;
  dateAdded: string;
}

export interface FilterState {
  categories: string[];
  revitVersions: string[];
  minRating: number;
  fileFormats: string[];
  searchQuery: string;
}

export type ViewMode = 'grid' | 'list';
export type Page = 'home' | 'catalog' | 'knowledge' | 'family-detail' | 'admin-login' | 'admin-dashboard' | 'login' | 'register';
