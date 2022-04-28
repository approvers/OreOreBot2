import {
  type AssetKey,
  PartyCommand,
  type RandomGenerator as PartyRng
} from './party';
import { type BoldItalicCop, BoldItalicCopReporter } from './bold-italic-cop';
import {
  type Clock,
  type MessageResponseRunner,
  ScheduleRunner,
  composeMessageEventResponders,
  composeMessageUpdateEventResponders
} from '../runner';
import type { CommandMessage, CommandResponder } from './command-message';
import { type DeletionObservable, DeletionRepeater } from './deletion-repeater';
import { JudgementCommand, type RandomGenerator } from './judgement';
import {
  KaereCommand,
  type KaereMusicKey,
  type ReservationRepository,
  type VoiceRoomController
} from './kaere';
import { KawaemonHasAllRoles, RoleManager } from './kawaemon-has-all-roles';
import { KokuseiChousa, MemberStats } from './kokusei-chousa';
import {
  type TypoObservable,
  TypoRecorder,
  TypoReporter,
  type TypoRepository
} from './typo-record';
import { DifferenceDetector } from './difference-detector';
import { HelpCommand } from './help';
import { Hukueki } from './hukueki';
import type { Snowflake } from '../model/id';
import type { StandardOutput } from './output';
import type { VoiceConnectionFactory } from './voice-connection';
import { composeRoleEventResponders } from '../runner';

export const allMessageEventResponder = (repo: TypoRepository) =>
  composeMessageEventResponders<
    DeletionObservable & TypoObservable & BoldItalicCop
  >(
    new DeletionRepeater(),
    new TypoRecorder(repo),
    new BoldItalicCopReporter()
  );

export const allMessageUpdateEventResponder = () =>
  composeMessageUpdateEventResponders(new DifferenceDetector());

export const registerAllCommandResponder = (
  typoRepo: TypoRepository,
  reservationRepo: ReservationRepository,
  factory: VoiceConnectionFactory<AssetKey | KaereMusicKey>,
  clock: Clock,
  scheduleRunner: ScheduleRunner,
  random: PartyRng & RandomGenerator,
  roomController: VoiceRoomController,
  commandRunner: MessageResponseRunner<CommandMessage, CommandResponder>,
  stats: MemberStats
) => {
  const allResponders = [
    new TypoReporter(typoRepo, clock, scheduleRunner),
    new PartyCommand(factory, clock, scheduleRunner, random),
    new KaereCommand(
      factory,
      roomController,
      clock,
      scheduleRunner,
      reservationRepo
    ),
    new JudgementCommand(random),
    new Hukueki(),
    new HelpCommand(commandRunner),
    new KokuseiChousa(stats)
  ];
  for (const responder of allResponders) {
    commandRunner.addResponder(responder);
  }
};

export const allRoleResponder = (
  kawaemonId: Snowflake,
  roleManager: RoleManager,
  output: StandardOutput
) =>
  composeRoleEventResponders(
    new KawaemonHasAllRoles(kawaemonId, roleManager, output)
  );
