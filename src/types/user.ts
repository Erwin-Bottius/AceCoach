export interface User {
  id: string;
  email: string;
  role: "TEACHER" | "STUDENT";
  firstName: string;
  lastName: string;
  password: string;
}
