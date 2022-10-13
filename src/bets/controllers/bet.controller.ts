import { BetRepository } from "../repositories/bet.repository";
import { SportRepository } from "../repositories/sport.repository";
import { EventRepository } from "../repositories/event.repository";
import { HapiRequest } from "../../common/middlewares/roleAccessMiddlewares";
import {
  TransactionCategory,
  UserRole,
} from "../../database/migrations/20221005222240_app-migration";
import { TransactionsRepository } from "../../transactions/repositories/transaction.respository";
import { UserBetRepository } from "../repositories/user-bets.repostitory";
import * as Boom from "@hapi/boom";
export class BetController {
  constructor(
    readonly betRepository: BetRepository,
    readonly sportRepository: SportRepository,
    readonly eventRepository: EventRepository,
    readonly userBetsRepository: UserBetRepository,
    readonly transactionRepository: TransactionsRepository
  ) {}
  findAll(req: HapiRequest) {
    let where = {};
    return this.betRepository.findAll(where);
  }

  findAllEvents() {
    return this.eventRepository.findAll();
  }
  findAllSports() {
    return this.sportRepository.findAll();
  }

  async place(req: HapiRequest) {
    if (!(await this.betRepository.findOne(req.payload.bet_id))) {
      return Boom.badRequest("The bet doesn't exist");
    }
    if (
      !(await this.transactionRepository.isAvailableDoWithdrawOrBet(
        req.payload.amount,
        req["user"].sub
      ))
    ) {
      return Boom.badRequest("You don't have enought deposit to bet ");
    }
    const payloadBase = {
      created_at: new Date(),
    };
    const user_bet = await this.userBetsRepository.create({
      ...payloadBase,
      ...req.payload,
      user_id: req["user"].sub,
    });
    const payloadTransaction = {
      ...payloadBase,
      amount: req.payload.amount,
      category: TransactionCategory.BET,
      status: true,
      user_bets: user_bet.id,
      user_id: req["user"].sub,
    };
    const transaction = await this.transactionRepository.create(
      payloadTransaction
    );
    return {
      transaction,
      user_bet,
    };
  }

  async changeStatus(req: HapiRequest) {
    const betId = req.params.id;
    if (!(await this.betRepository.findOne(betId))) {
      return Boom.badRequest("The bet does exist");
    }
    await this.betRepository.update(betId, req.payload);
    return this.betRepository.findOne(betId);
  }
}
