import { Tag } from './tag.model';

export interface Course {
  id: string;
  title: string;
  description?: string;
  createdAt: string;
  tags?: Tag[];
}
