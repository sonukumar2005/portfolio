export interface Project {
  id: number;
  title: string;
  description: string;
  tech: string[];
  badge: string;
  badgeColor: 'green' | 'cyan' | 'purple';
  link: string;
  featured: boolean;
}

export interface Skill {
  icon: string;
  title: string;
  tags: string[];
}

export interface Certificate {
  icon: string;
  name: string;
  issuer: string;
  date: string;
  link: string;
}

export interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}
