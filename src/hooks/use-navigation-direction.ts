import { useEffect, useState } from "react";

type NavigationDirection = 'none' | 'back' | 'forward';
export function useNavigationDirection(): NavigationDirection {
  const [direction, setNavigationDirection] = useState<NavigationDirection>('none');
  const callback = (navigateEvent: any) => {
    if (navigateEvent.navigationType === 'push') {
      setNavigationDirection('forward');
      return;
    }

    const destinationIndex = navigateEvent.destination.index;
    if (destinationIndex !== -1) {
      const currentIndex = (window as any).navigation.currentEntry.index;
      if (destinationIndex < currentIndex) {
        setNavigationDirection('back');
        return;
      } else if (destinationIndex > currentIndex) {
        setNavigationDirection('forward');
        return;
      }
    }

    setNavigationDirection('none');
  };

  useEffect(() => {
    (window as any).navigation.addEventListener("navigate", callback);
    return () => (window as any).navigation.removeEventListener("navigate", callback);
  })

  return direction;
}
