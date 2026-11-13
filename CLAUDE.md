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
  single round robin, or a double round robin (home and away) for a
  conference of 6 or fewer (`confTarget`, `DOUBLE_ROUND_ROBIN_MAX`); non-conference
  matches pair nearby teams of similar level (few marquee games each: top-third
  pairings get costlier per one a team has, `MARQUEE` in `js/schedule.js`); no invitationals.
- Postseason stages keep the MCS internal names: `regionals` = regions,
  `supers` = super regionals, `mcws` = the College Cup. With
  `ncaa.homeSites` (the default) the first round is at the higher seed's
  field and the last `topHostRounds` (2) region rounds the next week at the
  region's top seed's field (`node.wk`, `postWeeks().regional2`). Women's default
  is 4 regions of 8 (32 teams), men's 4 of 6 (24, top two seeds bye).
  Conference tournaments are single elimination only. User-facing text never
  says NCAA, MCWS, set, kills, innings or runs.
- Selection uses the Power Index (NPI): `npi` in `js/standings.js`, with
  each side's NCAA Division III dials in `settings.npi` (`NPI_BY_SIDE` in
  `js/league.js`), when `settings.index` is 'npi' (the default;
  `indexVersion` 1 switched older saves from the current or next season
  on). A level game counts as a tie in the NPI even if penalty kicks or a
  shootout decided it. The committee goes straight down the NPI: no tiers
  (`sheet.tiers` empty). `rating(season)` gives the season's index in the
  RPI's shape (value in `rpi`, plus `rank`, `sosRank`); use it, not
  `rpi()`, and `indexName(season)` for on-screen labels.
- The AAU look (Nov. 2026, the same as AAU Field Hockey's, built to match the
  owner's mockups): a two-row top bar (brand row, then the menu); scoreboard
  cards (`gameCard`: the conference's color bar and logo, a row per team with
  each half and the final, the loser faded); standings with the conference
  list down the side (`st-*`), each conference in its colors (`confVars`,
  `confHead`; points, conference W-L-T, PB), All conferences compact, the
  last 5 (postseason included) opening the poll's match pop-up; the poll as a
  board (`pb-*`) beside movers, receiving votes and dropped out, under the
  No. 1 team's card; the team page header in the team's colors with title
  banners and a numbers strip (`teamHero`) and schedule boxes (`ts2-*`: one
  regular-season box, conference logo on conference matches, a box per
  tournament, a venue column, the result opening the box score);
  Postseason → Full bracket (`renderBoard`). Navy `--board`, gold `--optic`;
  Oswald, Saira Condensed, Inter.
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
- Regionals avoid first-round matchups between conference rivals
  (`avoidConferenceMatchups` in `js/postseason.js`, the owner's rule): after
  the serpentine, teams on one seed line trade regionals (lowest lines
  first), then, as a last resort, a team moves one seed line; the top line
  never moves. `pods(field, n, season)` applies it, so bracketology, the
  selection preview and the announced field agree. Bracketology and the
  preview show each regional's first-round matchups.

## Before every commit

- `python3 tools/stamp.py`
- `sh tools/check.sh`
- `node tests/logic.test.mjs`
- `python3 tests/ui_test.py` (Playwright; Chromium is preinstalled)
