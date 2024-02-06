import { expect, it } from 'vitest';

import { parseStringsOrThrow } from '../../adaptor/proxy/command/schema.js';
import { DepRegistry } from '../../driver/dep-registry.js';
import { createMockMessage } from './command-message.js';
import { KokuseiChousa, memberStatsKey } from './kokusei-chousa.js';

it('use case of kokusei-chousa', async () => {
  const reg = new DepRegistry();
  reg.add(memberStatsKey, {
    allMemberCount(): Promise<number> {
      return Promise.resolve(150);
    },
    botMemberCount(): Promise<number> {
      return Promise.resolve(50);
    }
  });
  const responder = new KokuseiChousa(reg);
  await responder.on(
    createMockMessage(
      parseStringsOrThrow(['kokusei'], responder.schema),
      (message) => {
        expect(message).toStrictEqual({
          title: '***†只今の限界開発鯖の人口†***',
          fields: [
            {
              name: '人間+Bot',
              value: `150人`,
              inline: true
            },
            {
              name: '人類の数',
              value: '100人',
              inline: true
            },
            { name: 'Botの数', value: `50人`, inline: true },
            { name: 'Bot率', value: '33.333%' }
          ]
        });
      }
    )
  );
});
