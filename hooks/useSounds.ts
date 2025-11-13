import { useCallback } from 'react';

/**
 * A custom hook to manage sound effects for the game.
 * In a real-world application, you might use a library like Howler.js
 * and preload audio files for better performance and to handle browser inconsistencies.
 * For this example, the actual audio playback is commented out to avoid
 * dependencies on sound files that are not present.
 */
const useSounds = () => {
  const playSound = useCallback((path: string) => {
    // try {
    //   new Audio(path).play();
    // } catch (e) {
    //   console.error(`Could not play sound at path: ${path}`, e);
    // }
  }, []);

  const playFlipSound = useCallback(() => {
    playSound('/sounds/flip.mp3');
  }, [playSound]);

  const playMatchSound = useCallback(() => {
    playSound('/sounds/match.mp3');
  }, [playSound]);

  const playNoMatchSound = useCallback(() => {
    playSound('/sounds/no-match.mp3');
  }, [playSound]);

  const playWinSound = useCallback(() => {
    playSound('/sounds/win.mp3');
  }, [playSound]);

  return { playFlipSound, playMatchSound, playNoMatchSound, playWinSound };
};

export default useSounds;
