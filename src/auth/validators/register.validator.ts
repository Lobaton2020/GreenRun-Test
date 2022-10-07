import {
  UserGender,
  UserState,
} from "../../database/migrations/20221005222240_app-migration";
import Joi from "joi";

export default Joi.object({
  password: Joi.string().required(),
  first_name: Joi.string().required(),
  last_name: Joi.string(),
  phone: Joi.string(),
  email: Joi.string().required().email(),
  username: Joi.string().required(),
  address: Joi.string(),
  gender: Joi.string().valid(...Object.values(UserGender)),
  birth_date: Joi.date(),
  country_id: Joi.number(),
  city: Joi.string(),
  user_state: Joi.string()
    .valid(...Object.values(UserState))
    .default(UserState.ACTIVE),
  category: Joi.string(),
  created_at: Joi.date().default(new Date()),
});
