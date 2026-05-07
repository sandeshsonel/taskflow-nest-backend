export interface Account {
  id: string;
  firebaseUID?: string;
  name: string;
  email: string;
  passwordHash?: string;
  photoURL?: string;
  role: string;
  status: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
