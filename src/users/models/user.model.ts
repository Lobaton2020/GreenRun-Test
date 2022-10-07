import {
  UserGender,
  UserRole,
  UserState,
} from "../../database/migrations/20221005222240_app-migration";
export interface DateColumnsEntity {
  created_at?: Date;
  updated_at?: Date;
  deleted?: boolean;
  deleted_at?: Date;
}
export interface User {
  id: number;
  role: UserRole;
  first_name: string;
  last_name: string;
  phone?: string;
  email: string;
  username: string;
  password: string;
  address?: string;
  gender?: UserGender;
  birth_date?: Date;
  country_id?: number;
  city?: string;
  user_state?: UserState;
  category?: string;
}

export type UserEntity = User | DateColumnsEntity;

export interface UserJwt {
  sub: number;
  role: string;
  email: string;
  fullname: string;
  username: string;
  aud: string;
  iss: string;
  iat: number;
  exp: number;
}
