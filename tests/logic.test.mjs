// Logic tests: run with `node tests/logic.test.mjs`
import assert from 'node:assert/strict';
import { ALIGNMENT, newLeague, currentSeason, simGames, startNextSeason, beginOffseason, draftWarnings, applyResult, clearResult, estimateHE, migrateLeague, addConference, rebuildSchedule, weekName } from '../js/league.js';
import { simulateGame, winProbability, simulatedWinRate, matchOdds, ovr } from '../js/sim.js';
import { confRounds, confSeriesCounts, confTarget, DEFAULT_REG_WEEKS, DEFAULT_MAX_MATCHES } from '../js/schedule.js';
import { records, confStandings, rpi, isFinal, isTie, winnerOf, resultFor, confPts, INDEPENDENT } from '../js/standings.js';
import { gameVenue, postseasonFinish, postseasonRecord, wsTeams, ncaaProblems, fieldSize, DEFAULT_NCAA, postWeeks, ncaaConfig } from '../js/postseason.js';
import { recordBook } from '../js/records.js';
import { readAauLogos, applyAauLogos } from '../js/logo-import.js';
import { seedTeams, splitOvr, COACHES, MEN_COACHES, CONFERENCES, conferencesFor } from '../js/data.js';
import { existsSync } from 'node:fs';
import { rng } from '../js/util.js';

const t0 = Date.now();
let n = 0;
const check = (name, fn) => {
  try { fn(); } catch (e) { console.error(`✗ ${name}`); throw e; }
  n++;
};
const reg = s => s.games.filter(g => g.type === 'regular');
const count = (games, pick = () => true) => { const c = {}; for (const g of games) for (const t of [g.home, g.away]) if (pick(g, t)) c[t] = (c[t] || 0) + 1; return c; };

check('every AAU soccer program, women\'s and men\'s, in the commissioner\'s conferences', () => {
  const w = seedTeams('women'), m = seedTeams('men');
  assert.equal(Object.keys(w).length, 71);
  assert.equal(Object.keys(m).length, 52);
  assert.ok(w.Caltech && !w.Tulane, 'Caltech\'s women are in; Tulane has no women\'s soccer');
  assert.equal(m.UAB.conference, 'Pacific-10 Conference', 'UAB is a Pac-10 affiliate in men\'s soccer');
  for (const side of ['women', 'men']) {
    const teams = seedTeams(side), confs = conferencesFor(side);
    assert.ok(Object.values(teams).every(t => confs[t.conference]), `${side}: every team is in a starting conference`);
    assert.ok(Object.values(teams).every(t => t.stadium && t.city && t.color && t.mascot), `${side}: fields, cities, colors, mascots`);
    for (const t of Object.values(teams)) assert.ok(Math.abs(ovr(t) - (t.off * 0.4 + t.pit * 0.3 + t.def * 0.3)) < 1);
    const coaches = Object.values(teams).map(t => t.coach).filter(Boolean);
    assert.equal(new Set(coaches).size, coaches.length, `${side}: every coach is a different person`);
  }
  assert.ok(Object.values(w).filter(t => !t.coach).length <= 3 && Object.values(m).filter(t => !t.coach).length <= 2, 'only a few open jobs');
  assert.ok(!conferencesFor('men')['Southwest Conference'], 'no Southwest Conference in men\'s soccer');
  for (const c of Object.keys(CONFERENCES)) assert.ok((/^https:\/\//.test(CONFERENCES[c].logo) || existsSync(new URL(`../${CONFERENCES[c].logo}`, import.meta.url))), `${c} logo`);
  const s = splitOvr('Stanford', 90);
  assert.ok(Math.abs(0.4 * s.off + 0.3 * s.pit + 0.3 * s.def - 90) <= 0.5);
  assert.ok(w.Stanford.off > w.Caltech.off + 30, 'Division I above Division III');
});

check('matches: 90 minutes and a tie in the regular season; overtime and penalties in the postseason', () => {
  const T = seedTeams('women'), A = T.Stanford, B = T['North Carolina'];
  let ties = 0, goals = 0, homeWins = 0;
  const N = 3000;
  for (let i = 0; i < N; i++) {
    const r = simulateGame(A, B, { type: 'regular' }, { seed: i + 1 });
    assert.equal(r.homeLine.length, 2);
    assert.equal(r.home.R, r.homeLine[0] + r.homeLine[1]);
    assert.ok(!r.pk);
    assert.ok(r.home.E >= r.home.R && r.home.H >= r.home.E, 'shots ≥ on goal ≥ goals');
    if (r.home.R === r.away.R) ties++;
    if (r.home.R > r.away.R) homeWins++;
    goals += r.home.R + r.away.R;
  }
  console.log(`  ${(100 * ties / N).toFixed(1)}% ties, ${(goals / N / 2).toFixed(2)} goals per team`);
  assert.ok(ties / N > 0.12 && ties / N < 0.35, 'about one match in five is a tie');
  assert.ok(goals / N / 2 > 1.1 && goals / N / 2 < 2.2, 'about 1.5 goals per team');
  let pks = 0, ots = 0;
  for (let i = 0; i < N; i++) {
    const r = simulateGame(A, B, { type: 'regional' }, { seed: i + 1 });
    assert.ok(r.homeLine.length >= 2 && r.homeLine.length <= 4);
    for (let k = 2; k < r.homeLine.length; k++) assert.ok(r.homeLine[k] + r.awayLine[k] <= 1, 'golden goal: at most one goal in an overtime');
    if (r.homeLine.length > 2) ots++;
    if (r.home.R === r.away.R) { assert.ok(r.pk && r.pk.home !== r.pk.away && r.homeLine.length === 4, 'level after two overtimes: penalty kicks decide it'); pks++; }
    else assert.ok(!r.pk);
  }
  assert.ok(ots > N * 0.1 && pks > N * 0.05, 'knockout matches go to overtime and penalties');
  // Better teams win more; the odds model adds up.
  const o = matchOdds(T.Stanford, T.Caltech, { type: 'regular' });
  assert.ok(Math.abs(o.win + o.tie + o.loss - 1) < 1e-9 && o.win > 0.85);
  const even = matchOdds(T.Stanford, T.Stanford, { type: 'regular', neutral: true });
  assert.ok(Math.abs(even.win - even.loss) < 0.01 && even.tie > 0.2);
  const est = winProbability(T.Stanford, T.Iowa, { type: 'regional' }), simd = simulatedWinRate(T.Stanford, T.Iowa, { type: 'regional' }, {}, 1500);
  assert.ok(Math.abs(est - simd) < 0.07, `knockout win chance ${est.toFixed(2)} vs simulated ${simd.toFixed(2)}`);
});

check('hand-entered scores get shots', () => {
  const L = newLeague(), s = currentSeason(L), g = reg(s)[0];
  const e = estimateHE(s, g, [2, 1], [0, 0]);
  assert.ok(e.home.E >= 3 && e.home.H >= e.home.E && e.away.H >= e.away.E);
});

check('schedule: two matches a week, Thursday and Sunday; a single round robin in conference', () => {
  for (const side of ['women', 'men']) {
    const L = newLeague({ side }), s = currentSeason(L), g = reg(s);
    assert.equal(s.regWeeks, DEFAULT_REG_WEEKS);
    assert.ok(g.every(x => ['Thu', 'Sun'].includes(x.day)), `${side}: Thursday and Sunday`);
    // Never two matches on one day; at most two a week.
    const day = new Set();
    for (const x of g) for (const t of [x.home, x.away]) { const k = `${t}|${x.week}|${x.day}`; assert.ok(!day.has(k), k); day.add(k); }
    const perWeek = count(g, (x, t) => true);
    const wk = {};
    for (const x of g) for (const t of [x.home, x.away]) wk[`${t}|${x.week}`] = (wk[`${t}|${x.week}`] || 0) + 1;
    assert.ok(Object.values(wk).every(k => k <= 2));
    // Season totals: about 18, never over the cap.
    const totals = Object.values(perWeek);
    console.log(`  ${side}: ${Math.min(...totals)}–${Math.max(...totals)} matches per team`);
    assert.ok(Math.min(...totals) >= 14 && Math.max(...totals) <= DEFAULT_MAX_MATCHES);
    // Conference play: everyone once, the same number for every member,
    // home and away balanced.
    const conf = count(g.filter(x => x.confGame)), home = count(g.filter(x => x.confGame), (x, t) => t === x.home);
    const sizes = {};
    for (const t of Object.values(s.teams)) sizes[t.conference] = (sizes[t.conference] || 0) + 1;
    for (const t of Object.values(s.teams)) {
      if (t.conference === INDEPENDENT) continue;
      assert.equal(conf[t.school], confTarget(sizes[t.conference]), `${t.school}: everyone once (twice in a conference of 6 or fewer)`);
      assert.ok(Math.abs(2 * (home[t.school] || 0) - conf[t.school]) <= 1, `${t.school} home/away`);
    }
    // Big conferences meet once; small ones twice, once at each school.
    const meets = {};
    for (const x of g.filter(x => x.confGame)) (meets[[x.home, x.away].sort().join('|')] ||= []).push(x.home);
    for (const [k, homes] of Object.entries(meets)) {
      const size = sizes[s.teams[k.split('|')[0]].conference];
      if (size <= 6) assert.ok(homes.length === 2 && homes[0] !== homes[1], `${k}: home and away`);
      else assert.equal(homes.length, 1, `${k}: once`);
    }
    // Non-conference matches never pair conference rivals, and a team with a
    // conference match in a week plays no non-conference match that week.
    assert.ok(g.every(x => x.confGame || s.teams[x.home].conference !== s.teams[x.away].conference));
    const confWeek = new Set(g.filter(x => x.confGame).flatMap(x => [`${x.home}|${x.week}`, `${x.away}|${x.week}`]));
    assert.equal(g.filter(x => !x.confGame && (confWeek.has(`${x.home}|${x.week}`) || confWeek.has(`${x.away}|${x.week}`))).length, 0);
    // Conference play ends on the last weekend.
    assert.ok(g.filter(x => x.confGame).some(x => x.week === s.regWeeks));
    assert.ok(g.filter(x => x.week === 1).every(x => !x.confGame));
  }
});

check('conference round robins are fair at every size', () => {
  const r = rng(7);
  for (let k = 3; k <= 16; k++) {
    const list = Array.from({ length: k }, (_, i) => `T${i}`);
    const rounds = confRounds(list, 22, r);
    const c = confSeriesCounts(rounds, list);
    assert.equal(new Set(Object.values(c)).size, 1, `${k} teams`);
    // An odd number of teams can't all play an odd number of matches.
    const want = (k * confTarget(k)) % 2 ? confTarget(k) - 1 : confTarget(k);
    assert.equal(Object.values(c)[0], want, `${k} teams play ${want}`);
  }
  assert.equal(confTarget(8), 7); assert.equal(confTarget(11), 10); assert.equal(confTarget(16), 11);
});

check('standings: 3 points a win, 1 a tie; ties count half in winning percentage', () => {
  const L = newLeague(), s = currentSeason(L);
  const confG = reg(s).filter(g => g.confGame && s.teams[g.home].conference === 'Ivy League').sort((a, b) => a.week - b.week || a.order - b.order);
  const [g1, g2] = confG.filter(g => g.home === confG[0].home || g.away === confG[0].home);
  const T = confG[0].home;
  applyResult(g1, { homeLine: [1, 0], awayLine: [1, 0], home: { R: 1, H: 9, E: 4 }, away: { R: 1, H: 8, E: 3 } }, 'manual');
  const other = g2.home === T ? 'home' : 'away';
  applyResult(g2, { homeLine: other === 'home' ? [2, 0] : [0, 0], awayLine: other === 'away' ? [2, 0] : [0, 0], home: { R: other === 'home' ? 2 : 0, H: 9, E: 5 }, away: { R: other === 'away' ? 2 : 0, H: 6, E: 2 } }, 'manual');
  assert.ok(isTie(g1) && winnerOf(g1) === null && resultFor(g1, T) === 'T');
  const recs = records(s);
  assert.equal(`${recs[T].w}-${recs[T].l}-${recs[T].t}`, '1-0-1');
  assert.equal(confPts(recs[T]), 4);
  const st = confStandings(s, 'Ivy League', recs, rpi(s));
  assert.equal(st[0].team, T);
  assert.equal(st[0].pts, 4);
});

check('postseason results: a match decided on penalty kicks is a tie in the records', () => {
  const g = { type: 'regional', home: 'A', away: 'B', homeR: 1, awayR: 1, pk: { home: 4, away: 5 }, final: true, homeLine: [1, 0, 0, 0], awayLine: [0, 1, 0, 0] };
  assert.equal(winnerOf(g), 'B');
  assert.equal(resultFor(g, 'A'), 'T');
  assert.equal(resultFor(g, 'B'), 'T');
});

check('a match is at the home team\'s field; week names', () => {
  const L = newLeague(), s = currentSeason(L);
  const g = reg(s).find(x => !x.neutral);
  assert.equal(gameVenue(s, g).stadium, s.teams[g.home].stadium);
  const W = postWeeks(s);
  assert.deepEqual(W, { conf: 11, regional: 12, regional2: 13, mcws: 14 });
  assert.equal(weekName(12, s), 'First Round');
  assert.equal(weekName(13, s), 'Second & Third Rounds');
  assert.equal(weekName(14, s), 'College Cup');
});

check('tournament format checks', () => {
  assert.equal(fieldSize(DEFAULT_NCAA), 32);
  assert.equal(fieldSize({ regionals: 4, perRegional: 6, wsSize: 4 }), 24);
  assert.deepEqual(ncaaProblems(DEFAULT_NCAA, 71), []);
  assert.ok(ncaaProblems({ regionals: 3, perRegional: 8, wsSize: 4 }, 71).length);
  assert.ok(ncaaProblems({ regionals: 4, perRegional: 8, wsSize: 4 }, 20).length);
});

// A whole women's season.
const league = newLeague();
const s = currentSeason(league);
simGames(s, undefined, { autoLock: true, max: 6000 });

check('women\'s season: conference tournaments, 32 teams in four regions of eight, the College Cup', () => {
  assert.equal(s.phase, 'complete');
  const R = reg(s);
  assert.ok(R.every(isFinal));
  const ties = R.filter(isTie).length;
  assert.ok(ties > R.length * 0.08 && ties < R.length * 0.35, 'ties happen');
  assert.ok(R.every(g => !g.pk && g.homeLine.length === 2), 'no overtime in the regular season');
  // Conference tournaments: single elimination, rested days, at the host.
  for (const ev of Object.values(s.post.confT)) {
    assert.equal(ev.kind, 'single');
    const gs = s.games.filter(g => g.event === ev.id);
    const day = new Set();
    for (const g of gs) for (const t of [g.home, g.away]) { const k = `${t}|${g.day}`; assert.ok(!day.has(k), 'one match a day'); day.add(k); }
    assert.ok(gs.every(g => g.home === ev.host || g.site === ev.host || g.neutral));
    assert.ok(ev.champion);
  }
  const sizes = Object.fromEntries(Object.values(s.post.confT).map(ev => [ev.conf, ev.size]));
  assert.equal(sizes['Big Ten'], 6); assert.equal(sizes['Ivy League'], 4);
  // The field.
  assert.equal(s.post.field.length, 32);
  assert.equal(s.post.regionals.length, 4);
  const W = postWeeks(s);
  for (const ev of s.post.regionals) {
    assert.equal(ev.seeds.length, 8);
    const gs = s.games.filter(g => g.event === ev.id);
    assert.equal(gs.length, 7);
    // The first round at the higher seed's field; the last two rounds at the top seed's field.
    for (const g of gs) {
      if (/First round/.test(g.label)) { assert.ok(!g.neutral && ev.seeds.indexOf(g.home) < ev.seeds.indexOf(g.away), 'the higher seed is at home'); continue; }
      assert.equal(gameVenue(s, g).host, ev.seeds[0], `${g.label}: at the top seed's field`);
      if (g.home === ev.seeds[0] || g.away === ev.seeds[0]) assert.ok(g.home === ev.seeds[0] && !g.neutral, 'the top seed is at home');
      else assert.ok(g.neutral && g.site === ev.seeds[0], 'neutral, hosted by the top seed');
    }
    assert.ok(gs.filter(g => /First round/.test(g.label)).every(g => g.week === W.regional));
    assert.ok(gs.filter(g => !/First round/.test(g.label)).every(g => g.week === W.regional2));
    assert.ok(gs.filter(g => /Quarterfinal/.test(g.label)).every(g => g.day === 'Sun'));
  }
  const cup = s.games.filter(g => g.type === 'mcws');
  assert.equal(cup.length, 3);
  assert.ok(cup.every(g => g.neutral && gameVenue(s, g).stadium === 'CPKC Stadium'));
  assert.ok(s.games.filter(g => g.type !== 'regular').every(g => g.homeR !== g.awayR || g.pk), 'every knockout match has a winner');
  assert.equal(postseasonFinish(s, s.post.champion), 'National champion');
  assert.equal(wsTeams(s).length, 4);
  for (const t of wsTeams(s)) if (t !== s.post.champion && t !== s.post.runnerUp) assert.equal(postseasonFinish(s, t), 'College Cup');
  const pr = postseasonRecord(s, s.post.champion);
  assert.equal(pr.ncaa.w + pr.ncaa.t, 5, "three region rounds and two College Cup matches");
  assert.ok(s.polls.final);
});

check('men\'s season: 24 teams in four regions of six, the top two seeds wait a round', () => {
  const M = newLeague({ side: 'men' }), ms = currentSeason(M);
  assert.equal(M.side, 'men');
  assert.equal(M.name, "AAU Men's Soccer");
  assert.deepEqual(ncaaConfig(ms), { regionals: 4, perRegional: 6, wsSize: 4, homeSites: true, topHostRounds: 2 });
  simGames(ms, undefined, { autoLock: true, max: 6000 });
  assert.equal(ms.phase, 'complete');
  assert.equal(ms.post.field.length, 24);
  const W = postWeeks(ms);
  for (const ev of ms.post.regionals) {
    const gs = ms.games.filter(g => g.event === ev.id);
    assert.equal(gs.length, 5);
    const first = gs.filter(g => g.week === W.regional).flatMap(g => [g.home, g.away]);
    assert.ok(!first.includes(ev.seeds[0]) && !first.includes(ev.seeds[1]), 'seeds 1 and 2 have byes');
    assert.equal(first.length, 4);
    for (const g of gs.filter(g => g.week === W.regional)) assert.ok(!g.neutral && ev.seeds.indexOf(g.home) < ev.seeds.indexOf(g.away), 'first round at the higher seed');
    for (const g of gs.filter(g => g.week === W.regional2)) assert.equal(gameVenue(ms, g).host, ev.seeds[0], 'the last two rounds at the top seed\'s field');
  }
  assert.ok(ms.games.filter(g => g.type === 'mcws').every(g => gameVenue(ms, g).stadium === 'WakeMed Soccer Park'));
  // The women's dynasty is untouched.
  assert.ok(!Object.keys(ms.teams).includes('Caltech') || seedTeams('men').Caltech);
  assert.equal(currentSeason(league).teams.Stanford.conference, 'Pacific-10 Conference');
});

check('clearing a knockout result removes the penalty kicks', () => {
  const g = s.games.find(x => x.pk);
  if (!g) return;
  const copy = { ...g };
  clearResult(copy);
  assert.ok(!copy.pk && !copy.final);
});

check('logos from the AAU Dynasty', () => {
  const L = newLeague(), s0 = currentSeason(L);
  assert.ok(s0.teams.Caltech.logoOverride.includes('Caltech_beavers'), 'new dynasties start with the AAU Dynasty logos');
  assert.ok(currentSeason(newLeague({ side: 'men' })).teams.Toronto.logoOverride.includes('Varsity_Blues'));
  delete L.logoSet; s0.teams.Caltech.logoOverride = null; s0.teams.NYU.logoOverride = 'https://example.com/mine.png';
  migrateLeague(L);
  assert.ok(s0.teams.Caltech.logoOverride.includes('Caltech_beavers'));
  assert.equal(s0.teams.NYU.logoOverride, 'https://example.com/mine.png');
  const backup = { schools: [{ id: 'tex', name: 'University of Texas at Austin', short: 'Texas', logo: 'data:image/png;base64,AAAA' }], conferences: { c1: { name: 'Ivy League', logo: 'https://e.com/ivy.png' } } };
  const got = applyAauLogos(L, readAauLogos(backup));
  assert.deepEqual(got, { teams: ['Texas'], conferences: ['Ivy League'] });
  assert.throws(() => readAauLogos({ seasons: {} }));
});

check('an unstarted saved dynasty picks up the commissioner\'s conferences', () => {
  const L = newLeague(), s0 = currentSeason(L);
  delete L.alignment;
  s0.teams.Stanford.conference = 'Big Ten';
  migrateLeague(L);
  assert.equal(L.alignment, ALIGNMENT);
  assert.equal(s0.teams.Stanford.conference, 'Pacific-10 Conference');
});

check('record book', () => {
  const B = recordBook(league);
  assert.ok(B.games.length > 600);
  assert.ok(B.games.some(g => g.tie));
  assert.ok(B.programs.some(x => x.titles === 1));
  assert.ok(B.programs.every(x => x.t != null));
});

check('offseason and the next season', () => {
  beginOffseason(league);
  assert.ok(Array.isArray(draftWarnings(league)));
  addConference(league, 'Pacific Coast', { abbr: 'PAC', color: '#123456' });
  for (const t of ['UCLA', 'USC', 'Stanford', 'California', 'Oregon', 'Washington', 'Arizona', 'Arizona State', 'Utah', 'Colorado']) league.draft.teams[t].conference = 'Pacific Coast';
  const s2 = startNextSeason(league);
  assert.equal(s2.year, 2031);
  const conf = count(reg(s2).filter(g => g.confGame && s2.teams[g.home].conference === 'Pacific Coast'));
  assert.equal(Object.keys(conf).length, 10);
  assert.ok(Object.values(conf).every(k => k === 9), 'the new conference plays everyone once');
  rebuildSchedule(s2, s);
  assert.ok(reg(s2).length > 0);
});

check('a saved league loads again', () => {
  const copy = JSON.parse(JSON.stringify(league));
  migrateLeague(copy);
  assert.equal(copy.currentYear, 2031);
});

console.log(`${n} checks ok in ${Date.now() - t0} ms`);

// ---- NPI ----
{
  const { npi, rating, records: recsOf } = await import('../js/standings.js');
  const { NPI_BY_SIDE } = await import('../js/league.js');
  for (const side of ['women', 'men']) {
    const lg = newLeague({ side }), s = currentSeason(lg);
    assert.equal(s.settings.index, 'npi', 'new leagues use the NPI');
    assert.deepEqual(s.settings.npi, NPI_BY_SIDE[side], `${side} has its own NPI dials`);
    simGames(s, g => g.type === 'regular', { max: 12000 });
    const n = npi(s), r = rating(s), recs = recsOf(s);
    const vals = Object.values(n).filter(x => x.games).map(x => x.npi);
    const mean = vals.reduce((a, b) => a + b, 0) / vals.length;
    assert.ok(Math.abs(mean - 50) < 4, `NPI averages near 50 (${mean.toFixed(2)})`);
    for (const [t, x] of Object.entries(n)) {
      if (!x.games) continue;
      assert.equal(r[t].rpi, x.npi, 'rating() is the NPI');
      // NPI wins: a game won on penalty kicks or a shootout is a tie there.
      assert.ok(x.adj.w >= Math.min(Math.ceil(s.settings.npi.minWins), x.adj.w + x.dropped), `${t} keeps its minimum wins`);
      assert.ok(x.adj.l <= recs[t].l && x.adj.l + x.adj.t + x.adj.w + x.dropped === x.games, 'only wins are dropped');
    }
    const old = JSON.parse(JSON.stringify(lg)); delete old.indexVersion; Object.assign(currentSeason(old).settings, { index: undefined, npi: undefined });
    migrateLeague(old);
    assert.equal(currentSeason(old).settings.index, 'npi');
    assert.deepEqual(currentSeason(old).settings.npi, NPI_BY_SIDE[side]);
  }
  console.log('NPI ok');
}
