import type { MemeTemplate } from '../../../model/meme-template.js';

const positionalKeys = ['content'] as const;

export const procon32: MemeTemplate<never, never, (typeof positionalKeys)[number]> =
  {
    commandNames: ['procon32'],
    description: '大会の趣旨にそぐわない攻撃的批評を展開します。',
    pageName: 'procon32',
    requiredPositionalKeys: positionalKeys,
    errorMessage: '【急募】批評対象',
    generate({requiredPositionals: {content}}) {
      return "ちょっとねー僕はちょっと怒ってますはい。あの、みなさんこれ気づいてないのかもしんないけど\nこれ"+content+"のサイトを見ていただければわかるんですけど\nこれ"+content+"そのままです\nそうですよねぇw、あなたたち何を作ったんですか？\nじゃぁあなた達が作った部分は何なんですか\nこれほとんど"+content+"のサンプルプログラムそのものですよね\nこれの表示も"+content+"がやってるんですよね？で、実行にかんしては、そのまた別のライブラリなんですよね\nいわゆる共同編集の部分だけしか作ってないってことなんですかね？\nぼくはそうは思わないですね\n申し訳ないですけど、僕はこれを見た感じではもう"+content+"そのものであって\n自分でこーど書いてるとは僕はみなさないですね\n申し訳ないですけど\nそれも見ました\n見ましたけども、コードの量は非常に少ない\nあの、"+content+"とかでジェネレートされた部分そのままでしたし、"+content+"のコード量見ました？\n何行ぐらいあります？プログラム";
    }
  };
