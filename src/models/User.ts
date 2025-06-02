export interface User {
  id: number
  email: string
  username: string
  password: string
  role: Role
}

export interface UserResponseDto {
  id: number
  email: string
  username: string
  password: string
  role: Role
}

export enum Role {
  Admin = 'ADMIN',
  User = 'USER'
}
