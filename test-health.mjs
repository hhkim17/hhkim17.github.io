// 자가 점검: node test-health.mjs
import assert from 'node:assert';
import { assess } from './health.mjs';
import { lhNotices } from './lh.mjs';

const row = (kind, receiptEnd) => ({ kind, receiptEnd });
const FUTURE = '2999-01-01', PAST = '2000-01-01';
const prev = (rows) => ({ builtAt: Date.now(), listings: rows });
const others = Array.from({ length: 50 }, () => row('APT', FUTURE));

// 접수 중 2건 + 마감 20건이던 종류가 0이 되면 고장
const mixed = [...others, row('REMNDR', FUTURE), row('REMNDR', FUTURE), ...Array(20).fill(row('REMNDR', PAST))];
assert.deepStrictEqual(assess(prev(mixed), { listings: others }).carryKinds, ['REMNDR']);

// 전부 마감이던 종류가 0이 되는 건 고장이 아니다 (HUG 사례)
const closed = [...others, ...Array(14).fill(row('HUG', PAST))];
assert.deepStrictEqual(assess(prev(closed), { listings: others }).carryKinds, []);

// 원래 몇 건 안 되던 종류는 0이어도 고장이 아니다
const small = [...others, row('RENT', FUTURE), row('RENT', FUTURE)];
assert.deepStrictEqual(assess(prev(small), { listings: others }).carryKinds, []);

// LH 서버가 죽으면 32구간을 다 돌지 않고 3번째 실패에서 멈춘다
let calls = 0;
const realFetch = globalThis.fetch;
globalThis.fetch = async () => { calls++; throw new Error('boom'); };   // 재시도 없는 오류
await assert.rejects(lhNotices('k', { cnpCd: '11' }), /boom/);
assert.strictEqual(calls, 3);
globalThis.fetch = realFetch;

console.log('ok');
