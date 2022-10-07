import { DateColumnsEntity } from "../../users/models/user.model";

export interface Sport {
  id: number;
  name: string;
}

export type SportEntity = Sport | DateColumnsEntity;
