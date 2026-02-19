import confetti from 'canvas-confetti';

export const triggerConfetti = () => {
  const duration = 3000;
  const animationEnd = Date.now() + duration;
  const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

  const randomInRange = (min: number, max: number) => {
    return Math.random() * (max - min) + min;
  };

  const interval: any = setInterval(function () {
    const timeLeft = animationEnd - Date.now();

    if (timeLeft <= 0) {
      return clearInterval(interval);
    }

    const particleCount = 50 * (timeLeft / duration);
    
    // since particles fall down, start a bit higher than random
    confetti({
      ...defaults,
      particleCount,
      origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
    });
    confetti({
      ...defaults,
      particleCount,
      origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
    });
  }, 250);
};

export const parseCSV = (text: string): string[] => {
  // Basic split by newline, then comma if present, cleanup
  const lines = text.split(/\r?\n/);
  const names: string[] = [];

  lines.forEach(line => {
    const trimmed = line.trim();
    if (!trimmed) return;
    
    // Simple logic: if it contains commas, assume CSV and take first non-empty column or just split
    // For this simple app, we'll split by comma and add all valid parts
    const parts = trimmed.split(',');
    parts.forEach(p => {
      const cleanName = p.trim();
      if (cleanName) names.push(cleanName);
    });
  });

  return names;
};
