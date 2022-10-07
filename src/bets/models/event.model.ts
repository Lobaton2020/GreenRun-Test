import { DateColumnsEntity } from "../../users/models/user.model";

export interface Event {
  id: number;
  name: string;
  date_event: Date;
}

export type EventEntity = Event | DateColumnsEntity;
