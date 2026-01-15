interface AnalogClockProps {
  hour: number;
  minute: number;
  period: string;
}

export function AnalogClock({ hour, minute, period }: AnalogClockProps) {
  // Convert 24-hour to 12-hour format for display
  const hour12 = hour % 12 || 12;
  
  // Calculate rotation angles
  // Hour hand: 30 degrees per hour + 0.5 degrees per minute
  const hourAngle = (hour % 12) * 30 + minute * 0.5;
  
  // Minute hand: 6 degrees per minute
  const minuteAngle = minute * 6;

  // Generate hour numbers (1-12)
  const hourNumbers = Array.from({ length: 12 }, (_, i) => {
    const num = i === 0 ? 12 : i;
    const angle = (i * 30 - 90) * (Math.PI / 180); // -90 to start at 12
    const radius = 85;
    const x = 100 + radius * Math.cos(angle);
    const y = 100 + radius * Math.sin(angle);
    return { num, x, y };
  });

  // Generate minute markers (0, 5, 10, ..., 55)
  const minuteMarkers = Array.from({ length: 12 }, (_, i) => {
    const minutes = i * 5;
    const angle = (i * 30 - 90) * (Math.PI / 180);
    const radius = 70;
    const x = 100 + radius * Math.cos(angle);
    const y = 100 + radius * Math.sin(angle);
    return { minutes, x, y };
  });

  // Generate tick marks
  const ticks = Array.from({ length: 60 }, (_, i) => {
    const angle = i * 6 - 90;
    const isHour = i % 5 === 0;
    const innerRadius = isHour ? 92 : 95;
    const outerRadius = 98;
    
    const x1 = 100 + innerRadius * Math.cos(angle * (Math.PI / 180));
    const y1 = 100 + innerRadius * Math.sin(angle * (Math.PI / 180));
    const x2 = 100 + outerRadius * Math.cos(angle * (Math.PI / 180));
    const y2 = 100 + outerRadius * Math.sin(angle * (Math.PI / 180));
    
    return { x1, y1, x2, y2, isHour };
  });

  return (
    <div className="flex justify-center items-center py-6">
      <svg
        viewBox="0 0 200 200"
        className="w-full max-w-[400px] h-auto"
        role="img"
        aria-label={`Clock showing ${hour12}:${minute.toString().padStart(2, '0')} ${period}`}
      >
        <title>Analog Clock</title>
        <desc>A clock face showing the current time with hour and minute hands</desc>
        
        {/* Define gradients */}
        <defs>
          <linearGradient id="hourHandGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#6366f1" />
          </linearGradient>
          <linearGradient id="minuteHandGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#8b5cf6" />
            <stop offset="100%" stopColor="#6366f1" />
          </linearGradient>
          <linearGradient id="clockBorderGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset="50%" stopColor="#8b5cf6" />
            <stop offset="100%" stopColor="#3b82f6" />
          </linearGradient>
        </defs>
        
        {/* Clock face outer border with gradient */}
        <circle
          cx="100"
          cy="100"
          r="99"
          fill="none"
          stroke="url(#clockBorderGradient)"
          strokeWidth="2"
          className="opacity-60"
        />
        
        {/* Clock face background */}
        <circle
          cx="100"
          cy="100"
          r="97"
          className="fill-white dark:fill-slate-900"
        />
        
        {/* Inner circle */}
        <circle
          cx="100"
          cy="100"
          r="65"
          fill="none"
          className="stroke-blue-100 dark:stroke-blue-900/30"
          strokeWidth="0.5"
        />
        
        {/* Tick marks */}
        {ticks.map((tick, i) => (
          <line
            key={i}
            x1={tick.x1}
            y1={tick.y1}
            x2={tick.x2}
            y2={tick.y2}
            className={tick.isHour ? "stroke-blue-400 dark:stroke-blue-600" : "stroke-gray-300 dark:stroke-gray-700"}
            strokeWidth={tick.isHour ? "1.5" : "0.5"}
            strokeLinecap="round"
          />
        ))}
        
        {/* Hour numbers */}
        {hourNumbers.map(({ num, x, y }) => (
          <text
            key={`hour-${num}`}
            x={x}
            y={y}
            textAnchor="middle"
            dominantBaseline="middle"
            className="fill-foreground font-bold text-[14px]"
          >
            {num}
          </text>
        ))}
        
        {/* Minute markers */}
        {minuteMarkers.map(({ minutes, x, y }) => (
          <text
            key={`minute-${minutes}`}
            x={x}
            y={y}
            textAnchor="middle"
            dominantBaseline="middle"
            className="fill-muted-foreground text-[8px] font-medium"
          >
            {minutes}
          </text>
        ))}
        
        {/* Hour hand */}
        <line
          x1="100"
          y1="100"
          x2="100"
          y2="45"
          stroke="#3b82f6"
          strokeWidth="6"
          strokeLinecap="round"
          transform={`rotate(${hourAngle} 100 100)`}
        />
        
        {/* Minute hand */}
        <line
          x1="100"
          y1="100"
          x2="100"
          y2="25"
          stroke="#8b5cf6"
          strokeWidth="4"
          strokeLinecap="round"
          transform={`rotate(${minuteAngle} 100 100)`}
        />
        
        {/* Center dot */}
        <circle
          cx="100"
          cy="100"
          r="5"
          className="fill-blue-600 dark:fill-blue-400"
        />
        <circle
          cx="100"
          cy="100"
          r="3"
          className="fill-white dark:fill-slate-900"
        />
      </svg>
    </div>
  );
}
