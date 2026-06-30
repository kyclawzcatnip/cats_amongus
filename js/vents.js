// Vent Network Logic & Locations for Cat Crew

export const VENTS = [
    { id: 'v1', roomId: 'fish_storage', x: 450, y: 580, connectId: 'v2', targetRoom: 'Kitchen' },
    { id: 'v2', roomId: 'kitchen', x: 1850, y: 580, connectId: 'v1', targetRoom: 'Fish Storage' },
    
    { id: 'v3', roomId: 'yarn_engine', x: 1720, y: 1520, connectId: 'v4', targetRoom: 'Bridge' },
    { id: 'v4', roomId: 'bridge', x: 1060, y: 380, connectId: 'v3', targetRoom: 'Yarn Engine' },
    
    { id: 'v5', roomId: 'workshop', x: 1950, y: 1080, connectId: 'v6', targetRoom: 'Cat Garden' },
    { id: 'v6', roomId: 'cat_garden', x: 450, y: 1080, connectId: 'v5', targetRoom: 'Workshop' },
    
    { id: 'v7', roomId: 'nap_quarters', x: 1320, y: 880, connectId: 'v8', targetRoom: 'Cargo Bay' },
    { id: 'v8', roomId: 'cargo_bay', x: 680, y: 1520, connectId: 'v7', targetRoom: 'Nap Quarters' },
    { id: 'v9', roomId: 'thruster_a', x: 425, y: 2260, connectId: 'v10', targetRoom: 'Catnip Records' },
    { id: 'v10', roomId: 'records', x: 450, y: 1770, connectId: 'v9', targetRoom: 'Thruster A' },
    { id: 'v11', roomId: 'thruster_b', x: 3175, y: 2260, connectId: 'v12', targetRoom: 'Admin Room' },
    { id: 'v12', roomId: 'admin', x: 3150, y: 1790, connectId: 'v11', targetRoom: 'Thruster B' }
];

export class VentSystem {
    static getNearbyVent(playerX, playerY, maxDist = 60) {
        for (const vent of VENTS) {
            const dx = playerX - vent.x;
            const dy = playerY - vent.y;
            const dist = Math.hypot(dx, dy);
            if (dist <= maxDist) {
                return vent;
            }
        }
        return null;
    }

    static getVentById(id) {
        return VENTS.find(v => v.id === id);
    }
}
