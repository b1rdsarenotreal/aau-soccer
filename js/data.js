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

import { DEFAULT_LOGOS } from './logo-import.js?v=20261103152921';

export const START_YEAR = 2030;

// The commissioner's conference alignment (from the AAU Dynasty), each with a
// logo drawn for these dynasties (img/conf/, made by tools/conf_logos.py,
// transparent backgrounds).
// Conference logos the owner picked from the web (linked, not copied; the
// drawn ones in img/conf/ stay for CAC, SWC, UCAA and as fallbacks).
export const CONF_LOGO_LINKS = {
  bigten: 'https://content.sportslogos.net/logos/153/4661/full/big_ten_conference_logo_primary_20115933.png',
  ivy: 'https://content.sportslogos.net/logos/153/4824/full/ivy_league_logo_primary_2019_sportslogosnet-9024.png',
  metro: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/95/METRO_Primary_LtBG.png/500px-METRO_Primary_LtBG.png',
  pac10: 'https://content.sportslogos.net/logos/153/4945/full/pacific-10_conference_logo_wordmark_1995_sportslogosnet-1134.png',
  uaa: 'https://dbukjj6eu5tsf.cloudfront.net/uaasports.info/images/responsive_2023/logo-main.svg',
};
const L = f => CONF_LOGO_LINKS[f] || `img/conf/${f}.svg`;
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
  ['Michigan State', 'Big Ten', 'MSU', 'Spartans', '#18453B', '#FFFFFF', 86],
  ['Ohio State', 'Big Ten', 'OSU', 'Buckeyes', '#BB0000', '#666666', 84],
  ['Iowa', 'Big Ten', 'IOWA', 'Hawkeyes', '#000000', '#FFCD00', 79],
  ['Wisconsin', 'Big Ten', 'WIS', 'Badgers', '#C5050C', '#FFFFFF', 79],
  ['Illinois', 'Big Ten', 'ILL', 'Fighting Illini', '#13294B', '#E84A27', 77],
  ['Penn State', 'Big Ten', 'PSU', 'Nittany Lions', '#041E42', '#FFFFFF', 77],
  ['Northwestern', 'Big Ten', 'NU', 'Wildcats', '#4E2A84', '#FFFFFF', 76],
  ['Michigan', 'Big Ten', 'MICH', 'Wolverines', '#00274C', '#FFCB05', 72],
  ['Minnesota', 'Big Ten', 'MINN', 'Golden Gophers', '#7A0019', '#FFCC33', 68],
  ['Purdue', 'Big Ten', 'PUR', 'Boilermakers', '#000000', '#CFB991', 66],
  ['Indiana', 'Big Ten', 'IND', 'Hoosiers', '#990000', '#EEEDEB', 65],
  ['Duke', 'Coastal Atlantic Conference', 'DUKE', 'Blue Devils', '#00539B', '#FFFFFF', 89],
  ['Virginia', 'Coastal Atlantic Conference', 'UVA', 'Cavaliers', '#232D4B', '#E57200', 86],
  ['Notre Dame', 'Coastal Atlantic Conference', 'ND', 'Fighting Irish', '#0C2340', '#C99700', 84],
  ['North Carolina', 'Coastal Atlantic Conference', 'UNC', 'Tar Heels', '#7BAFD4', '#13294B', 83],
  ['Florida', 'Coastal Atlantic Conference', 'FLA', 'Gators', '#0021A5', '#FA4616', 72],
  ['South Florida', 'Coastal Atlantic Conference', 'USF', 'Bulls', '#006747', '#CFC493', 66],
  ['Maryland', 'Coastal Atlantic Conference', 'MD', 'Terrapins', '#E21833', '#FFD200', 63],
  ['Miami', 'Coastal Atlantic Conference', 'MIA', 'Hurricanes', '#005030', '#F47321', 62],
  ['Princeton', 'Ivy League', 'PRIN', 'Tigers', '#E77500', '#000000', 74],
  ['Dartmouth', 'Ivy League', 'DART', 'Big Green', '#00693E', '#FFFFFF', 72],
  ['Brown', 'Ivy League', 'BRWN', 'Bears', '#4E3629', '#C00404', 70],
  ['Harvard', 'Ivy League', 'HARV', 'Crimson', '#A51C30', '#1E1E1E', 68],
  ['Columbia', 'Ivy League', 'CLMB', 'Lions', '#1D4F91', '#9BCBEB', 64],
  ['Yale', 'Ivy League', 'YALE', 'Bulldogs', '#00356B', '#FFFFFF', 62],
  ['Penn', 'Ivy League', 'PENN', 'Quakers', '#011F5B', '#990000', 61],
  ['Cornell', 'Ivy League', 'COR', 'Big Red', '#B31B1B', '#FFFFFF', 60],
  ['Georgetown', 'Metro Conference', 'GTWN', 'Hoyas', '#041E42', '#63666A', 84],
  ['Boston University', 'Metro Conference', 'BU', 'Terriers', '#CC0000', '#FFFFFF', 66],
  ['Pittsburgh', 'Metro Conference', 'PITT', 'Panthers', '#003594', '#FFB81C', 66],
  ['Rutgers', 'Metro Conference', 'RUTG', 'Scarlet Knights', '#CC0033', '#5F6A72', 64],
  ['Buffalo', 'Metro Conference', 'BUFF', 'Bulls', '#005BBB', '#FFFFFF', 58],
  ['George Washington', 'Metro Conference', 'GW', 'Revolutionaries', '#033C5A', '#AA9868', 58],
  ['Stony Brook', 'Metro Conference', 'SBU', 'Seawolves', '#990000', '#16243E', 58],
  ['Toronto', 'Metro Conference', 'TOR', 'Varsity Blues', '#1E3765', '#FFFFFF', 46],
  ['McGill', 'Metro Conference', 'MCG', 'Martlets', '#ED1B2F', '#FFFFFF', 45],
  ['Stanford', 'Pacific-10 Conference', 'STAN', 'Cardinal', '#8C1515', '#FFFFFF', 92],
  ['Washington', 'Pacific-10 Conference', 'UW', 'Huskies', '#4B2E83', '#B7A57A', 87],
  ['Colorado', 'Pacific-10 Conference', 'COLO', 'Buffaloes', '#000000', '#CFB87C', 83],
  ['UCLA', 'Pacific-10 Conference', 'UCLA', 'Bruins', '#2D68C4', '#F2A900', 79],
  ['USC', 'Pacific-10 Conference', 'USC', 'Trojans', '#990000', '#FFC72C', 77],
  ['Arizona State', 'Pacific-10 Conference', 'ASU', 'Sun Devils', '#8C1D40', '#FFC627', 68],
  ['California', 'Pacific-10 Conference', 'CAL', 'Golden Bears', '#003262', '#FDB515', 68],
  ['Utah', 'Pacific-10 Conference', 'UTAH', 'Utes', '#CC0000', '#000000', 68],
  ['Arizona', 'Pacific-10 Conference', 'ARIZ', 'Wildcats', '#0C234B', '#AB0520', 66],
  ['Oregon', 'Pacific-10 Conference', 'ORE', 'Ducks', '#154733', '#FEE123', 62],
  ['Vanderbilt', 'Southwest Conference', 'VAN', 'Commodores', '#000000', '#CFAE70', 87],
  ['Kansas', 'Southwest Conference', 'KU', 'Jayhawks', '#0051BA', '#E8000D', 82],
  ['Texas', 'Southwest Conference', 'TEX', 'Longhorns', '#BF5700', '#FFFFFF', 74],
  ['Texas A&M', 'Southwest Conference', 'TAMU', 'Aggies', '#500000', '#FFFFFF', 73],
  ['Rice', 'Southwest Conference', 'RICE', 'Owls', '#00205B', '#7C7E7F', 68],
  ['Missouri', 'Southwest Conference', 'MIZ', 'Tigers', '#000000', '#F1B82D', 66],
  ['UAB', 'Southwest Conference', 'UAB', 'Blazers', '#1E6B52', '#F4C300', 62],
  ['UC Irvine', 'UC Athletic Association', 'UCI', 'Anteaters', '#0064A4', '#FFD200', 66],
  ['UC Santa Barbara', 'UC Athletic Association', 'UCSB', 'Gauchos', '#003660', '#FEBC11', 66],
  ['UC Davis', 'UC Athletic Association', 'UCD', 'Aggies', '#022851', '#FFBF00', 60],
  ['UC San Diego', 'UC Athletic Association', 'UCSD', 'Tritons', '#182B49', '#C69214', 56],
  ['UC Riverside', 'UC Athletic Association', 'UCR', 'Highlanders', '#003DA5', '#FFB81C', 54],
  ['UC Santa Cruz', 'UC Athletic Association', 'UCSC', 'Banana Slugs', '#003C6C', '#FDC700', 42],
  ['Caltech', 'UC Athletic Association', 'CIT', 'Beavers', '#FF6C0C', '#333333', 40],
  ['WashU', 'University Athletic Association', 'WUSTL', 'Bears', '#A51417', '#007360', 52],
  ['Emory', 'University Athletic Association', 'EMRY', 'Eagles', '#012169', '#F2A900', 51],
  ['Chicago', 'University Athletic Association', 'UCHI', 'Maroons', '#800000', '#FFFFFF', 50],
  ['Tufts', 'University Athletic Association', 'TUFT', 'Jumbos', '#3E8EDE', '#002E6D', 49],
  ['Case Western', 'University Athletic Association', 'CWRU', 'Spartans', '#0A304E', '#FFFFFF', 48],
  ['Johns Hopkins', 'University Athletic Association', 'JHU', 'Blue Jays', '#002D72', '#68ACE5', 47],
  ['Rochester', 'University Athletic Association', 'ROCH', 'Yellowjackets', '#001E5F', '#FFD100', 47],
  ['Carnegie Mellon', 'University Athletic Association', 'CMU', 'Tartans', '#C41230', '#6D6E71', 46],
  ['MIT', 'University Athletic Association', 'MIT', 'Engineers', '#A31F34', '#8A8B8C', 46],
  ['NYU', 'University Athletic Association', 'NYU', 'Violets', '#57068C', '#FFFFFF', 46],
  ['Brandeis', 'University Athletic Association', 'BRAN', 'Judges', '#003478', '#FFFFFF', 44],
];
const MEN = [
  ['Indiana', 'Big Ten', 'IND', 'Hoosiers', '#990000', '#EEEDEB', 82],
  ['Michigan', 'Big Ten', 'MICH', 'Wolverines', '#00274C', '#FFCB05', 80],
  ['Ohio State', 'Big Ten', 'OSU', 'Buckeyes', '#BB0000', '#666666', 72],
  ['Penn State', 'Big Ten', 'PSU', 'Nittany Lions', '#041E42', '#FFFFFF', 70],
  ['Michigan State', 'Big Ten', 'MSU', 'Spartans', '#18453B', '#FFFFFF', 68],
  ['Wisconsin', 'Big Ten', 'WIS', 'Badgers', '#C5050C', '#FFFFFF', 68],
  ['Northwestern', 'Big Ten', 'NU', 'Wildcats', '#4E2A84', '#FFFFFF', 66],
  ['Maryland', 'Coastal Atlantic Conference', 'MD', 'Terrapins', '#E21833', '#FFD200', 87],
  ['Virginia', 'Coastal Atlantic Conference', 'UVA', 'Cavaliers', '#232D4B', '#E57200', 84],
  ['Duke', 'Coastal Atlantic Conference', 'DUKE', 'Blue Devils', '#00539B', '#FFFFFF', 79],
  ['North Carolina', 'Coastal Atlantic Conference', 'UNC', 'Tar Heels', '#7BAFD4', '#13294B', 77],
  ['Notre Dame', 'Coastal Atlantic Conference', 'ND', 'Fighting Irish', '#0C2340', '#C99700', 76],
  ['South Florida', 'Coastal Atlantic Conference', 'USF', 'Bulls', '#006747', '#CFC493', 66],
  ['Princeton', 'Ivy League', 'PRIN', 'Tigers', '#E77500', '#000000', 84],
  ['Cornell', 'Ivy League', 'COR', 'Big Red', '#B31B1B', '#FFFFFF', 78],
  ['Penn', 'Ivy League', 'PENN', 'Quakers', '#011F5B', '#990000', 70],
  ['Brown', 'Ivy League', 'BRWN', 'Bears', '#4E3629', '#C00404', 66],
  ['Columbia', 'Ivy League', 'CLMB', 'Lions', '#1D4F91', '#9BCBEB', 64],
  ['Harvard', 'Ivy League', 'HARV', 'Crimson', '#A51C30', '#1E1E1E', 64],
  ['Yale', 'Ivy League', 'YALE', 'Bulldogs', '#00356B', '#FFFFFF', 64],
  ['Dartmouth', 'Ivy League', 'DART', 'Big Green', '#00693E', '#FFFFFF', 62],
  ['Georgetown', 'Metro Conference', 'GTWN', 'Hoyas', '#041E42', '#63666A', 86],
  ['Pittsburgh', 'Metro Conference', 'PITT', 'Panthers', '#003594', '#FFB81C', 72],
  ['Rutgers', 'Metro Conference', 'RUTG', 'Scarlet Knights', '#CC0033', '#5F6A72', 66],
  ['Boston University', 'Metro Conference', 'BU', 'Terriers', '#CC0000', '#FFFFFF', 64],
  ['Stony Brook', 'Metro Conference', 'SBU', 'Seawolves', '#990000', '#16243E', 62],
  ['George Washington', 'Metro Conference', 'GW', 'Revolutionaries', '#033C5A', '#AA9868', 60],
  ['Toronto', 'Metro Conference', 'TOR', 'Varsity Blues', '#1E3765', '#FFFFFF', 50],
  ['McGill', 'Metro Conference', 'MCG', 'Redbirds', '#ED1B2F', '#FFFFFF', 46],
  ['Washington', 'Pacific-10 Conference', 'UW', 'Huskies', '#4B2E83', '#B7A57A', 90],
  ['Stanford', 'Pacific-10 Conference', 'STAN', 'Cardinal', '#8C1515', '#FFFFFF', 85],
  ['UCLA', 'Pacific-10 Conference', 'UCLA', 'Bruins', '#2D68C4', '#F2A900', 76],
  ['California', 'Pacific-10 Conference', 'CAL', 'Golden Bears', '#003262', '#FDB515', 68],
  ['UAB', 'Pacific-10 Conference', 'UAB', 'Blazers', '#1E6B52', '#F4C300', 66],
  ['UC Irvine', 'UC Athletic Association', 'UCI', 'Anteaters', '#0064A4', '#FFD200', 76],
  ['UC Santa Barbara', 'UC Athletic Association', 'UCSB', 'Gauchos', '#003660', '#FEBC11', 70],
  ['UC San Diego', 'UC Athletic Association', 'UCSD', 'Tritons', '#182B49', '#C69214', 66],
  ['UC Davis', 'UC Athletic Association', 'UCD', 'Aggies', '#022851', '#FFBF00', 64],
  ['UC Riverside', 'UC Athletic Association', 'UCR', 'Highlanders', '#003DA5', '#FFB81C', 60],
  ['Caltech', 'UC Athletic Association', 'CIT', 'Beavers', '#FF6C0C', '#333333', 42],
  ['UC Santa Cruz', 'UC Athletic Association', 'UCSC', 'Banana Slugs', '#003C6C', '#FDC700', 42],
  ['Tufts', 'University Athletic Association', 'TUFT', 'Jumbos', '#3E8EDE', '#002E6D', 54],
  ['Emory', 'University Athletic Association', 'EMRY', 'Eagles', '#012169', '#F2A900', 52],
  ['WashU', 'University Athletic Association', 'WUSTL', 'Bears', '#A51417', '#007360', 50],
  ['Chicago', 'University Athletic Association', 'UCHI', 'Maroons', '#800000', '#FFFFFF', 49],
  ['Brandeis', 'University Athletic Association', 'BRAN', 'Judges', '#003478', '#FFFFFF', 47],
  ['Carnegie Mellon', 'University Athletic Association', 'CMU', 'Tartans', '#C41230', '#6D6E71', 47],
  ['Johns Hopkins', 'University Athletic Association', 'JHU', 'Blue Jays', '#002D72', '#68ACE5', 47],
  ['NYU', 'University Athletic Association', 'NYU', 'Violets', '#57068C', '#FFFFFF', 47],
  ['Case Western', 'University Athletic Association', 'CWRU', 'Spartans', '#0A304E', '#FFFFFF', 46],
  ['Rochester', 'University Athletic Association', 'ROCH', 'Yellowjackets', '#001E5F', '#FFD100', 46],
  ['MIT', 'University Athletic Association', 'MIT', 'Engineers', '#A31F34', '#8A8B8C', 45],
];

// Home fields: [stadium, city]. Every one can be edited on the team page.
export const SITES = {
  "Arizona": ["Murphey Field at Mulcahy Stadium", "Tucson, Ariz."],
  "Arizona State": ["Sun Devil Soccer Stadium", "Tempe, Ariz."],
  "Boston University": ["Nickerson Field", "Boston, Mass."],
  "Brandeis": ["Gordon Field", "Waltham, Mass."],
  "Brown": ["Stevenson-Pincince Field", "Providence, R.I."],
  "Buffalo": ["UB Stadium", "Amherst, N.Y."],
  "California": ["Edwards Stadium", "Berkeley, Calif."],
  "Caltech": ["Caltech Soccer Field", "Pasadena, Calif."],
  "Carnegie Mellon": ["Gesling Stadium", "Pittsburgh, Pa."],
  "Case Western": ["DiSanto Field", "Cleveland, Ohio"],
  "Chicago": ["Stagg Field", "Chicago, Ill."],
  "Colorado": ["Prentup Field", "Boulder, Colo."],
  "Columbia": ["Rocco B. Commisso Soccer Stadium", "New York, N.Y."],
  "Cornell": ["Charles F. Berman Field", "Ithaca, N.Y."],
  "Dartmouth": ["Burnham Field", "Hanover, N.H."],
  "Duke": ["Koskinen Stadium", "Durham, N.C."],
  "Emory": ["Woodruff P.E. Center Field", "Atlanta, Ga."],
  "Florida": ["Donald R. Dizney Stadium", "Gainesville, Fla."],
  "George Washington": ["Mount Vernon Athletic Complex", "Washington, D.C."],
  "Georgetown": ["Shaw Field", "Washington, D.C."],
  "Harvard": ["Jordan Field", "Cambridge, Mass."],
  "Illinois": ["Demirjian Park", "Champaign, Ill."],
  "Indiana": ["Bill Armstrong Stadium", "Bloomington, Ind."],
  "Iowa": ["Iowa Soccer Complex", "Coralville, Iowa"],
  "Johns Hopkins": ["Homewood Field", "Baltimore, Md."],
  "Kansas": ["Rock Chalk Park", "Lawrence, Kan."],
  "MIT": ["Jack Barry Field", "Cambridge, Mass."],
  "Maryland": ["Ludwig Field", "College Park, Md."],
  "McGill": ["Forbes Field", "Montreal, Que."],
  "Miami": ["Cobb Stadium", "Coral Gables, Fla."],
  "Michigan": ["U-M Soccer Stadium", "Ann Arbor, Mich."],
  "Michigan State": ["DeMartin Stadium", "East Lansing, Mich."],
  "Minnesota": ["Elizabeth Lyle Robbie Stadium", "Minneapolis, Minn."],
  "Missouri": ["Walton Stadium", "Columbia, Mo."],
  "NYU": ["Gotham Field", "New York, N.Y."],
  "North Carolina": ["Dorrance Field", "Chapel Hill, N.C."],
  "Northwestern": ["Martin Stadium", "Evanston, Ill."],
  "Notre Dame": ["Alumni Stadium", "Notre Dame, Ind."],
  "Ohio State": ["Jesse Owens Memorial Stadium", "Columbus, Ohio"],
  "Oregon": ["Papé Field", "Eugene, Ore."],
  "Penn": ["Rhodes Field", "Philadelphia, Pa."],
  "Penn State": ["Jeffrey Field", "University Park, Pa."],
  "Pittsburgh": ["Ambrose Urbanic Field", "Pittsburgh, Pa."],
  "Princeton": ["Roberts Stadium", "Princeton, N.J."],
  "Purdue": ["Folk Field", "West Lafayette, Ind."],
  "Rice": ["Holloway Field", "Houston, Texas"],
  "Rochester": ["Fauver Stadium", "Rochester, N.Y."],
  "Rutgers": ["Yurcak Field", "New Brunswick, N.J."],
  "South Florida": ["Corbett Soccer Stadium", "Tampa, Fla."],
  "Stanford": ["Cagan Stadium", "Stanford, Calif."],
  "Stony Brook": ["LaValle Stadium", "Stony Brook, N.Y."],
  "Texas": ["Mike A. Myers Stadium", "Austin, Texas"],
  "Texas A&M": ["Ellis Field", "College Station, Texas"],
  "Toronto": ["Varsity Stadium", "Toronto, Ont."],
  "Tufts": ["Kraft Field", "Medford, Mass."],
  "UAB": ["PNC Field", "Birmingham, Ala."],
  "UC Davis": ["Aggie Soccer Field", "Davis, Calif."],
  "UC Irvine": ["Anteater Stadium", "Irvine, Calif."],
  "UC Riverside": ["UCR Soccer Stadium", "Riverside, Calif."],
  "UC San Diego": ["Triton Soccer Stadium", "La Jolla, Calif."],
  "UC Santa Barbara": ["Harder Stadium", "Santa Barbara, Calif."],
  "UC Santa Cruz": ["East Field", "Santa Cruz, Calif."],
  "UCLA": ["Wallis Annenberg Stadium", "Los Angeles, Calif."],
  "USC": ["McAlister Field", "Los Angeles, Calif."],
  "Utah": ["Ute Soccer Field", "Salt Lake City, Utah"],
  "Vanderbilt": ["Vanderbilt Soccer Complex", "Nashville, Tenn."],
  "Virginia": ["Klöckner Stadium", "Charlottesville, Va."],
  "WashU": ["Francis Olympic Field", "St. Louis, Mo."],
  "Washington": ["Husky Soccer Stadium", "Seattle, Wash."],
  "Wisconsin": ["McClimon Complex", "Madison, Wis."],
  "Yale": ["Reese Stadium", "New Haven, Conn."],
};

// Names the logo lists may know a school by.
export const LOGO_ALIASES = { 'Penn': 'Pennsylvania', 'Miami': 'Miami', 'UC Santa Barbara': 'UC Santa Barbara', 'George Washington': 'George Washington' };

// Head coaches for the 2026 season (see above). By 2030 some will have moved
// on; rename anyone on the Coaches page.
export const COACHES = {
  "Michigan State": "Jeff Hosler",
  "Ohio State": "Lori Walker-Hock",
  "Iowa": "Dean Ward",
  "Wisconsin": "Paula Wilkins",
  "Illinois": "Katie Hultin",
  "Penn State": "Erica Dambach",
  "Northwestern": "Michael Moynihan",
  "Michigan": "Dave DiIanni",
  "Minnesota": "Erin Chastain",
  "Purdue": "Richard Moodie",
  "Indiana": "Josh Rife",
  "Duke": "Kieran Hall",
  "Virginia": "Steve Swanson",
  "Notre Dame": "Nate Norman",
  "North Carolina": "Damon Nahas",
  "Florida": "Nick Zimmerman",
  "South Florida": "Chris Brown",
  "Maryland": "Michael Marchiano",
  "Miami": "Ken Masuhr",
  "Princeton": "Sean Driscoll",
  "Dartmouth": "Taylor Schram",
  "Brown": "Kia McNeill",
  "Harvard": "Chris Hamblin",
  "Columbia": "Tracey Bartholomew",
  "Yale": "Sarah Martinez",
  "Penn": "Krissy Turner",
  "Cornell": "Rob Ferguson",
  "Georgetown": "Dave Nolan",
  "Boston University": "Megan Burke",
  "Pittsburgh": "Ben Waldrum",
  "Rutgers": "Mike O'Neill",
  "Buffalo": "Shawn Burke",
  "George Washington": "Jeremy Williams",
  "Stony Brook": "Tobias Bischof",
  "Toronto": "Luciano Lombardi",
  "Stanford": "Paul Ratcliffe",
  "Washington": "Nicole Van Dyke",
  "Colorado": "Danny Sanchez",
  "UCLA": "Gof Boyoko",
  "USC": "Jane Alukonis",
  "Arizona State": "Graham Winkworth",
  "California": "Neil McGuire",
  "Utah": "Hideki Nakada",
  "Arizona": "Becca Moros",
  "Oregon": "Tracy Joyner",
  "Vanderbilt": "Darren Ambrose",
  "Kansas": "Nate Lie",
  "Texas": "Margueritte Bates",
  "Texas A&M": "Bobby Shuttleworth",
  "Rice": "Brian Lee",
  "Missouri": "Stefanie Golan",
  "UAB": "Mark Hiller",
  "UC Irvine": "Scott Juniper",
  "UC Santa Barbara": "Paul Stumpf",
  "UC Davis": "Kat Mertz",
  "UC San Diego": "Kristin Jones",
  "UC Riverside": "Mike Dibbini",
  "Caltech": "Scott Wilson",
  "WashU": "Jim Conlon",
  "Emory": "Sue Patberg",
  "Chicago": "Marlon McKenzie",
  "Tufts": "Martha Whiting",
  "Case Western": "Alyssa Johnson",
  "Johns Hopkins": "Leah Weiler",
  "Rochester": "Ashley Van Vechten",
  "MIT": "Martin Desmarais",
  "NYU": "Scott Waddell",
  "Brandeis": "Mary Shimko",
};
export const MEN_COACHES = {
  "Indiana": "Todd Yeagley",
  "Michigan": "Chaka Daley",
  "Ohio State": "Brian Maisonneuve",
  "Penn State": "Jeff Cook",
  "Michigan State": "Damon Rensing",
  "Wisconsin": "Neil Jones",
  "Northwestern": "Russell Payne",
  "Maryland": "Sasho Cirovski",
  "Virginia": "George Gelnovatch",
  "Duke": "John Kerr",
  "North Carolina": "Carlos Somoano",
  "Notre Dame": "Chad Riley",
  "South Florida": "George Kiefer",
  "Princeton": "Jim Barlow",
  "Cornell": "John Smith",
  "Penn": "Brian Gill",
  "Brown": "Chase Wileman",
  "Columbia": "Kevin Anderson",
  "Harvard": "Josh Shapiro",
  "Yale": "Kylie Stannard",
  "Dartmouth": "Connor Klekota",
  "Georgetown": "Brian Wiese",
  "Pittsburgh": "Jay Vidovich",
  "Rutgers": "Jim McElderry",
  "Boston University": "Kevin Nylen",
  "Stony Brook": "Ryan Anatol",
  "George Washington": "Matt Watts",
  "Toronto": "Ilya Orlov",
  "McGill": "Jose-Luis Valdes",
  "Washington": "Jamie Clark",
  "Stanford": "Jeremy Gunn",
  "UCLA": "Ryan Jorden",
  "California": "Leonard Griffin",
  "UAB": "David Lilly",
  "UC Irvine": "Yossi Raz",
  "UC Santa Barbara": "Tim Vom Steeg",
  "UC San Diego": "Jon Pascale",
  "UC Davis": "Dwayne Shaffer",
  "UC Riverside": "Tim Cupello",
  "Caltech": "Duncan Gillis",
  "Tufts": "Kyle Dezotell",
  "Emory": "Cory Greiner",
  "WashU": "Andrew Bordelon",
  "Chicago": "Phillip Kroft",
  "Brandeis": "Gabe Margolis",
  "Carnegie Mellon": "Brandon Bowman",
  "Johns Hopkins": "Craig Appleby",
  "NYU": "Joe Behan",
  "Case Western": "Carter Poe",
  "Rochester": "Ben Cross",
  "MIT": "Andrew Storton",
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
