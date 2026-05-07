export interface JwtPayload {
  id: string;
  fullName: string;
  email: string;
  firebaseUID: string | null;
  role: string;
}
