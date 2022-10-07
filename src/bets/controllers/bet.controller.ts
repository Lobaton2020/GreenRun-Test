import { BetRepository } from "../repositories/bet.repository";
import { SportRepository } from "../repositories/sport.repository";
import { EventRepository } from "../repositories/event.repository";
export class BetController {
  constructor(
    readonly betRepository: BetRepository,
    readonly sportRepository: SportRepository,
    readonly eventRepository: EventRepository
  ) {}
  findAll() {
    return this.betRepository.findAll();
  }
  findAllEvents() {
    return this.eventRepository.findAll();
  }
  findAllSports() {
    return this.sportRepository.findAll();
  }
}
