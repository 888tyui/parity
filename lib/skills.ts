export interface Skill {
  slug: string;
  name: string;
  description: string;
  version: string;
  author: string;
  tags: string[];
  compatibility: string[];
  installCommand: string;
  lastUpdated: string;
  content: string; // Full SKILL.md content
}
