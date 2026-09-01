import Papa from "papaparse";

export interface DifficultyVariation {
  variationName?: string;
  rating: number;
}

export interface Song {
  id: string;
  name: string;
  artist: string;
  isMaster: boolean;
  searchText: string;
  vocalParts: number;
  leadGuitarDifficulty: number;
  rhythmGuitarDifficulty: number;
  coOpGuitarDifficulty: number;
  bassGuitarDifficulty: number;
  proDrumsDifficulty: number;
  drumsDifficulty: number;
  harmonyDifficulty: number;
  vocalsDifficulty: number;
  keysDifficulty: number;
  proKeysDifficulty: number;
  bandDifficulty: number;
  guitar: DifficultyVariation[];
  drums: DifficultyVariation[];
  guitar2: DifficultyVariation[];
  vocals: DifficultyVariation[];
  keys: DifficultyVariation[];
  source: string;
}

const normalizeSearchTerm = (value: string) => {
  return value
    .trim()
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "");
};

const parseDifficulty = (value: string | undefined) => {
  const rating = Number(value ?? -1);
  return Number.isFinite(rating) ? rating : -1;
};

const buildVariations = (values: DifficultyVariation[]) => {
  return values.filter((variation) => variation.rating >= 0);
};

const stripLeadingArticles = (value: string) => {
  return value.replace(/^(a|an|the)\s+/i, "").trim();
};

const compareSongs = (a: Song, b: Song) => {
  const artistA = stripLeadingArticles(a.artist ?? "");
  const artistB = stripLeadingArticles(b.artist ?? "");
  const nameA = stripLeadingArticles(a.name ?? "");
  const nameB = stripLeadingArticles(b.name ?? "");

  const artistResult = artistA.localeCompare(artistB, undefined, {
    sensitivity: "base",
  });

  if (artistResult !== 0) {
    return artistResult;
  }

  return nameA.localeCompare(nameB, undefined, {
    sensitivity: "base",
  });
};

const toLoadedSong = (row: Record<string, string>): Song => {
  const name = row.Name ?? "";
  const artist = row.Artist ?? "";
  const vocalParts = Number(row["Vocal Parts"] ?? 0);
  const leadGuitarDifficulty = parseDifficulty(
    row["Guitar (5-Fret) Difficulty"],
  );
  const rhythmGuitarDifficulty = parseDifficulty(
    row["Rhythm (5-Fret) Difficulty"],
  );
  const coOpGuitarDifficulty = parseDifficulty(
    row["Co-op (5-Fret) Difficulty"],
  );
  const bassGuitarDifficulty = parseDifficulty(row["Bass (5-Fret) Difficulty"]);
  // const proGuitar17Difficulty = parseDifficulty(
  //   row["Pro Guitar (17-Fret) Difficulty"],
  // );
  // const proGuitar22Difficulty = parseDifficulty(
  //   row["Pro Guitar (22-Fret) Difficulty"],
  // );
  // const proBass17Difficulty = parseDifficulty(
  //   row["Pro Bass (17-Fret) Difficulty"],
  // );
  // const proBass22Difficulty = parseDifficulty(
  //   row["Pro Bass (22-Fret) Difficulty"],
  // );
  const proDrumsDifficulty = parseDifficulty(row["Pro Drums Difficulty"]);
  const drumsDifficulty = parseDifficulty(row["Drums (4-Lane) Difficulty"]);
  const harmonyDifficulty = parseDifficulty(row["Harmony Difficulty"]);
  const vocalsDifficulty = parseDifficulty(row["Vocals Difficulty"]);
  const keysDifficulty = parseDifficulty(row["Keys Difficulty"]);
  const proKeysDifficulty = parseDifficulty(row["Pro Keys Difficulty"]);
  const bandDifficulty = parseDifficulty(row["Band Difficulty"]);

  const guitar = buildVariations([
    {
      variationName: "Guitar",
      rating: leadGuitarDifficulty,
    },
    // {
    //   variationName: "Guitar 17",
    //   rating: proGuitar17Difficulty,
    // },
    // {
    //   variationName: "Guitar 22",
    //   rating: proGuitar22Difficulty,
    // },
  ]);

  const guitar2 = buildVariations([
    {
      variationName: "Co-op",
      rating: coOpGuitarDifficulty,
    },
    {
      variationName: "Rhythm",
      rating: rhythmGuitarDifficulty,
    },
    { variationName: "Bass", rating: bassGuitarDifficulty },
    // {
    //   variationName: "Bass 17",
    //   rating: proBass17Difficulty,
    // },
    // {
    //   variationName: "Bass 22",
    //   rating: proBass22Difficulty,
    // },
  ]);

  const drums = buildVariations([
    { variationName: "Pro", rating: proDrumsDifficulty },
    { rating: drumsDifficulty },
  ]);

  const vocals = buildVariations([
    {
      variationName: vocalParts > 1 ? `1-${vocalParts}` : undefined,
      rating: harmonyDifficulty,
    },
    { rating: vocalsDifficulty },
  ]);

  const keys = buildVariations([
    { variationName: "Pro", rating: proKeysDifficulty },
    { rating: keysDifficulty },
  ]);

  return {
    id: row.Hash ?? `${name}-${artist}`,
    name,
    artist,
    isMaster: row["Master"] !== "True",
    searchText: normalizeSearchTerm(`${name} ${artist}`),
    vocalParts,
    leadGuitarDifficulty,
    rhythmGuitarDifficulty,
    coOpGuitarDifficulty,
    bassGuitarDifficulty,
    proDrumsDifficulty,
    drumsDifficulty,
    harmonyDifficulty,
    vocalsDifficulty,
    keysDifficulty,
    proKeysDifficulty,
    bandDifficulty,
    guitar,
    drums,
    guitar2,
    vocals,
    keys,
    source: row["Source"],
  };
};

self.onmessage = (event: MessageEvent<string>) => {
  const parsed = Papa.parse<Record<string, string>>(event.data, {
    header: true,
    skipEmptyLines: true,
    transformHeader: (header: string) => header.trim(),
  });

  if (parsed.errors.length > 0) {
    console.warn("CSV parse warnings:", parsed.errors);
  }

  const sortedSongs = [...parsed.data].map(toLoadedSong).sort(compareSongs);

  self.postMessage(sortedSongs);
};
