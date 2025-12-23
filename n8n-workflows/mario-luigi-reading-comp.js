const marioWorlds = [
    // Mushroom Kingdom locations
    { world: "Mushroom Kingdom", location: "Peach's Castle" },
    { world: "Mushroom Kingdom", location: "Toad Town" },
    { world: "Mushroom Kingdom", location: "Yoshi's Island" },
    { world: "Mushroom Kingdom", location: "Mushroom City" },
    { world: "Mushroom Kingdom", location: "Goomba Village" },
    { world: "Mushroom Kingdom", location: "Koopa Troopa Beach" },
    { world: "Mushroom Kingdom", location: "Shy Guy's Toy Box" },
    { world: "Mushroom Kingdom", location: "Koopa Bros Fortress" },
    
    // Bowser's Domain locations
    { world: "Bowser's Domain", location: "Bowser's Castle" },
    { world: "Bowser's Domain", location: "Bowser's Airship" },
    { world: "Bowser's Domain", location: "Dark Land" },
    { world: "Bowser's Domain", location: "Koopa Kingdom" },
    
    // Desert locations
    { world: "Desert Land", location: "Dry Dry Desert" },
    { world: "Desert Land", location: "Dry Dry Outpost" },
    { world: "Desert Land", location: "Shifting Sand Land" },
    { world: "Desert Land", location: "Sand Kingdom" },
    
    // Water locations
    { world: "Water World", location: "Cheep Cheep Lagoon" },
    { world: "Water World", location: "Aqua Kingdom" },
    { world: "Water World", location: "Dire, Dire Docks" },
    { world: "Water World", location: "Jolly Roger Bay" },
    { world: "Water World", location: "Wet-Dry World" },
    { world: "Water World", location: "Cascade Kingdom" },
    
    // Haunted locations
    { world: "Haunted World", location: "Boo's Mansion" },
    { world: "Haunted World", location: "Big Boo's Haunt" },
    { world: "Haunted World", location: "Gusty Gulch" },
    { world: "Haunted World", location: "Tubba Blubba's Castle" },
    { world: "Haunted World", location: "Forever Forest" },
    { world: "Haunted World", location: "Gloom Valley" },
    
    // Sky locations
    { world: "Sky World", location: "Cloud Kingdom" },
    { world: "Sky World", location: "Rainbow Road" },
    { world: "Sky World", location: "Cloudy Court" },
    { world: "Sky World", location: "Cloudtop Cruise" },
    { world: "Sky World", location: "Cloud Ruins" },
    
    // Space locations
    { world: "Space World", location: "Galaxy Observatory" },
    { world: "Space World", location: "Comet Observatory" },
    { world: "Space World", location: "Gateway Galaxy" },
    { world: "Space World", location: "Good Egg Galaxy" },
    { world: "Space World", location: "Honeyhive Galaxy" },
    { world: "Space World", location: "Space Junk Galaxy" },
    
    // Volcanic locations
    { world: "Volcanic World", location: "Lava Land" },
    { world: "Volcanic World", location: "Lethal Lava Land" },
    { world: "Volcanic World", location: "Lavender Town" },
    { world: "Volcanic World", location: "Mount Volbono" },
    { world: "Volcanic World", location: "Luncheon Kingdom" },
    { world: "Volcanic World", location: "Fire Sea" },
    
    // Ice locations
    { world: "Ice World", location: "Cool, Cool Mountain" },
    { world: "Ice World", location: "Snowman's Land" },
    { world: "Ice World", location: "Shiver City" },
    { world: "Ice World", location: "Freezeflame Galaxy" },
    { world: "Ice World", location: "Snow Kingdom" },
    { world: "Ice World", location: "Frosted Glacier" },
    
    // Forest locations
    { world: "Forest World", location: "Whomp's Fortress" },
    { world: "Forest World", location: "Tiny-Huge Island" },
    { world: "Forest World", location: "Wooded Kingdom" },
    { world: "Forest World", location: "Mushroom Gorge" },
    { world: "Forest World", location: "Mushroom Valley" },
    { world: "Forest World", location: "Mushroom Heights" },
    
    // Underground locations
    { world: "Underground World", location: "Underground Caverns" },
    { world: "Underground World", location: "Hazy Maze Cave" },
    { world: "Underground World", location: "Deep Dark Galaxy" },
    { world: "Underground World", location: "Underground Pipe Maze" },
    { world: "Underground World", location: "Subterranean Complex" },
    
    // Beach locations
    { world: "Beach World", location: "Delfino Plaza" },
    { world: "Beach World", location: "Bianco Hills" },
    { world: "Beach World", location: "Ricco Harbor" },
    { world: "Beach World", location: "Gelato Beach" },
    { world: "Beach World", location: "Seaside Kingdom" },
    
    // Metro locations
    { world: "Metro Kingdom", location: "New Donk City" },
    { world: "Metro Kingdom", location: "Metro City" },
    { world: "Metro Kingdom", location: "Urban Kingdom" },
    
    // Ruins locations
    { world: "Ruins World", location: "Ancient Ruins" },
    { world: "Ruins World", location: "Ruined Kingdom" },
    { world: "Ruins World", location: "Lost Kingdom" },
    { world: "Ruins World", location: "Forgotten Isle" },
    
    // Special locations
    { world: "Special World", location: "Rainbow Castle" },
    { world: "Special World", location: "Star Road" },
    { world: "Special World", location: "Special Zone" },
    { world: "Special World", location: "Champion's Road" }
  ];
  
  // Pick random item
  const randomIndex = Math.floor(Math.random() * marioWorlds.length);
  const selection = marioWorlds[randomIndex];
  
  const world = selection.world;
  const location = selection.location;
  
  // Return format for n8n agent
  return `world: ${world} location: ${location}`;