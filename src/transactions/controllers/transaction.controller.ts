import { HapiRequest } from "../../common/middlewares/roleAccessMiddlewares";
import {
  TransactionCategory,
  UserRole,
} from "../../database/migrations/20221005222240_app-migration";
import { Transaction, TransactionEntity } from "../models/transaction.model";
import { TransactionsRepository } from "../repositories/transaction.respository";
import * as Boom from "@hapi/boom";
import { ALL_DEFAULT } from "../validators/queryCategoryTransaction.validator";
export class TransactionController {
  constructor(readonly transactionRepository: TransactionsRepository) {}
  // Depends of the user ROl to show the information
  findAll(req: HapiRequest) {
    const where = this.getWhereCategoryQuery(req.query);
    if (req["user"].role.includes(UserRole.USER)) {
      return this.transactionRepository.findAllByUser(req["user"].sub, where);
    }
    return this.transactionRepository.findAll(where);
  }

  findOne(req: HapiRequest) {
    const where = this.getWhereCategoryQuery(req.query);
    return this.transactionRepository.findAllByUser(req.params.id, where);
  }

  createDeposit(req: HapiRequest) {
    const payload: TransactionEntity = {
      user_id: req["user"].sub,
      amount: req.payload.amount,
      category: TransactionCategory.DEPOSIT,
      created_at: new Date(),
      status: true,
    };
    return this.transactionRepository.create(payload);
  }

  async createWithdraw(req: HapiRequest) {
    const payload = {
      user_id: req["user"].sub,
      amount: req.payload.amount,
      category: TransactionCategory.WITHDRAW,
      created_at: new Date(),
      status: true,
    };
    if (
      !(await this.transactionRepository.isAvailableDoWithdrawOrBet(
        payload.amount,
        req["user"].sub
      ))
    ) {
      return Boom.badRequest("The amount is not available to withdraw");
    }
    return this.transactionRepository.create(payload);
  }

  private getWhereCategoryQuery(query: any) {
    const category = query?.category;
    let where: object = {};
    if (category != ALL_DEFAULT) {
      where["category"] = category;
    }
    return where;
  }
}
