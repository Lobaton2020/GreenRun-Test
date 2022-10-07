import Joi from "joi";

export const transactionDepositValidator = Joi.object({
  amount: Joi.number().required().positive(),
});

export const transactionWithdrawValidator = transactionDepositValidator;
