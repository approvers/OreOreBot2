import { Meme, sanitizeArgs } from './meme.js';
import { describe, expect, it, vi } from 'vitest';
import type { EmbedMessage } from '../model/embed-message.js';
import { createMockMessage } from './command-message.js';

describe('meme', () => {
  const responder = new Meme();

  it('use case of hukueki', async () => {
    await responder.on(
      'CREATE',
      createMockMessage(
        {
          args: ['hukueki', 'こるく']
        },
        (message) => {
          expect(message).toStrictEqual({
            description:
              'ねぇ、将来何してるだろうね\n' +
              'こるくはしてないといいね\n' +
              '困らないでよ'
          });
          return Promise.resolve();
        }
      )
    );
  });

  it('use case of lolicon', async () => {
    await responder.on(
      'CREATE',
      createMockMessage(
        {
          args: ['lolicon', 'こるく'],
          senderName: 'める'
        },
        (message) => {
          expect(message).toStrictEqual({
            description: `だから僕はこるくを辞めた - める (Music Video)`
          });
          return Promise.resolve();
        }
      )
    );
  });

  it('use case of dousurya', async () => {
    await responder.on(
      'CREATE',
      createMockMessage(
        {
          args: ['dousurya', 'こるく']
        },
        (message) => {
          expect(message).toStrictEqual({
            description: `限界みたいな鯖に住んでるこるくはどうすりゃいいですか？`
          });
          return Promise.resolve();
        }
      )
    );
    await responder.on(
      'CREATE',
      createMockMessage(
        {
          args: ['dousureba', 'こるく']
        },
        (message) => {
          expect(message).toStrictEqual({
            description: `限界みたいな鯖に住んでるこるくはどうすりゃいいですか？`
          });
          return Promise.resolve();
        }
      )
    );
  });

  it('use case of takopi', async () => {
    await responder.on(
      'CREATE',
      createMockMessage(
        {
          args: ['takopi', 'こるく'],
          senderName: 'りにあ'
        },
        (message) => {
          expect(message).toStrictEqual({
            description: `教員「こるく、出して」\nりにあ「わ、わかんないっピ.......」`
          });
          return Promise.resolve();
        }
      )
    );
  });

  it('use case of takopi (-f)', async () => {
    await responder.on(
      'CREATE',
      createMockMessage(
        {
          args: ['takopi', '-f', 'こるく'],
          senderName: 'りにあ'
        },
        (message) => {
          expect(message).toStrictEqual({
            description: `りにあ「こるく、出して」\n教員「わ、わかんないっピ.......」`
          });
          return Promise.resolve();
        }
      )
    );
  });

  it('use case of n', async () => {
    await responder.on(
      'CREATE',
      createMockMessage(
        {
          args: ['n', 'テスト前に課題もやらないで原神してて']
        },
        (message) => {
          expect(message).toStrictEqual({
            description: `テスト前に課題もやらないで原神しててNった`
          });
          return Promise.resolve();
        }
      )
    );
  });

  it('use case of web3', async () => {
    await responder.on(
      'CREATE',
      createMockMessage(
        {
          args: ['web3', 'Rust']
        },
        (message) => {
          expect(message).toStrictEqual({
            description:
              '```\n「いちばんやさしいRustの教本」 - インプレス \n```'
          });
          return Promise.resolve();
        }
      )
    );
  });

  it('args space', async () => {
    await responder.on(
      'CREATE',
      createMockMessage(
        {
          args: ['lolicon', 'こるく', 'にえっちを申し込む'],
          senderName: 'める'
        },
        (message) => {
          expect(message).toStrictEqual({
            description: `だから僕はこるく にえっちを申し込むを辞めた - める (Music Video)`
          });
          return Promise.resolve();
        }
      )
    );
  });

  it('args null (hukueki)', async () => {
    await responder.on(
      'CREATE',
      createMockMessage(
        {
          args: ['hukueki']
        },
        (message) => {
          expect(message).toStrictEqual({
            description: '服役できなかった。',
            title: '引数が不足してるみたいだ。'
          });
          return Promise.resolve();
        }
      )
    );
  });

  it('args null (lolicon)', async () => {
    await responder.on(
      'CREATE',
      createMockMessage(
        {
          args: ['lolicon']
        },
        (message) => {
          expect(message).toStrictEqual({
            description: 'こるくはロリコンをやめられなかった。',
            title: '引数が不足してるみたいだ。'
          });
          return Promise.resolve();
        }
      )
    );
  });

  it('args null (dousureba)', async () => {
    await responder.on(
      'CREATE',
      createMockMessage(
        {
          args: ['dousureba']
        },
        (message) => {
          expect(message).toStrictEqual({
            description: 'どうしようもない。',
            title: '引数が不足してるみたいだ。'
          });
          return Promise.resolve();
        }
      )
    );
  });

  it('args null (takopi)', async () => {
    await responder.on(
      'CREATE',
      createMockMessage(
        {
          args: ['takopi']
        },
        (message) => {
          expect(message).toStrictEqual({
            description: '(引数が)わ、わかんないっピ.......',
            title: '引数が不足してるみたいだ。'
          });
          return Promise.resolve();
        }
      )
    );
  });

  it('args null (n)', async () => {
    await responder.on(
      'CREATE',
      createMockMessage(
        {
          args: ['n']
        },
        (message) => {
          expect(message).toStrictEqual({
            title: '引数が不足してるみたいだ。',
            description:
              'このままだと <@521958252280545280> みたいに留年しちゃう....'
          });
          return Promise.resolve();
        }
      )
    );
  });

  it('args null (web3)', async () => {
    await responder.on(
      'CREATE',
      createMockMessage(
        {
          args: ['web3']
        },
        (message) => {
          expect(message).toStrictEqual({
            title: '引数が不足してるみたいだ。',
            description:
              'TCP/IP、SMTP、HTTPはGoogleやAmazonに独占されています。'
          });
          return Promise.resolve();
        }
      )
    );
  });

  it('delete message', async () => {
    const fn = vi.fn();
    await responder.on(
      'DELETE',
      createMockMessage({
        args: ['hukueki', 'こるく'],
        reply: fn
      })
    );
    expect(fn).not.toHaveBeenCalled();
  });

  it('help of meme', async () => {
    const fn = vi.fn<[EmbedMessage]>(() => Promise.resolve());
    await responder.on(
      'CREATE',
      createMockMessage(
        {
          args: ['takopi', '--help']
        },
        fn
      )
    );
    expect(fn).toHaveBeenCalledWith({
      title: '`takopi`',
      description:
        '「〜、出して」\n`-f` で教員と自分の名前の位置を反対にします。([idea: フライさん](https://github.com/approvers/OreOreBot2/issues/90))'
    });
  });
});

describe('sanitizeArgs', () => {
  it('rids pollution', () => {
    expect(
      sanitizeArgs(['--yes', '--__proto__=0', '-n', '-constructor', 'hoge'])
    ).toStrictEqual(['--yes', '-n', 'hoge']);
  });
});
