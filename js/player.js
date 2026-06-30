import { soundManager } from './sounds.js';
import { ROOMS, CORRIDORS } from './rooms.js';

export class Player {
    constructor(id, name, colorIndex, hatIndex, role, isLocalPlayer = false) {
        this.id = id;
        this.name = name;
        this.colorIndex = colorIndex;
        this.hatIndex = hatIndex;
        this.role = role; // 'Citizen' | 'Captain' | 'Guard' | 'Engineer' | 'Medic' | 'evil Dog'
        this.isLocalPlayer = isLocalPlayer;

        this.x = 1800;
        this.y = 280;
        this.radius = 32;
        this.speed = 220; // pixels per sec

        this.isDead = false;
        this.bodyCleaned = false;
        this.inVent = false;
        this.currentVentId = null;

        this.killCooldown = 10; // start with 10s cooldown
        this.reviveUses = 2; // Medic has 2 revive uses max!
        this.tasks = [];
        
        // Footstep audio timer
        this.stepTimer = 0;
    }

    getVisionRadius(sabotageActive) {
        let baseVision = 750;
        if (this.role === 'Guard') baseVision = 950;
        if (this.role === 'evil Dog') baseVision = 1000;
        if (sabotageActive === 'lights') {
            if (this.role === 'Guard') return 350;
            else if (this.role === 'evil Dog') return baseVision;
            else return 250;
        }
        return baseVision;
    }

    update(dt, keysPressed, mapBounds) {
        if (this.inVent) return;

        let dx = 0;
        let dy = 0;

        if (this.isLocalPlayer) {
            if (keysPressed['KeyW'] || keysPressed['ArrowUp'] || keysPressed['w'] || keysPressed['W']) dy -= 1;
            if (keysPressed['KeyS'] || keysPressed['ArrowDown'] || keysPressed['s'] || keysPressed['S']) dy += 1;
            if (keysPressed['KeyA'] || keysPressed['ArrowLeft'] || keysPressed['a'] || keysPressed['A']) dx -= 1;
            if (keysPressed['KeyD'] || keysPressed['ArrowRight'] || keysPressed['d'] || keysPressed['D']) dx += 1;
        }
        if (dx !== 0 || dy !== 0) {
            if (dx < 0) this.scaleX = -1;
            else if (dx > 0) this.scaleX = 1;
            const length = Math.hypot(dx, dy);
            const moveDist = this.speed * dt;
            const nextX = this.x + (dx / length) * moveDist;
            const nextY = this.y + (dy / length) * moveDist;

            const isWalkable = (px, py) => {
                const margin = 12;
                for (const r of ROOMS) {
                    if (px >= r.x + margin && px <= r.x + r.width - margin &&
                        py >= r.y + margin && py <= r.y + r.height - margin) return true;
                }
                for (const c of CORRIDORS) {
                    let minX, maxX, minY, maxY;
                    if (c.x1 === c.x2) {
                        minX = c.x1 - c.width / 2 + margin; maxX = c.x1 + c.width / 2 - margin;
                        minY = Math.min(c.y1, c.y2) - margin; maxY = Math.max(c.y1, c.y2) + margin;
                    } else {
                        minX = Math.min(c.x1, c.x2) - margin; maxX = Math.max(c.x1, c.x2) + margin;
                        minY = c.y1 - c.width / 2 + margin; maxY = c.y1 + c.width / 2 - margin;
                    }
                    if (px >= minX && px <= maxX && py >= minY && py <= maxY) return true;
                }
                return false;
            };

            if (isWalkable(nextX, nextY)) {
                this.x = nextX; this.y = nextY;
            } else if (isWalkable(nextX, this.y)) {
                this.x = nextX;
            } else if (isWalkable(this.x, nextY)) {
                this.y = nextY;
            }

            this.stepTimer += dt;
            if (this.stepTimer >= 0.35 && this.isLocalPlayer && !this.isDead) {
                soundManager.playFootstep(); this.stepTimer = 0;
            }
        }

        // Update Kill Cooldown for evil Dog
        if (this.role === 'evil Dog' && this.killCooldown > 0) {
            this.killCooldown -= dt;
            if (this.killCooldown < 0) this.killCooldown = 0;
        }
    }

    canKill(targetPlayer) {
        if (this.role !== 'evil Dog' || this.isDead || this.killCooldown > 0) return false;
        if (!targetPlayer || targetPlayer.isDead || targetPlayer.id === this.id || targetPlayer.role === 'evil Dog') return false;
        
        const dist = Math.hypot(this.x - targetPlayer.x, this.y - targetPlayer.y);
        return dist <= 80; // Kill range
    }

    canRevive(targetPlayer) {
        if (this.role !== 'Medic' || this.isDead || this.reviveUses <= 0) return false;
        if (!targetPlayer || !targetPlayer.isDead) return false;

        const dist = Math.hypot(this.x - targetPlayer.x, this.y - targetPlayer.y);
        return dist <= 80; // Revive range
    }
}
