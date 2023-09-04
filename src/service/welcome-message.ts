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
    if (!member.isBot) return;

    await this.output.sendMention(member.userId);
    await this.output.sendEmbed(this.buildEmbed());
  }

  private buildEmbed() {
    const fields = [
      {
        name: 'メンバーデータの追加',
        value:
          '限界開発鯖では各メンバーの情報をデータベースに保存し、それらを元に様々な機能を提供しているよ。\n限界開発鯖に参加したら、まずは自分のメンバーデータを追加してね\n',
        inline: false
      },
      {
        name: '自己紹介',
        value:
          '参加したら <#687977635132997634> で同じ司令官のみんなに自己紹介しよう',
        inline: false
      },
      {
        name: 'Botの導入',
        value:
          '限界開発鯖では自分が開発したBotを導入できるよ。導入に関する詳しい説明は [Bot 製作ガイドライン](https://docs.approvers.dev/guideline/bot-create-guideline) を確認してね'
      }
    ];
    return {
      title: '***†WELCOME TO UNDERGROUND†***',
      description:
        '司令官。ようこそ、限界開発鯖へ\nまずはじめに知っていてほしいことを教えるよ\n詳しい説明は [鯖民向けドキュメント](https://docs.approvers.dev/reference/getting-started) を見てね',
      fields
    };
  }
}
