import type { DifficultyVariation } from "@/workers/songs.worker";
import { useEffect, useState } from "react";

const DIFFICULTY_ROTATION_MS = 2500;

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

export function useRotatingDifficulty(
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
