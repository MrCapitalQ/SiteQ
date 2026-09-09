import type { DifficultyVariation, Song } from "@/workers/songs.worker";
import {
  Circle,
  Drum,
  Guitar,
  KeyboardMusic,
  MicVocal,
  Skull,
  Users,
  type LucideIcon,
} from "lucide-react";
import { memo } from "react";
import { Badge } from "../ui/badge";
import { useRotatingDifficulty } from "./useRotatingDifficulty";

function hasDifferentRatings(variations: DifficultyVariation[]) {
  if (variations.length <= 1) {
    return false;
  }

  return new Set(variations.map((variation) => variation.rating)).size > 1;
}

export const GuitarDifficulty = memo(function GuitarDifficulty({
  song,
}: {
  song: Song;
}) {
  const defaultVariationName = "Guitar";
  const variations = song.guitar;

  const difficulty = useRotatingDifficulty(variations, defaultVariationName);

  return <Difficulty icon={Guitar} value={difficulty} />;
});

export const DrumsDifficulty = memo(function DrumsDifficulty({
  song,
}: {
  song: Song;
}) {
  const variations = song.drums;

  const shouldCycle = hasDifferentRatings(variations);
  const difficulty = useRotatingDifficulty(variations, undefined, shouldCycle);

  return <Difficulty icon={Drum} value={difficulty} />;
});

export const Guitar2Difficulty = memo(function Guitar2Difficulty({
  song,
}: {
  song: Song;
}) {
  const defaultVariationName = "Bass";
  const variations = song.guitar2;

  const difficulty = useRotatingDifficulty(variations, defaultVariationName);

  return <Difficulty icon={Guitar} value={difficulty} />;
});

export const VocalsDifficulty = memo(function VocalsDifficulty({
  song,
}: {
  song: Song;
}) {
  const variations = song.vocals;

  const shouldCycle = hasDifferentRatings(variations);
  const difficulty = useRotatingDifficulty(variations, undefined, shouldCycle);

  return <Difficulty icon={MicVocal} value={difficulty} />;
});

export const KeysDifficulty = memo(function KeysDifficulty({
  song,
}: {
  song: Song;
}) {
  const variations = song.keys;

  const difficulty = useRotatingDifficulty(variations);

  return <Difficulty icon={KeyboardMusic} value={difficulty} />;
});

export const BandDifficulty = memo(function BandDifficulty({
  song,
}: {
  song: Song;
}) {
  return <Difficulty icon={Users} value={{ rating: song.bandDifficulty }} />;
});

const difficultyTierLabels = [
  "Warm Up",
  "Apprentice",
  "Solid",
  "Moderate",
  "Challenging",
  "Nightmare",
];

export function getDifficultyTierLabel(rating: number) {
  return rating >= 6
    ? "Impossible"
    : (difficultyTierLabels[rating] ?? "No Part");
}

export const Difficulty = memo(function Difficulty({
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

export const DifficultyRating = memo(function DifficultyRating({
  rating,
}: {
  rating?: number;
}) {
  if (rating === undefined)
    return (
      <div
        className="text-sm text-muted-foreground w-[60px]"
        role="img"
        aria-label="No Part"
        title="No Part"
      >
        No Part
      </div>
    );

  const tierLabel = getDifficultyTierLabel(rating);
  const accessibleLabel = `${tierLabel} (Tier ${rating})`;

  return (
    <div
      className="flex"
      role="img"
      aria-label={accessibleLabel}
      title={accessibleLabel}
    >
      {Array.from({ length: 5 }, (_, i) => {
        if (rating === 6)
          return (
            <Skull
              key={i}
              size="18"
              color="var(--background)"
              fill="var(--destructive)"
              className="-m-[3px] size-4.5"
            />
          );

        return (
          <Circle
            key={i}
            size="12"
            color={i < rating ? "var(--foreground)" : "var(--muted-foreground)"}
            fill={i < rating ? "var(--foreground)" : "transparent"}
            className="size-3"
          />
        );
      })}
    </div>
  );
});
