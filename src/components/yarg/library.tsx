import type { DifficultyVariation, Song } from "@/workers/songs.worker";
import { useVirtualizer } from "@tanstack/react-virtual";
import {
  Circle,
  Drum,
  Guitar,
  KeyboardMusic,
  MicVocal,
  Skull,
  SlidersHorizontal,
  Users,
  type LucideIcon,
} from "lucide-react";
import { memo, useEffect, useMemo, useRef, useState } from "react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import { Field } from "../ui/field";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Page } from "../ui/page";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import {
  Select,
  SelectGroup,
  SelectItem,
  SelectContent as SelectMenuContent,
  SelectTrigger,
} from "../ui/select";
import { Separator } from "../ui/separator";
import { Spinner } from "../ui/spinner";

const DIFFICULTY_ROTATION_MS = 2500;

const SOURCE_LABELS: Record<string, string> = {
  yarg: "YARG",
  yargdlc: "YARG DLC",
  yarn: "YARN",
  gh: "Guitar Hero",
  gh1: "Guitar Hero",
  ghdx: "Guitar Hero Deluxe",
  gh1dx: "Guitar Hero Deluxe",
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
  bandhero: "Band Hero",
  bh: "Band Hero",
  bandhero2: "Band Hero 2",
  bh2: "Band Hero 2",
  ghl: "Guitar Hero Live",
  ghtv: "Guitar Hero TV",
  rb1: "Rock Band 1",
  rb1dlc: "Rock Band 1 DLC",
  rb1_dlc: "Rock Band 1 DLC",
  rb2: "Rock Band 2",
  rb2_real: "Rock Band 2",
  rb2dlc: "Rock Band 2 DLC",
  rb2_dlc: "Rock Band 2 DLC",
  rb3: "Rock Band 3",
  rb3dlc: "Rock Band 3 DLC",
  rb3_dlc: "Rock Band 3 DLC",
  rb4: "Rock Band 4",
  rb4dlc: "Rock Band 4 DLC",
  rb4_dlc: "Rock Band 4 DLC",
  rbr: "Rock Band Rivals",
  rb4_rivals: "Rock Band Rivals",
  tbrb: "The Beatles Rock Band",
  beatles: "The Beatles Rock Band",
  tbrbdlc: "The Beatles: Rock Band DLC",
  beatles_dlc: "The Beatles: Rock Band DLC",
  rbacdc: "AC/DC Live: Rock Band Track Pack",
  rbtp_acdc: "AC/DC Live: Rock Band Track Pack",
  lrb: "Lego Rock Band",
  lego: "Lego Rock Band",
  rbn: "Rock Band Network",
  rbn1: "Rock Band Network 1.0",
  ugc: "Rock Band Network 1.0",
  ugc1: "Rock Band Network 1.0",
  rbn2: "Rock Band Network 2.0",
  ugc_plus: "Rock Band Network 2.0",
  ugc2: "Rock Band Network 2.0",
  ugc_lost: "Lost Rock Band Network",
  rbn_lost: "Lost Rock Band Network",
  ugc1_lost: "Lost Rock Band Network 1.0",
  rbn1_lost: "Lost Rock Band Network 1.0",
  ugc2_lost: "Lost Rock Band Network 2.0",
  rbn2_lost: "Lost Rock Band Network 2.0",
  rb_blitz: "Rock Band Blitz",
  rbb: "Rock Band Blitz",
  blitz: "Rock Band Blitz",
  gdrb: "Green Day: Rock Band",
  greenday: "Green Day: Rock Band",
  gdrbdlc: "Green Day: Rock Band DLC",
  gdrbp: "Green Day: Rock Band DLC",
  gdrb_plus: "Green Day: Rock Band DLC",
  rbvr: "Rock Band VR",
  fnfestival: "Fortnite Festival",
};

function normalizeSearchTerm(value: string) {
  return value
    .trim()
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "");
}

const difficultyRotationSubscribers = new Set<() => void>();
let difficultyRotationTimer: number | undefined;

function ensureDifficultyRotationTimer() {
  if (difficultyRotationTimer !== undefined) {
    return;
  }

  difficultyRotationTimer = window.setInterval(() => {
    difficultyRotationSubscribers.forEach((subscriber) => subscriber());
  }, DIFFICULTY_ROTATION_MS);
}

function clearDifficultyRotationTimer() {
  if (difficultyRotationTimer === undefined) {
    return;
  }

  window.clearInterval(difficultyRotationTimer);
  difficultyRotationTimer = undefined;
}

const sortOptions = [
  { value: "artist", label: "Artist" },
  { value: "song", label: "Song" },
  { value: "leadGuitar", label: "Guitar Difficulty" },
  { value: "rhythmGuitar", label: "Rhythm Guitar Difficulty" },
  { value: "coOpGuitar", label: "Co-op Guitar Difficulty" },
  { value: "bassGuitar", label: "Bass Difficulty" },
  { value: "drums", label: "Drums Difficulty" },
  { value: "vocals", label: "Vocals Difficulty" },
  { value: "keys", label: "Keys Difficulty" },
  { value: "proKeys", label: "Pro Keys Difficulty" },
  { value: "bandDifficulty", label: "Band Difficulty" },
] as const;

type SortOption = (typeof sortOptions)[number]["value"];

const instrumentOptions = [
  { value: "leadGuitar", label: "Guitar" },
  { value: "rhythmGuitar", label: "Rhythm Guitar" },
  { value: "coOpGuitar", label: "Co-op Guitar" },
  { value: "bassGuitar", label: "Bass" },
  { value: "drums", label: "Drums" },
  { value: "vocalParts1", label: "Vocals - 1 Part" },
  { value: "vocalParts2", label: "Vocals - 2 Parts" },
  { value: "vocalParts3", label: "Vocals - 3 Parts" },
  { value: "keys", label: "Keys" },
  { value: "proKeys", label: "Pro Keys" },
] as const;

type InstrumentOption = (typeof instrumentOptions)[number]["value"];

function getDifficultyRating(song: Song, option: SortOption) {
  switch (option) {
    case "leadGuitar":
      return song.leadGuitarDifficulty;
    case "rhythmGuitar":
      return song.rhythmGuitarDifficulty;
    case "coOpGuitar":
      return song.coOpGuitarDifficulty;
    case "bassGuitar":
      return song.bassGuitarDifficulty;
    case "drums":
      return song.proDrumsDifficulty >= 0
        ? song.proDrumsDifficulty
        : song.drumsDifficulty;
    case "vocals":
      return song.harmonyDifficulty >= 0
        ? song.harmonyDifficulty
        : song.vocalsDifficulty;
    case "keys":
      return song.keysDifficulty;
    case "proKeys":
      return song.proKeysDifficulty;
    case "bandDifficulty":
      return song.bandDifficulty;
    default:
      return -1;
  }
}

function compareSongs(a: Song, b: Song, sortBy: SortOption) {
  switch (sortBy) {
    case "song": {
      const nameResult = stripLeadingArticles(a.name).localeCompare(
        stripLeadingArticles(b.name),
        undefined,
        {
          sensitivity: "base",
        },
      );

      if (nameResult !== 0) {
        return nameResult;
      }

      return stripLeadingArticles(a.artist).localeCompare(
        stripLeadingArticles(b.artist),
        undefined,
        {
          sensitivity: "base",
        },
      );
    }
    case "artist": {
      const artistResult = stripLeadingArticles(a.artist).localeCompare(
        stripLeadingArticles(b.artist),
        undefined,
        {
          sensitivity: "base",
        },
      );

      if (artistResult !== 0) {
        return artistResult;
      }

      return stripLeadingArticles(a.name).localeCompare(
        stripLeadingArticles(b.name),
        undefined,
        {
          sensitivity: "base",
        },
      );
    }
    default: {
      const aRating = getDifficultyRating(a, sortBy);
      const bRating = getDifficultyRating(b, sortBy);

      const aHasValue = aRating >= 0;
      const bHasValue = bRating >= 0;

      if (aHasValue !== bHasValue) {
        return aHasValue ? -1 : 1;
      }

      if (aHasValue && bHasValue && aRating !== bRating) {
        return aRating - bRating;
      }

      return stripLeadingArticles(a.name).localeCompare(
        stripLeadingArticles(b.name),
        undefined,
        {
          sensitivity: "base",
        },
      );
    }
  }
}

function stripLeadingArticles(value: string) {
  return value.replace(/^(a|an|the)\s+/i, "").trim();
}

function matchesInstrumentFilter(song: Song, filter: InstrumentOption) {
  switch (filter) {
    case "leadGuitar":
      return song.leadGuitarDifficulty >= 0;
    case "rhythmGuitar":
      return song.rhythmGuitarDifficulty >= 0;
    case "coOpGuitar":
      return song.coOpGuitarDifficulty >= 0;
    case "bassGuitar":
      return song.bassGuitarDifficulty >= 0;
    case "drums":
      return song.proDrumsDifficulty >= 0 || song.drumsDifficulty >= 0;
    case "vocalParts1":
      return song.vocalParts === 1;
    case "vocalParts2":
      return song.vocalParts === 2;
    case "vocalParts3":
      return song.vocalParts === 3;
    case "keys":
      return song.keysDifficulty >= 0;
    case "proKeys":
      return song.proKeysDifficulty >= 0;
    default:
      return true;
  }
}

function getEstimatedRowHeight() {
  return window.innerWidth < 324 ? 137 : window.innerWidth < 668 ? 109 : 81;
}

export function YargLibrary() {
  const [estimatedRowHeight, setEstimatedRowHeight] = useState(() =>
    getEstimatedRowHeight(),
  );
  const [songs, setSongs] = useState<Song[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("artist");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [selectedInstruments, setSelectedInstruments] = useState<
    InstrumentOption[]
  >([]);
  const [selectedSources, setSelectedSources] = useState<string[]>([]);

  const parentRef = useRef<HTMLDivElement | null>(null);

  const availableSortOptions = useMemo(() => {
    const options: Array<(typeof sortOptions)[number]> = [
      sortOptions[0],
      sortOptions[1],
    ];

    if (songs.some((song) => song.leadGuitarDifficulty >= 0)) {
      options.push(sortOptions[2]);
    }

    if (songs.some((song) => song.rhythmGuitarDifficulty >= 0)) {
      options.push(sortOptions[3]);
    }

    if (songs.some((song) => song.coOpGuitarDifficulty >= 0)) {
      options.push(sortOptions[4]);
    }

    if (songs.some((song) => song.bassGuitarDifficulty >= 0)) {
      options.push(sortOptions[5]);
    }

    if (
      songs.some(
        (song) => song.proDrumsDifficulty >= 0 || song.drumsDifficulty >= 0,
      )
    ) {
      options.push(sortOptions[6]);
    }

    if (
      songs.some(
        (song) => song.harmonyDifficulty >= 0 || song.vocalsDifficulty >= 0,
      )
    ) {
      options.push(sortOptions[7]);
    }

    if (songs.some((song) => song.keysDifficulty >= 0)) {
      options.push(sortOptions[8]);
    }

    if (songs.some((song) => song.bandDifficulty >= 0)) {
      options.push(sortOptions[9]);
    }

    return options;
  }, [songs]);

  const availableInstrumentOptions = useMemo(() => {
    return instrumentOptions.filter((option) => {
      switch (option.value) {
        case "leadGuitar":
          return songs.some((song) => song.leadGuitarDifficulty >= 0);
        case "rhythmGuitar":
          return songs.some((song) => song.rhythmGuitarDifficulty >= 0);
        case "coOpGuitar":
          return songs.some((song) => song.coOpGuitarDifficulty >= 0);
        case "bassGuitar":
          return songs.some((song) => song.bassGuitarDifficulty >= 0);
        case "drums":
          return songs.some(
            (song) => song.proDrumsDifficulty >= 0 || song.drumsDifficulty >= 0,
          );
        case "vocalParts1":
          return songs.some((song) => song.vocalParts === 1);
        case "vocalParts2":
          return songs.some((song) => song.vocalParts === 2);
        case "vocalParts3":
          return songs.some((song) => song.vocalParts === 3);
        case "keys":
          return songs.some((song) => song.keysDifficulty >= 0);
        default:
          return true;
      }
    });
  }, [songs]);

  const availableSourceOptions = useMemo(() => {
    return Array.from(new Set(songs.map((x) => x.source)))
      .map((x) => ({
        value: x,
        label: SOURCE_LABELS[x] ?? "Custom/Unknown",
      }))
      .sort((a, b) => a.label.localeCompare(b.label));
  }, [songs]);

  const selectedSortLabel =
    availableSortOptions.find((option) => option.value === sortBy)?.label ??
    "Artist";
  const activeFilterCount = selectedInstruments.length + selectedSources.length;

  useEffect(() => {
    if (!availableSortOptions.some((option) => option.value === sortBy)) {
      setSortBy("artist");
    }

    setSelectedInstruments((current) =>
      current.filter((filter) =>
        availableInstrumentOptions.some((option) => option.value === filter),
      ),
    );
  }, [availableInstrumentOptions, availableSortOptions, sortBy]);

  const filteredSongs = useMemo(() => {
    const query = normalizeSearchTerm(searchTerm);

    return [...songs]
      .filter((song) => {
        if (query && !song.searchText.includes(query)) {
          return false;
        }

        const vocalFilters = selectedInstruments.filter(
          (filter) =>
            filter === "vocalParts1" ||
            filter === "vocalParts2" ||
            filter === "vocalParts3",
        );

        const nonVocalFilters = selectedInstruments.filter(
          (filter) =>
            filter !== "vocalParts1" &&
            filter !== "vocalParts2" &&
            filter !== "vocalParts3",
        );

        const matchesNonVocalFilters = nonVocalFilters.every((filter) =>
          matchesInstrumentFilter(song, filter),
        );
        const matchesVocalFilters =
          vocalFilters.length === 0 ||
          vocalFilters.some((filter) => matchesInstrumentFilter(song, filter));

        const matchesSource =
          selectedSources.length === 0 ||
          selectedSources.some((filter) => song.source === filter);

        return matchesNonVocalFilters && matchesVocalFilters && matchesSource;
      })
      .sort((a, b) => {
        const isDifficultySort = sortBy !== "artist" && sortBy !== "song";

        if (isDifficultySort) {
          const aRating = getDifficultyRating(a, sortBy);
          const bRating = getDifficultyRating(b, sortBy);
          const aHasValue = aRating >= 0;
          const bHasValue = bRating >= 0;

          if (aHasValue !== bHasValue) {
            return aHasValue ? -1 : 1;
          }

          if (aHasValue && bHasValue) {
            const ratingResult =
              sortDirection === "asc" ? aRating - bRating : bRating - aRating;

            if (ratingResult !== 0) {
              return ratingResult;
            }
          }

          return stripLeadingArticles(a.name).localeCompare(
            stripLeadingArticles(b.name),
            undefined,
            {
              sensitivity: "base",
            },
          );
        }

        const result = compareSongs(a, b, sortBy);
        return sortDirection === "asc" ? result : -result;
      });
  }, [
    searchTerm,
    selectedInstruments,
    selectedSources,
    songs,
    sortBy,
    sortDirection,
  ]);

  useEffect(() => {
    const handleResize = () => {
      setEstimatedRowHeight(getEstimatedRowHeight());
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const virtualizer = useVirtualizer({
    count: filteredSongs.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => estimatedRowHeight,
    overscan: 8,
  });

  useEffect(() => {
    const loadSongs = async () => {
      try {
        const response = await fetch("/songs.csv");

        if (!response.ok) {
          throw new Error(`Failed to fetch songs.csv: ${response.status}`);
        }

        const csvText = await response.text();
        const worker = new Worker(
          new URL("../../workers/songs.worker.ts", import.meta.url),
          {
            type: "module",
          },
        );

        worker.onmessage = (event: MessageEvent<Song[]>) => {
          setSongs(event.data);
          setIsLoading(false);
          worker.terminate();
        };

        worker.onerror = (error) => {
          console.error("Failed to load songs:", error);
          setIsLoading(false);
          worker.terminate();
        };

        worker.postMessage(csvText);
      } catch (error) {
        console.error("Failed to load songs:", error);
        setIsLoading(false);
      }
    };

    void loadSongs();
  }, []);

  return (
    <Page className="mx-auto !pb-0 space-y-4 max-h-screen  overflow-hidden flex flex-col">
      <title>YARG Library</title>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <Spinner className="size-5" />
            Loading library...
          </div>
        </div>
      ) : (
        <>
          <div className="flex items-center gap-2">
            <div className="flex-1 min-w-0">
              <Input
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search songs or artists"
                aria-label="Search songs or artists"
              />
            </div>

            <Popover modal>
              <PopoverTrigger
                render={
                  <Button
                    aria-label="Sort and filter songs"
                    title="Sort and filter"
                    variant="outline"
                    size="icon"
                    className="rounded-full relative"
                  >
                    <SlidersHorizontal className="size-4" />

                    {activeFilterCount > 0 ? (
                      <Badge className="absolute -right-1 -top-1 flex size-4 items-center justify-center rounded-full bg-primary text-[9px] font-medium text-primary-foreground">
                        {activeFilterCount > 99 ? "99+" : activeFilterCount}
                      </Badge>
                    ) : null}
                  </Button>
                }
              />
              <PopoverContent
                align="end"
                className="space-y-2 max-h-[calc(100vh-theme(space.9)-4rem)] overflow-auto"
              >
                <div className="space-y-2">
                  <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Sort
                  </div>
                  <Select
                    value={sortBy}
                    onValueChange={(value) => setSortBy(value as SortOption)}
                  >
                    <SelectTrigger className="w-full justify-between">
                      <span>{selectedSortLabel}</span>
                    </SelectTrigger>
                    <SelectMenuContent>
                      <SelectGroup>
                        {availableSortOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectMenuContent>
                  </Select>

                  <div className="flex gap-2">
                    <Button
                      type="button"
                      size="sm"
                      variant={sortDirection === "asc" ? "default" : "outline"}
                      onClick={() => setSortDirection("asc")}
                      className="flex-1 rounded-full"
                    >
                      Ascending
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant={sortDirection === "desc" ? "default" : "outline"}
                      onClick={() => setSortDirection("desc")}
                      className="flex-1 rounded-full"
                    >
                      Descending
                    </Button>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      Instruments
                    </div>
                    {selectedInstruments.length > 0 ? (
                      <Button
                        type="button"
                        size="xs"
                        variant="link"
                        onClick={() => setSelectedInstruments([])}
                        className="-my-1"
                      >
                        Clear
                      </Button>
                    ) : null}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {availableInstrumentOptions.map((option) => {
                      const isSelected = selectedInstruments.includes(
                        option.value,
                      );

                      return (
                        <Button
                          key={option.value}
                          type="button"
                          size="sm"
                          variant={isSelected ? "default" : "outline"}
                          onClick={() => {
                            setSelectedInstruments((current) =>
                              current.includes(option.value)
                                ? current.filter(
                                    (value) => value !== option.value,
                                  )
                                : [...current, option.value],
                            );
                          }}
                          aria-pressed={isSelected}
                          className="rounded-full"
                        >
                          {option.label}
                        </Button>
                      );
                    })}
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      Source
                    </div>
                    {selectedSources.length > 0 ? (
                      <Button
                        type="button"
                        size="xs"
                        variant="link"
                        onClick={() => setSelectedSources([])}
                        className="-my-1"
                      >
                        Clear
                      </Button>
                    ) : null}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {availableSourceOptions.map((option) => {
                      const isSelected = selectedSources.includes(option.value);

                      return (
                        <Field orientation="horizontal">
                          <Checkbox
                            id={`source-filter_${option.value}`}
                            name={option.value}
                            checked={isSelected}
                            onCheckedChange={() => {
                              setSelectedSources((current) =>
                                current.includes(option.value)
                                  ? current.filter(
                                      (value) => value !== option.value,
                                    )
                                  : [...current, option.value],
                              );
                            }}
                          />
                          <Label
                            htmlFor={`source-filter_${option.value}`}
                            autoFocus={false}
                            onClick={(event) => {
                              event.preventDefault();
                              setSelectedSources((current) =>
                                current.includes(option.value)
                                  ? current.filter(
                                      (value) => value !== option.value,
                                    )
                                  : [...current, option.value],
                              );
                            }}
                          >
                            {option.label}
                          </Label>
                        </Field>
                      );
                    })}
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>

          <div
            ref={parentRef}
            className="overflow-y-auto overflow-x-hidden -ml-4 pl-4"
            style={{ scrollbarWidth: "none" }}
          >
            <div
              style={{
                height: virtualizer.getTotalSize(),
                width: "100%",
                position: "relative",
              }}
            >
              {virtualizer.getVirtualItems().map((virtualRow) => {
                const song = filteredSongs[virtualRow.index];

                return (
                  <div
                    key={song.id ?? virtualRow.index}
                    data-index={virtualRow.index}
                    ref={virtualizer.measureElement}
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      transform: `translateY(${virtualRow.start}px)`,
                    }}
                  >
                    <div className="mt-4">
                      <div className="flex justify-between">
                        <div className="font-semibold">{song.name}</div>
                        <Badge className="hidden sm:block">
                          {SOURCE_LABELS[song.source] ?? "Custom/Unknown"}
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {song.isMaster ? " as made famous by " : " by "}
                        {song.artist}
                      </div>
                      <div className="flex flex-wrap gap-x-5 gap-y-2 mt-1">
                        <GuitarDifficulty song={song} />
                        <DrumsDifficulty song={song} />
                        <Guitar2Difficulty song={song} />
                        <VocalsDifficulty song={song} />
                        <KeysDifficulty song={song} />
                        <BandDifficulty song={song} />
                      </div>
                    </div>
                    <Separator className="mt-4" />
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}
    </Page>
  );
}

function hasDifferentRatings(variations: DifficultyVariation[]) {
  if (variations.length <= 1) {
    return false;
  }

  return new Set(variations.map((variation) => variation.rating)).size > 1;
}

function useRotatingDifficulty(
  variations: DifficultyVariation[],
  defaultPartName: string,
  shouldCycle = true,
) {
  const [variationIndex, setVariationIndex] = useState(0);

  useEffect(() => {
    if (!shouldCycle || variations.length <= 1) {
      setVariationIndex(0);
      return;
    }

    const tick = () => {
      setVariationIndex((current) => (current + 1) % variations.length);
    };

    difficultyRotationSubscribers.add(tick);
    ensureDifficultyRotationTimer();

    return () => {
      difficultyRotationSubscribers.delete(tick);

      if (difficultyRotationSubscribers.size === 0) {
        clearDifficultyRotationTimer();
      }
    };
  }, [shouldCycle, variations]);

  return (
    variations[variationIndex] ?? {
      partName: defaultPartName,
      rating: undefined,
    }
  );
}

const GuitarDifficulty = memo(function GuitarDifficulty({
  song,
}: {
  song: Song;
}) {
  const defaultPartName = "Guitar";
  const variations = song.guitar;

  const difficulty = useRotatingDifficulty(variations, defaultPartName);

  return <Difficulty icon={Guitar} value={difficulty} />;
});

const DrumsDifficulty = memo(function DrumsDifficulty({
  song,
}: {
  song: Song;
}) {
  const defaultPartName = "Drums";
  const variations = song.drums;

  const shouldCycle = hasDifferentRatings(variations);
  const difficulty = useRotatingDifficulty(
    variations,
    defaultPartName,
    shouldCycle,
  );

  return <Difficulty icon={Drum} value={difficulty} />;
});

const Guitar2Difficulty = memo(function GuitarDifficulty({
  song,
}: {
  song: Song;
}) {
  const defaultPartName = "Guitar";
  const variations = song.guitar2;

  const difficulty = useRotatingDifficulty(variations, defaultPartName);

  return <Difficulty icon={Guitar} value={difficulty} />;
});

const VocalsDifficulty = memo(function VocalsDifficulty({
  song,
}: {
  song: Song;
}) {
  const defaultPartName = "Vocals";
  const variations = song.vocals;

  const shouldCycle = hasDifferentRatings(variations);
  const difficulty = useRotatingDifficulty(
    variations,
    defaultPartName,
    shouldCycle,
  );

  return <Difficulty icon={MicVocal} value={difficulty} />;
});

const KeysDifficulty = memo(function KeysDifficulty({ song }: { song: Song }) {
  const defaultPartName = "Keys";
  const variations = song.keys;

  const difficulty = useRotatingDifficulty(variations, defaultPartName);

  return <Difficulty icon={KeyboardMusic} value={difficulty} />;
});

const BandDifficulty = memo(function KeysDifficulty({ song }: { song: Song }) {
  return <Difficulty icon={Users} value={{ rating: song.bandDifficulty }} />;
});

const Difficulty = memo(function Difficulty({
  icon: Icon,
  value,
}: {
  icon: LucideIcon;
  value: DifficultyVariation;
}) {
  return (
    <div className="flex items-center gap-1">
      <div className="relative shrink-0">
        <div className="size-5">
          <Badge className="size-5 !px-0 absolute top-0">
            {
              <Icon
                data-icon="inline-start"
                className={value.variationName ? "-mt-1" : ""}
              />
            }
          </Badge>
          {value.variationName && (
            <Badge
              className="absolute p-0.5 h-2.5 -bottom-1 2 left-1/2 transform -translate-x-1/2 !text-[.5rem]"
              variant="secondary"
            >
              {value.variationName}
            </Badge>
          )}
        </div>
      </div>
      <DifficultyRating rating={value.rating} />
    </div>
  );
});

const DifficultyRating = memo(function DifficultyRating({
  rating,
}: {
  rating?: number;
}) {
  if (rating === undefined)
    return (
      <div className="text-sm text-muted-foreground w-[60px]">No Part</div>
    );

  return (
    <div>
      <div className="flex">
        {Array.from({ length: 5 }, (_, i) => {
          if (rating === 6)
            return (
              <Skull
                key={i}
                size="18"
                color="var(--background)"
                fill="var(--destructive)"
                className="-m-[3px]"
              />
            );

          return (
            <Circle
              key={i}
              size="12"
              color={
                i < rating ? "var(--foreground)" : "var(--muted-foreground)"
              }
              fill={i < rating ? "var(--foreground)" : "transparent"}
            />
          );
        })}
      </div>
    </div>
  );
});
