import {
  UserGender,
  UserState,
} from "../../database/migrations/20221005222240_app-migration";
import Joi from "joi";

export default Joi.object({
  first_name: Joi.string(),
  last_name: Joi.string(),
  phone: Joi.string(),
  email: Joi.string().email(),
  username: Joi.string(),
  address: Joi.string(),
  gender: Joi.string().valid(...Object.values(UserGender)),
  birth_date: Joi.date(),
  country_id: Joi.number(),
  city: Joi.string(),
  category: Joi.string(),
}).options({ allowUnknown: false });
