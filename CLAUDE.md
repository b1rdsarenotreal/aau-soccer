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
- Non-conference dates are shuffled (`shuffleNonConfRounds`, the owner's
  ask, Nov. 2026): the non-conference weekends are drawn one after another,
  each pairing similar teams, so a top team's best opponents would come in
  a row; the rounds are then dealt out to the non-conference dates at random.
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
- Travel partners (`js/partners.js`, the owner's ask, Nov. 2026): in a
  conference of four or more, nearby schools travel as a pair (picked by
  distance, `autoPartners`; the commissioner can re-pair them or turn them
  off in Standings → Commissioner: `settings.partners[conf]`,
  `settings.partnersOff[conf]`). A pair visits a pair for a weekend: each
  visitor plays one host on the first day and the other on the second.
  Partners meet on their pair's open weekend (or a rivalry weekend); a
  school without a partner (the odd one out, or any the commissioner sets:
  `settings.partnerSolos[conf]`; every school's partner is a menu) plays
  both schools of a pair in a weekend, or one match against another school on
  its own. No team is away more than two conference weekends in a row, or
  home more than three (the owner's rule, Nov. 2026: hosts and the order of
  weekends are searched for it). A partner match can't share a weekend with
  a school on its own (three schools need three days).
  `partnerRounds` builds everyone-once, everyone-twice or in between (second
  meetings left out by whole weekends where it can), with hosts chosen so
  each team is home for half (one off at most when meetings aren't all
  doubled); when it can't (an 8-team single round robin, for one), the
  conference gets the plain round robin. `season.partnerConfs` lists the
  conferences scheduled in pairs.
- Conference home and away (`js/homeaway.js`, the owner's rule, Nov. 2026):
  no team plays more than two conference weekends in a row away (`MAX_AWAY`)
  or three at home (`MAX_HOME`); a week without a conference match ends a
  run. `generateSchedule` draws the season (`drawSchedule`), then
  `spreadConfHomes` trades hosts between a pair's two meetings, turns around
  triangles of single meetings or a single meeting (every team within one
  match or series of half), and trades two conference weeks when every team
  plays on the same days in both. A pair meeting twice keeps one at each
  school. Travel-partner conferences are left alone (they're built that
  way). A once-a-year pair swaps hosts from last year unless the rule needs
  otherwise.
- Seeds on screen in the national tournament (`shownSeed` in
  `js/postseason.js`, the owner's rule, Nov. 2026): every team keeps its
  region seed all the way through, so a 1 seed is still a 1 at the finals,
  whatever region it came from. National seeds (`shownNationalSeed`) show
  only where they're named (a region's top seeds) and with no regions.
- Regionals avoid first-round matchups between conference rivals
  (`avoidConferenceMatchups` in `js/postseason.js`, the owner's rule): after
  the serpentine, teams on one seed line trade regionals (lowest lines
  first), then, as a last resort, a team moves one seed line; the top line
  never moves. `pods(field, n, season)` applies it, so bracketology, the
  selection preview and the announced field agree. Bracketology and the
  preview show each regional's first-round matchups.
- The Greater South Conference (the owner's, coming in; Kansas, Missouri,
  Tulane, UAB, Vanderbilt, Iowa State, Saint Louis, Memphis) has its logo
  ready (`gsc.svg`, the owner's pick: slanted GSC, striped S, compass in the
  G; Saira Black): it's in the Add conference pick (`AAU_CONFERENCES`), and
  a Greater South made by hand gets it on load (`migrateLeague`).
- The Horizon Valley Conference (the owner's, coming in; Loyola Chicago, UIC,
  IU Indianapolis, UMKC, Missouri S&T, Cincinnati, Dayton, West Virginia,
  Ohio, Southern Illinois) has its logo ready the same way (`hvc.svg`, the
  owner's pick: slanted HVC in Archivo Expanded Black with white, orange and
  plum outlines, a striped orange sun rising behind).
- The Western Athletic Conference is coming back (the owner's; Northern
  Arizona, San Diego State, Nevada, UNLV, Oregon State, BYU, Utah State,
  Washington State) with the owner's pick for its logo, the 1992–2010 WAC
  logo linked from the web (`CONF_LOGO_LINKS.wac`), ready the same way.
- Realignment from AAU Dynasty (`js/realign.js`, Nov. 2026): the hub's
  Realignment page leaves a plan in IndexedDB `aau-realignment` (read
  when the app loads or comes back into view, never created here); the
  Offseason page shows it (`realignBanner`) with a review where each move,
  join and leave can be unticked (`realignModal`). Only teams in the AAU's
  all-sports conferences move; schools join only if they play this sport
  (`AAU_PROGRAMS`), at `JOIN_RATING` (60) with their venue and logo; new
  conferences get their logo; empty ones can be retired. Applied or skipped
  is kept in `league.realign[planId]`.

## Before every commit

- `python3 tools/stamp.py`
- `sh tools/check.sh`
- `node tests/logic.test.mjs`
- `python3 tests/ui_test.py` (Playwright; Chromium is preinstalled)
