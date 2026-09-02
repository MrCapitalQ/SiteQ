import type { Song } from "@/workers/songs.worker";
import { useVirtualizer } from "@tanstack/react-virtual";
import {
  ArrowDown01,
  ArrowDownAZ,
  ArrowDownToLine,
  ArrowUp10,
  ArrowUpToLine,
  ArrowUpZA,
  SlidersHorizontal,
  X,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
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
import { Toggle } from "../ui/toggle";
import {
  BandDifficulty,
  DrumsDifficulty,
  Guitar2Difficulty,
  GuitarDifficulty,
  KeysDifficulty,
  VocalsDifficulty,
} from "./difficulty";
import { SOURCE_ICONS, SOURCE_LABELS } from "./source";

function normalizeSearchTerm(value: string) {
  return value
    .trim()
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "");
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
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isAtTop, setIsAtTop] = useState(true);
  const [isAtBottom, setIsAtBottom] = useState(false);

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
      .sort((a, b) =>
        stripLeadingArticles(a.label).localeCompare(
          stripLeadingArticles(b.label),
        ),
      );
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

  useEffect(() => {
    if (!isFilterOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isFilterOpen]);

  const virtualizer = useVirtualizer({
    count: filteredSongs.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => estimatedRowHeight,
    overscan: 8,
  });

  useEffect(() => {
    const scrollElement = parentRef.current;

    if (!scrollElement) {
      return;
    }

    const updateScrollPosition = () => {
      const maxScrollTop =
        scrollElement.scrollHeight - scrollElement.clientHeight;

      setIsAtTop(scrollElement.scrollTop <= 1);
      setIsAtBottom(scrollElement.scrollTop >= maxScrollTop - 1);
    };

    updateScrollPosition();
    scrollElement.addEventListener("scroll", updateScrollPosition);
    window.addEventListener("resize", updateScrollPosition);

    return () => {
      scrollElement.removeEventListener("scroll", updateScrollPosition);
      window.removeEventListener("resize", updateScrollPosition);
    };
  }, [filteredSongs.length, isLoading]);

  useEffect(() => {
    const loadSongs = async () => {
      try {
        const response = await fetch("/yarg/songs.csv");

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
    <>
      <title>YARG Library</title>
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <Spinner />
            Loading library...
          </div>
        </div>
      ) : (
        <>
          <div className="fixed z-1 w-full bg-background/75 shadow-md backdrop-blur">
            <div className="w-full max-w-4xl mx-auto p-4 pb-0 sm:p-8 sm:pb-0 flex items-center gap-2">
              <div className="flex-1 min-w-0">
                <Input
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder="Search songs or artists"
                  aria-label="Search songs or artists"
                />
              </div>

              <Popover open={isFilterOpen} onOpenChange={setIsFilterOpen}>
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

                    <div className="flex gap-2">
                      <Select
                        value={sortBy}
                        onValueChange={(value) =>
                          setSortBy(value as SortOption)
                        }
                      >
                        <SelectTrigger className="w-full justify-between">
                          <span>{selectedSortLabel}</span>
                        </SelectTrigger>
                        <SelectMenuContent>
                          <SelectGroup>
                            {availableSortOptions.map((option) => (
                              <SelectItem
                                key={option.value}
                                value={option.value}
                              >
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectMenuContent>
                      </Select>

                      <Button
                        aria-label={
                          sortDirection === "desc" ? "Descending" : "Ascending"
                        }
                        title={
                          sortDirection === "desc" ? "Descending" : "Ascending"
                        }
                        variant="outline"
                        size="icon"
                        className="rounded-full"
                        onClick={() =>
                          setSortDirection(
                            sortDirection === "asc" ? "desc" : "asc",
                          )
                        }
                      >
                        {sortDirection === "asc" ? (
                          sortBy === "artist" || sortBy === "song" ? (
                            <ArrowDownAZ />
                          ) : (
                            <ArrowDown01 />
                          )
                        ) : sortBy === "artist" || sortBy === "song" ? (
                          <ArrowUpZA />
                        ) : (
                          <ArrowUp10 />
                        )}
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
                          variant="ghost"
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
                          <Toggle
                            key={option.value}
                            variant="outline"
                            size="sm"
                            pressed={isSelected}
                            onClick={() => {
                              setSelectedInstruments((current) =>
                                current.includes(option.value)
                                  ? current.filter(
                                      (value) => value !== option.value,
                                    )
                                  : [...current, option.value],
                              );
                            }}
                          >
                            {option.label}
                            {isSelected && <X />}
                          </Toggle>
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
                          variant="ghost"
                          onClick={() => setSelectedSources([])}
                          className="-my-1"
                        >
                          Clear
                        </Button>
                      ) : null}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {availableSourceOptions.map((option) => {
                        const isSelected = selectedSources.includes(
                          option.value,
                        );

                        return (
                          <Field key={option.value} orientation="horizontal">
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
          </div>
          <Page className="mx-auto !py-0 h-screen max-h-screen overflow-hidden flex flex-col">
            <div className="relative min-h-0 flex-1 overflow-hidden">
              <div
                ref={parentRef}
                className="absolute inset-0 min-h-0 min-w-0 overflow-y-auto overflow-x-hidden -ml-4 pl-4"
                style={{ scrollbarWidth: "none" }}
              >
                <div
                  className="mt-[calc(theme(space.9)+theme(space.4))] sm:mt-[calc(theme(space.9)+theme(space.8))] mb-32"
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
                          <div className="flex items-center justify-between gap-2">
                            <div className="truncate">
                              <div className="font-semibold truncate text-ellipsis">
                                {song.name}
                              </div>
                              <div className="text-sm text-muted-foreground truncate text-ellipsis">
                                {song.isMaster ? " as made famous by " : " by "}
                                {song.artist}
                              </div>
                            </div>

                            <div className="flex-none size-8 p-0.5 background-muted rounded-full flex items-center justify-center bg-neutral-800">
                              <Popover>
                                <PopoverTrigger openOnHover={true}>
                                  <img
                                    src={`/yarg/icons/${SOURCE_ICONS[song.source] ?? "custom.png"}`}
                                    alt={
                                      SOURCE_LABELS[song.source] ??
                                      "Custom/Unknown"
                                    }
                                  />
                                </PopoverTrigger>
                                <PopoverContent
                                  side="left"
                                  className="w-auto px-2 py-1 text-sm"
                                >
                                  {SOURCE_LABELS[song.source] ??
                                    "Custom/Unknown"}
                                </PopoverContent>
                              </Popover>
                            </div>
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

              {!isLoading &&
              filteredSongs.length > 0 &&
              (!isAtTop || !isAtBottom) ? (
                <div className="z-10 ">
                  {!isAtTop ? (
                    <Button
                      variant="outline"
                      size="sm"
                      className="absolute top-[calc(theme(space.9)+theme(space.4)+theme(space.4))] sm:top-[calc(theme(space.9)+theme(space.8)+theme(space.4))]  left-1/2 -translate-x-1/2 bg-background/60 shadow-md backdrop-blur"
                      onClick={() =>
                        virtualizer.scrollToIndex(0, { align: "start" })
                      }
                    >
                      <ArrowUpToLine />
                      Scroll to top
                    </Button>
                  ) : null}
                  {isAtTop ? (
                    <Button
                      variant="outline"
                      size="sm"
                      className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-background/60 shadow-md backdrop-blur"
                      onClick={() =>
                        virtualizer.scrollToIndex(filteredSongs.length - 1, {
                          align: "end",
                        })
                      }
                    >
                      <ArrowDownToLine />
                      Scroll to bottom
                    </Button>
                  ) : null}
                </div>
              ) : null}
            </div>
          </Page>
        </>
      )}
    </>
  );
}
