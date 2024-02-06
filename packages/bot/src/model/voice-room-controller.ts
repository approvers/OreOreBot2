import type { Dep0 } from '../driver/dep-registry.js';
import type { Snowflake } from './id.js';

/**
 * ボイスチャンネル自体を操作できるコントローラーの抽象.
 */
export interface VoiceRoomController {
  /**
   * そのボイスチャンネルからすべてのユーザーを切断させる.
   *
   * @param guildId - サーバの ID
   * @param roomId - ボイスチャンネルの ID
   * @returns 切断処理の完了後に解決される `Promise`
   */
  disconnectAllUsersIn(guildId: Snowflake, roomId: Snowflake): Promise<void>;
}
export interface VoiceRoomControllerDep extends Dep0 {
  type: VoiceRoomController;
}
export const voiceRoomControllerKey = Symbol(
  'VOICE_ROOM_CONTROLLER'
) as unknown as VoiceRoomControllerDep;
