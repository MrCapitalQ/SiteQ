import type { Song } from "@/workers/songs.worker";
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
import { Input } from "../ui/input";
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
  { value: "leadGuitar", label: "Lead Guitar Difficulty" },
  { value: "rhythmGuitar", label: "Rhythm Guitar Difficulty" },
  { value: "coOpGuitar", label: "Co-op Guitar Difficulty" },
  { value: "bassGuitar", label: "Bass Guitar Difficulty" },
  { value: "drums", label: "Drums Difficulty" },
  { value: "vocals", label: "Vocals Difficulty" },
  { value: "keys", label: "Keys Difficulty" },
  { value: "bandDifficulty", label: "Band Difficulty" },
] as const;

type SortOption = (typeof sortOptions)[number]["value"];

const filterOptions = [
  { value: "leadGuitar", label: "Lead Guitar" },
  { value: "rhythmGuitar", label: "Rhythm Guitar" },
  { value: "coOpGuitar", label: "Co-op Guitar" },
  { value: "bassGuitar", label: "Bass Guitar" },
  { value: "drums", label: "Drums" },
  { value: "vocalParts1", label: "Vocals - 1 Part" },
  { value: "vocalParts2", label: "Vocals - 2 Parts" },
  { value: "vocalParts3", label: "Vocals - 3 Parts" },
  { value: "keys", label: "Keys" },
] as const;

type FilterOption = (typeof filterOptions)[number]["value"];

function getDifficultyRating(song: Song, option: SortOption) {
  switch (option) {
    case "leadGuitar":
      return song.leadGuitar;
    case "rhythmGuitar":
      return song.rhythmGuitar;
    case "coOpGuitar":
      return song.coOpGuitar;
    case "bassGuitar":
      return song.bassGuitar;
    case "drums":
      return song.proDrums >= 0 ? song.proDrums : song.drumsDifficulty;
    case "vocals":
      return song.harmonyDifficulty >= 0
        ? song.harmonyDifficulty
        : song.vocalsDifficulty;
    case "keys":
      return song.keysDifficulty;
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

function matchesFilter(song: Song, filter: FilterOption) {
  switch (filter) {
    case "leadGuitar":
      return song.leadGuitar >= 0;
    case "rhythmGuitar":
      return song.rhythmGuitar >= 0;
    case "coOpGuitar":
      return song.coOpGuitar >= 0;
    case "bassGuitar":
      return song.bassGuitar >= 0;
    case "drums":
      return song.proDrums >= 0 || song.drumsDifficulty >= 0;
    case "vocalParts1":
      return song.vocalParts === 1;
    case "vocalParts2":
      return song.vocalParts === 2;
    case "vocalParts3":
      return song.vocalParts === 3;
    case "keys":
      return song.keysDifficulty >= 0;
    default:
      return true;
  }
}

function getEstimatedRowHeight() {
  return window.innerWidth < 324
    ? 194
    : window.innerWidth < 480
      ? 140
      : window.innerWidth < 824
        ? 110
        : 24;
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
  const [selectedFilters, setSelectedFilters] = useState<FilterOption[]>([]);
  const parentRef = useRef<HTMLDivElement | null>(null);

  const availableSortOptions = useMemo(() => {
    const options: Array<(typeof sortOptions)[number]> = [
      sortOptions[0],
      sortOptions[1],
    ];

    if (songs.some((song) => song.leadGuitar >= 0)) {
      options.push(sortOptions[2]);
    }

    if (songs.some((song) => song.rhythmGuitar >= 0)) {
      options.push(sortOptions[3]);
    }

    if (songs.some((song) => song.coOpGuitar >= 0)) {
      options.push(sortOptions[4]);
    }

    if (songs.some((song) => song.bassGuitar >= 0)) {
      options.push(sortOptions[5]);
    }

    if (songs.some((song) => song.proDrums >= 0 || song.drumsDifficulty >= 0)) {
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

  const availableFilterOptions = useMemo(() => {
    return filterOptions.filter((option) => {
      switch (option.value) {
        case "leadGuitar":
          return songs.some((song) => song.leadGuitar >= 0);
        case "rhythmGuitar":
          return songs.some((song) => song.rhythmGuitar >= 0);
        case "coOpGuitar":
          return songs.some((song) => song.coOpGuitar >= 0);
        case "bassGuitar":
          return songs.some((song) => song.bassGuitar >= 0);
        case "drums":
          return songs.some(
            (song) => song.proDrums >= 0 || song.drumsDifficulty >= 0,
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

  const selectedSortLabel =
    availableSortOptions.find((option) => option.value === sortBy)?.label ??
    "Artist";
  const activeFilterCount = selectedFilters.length;

  useEffect(() => {
    if (!availableSortOptions.some((option) => option.value === sortBy)) {
      setSortBy("artist");
    }

    setSelectedFilters((current) =>
      current.filter((filter) =>
        availableFilterOptions.some((option) => option.value === filter),
      ),
    );
  }, [availableFilterOptions, availableSortOptions, sortBy]);

  const filteredSongs = useMemo(() => {
    const query = normalizeSearchTerm(searchTerm);

    return [...songs]
      .filter((song) => {
        if (query && !song.searchText.includes(query)) {
          return false;
        }

        const vocalFilters = selectedFilters.filter(
          (filter) =>
            filter === "vocalParts1" ||
            filter === "vocalParts2" ||
            filter === "vocalParts3",
        );

        const nonVocalFilters = selectedFilters.filter(
          (filter) =>
            filter !== "vocalParts1" &&
            filter !== "vocalParts2" &&
            filter !== "vocalParts3",
        );

        const matchesNonVocalFilters = nonVocalFilters.every((filter) =>
          matchesFilter(song, filter),
        );
        const matchesVocalFilters =
          vocalFilters.length === 0 ||
          vocalFilters.some((filter) => matchesFilter(song, filter));

        return matchesNonVocalFilters && matchesVocalFilters;
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
  }, [searchTerm, selectedFilters, songs, sortBy, sortDirection]);

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
    <Page className="mx-auto !pb-0 space-y-4 max-h-[100vh] flex flex-col">
      <title>YARG Library</title>
      <div>
        <h1>YARG Library</h1>
      </div>

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

            <Popover>
              <PopoverTrigger
                render={
                  <button
                    type="button"
                    aria-label="Sort and filter songs"
                    title="Sort and filter"
                    className="relative inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-input bg-background text-foreground shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
                  >
                    <SlidersHorizontal className="size-4" />

                    {activeFilterCount > 0 ? (
                      <span className="absolute -right-1 -top-1 flex size-4 items-center justify-center rounded-full bg-primary text-[9px] font-medium text-primary-foreground">
                        {Math.min(activeFilterCount, 9)}
                      </span>
                    ) : null}
                  </button>
                }
              />
              <PopoverContent align="end" className="space-y-2">
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
                  <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Filters
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {availableFilterOptions.map((option) => {
                      const isSelected = selectedFilters.includes(option.value);

                      return (
                        <Button
                          key={option.value}
                          type="button"
                          size="sm"
                          variant={isSelected ? "default" : "outline"}
                          onClick={() => {
                            setSelectedFilters((current) =>
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

                  {selectedFilters.length > 0 ? (
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      onClick={() => setSelectedFilters([])}
                      className="rounded-full"
                    >
                      Clear filters
                    </Button>
                  ) : null}
                </div>
              </PopoverContent>
            </Popover>
          </div>

          <div
            ref={parentRef}
            className="overflow-y-auto overflow-x-hidden"
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
                      <div className="font-semibold">
                        {song.name}
                        <span className="text-sm text-muted-foreground">
                          {song.isMaster ? " as made famous by " : " by "}
                          {song.artist}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-x-5 gap-y-2 mt-1">
                        <GuitarDifficulty song={song} />
                        <DrumsDifficulty song={song} />
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

function hasDifferentRatings(
  variations: { partName: string; rating: number }[],
) {
  if (variations.length <= 1) {
    return false;
  }

  return new Set(variations.map((variation) => variation.rating)).size > 1;
}

function useRotatingDifficulty(
  variations: { partName: string; rating: number }[],
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

  return (
    <Difficulty
      icon={Guitar}
      partName={difficulty.partName}
      rating={difficulty.rating}
    />
  );
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

  return (
    <Difficulty
      icon={Drum}
      partName={difficulty.partName}
      rating={difficulty.rating}
    />
  );
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

  return (
    <Difficulty
      icon={MicVocal}
      partName={difficulty.partName}
      rating={difficulty.rating}
    />
  );
});

const KeysDifficulty = memo(function KeysDifficulty({ song }: { song: Song }) {
  const defaultPartName = "Keys";
  const variations = song.keys;

  const difficulty = useRotatingDifficulty(variations, defaultPartName);

  return (
    <Difficulty
      icon={KeyboardMusic}
      partName={difficulty.partName}
      rating={difficulty.rating}
    />
  );
});

const BandDifficulty = memo(function KeysDifficulty({ song }: { song: Song }) {
  return (
    <Difficulty icon={Users} partName="Band" rating={song.bandDifficulty} />
  );
});

const Difficulty = memo(function Difficulty({
  icon: Icon,
  partName,
  rating,
}: {
  icon: LucideIcon;
  partName: string;
  rating?: number;
}) {
  return (
    <div className="flex items-center gap-1">
      <div className="relative shrink-0">
        <Badge className="w-18 flex justify-start pl-6" variant="secondary">
          {partName}
        </Badge>
        <Badge className="size-5 !px-0 absolute top-0">
          {<Icon data-icon="inline-start" />}
        </Badge>
      </div>
      <DifficultyRating rating={rating} />
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
