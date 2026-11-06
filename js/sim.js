// Soccer match simulator. Plays the match minute by minute from the teams'
// ratings: ATT (attack, stored as `off`), MID (midfield and possession,
// `pit`) and DEF (defense and goalkeeping, `def`). College rules:
// - two 45-minute halves; in the regular season a match level after 90
//   minutes is a tie (no overtime since 2022);
// - in the postseason (conference tournaments and the national tournament) a
//   tied match goes to two 10-minute golden-goal overtime periods, then
//   penalty kicks: five each, then sudden death. A match decided on
//   penalties goes in the record book as a tie, and the shootout winner
//   advances.
//
// The result keeps the field names the rest of the app uses for every game:
// homeLine / awayLine are goals per period (1st half, 2nd half, then any
// overtime periods), R is goals, H is shots, E is shots on goal, `innings`
// is the number of periods played and `pk` the shootout ({ home, away }).
// A simulation is only a suggestion — the commissioner reviews and saves it.

import { rng as makeRng } from './util.js?v=20261105175242';

export const OVR_WEIGHTS = { off: 0.4, pit: 0.3, def: 0.3 };
const ovrExact = t => t.off * OVR_WEIGHTS.off + t.pit * OVR_WEIGHTS.pit + t.def * OVR_WEIGHTS.def;
export function ovr(t) { return Math.round(ovrExact(t)); }

export const HALF = 45, OT = 10, OT_PERIODS = 2;
const GOALS = 1.32;      // goals per team per 90 minutes between equal teams
const SHOTS = 12.5;      // shots per team per 90 minutes between equal teams
const ON_TARGET = 0.44;  // share of shots on goal
const TALENT = 26;       // rating points per unit of log goal rate (lower = fewer upsets)
const HOME = 0.08;       // home field, on the log goal rate

// Goals a team expects per 90 minutes against this opponent.
function goalRate(att, opp, home, vol) {
  const x = ((att.off - opp.def) * 0.6 + (att.pit - opp.pit) * 0.4) / TALENT / vol + (home ? HOME : -HOME / 2);
  return GOALS * Math.exp(x);
}

// Whether a match goes to overtime and penalties: every postseason match.
export const isKnockout = g => !!g && g.type && g.type !== 'regular';

// Play `minutes` minutes. With `golden`, stop at the first goal.
function playPeriod(minutes, rate, shotRate, r, stats, golden) {
  const goals = { home: 0, away: 0 };
  for (let m = 0; m < minutes; m++) {
    for (const side of ['home', 'away']) {
      if (r() >= shotRate[side] / 90) continue;
      stats[side].H++;
      if (r() >= ON_TARGET) continue;
      stats[side].E++;
      // Chance an on-target shot goes in, so goals average `rate`.
      if (r() < Math.min(0.9, rate[side] / (shotRate[side] * ON_TARGET))) goals[side]++;
      if (golden && goals.home !== goals.away) return goals; // golden goal: the first goal ends it
    }
  }
  return goals;
}

// Penalty kicks: five each, then sudden death. A better attack scores a
// little more often, a better goalkeeper (DEF) saves a little more.
function shootout(home, away, r) {
  const p = (shooter, keeper) => Math.max(0.6, Math.min(0.9, 0.76 + (shooter.off - keeper.def) / 400));
  const ph = p(home, away), pa = p(away, home);
  let h = 0, a = 0;
  for (let k = 1; k <= 5; k++) {
    if (r() < ph) h++;
    if (h > a + (5 - k + 1) || a > h + (5 - k)) break; // home can't be caught / away can't catch up
    if (r() < pa) a++;
    if (h > a + (5 - k) || a > h + (5 - k)) break;
  }
  for (let k = 0; h === a && k < 30; k++) { const x = r() < ph, y = r() < pa; h += x; a += y; }
  if (h === a) h++; // never happens; a guard
  return { home: h, away: a };
}

export function simulateGame(homeTeam, awayTeam, game = {}, { seed, volatility = 1 } = {}) {
  const r = makeRng(seed);
  const neutral = !!game.neutral;
  const rate = { home: goalRate(homeTeam, awayTeam, !neutral, volatility), away: goalRate(awayTeam, homeTeam, false, volatility) };
  if (neutral) rate.away = goalRate(awayTeam, homeTeam, false, volatility) * Math.exp(HOME / 2), rate.home = goalRate(homeTeam, awayTeam, false, volatility) * Math.exp(HOME / 2);
  // Better teams take more shots, not just better ones.
  const shotRate = { home: SHOTS * Math.sqrt(rate.home / GOALS), away: SHOTS * Math.sqrt(rate.away / GOALS) };
  const stats = { home: { H: 0, E: 0 }, away: { H: 0, E: 0 } };
  const homeLine = [], awayLine = [];
  for (let half = 0; half < 2; half++) {
    const g = playPeriod(HALF, rate, shotRate, r, stats, false);
    homeLine.push(g.home); awayLine.push(g.away);
  }
  const total = l => l.reduce((a, b) => a + b, 0);
  let pk = null;
  if (isKnockout(game) && total(homeLine) === total(awayLine)) {
    for (let p = 0; p < OT_PERIODS && total(homeLine) === total(awayLine); p++) {
      const g = playPeriod(OT, rate, shotRate, r, stats, true);
      homeLine.push(g.home); awayLine.push(g.away);
    }
    if (total(homeLine) === total(awayLine)) pk = shootout(homeTeam, awayTeam, r);
  }
  return {
    homeLine, awayLine,
    home: { R: total(homeLine), H: stats.home.H, E: stats.home.E },
    away: { R: total(awayLine), H: stats.away.H, E: stats.away.E },
    innings: homeLine.length, runRule: false, pk,
  };
}

// Shots and shots on goal for a score entered by hand, from the goals and
// both teams' ratings: about nine shots per goal-free match plus two and a
// half per goal, a little more for the stronger team; shots on goal never
// fewer than the goals.
export function estimateHitsErrors(homeTeam, awayTeam, game, homeLine, awayLine, { seed } = {}) {
  const r = makeRng(seed ?? 1);
  const goals = l => l.reduce((a, b) => a + (Number(b) || 0), 0);
  const minutes = 90 + Math.max(0, homeLine.length - 2) * OT;
  const one = (g, me, opp) => {
    const lean = Math.exp(((me.off - opp.def) * 0.6 + (me.pit - opp.pit) * 0.4) / TALENT / 2);
    const H = Math.max(g, Math.round((8 * lean + g * 2.5 + r() * 4 - 2) * minutes / 90));
    const E = Math.min(H, Math.max(g, Math.round(H * (ON_TARGET + (r() - 0.5) * 0.12))));
    return { H, E };
  };
  return { home: one(goals(homeLine), homeTeam, awayTeam), away: one(goals(awayLine), awayTeam, homeTeam) };
}

// Home team's chances: win, tie and loss over 90 minutes, from a Poisson
// model of the two goal rates (a close fit to the simulator).
export function matchOdds(homeTeam, awayTeam, game = {}, { volatility = 1 } = {}) {
  const neutral = !!game.neutral;
  const lh = goalRate(homeTeam, awayTeam, !neutral, volatility) * (neutral ? Math.exp(HOME / 2) : 1);
  const la = goalRate(awayTeam, homeTeam, false, volatility) * (neutral ? Math.exp(HOME / 2) : 1);
  const pois = (l, k) => { let p = Math.exp(-l); for (let i = 1; i <= k; i++) p *= l / i; return p; };
  let win = 0, tie = 0, loss = 0;
  for (let i = 0; i <= 12; i++) for (let j = 0; j <= 12; j++) {
    const p = pois(lh, i) * pois(la, j);
    if (i > j) win += p; else if (i === j) tie += p; else loss += p;
  }
  const n = win + tie + loss;
  return { win: win / n, tie: tie / n, loss: loss / n };
}

// Home team's chance to win. In a knockout match a tie goes to overtime and
// penalties, so it is split about evenly (a little toward the better team);
// in the regular season it is the chance of a win, with ties counted as half.
export function winProbability(homeTeam, awayTeam, game = {}, opts = {}) {
  const o = matchOdds(homeTeam, awayTeam, game, opts);
  return o.win + o.tie * (o.win / (o.win + o.loss || 1) * 0.3 + 0.35);
}

// Slower check of the formula above by simulating the matchup (ties as half).
export function simulatedWinRate(homeTeam, awayTeam, game = {}, opts = {}, n = 2000) {
  let wins = 0;
  for (let i = 0; i < n; i++) {
    const res = simulateGame(homeTeam, awayTeam, game, { ...opts, seed: i * 7919 + 1 });
    if (res.home.R > res.away.R || (res.pk && res.pk.home > res.pk.away)) wins++;
    else if (res.home.R === res.away.R && !res.pk) wins += 0.5;
  }
  return wins / n;
}
