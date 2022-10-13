import { BetRepository } from "../repositories/bet.repository";
import { SportRepository } from "../repositories/sport.repository";
import { EventRepository } from "../repositories/event.repository";
import { HapiRequest } from "../../common/middlewares/roleAccessMiddlewares";
import {
  BetStatus,
  TransactionCategory,
} from "../../database/migrations/20221005222240_app-migration";
import { TransactionsRepository } from "../../transactions/repositories/transaction.respository";
import { UserBetRepository } from "../repositories/user-bets.repostitory";
import * as Boom from "@hapi/boom";
import { NotifierService } from "../../common/services/notifier..service";
import { UserRepository } from "../../users/repository/user.repository";
import { User } from "../../users/models/user.model";
import { Bet } from "../models/bet.model";
export class BetController {
  constructor(
    readonly betRepository: BetRepository,
    readonly sportRepository: SportRepository,
    readonly eventRepository: EventRepository,
    readonly userBetsRepository: UserBetRepository,
    readonly transactionRepository: TransactionsRepository,
    readonly notifierService: NotifierService,
    readonly userRepository: UserRepository
  ) {}
  findAll(req: HapiRequest) {
    let where = {};
    return this.betRepository.findAll(where);
  }

  findAllPlaced(req: HapiRequest) {
    return this.userBetsRepository.findAll(req["user"].sub);
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

  async setResultStatus(req: HapiRequest) {
    const betId = req.params.id;
    const bet = (await this.betRepository.findOne(betId)) as Bet;
    if (!bet) {
      return Boom.badRequest("The bet id doesn't exist");
    }
    if (bet.status == BetStatus.SETTLED) {
      return Boom.badRequest("This bet have already ended");
    }
    await this.betRepository.update(betId, req.payload);
    const userBets = await this.userBetsRepository.findByBet(betId);
    //Cycle to verify every bet done by user
    for (let userBet of userBets) {
      const user = (await this.userRepository.findOne(userBet.user_id)) as User;
      let subject = `We are sorry, Yoy haven't wont the bet: ${bet.name}`;
      let message = `This an email of test, Here I would add a beautiful meesage with more detail`;
      if (userBet.state == req.payload.result) {
        // Verifuy if the user have won
        const payloadTransaction = {
          amount: userBet.amount * userBet.odd - userBet.amount, //calcular
          user_id: userBet.user_id,
          category: TransactionCategory.WINNING,
          created_at: new Date(),
          status: true,
        };

        await this.transactionRepository.create(payloadTransaction);
        let subject = `Amazing! You have won the bet : ${bet.name} for $${payloadTransaction.amount}`;
        this.callNotificationAndUpdateBet(
          user.id,
          user.email,
          subject,
          message
        );
        continue;
      }
      this.notifierService
        .notify(user.email, message, subject)
        .then((info) => console.log("Email SENT suceffully"))
        .catch((e) => console.log("[NotifyonLostError]", e));
    }
    await this.betRepository.update(bet.id, {
      status: "SETTLED",
    });
    return {
      message: "Operation in process",
    };
  }
  private callNotificationAndUpdateBet(
    userId: number,
    email: string,
    subject: string,
    message: string
  ) {
    this.notifierService
      .notify(email, message, subject)
      .then(async (info) => {
        console.log("Email SENT suceffully");
        await this.userBetsRepository.update(userId, {
          state: "SETTLED",
        });
      })
      .catch((e) => console.log("[NotifyonWonError]", e));
  }
}
