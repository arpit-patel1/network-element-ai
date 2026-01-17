interface SquarePosition {
  x: number;
  y: number;
  size: number;
}

interface AreaSquaresProps {
  arrangement: "single" | "grid" | "custom";
  // For single square
  singleSize?: number;
  // For grid
  gridRows?: number;
  gridCols?: number;
  gridSquareSize?: number;
  // For custom
  customSquares?: SquarePosition[];
  // Visual settings
  squareSize?: number; // Size of each unit square in pixels
  spacing?: number; // Spacing between squares
}

export function AreaSquares({
  arrangement,
  singleSize,
  gridRows,
  gridCols,
  gridSquareSize,
  customSquares,
  squareSize = 30,
  spacing = 2,
}: AreaSquaresProps) {
  const unitSize = squareSize;
  const gap = spacing;

  const renderSingleSquare = () => {
    if (!singleSize) return null;
    const totalSize = singleSize * unitSize + (singleSize - 1) * gap;
    
    return (
      <svg
        width={totalSize}
        height={totalSize}
        viewBox={`0 0 ${totalSize} ${totalSize}`}
        className="mx-auto"
      >
        <rect
          x={0}
          y={0}
          width={totalSize}
          height={totalSize}
          className="fill-purple-200 dark:fill-purple-800 stroke-purple-600 dark:stroke-purple-400"
          strokeWidth={2}
        />
        {/* Grid lines inside */}
        {Array.from({ length: singleSize - 1 }).map((_, i) => {
          const pos = (i + 1) * unitSize + i * gap;
          return (
            <g key={`grid-${i}`}>
            <line
              x1={pos}
              y1={0}
              x2={pos}
              y2={totalSize}
              className="stroke-purple-400 dark:stroke-purple-600"
              strokeWidth={1}
            />
            <line
              x1={0}
              y1={pos}
              x2={totalSize}
              y2={pos}
              className="stroke-purple-400 dark:stroke-purple-600"
              strokeWidth={1}
            />
          </g>
        );
        })}
      </svg>
    );
  };

  const renderGrid = () => {
    if (!gridRows || !gridCols || !gridSquareSize) return null;
    
    const squaresPerRow = gridCols;
    const squaresPerCol = gridRows;
    const unitSquareSize = gridSquareSize;
    
    const totalWidth = squaresPerRow * (unitSquareSize * unitSize + gap) - gap;
    const totalHeight = squaresPerCol * (unitSquareSize * unitSize + gap) - gap;
    
    return (
      <svg
        width={totalWidth}
        height={totalHeight}
        viewBox={`0 0 ${totalWidth} ${totalHeight}`}
        className="mx-auto"
      >
        {Array.from({ length: squaresPerRow * squaresPerCol }).map((_, idx) => {
          const row = Math.floor(idx / squaresPerRow);
          const col = idx % squaresPerRow;
          const x = col * (unitSquareSize * unitSize + gap);
          const y = row * (unitSquareSize * unitSize + gap);
          const size = unitSquareSize * unitSize;
          
          return (
            <g key={`square-${idx}`}>
              <rect
                x={x}
                y={y}
                width={size}
                height={size}
                className="fill-purple-200 dark:fill-purple-800 stroke-purple-600 dark:stroke-purple-400"
                strokeWidth={2}
              />
              {/* Grid lines inside each square */}
              {Array.from({ length: unitSquareSize - 1 }).map((_, i) => {
                const pos = (i + 1) * unitSize;
                return (
                  <g key={`grid-${idx}-${i}`}>
                    <line
                      x1={x + pos}
                      y1={y}
                      x2={x + pos}
                      y2={y + size}
                      className="stroke-purple-400 dark:stroke-purple-600"
                      strokeWidth={1}
                    />
                    <line
                      x1={x}
                      y1={y + pos}
                      x2={x + size}
                      y2={y + pos}
                      className="stroke-purple-400 dark:stroke-purple-600"
                      strokeWidth={1}
                    />
                  </g>
                );
              })}
            </g>
          );
        })}
      </svg>
    );
  };

  const renderCustom = () => {
    if (!customSquares || customSquares.length === 0) return null;
    
    // Calculate bounds
    let maxX = 0;
    let maxY = 0;
    customSquares.forEach((sq) => {
      maxX = Math.max(maxX, sq.x + sq.size);
      maxY = Math.max(maxY, sq.y + sq.size);
    });
    
    const totalWidth = maxX * unitSize + (maxX - 1) * gap;
    const totalHeight = maxY * unitSize + (maxY - 1) * gap;
    
    return (
      <svg
        width={totalWidth}
        height={totalHeight}
        viewBox={`0 0 ${totalWidth} ${totalHeight}`}
        className="mx-auto"
      >
        {customSquares.map((square, idx) => {
          const x = square.x * (unitSize + gap);
          const y = square.y * (unitSize + gap);
          const size = square.size * unitSize + (square.size - 1) * gap;
          
          return (
            <g key={`custom-square-${idx}`}>
              <rect
                x={x}
                y={y}
                width={size}
                height={size}
                className="fill-purple-200 dark:fill-purple-800 stroke-purple-600 dark:stroke-purple-400"
                strokeWidth={2}
              />
              {/* Grid lines inside */}
              {Array.from({ length: square.size - 1 }).map((_, i) => {
                const pos = (i + 1) * unitSize + i * gap;
                return (
                  <g key={`grid-${idx}-${i}`}>
                    <line
                      x1={x + pos}
                      y1={y}
                      x2={x + pos}
                      y2={y + size}
                      className="stroke-purple-400 dark:stroke-purple-600"
                      strokeWidth={1}
                    />
                    <line
                      x1={x}
                      y1={y + pos}
                      x2={x + size}
                      y2={y + pos}
                      className="stroke-purple-400 dark:stroke-purple-600"
                      strokeWidth={1}
                    />
                  </g>
                );
              })}
            </g>
          );
        })}
      </svg>
    );
  };

  switch (arrangement) {
    case "single":
      return renderSingleSquare();
    case "grid":
      return renderGrid();
    case "custom":
      return renderCustom();
    default:
      return null;
  }
}
