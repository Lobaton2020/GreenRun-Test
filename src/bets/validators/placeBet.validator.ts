import Joi from "joi";
import { BetResult } from "../../database/migrations/20221005222240_app-migration";

export default Joi.object({
  amount: Joi.number().required(),
  odd: Joi.number().required().positive().min(1.01),
  bet_id: Joi.number().required(),
  state: Joi.number()
    .valid(...Object.values(BetResult))
    .required(),
}).options({ allowUnknown: false });
