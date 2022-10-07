import { DateColumnsEntity } from "../../users/models/user.model";

export interface Bet {
  id: number;
}

export type BetEntity = Bet | DateColumnsEntity;
