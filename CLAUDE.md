# AAU Soccer

A college soccer dynasty set in 2030, women's and men's as two separate
dynasties behind a switch in the top bar: women's has the 71 AAU schools
with women's soccer, men's the 52 with men's soccer (Division I, Division III
and Canadian members). It started as a copy of AAU Volleyball (itself from
the owner's MCS Dynasty) and keeps that engine and its features, adapted to
soccer.

**It is not synced with MCS Dynasty, SACAA Dynasty, AAU Volleyball, AAU
Softball & Baseball or AAU Dynasty.** Changes here aren't ported to those
repos, and theirs aren't ported here, unless the owner asks.

## Soccer adaptations to keep in mind

- Game fields keep the MCS names: `homeLine`/`awayLine` are goals per period
  (1st half, 2nd half, then up to two golden-goal overtimes), `homeR`/`awayR`
  goals, `homeH`/`awayH` shots, `homeE`/`awayE` shots on goal, and `g.pk` the
  penalty kicks made ({ home, away }) after a level knockout match. A record's
  `rs`/`ra` are goals for and against.
- **Ties:** a match level on goals is a tie (`isTie`, `resultFor` in
  `js/standings.js`), even when penalty kicks decided who advanced
  (`winnerOf` returns the shootout winner, or null for a regular-season tie).
  Records carry `t`, `ct`, `ht`, `at`, `nt`; winning percentage counts a tie
  as half. Conference standings are points: 3 a win, 1 a tie (`confPts`).
  Never assume a match has a winner outside the bracket code.
- Regular-season matches never go to overtime; every other type does
  (`isKnockout` in `js/sim.js`).
- Ratings are stored as `off`, `pit`, `def` and shown as ATT (attack), MID
  (midfield and possession), DEF (defense and goalkeeping). OVR = 0.4/0.3/0.3.
- Schedule: two matches a week, Thursday and Sunday; conference play is a
  single round robin (`confTarget = min(n - 1, confMatches)`); non-conference
  matches pair nearby teams of similar level; no invitationals.
- Postseason stages keep the MCS internal names: `regionals` = regions,
  `supers` = super regionals, `mcws` = the College Cup. With
  `ncaa.homeSites` (the default) region matches are at the higher seed's
  field over two weeks (`node.wk`, `postWeeks().regional2`). Women's default
  is 4 regions of 8 (32 teams), men's 4 of 6 (24, top two seeds bye).
  Conference tournaments are single elimination only. User-facing text never
  says NCAA, MCWS, set, kills, innings or runs.
- On-screen text says "match", not "game".
- Women's and men's: `league.side` is 'women' (or missing) or 'men'. Each
  side has its own save key (`js/store.js`), team rows (`js/data.js`, made by
  `tools/gen_data.py` from `tools/data_template.js`; edit those, then
  regenerate) and default settings (`defaultSettings(side)`). Keep features
  shared; put differences in data or settings.
- Teams start in the owner's conferences (the AAU Dynasty alignment) with
  drawn logos (`tools/conf_logos.py`, transparent SVGs in `img/conf/`).
  Ratings come from the 2025 season (Wikipedia, school sites), with D-III and
  Canadian programs at 40–54. Coaches are the real 2026 head coaches. Say
  where data came from in `js/data.js`.

## Before every commit

- `python3 tools/stamp.py`
- `sh tools/check.sh`
- `node tests/logic.test.mjs`
- `python3 tests/ui_test.py` (Playwright; Chromium is preinstalled)
