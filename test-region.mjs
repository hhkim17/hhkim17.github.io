// 지역 판정과 예치금 자가 점검: node test-region.mjs
import assert from 'node:assert/strict';
import { guFromAddress, regionOf } from './normalize.mjs';
import { depositFor, judgeRank } from './rank.mjs';

assert.equal(guFromAddress('경기도 수원시 장안구 정자동'), '수원시');
assert.equal(guFromAddress('경기 남양주시 다산동'), '남양주시');
assert.equal(guFromAddress('남양주왕숙 행복주택'), '남양주시');
assert.equal(guFromAddress('양주옥정 행복주택'), '양주시');
assert.equal(guFromAddress('서울특별시 강남구 역삼동'), '강남구');
assert.equal(guFromAddress('대흥역 리마크빌 마포'), '마포구');
assert.equal(guFromAddress('경기도 광명시 중앙로'), '광명시');
assert.equal(regionOf({ areaName: '경기', address: '경기도 수원시' }), '경기');
assert.equal(regionOf({ areaName: '서울', address: '서울특별시 강남구' }), '서울');
assert.equal(regionOf({ areaName: '', address: '', gu: '하남시' }), '경기');
assert.equal(depositFor(84), 300);
assert.equal(depositFor(84, '경기'), 200);
assert.equal(depositFor(120, '경기'), 400);
assert.equal(depositFor(120, '서울'), 1000);
const apt = { kind: 'APT', kindLabel: '민영', flags: {} };
assert.equal(judgeRank(apt, { accountYears: 2, depositManwon: 200, residence: '경기' }, 84).rank, 1);
assert.equal(judgeRank(apt, { accountYears: 2, depositManwon: 200, residence: '서울' }, 84).rank, 2);
console.log('지역 판정 통과');
