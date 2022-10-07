import { HapiRequest } from "../../common/middlewares/roleAccessMiddlewares";
import {
  TransactionCategory,
  UserRole,
} from "../../database/migrations/20221005222240_app-migration";
import { Transaction, TransactionEntity } from "../models/transaction.model";
import { TransactionsRepository } from "../repositories/transaction.respository";
import * as Boom from "@hapi/boom";
export class TransactionController {
  constructor(readonly transactionRepository: TransactionsRepository) {}
  //TODO: the filter by category
  findAll(req: HapiRequest) {
    if (req["user"].role.includes(UserRole.ADMIN)) {
      return this.transactionRepository.findAll();
    }
    return this.transactionRepository.findAllByUser(req["user"].sub);
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
    if (!(await this.isAvailableDoeWithdraw(payload.amount, req["user"].sub))) {
      return Boom.badRequest("The amount is not available to withdraw");
    }
    return this.transactionRepository.create(payload);
  }
  // Instead add this method there we can add a new layer called Service, If the login growth a lot' I'll do it
  private async isAvailableDoeWithdraw(amount: number, userId: number) {
    const transactionDepositList: Transaction[] =
      await this.transactionRepository.findAllActiveByCategory(
        userId,
        TransactionCategory.DEPOSIT
      );
    const transactionWithdraWList: Transaction[] =
      await this.transactionRepository.findAllActiveByCategory(
        userId,
        TransactionCategory.WITHDRAW
      );
    const totalDeposit = transactionDepositList.reduce(
      (acc, curr) => acc + curr.amount,
      0
    );
    const totalWithdraw = transactionWithdraWList.reduce(
      (acc, curr) => acc + curr.amount,
      0
    );
    return totalDeposit - totalWithdraw > amount;
  }
}
