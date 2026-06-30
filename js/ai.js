// AI Controller for Bots in Cat Crew
import { ROOMS, CORRIDORS } from './rooms.js';
import { soundManager } from './sounds.js';
import { VENTS } from './vents.js';

export class AIController {
    static updateBot(bot, dt, players, sabotageSystem, onReportBody) {
        if (bot.isDead) return;
        if (bot.invulnTimer > 0) bot.invulnTimer -= dt;

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


        const isLineOfSightClear = (x1, y1, x2, y2) => {
            if ((y1 >= 2800) !== (y2 >= 2800)) return false;
            const dist = Math.hypot(x2 - x1, y2 - y1);
            const steps = Math.ceil(dist / 25);
            for (let i = 1; i < steps; i++) {
                const t = i / steps;
                const px = x1 + (x2 - x1) * t;
                const py = y1 + (y2 - y1) * t;
                if (!isWalkable(px, py)) return false;
            }
            return true;
        };

        for (const p of players) {
            if (p.isDead && !p.bodyCleaned && Math.hypot(bot.x - p.x, bot.y - p.y) <= 100) {
                onReportBody(bot, p); return;
            }
        }

        // 1. Proximity-to-Dead-Body Suspicion Check
        if (bot.role !== 'evil Dog') {
            for (const p of players) {
                if (p.isDead && !p.bodyCleaned) {
                    const sameFloor = (p.y >= 2800) === (bot.y >= 2800);
                    if (sameFloor && Math.hypot(bot.x - p.x, bot.y - p.y) <= 280 && isLineOfSightClear(bot.x, bot.y, p.x, p.y)) {
                        for (const sus of players) {
                            if (sus.id !== bot.id && sus.id !== p.id && !sus.isDead) {
                                const susFloor = (sus.y >= 2800) === (p.y >= 2800);
                                if (susFloor && Math.hypot(sus.x - p.x, sus.y - p.y) <= 220 && isLineOfSightClear(sus.x, sus.y, p.x, p.y)) {
                                    if (!bot.suspicionLevels) bot.suspicionLevels = {};
                                    bot.suspicionLevels[sus.id] = Math.min(100, (bot.suspicionLevels[sus.id] || 0) + 1.5);
                                }
                            }
                        }
                    }
                }
            }
        }

        // Crewmate Task Protection/Guard Behavior: If we see another cat performing a task, stay near them to protect them!
        if (bot.role !== 'evil Dog') {
            const isPerformingTask = (playerObj) => {
                if (playerObj.isLocalPlayer) {
                    return window.gameInstance && window.gameInstance.activeTask !== null;
                }
                return playerObj.taskTimer > 0 && playerObj.currentTaskToComplete;
            };

            let protectTarget = null;
            for (const p of players) {
                if (p.id !== bot.id && !p.isDead && p.role !== 'evil Dog') {
                    if (isPerformingTask(p)) {
                        const d = Math.hypot(bot.x - p.x, bot.y - p.y);
                        const sameFloor = (bot.y >= 2800) === (p.y >= 2800);
                        const isLOSClear = window.isLineOfSightClear ? window.isLineOfSightClear(bot.x, bot.y, p.x, p.y) : true;
                        if (sameFloor && d < 250 && isLOSClear) {
                            protectTarget = p;
                            break;
                        }
                    }
                }
            }

            if (protectTarget) {
                const angle = Math.atan2(bot.y - protectTarget.y, bot.x - protectTarget.x);
                const targetX = protectTarget.x + Math.cos(angle) * 60;
                const targetY = protectTarget.y + Math.sin(angle) * 60;
                
                const dx = targetX - bot.x;
                const dy = targetY - bot.y;
                const dist = Math.hypot(dx, dy);
                
                if (dist > 15) {
                    if (dx < 0) bot.scaleX = -1;
                    else if (dx > 0) bot.scaleX = 1;
                    const moveDist = bot.speed * dt * 0.8;
                    const nextX = bot.x + (dx / dist) * moveDist;
                    const nextY = bot.y + (dy / dist) * moveDist;
                    if (isWalkable(nextX, nextY)) {
                        bot.x = nextX;
                        bot.y = nextY;
                    }
                }
                bot.isFleeing = false;
                return; // Guarding behavior overrides normal task logic!
            }
        }

        // 2. Fleeing Behavior (Flee from Invader Dogs during Defensive Protocol if unarmed)
        if (bot.role !== 'evil Dog' && window.gameInstance && window.gameInstance.defensiveProtocolActive && !bot.hasKnife && window.gameInstance.invaders) {
            let nearestInvader = null;
            let minDist = 280;
            window.gameInstance.invaders.forEach(inv => {
                const d = Math.hypot(bot.x - inv.x, bot.y - inv.y);
                const sameFloor = (bot.y >= 2800) === (inv.y >= 2800);
                const isLOSClear = window.isLineOfSightClear ? window.isLineOfSightClear(bot.x, bot.y, inv.x, inv.y) : true;
                if (sameFloor && d < minDist && isLOSClear) {
                    minDist = d;
                    nearestInvader = inv;
                }
            });

            if (nearestInvader) {
                const angle = Math.atan2(bot.y - nearestInvader.y, bot.x - nearestInvader.x);
                let escapeX = bot.x + Math.cos(angle) * 150;
                let escapeY = bot.y + Math.sin(angle) * 150;
                if (!isWalkable(escapeX, escapeY)) {
                    for (let offset = 45; offset <= 180; offset += 45) {
                        const altAngle1 = angle + (offset * Math.PI / 180);
                        const altAngle2 = angle - (offset * Math.PI / 180);
                        let ax = bot.x + Math.cos(altAngle1) * 150;
                        let ay = bot.y + Math.sin(altAngle1) * 150;
                        if (isWalkable(ax, ay)) { escapeX = ax; escapeY = ay; break; }
                        ax = bot.x + Math.cos(altAngle2) * 150;
                        ay = bot.y + Math.sin(altAngle2) * 150;
                        if (isWalkable(ax, ay)) { escapeX = ax; escapeY = ay; break; }
                    }
                }
                bot.currentPath = [{ x: escapeX, y: escapeY }];
                bot.taskTimer = 0;
                bot.currentTaskToComplete = null;
                bot.isFleeing = true;
            } else {
                bot.isFleeing = false;
            }
        } else {
            bot.isFleeing = false;
        }

        const selectedMap = window.gameInstance ? window.gameInstance.selectedMap : 'whisker_station';
        let ROOM_NODES = {};
        let spineX = 1800;

        if (selectedMap === 'catnip_observatory') {
            spineX = 1400;
            ROOM_NODES = {
                // Floor 1
                bridge: { center: { x: 1400, y: 325 }, door: { x: 1400, y: 500 } },
                greenhouse: { center: { x: 425, y: 325 }, door: { x: 650, y: 325 } },
                laser_weapons: { center: { x: 2375, y: 325 }, door: { x: 2150, y: 325 } },
                medical: { center: { x: 425, y: 975 }, door: { x: 650, y: 975 } },
                security: { center: { x: 1400, y: 975 }, door: { x: 1400, y: 975 } },
                electrical: { center: { x: 2375, y: 975 }, door: { x: 2150, y: 975 } },
                reactor: { center: { x: 425, y: 1650 }, door: { x: 650, y: 1650 } },
                comms: { center: { x: 1400, y: 1650 }, door: { x: 1400, y: 1650 } },
                thrusters: { center: { x: 2375, y: 1650 }, door: { x: 2150, y: 1650 } },
                // Floor 2
                fish_storage: { center: { x: 425, y: 3325 }, door: { x: 650, y: 3325 } },
                ship_quarters: { center: { x: 1400, y: 3325 }, door: { x: 1400, y: 3325 } },
                shields: { center: { x: 2375, y: 3325 }, door: { x: 2150, y: 3325 } },
                o2: { center: { x: 425, y: 3975 }, door: { x: 650, y: 3975 } },
                nap_quarters: { center: { x: 1400, y: 3975 }, door: { x: 1400, y: 3975 } },
                cargo_bay: { center: { x: 2375, y: 3975 }, door: { x: 2150, y: 3975 } },
                kitchen: { center: { x: 425, y: 4650 }, door: { x: 650, y: 4650 } },
                records: { center: { x: 1400, y: 4650 }, door: { x: 1400, y: 4650 } },
                workshop: { center: { x: 2375, y: 4650 }, door: { x: 2150, y: 4650 } },
                cat_garden: { center: { x: 1400, y: 5300 }, door: { x: 1400, y: 5300 } }
            };
        } else {
            ROOM_NODES = {
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
                yarn_engine: { center: { x: 1800, y: 2260 }, door: { x: 1800, y: 2050 } },
                admin: { center: { x: 3150, y: 1790 }, door: { x: 2950, y: 1790 } }
            };
        }

        const buildPath = (startNode, targetNode, finalTarget) => {
            const path = [];
            path.push({ x: startNode.door.x, y: startNode.door.y });
            
            const startFloor = startNode.center.y >= 2800 ? 2 : 1;
            const targetFloor = targetNode.center.y >= 2800 ? 2 : 1;
            
            if (selectedMap === 'catnip_observatory' && startFloor !== targetFloor) {
                const currentLadderY = startFloor === 1 ? 650 : 3650;
                const nextLadderY = startFloor === 1 ? 3650 : 650;
                path.push({ x: spineX, y: startNode.door.y });
                path.push({ x: spineX, y: currentLadderY, isLadderTransit: true });
                path.push({ x: spineX, y: nextLadderY });
                path.push({ x: spineX, y: targetNode.door.y });
            } else {
                path.push({ x: spineX, y: startNode.door.y });
                path.push({ x: spineX, y: targetNode.door.y });
            }
            
            path.push({ x: targetNode.door.x, y: targetNode.door.y });
            path.push(finalTarget);
            return path;
        };

        if (sabotageSystem.activeSabotage && bot.role !== 'evil Dog') {
            const finalNode = bot.currentPath ? bot.currentPath[bot.currentPath.length - 1] : null;
            let targetSabType = sabotageSystem.activeSabotage;
            
            // Check if bot is already routing to fix this active sabotage
            let isRoutingToFix = false;
            if (finalNode) {
                if (targetSabType === 'engine' && finalNode.isEngineFix) isRoutingToFix = true;
                if (targetSabType === 'lights' && finalNode.isLightsFix) isRoutingToFix = true;
                if (targetSabType === 'comms' && finalNode.isCommsFix) isRoutingToFix = true;
            }
            
            if (!isRoutingToFix) {
                let closestRoomKey = 'bridge';
                let minDist = Infinity;
                for (const key of Object.keys(ROOM_NODES)) {
                    const d = Math.hypot(bot.x - ROOM_NODES[key].center.x, bot.y - ROOM_NODES[key].center.y);
                    if (d < minDist) { minDist = d; closestRoomKey = key; }
                }
                const startNode = ROOM_NODES[closestRoomKey];
                
                let targetKey = '';
                let fixX = 0, fixY = 0;
                let targetNodeSpec = {};

                if (targetSabType === 'engine') {
                    targetKey = selectedMap === 'catnip_observatory' ? 'thrusters' : 'yarn_engine';
                    const ye = ROOMS.find(r => r.id === targetKey);
                    fixX = ye ? ye.engineFixX : (selectedMap === 'catnip_observatory' ? 2375 : 1800);
                    fixY = ye ? ye.engineFixY : (selectedMap === 'catnip_observatory' ? 1650 : 2350);
                    targetNodeSpec = { x: fixX, y: fixY, isEngineFix: true };
                } else if (targetSabType === 'lights') {
                    targetKey = 'electrical';
                    const el = ROOMS.find(r => r.id === 'electrical');
                    fixX = el ? el.lightsFixX : (selectedMap === 'catnip_observatory' ? 2375 : 2570);
                    fixY = el ? el.lightsFixY : (selectedMap === 'catnip_observatory' ? 975 : 850);
                    targetNodeSpec = { x: fixX, y: fixY, isLightsFix: true };
                } else if (targetSabType === 'comms') {
                    targetKey = 'comms';
                    const cm = ROOMS.find(r => r.id === 'comms');
                    fixX = cm ? cm.commsFixX : (selectedMap === 'catnip_observatory' ? 1400 : 3150);
                    fixY = cm ? cm.commsFixY : (selectedMap === 'catnip_observatory' ? 1650 : 1325);
                    targetNodeSpec = { x: fixX, y: fixY, isCommsFix: true };
                }

                const targetNode = ROOM_NODES[targetKey];
                if (targetNode) {
                    bot.currentPath = buildPath(startNode, targetNode, targetNodeSpec);
                    bot.taskTimer = 0;
                    bot.currentTaskToComplete = null;
                }
            }
        }

        if (bot.taskTimer > 0) {
            bot.taskTimer -= dt;
            if (bot.taskTimer <= 0) {
                if (bot.currentTaskToComplete) {
                    bot.currentTaskToComplete.completed = true;
                    if (bot.currentTaskToComplete.id === 'def_get_weapons') {
                        bot.hasKnife = true;
                    }
                    if (bot.currentTaskToComplete.id === 'post_def_heal') {
                        bot.health = 3;
                        bot.tasks = bot.tasks.filter(t => t.id !== 'post_def_heal');
                    }
                    bot.currentTaskToComplete = null;
                }
            }
            return;
        }

        if (!bot.currentPath || bot.currentPath.length === 0) {
            // 55% chance to travel in a group with another crewmate
            if (bot.role !== 'evil Dog' && Math.random() < 0.55) {
                const potentialLeaders = players.filter(p => !p.isLocalPlayer && !p.isDead && p.id !== bot.id && p.role !== 'evil Dog' && p.currentPath && p.currentPath.length > 0);
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

                        bot.currentPath = buildPath(startNode, targetNode, { x: targetX, y: targetY, taskObj: finalNode.taskObj });
                        return;
                    }
                }
            }

            const uncompletedTasks = (bot.tasks || []).filter(t => {
                if (t.completed) return false;
                const baseId = t.id.split('_reassigned_')[0];
                if (baseId === 'upload_data') {
                    const downloadUncompleted = bot.tasks.some(d => (d.id.includes('download_data') || d.id.includes('download_comms')) && !d.completed);
                    if (downloadUncompleted) return false;
                }
                if (baseId === 'load_torpedoes') {
                    const pickupUncompleted = bot.tasks.some(p => p.id.includes('pickup_torpedo') && !p.completed);
                    if (pickupUncompleted) return false;
                }
                return true;
            });
            
            let targetKey = 'bridge';
            let taskTarget = null;

            let tasksToSelect = uncompletedTasks;
            const hasKnifeTask = uncompletedTasks.find(t => t.id === 'def_get_weapons');
            if (hasKnifeTask) {
                tasksToSelect = [hasKnifeTask];
            }

            if (tasksToSelect.length > 0) {
                const nextTask = tasksToSelect[Math.floor(Math.random() * tasksToSelect.length)];
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

            bot.currentPath = buildPath(startNode, targetNode, taskTarget ? { x: taskTarget.x, y: taskTarget.y, taskObj: taskTarget.taskObj } : { x: targetNode.center.x, y: targetNode.center.y });
        }

        if (bot.currentPath && bot.currentPath.length > 0) {
            const targetNode = bot.currentPath[0];
            const dx = targetNode.x - bot.x;
            const dy = targetNode.y - bot.y;
            const dist = Math.hypot(dx, dy);

            if (dist < 30) {
                if (targetNode.isLadderTransit) {
                    const startFloor = bot.y >= 2800 ? 2 : 1;
                    bot.x = 1400;
                    bot.y = startFloor === 1 ? 3650 : 650;
                    bot.currentPath.shift();
                    return;
                }
                if (targetNode.isEmergencyButtonTrigger) {
                    bot.currentPath = [];
                    onReportBody(bot, null);
                    return;
                }
                if (targetNode.isEngineFix || targetNode.isLightsFix || targetNode.isCommsFix) {
                    sabotageSystem.fixSabotage();
                    soundManager.playTaskComplete();
                    bot.currentPath = [];
                    return;
                }
                if (targetNode.taskObj) {
                    bot.taskTimer = 4.0;
                    bot.currentTaskToComplete = targetNode.taskObj;
                }
                const selectedMap = window.gameInstance ? window.gameInstance.selectedMap : 'whisker_station';
                const btnX = selectedMap === 'catnip_observatory' ? 1400 : 1800;
                const btnY = selectedMap === 'catnip_observatory' ? 325 : 310;
                if (targetNode.x === btnX && targetNode.y === btnY && !bot.hasCalledEmergency) {
                    const gameTime = window.gameInstance?.gameTimer || 0;
                    if (gameTime > 30 && Math.random() < 0.2 && window.gameInstance && window.gameInstance.state === 'PLAYING') {
                        bot.hasCalledEmergency = true;
                        onReportBody(bot, null);
                        return;
                    }
                }
                bot.currentPath.shift();
            } else {
                if (dx < 0) bot.scaleX = -1;
                else if (dx > 0) bot.scaleX = 1;
                const moveDist = bot.speed * dt * (bot.isFleeing ? 1.25 : 0.8);
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

        if (bot.role === 'evil Dog') {
            if (bot.killCooldown > 0) bot.killCooldown -= dt;
            if (bot.escapeTimer > 0) bot.escapeTimer -= dt;
            if (bot.justKilled && bot.escapeTimer <= 0) bot.justKilled = false;

            const maxWitnessDist = sabotageSystem.activeSabotage === 'lights' ? 200 : 280;

            const checkIsolation = (catPlayer) => {
                for (const witness of players) {
                    if (witness.id === bot.id || witness.id === catPlayer.id || witness.isDead || witness.role === 'evil Dog') continue;
                    const d = Math.hypot(catPlayer.x - witness.x, catPlayer.y - witness.y);
                    if (d <= maxWitnessDist && isLineOfSightClear(catPlayer.x, catPlayer.y, witness.x, witness.y)) {
                        return false;
                    }
                }
                return true;
            };

            // 1. ESCAPE VENTING Behavior: If the dog just killed someone, run to a vent and escape!
            if (bot.justKilled && !bot.isLocalPlayer) {
                const nearestVent = VENTS.find(v => Math.hypot(bot.x - v.x, bot.y - v.y) <= 400);
                if (nearestVent) {
                    const distToVent = Math.hypot(bot.x - nearestVent.x, bot.y - nearestVent.y);
                    if (distToVent <= 80) {
                        const connectedVent = VENTS.find(v => v.id === nearestVent.connectId);
                        if (connectedVent) {
                            bot.x = connectedVent.x;
                            bot.y = connectedVent.y;
                            soundManager.playVentWhoosh();
                            if (window.gameInstance) {
                                window.gameInstance.checkVentWitnesses(bot);
                            }
                        }
                        bot.justKilled = false;
                        bot.currentPath = null;
                    } else {
                        bot.currentPath = [{ x: nearestVent.x, y: nearestVent.y }];
                    }
                } else {
                    bot.justKilled = false;
                }
            }

            // 2. Target Selection (only chase isolated cats)
            if (!bot.justKilled && bot.killCooldown <= 0 && !bot.isLocalPlayer) {
                let targetCat = null;
                let minDist = 350;
                for (const p of players) {
                    if (!p.isDead && p.id !== bot.id && p.role !== 'evil Dog') {
                        if (checkIsolation(p)) {
                            const d = Math.hypot(bot.x - p.x, bot.y - p.y);
                            if (d < minDist) { minDist = d; targetCat = p; }
                        }
                    }
                }
                if (targetCat) {
                    bot.currentPath = [{ x: targetCat.x, y: targetCat.y }];
                }
            }

            // 3. Smart Killing (only kill if isolated and close)
            if (bot.killCooldown <= 0) {
                for (const target of players) {
                    if (!target.isDead && target.id !== bot.id && target.role !== 'evil Dog' && Math.hypot(bot.x - target.x, bot.y - target.y) <= 80) {
                        if (checkIsolation(target)) {
                            target.isDead = true;
                            bot.killCooldown = 30;
                            bot.justKilled = true;
                            bot.escapeTimer = 5.0;
                            soundManager.playElimination();
                            if (window.gameInstance) {
                                window.gameInstance.globalKillTimer = 15;
                                window.gameInstance.recordKillWitnesses(bot, target);
                                window.gameInstance.reassignDeadCatTasks(target);
                            }
                            break;
                        }
                    }
                }
            }

            if (!bot.isLocalPlayer && !bot.justKilled && sabotageSystem.cooldown <= 0 && !sabotageSystem.activeSabotage) {
                const sabTypes = ['lights', 'engine'];
                const picked = sabTypes[Math.floor(Math.random() * sabTypes.length)];
                sabotageSystem.triggerSabotage(picked);
            }
        }
    }
}
