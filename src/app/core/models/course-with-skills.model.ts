import { Skill } from './skill.model';

export interface CourseWithSkills {
  id: string;
  title: string;
  description?: string;
  skills: Skill[];
}
