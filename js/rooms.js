// Spaceship & Room Layout Definitions for Cat Crew
import { VENTS } from './vents.js';

export const MAP_BOUNDS = { width: 3600, height: 2600 };

export const WHISKER_STATION_ROOMS = [
    {
        id: 'bridge', name: '🚀 Bridge', color: '#48dbfb', bgColor: '#1b2a47',
        x: 1550, y: 150, width: 500, height: 320, icon: '🚀',
        tasks: [ { id: 'nav_ship', name: 'Navigate Ship Path', x: 1680, y: 250 }, { id: 'scan_asteroids', name: 'Scan Space Sector', x: 1920, y: 250 }, { id: 'upload_data', name: 'Upload Data to HQ', x: 1800, y: 200 } ]
    },
    {
        id: 'cafeteria', name: '🍕 Cafeteria', color: '#ff7675', bgColor: '#2c1e21',
        x: 1500, y: 650, width: 600, height: 600, icon: '🍕', isRound: true,
        tasks: [ { id: 'swipe_card', name: 'Swipe Cafeteria ID', x: 1700, y: 850 }, { id: 'upload_admin', name: 'Upload Cafeteria Logs', x: 1900, y: 850 } ],
        hasEmergencyButton: true, buttonX: 1800, buttonY: 950
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
        x: 1550, y: 1350, width: 500, height: 320, icon: '🛏️',
        tasks: [ { id: 'make_beds', name: 'Make Scratching Beds', x: 1680, y: 1480 }, { id: 'clean_litter', name: 'Clean Space Litter', x: 1920, y: 1480 } ]
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
        x: 2300, y: 1150, width: 500, height: 350, icon: '📦',
        tasks: [ { id: 'sort_boxes', name: 'Sort Supply Crates', x: 2420, y: 1300 }, { id: 'check_manifest', name: 'Check Cargo Manifest', x: 2620, y: 1300 } ]
    },
    {
        id: 'kitchen', name: '🍽️ Kitchen', color: '#e1b12c', bgColor: '#332a1b',
        x: 2950, y: 1150, width: 450, height: 350, icon: '🍽️',
        tasks: [ { id: 'cook_fish', name: 'Prepare Fish Feast', x: 3070, y: 1300 }, { id: 'wash_bowls', name: 'Wash Food Bowls', x: 3270, y: 1300 } ]
    },
    {
        id: 'comms', name: '📡 Communications', color: '#0984e3', bgColor: '#1c2833',
        x: 2950, y: 1600, width: 400, height: 350, icon: '📡',
        tasks: [ { id: 'reboot_wifi', name: 'Reboot Space Comm Router', x: 3080, y: 1750 }, { id: 'download_comms', name: 'Download Signal Decryption', x: 3220, y: 1750 } ],
        hasCommsFixPanel: true, commsFixX: 3150, commsFixY: 1775
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
        tasks: [ { id: 'fix_wiring', name: 'Fix Electrical Wires', x: 2470, y: 1770 }, { id: 'tighten_bolts', name: 'Tighten Hull Bolts', x: 2670, y: 1770 }, { id: 'pickup_torpedo', name: 'Retrieve Catnip Torpedo', x: 2570, y: 1840 } ]
    },
    {
        id: 'yarn_engine', name: '🧶 Yarn Engine', color: '#fd79a8', bgColor: '#2d1b2b',
        x: 1550, y: 1800, width: 500, height: 380, icon: '🧶',
        tasks: [ { id: 'untangle_yarn', name: 'Untangle Yarn Spool', x: 1680, y: 1950 }, { id: 'calibrate_engine', name: 'Calibrate Engine Dials', x: 1880, y: 1950 } ],
        hasEngineFixPanel: true, engineFixX: 1780, engineFixY: 1950
    },
    {
        id: 'thruster_a', name: '🚀 Thruster A', color: '#e84118', bgColor: '#331b1b',
        x: 200, y: 2050, width: 450, height: 420, icon: '🚀',
        tasks: [ { id: 'prime_thruster_a', name: 'Prime Left Thruster', x: 320, y: 2240 }, { id: 'flush_fuel_a', name: 'Flush Engine Fuel A', x: 520, y: 2240 } ]
    },
    {
        id: 'thruster_b', name: '🚀 Thruster B', color: '#e84118', bgColor: '#331b1b',
        x: 2950, y: 2050, width: 450, height: 420, icon: '🚀',
        tasks: [ { id: 'prime_thruster_b', name: 'Prime Right Thruster', x: 3070, y: 2240 }, { id: 'flush_fuel_b', name: 'Flush Engine Fuel B', x: 3270, y: 2240 } ]
    }
];

export const WHISKER_STATION_CORRIDORS = [
    { x1: 1800, y1: 300, x2: 1800, y2: 2260, width: 120 },
    { x1: 1300, y1: 410, x2: 2300, y2: 410, width: 100 },
    { x1: 1250, y1: 875, x2: 2350, y2: 875, width: 100 },
    { x1: 1300, y1: 1325, x2: 2300, y2: 1325, width: 100 },
    { x1: 1250, y1: 1790, x2: 2350, y2: 1790, width: 100 },
    { x1: 650, y1: 2260, x2: 2950, y2: 2260, width: 100 },
    { x1: 650, y1: 875, x2: 800, y2: 875, width: 100 },
    { x1: 2800, y1: 875, x2: 2950, y2: 875, width: 100 },
    { x1: 650, y1: 1325, x2: 850, y2: 1325, width: 100 },
    { x1: 2750, y1: 1325, x2: 2950, y2: 1325, width: 100 },
    { x1: 650, y1: 1790, x2: 800, y2: 1790, width: 100 },
    { x1: 1025, y1: 570, x2: 1025, y2: 700, width: 100 },
    { x1: 1025, y1: 1050, x2: 1025, y2: 1150, width: 100 },
    { x1: 1025, y1: 1500, x2: 1025, y2: 1600, width: 100 },
    { x1: 2575, y1: 570, x2: 2575, y2: 700, width: 100 },
    { x1: 2575, y1: 1050, x2: 2575, y2: 1150, width: 100 },
    { x1: 2575, y1: 1500, x2: 2575, y2: 1600, width: 100 },
    { x1: 2950, y1: 1325, x2: 2950, y2: 2260, width: 100 }
];

export const CATNIP_OBSERVATORY_ROOMS = [
    // FLOOR 1
    {
        id: 'bridge', name: '🚀 Bridge', color: '#48dbfb', bgColor: '#1b2a47',
        x: 1150, y: 150, width: 500, height: 350, icon: '🚀',
        tasks: [ { id: 'nav_ship', name: 'Navigate Ship Path', x: 1300, y: 300 }, { id: 'upload_data', name: 'Upload Data to HQ', x: 1500, y: 300 } ]
    },
    {
        id: 'cafeteria', name: '🍕 Cafeteria', color: '#ff7675', bgColor: '#2c1e21',
        x: 1100, y: 650, width: 600, height: 600, icon: '🍕', isRound: true,
        tasks: [ { id: 'swipe_card', name: 'Swipe Cafeteria ID', x: 1300, y: 850 }, { id: 'upload_admin', name: 'Upload Cafeteria Logs', x: 1500, y: 850 }, { id: 'monitor_cams', name: 'Monitor Security Feeds', x: 1380, y: 950 } ],
        hasEmergencyButton: true, buttonX: 1400, buttonY: 950
    },
    {
        id: 'greenhouse', name: '🌿 Catnip Greenhouse', color: '#4cd137', bgColor: '#1b3320',
        x: 200, y: 150, width: 450, height: 350, icon: '🌿',
        tasks: [ { id: 'trim_catnip', name: 'Trim Catnip Hedges', x: 320, y: 320 }, { id: 'water_plants', name: 'Water Catnip Plants', x: 520, y: 320 } ]
    },
    {
        id: 'laser_weapons', name: '⚔️ Laser Weapons', color: '#ff793f', bgColor: '#331e1b',
        x: 2150, y: 150, width: 450, height: 350, icon: '⚔️',
        tasks: [ { id: 'clear_asteroids', name: 'Clear Asteroids', x: 2250, y: 300 }, { id: 'load_torpedoes', name: 'Load Catnip Torpedoes', x: 2450, y: 300 } ]
    },
    {
        id: 'medical', name: '🏥 Medical Bay', color: '#ff6b6b', bgColor: '#2d1b24',
        x: 200, y: 800, width: 450, height: 350, icon: '🏥',
        tasks: [ { id: 'med_scan', name: 'Submit Med Scan', x: 320, y: 970 }, { id: 'treat_scratches', name: 'Treat Paw Scratches', x: 520, y: 970 } ]
    },
    {
        id: 'electrical', name: '⚡ Electrical Room', color: '#fbc531', bgColor: '#332e1b',
        x: 2150, y: 800, width: 450, height: 350, icon: '⚡',
        tasks: [ { id: 'calibrate_distributor', name: 'Calibrate Power', x: 2270, y: 975 }, { id: 'download_data', name: 'Download Power Logs', x: 2470, y: 975 } ],
        hasLightsFixPanel: true, lightsFixX: 2375, lightsFixY: 975
    },
    {
        id: 'reactor', name: '🌀 Reactor Core', color: '#74b9ff', bgColor: '#1e3799',
        x: 200, y: 1450, width: 450, height: 400, icon: '🌀',
        tasks: [ { id: 'untangle_yarn', name: 'Untangle Yarn Spool', x: 320, y: 1650 }, { id: 'calibrate_engine', name: 'Calibrate Engine Dials', x: 520, y: 1650 } ]
    },
    {
        id: 'comms', name: '📡 Communications', color: '#0984e3', bgColor: '#1c2833',
        x: 1150, y: 1450, width: 500, height: 400, icon: '📡',
        tasks: [ { id: 'reboot_wifi', name: 'Reboot Space Comm Router', x: 1300, y: 1650 }, { id: 'download_comms', name: 'Download Signal Decryption', x: 1500, y: 1650 } ],
        hasCommsFixPanel: true, commsFixX: 1400, commsFixY: 1650
    },
    {
        id: 'thrusters', name: '🚀 Thruster Engines', color: '#e84118', bgColor: '#331b1b',
        x: 2150, y: 1450, width: 450, height: 400, icon: '🚀',
        tasks: [ { id: 'prime_thruster_b', name: 'Prime Right Thruster', x: 2270, y: 1650 }, { id: 'flush_fuel_b', name: 'Flush Engine Fuel B', x: 2470, y: 1650 } ],
        hasEngineFixPanel: true, engineFixX: 2375, engineFixY: 1650
    },

    // FLOOR 2
    {
        id: 'fish_storage', name: '🐟 Fish Storage', color: '#00cec9', bgColor: '#1b2d33',
        x: 200, y: 3150, width: 450, height: 350, icon: '🐟',
        tasks: [ { id: 'sort_fish', name: 'Sort Fish Bins', x: 320, y: 3320 }, { id: 'check_freezer', name: 'Check Freezer Temp', x: 520, y: 3320 } ]
    },
    {
        id: 'ship_quarters', name: '🛏️ Ship Quarters', color: '#a29bfe', bgColor: '#27203d',
        x: 1150, y: 3150, width: 500, height: 350, icon: '🛏️',
        tasks: [ { id: 'make_beds', name: 'Make Scratching Beds', x: 1300, y: 3320 }, { id: 'clean_litter', name: 'Clean Space Litter', x: 1500, y: 3320 } ]
    },
    {
        id: 'shields', name: '🛡️ Shields', color: '#e84118', bgColor: '#331c1c',
        x: 2150, y: 3150, width: 450, height: 350, icon: '🛡️',
        tasks: [ { id: 'prime_shields', name: 'Prime Deflector Shields', x: 2270, y: 3320 }, { id: 'realign_panels', name: 'Realign Shield Panels', x: 2470, y: 3320 } ]
    },
    {
        id: 'o2', name: '💨 Oxygen', color: '#2ed573', bgColor: '#1c3325',
        x: 200, y: 3800, width: 450, height: 350, icon: '💨',
        tasks: [ { id: 'clean_filters', name: 'Clean Oxygen Filter', x: 320, y: 3970 }, { id: 'refill_tanks', name: 'Refill O2 Storage Tanks', x: 520, y: 3970 } ]
    },
    {
        id: 'nap_quarters', name: '💤 Nap Quarters', color: '#9c88ff', bgColor: '#252136',
        x: 1150, y: 3800, width: 500, height: 350, icon: '💤',
        tasks: [ { id: 'fluff_pillows', name: 'Fluff Nap Pillows', x: 1300, y: 3970 }, { id: 'fix_clock', name: 'Set Alarm Clock', x: 1500, y: 3970 } ]
    },
    {
        id: 'cargo_bay', name: '📦 Cargo Bay', color: '#e84118', bgColor: '#301c22',
        x: 2150, y: 3800, width: 450, height: 350, icon: '📦',
        tasks: [ { id: 'sort_boxes', name: 'Sort Supply Crates', x: 2270, y: 3970 }, { id: 'check_manifest', name: 'Check Cargo Manifest', x: 2470, y: 3970 } ]
    },
    {
        id: 'kitchen', name: '🍽️ Kitchen', color: '#e1b12c', bgColor: '#332a1b',
        x: 200, y: 4450, width: 450, height: 400, icon: '🍽️',
        tasks: [ { id: 'cook_fish', name: 'Prepare Fish Feast', x: 320, y: 4620 }, { id: 'wash_bowls', name: 'Wash Food Bowls', x: 520, y: 4620 } ]
    },
    {
        id: 'records', name: '🗃️ Catnip Records', color: '#10ac84', bgColor: '#162b25',
        x: 1150, y: 4450, width: 500, height: 400, icon: '🗃️',
        tasks: [ { id: 'file_records', name: 'File Catnip Inventory', x: 1300, y: 4620 }, { id: 'scan_id', name: 'Scan Crewmate Paw ID', x: 1500, y: 4620 } ]
    },
    {
        id: 'workshop', name: '🛠️ Workshop', color: '#487eb0', bgColor: '#1b2733',
        x: 2150, y: 4450, width: 450, height: 400, icon: '🛠️',
        tasks: [ { id: 'fix_wiring', name: 'Fix Electrical Wires', x: 2270, y: 4620 }, { id: 'tighten_bolts', name: 'Tighten Hull Bolts', x: 2470, y: 4620 }, { id: 'pickup_torpedo', name: 'Retrieve Catnip Torpedo', x: 2370, y: 4720 } ]
    },
    {
        id: 'cat_garden', name: '🌿 Cat Garden', color: '#4cd137', bgColor: '#1b3320',
        x: 1150, y: 5100, width: 500, height: 400, icon: '🌿',
        tasks: [ { id: 'water_plants', name: 'Water Catnip', x: 1300, y: 5270 }, { id: 'trim_catnip', name: 'Trim Garden Hedges', x: 1500, y: 5270 } ]
    }
];

export const CATNIP_OBSERVATORY_CORRIDORS = [
    // FLOOR 1
    { x1: 1400, y1: 300, x2: 1400, y2: 1800, width: 120 },
    { x1: 650, y1: 975, x2: 2150, y2: 975, width: 100 },
    { x1: 650, y1: 325, x2: 650, y2: 1650, width: 100 },
    { x1: 2150, y1: 325, x2: 2150, y2: 1650, width: 100 },
    { x1: 650, y1: 325, x2: 1150, y2: 325, width: 100 },
    { x1: 1650, y1: 325, x2: 2150, y2: 325, width: 100 },
    { x1: 650, y1: 1650, x2: 1150, y2: 1650, width: 100 },
    { x1: 1650, y1: 1650, x2: 2150, y2: 1650, width: 100 },
    // FLOOR 2
    { x1: 1400, y1: 3300, x2: 1400, y2: 5300, width: 120 },
    { x1: 650, y1: 3325, x2: 2150, y2: 3325, width: 100 },
    { x1: 650, y1: 3975, x2: 2150, y2: 3975, width: 100 },
    { x1: 650, y1: 4650, x2: 2150, y2: 4650, width: 100 },
    { x1: 650, y1: 5300, x2: 1150, y2: 5300, width: 100 },
    { x1: 650, y1: 3325, x2: 650, y2: 4650, width: 100 },
    { x1: 2150, y1: 3325, x2: 2150, y2: 4650, width: 100 }
];

export const CATHQ_ROOMS = [
    {
        id: 'bridge', name: '🚀 Bridge', color: '#48dbfb', bgColor: '#1b2a47',
        x: 1750, y: 150, width: 500, height: 350, icon: '🚀',
        tasks: [ { id: 'nav_ship', name: 'Navigate Ship Path', x: 1850, y: 250 }, { id: 'upload_data', name: 'Upload Data to HQ', x: 2000, y: 250 }, { id: 'scan_asteroids', name: 'Scan Space Sector', x: 2150, y: 250 } ]
    },
    {
        id: 'cafeteria', name: '🍕 Cafeteria', color: '#ff7675', bgColor: '#2c1e21',
        x: 1700, y: 750, width: 600, height: 600, icon: '🍕', isRound: true,
        tasks: [ { id: 'swipe_card', name: 'Swipe Cafeteria ID', x: 1900, y: 950 }, { id: 'upload_admin', name: 'Upload Cafeteria Logs', x: 2100, y: 950 }, { id: 'water_plants', name: 'Water Catnip', x: 1850, y: 1050 } ],
        hasEmergencyButton: true, buttonX: 2000, buttonY: 1050
    },
    {
        id: 'medical', name: '🏥 Medical', color: '#ff6b6b', bgColor: '#2d1b24',
        x: 1050, y: 250, width: 450, height: 320, icon: '🏥',
        tasks: [ { id: 'med_scan', name: 'Submit Med Scan', x: 1150, y: 380 }, { id: 'treat_scratches', name: 'Treat Paw Scratches', x: 1350, y: 380 } ]
    },
    {
        id: 'weapons', name: '⚔️ Weapons', color: '#ff793f', bgColor: '#331e1b',
        x: 2500, y: 250, width: 450, height: 320, icon: '⚔️',
        tasks: [ { id: 'clear_asteroids', name: 'Clear Asteroids', x: 2600, y: 380 }, { id: 'load_torpedoes', name: 'Load Catnip Torpedoes', x: 2800, y: 380 } ]
    },
    {
        id: 'security', name: '📹 Security', color: '#a29bfe', bgColor: '#201b3a',
        x: 450, y: 700, width: 400, height: 350, icon: '📹',
        tasks: [ { id: 'monitor_cams', name: 'Monitor Security Feeds', x: 550, y: 875 }, { id: 'rewind_tapes', name: 'Rewind Security Tapes', x: 750, y: 875 } ]
    },
    {
        id: 'ship_quarters', name: '🛏️ Ship Quarters', color: '#ffeaa7', bgColor: '#2d2d2d',
        x: 1100, y: 750, width: 400, height: 320, icon: '🛏️',
        tasks: [ { id: 'make_beds', name: 'Make Scratching Beds', x: 1200, y: 910 }, { id: 'clean_litter', name: 'Clean Space Litter', x: 1400, y: 910 } ]
    },
    {
        id: 'nap_quarters', name: '😴 Nap Quarters', color: '#fd79a8', bgColor: '#3d252f',
        x: 2500, y: 750, width: 400, height: 320, icon: '😴',
        tasks: [ { id: 'fluff_pillows', name: 'Fluff Nap Pillows', x: 2600, y: 910 }, { id: 'fix_clock', name: 'Set Alarm Clock', x: 2800, y: 910 } ]
    },
    {
        id: 'electrical', name: '⚡ Electrical', color: '#fbc531', bgColor: '#332e1b',
        x: 3150, y: 700, width: 400, height: 350, icon: '⚡',
        tasks: [ { id: 'calibrate_distributor', name: 'Calibrate Power', x: 3250, y: 875 }, { id: 'download_data', name: 'Download Power Logs', x: 3450, y: 875 } ],
        hasLightsFixPanel: true, lightsFixX: 3350, lightsFixY: 875
    },
    {
        id: 'o2', name: '💨 Oxygen (O2)', color: '#74b9ff', bgColor: '#1c2e3d',
        x: 450, y: 1300, width: 400, height: 320, icon: '💨',
        tasks: [ { id: 'clean_filters', name: 'Clean Oxygen Filter', x: 550, y: 1460 }, { id: 'refill_tanks', name: 'Refill O2 Storage Tanks', x: 750, y: 1460 } ]
    },
    {
        id: 'fish_storage', name: '🐟 Fish Storage', color: '#00cec9', bgColor: '#1b2d33',
        x: 1050, y: 1300, width: 450, height: 320, icon: '🐟',
        tasks: [ { id: 'sort_fish', name: 'Sort Fish Bins', x: 1150, y: 1460 }, { id: 'check_freezer', name: 'Check Freezer Temp', x: 1350, y: 1460 } ]
    },
    {
        id: 'kitchen', name: '🍳 Kitchen', color: '#e67e22', bgColor: '#3d2c1e',
        x: 2500, y: 1300, width: 450, height: 320, icon: '🍳',
        tasks: [ { id: 'cook_fish', name: 'Prepare Fish Feast', x: 2600, y: 1460 }, { id: 'wash_bowls', name: 'Wash Food Bowls', x: 2800, y: 1460 } ]
    },
    {
        id: 'comms', name: '📻 Communications (Comms)', color: '#0984e3', bgColor: '#1c2833',
        x: 3150, y: 1300, width: 400, height: 320, icon: '📻',
        tasks: [ { id: 'reboot_wifi', name: 'Reboot Space Comm Router', x: 3250, y: 1460 }, { id: 'download_comms', name: 'Download Signal Decryption', x: 3450, y: 1460 } ],
        hasCommsFixPanel: true, commsFixX: 3350, commsFixY: 1460
    },
    {
        id: 'records', name: '📂 Catnip Records', color: '#a29bfe', bgColor: '#241b3a',
        x: 450, y: 1850, width: 450, height: 320, icon: '📂',
        tasks: [ { id: 'file_records', name: 'File Catnip Inventory', x: 550, y: 2010 }, { id: 'scan_id', name: 'Scan Paw ID', x: 750, y: 2010 } ]
    },
    {
        id: 'cargo_bay', name: '📦 Cargo Bay', color: '#ffeaa7', bgColor: '#2d3436',
        x: 1700, y: 1900, width: 600, height: 400, icon: '📦',
        tasks: [ { id: 'sort_boxes', name: 'Sort Supply Crates', x: 1850, y: 2100 }, { id: 'check_manifest', name: 'Check Cargo Manifest', x: 2150, y: 2100 } ]
    },
    {
        id: 'workshop', name: '🛠️ Workshop', color: '#81ecec', bgColor: '#1b2d2d',
        x: 3100, y: 1850, width: 450, height: 320, icon: '🛠️',
        tasks: [ { id: 'pickup_torpedo', name: 'Retrieve Catnip Torpedo', x: 3200, y: 2010 }, { id: 'fix_wiring', name: 'Fix Electrical Wires', x: 3350, y: 2010 }, { id: 'tighten_bolts', name: 'Tighten Hull Bolts', x: 3450, y: 2010 } ]
    },
    {
        id: 'yarn_engine', name: '🧶 Yarn Engine', color: '#fd79a8', bgColor: '#2d1b2b',
        x: 1000, y: 2350, width: 500, height: 400, icon: '🧶',
        tasks: [ { id: 'untangle_yarn', name: 'Untangle Yarn Spool', x: 1150, y: 2550 }, { id: 'calibrate_engine', name: 'Calibrate Engine Dials', x: 1350, y: 2550 } ],
        hasEngineFixPanel: true, engineFixX: 1250, engineFixY: 2550
    },
    {
        id: 'shields', name: '🛡️ Shields', color: '#74b9ff', bgColor: '#1c2833',
        x: 2500, y: 2350, width: 500, height: 400, icon: '🛡️',
        tasks: [ { id: 'prime_shields', name: 'Prime Deflector Shields', x: 2650, y: 2550 }, { id: 'realign_panels', name: 'Realign Shield Panels', x: 2850, y: 2550 } ]
    }
];

export const CATHQ_CORRIDORS = [
    // Central Spine (x = 2000)
    { x1: 2000, y1: 500, x2: 2000, y2: 2450, width: 120 },
    // Left Spine (x = 850)
    { x1: 850, y1: 570, x2: 850, y2: 2450, width: 100 },
    // Right Spine (x = 3150)
    { x1: 3150, y1: 570, x2: 3150, y2: 2450, width: 100 },
    // Top Horizontal Corridor (y = 570)
    { x1: 850, y1: 570, x2: 3150, y2: 570, width: 100 },
    // Quarters Horizontal Corridor (y = 910)
    { x1: 850, y1: 910, x2: 3150, y2: 910, width: 100 },
    // Middle Horizontal Corridor (y = 1170)
    { x1: 650, y1: 1170, x2: 3350, y2: 1170, width: 100 },
    // Storage/Kitchen Horizontal Corridor (y = 1460)
    { x1: 850, y1: 1460, x2: 3150, y2: 1460, width: 100 },
    // Lower Middle Horizontal Corridor (y = 1720)
    { x1: 650, y1: 1720, x2: 3350, y2: 1720, width: 100 },
    // Bottom Horizontal Corridor (y = 2400)
    { x1: 850, y1: 2400, x2: 3150, y2: 2400, width: 100 }
];

export const ROOMS = [...WHISKER_STATION_ROOMS];
export const CORRIDORS = [...WHISKER_STATION_CORRIDORS];

export function loadMap(mapId) {
    if (mapId === 'cat_hq') {
        MAP_BOUNDS.width = 4000;
        MAP_BOUNDS.height = 3000;
        
        ROOMS.length = 0;
        ROOMS.push(...CATHQ_ROOMS);
        
        CORRIDORS.length = 0;
        CORRIDORS.push(...CATHQ_CORRIDORS);
        
        VENTS.length = 0;
        VENTS.push(
            { id: 'hq_v1', roomId: 'security', x: 550, y: 800, connectId: 'hq_v2', targetRoom: 'Electrical' },
            { id: 'hq_v2', roomId: 'electrical', x: 3250, y: 800, connectId: 'hq_v1', targetRoom: 'Security' },
            { id: 'hq_v3', roomId: 'medical', x: 1150, y: 320, connectId: 'hq_v4', targetRoom: 'Weapons' },
            { id: 'hq_v4', roomId: 'weapons', x: 2600, y: 320, connectId: 'hq_v3', targetRoom: 'Medical' },
            { id: 'hq_v5', roomId: 'admin', x: 1900, y: 1350, connectId: 'hq_v6', targetRoom: 'Workshop' },
            { id: 'hq_v6', roomId: 'workshop', x: 3200, y: 1900, connectId: 'hq_v5', targetRoom: 'Admin Room' },
            { id: 'hq_v7', roomId: 'bridge', x: 1850, y: 200, connectId: 'hq_v8', targetRoom: 'Yarn Engine' },
            { id: 'hq_v8', roomId: 'yarn_engine', x: 1150, y: 2450, connectId: 'hq_v7', targetRoom: 'Bridge' }
        );
    } else if (mapId === 'catnip_observatory') {
        MAP_BOUNDS.width = 2800;
        MAP_BOUNDS.height = 5700;
        
        ROOMS.length = 0;
        ROOMS.push(...CATNIP_OBSERVATORY_ROOMS);
        
        CORRIDORS.length = 0;
        CORRIDORS.push(...CATNIP_OBSERVATORY_CORRIDORS);
        
        VENTS.length = 0;
        VENTS.push(
            { id: 'cv1', roomId: 'greenhouse', x: 350, y: 350, connectId: 'cv2', targetRoom: 'Reactor Core' },
            { id: 'cv2', roomId: 'reactor', x: 350, y: 1650, connectId: 'cv1', targetRoom: 'Catnip Greenhouse' },
            { id: 'cv3', roomId: 'laser_weapons', x: 2350, y: 350, connectId: 'cv4', targetRoom: 'Thrusters' },
            { id: 'cv4', roomId: 'thrusters', x: 2350, y: 1650, connectId: 'cv3', targetRoom: 'Laser Weapons' },
            { id: 'cv5', roomId: 'security', x: 1350, y: 950, connectId: 'cv6', targetRoom: 'Communications' },
            { id: 'cv6', roomId: 'comms', x: 1350, y: 1650, connectId: 'cv5', targetRoom: 'Security' }
        );
    } else {
        MAP_BOUNDS.width = 3600;
        MAP_BOUNDS.height = 2600;
        
        ROOMS.length = 0;
        ROOMS.push(...WHISKER_STATION_ROOMS);
        
        CORRIDORS.length = 0;
        CORRIDORS.push(...WHISKER_STATION_CORRIDORS);
        
        VENTS.length = 0;
        VENTS.push(
            { id: 'v1', roomId: 'fish_storage', x: 1025, y: 760, connectId: 'v2', targetRoom: 'Kitchen' },
            { id: 'v2', roomId: 'kitchen', x: 2525, y: 1220, connectId: 'v1', targetRoom: 'Fish Storage' },
            { id: 'v3', roomId: 'yarn_engine', x: 1800, y: 2150, connectId: 'v4', targetRoom: 'Bridge' },
            { id: 'v4', roomId: 'bridge', x: 1800, y: 380, connectId: 'v3', targetRoom: 'Yarn Engine' },
            { id: 'v5', roomId: 'workshop', x: 2575, y: 1680, connectId: 'v6', targetRoom: 'Cat Garden' },
            { id: 'v6', roomId: 'cat_garden', x: 1025, y: 1680, connectId: 'v5', targetRoom: 'Workshop' },
            { id: 'v7', roomId: 'nap_quarters', x: 1075, y: 1220, connectId: 'v8', targetRoom: 'Cargo Bay' },
            { id: 'v8', roomId: 'cargo_bay', x: 1800, y: 1220, connectId: 'v7', targetRoom: 'Nap Quarters' },
            { id: 'v9', roomId: 'thruster_a', x: 425, y: 2260, connectId: 'v10', targetRoom: 'Catnip Records' },
            { id: 'v10', roomId: 'records', x: 450, y: 1770, connectId: 'v9', targetRoom: 'Thruster A' },
            { id: 'v11', roomId: 'thruster_b', x: 3175, y: 2260, connectId: 'v12', targetRoom: 'Admin Room' },
            { id: 'v12', roomId: 'admin', x: 3150, y: 1790, connectId: 'v11', targetRoom: 'Thruster B' }
        );
    }
}

export function getNearbyLadder(playerX, playerY, maxDist = 60) {
    const ladders = [
        { x1: 1400, y1: 650, x2: 1400, y2: 3650, name: 'Main Elevator' },
        { x1: 650, y1: 975, x2: 650, y2: 3975, name: 'Service Ladder Left' },
        { x1: 2150, y1: 975, x2: 2150, y2: 3975, name: 'Service Ladder Right' }
    ];
    for (const l of ladders) {
        if (Math.hypot(playerX - l.x1, playerY - l.y1) <= maxDist) {
            return { x: l.x2, y: l.y2, label: l.name };
        }
        if (Math.hypot(playerX - l.x2, playerY - l.y2) <= maxDist) {
            return { x: l.x1, y: l.y1, label: l.name };
        }
    }
    return null;
}
