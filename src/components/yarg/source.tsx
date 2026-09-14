export const SOURCE_LABELS: Record<string, string> = {
  yarg: "YARG",
  yargdlc: "YARG DLC",
  yarn: "YARN",
  gh: "Guitar Hero",
  ghdx: "Guitar Hero Deluxe",
  gh2: "Guitar Hero II",
  gh2dlc: "Guitar Hero II DLC",
  gh2dx: "Guitar Hero II Deluxe",
  gh2dxdlc: "Guitar Hero II Deluxe DLC",
  gh2dxcustoms: "Guitar Hero II Deluxe Customs",
  gh80s: "Guitar Hero Encore: Rocks the 80s",
  gh80sdx: "Guitar Hero Encore Deluxe",
  gh3: "Guitar Hero III: Legends of Rock",
  gh3dlc: "Guitar Hero III DLC",
  ghot: "Guitar Hero: On Tour",
  gha: "Guitar Hero: Aerosmith",
  ghwt: "Guitar Hero: World Tour",
  ghwtdlc: "Guitar Hero: World Tour DLC",
  ghm: "Guitar Hero: Metallica",
  ghmdlc: "Death Magnetic DLC",
  ghwor: "Guitar Hero: Warriors of Rock",
  ghwordlc: "Guitar Hero: Warriors of Rock DLC",
  ghvh: "Guitar Hero: Van Halen",
  ghsh: "Guitar Hero: Smash Hits",
  gh5: "Guitar Hero 5",
  gh5dlc: "Guitar Hero 5 DLC",
  ghotd: "Guitar Hero On Tour: Decades",
  ghotmh: "Guitar Hero On Tour: Modern Hits",
  bh: "Band Hero",
  bh2: "Band Hero 2",
  ghl: "Guitar Hero Live",
  ghtv: "Guitar Hero TV",
  rb1: "Rock Band 1",
  rb1dlc: "Rock Band 1 DLC",
  rb2: "Rock Band 2",
  rb2dlc: "Rock Band 2 DLC",
  rb3: "Rock Band 3",
  rb3dlc: "Rock Band 3 DLC",
  rb4: "Rock Band 4",
  rb4dlc: "Rock Band 4 DLC",
  rbr: "Rock Band Rivals",
  tbrb: "The Beatles: Rock Band",
  tbrbdlc: "The Beatles: Rock Band DLC",
  rbacdc: "AC/DC Live: Rock Band Track Pack",
  lrb: "Lego Rock Band",
  rbn: "Rock Band Network",
  rbn1: "Rock Band Network 1.0",
  rbn2: "Rock Band Network 2.0",
  rbn_lost: "Lost Rock Band Network",
  rbn1_lost: "Lost Rock Band Network 1.0",
  rbn2_lost: "Lost Rock Band Network 2.0",
  rb_blitz: "Rock Band Blitz",
  gdrb: "Green Day: Rock Band",
  gdrbdlc: "Green Day: Rock Band DLC",
  rbvr: "Rock Band VR",
  fnfestival: "Fortnite Festival",
};

export const SOURCE_ICONS: Record<string, string> = {
  yarg: "yarg.png",
  yargdlc: "yargdlc.png",
  yarn: "yarn.png",
  gh: "gh.png",
  ghdx: "ghdx.png",
  gh2: "gh2.png",
  gh2dlc: "gh2dlc.png",
  gh2dx: "gh2dx.png",
  gh2dxdlc: "gh2dxdlc.png",
  gh2dxcustoms: "gh2dxcustoms.png",
  gh80s: "gh80s.png",
  gh80sdx: "gh80sdx.png",
  gh3: "gh3.png",
  gh3dlc: "gh3dlc.png",
  ghot: "ghot.png",
  gha: "gha.png",
  ghwt: "ghwt.png",
  ghwtdlc: "ghwtdlc.png",
  ghm: "ghm.png",
  ghmdlc: "ghmdlc.png",
  ghwor: "ghwor.png",
  ghwordlc: "ghwordlc.png",
  ghvh: "ghvh.png",
  ghsh: "ghsh.png",
  gh5: "gh5.png",
  gh5dlc: "gh5dlc.png",
  ghotd: "ghotd.png",
  ghotmh: "ghotmh.png",
  bh: "bh.png",
  bh2: "bh2.png",
  ghl: "ghl.png",
  ghtv: "ghtv.png",
  rb1: "rb1.png",
  rb1dlc: "rb1dlc.png",
  rb2: "rb2.png",
  rb2dlc: "rb2dlc.png",
  rb3: "rb3.png",
  rb3dlc: "rb3dlc.png",
  rb4: "rb4.png",
  rb4dlc: "rb4dlc.png",
  rbr: "rb4rivals.png",
  tbrb: "tbrb.png",
  tbrbdlc: "tbrbdlc.png",
  rbacdc: "rbacdc.png",
  lrb: "lrb.png",
  rbn: "rb1.png",
  rbn1: "rbn1.png",
  rbn2: "rbn2.png",
  rbn_lost: "rbn1lost.png",
  rbn1_lost: "rbn1lost.png",
  rbn2_lost: "rbn2lost.png",
  rb_blitz: "rb_blitz.png",
  gdrb: "gdrb.png",
  gdrbdlc: "gdrbdlc.png",
  rbvr: "rbvr.png",
  fnfestival: "fnfestival.png",
};

export function normalizeSource(source: string): string {
  const lowerSource = source.toLowerCase();
  switch (lowerSource) {
    case "gh1":
      return "gh";
    case "gh1dx":
      return "ghdx";
    case "bandhero":
      return "bh";
    case "bandhero2":
      return "bh2";
    case "rb1_dlc":
      return "rb1dlc";
    case "rb2_real":
      return "rb2";
    case "rb2_dlc":
      return "rb2dlc";
    case "rb3_dlc":
      return "rb3dlc";
    case "rb4_dlc":
      return "rb4dlc";
    case "rb4_rivals":
      return "rbr";
    case "beatles":
      return "tbrb";
    case "beatles_dlc":
      return "tbrbdlc";
    case "rbtp_acdc":
      return "rbacdc";
    case "lego":
      return "lrb";
    case "ugc":
    case "ugc1":
      return "rbn1";
    case "ugc_plus":
    case "ugc2":
      return "rbn2";
    case "ugc_lost":
    case "ugc1_lost":
      return "rbn1_lost";
    case "ugc2_lost":
      return "rbn2_lost";
    case "rbb":
    case "blitz":
      return "rb_blitz";
    case "greenday":
      return "gdrb";
    case "gdrbp":
    case "gdrb_plus":
      return "gdrbdlc";
    default:
      return lowerSource;
  }
}
