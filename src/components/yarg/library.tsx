import type { Song } from "@/workers/songs.worker";
import {
  ArrowDown01,
  ArrowDownAZ,
  ArrowUp10,
  ArrowUpZA,
  Bookmark,
  Dices,
  SlidersHorizontal,
  X,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router";
import { GroupedVirtuoso, type GroupedVirtuosoHandle } from "react-virtuoso";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Field } from "../ui/field";
import { HintPopover } from "../ui/hint-popover";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
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
  getDifficultyTierLabel,
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

const validSortOptions = new Set<SortOption>(
  sortOptions.map((option) => option.value),
);
const validInstrumentOptions = new Set<InstrumentOption>(
  instrumentOptions.map((option) => option.value),
);

function getQueryList<T extends string>(
  searchParams: URLSearchParams,
  key: string,
  validOptions: Set<T>,
) {
  return (searchParams.get(key)?.split(",") ?? []).filter((value): value is T =>
    validOptions.has(value as T),
  );
}

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

type LibraryItem =
  | { type: "song"; song: Song }
  | { type: "unavailable"; bookmark: Bookmark };

type LibraryGroup = {
  key: string;
  label: string;
  rating?: number;
  items: LibraryItem[];
};

type GroupNavigationItem = {
  key: string;
  label: string;
  rating?: number;
  index: number;
};

const BOOKMARKS_STORAGE_KEY = "yarg-bookmarked-song-ids";

type Bookmark = Pick<Song, "id" | "name" | "artist" | "isMaster">;

function parseBookmarks(value: string | null): Bookmark[] {
  if (!value) {
    return [];
  }

  try {
    const parsed: unknown = JSON.parse(value);

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.flatMap((bookmark): Bookmark[] => {
      if (typeof bookmark === "string") {
        return [{ id: bookmark, name: "", artist: "", isMaster: false }];
      }

      if (
        typeof bookmark === "object" &&
        bookmark !== null &&
        typeof bookmark.id === "string" &&
        typeof bookmark.name === "string" &&
        typeof bookmark.artist === "string" &&
        typeof bookmark.isMaster === "boolean"
      ) {
        return [
          {
            id: bookmark.id,
            name: bookmark.name,
            artist: bookmark.artist,
            isMaster: bookmark.isMaster,
          },
        ];
      }

      return [];
    });
  } catch {
    return [];
  }
}

function getAlphabetGroup(value: string) {
  const firstCharacter = value.normalize("NFKD").charAt(0).toUpperCase();

  if (/\d/.test(firstCharacter)) {
    return { key: "0-9", label: "0-9" };
  }

  if (!/[A-Z]/.test(firstCharacter)) {
    return { key: "#", label: "#" };
  }

  return { key: firstCharacter, label: firstCharacter };
}

function getSongGroup(song: Song, sortBy: SortOption) {
  if (sortBy === "artist") {
    const artist = stripLeadingArticles(song.artist).trim();
    return { key: `artist:${artist.toLocaleLowerCase()}`, label: song.artist };
  }

  if (sortBy === "song") {
    const name = stripLeadingArticles(song.name).trim();
    const group = getAlphabetGroup(name);
    return { key: `song:${group.key}`, label: group.label };
  }

  const rating = getDifficultyRating(song, sortBy);
  return {
    key: `difficulty:${rating}`,
    label: getDifficultyTierLabel(rating),
    rating,
  };
}

function groupSongs(songs: Song[], sortBy: SortOption): LibraryGroup[] {
  const groups: LibraryGroup[] = [];

  for (const song of songs) {
    const group = getSongGroup(song, sortBy);
    const currentGroup = groups.at(-1);

    if (!currentGroup || currentGroup.key !== group.key) {
      groups.push({ ...group, items: [] });
    }

    groups.at(-1)?.items.push({ type: "song", song });
  }

  return groups;
}

export function YargLibrary() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [songs, setSongs] = useState<Song[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(
    () => searchParams.get("q") ?? "",
  );
  const [sortBy, setSortBy] = useState<SortOption>(() => {
    const value = searchParams.get("sort");
    return value && validSortOptions.has(value as SortOption)
      ? (value as SortOption)
      : "artist";
  });
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">(() =>
    searchParams.get("dir") === "desc" ? "desc" : "asc",
  );
  const [selectedInstruments, setSelectedInstruments] = useState<
    InstrumentOption[]
  >(() => getQueryList(searchParams, "instruments", validInstrumentOptions));
  const [selectedSources, setSelectedSources] = useState<string[]>(
    () => searchParams.get("sources")?.split(",").filter(Boolean) ?? [],
  );
  const [showBookmarkedOnly, setShowBookmarkedOnly] = useState(
    () => searchParams.get("bookmarked") === "1",
  );
  const [bookmarks, setBookmarks] = useState<Bookmark[]>(() =>
    parseBookmarks(localStorage.getItem(BOOKMARKS_STORAGE_KEY)),
  );
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isGroupDialogOpen, setIsGroupDialogOpen] = useState(false);
  const [highlightedRowKey, setHighlightedRowKey] = useState<string | null>(
    null,
  );

  const virtuosoRef = useRef<GroupedVirtuosoHandle | null>(null);

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

    if (songs.some((song) => song.proKeysDifficulty >= 0)) {
      options.push(sortOptions[9]);
    }

    if (songs.some((song) => song.bandDifficulty >= 0)) {
      options.push(sortOptions[10]);
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
  const bookmarkedSongIds = useMemo(
    () => new Set(bookmarks.map((bookmark) => bookmark.id)),
    [bookmarks],
  );
  const unavailableBookmarks = useMemo(
    () =>
      bookmarks.filter(
        (bookmark) => !songs.some((song) => song.id === bookmark.id),
      ),
    [bookmarks, songs],
  );

  useEffect(() => {
    localStorage.setItem(BOOKMARKS_STORAGE_KEY, JSON.stringify(bookmarks));
  }, [bookmarks]);

  useEffect(() => {
    if (isLoading || songs.length === 0) {
      return;
    }

    setBookmarks((current) =>
      current.map((bookmark) => {
        const song = songs.find((candidate) => candidate.id === bookmark.id);

        return song
          ? {
              id: song.id,
              name: song.name,
              artist: song.artist,
              isMaster: song.isMaster,
            }
          : bookmark;
      }),
    );
  }, [isLoading, songs]);

  useEffect(() => {
    const nextSearchParams = new URLSearchParams(searchParams);

    if (searchTerm) {
      nextSearchParams.set("q", searchTerm);
    } else {
      nextSearchParams.delete("q");
    }

    if (sortBy === "artist") {
      nextSearchParams.delete("sort");
    } else {
      nextSearchParams.set("sort", sortBy);
    }

    if (sortDirection === "asc") {
      nextSearchParams.delete("dir");
    } else {
      nextSearchParams.set("dir", sortDirection);
    }

    if (selectedInstruments.length > 0) {
      nextSearchParams.set("instruments", selectedInstruments.join(","));
    } else {
      nextSearchParams.delete("instruments");
    }

    if (selectedSources.length > 0) {
      nextSearchParams.set("sources", selectedSources.join(","));
    } else {
      nextSearchParams.delete("sources");
    }

    if (showBookmarkedOnly) {
      nextSearchParams.set("bookmarked", "1");
    } else {
      nextSearchParams.delete("bookmarked");
    }

    if (nextSearchParams.toString() !== searchParams.toString()) {
      setSearchParams(nextSearchParams, { replace: true });
    }
  }, [
    searchParams,
    searchTerm,
    selectedInstruments,
    selectedSources,
    setSearchParams,
    showBookmarkedOnly,
    sortBy,
    sortDirection,
  ]);

  useEffect(() => {
    if (isLoading) {
      return;
    }

    if (!availableSortOptions.some((option) => option.value === sortBy)) {
      setSortBy("artist");
    }

    setSelectedInstruments((current) =>
      current.filter((filter) =>
        availableInstrumentOptions.some((option) => option.value === filter),
      ),
    );
  }, [availableInstrumentOptions, availableSortOptions, isLoading, sortBy]);

  const filteredSongs = useMemo(() => {
    const query = normalizeSearchTerm(searchTerm);

    return [...songs]
      .filter((song) => {
        if (query && !song.searchText.includes(query)) {
          return false;
        }

        if (showBookmarkedOnly && !bookmarkedSongIds.has(song.id)) {
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
    showBookmarkedOnly,
    bookmarkedSongIds,
  ]);

  const libraryGroups = useMemo(() => {
    const groups = groupSongs(filteredSongs, sortBy);
    const query = normalizeSearchTerm(searchTerm);
    const missingBookmarks = unavailableBookmarks.filter(
      (bookmark) =>
        !query ||
        normalizeSearchTerm(`${bookmark.name} ${bookmark.artist}`).includes(
          query,
        ),
    );

    if (missingBookmarks.length > 0) {
      groups.push({
        key: "unavailable",
        label: "No longer available",
        items: [],
      });
      groups.at(-1)?.items.push(
        ...missingBookmarks.map((bookmark) => ({
          type: "unavailable" as const,
          bookmark,
        })),
      );
    }

    return groups;
  }, [filteredSongs, searchTerm, sortBy, unavailableBookmarks]);

  const libraryItems = useMemo(
    () => libraryGroups.flatMap((group) => group.items),
    [libraryGroups],
  );

  const groupItemStarts = useMemo(() => {
    let itemCount = 0;

    return libraryGroups.map((group) => {
      const start = itemCount;
      itemCount += group.items.length;
      return start;
    });
  }, [libraryGroups]);

  const groupHeaders = useMemo(
    () =>
      libraryGroups.map((group, index) => ({
        key: group.key,
        label: group.label,
        rating: group.rating,
        index,
      })),
    [libraryGroups],
  );

  const navigationGroups = useMemo(() => {
    if (sortBy !== "artist") {
      return groupHeaders;
    }

    const groups: GroupNavigationItem[] = [];
    let previousGroupKey: string | undefined;

    for (const group of groupHeaders) {
      if (group.key === "unavailable") {
        groups.push(group);
        continue;
      }

      const alphabetGroup = getAlphabetGroup(stripLeadingArticles(group.label));

      if (alphabetGroup.key !== previousGroupKey) {
        groups.push({
          key: `artist:${alphabetGroup.key}`,
          label: alphabetGroup.label,
          index: group.index,
        });
        previousGroupKey = alphabetGroup.key;
      }
    }

    return groups;
  }, [groupHeaders, sortBy]);

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

  useEffect(() => {
    if (!highlightedRowKey) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setHighlightedRowKey(null);
    }, 3100);

    return () => window.clearTimeout(timeoutId);
  }, [highlightedRowKey]);

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
          <div className="mx-auto h-dvh max-h-dvh overflow-hidden flex flex-col gap-2">
            <div className="w-full max-w-4xl mx-auto p-4 pb-0 sm:p-8 sm:pb-0 flex items-center gap-2">
              <div className="flex-1">
                <Input
                  type="search"
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
                      className="relative"
                    >
                      <SlidersHorizontal />

                      {activeFilterCount > 0 ? (
                        <Badge className="absolute -right-1 -top-1 flex size-4 items-center justify-center rounded-full bg-primary text-[9px] font-medium text-primary-foreground">
                          {activeFilterCount > 99 ? "99+" : activeFilterCount}
                        </Badge>
                      ) : null}
                    </Button>
                  }
                />
                {/* The max height calculation is the available view height,
                minus the height of the input/button (tailwind spacing 9), minus
                the top padding of the page (spacing 4 or 8 depending on screen
                size), minus an additional spacing 4 so it doesn't touch the
                bottom. */}
                <PopoverContent
                  align="end"
                  className="space-y-2 max-h-[calc(100dvh-theme(space.9)-theme(space.4)-theme(space.4))] sm:max-h-[calc(100dvh-theme(space.9)-theme(space.8)-theme(space.4))] overflow-auto"
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

            <div className="relative min-h-0 flex-1 overflow-hidden">
              <GroupedVirtuoso
                ref={virtuosoRef}
                groupCounts={libraryGroups.map((group) => group.items.length)}
                className="h-full w-full"
                style={{ scrollbarGutter: "stable both-edges" }}
                groupContent={(groupIndex) => {
                  const group = libraryGroups[groupIndex];

                  return group ? (
                    <div className="max-w-4xl mx-auto px-4 sm:px-8 rounded-full bg-background">
                      <Button
                        className={`w-full truncate text-ellipsis ${
                          highlightedRowKey === `header:${group.key}`
                            ? "animate-[library-highlight_3000ms_linear]"
                            : ""
                        }`}
                        variant="secondary"
                        onClick={() => setIsGroupDialogOpen(true)}
                      >
                        <span className="flex items-center justify-center gap-2">
                          {group.label}
                        </span>
                      </Button>
                    </div>
                  ) : null;
                }}
                computeItemKey={(itemIndex) => {
                  const row = libraryItems[itemIndex];

                  return row?.type === "song"
                    ? (row.song.id ?? itemIndex)
                    : row?.type === "unavailable"
                      ? row.bookmark.id
                      : itemIndex;
                }}
                itemContent={(itemIndex, groupIndex) => {
                  const group = libraryGroups[groupIndex];
                  const row = libraryItems[itemIndex];

                  if (!group || !row) {
                    return null;
                  }

                  const isLastSongInGroup =
                    itemIndex ===
                    (groupItemStarts[groupIndex] ?? 0) + group.items.length - 1;
                  const rowKey =
                    row.type === "song"
                      ? `song:${row.song.id}`
                      : `unavailable:${row.bookmark.id}`;

                  return (
                    <div
                      className={`max-w-4xl mx-auto px-4 sm:px-8 rounded-md ${
                        highlightedRowKey === rowKey
                          ? "animate-[library-highlight_3000ms_linear]"
                          : ""
                      }`}
                    >
                      <div
                        className={`pt-4 ${isLastSongInGroup ? "pb-8" : ""}`}
                      >
                        <div className="flex items-center gap-2">
                          {row.type === "unavailable" ? null : (
                            <div className="flex-none size-8 background-muted rounded-full flex items-center justify-center bg-neutral-800 -ml-1">
                              <Popover>
                                <PopoverTrigger openOnHover={true}>
                                  <img
                                    src={`/yarg/icons/${SOURCE_ICONS[row.song.source] ?? "custom.png"}`}
                                    alt={
                                      SOURCE_LABELS[row.song.source] ??
                                      "Custom/Unknown"
                                    }
                                  />
                                </PopoverTrigger>
                                <PopoverContent className="w-auto px-2 py-1 text-sm">
                                  {SOURCE_LABELS[row.song.source] ??
                                    "Custom/Unknown"}
                                </PopoverContent>
                              </Popover>
                            </div>
                          )}

                          <div className="flex-grow min-w-0 truncate">
                            <div className="font-semibold truncate text-ellipsis">
                              {row.type === "unavailable"
                                ? row.bookmark.name || "Unknown song"
                                : row.song.name}
                            </div>
                            <div className="text-sm text-muted-foreground truncate text-ellipsis">
                              {(
                                row.type === "unavailable"
                                  ? row.bookmark.isMaster
                                  : row.song.isMaster
                              )
                                ? " as made famous by "
                                : " by "}
                              {row.type === "unavailable"
                                ? row.bookmark.artist || "Unknown artist"
                                : row.song.artist}
                            </div>
                            {row.type === "unavailable" ? (
                              <div className="text-xs text-muted-foreground">
                                No longer available{" "}
                                <HintPopover>
                                  Songs previously bookmarked may appear as no
                                  longer available if it's been replaced by a
                                  new version. Try searching for the new version
                                  and bookmarking it if it's available.
                                </HintPopover>
                              </div>
                            ) : null}
                          </div>

                          <Toggle
                            aria-label={
                              row.type === "unavailable"
                                ? `Remove bookmark for ${row.bookmark.name || "unknown song"}`
                                : `${bookmarkedSongIds.has(row.song.id) ? "Remove" : "Add"} bookmark for ${row.song.name} ${row.song.isMaster ? "as made famous by" : "by"} ${row.song.artist}`
                            }
                            title={
                              row.type === "unavailable"
                                ? "Remove bookmark"
                                : `${bookmarkedSongIds.has(row.song.id) ? "Remove" : "Add"} bookmark for ${row.song.name} ${row.song.isMaster ? "as made famous by" : "by"} ${row.song.artist}`
                            }
                            pressed={
                              row.type === "unavailable" ||
                              bookmarkedSongIds.has(row.song.id)
                            }
                            className="flex-none bg-transparent hover:bg-transparent aria-pressed:bg-transparent"
                            size="sm"
                            onClick={() => {
                              if (row.type === "unavailable") {
                                setBookmarks((current) =>
                                  current.filter(
                                    (bookmark) =>
                                      bookmark.id !== row.bookmark.id,
                                  ),
                                );
                                return;
                              }

                              setBookmarks((current) => {
                                if (
                                  current.some(
                                    (bookmark) => bookmark.id === row.song.id,
                                  )
                                ) {
                                  return current.filter(
                                    (bookmark) => bookmark.id !== row.song.id,
                                  );
                                }

                                return [
                                  ...current,
                                  {
                                    id: row.song.id,
                                    name: row.song.name,
                                    artist: row.song.artist,
                                    isMaster: row.song.isMaster,
                                  },
                                ];
                              });
                            }}
                          >
                            <Bookmark className="group-aria-pressed/toggle:fill-foreground" />
                          </Toggle>
                        </div>
                        {row.type === "song" ? (
                          <div className="flex flex-wrap gap-x-5 gap-y-2 mt-1">
                            <GuitarDifficulty song={row.song} />
                            <DrumsDifficulty song={row.song} />
                            <Guitar2Difficulty song={row.song} />
                            <VocalsDifficulty song={row.song} />
                            <KeysDifficulty song={row.song} />
                            <BandDifficulty song={row.song} />
                          </div>
                        ) : null}
                        {isLastSongInGroup ? null : (
                          <div className="pt-4">
                            <Separator />
                          </div>
                        )}
                      </div>
                    </div>
                  );
                }}
              />

              {libraryGroups.length === 0 ? (
                <div className="absolute inset-0 flex items-center justify-center px-4 text-center text-sm text-muted-foreground">
                  No songs match your search or filters.
                </div>
              ) : null}

              <div className="absolute bottom-4 left-1/2 z-10 -translate-x-1/2 flex gap-2">
                <Toggle
                  variant="outline"
                  className="bg-background/60 backdrop-blur shadow-[0px_0px_16px_4px] shadow-neutral-300 dark:shadow-neutral-900"
                  pressed={showBookmarkedOnly}
                  onClick={() => {
                    setShowBookmarkedOnly((current) => !current);
                  }}
                >
                  <Bookmark className="group-aria-pressed/toggle:fill-foreground" />
                  Bookmarks
                </Toggle>
                <Button
                  aria-label="Random"
                  title="Random"
                  variant="outline"
                  size="icon"
                  className="bg-background/60 backdrop-blur shadow-[0px_0px_16px_4px] shadow-neutral-300 dark:shadow-neutral-900"
                  onClick={() => {
                    if (sortBy === "artist") {
                      const randomGroup =
                        groupHeaders[
                          Math.floor(Math.random() * groupHeaders.length)
                        ];

                      if (randomGroup) {
                        virtuosoRef.current?.scrollToIndex({
                          groupIndex: randomGroup.index,
                          align: "center",
                        });
                        setHighlightedRowKey(`header:${randomGroup.key}`);
                      }

                      return;
                    }

                    const randomSong =
                      filteredSongs[
                        Math.floor(Math.random() * filteredSongs.length)
                      ];
                    const randomRowIndex = randomSong
                      ? libraryItems.findIndex(
                          (item) =>
                            item.type === "song" &&
                            item.song.id === randomSong.id,
                        )
                      : -1;

                    if (randomRowIndex >= 0) {
                      virtuosoRef.current?.scrollToIndex({
                        index: randomRowIndex,
                        align: "center",
                      });
                      setHighlightedRowKey(`song:${randomSong.id}`);
                    }
                  }}
                >
                  <Dices />
                </Button>
              </div>
            </div>
          </div>

          <Dialog open={isGroupDialogOpen} onOpenChange={setIsGroupDialogOpen}>
            <DialogContent className="max-h-[calc(100dvh-2rem)] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Jump to section</DialogTitle>
              </DialogHeader>
              <div className="grid gap-2">
                {navigationGroups.map((group) => (
                  <DialogClose
                    key={group.key}
                    render={<Button variant="outline" />}
                    onClick={() => {
                      virtuosoRef.current?.scrollToIndex({
                        groupIndex: group.index,
                        align: "start",
                      });
                    }}
                  >
                    {group.label}
                  </DialogClose>
                ))}
              </div>
            </DialogContent>
          </Dialog>
        </>
      )}
    </>
  );
}
