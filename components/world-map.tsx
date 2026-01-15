"use client";

import { ComposableMap, Geographies, Geography } from "react-simple-maps";

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

interface WorldMapProps {
  highlightCountry: string;
  className?: string;
}

// Map common country name variations to their GeoJSON names
const normalizeCountryName = (name: string): string => {
  const mappings: Record<string, string> = {
    "usa": "United States of America",
    "united states": "United States of America",
    "us": "United States of America",
    "uk": "United Kingdom",
    "britain": "United Kingdom",
    "great britain": "United Kingdom",
    "russia": "Russia",
    "south korea": "South Korea",
    "north korea": "North Korea",
    "democratic republic of the congo": "Dem. Rep. Congo",
    "dr congo": "Dem. Rep. Congo",
    "drc": "Dem. Rep. Congo",
    "republic of the congo": "Congo",
    "czech republic": "Czechia",
    "myanmar": "Myanmar",
    "burma": "Myanmar",
    "ivory coast": "Côte d'Ivoire",
    "uae": "United Arab Emirates",
    "united arab emirates": "United Arab Emirates",
  };

  const normalized = name.toLowerCase().trim();
  return mappings[normalized] || name;
};

export function WorldMap({ highlightCountry, className = "" }: WorldMapProps) {
  const normalizedHighlight = normalizeCountryName(highlightCountry);

  return (
    <div className={`w-full ${className}`}>
      <ComposableMap
        projectionConfig={{
          scale: 147,
          center: [0, 20],
        }}
        className="w-full h-full"
      >
        <Geographies geography={geoUrl}>
          {({ geographies }) =>
            geographies.map((geo) => {
              const countryName = geo.properties.name;
              const isHighlighted =
                countryName.toLowerCase() === normalizedHighlight.toLowerCase() ||
                normalizeCountryName(countryName).toLowerCase() === normalizedHighlight.toLowerCase();

              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill={
                    isHighlighted
                      ? "url(#emerald-gradient)"
                      : "hsl(var(--muted) / 0.3)"
                  }
                  stroke={
                    isHighlighted
                      ? "hsl(142 76% 36%)"
                      : "hsl(var(--border))"
                  }
                  strokeWidth={isHighlighted ? 2 : 0.5}
                  className={`outline-none ${
                    isHighlighted
                      ? "fill-emerald-500 dark:fill-emerald-400"
                      : "fill-muted/30 dark:fill-muted/20"
                  }`}
                  style={{
                    default: { outline: "none" },
                    hover: { outline: "none", opacity: 0.8 },
                    pressed: { outline: "none" },
                  }}
                />
              );
            })
          }
        </Geographies>
        <defs>
          <linearGradient id="emerald-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgb(16 185 129)" />
            <stop offset="100%" stopColor="rgb(34 197 94)" />
          </linearGradient>
        </defs>
      </ComposableMap>
    </div>
  );
}
