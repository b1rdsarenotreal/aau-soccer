# AAU Soccer

A commissioner-style college soccer dynasty, women's and men's. It's 2030: the
NCAA has collapsed and the **Association of American Universities** runs
college athletics. This dynasty covers **every AAU member with a varsity
soccer team**: 71 women's programs and 52 men's, from NCAA Division I,
Division III and the Canadian members. It has box scores with goals by half,
overtime and penalty kicks, ties, points-table standings, the RPI, a voters'
poll, conference tournaments, the **AAU National Tournament** through the
**College Cup**, coaches, the offseason and a record book.

It's built on the MCS Dynasty engine (by way of AAU Volleyball) and works the
same way, with soccer's rules, schedule and tournament.

Open `index.html` through any static web server (GitHub Pages works: Settings
→ Pages → Deploy from a branch → `main`, `/ (root)`). The dynasty saves in the
browser; **Settings → Download backup** keeps a copy or moves it to another
device.

## Women's and men's

The switch at the top of every page flips between two **completely separate
dynasties**. Each has its own teams, conferences, schedule, ratings, coaches,
polls, postseason, history, records, settings and backups; switching saves the
one you're on and opens the other where you left it.

## The league

Both start in the owner's conference alignment from the AAU Dynasty, each
conference with a drawn logo. Only conferences with teams in that sport
appear: the Southwest Conference has no men's soccer, and **UAB plays men's
soccer as a Pac-10 affiliate**.

| Conference | Women's | Men's |
|---|---|---|
| Big Ten | 11 | 7 |
| University Athletic Association | 11 | 11 |
| Pacific-10 Conference | 10 | 5 |
| Metro Conference | 9 | 8 |
| Coastal Atlantic Conference | 8 | 6 |
| Ivy League | 8 | 8 |
| Southwest Conference | 7 | — |
| UC Athletic Association | 7 | 7 |

The program lists come from the owner's AAU Dynasty file, with two fixes:
Tulane has no women's soccer team, and Caltech's women's team was added.
Every team has its school's real colors, its real 2026 head coach (a few
Division III and Canadian jobs couldn't be confirmed and start open) and its
soccer stadium and city. Realign in the offseason, or before the first
kickoff from each team page.

## Ratings

Every team has three ratings from 40 to 99:

| Rating | What it covers |
|---|---|
| **ATT** | Attack: chances and finishing |
| **MID** | Midfield and possession: control of the match |
| **DEF** | Defense and goalkeeping |

**OVR = 40% ATT + 30% MID + 30% DEF.** Starting ratings come from each
program's 2025 season: the NCAA tournaments (Florida State won the women's
title over Stanford; Washington won the men's), the final United Soccer
Coaches polls, conference titles and records from school sites. Division III
and Canadian programs start at 40–54, ordered by their real 2025 results
(WashU's women won their second straight national title; Tufts's men won
theirs). `js/data.js` says where each number came from.

Ratings move with results during the season, and teams develop between
seasons, as in MCS Dynasty.

## Matches

- **Two 45-minute halves**, played minute by minute from the ratings. Teams
  average about 1.6 goals and 12 shots a match, and about one regular-season
  match in five ends level.
- **Regular season:** a match level after 90 minutes is a **tie** (no
  overtime, as in college soccer since 2022).
- **Conference tournaments and the national tournament:** a level match goes
  to **two 10-minute golden-goal overtimes**, then **penalty kicks** (five
  each, then sudden death). A match decided on penalties counts as a **tie in
  both records**; the shootout winner advances.
- **Match cards and box scores** show goals by period (1st, 2nd, OT, 2OT),
  goals, shots and shots on goal, penalty kicks in parentheses, and Final/OT,
  Final/2OT or Final/PK. Before a regular-season match the card shows the
  favorite's chance to win and the chance of a tie.
- **Entering a score:** goals for each half (overtimes and penalty kicks in
  knockout matches). The editor checks the rules: overtime only after a level
  90 minutes, at most one golden goal, and penalties only after two
  overtimes. Shots left blank are estimated from the goals.

## The season

- **Ten weeks**, starting the week of the last Thursday in August, **two
  matches a week, Thursday and Sunday** (each conference can pick other days
  on the Standings page).
- **Conference play is a single round robin**: everyone once, home or away,
  with home and away balanced. **A conference of 6 or fewer plays a double
  round robin**: everyone twice, once at home and once away. A conference needs a week per two rounds, so
  bigger conferences start earlier and everyone finishes on the last weekend.
- **Non-conference matches** fill the weeks before: two a week against teams
  from other conferences, leaning toward nearby schools of a similar level and
  avoiding repeat opponents, up to the season cap (20). Teams play about
  16–20 regular-season matches.
- A team with a **conference bye** in one of a week's slots plays just its one
  conference match that week. A team with no match at all that week gets one
  non-conference match if another team is free.
- **Standings are a points table: 3 for a win, 1 for a tie.** Records read
  W-L-T, and winning percentages count a tie as half a win (RPI, polls and the
  committee too). Tiebreakers: head-to-head points, then points against common
  opponents, then RPI.

## The postseason

1. **Conference tournaments:** single elimination at one member's field, the
   final on Sunday with a day's rest between rounds. Conferences of 9 or more
   take their top 6 (seeds 1 and 2 wait for 3 v 6 and 4 v 5); 5 to 8 take
   their top 4. Change the size per conference on the Standings page. The
   champion gets the automatic bid.
2. **Selection:** automatic bids plus at-large picks by the committee, which
   compares teams tier by tier (RPI, quadrant wins, strength of schedule,
   head-to-head and more). You pick, confirm and seed the field.
3. **The national tournament:** **women's 32 teams** in four regions of
   eight; **men's 24 teams** in four regions of six, where the top two seeds
   in each wait a round (like the NCAA's 48-team men's field). Every match is
   at the **higher seed's field**: the first round one week, the second round
   (Thursday) and the quarterfinal (Sunday) the next.
4. **The College Cup:** the four region winners at a neutral site, semifinals
   Thursday and the final Sunday. Women's: CPKC Stadium, Kansas City. Men's:
   WakeMed Soccer Park, Cary, N.C. Both can be changed in Settings.

**Settings → AAU National Tournament** changes the shape: the number of regions
and teams in each, super regionals, a bigger College Cup, or all the region
matches at the top seed's field in one week.

## The offseason, history and records

As in MCS Dynasty: realign conferences, add teams and conferences, the
coaching carousel and hot seat, coach and program prestige, and rating points
to place on ATT, MID and DEF. Team, coach and conference pages keep W-L-T
records by season. The **Records** page has program records, single-season
records (most goals, fewest goals allowed, best goal differential, winning
streaks), single-match records (most goals, biggest win, most combined goals,
highest-scoring tie, most shots, longest shootout), poll records and coaching
records.

## Logos

Logos set in the owner's **AAU Dynasty** come first. To bring in newer ones,
use **Settings → Backups → Logos from an AAU Dynasty backup**. Everyone else
gets a logo from the college logo list MCS uses (ESPN logos), plus ESPN's
women's college soccer team list for schools without football. Any team or
conference can get its own logo on its page.

## Development

Plain ES modules, no build step. Before every commit:

```
python3 tools/stamp.py      # version-stamp script and stylesheet links
sh tools/check.sh           # every module parses
node tests/logic.test.mjs   # engine tests
python3 tests/ui_test.py    # browser test (Playwright + Chromium)
```

| File | What it does |
|---|---|
| `js/data.js` | Teams, conferences, stadiums, ratings, coaches (made by `tools/gen_data.py`) |
| `js/sim.js` | Minute-by-minute match simulator, overtime, penalties, odds |
| `js/ratings.js` | In-season rating movement |
| `js/schedule.js` | Non-conference and conference schedules |
| `js/standings.js` | W-L-T records, points tables, tiebreakers, RPI, quadrants |
| `js/polls.js` | Power ratings and the voters' poll |
| `js/postseason.js` | Conference tournaments, selection, the national tournament |
| `js/league.js` | Seasons, results, coaches, offseason |
| `js/records.js`, `js/hotseat.js` | Record book, hot seat |
| `js/views-*.js`, `js/ui.js` | Pages |
| `tools/conf_logos.py` | Draws the conference logos in `img/conf/` |
