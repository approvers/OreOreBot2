import type { Snowflake } from '../model/id.js';
import type { MemberEvent, MemberEventResponder } from '../runner/member.js';
import type { EntranceOutput } from './output.js';

export interface NewMember {
  userId: Snowflake;
  isBot: boolean;
}

export class WelcomeMessage implements MemberEventResponder<NewMember> {
  constructor(private readonly output: EntranceOutput) {}

  async on(_event: MemberEvent, member: NewMember): Promise<void> {
    if (member.isBot) return;

    await this.output.sendEmbedWithMention(this.buildEmbed(), member.userId);
  }

  private buildEmbed() {
    // そこまで変更が発生するとは思えないのでハードコード
    const fields = [
      {
        name: 'メンバーデータの追加',
        value:
          '限界開発鯖では各メンバーの情報をデータベースに保存し、それらを元に様々な機能を提供しているよ。\n限界開発鯖に参加したら、まずは[情報登録ウェブアプリ](https://members.approvers.dev/)で自分のメンバーデータを追加してね\n',
        inline: false
      },
      {
        name: '自己紹介',
        value:
          '参加したら <#687977635132997634> で同じ司令官のみんなに自己紹介しよう',
        inline: false
      },
      {
        name: 'メインチャンネル',
        value:
          '限界開発鯖では以下のチャンネルがメインで使われているよ\n- <#690909527461199922>\n- <#891210643938611260>\n- <#683939861539192865>',
        inline: false
      },
      {
        name: 'Botの導入',
        value:
          '限界開発鯖では自分が開発したBotを導入できるよ。導入に関する詳しい説明は [Bot 製作ガイドライン](https://docs.approvers.dev/guideline/bot-create-guideline) を確認してね',
        inline: false
      }
    ];
    return {
      title: '***†WELCOME TO UNDERGROUND†***',
      description:
        '司令官。ようこそ、限界開発鯖へ\nまずはじめに知っていてほしいことを教えるよ\n詳しい説明は [鯖民向けドキュメント](https://approvers.notion.site/Getting-Started-cdef1e63f91f4168b3d071c0f1b9c41f) を見てね',
      fields
    };
  }
}
