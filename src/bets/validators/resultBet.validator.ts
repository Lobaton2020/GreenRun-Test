import Joi from "joi";
import { BetResult } from "../../database/migrations/20221005222240_app-migration";

export default Joi.object({
  result: Joi.number()
    .valid(...Object.values(BetResult))
    .required(),
}).options({ allowUnknown: false });
