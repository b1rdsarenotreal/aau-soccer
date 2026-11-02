"""Builds js/data.js for AAU Soccer. Team names, colors, mascots and
conferences come from the volleyball rows (the owner's alignment); ratings,
coaches and home fields are listed here. Run: python3 tools/gen_data.py"""
import re, json, pathlib
ROOT = pathlib.Path(__file__).resolve().parent.parent
VB = (ROOT.parent / 'aau-volleyball' / 'js' / 'data.js').read_text()
rows = re.findall(r"\['([^']+)', '([^']+)', '([^']+)', '([^']+)', '(#[0-9A-Fa-f]+)', '(#[0-9A-Fa-f]+)', (\d+)\]", VB)
BASE = {r[0]: r for r in rows}
CITY = dict(re.findall(r"'([^']+)': \['[^']*', '([^']+)'\]", VB))
KEY = {'illinois':'Illinois','indiana':'Indiana','iowa':'Iowa','maryland':'Maryland','michigan':'Michigan','msu':'Michigan State','minnesota':'Minnesota',
 'northwestern':'Northwestern','ohiostate':'Ohio State','oregon':'Oregon','pennstate':'Penn State','purdue':'Purdue','rutgers':'Rutgers','ucla':'UCLA','usc':'USC',
 'washington':'Washington','wisconsin':'Wisconsin','cal':'California','duke':'Duke','miami':'Miami','unc':'North Carolina','notredame':'Notre Dame','pitt':'Pittsburgh',
 'stanford':'Stanford','virginia':'Virginia','florida':'Florida','missouri':'Missouri','texas':'Texas','tamu':'Texas A&M','vanderbilt':'Vanderbilt','arizona':'Arizona',
 'asu':'Arizona State','colorado':'Colorado','kansas':'Kansas','utah':'Utah','brown':'Brown','columbia':'Columbia','cornell':'Cornell','dartmouth':'Dartmouth',
 'harvard':'Harvard','penn':'Penn','princeton':'Princeton','yale':'Yale','ucdavis':'UC Davis','uci':'UC Irvine','ucr':'UC Riverside','ucsd':'UC San Diego',
 'ucsb':'UC Santa Barbara','rice':'Rice','usf':'South Florida','uab':'UAB','buffalo':'Buffalo','gwu':'George Washington','georgetown':'Georgetown',
 'stonybrook':'Stony Brook','bu':'Boston University','brandeis':'Brandeis','cmu':'Carnegie Mellon','case':'Case Western','chicago':'Chicago','emory':'Emory',
 'nyu':'NYU','rochester':'Rochester','washu':'WashU','jhu':'Johns Hopkins','mit':'MIT','tufts':'Tufts','caltech':'Caltech','ucsc':'UC Santa Cruz',
 'mcgill':'McGill','toronto':'Toronto'}
# Boston University isn't in the volleyball rows (no volleyball): add it.
BASE['Boston University'] = ('Boston University', 'Metro Conference', 'BU', 'Terriers', '#CC0000', '#FFFFFF', '0')
CITY['Boston University'] = 'Boston, Mass.'

# Home fields (soccer stadiums), from school athletics sites and general
# knowledge; every one can be edited on the team page.
FIELD = {
 'Arizona':'Murphey Field at Mulcahy Stadium','Arizona State':'Sun Devil Soccer Stadium','Boston University':'Nickerson Field','Brown':'Stevenson-Pincince Field',
 'Buffalo':'UB Stadium','California':'Edwards Stadium','UC Davis':'Aggie Soccer Field','UC Irvine':'Anteater Stadium','UCLA':'Wallis Annenberg Stadium',
 'UC Riverside':'UCR Soccer Stadium','UC San Diego':'Triton Soccer Stadium','UC Santa Barbara':'Harder Stadium','Colorado':'Prentup Field',
 'Columbia':'Rocco B. Commisso Soccer Stadium','Cornell':'Charles F. Berman Field','Dartmouth':'Burnham Field','Duke':'Koskinen Stadium',
 'Florida':'Donald R. Dizney Stadium','George Washington':'Mount Vernon Athletic Complex','Georgetown':'Shaw Field','Harvard':'Jordan Field',
 'Illinois':'Demirjian Park','Indiana':'Bill Armstrong Stadium','Iowa':'Iowa Soccer Complex','Kansas':'Rock Chalk Park','Maryland':'Ludwig Field',
 'Miami':'Cobb Stadium','Michigan':'U-M Soccer Stadium','Michigan State':'DeMartin Stadium','Minnesota':'Elizabeth Lyle Robbie Stadium',
 'Missouri':'Walton Stadium','North Carolina':'Dorrance Field','Northwestern':'Martin Stadium','Notre Dame':'Alumni Stadium',
 'Ohio State':'Jesse Owens Memorial Stadium','Oregon':'Papé Field','Penn':'Rhodes Field','Penn State':'Jeffrey Field','Pittsburgh':'Ambrose Urbanic Field',
 'Princeton':'Roberts Stadium','Purdue':'Folk Field','Rice':'Holloway Field','Rutgers':'Yurcak Field','USC':'McAlister Field',
 'South Florida':'Corbett Soccer Stadium','Stanford':'Cagan Stadium','Stony Brook':'LaValle Stadium','Texas':'Mike A. Myers Stadium',
 'Texas A&M':'Ellis Field','UAB':'PNC Field','Utah':'Ute Soccer Field','Vanderbilt':'Vanderbilt Soccer Complex','Virginia':'Klöckner Stadium',
 'Washington':'Husky Soccer Stadium','Wisconsin':'McClimon Complex','Yale':'Reese Stadium',
 'Brandeis':'Gordon Field','Carnegie Mellon':'Gesling Stadium','Case Western':'DiSanto Field','Chicago':'Stagg Field','Emory':'Woodruff P.E. Center Field',
 'NYU':'Gotham Field','Rochester':'Fauver Stadium','WashU':'Francis Olympic Field','Johns Hopkins':'Homewood Field','MIT':'Jack Barry Field',
 'Tufts':'Kraft Field','Caltech':'Caltech Soccer Field','UC Santa Cruz':'East Field','Toronto':'Varsity Stadium','McGill':'Forbes Field',
}

# Women's OVR from the 2025 season (see the notes written into data.js).
W = {
 'stanford':92,'duke':89,'vanderbilt':87,'washington':87,'msu':86,'virginia':86,'ohiostate':84,'georgetown':84,'notredame':84,'colorado':83,'unc':83,
 'kansas':82,'iowa':79,'ucla':79,'wisconsin':79,'usc':77,'pennstate':77,'illinois':77,'northwestern':76,'texas':74,'princeton':74,'tamu':73,
 'florida':72,'michigan':72,'dartmouth':72,'brown':70,'cal':68,'asu':68,'utah':68,'minnesota':68,'rice':68,'harvard':68,'arizona':66,'missouri':66,
 'pitt':66,'purdue':66,'bu':66,'usf':66,'uci':66,'ucsb':66,'indiana':65,'columbia':64,'rutgers':64,'maryland':63,'miami':62,'oregon':62,'yale':62,
 'uab':62,'penn':61,'cornell':60,'ucdavis':60,'gwu':58,'buffalo':58,'stonybrook':58,'ucsd':56,'ucr':54,
 'washu':52,'emory':51,'chicago':50,'tufts':49,'case':48,'jhu':47,'rochester':47,'cmu':46,'nyu':46,'mit':46,'toronto':46,'mcgill':45,'brandeis':44,
 'ucsc':42,'caltech':40,
}
# Men's OVR from the 2025 season.
M = {
 'washington':90,'maryland':87,'georgetown':86,'stanford':85,'princeton':84,'virginia':84,'indiana':82,'michigan':80,'duke':79,'cornell':78,'unc':77,
 'notredame':76,'ucla':76,'uci':76,'ohiostate':72,'pitt':72,'penn':70,'pennstate':70,'ucsb':70,'wisconsin':68,'msu':68,'cal':68,'northwestern':66,
 'rutgers':66,'ucsd':66,'usf':66,'uab':66,'brown':66,'bu':64,'ucdavis':64,'columbia':64,'harvard':64,'yale':64,'stonybrook':62,'dartmouth':62,
 'gwu':60,'ucr':60,
 'tufts':54,'emory':52,'washu':50,'toronto':50,'chicago':49,'nyu':47,'brandeis':47,'cmu':47,'jhu':47,'case':46,'rochester':46,'mcgill':46,'mit':45,
 'caltech':42,'ucsc':42,
}
def coaches(fn):
    out = {}
    for line in (pathlib.Path(fn)).read_text().splitlines():
        if '|' in line: k, v = line.split('|', 1); out[KEY[k]] = v.rstrip('?')
    return out
SC = pathlib.Path('/tmp/claude-0/-home-claude/3cb74005-19ac-591c-84a6-0a998fc91a6b/scratchpad/soc')
WC = coaches(SC/'wcoach.txt'); MC = coaches(SC/'mcoach.txt')
MC.update({'Tufts':'Kyle Dezotell','MIT':'Andrew Storton','Johns Hopkins':'Craig Appleby','Caltech':'Duncan Gillis','Toronto':'Ilya Orlov','McGill':'Jose-Luis Valdes','Carnegie Mellon':'Brandon Bowman'})
WC.update({'WashU':'Jim Conlon','Chicago':'Marlon McKenzie','Rochester':'Ashley Van Vechten','Brandeis':'Mary Shimko','Tufts':'Martha Whiting','MIT':'Martin Desmarais','Johns Hopkins':'Leah Weiler','Caltech':'Scott Wilson','Toronto':'Luciano Lombardi'})

ORDER = ['Big Ten','Coastal Atlantic Conference','Ivy League','Metro Conference','Pacific-10 Conference','Southwest Conference','UC Athletic Association','University Athletic Association']
def rows_for(R, men):
    out = []
    for k, ovr in R.items():
        s = KEY[k]; b = BASE[s]
        conf = 'Pacific-10 Conference' if (men and s == 'UAB') else b[1]
        mascot = 'Redbirds' if (men and s == 'McGill') else b[3]
        out.append([s, conf, b[2], mascot, b[4], b[5], ovr])
    out.sort(key=lambda r: (ORDER.index(r[1]), -r[6], r[0]))
    return out
def js_rows(rs):
    return ',\n'.join('  ' + json.dumps(r, ensure_ascii=False).replace('", "', "', '").replace('["', "['").replace('", ', "', ").replace(', "', ", '") for r in rs)
WR, MR = rows_for(W, False), rows_for(M, True)
schools = sorted({r[0] for r in WR + MR})
sites = ',\n'.join(f"  {json.dumps(s, ensure_ascii=False)}: [{json.dumps(FIELD[s], ensure_ascii=False)}, {json.dumps(CITY[s])}]" for s in schools)
def cj(d, rs): return ',\n'.join(f"  {json.dumps(r[0], ensure_ascii=False)}: {json.dumps(d[r[0]], ensure_ascii=False)}" for r in rs if d.get(r[0]))
TEMPLATE = (ROOT / 'tools' / 'data_template.js').read_text()
out = TEMPLATE.replace('/*WOMEN*/', js_rows(WR)).replace('/*MEN*/', js_rows(MR)).replace('/*SITES*/', sites).replace('/*WCOACH*/', cj(WC, WR)).replace('/*MCOACH*/', cj(MC, MR))
(ROOT / 'js' / 'data.js').write_text(out)
print(len(WR), 'women', len(MR), 'men', 'open W:', [r[0] for r in WR if r[0] not in WC], 'open M:', [r[0] for r in MR if r[0] not in MC])
