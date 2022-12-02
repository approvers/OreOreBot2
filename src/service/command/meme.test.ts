import { Meme, sanitizeArgs } from './meme.js';
import { describe, expect, it, vi } from 'vitest';

import { createMockMessage } from './command-message.js';
import { parseStringsOrThrow } from '../../adaptor/proxy/command/schema.js';

describe('meme', () => {
  const responder = new Meme();

  it('use case of takopi', async () => {
    await responder.on(
      createMockMessage(
        parseStringsOrThrow(['takopi', 'こるく'], responder.schema),
        (message) => {
          expect(message).toStrictEqual({
            description: `教員「こるく、出して」\nりにあ「わ、わかんないっピ.......」`
          });
        },
        {
          senderName: 'りにあ'
        }
      )
    );
  });

  it('use case of takopi (-f)', async () => {
    await responder.on(
      createMockMessage(
        parseStringsOrThrow(['takopi', '-f', 'こるく'], responder.schema),
        (message) => {
          expect(message).toStrictEqual({
            description: `りにあ「こるく、出して」\n教員「わ、わかんないっピ.......」`
          });
        },
        {
          senderName: 'りにあ'
        }
      )
    );
  });

  it('use case of takopi (-c)', async () => {
    await responder.on(
      createMockMessage(
        parseStringsOrThrow(
          ['takopi', '-c', 'こるく', 'いっそう'],
          responder.schema
        ),
        (message) => {
          expect(message).toStrictEqual({
            description: `こるく「いっそう、出して」\nりにあ「わ、わかんないっピ.......」`
          });
        },
        {
          senderName: 'りにあ'
        }
      )
    );
  });

  it('use case of takopi (-f, -c)', async () => {
    await responder.on(
      createMockMessage(
        parseStringsOrThrow(
          ['takopi', '-f', '-c', 'こるく', 'いっそう'],
          responder.schema
        ),
        (message) => {
          expect(message).toStrictEqual({
            description: `りにあ「いっそう、出して」\nこるく「わ、わかんないっピ.......」`
          });
        },
        {
          senderName: 'りにあ'
        }
      )
    );
  });

  it('few arguments of takopi (-c)', async () => {
    await responder.on(
      createMockMessage(
        parseStringsOrThrow(['takopi', '-c', 'こるく'], responder.schema),
        (message) => {
          expect(message).toStrictEqual({
            description: '(引数が)わ、わかんないっピ.......',
            title: '引数が不足してるみたいだ。'
          });
        }
      )
    );
  });

  it('use case of n', async () => {
    await responder.on(
      createMockMessage(
        parseStringsOrThrow(
          ['n', 'テスト前に課題もやらないで原神してて'],
          responder.schema
        ),
        (message) => {
          expect(message).toStrictEqual({
            description: `テスト前に課題もやらないで原神しててNった`
          });
        }
      )
    );
  });

  it('use case of web3', async () => {
    await responder.on(
      createMockMessage(
        parseStringsOrThrow(['web3', 'Rust'], responder.schema),
        (message) => {
          expect(message).toStrictEqual({
            description:
              '```\n「いちばんやさしいRustの教本」 - インプレス \n```'
          });
        }
      )
    );
  });

  it('use case of moeta', async () => {
    await responder.on(
      createMockMessage(
        parseStringsOrThrow(['moeta', '雪'], responder.schema),
        (message) => {
          expect(message).toStrictEqual({
            description:
              '「久留米の花火大会ね、寮から見れたの?」\n「うん ついでに雪が燃えた」\n「は?」'
          });
        }
      )
    );
  });

  it('use case of kenjou', async () => {
    await responder.on(
      createMockMessage(
        parseStringsOrThrow(
          [
            'kenjou',
            'ホテルのオートロックの鍵は部屋に置きっぱなしにしないほうがいい'
          ],
          responder.schema
        ),
        (message) => {
          expect(message).toStrictEqual({
            description:
              'ホテルのオートロックの鍵は部屋に置きっぱなしにしないほうがいい - 健常者エミュレータ事例集Wiki'
          });
        }
      )
    );
  });

  it('use case of koume', async () => {
    await responder.on(
      createMockMessage(
        parseStringsOrThrow(
          ['koume', 'RSA鍵を登録した', 'ed25519'],
          responder.schema
        ),
        (message) => {
          expect(message).toStrictEqual({
            description:
              'RSA鍵を登録したと思ったら〜♪\n\ned25519でした〜♪\n\nチクショー！！　#まいにちチクショー'
          });
        }
      )
    );
  });

  it('args space', async () => {
    await responder.on(
      createMockMessage(
        parseStringsOrThrow(
          ['lolicon', 'こるく', 'にえっちを申し込む'],
          responder.schema
        ),
        (message) => {
          expect(message).toStrictEqual({
            description: `だから僕はこるく にえっちを申し込むを辞めた - める (Music Video)`
          });
        },
        {
          senderName: 'める'
        }
      )
    );
  });

  it('args null (hukueki)', async () => {
    await responder.on(
      createMockMessage(
        parseStringsOrThrow(['hukueki'], responder.schema),
        (message) => {
          expect(message).toStrictEqual({
            description: '服役できなかった。',
            title: '引数が不足してるみたいだ。'
          });
        }
      )
    );
  });

  it('args null (lolicon)', async () => {
    await responder.on(
      createMockMessage(
        parseStringsOrThrow(['lolicon'], responder.schema),
        (message) => {
          expect(message).toStrictEqual({
            description: 'こるくはロリコンをやめられなかった。',
            title: '引数が不足してるみたいだ。'
          });
        }
      )
    );
  });

  it('args null (dousureba)', async () => {
    await responder.on(
      createMockMessage(
        parseStringsOrThrow(['dousureba'], responder.schema),
        (message) => {
          expect(message).toStrictEqual({
            description: 'どうしようもない。',
            title: '引数が不足してるみたいだ。'
          });
        }
      )
    );
  });

  it('args null (takopi)', async () => {
    await responder.on(
      createMockMessage(
        parseStringsOrThrow(['takopi'], responder.schema),
        (message) => {
          expect(message).toStrictEqual({
            description: '(引数が)わ、わかんないっピ.......',
            title: '引数が不足してるみたいだ。'
          });
        }
      )
    );
  });

  it('args null (n)', async () => {
    await responder.on(
      createMockMessage(
        parseStringsOrThrow(['n'], responder.schema),
        (message) => {
          expect(message).toStrictEqual({
            title: '引数が不足してるみたいだ。',
            description:
              'このままだと <@521958252280545280> みたいに留年しちゃう....'
          });
        }
      )
    );
  });

  it('args null (web3)', async () => {
    await responder.on(
      createMockMessage(
        parseStringsOrThrow(['web3'], responder.schema),
        (message) => {
          expect(message).toStrictEqual({
            title: '引数が不足してるみたいだ。',
            description:
              'TCP/IP、SMTP、HTTPはGoogleやAmazonに独占されています。'
          });
        }
      )
    );
  });

  it('args null (moeta)', async () => {
    await responder.on(
      createMockMessage(
        parseStringsOrThrow(['moeta'], responder.schema),
        (message) => {
          expect(message).toStrictEqual({
            title: '引数が不足してるみたいだ。',
            description:
              '[元ネタ](https://twitter.com/yuki_yuigishi/status/1555557259798687744)'
          });
        }
      )
    );
  });

  it('args null (kenjou)', async () => {
    await responder.on(
      createMockMessage(
        parseStringsOrThrow(['kenjou'], responder.schema),
        (message) => {
          expect(message).toStrictEqual({
            title: '引数が不足してるみたいだ。',
            description:
              'はらちょのミーム機能を使うときは引数を忘れない方がいい - 健常者エミュレータ事例集Wiki'
          });
        }
      )
    );
  });

  it('args null (koume)', async () => {
    await responder.on(
      createMockMessage(
        parseStringsOrThrow(['koume'], responder.schema),
        (message) => {
          expect(message).toStrictEqual({
            title: '引数が不足してるみたいだ。',
            description:
              'MEMEを表示しようと思ったら〜♪ 引数が足りませんでした〜♪ チクショー！！'
          });
        }
      )
    );
  });

  it('delete message', async () => {
    const fn = vi.fn();
    await responder.on(
      createMockMessage(
        parseStringsOrThrow(['fukueki', 'こるく'], responder.schema),
        fn
      )
    );
    expect(fn).not.toHaveBeenCalled();
  });
});

describe('sanitizeArgs', () => {
  it('rids pollution', () => {
    expect(
      sanitizeArgs(['--yes', '--__proto__=0', '-n', '-constructor', 'hoge'])
    ).toStrictEqual(['--yes', '-n', 'hoge']);
  });
});
