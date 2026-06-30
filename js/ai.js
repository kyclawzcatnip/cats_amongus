// AI Controller for Bots in Cat Crew
import { ROOMS, CORRIDORS } from './rooms.js';
import { soundManager } from './sounds.js';

export class AIController {
    static updateBot(bot, dt, players, sabotageSystem, onReportBody) {
        if (bot.isDead) return;

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

        for (const p of players) {
            if (p.isDead && Math.hypot(bot.x - p.x, bot.y - p.y) <= 100) {
                onReportBody(bot, p); return;
            }
        }

        const ROOM_NODES = {
            bridge: { center: { x: 1800, y: 310 }, door: { x: 1800, y: 470 } },
            medical: { center: { x: 1075, y: 410 }, door: { x: 1300, y: 410 } },
            weapons: { center: { x: 2525, y: 410 }, door: { x: 2300, y: 410 } },
            security: { center: { x: 450, y: 875 }, door: { x: 650, y: 875 } },
            fish_storage: { center: { x: 1025, y: 875 }, door: { x: 1250, y: 875 } },
            electrical: { center: { x: 2575, y: 875 }, door: { x: 2350, y: 875 } },
            shields: { center: { x: 3150, y: 875 }, door: { x: 2950, y: 875 } },
            ship_quarters: { center: { x: 1800, y: 810 }, door: { x: 1800, y: 810 } },
            o2: { center: { x: 450, y: 1325 }, door: { x: 650, y: 1325 } },
            nap_quarters: { center: { x: 1075, y: 1325 }, door: { x: 1300, y: 1325 } },
            kitchen: { center: { x: 2525, y: 1325 }, door: { x: 2300, y: 1325 } },
            cargo_bay: { center: { x: 1800, y: 1325 }, door: { x: 1800, y: 1325 } },
            comms: { center: { x: 3150, y: 1325 }, door: { x: 2950, y: 1325 } },
            records: { center: { x: 450, y: 1770 }, door: { x: 650, y: 1770 } },
            cat_garden: { center: { x: 1025, y: 1790 }, door: { x: 1250, y: 1790 } },
            workshop: { center: { x: 2575, y: 1790 }, door: { x: 2350, y: 1790 } },
            thruster_a: { center: { x: 425, y: 2260 }, door: { x: 650, y: 2260 } },
            thruster_b: { center: { x: 3175, y: 2260 }, door: { x: 2950, y: 2260 } },
            yarn_engine: { center: { x: 1800, y: 2260 }, door: { x: 1800, y: 2050 } }
        };

        if (sabotageSystem.activeSabotage === 'engine' && bot.role !== 'Dog') {
            const finalNode = bot.currentPath ? bot.currentPath[bot.currentPath.length - 1] : null;
            if (!finalNode || !finalNode.isEngineFix) {
                let closestRoomKey = 'bridge';
                let minDist = Infinity;
                for (const key of Object.keys(ROOM_NODES)) {
                    const d = Math.hypot(bot.x - ROOM_NODES[key].center.x, bot.y - ROOM_NODES[key].center.y);
                    if (d < minDist) { minDist = d; closestRoomKey = key; }
                }
                const startNode = ROOM_NODES[closestRoomKey];
                const targetNode = ROOM_NODES['yarn_engine'];

                bot.currentPath = [
                    { x: startNode.door.x, y: startNode.door.y },
                    { x: 1800, y: startNode.door.y },
                    { x: 1800, y: targetNode.door.y },
                    { x: targetNode.door.x, y: targetNode.door.y },
                    { x: 1800, y: 2260, isEngineFix: true }
                ];
                bot.taskTimer = 0;
                bot.currentTaskToComplete = null;
            }
        }

        if (bot.taskTimer > 0) {
            bot.taskTimer -= dt;
            if (bot.taskTimer <= 0) {
                if (bot.currentTaskToComplete) {
                    bot.currentTaskToComplete.completed = true;
                    bot.currentTaskToComplete = null;
                }
            }
            return;
        }

        if (!bot.currentPath || bot.currentPath.length === 0) {
            // 55% chance to travel in a group with another crewmate
            if (bot.role !== 'Dog' && Math.random() < 0.55) {
                const potentialLeaders = players.filter(p => !p.isLocalPlayer && !p.isDead && p.id !== bot.id && p.role !== 'Dog' && p.currentPath && p.currentPath.length > 0);
                if (potentialLeaders.length > 0) {
                    const leader = potentialLeaders[Math.floor(Math.random() * potentialLeaders.length)];
                    const finalNode = leader.currentPath[leader.currentPath.length - 1];
                    if (finalNode) {
                        const offsetAngle = Math.random() * Math.PI * 2;
                        const offsetDist = Math.random() * 15 + 5;
                        const offsetX = Math.cos(offsetAngle) * offsetDist;
                        const offsetY = Math.sin(offsetAngle) * offsetDist;
                        let targetX = finalNode.x;
                        let targetY = finalNode.y;
                        if (isWalkable(finalNode.x + offsetX, finalNode.y + offsetY)) {
                            targetX = finalNode.x + offsetX;
                            targetY = finalNode.y + offsetY;
                        }

                        let closestRoomKey = 'bridge';
                        let minDist = Infinity;
                        for (const key of Object.keys(ROOM_NODES)) {
                            const d = Math.hypot(bot.x - ROOM_NODES[key].center.x, bot.y - ROOM_NODES[key].center.y);
                            if (d < minDist) { minDist = d; closestRoomKey = key; }
                        }
                        const startNode = ROOM_NODES[closestRoomKey];

                        let targetRoomKey = 'bridge';
                        for (const key of Object.keys(ROOM_NODES)) {
                            if (Math.hypot(targetX - ROOM_NODES[key].center.x, targetY - ROOM_NODES[key].center.y) < 250) {
                                targetRoomKey = key; break;
                            }
                        }
                        const targetNode = ROOM_NODES[targetRoomKey];

                        bot.currentPath = [
                            { x: startNode.door.x, y: startNode.door.y },
                            { x: 1800, y: startNode.door.y },
                            { x: 1800, y: targetNode.door.y },
                            { x: targetNode.door.x, y: targetNode.door.y },
                            { x: targetX, y: targetY, taskObj: finalNode.taskObj }
                        ];
                        return;
                    }
                }
            }

            const uncompletedTasks = (bot.tasks || []).filter(t => !t.completed);
            
            let targetKey = 'bridge';
            let taskTarget = null;

            if (uncompletedTasks.length > 0) {
                const nextTask = uncompletedTasks[Math.floor(Math.random() * uncompletedTasks.length)];
                const roomObj = ROOMS.find(r => r.name.includes(nextTask.room));
                if (roomObj) {
                    targetKey = roomObj.id;
                    const baseTaskId = nextTask.id.split('_reassigned_')[0];
                    const tkLoc = roomObj.tasks.find(tk => tk.id === baseTaskId);
                    if (tkLoc) taskTarget = { ...tkLoc, taskObj: nextTask };
                }
            } else {
                const roomKeys = Object.keys(ROOM_NODES);
                targetKey = roomKeys[Math.floor(Math.random() * roomKeys.length)];
            }

            let closestRoomKey = 'bridge';
            let minDist = Infinity;
            for (const key of Object.keys(ROOM_NODES)) {
                const d = Math.hypot(bot.x - ROOM_NODES[key].center.x, bot.y - ROOM_NODES[key].center.y);
                if (d < minDist) { minDist = d; closestRoomKey = key; }
            }

            const startNode = ROOM_NODES[closestRoomKey];
            const targetNode = ROOM_NODES[targetKey];

            bot.currentPath = [
                { x: startNode.door.x, y: startNode.door.y },
                { x: 1800, y: startNode.door.y },
                { x: 1800, y: targetNode.door.y },
                { x: targetNode.door.x, y: targetNode.door.y },
                taskTarget ? { x: taskTarget.x, y: taskTarget.y, taskObj: taskTarget.taskObj } : { x: targetNode.center.x, y: targetNode.center.y }
            ];
        }

        if (bot.currentPath && bot.currentPath.length > 0) {
            const targetNode = bot.currentPath[0];
            const dx = targetNode.x - bot.x;
            const dy = targetNode.y - bot.y;
            const dist = Math.hypot(dx, dy);

            if (dist < 30) {
                if (targetNode.isEngineFix) {
                    sabotageSystem.fixSabotage();
                    soundManager.playTaskComplete();
                    bot.currentPath = [];
                    return;
                }
                if (targetNode.taskObj) {
                    bot.taskTimer = 4.0;
                    bot.currentTaskToComplete = targetNode.taskObj;
                }
                bot.currentPath.shift();
            } else {
                if (dx < 0) bot.scaleX = -1;
                else if (dx > 0) bot.scaleX = 1;
                const moveDist = bot.speed * dt * 0.8;
                const nextX = bot.x + (dx / dist) * moveDist;
                const nextY = bot.y + (dy / dist) * moveDist;

                if (isWalkable(nextX, nextY)) {
                    bot.x = nextX;
                    bot.y = nextY;
                } else if (isWalkable(nextX, bot.y)) {
                    bot.x = nextX;
                } else if (isWalkable(bot.x, nextY)) {
                    bot.y = nextY;
                } else {
                    bot.currentPath = null;
                }
            }
        }

        if (bot.role === 'Medic' && bot.reviveUses > 0 && !bot.isDead) {
            const deadCat = players.find(p => p.isDead && !p.bodyCleaned && p.id !== bot.id && Math.hypot(bot.x - p.x, bot.y - p.y) <= 80);
            if (deadCat) {
                deadCat.isDead = false;
                bot.reviveUses -= 1;
                soundManager.playTaskComplete();
            }
        }

        if (bot.role === 'Dog') {
            if (bot.killCooldown > 0) {
                bot.killCooldown -= dt;
            }

            if (bot.killCooldown <= 0 && !bot.isLocalPlayer) {
                let nearestCat = null;
                let minDist = 300;
                for (const p of players) {
                    if (!p.isDead && p.id !== bot.id && p.role !== 'Dog') {
                        const d = Math.hypot(bot.x - p.x, bot.y - p.y);
                        if (d < minDist) {
                            minDist = d;
                            nearestCat = p;
                        }
                    }
                }
                if (nearestCat) {
                    bot.currentPath = [{ x: nearestCat.x, y: nearestCat.y }];
                }
            }

            if (bot.killCooldown <= 0) {
                for (const target of players) {
                    if (!target.isDead && target.id !== bot.id && target.role !== 'Dog' && Math.hypot(bot.x - target.x, bot.y - target.y) <= 80) {
                        target.isDead = true;
                        bot.killCooldown = 25;
                        break;
                    }
                }
            }

            if (!bot.isLocalPlayer && sabotageSystem.cooldown <= 0 && !sabotageSystem.activeSabotage) {
                const sabTypes = ['lights', 'engine'];
                const picked = sabTypes[Math.floor(Math.random() * sabTypes.length)];
                sabotageSystem.triggerSabotage(picked);
            }
        }
    }
}
