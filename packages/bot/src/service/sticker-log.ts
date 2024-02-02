import type { Snowflake } from '../model/id.js';
import type { StickerEvent, StickerEventResponder } from '../runner/sticker.js';
import type { StandardOutput } from './output.js';

export interface StickerData {
  /**
   * 初期名が自動で割り当てられる絵文字とは異なり,
   * スタンプは名前を決めてから登録するので名前がuniqueとして有効
   */
  stickerName: string; // 絵文字名
  stickerImageUrl: string; // 絵文字の画像URL
  stickerId: Snowflake; // 絵文字ID
  stickerAuthorId: Snowflake; // 絵文字を作成したユーザーID
  stickerDescription: string; // 絵文字の説明
  stickerTags: string; // 絵文字のタグ (Autocomplete用)
}

export class StickerLog implements StickerEventResponder<StickerData> {
  constructor(private readonly output: StandardOutput) {}

  async on(event: StickerEvent, sticker: StickerData): Promise<void> {
    if (event !== 'CREATE') {
      return;
    }

    await this.output.sendEmbed(this.buildEmbed(sticker));
  }

  private buildEmbed({
    stickerName,
    stickerImageUrl,
    stickerId,
    stickerAuthorId,
    stickerDescription,
    stickerTags
  }: StickerData) {
    const fields = [
      {
        name: '説明',
        value: stickerDescription
      },
      {
        name: '関連絵文字',
        value: stickerTags
      }
    ];

    return {
      title: 'スタンプ警察',
      description: `<@${stickerAuthorId}> が **${stickerName}** を作成しました`,
      thumbnail: {
        url: stickerImageUrl
      },
      footer: `ID: ${stickerId}`,
      fields
    };
  }
}
