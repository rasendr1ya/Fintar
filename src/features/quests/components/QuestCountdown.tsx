"use client";

import { useState, useEffect } from "react";

export function QuestCountdown() {
  const [timeLeft, setTimeLeft] = useState<string>("");
  const [isUrgent, setIsUrgent] = useState(false);

  useEffect(() => {
    const calcTimeLeft = () => {
      const now = new Date();
      const reset = new Date();
      reset.setHours(24, 0, 0, 0);
      const ms = reset.getTime() - now.getTime();

      if (ms <= 0) {
        setTimeLeft("Sekarang");
        setIsUrgent(true);
        return;
      }

      const totalMinutes = Math.floor(ms / 60000);
      const hours = Math.floor(totalMinutes / 60);
      const minutes = totalMinutes % 60;

      setIsUrgent(hours < 1);

      if (hours < 1) {
        setTimeLeft(`${minutes}m`);
      } else {
        setTimeLeft(`${hours}j ${minutes}m`);
      }
    };

    calcTimeLeft();
    const interval = setInterval(calcTimeLeft, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <span className={isUrgent ? "text-red-500 font-medium" : "text-muted"}>
      {timeLeft}
    </span>
  );
}

export default QuestCountdown;
