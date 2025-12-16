export interface Project {
  id: string;
  title: string;
  category: string;
  description: string;
  techStack: string[];
  link?: string;
  imageGradient: string;
}

export interface Skill {
  name: string;
  level: number; // 0-100
  icon?: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}
