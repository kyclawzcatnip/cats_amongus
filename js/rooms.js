// Spaceship & Room Layout Definitions for Cat Crew

export const MAP_BOUNDS = { width: 3600, height: 2600 };

export const ROOMS = [
    {
        id: 'bridge', name: '🚀 Bridge', color: '#48dbfb', bgColor: '#1b2a47',
        x: 1550, y: 150, width: 500, height: 320, icon: '🚀',
        tasks: [ { id: 'nav_ship', name: 'Navigate Ship Path', x: 1680, y: 250 }, { id: 'scan_asteroids', name: 'Scan Space Sector', x: 1920, y: 250 }, { id: 'upload_data', name: 'Upload Data to HQ', x: 1800, y: 200 } ],
        hasEmergencyButton: true, buttonX: 1800, buttonY: 310
    },
    {
        id: 'medical', name: '🏥 Medical', color: '#ff6b6b', bgColor: '#2d1b24',
        x: 850, y: 250, width: 450, height: 320, icon: '🏥',
        tasks: [ { id: 'med_scan', name: 'Submit Med Scan', x: 970, y: 380 }, { id: 'treat_scratches', name: 'Treat Paw Scratches', x: 1180, y: 380 } ]
    },
    {
        id: 'weapons', name: '⚔️ Weapons', color: '#ff793f', bgColor: '#331e1b',
        x: 2300, y: 250, width: 450, height: 320, icon: '⚔️',
        tasks: [ { id: 'clear_asteroids', name: 'Clear Asteroids', x: 2420, y: 380 }, { id: 'load_torpedoes', name: 'Load Catnip Torpedoes', x: 2620, y: 380 } ]
    },
    {
        id: 'security', name: '📹 Security', color: '#a29bfe', bgColor: '#201b3a',
        x: 250, y: 700, width: 400, height: 350, icon: '📹',
        tasks: [ { id: 'monitor_cams', name: 'Monitor Security Feeds', x: 380, y: 750 }, { id: 'rewind_tapes', name: 'Rewind Security Tapes', x: 520, y: 750 } ]
    },
    {
        id: 'fish_storage', name: '🐟 Fish Storage', color: '#00cec9', bgColor: '#1b2d33',
        x: 800, y: 700, width: 450, height: 350, icon: '🐟',
        tasks: [ { id: 'sort_fish', name: 'Sort Fish Bins', x: 920, y: 850 }, { id: 'check_freezer', name: 'Check Freezer Temp', x: 1120, y: 850 } ]
    },
    {
        id: 'ship_quarters', name: '🛏️ Ship Quarters', color: '#a29bfe', bgColor: '#27203d',
        x: 1550, y: 650, width: 500, height: 320, icon: '🛏️',
        tasks: [ { id: 'make_beds', name: 'Make Scratching Beds', x: 1680, y: 780 }, { id: 'clean_litter', name: 'Clean Space Litter', x: 1920, y: 780 } ]
    },
    {
        id: 'electrical', name: '⚡ Electrical', color: '#fbc531', bgColor: '#332e1b',
        x: 2350, y: 700, width: 450, height: 350, icon: '⚡',
        tasks: [ { id: 'calibrate_distributor', name: 'Calibrate Power', x: 2470, y: 850 }, { id: 'download_data', name: 'Download Power Logs', x: 2670, y: 850 } ],
        hasLightsFixPanel: true, lightsFixX: 2570, lightsFixY: 850
    },
    {
        id: 'shields', name: '🛡️ Shields', color: '#e84118', bgColor: '#331c1c',
        x: 2950, y: 700, width: 400, height: 350, icon: '🛡️',
        tasks: [ { id: 'prime_shields', name: 'Prime Deflector Shields', x: 3080, y: 850 }, { id: 'realign_panels', name: 'Realign Shield Panels', x: 3220, y: 850 } ]
    },
    {
        id: 'o2', name: '💨 Oxygen', color: '#2ed573', bgColor: '#1c3325',
        x: 250, y: 1150, width: 400, height: 350, icon: '💨',
        tasks: [ { id: 'clean_filters', name: 'Clean Oxygen Filter', x: 380, y: 1300 }, { id: 'refill_tanks', name: 'Refill O2 Storage Tanks', x: 520, y: 1300 } ]
    },
    {
        id: 'nap_quarters', name: '💤 Nap Quarters', color: '#9c88ff', bgColor: '#252136',
        x: 850, y: 1150, width: 450, height: 350, icon: '💤',
        tasks: [ { id: 'fluff_pillows', name: 'Fluff Nap Pillows', x: 970, y: 1300 }, { id: 'fix_clock', name: 'Set Alarm Clock', x: 1180, y: 1300 } ]
    },
    {
        id: 'cargo_bay', name: '📦 Cargo Bay', color: '#e84118', bgColor: '#301c22',
        x: 1550, y: 1150, width: 500, height: 350, icon: '📦',
        tasks: [ { id: 'sort_boxes', name: 'Sort Supply Crates', x: 1680, y: 1300 }, { id: 'check_manifest', name: 'Check Cargo Manifest', x: 1920, y: 1300 } ]
    },
    {
        id: 'kitchen', name: '🍽️ Kitchen', color: '#e1b12c', bgColor: '#332a1b',
        x: 2300, y: 1150, width: 450, height: 350, icon: '🍽️',
        tasks: [ { id: 'cook_fish', name: 'Prepare Fish Feast', x: 2420, y: 1300 }, { id: 'wash_bowls', name: 'Wash Food Bowls', x: 2620, y: 1300 } ]
    },
    {
        id: 'comms', name: '📡 Communications', color: '#0984e3', bgColor: '#1c2833',
        x: 2950, y: 1150, width: 400, height: 350, icon: '📡',
        tasks: [ { id: 'reboot_wifi', name: 'Reboot Space Comm Router', x: 3080, y: 1300 }, { id: 'download_comms', name: 'Download Signal Decryption', x: 3220, y: 1300 } ],
        hasCommsFixPanel: true, commsFixX: 3150, commsFixY: 1325
    },
    {
        id: 'records', name: '🗃️ Catnip Records', color: '#10ac84', bgColor: '#162b25',
        x: 250, y: 1600, width: 400, height: 350, icon: '🗃️',
        tasks: [ { id: 'file_records', name: 'File Catnip Inventory', x: 380, y: 1770 }, { id: 'scan_id', name: 'Scan Crewmate Paw ID', x: 520, y: 1770 } ]
    },
    {
        id: 'cat_garden', name: '🌿 Cat Garden', color: '#4cd137', bgColor: '#1b3320',
        x: 800, y: 1600, width: 450, height: 380, icon: '🌿',
        tasks: [ { id: 'water_plants', name: 'Water Catnip', x: 920, y: 1770 }, { id: 'trim_catnip', name: 'Trim Garden Hedges', x: 1120, y: 1770 } ]
    },
    {
        id: 'workshop', name: '🛠️ Workshop', color: '#487eb0', bgColor: '#1b2733',
        x: 2350, y: 1600, width: 450, height: 380, icon: '🛠️',
        tasks: [ { id: 'fix_wiring', name: 'Fix Electrical Wires', x: 2470, y: 1770 }, { id: 'tighten_bolts', name: 'Tighten Hull Bolts', x: 2670, y: 1770 } ]
    },
    {
        id: 'thruster_a', name: '🚀 Thruster A', color: '#e84118', bgColor: '#331b1b',
        x: 200, y: 2050, width: 450, height: 420, icon: '🚀',
        tasks: [ { id: 'prime_thruster_a', name: 'Prime Left Thruster', x: 320, y: 2240 }, { id: 'flush_fuel_a', name: 'Flush Engine Fuel A', x: 520, y: 2240 } ]
    },
    {
        id: 'yarn_engine', name: '🧶 Yarn Engine', color: '#ff5252', bgColor: '#331b23',
        x: 1550, y: 2050, width: 500, height: 420, icon: '🧶',
        tasks: [ { id: 'untangle_yarn', name: 'Untangle Yarn Spool', x: 1680, y: 2240 }, { id: 'calibrate_engine', name: 'Calibrate Engine Dials', x: 1920, y: 2240 } ],
        hasEngineFixPanel: true, engineFixX: 1800, engineFixY: 2350
    },
    {
        id: 'thruster_b', name: '🚀 Thruster B', color: '#e84118', bgColor: '#331b1b',
        x: 2950, y: 2050, width: 450, height: 420, icon: '🚀',
        tasks: [ { id: 'prime_thruster_b', name: 'Prime Right Thruster', x: 3070, y: 2240 }, { id: 'flush_fuel_b', name: 'Flush Engine Fuel B', x: 3270, y: 2240 } ]
    }
];

export const CORRIDORS = [
    { x1: 1800, y1: 300, x2: 1800, y2: 2260, width: 120 }, // Central vertical spine hallway
    { x1: 1300, y1: 410, x2: 2300, y2: 410, width: 100 },  // Medical to Weapons
    { x1: 1250, y1: 875, x2: 2350, y2: 875, width: 100 },  // Fish Storage / Quarters / Electrical
    { x1: 1300, y1: 1325, x2: 2300, y2: 1325, width: 100 },// Nap Quarters / Cargo / Kitchen
    { x1: 1250, y1: 1790, x2: 2350, y2: 1790, width: 100 },// Cat Garden / Workshop
    { x1: 650, y1: 2260, x2: 2950, y2: 2260, width: 100 }, // Thruster A to Yarn Engine to Thruster B

    // Corridors connecting new outer rooms
    { x1: 650, y1: 875, x2: 800, y2: 875, width: 100 },    // Security to Fish Storage
    { x1: 2800, y1: 875, x2: 2950, y2: 875, width: 100 },   // Electrical to Shields
    { x1: 650, y1: 1325, x2: 850, y2: 1325, width: 100 },   // O2 to Nap Quarters
    { x1: 2750, y1: 1325, x2: 2950, y2: 1325, width: 100 }, // Kitchen to Communications
    { x1: 650, y1: 1790, x2: 800, y2: 1790, width: 100 },   // Records to Cat Garden
    { x1: 1025, y1: 570, x2: 1025, y2: 700, width: 100 },   // Medical to Fish Storage
    { x1: 1025, y1: 1050, x2: 1025, y2: 1150, width: 100 }, // Fish Storage to Nap Quarters
    { x1: 1025, y1: 1500, x2: 1025, y2: 1600, width: 100 }, // Nap Quarters to Cat Garden
    { x1: 2575, y1: 570, x2: 2575, y2: 700, width: 100 },   // Weapons to Electrical
    { x1: 2575, y1: 1050, x2: 2575, y2: 1150, width: 100 }, // Electrical to Kitchen
    { x1: 2575, y1: 1500, x2: 2575, y2: 1600, width: 100 }  // Kitchen to Workshop
];
