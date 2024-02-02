import type { Snowflake } from '../model/id.js';
import type { StickerEvent, StickerEventResponder } from '../runner/sticker.js';
import type { StandardOutput } from './output.js';

export interface StickerData {
  /**
   * 初期名が自動で割り当てられる絵文字とは異なり,
   * スタンプは名前を決めてから登録するので名前がuniqueとして有効
   */
  name: string; // 絵文字名
  imageUrl: string; // 絵文字の画像URL
  id: Snowflake; // 絵文字ID
  authorId: Snowflake; // 絵文字を作成したユーザーID
  description: string; // 絵文字の説明
  tags: string; // 絵文字のタグ (Autocomplete用)
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
    name,
    imageUrl,
    id,
    authorId,
    description,
    tags
  }: StickerData) {
    const fields = [
      {
        name: '説明',
        value: description
      },
      {
        name: '関連絵文字',
        value: tags
      }
    ];

    return {
      title: 'スタンプ警察',
      description: `<@${authorId}> が **${name}** を作成しました`,
      thumbnail: {
        url: imageUrl
      },
      footer: `ID: ${id}`,
      fields
    };
  }
}
