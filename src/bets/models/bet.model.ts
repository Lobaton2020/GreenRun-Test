import { BetStatus } from "../../database/migrations/20221005222240_app-migration";
import { DateColumnsEntity } from "../../users/models/user.model";

export interface Bet {
  id: number;
  name: string;
  status: BetStatus;
}

export type BetEntity = Bet | DateColumnsEntity;
