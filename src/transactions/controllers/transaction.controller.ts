import { HapiRequest } from "../../common/middlewares/roleAccessMiddlewares";
import {
  TransactionCategory,
  UserRole,
} from "../../database/migrations/20221005222240_app-migration";
import { Transaction, TransactionEntity } from "../models/transaction.model";
import { TransactionsRepository } from "../repositories/transaction.respository";
import * as Boom from "@hapi/boom";
import { ALL_DEFAULT } from "../validators/queryCategoryTransaction.validator";
import { UserRepository } from "../../users/repository/user.repository";
export class TransactionController {
  constructor(
    readonly transactionRepository: TransactionsRepository,
    readonly userRepository: UserRepository
  ) {}
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
  async getUserBalance(req: HapiRequest) {
    if (req["user"].role.includes(UserRole.USER)) {
      return this._getUserBalance(req["user"].sub);
    }
    if (!(await this.userRepository.findOne(req.params.id))) {
      return Boom.badRequest("The user by id doesn't exist");
    }
    if (req.params.id == req["user"].sub) {
      return Boom.badRequest("You don't have any balance, you are an ADMIN");
    }
    return this._getUserBalance(req.params.id); // The param must be the user id
  }

  private getWhereCategoryQuery(query: any) {
    const category = query?.category;
    let where: object = {};
    if (category != ALL_DEFAULT) {
      where["category"] = category;
    }
    return where;
  }
  private async _getUserBalance(userId: number) {
    const [
      [lengthWithDraw, totalWithDraw],
      [lengthDeposits, totalDeposits],
      [lengthBets, totalBets],
      [lengthWinning, totalWinning],
    ] = await Promise.all([
      this.transactionRepository.getTotalWithDraw(userId),
      this.transactionRepository.getTotalDeposit(userId),
      this.transactionRepository.getTotalBet(userId),
      this.transactionRepository.getTotalWinning(userId),
    ]);
    return {
      winning: {
        lengthWinning,
        totalWinning,
      },
      withdraw: {
        lengthWithDraw,
        totalWithDraw,
      },
      deposit: {
        lengthDeposits,
        totalDeposits,
      },
      bet: {
        lengthBets,
        totalBets,
      },
      moneyAvailable: totalDeposits + totalWinning - totalBets + totalWithDraw,
    };
  }
}
