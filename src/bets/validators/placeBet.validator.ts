import Joi from "joi";

export default Joi.object({
  amount: Joi.number().required(),
  odd: Joi.number().required(),
  bet_id: Joi.number().required(),
});
