import Joi from "joi";
import { TransactionCategory } from "../../database/migrations/20221005222240_app-migration";

export const ALL_DEFAULT = "ALL";
export const queryCategoryTransaction = Joi.object({
  category: Joi.string()
    .valid(...Object.values(TransactionCategory), ALL_DEFAULT)
    .default(ALL_DEFAULT),
});
