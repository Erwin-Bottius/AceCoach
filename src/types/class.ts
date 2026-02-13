import { User } from "./user";

export interface Class {
  id: string;
  name: string;
  theme: string;
  date: string;
  duration: number;
  capacity: number;
  level: string;
  teacherID: string;
  teacher: Partial<User>;
  students: Partial<User>[];
}
