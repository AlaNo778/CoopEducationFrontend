export type Role = "student" | "teacher" | "staff" | "admin"

export interface JWTPayload {
  role: Role
  userId: string
  exp: number
}