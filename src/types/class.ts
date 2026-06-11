import type { User } from "./user";

export interface Class {
  id: string;
  name: string;
  theme: string;
  date: string;
  duration: number;
  capacity: number;
  level: string;
  location?: string;
  price?: number;
  isPublished?: boolean;
  teacherID: string;
  teacher: Partial<User>;
  students: Partial<User>[];
}
