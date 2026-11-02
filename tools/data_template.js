// Starting league (made by tools/gen_data.py; edit that, not this file):
// every member of the Association of American Universities with a varsity
// soccer team, in the 2030 season after the AAU took over college
// athletics. Women's and men's are separate dynasties (the switch in the top
// bar). The program lists come from the owner's AAU Dynasty file, with two
// fixes: Tulane has no women's soccer team (it isn't on Wikipedia's list of
// Division I women's soccer programs), and Caltech's women's team (head
// coach Scott Wilson, hired 2025) was added.
//
// Conferences are the commissioner's alignment from the AAU Dynasty. In men's
// soccer UAB is a Pac-10 affiliate (its other sports are in the Southwest
// Conference, which has no men's soccer). Realign in the offseason, or before
// the first kickoff from each team page. Colors are each school's real
// colors.
//
// Ratings: ATT (attack), MID (midfield and possession) and DEF (defense and
// goalkeeping), 40–99, stored internally as off / pit / def. OVR comes from
// each program's 2025 season:
// - Women's: the 2025 NCAA tournament (Wikipedia, "2025 NCAA Division I
//   women's soccer tournament": champion Florida State, runner-up Stanford,
//   semifinalist Duke; Vanderbilt, Washington, Michigan State and Ohio State
//   reached the quarterfinals), the final 2025 United Soccer Coaches poll
//   (Stanford 2, Duke 3, Vanderbilt 5, Washington 6, Michigan State 7,
//   Virginia 8, Ohio State 9, Georgetown 10, Notre Dame 11, Colorado 12,
//   North Carolina 13, Kansas 14, Iowa 21, UCLA 22, Wisconsin 23), the rest
//   of the AAU teams in the field (Illinois, Northwestern, Penn State,
//   Dartmouth), conference titles (Princeton won the Ivy, Boston University
//   the Patriot) and records from school sites (Kansas 16-6-3, Columbia
//   6-7-3, Penn 5-4-6, Cornell 5-7-4, Rutgers 4-7-5, UC San Diego 5-6-8).
//   Teams without a result to go on are placed by their 2026 preseason
//   conference polls.
// - Men's: the 2025 NCAA tournament (Wikipedia: champion Washington; seeds
//   Princeton 3, Maryland 4, Indiana 6, Georgetown 7, Stanford 12; also in
//   the field Virginia, Duke, North Carolina, Notre Dame, Michigan, Cornell,
//   UCLA, UC Irvine) and the final 2025 polls.
// - Division III and Canadian programs sit below Division I (OVR 40–54),
//   ordered by their real 2025 results: WashU's women won their second
//   straight national title over Emory (21-2-1); Tufts's women reached the
//   semifinals and Case Western (14-2-4) the second round. Tufts's men won
//   the national title (20-1-3), Emory's men (16-2-4) reached the
//   semifinals and WashU's men (14-4-1) won the UAA. Toronto's men (10-1-1)
//   won the OUA. The rest are estimates.
//
// Head coaches are the real ones for the 2026 season (school athletics
// sites, Wikipedia's list of Division I men's soccer coaches, checked
// November 2026; the Ivy men's coaches are from that list's 2023 entries).
// UAB's women's coach Mark Hiller is the interim. Coaches who couldn't be
// confirmed (Carnegie Mellon's women, UC Santa Cruz, McGill's women) start
// as open jobs.

import { DEFAULT_LOGOS } from './logo-import.js?v=20261101210330';

export const START_YEAR = 2030;

// The commissioner's conference alignment (from the AAU Dynasty), each with a
// logo drawn for these dynasties (img/conf/, made by tools/conf_logos.py,
// transparent backgrounds).
const L = f => `img/conf/${f}.svg`;
export const CONFERENCES = {
  'Big Ten': { abbr: 'B1G', color: '#0088CE', altColor: '#0B2A4A', logo: L('bigten') },
  'Coastal Atlantic Conference': { abbr: 'CAC', color: '#3A4A5C', altColor: '#5CC6C2', logo: L('cac') },
  'Ivy League': { abbr: 'IVY', color: '#026937', altColor: '#C9B37E', logo: L('ivy') },
  'Metro Conference': { abbr: 'METRO', color: '#E03A3E', altColor: '#23262D', logo: L('metro') },
  'Pacific-10 Conference': { abbr: 'P10', color: '#092346', altColor: '#D6A84B', logo: L('pac10') },
  'Southwest Conference': { abbr: 'SWC', color: '#719AE8', altColor: '#F28C38', logo: L('swc') },
  'UC Athletic Association': { abbr: 'UCAA', color: '#0F6E7A', altColor: '#F2C14E', logo: L('ucaa') },
  'University Athletic Association': { abbr: 'UAA', color: '#003087', altColor: '#F2B33D', logo: L('uaa') },
};

// [school, conference, abbr, mascot, color, altColor, OVR]
const WOMEN = [
/*WOMEN*/,
];
const MEN = [
/*MEN*/,
];

// Home fields: [stadium, city]. Every one can be edited on the team page.
export const SITES = {
/*SITES*/,
};

// Names the logo lists may know a school by.
export const LOGO_ALIASES = { 'Penn': 'Pennsylvania', 'Miami': 'Miami', 'UC Santa Barbara': 'UC Santa Barbara', 'George Washington': 'George Washington' };

// Head coaches for the 2026 season (see above). By 2030 some will have moved
// on; rename anyone on the Coaches page.
export const COACHES = {
/*WCOACH*/,
};
export const MEN_COACHES = {
/*MCOACH*/,
};

function hashName(s) { let h = 2166136261; for (const c of s) h = Math.imul(h ^ c.charCodeAt(0), 16777619) >>> 0; return h; }

export function makeTeam({ school, conference, abbr, mascot = '', coach = '', coachId = null, color = '#555555', altColor = '#dddddd', off = 65, pit = 65, def = 65, stadium, city }) {
  const known = SITES[school] || [];
  return {
    school, conference, abbr: abbr || school.replace(/[^A-Za-z ]/g, '').split(/\s+/).map(w => w[0]).join('').slice(0, 4).toUpperCase(),
    mascot, coach, coachId, color, altColor, off, pit, def, base: { off, pit, def }, logoOverride: null,
    stadium: stadium || known[0] || '', city: city || known[1] || '',
  };
}

// Gives a team its home field from SITES if it has none yet (older saves).
export function fillSite(t) {
  if (t.stadium !== undefined && t.city !== undefined) return;
  const known = SITES[t.school] || [];
  t.stadium ??= known[0] || '';
  t.city ??= known[1] || '';
}

// OVR → ATT / MID / DEF: each team leans a little one way (a high-scoring
// attack, a possession team, a stingy back line), keeping the same OVR.
export function splitOvr(school, ovr) {
  const h = hashName(school);
  const a = (h % 7) - 3, b = ((h >>> 4) % 5) - 2;
  const off = ovr + a, pit = ovr + b, def = Math.round(ovr - (0.4 * a + 0.3 * b) / 0.3);
  const c = x => Math.max(40, Math.min(99, x));
  return { off: c(off), pit: c(pit), def: c(def) };
}

// Women's and men's are separate leagues (the switch at the top of the
// page). `side` is 'women' (the default) or 'men'.
export const SIDES = {
  women: { label: "Women's", name: 'AAU Soccer' },
  men: { label: "Men's", name: "AAU Men's Soccer" },
};
export const sideOf = league => (league?.side === 'men' ? 'men' : 'women');

export function seedTeams(side = 'women') {
  const teams = {};
  const men = side === 'men';
  for (const [school, conference, abbr, mascot, color, altColor, ovr] of men ? MEN : WOMEN) {
    teams[school] = makeTeam({ school, conference, abbr, mascot, coach: (men ? MEN_COACHES : COACHES)[school] || '', color, altColor, ...splitOvr(school, ovr) });
    // The AAU Dynasty's logos win over the automatic logo lists.
    teams[school].logoOverride = DEFAULT_LOGOS[school] || null;
  }
  return teams;
}
// Conferences each side starts with: only those with teams in that sport.
export function conferencesFor(side) {
  const used = new Set((side === 'men' ? MEN : WOMEN).map(r => r[1]));
  return Object.fromEntries(Object.entries(CONFERENCES).filter(([c]) => used.has(c)));
}
