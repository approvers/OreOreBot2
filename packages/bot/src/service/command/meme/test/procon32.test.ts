import { describe, expect, it } from 'vitest';

import { parseStringsOrThrow } from '../../../../adaptor/proxy/command/schema.js';
import { createMockMessage } from '../../command-message.js';
import { Meme } from '../../meme.js';

describe('meme', () => {
  const responder = new Meme();

  it('use case of procon32', async () => {
    await responder.on(
      createMockMessage(
        parseStringsOrThrow(['procon32', 'Blockly'], responder.schema),
        (message) => {
          expect(message).toStrictEqual({
            description:
              `ちょっとねー僕はちょっと怒ってますはい。あの、みなさんこれ気づいてないのかもしんないけど
これBlocklyのサイトを見ていただければわかるんですけど
これBlocklyそのままです
そうですよねぇw、あなたたち何を作ったんですか？
じゃぁあなた達が作った部分は何なんですか
これほとんどBlocklyのサンプルプログラムそのものですよね
これの表示もBlocklyがやってるんですよね？で、実行にかんしては、そのまた別のライブラリなんですよね
いわゆる共同編集の部分だけしか作ってないってことなんですかね？
ぼくはそうは思わないですね
申し訳ないですけど、僕はこれを見た感じではもうBlocklyそのものであって
自分でこーど書いてるとは僕はみなさないですね
申し訳ないですけど
それも見ました
見ましたけども、コードの量は非常に少ない
あの、Blocklyとかでジェネレートされた部分そのままでしたし、Blocklyのコード量見ました？
何行ぐらいあります？プログラム`
          });
        }
      )
    );
  });

  it('args null (procon32)', async () => {
    await responder.on(
      createMockMessage(
        parseStringsOrThrow(['procon32'], responder.schema),
        (message) => {
          expect(message).toStrictEqual({
            title: '引数が不足してるみたいだ。',
            description: '【急募】批評対象'
          });
        }
      )
    );
  });
});
