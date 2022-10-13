import Joi from "joi";

export default Joi.object({
  status: Joi.number().valid("ACTIVE", "CANCELED").required(),
}).options({ allowUnknown: false });
