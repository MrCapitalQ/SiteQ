import Papa from "papaparse";

type SongRow = Record<string, string>;

type DifficultyVariation = {
    partName: string;
    rating: number;
};

type LoadedSong = {
    id: string;
    name: string;
    artist: string;
    isMaster: boolean;
    searchText: string;
    vocalParts: number;
    leadGuitar: number;
    rhythmGuitar: number;
    coOpGuitar: number;
    bassGuitar: number;
    proDrums: number;
    drumsDifficulty: number;
    harmonyDifficulty: number;
    vocalsDifficulty: number;
    keysDifficulty: number;
    bandDifficulty: number;
    guitar: DifficultyVariation[];
    drums: DifficultyVariation[];
    vocals: DifficultyVariation[];
    keys: DifficultyVariation[];
};

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

const buildVariations = (values: Array<{ partName: string; rating: string | undefined }>) => {
    return values
        .map(({ partName, rating }) => ({
            partName,
            rating: parseDifficulty(rating),
        }))
        .filter((variation) => variation.rating >= 0);
};

const stripLeadingArticles = (value: string) => {
    return value.replace(/^(a|an|the)\s+/i, "").trim();
};

const compareSongs = (a: LoadedSong, b: LoadedSong) => {
    const artistA = stripLeadingArticles(a.artist ?? "");
    const artistB = stripLeadingArticles(b.artist ?? "");
    const nameA = stripLeadingArticles(a.name ?? "");
    const nameB = stripLeadingArticles(b.name ?? "");

    const artistResult = artistA.localeCompare(artistB, undefined, {
        sensitivity: "base"
    });

    if (artistResult !== 0) {
        return artistResult;
    }

    return nameA.localeCompare(nameB, undefined, {
        sensitivity: "base"
    });
};

const toLoadedSong = (row: SongRow): LoadedSong => {
    const name = row.Name ?? "";
    const artist = row.Artist ?? "";
    const vocalParts = Number(row["Vocal Parts"] ?? 0);
    const leadGuitar = parseDifficulty(row["Guitar (5-Fret) Difficulty"]);
    const rhythmGuitar = parseDifficulty(row["Rhythm (5-Fret) Difficulty"]);
    const coOpGuitar = parseDifficulty(row["Co-op (5-Fret) Difficulty"]);
    const bassGuitar = parseDifficulty(row["Bass (5-Fret) Difficulty"]);
    const proDrums = parseDifficulty(row["Pro Drums Difficulty"]);
    const drumsDifficulty = parseDifficulty(row["Drums (4-Lane) Difficulty"]);
    const harmonyDifficulty = parseDifficulty(row["Harmony Difficulty"]);
    const vocalsDifficulty = parseDifficulty(row["Vocals Difficulty"]);
    const keysDifficulty = parseDifficulty(row["Keys Difficulty"]);
    const bandDifficulty = parseDifficulty(row["Band Difficulty"]);

    const guitar = buildVariations([
        { partName: "Lead", rating: row["Guitar (5-Fret) Difficulty"] },
        { partName: "Co-op", rating: row["Co-op (5-Fret) Difficulty"] },
        { partName: "Rhythm", rating: row["Rhythm (5-Fret) Difficulty"] },
        { partName: "Bass", rating: row["Bass (5-Fret) Difficulty"] }
    ]);

    const drums = buildVariations([
        { partName: "Pro", rating: row["Pro Drums Difficulty"] },
        { partName: "Drums", rating: row["Drums (4-Lane) Difficulty"] }
    ]);

    const vocals = buildVariations([
        { partName: vocalParts === 1 ? "1 Part" : `${vocalParts} Parts`, rating: row["Harmony Difficulty"] },
        { partName: "1 Part", rating: row["Vocals Difficulty"] }
    ]);

    const keys = buildVariations([
        { partName: "Keys", rating: row["Keys Difficulty"] }
    ]);

    return {
        id: row.Hash ?? `${name}-${artist}`,
        name,
        artist,
        isMaster: row["Master"] !== "True",
        searchText: normalizeSearchTerm(`${name} ${artist}`),
        vocalParts,
        leadGuitar,
        rhythmGuitar,
        coOpGuitar,
        bassGuitar,
        proDrums,
        drumsDifficulty,
        harmonyDifficulty,
        vocalsDifficulty,
        keysDifficulty,
        bandDifficulty,
        guitar,
        drums,
        vocals,
        keys
    };
};

self.onmessage = (event: MessageEvent<string>) => {
    const parsed = Papa.parse<SongRow>(event.data, {
        header: true,
        skipEmptyLines: true,
        transformHeader: (header: string) => header.trim()
    });

    if (parsed.errors.length > 0) {
        console.warn("CSV parse warnings:", parsed.errors);
    }

    const sortedSongs = [...parsed.data]
        .map(toLoadedSong)
        .sort(compareSongs);

    self.postMessage(sortedSongs);
};
