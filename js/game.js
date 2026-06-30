// Main Game Orchestration for Cat Crew

import { soundManager } from './sounds.js';
import { Player } from './player.js';
import { MapRenderer } from './map.js';
import { MAP_BOUNDS, ROOMS, loadMap, getNearbyLadder } from './rooms.js';
import { VentSystem } from './vents.js';
import { SabotageSystem } from './sabotage.js';
import { TaskManager } from './tasks.js';
import { AIController } from './ai.js';
import { MeetingManager } from './meeting.js';
import { UIManager } from './ui.js';

class Game {
    constructor() {
        this.canvas = document.getElementById('game-canvas');
        this.ctx = this.canvas.getContext('2d');
        
        this.state = 'MENU'; // MENU | ROLE_REVEAL | PLAYING | MEETING | EJECT | GAME_OVER
        this.menuColorIndex = 0;
        this.menuHatIndex = 1;
        this.selectedMap = 'whisker_station';
        this.catAmount = 10;

        this.mapRenderer = new MapRenderer();
        this.sabotageSystem = new SabotageSystem();
        this.meetingManager = new MeetingManager();
        this.uiManager = new UIManager(this);

        this.players = [];
        this.localPlayer = null;
        this.keysPressed = {};
        this.activeTask = null;

        this.setupWindow();
        this.setupKeyListeners();
        this.startLoop();
    }

    setupWindow() {
        const resize = () => {
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;
        };
        window.addEventListener('resize', resize);
        resize();
    }

    setupKeyListeners() {
        window.addEventListener('keydown', (e) => {
            soundManager.init();
            this.keysPressed[e.code] = true;

            if (this.state === 'PLAYING') {
                if (e.code === 'KeyE' || e.code === 'Space') {
                    this.handleUseAction();
                } else if (e.code === 'KeyR') {
                    this.handleReportAction();
                } else if (e.code === 'KeyQ' && this.localPlayer?.role === 'evil Dog') {
                    this.handleKillAction();
                }
            }
        });

        window.addEventListener('keyup', (e) => {
            this.keysPressed[e.code] = false;
        });
    }

    startNewGame(playerName) {
        soundManager.init();
        loadMap(this.selectedMap);
        
        const roles = ['evil Dog', 'Captain'];
        
        // Medics: 2 if cats >= 25, otherwise 1
        const medicCount = this.catAmount >= 25 ? 2 : 1;
        for (let i = 0; i < medicCount; i++) roles.push('Medic');
        
        // Engineers: scale up to 5 max
        let engCount = 1;
        if (this.catAmount >= 30) engCount = 5;
        else if (this.catAmount >= 25) engCount = 4;
        else if (this.catAmount >= 20) engCount = 3;
        else if (this.catAmount >= 15) engCount = 2;
        for (let i = 0; i < engCount; i++) roles.push('Engineer');
        
        // Guards: scale up to 6 max
        let guardCount = 1;
        if (this.catAmount >= 28) guardCount = 6;
        else if (this.catAmount >= 24) guardCount = 5;
        else if (this.catAmount >= 20) guardCount = 4;
        else if (this.catAmount >= 16) guardCount = 3;
        else if (this.catAmount >= 12) guardCount = 2;
        for (let i = 0; i < guardCount; i++) roles.push('Guard');
        
        // Fill remaining with Citizens
        while (roles.length < this.catAmount) {
            roles.push('Citizen');
        }

        const shuffledRoles = [...roles].sort(() => 0.5 - Math.random());

        const botNames = [
            'Barnaby', 'Cleo', 'Felix', 'Mitten', 'Oliver', 'Shadow', 'Smokey', 'Luna', 'Garfield',
            'Chloe', 'Bella', 'Lucy', 'Lily', 'Sophie', 'Lola', 'Zoe', 'Kitty', 'Princess',
            'Simba', 'Milo', 'Tiger', 'Oreo', 'Jack', 'Charlie', 'Rusty', 'Toby', 'Gizmo', 'Boots',
            'Patch', 'Ziggy', 'Coco', 'Pepper', 'Oscar', 'Buster', 'Salem',
            'Lucky', 'Merlin', 'Ginger', 'Max', 'Sammy', 'Peanut', 'Sassy', 'Cookie'
        ];
        const shuffledNames = [...botNames].sort(() => 0.5 - Math.random());

        this.players = [];
        
        // Create configured amount of players (1 human + AI bots)
        for (let i = 0; i < this.catAmount; i++) {
            const isLocal = i === 0;
            const name = isLocal ? playerName : shuffledNames[i - 1];
            const colorIdx = isLocal ? this.menuColorIndex : (i * 2 + 1) % 8;
            const hatIdx = isLocal ? this.menuHatIndex : (i + 2) % 8;
            const role = shuffledRoles[i];

            const p = new Player(i, name, colorIdx, hatIdx, role, isLocal);
            p.tasks = TaskManager.generateTaskList();

            // Spawn inside Bridge or central corridor
            if (this.selectedMap === 'catnip_observatory') {
                p.x = 1320 + (i % 5) * 40;
            } else {
                p.x = 1720 + (i % 5) * 40;
            }
            p.y = 250 + Math.floor(i / 5) * 40;

            this.players.push(p);
            if (isLocal) this.localPlayer = p;
        }

        this.sabotageSystem = new SabotageSystem();
        const sabBanner = document.getElementById('sabotage-banner');
        if (sabBanner) sabBanner.classList.add('hidden');
        this.showRoleReveal();
    }

    showRoleReveal() {
        this.state = 'ROLE_REVEAL';
        this.uiManager.showScreen('role-screen');

        const roleIcons = { Citizen: '🐱', Captain: '⭐', Guard: '🛡️', Engineer: '🔧', Medic: '🏥', 'evil Dog': '🐶' };
        const roleDescs = {
            Citizen: 'Perform tasks across rooms and unmask the sneaky evil Dog!',
            Captain: 'Command the ship! You complete tasks 35% faster than standard cats.',
            Guard: 'Stay vigilant! You have 25% larger vision and see much better when lights go out.',
            Engineer: 'Use ship ventilation shafts to traverse rooms instantly.',
            Medic: 'Heal the crew! You can revive fallen cats up to 2 times per match.',
            'evil Dog': 'Eliminate cats, sabotage systems, and do not get caught!'
        };

        document.getElementById('role-icon').innerText = roleIcons[this.localPlayer.role];
        document.getElementById('role-title').innerText = `YOUR ROLE: ${this.localPlayer.role.toUpperCase()}`;
        document.getElementById('role-description').innerText = roleDescs[this.localPlayer.role];

        const teamList = document.getElementById('role-team-list');
        teamList.innerHTML = '';
        if (this.localPlayer.role === 'evil Dog') {
            teamList.innerText = '⚠️ You are the solitary evil Dog impostor!';
        } else {
            teamList.innerText = '🐾 Work with your fellow crew cats to finish all tasks!';
        }
    }

    handleUseAction() {
        if (this.localPlayer.isDead) return;

        // Check ladder transition
        if (this.selectedMap === 'catnip_observatory') {
            const ladder = getNearbyLadder(this.localPlayer.x, this.localPlayer.y, 75);
            if (ladder) {
                this.localPlayer.x = ladder.x;
                this.localPlayer.y = ladder.y;
                soundManager.playFootstep();
                return;
            }
        }

        // 1. Check Emergency Meeting Button in Bridge
        const bridge = ROOMS.find(r => r.id === 'bridge');
        const distToButton = Math.hypot(this.localPlayer.x - bridge.buttonX, this.localPlayer.y - bridge.buttonY);
        if (distToButton <= 45) {
            this.triggerMeeting(this.localPlayer, null);
            return;
        }

        // 2. Check Sabotage Fix Panels
        if (this.sabotageSystem.activeSabotage === 'lights') {
            const el = ROOMS.find(r => r.id === 'electrical');
            if (el && Math.hypot(this.localPlayer.x - el.lightsFixX, this.localPlayer.y - el.lightsFixY) <= 95) {
                this.sabotageSystem.fixSabotage();
                soundManager.playTaskComplete();
                return;
            }
        }

        if (this.sabotageSystem.activeSabotage === 'comms') {
            const cm = ROOMS.find(r => r.id === 'comms');
            if (cm && Math.hypot(this.localPlayer.x - cm.commsFixX, this.localPlayer.y - cm.commsFixY) <= 95) {
                const commsFixTask = { room: 'Communications', name: '📡 SYNC RADIO FREQUENCY', type: 'slider' };
                this.uiManager.showScreen('task-modal');
                TaskManager.renderTaskMinigame(commsFixTask, this.localPlayer, () => {
                    this.sabotageSystem.fixSabotage();
                    this.uiManager.hideScreen('task-modal');
                });
                return;
            }
        }

        if (this.sabotageSystem.activeSabotage === 'engine') {
            const ye = ROOMS.find(r => r.id === 'yarn_engine');
            if (Math.hypot(this.localPlayer.x - ye.engineFixX, this.localPlayer.y - ye.engineFixY) <= 95) {
                const engineFixTask = { room: 'Yarn Engine', name: 'OVERLOAD REPAIR', type: 'rapid_click' };
                this.uiManager.showScreen('task-modal');
                TaskManager.renderTaskMinigame(engineFixTask, this.localPlayer, () => {
                    this.sabotageSystem.fixSabotage();
                    this.uiManager.hideScreen('task-modal');
                });
                return;
            }
        }

        // 3. Check Tasks
        for (const t of this.localPlayer.tasks) {
            if (t.completed) continue;
            const roomObj = ROOMS.find(r => r.name.includes(t.room));
            if (!roomObj) continue;
            const baseTaskId = t.id.split('_reassigned_')[0];
            const taskLoc = roomObj.tasks.find(tk => tk.id === baseTaskId);
            if (taskLoc) {
                const dist = Math.hypot(this.localPlayer.x - taskLoc.x, this.localPlayer.y - taskLoc.y);
                if (dist <= 60) {
                    this.activeTask = t;
                    this.uiManager.showScreen('task-modal');
                    TaskManager.renderTaskMinigame(t, this.localPlayer, () => {
                        this.uiManager.hideScreen('task-modal');
                        this.activeTask = null;
                        this.checkWinConditions();
                    });
                    return;
                }
            }
        }

        // 4. Check Vent
        if (this.localPlayer.role === 'evil Dog' || this.localPlayer.role === 'Engineer') {
            this.handleVentAction();
        }
    }

    handleReportAction() {
        if (this.localPlayer.isDead) return;

        // Find nearby body
        for (const p of this.players) {
            if (p.isDead) {
                const dist = Math.hypot(this.localPlayer.x - p.x, this.localPlayer.y - p.y);
                if (dist <= 80) {
                    this.triggerMeeting(this.localPlayer, p);
                    return;
                }
            }
        }
    }

    handleKillAction() {
        if (this.localPlayer.role !== 'evil Dog' || this.localPlayer.isDead || this.localPlayer.killCooldown > 0 || this.globalKillTimer > 0) return;
        for (const target of this.players) {
            if (!target.isDead && target.id !== this.localPlayer.id && Math.hypot(this.localPlayer.x - target.x, this.localPlayer.y - target.y) <= 80) {
                target.isDead = true;
                this.globalKillTimer = 15;
                this.recordKillWitnesses(this.localPlayer, target);
                this.reassignDeadCatTasks(target);
                this.localPlayer.killCooldown = 30;
                soundManager.playElimination();
                this.checkWinConditions();
                break;
            }
        }
    }

    recordKillWitnesses(killer, victim) {
        if (!killer || !victim) return;
        
        let feeds = [];
        let camX = 380, camY = 750;
        
        if (this.selectedMap === 'catnip_observatory') {
            feeds = [
                { bounds: { xMin: 200, xMax: 650, yMin: 150, yMax: 500 } }, // GREENHOUSE
                { bounds: { xMin: 2150, xMax: 2600, yMin: 150, yMax: 500 } }, // LASER WEAPONS
                { bounds: { xMin: 1150, xMax: 1650, yMin: 800, yMax: 1150 } }, // SECURITY
                { bounds: { xMin: 2150, xMax: 2600, yMin: 800, yMax: 1150 } }  // ELECTRICAL
            ];
            camX = 1380; camY = 950;
        } else {
            feeds = [
                { bounds: { xMin: 1550, xMax: 2050, yMin: 150, yMax: 470 } }, // BRIDGE
                { bounds: { xMin: 2350, xMax: 2800, yMin: 700, yMax: 1050 } }, // ELECTRICAL
                { bounds: { xMin: 2300, xMax: 2750, yMin: 250, yMax: 570 } }, // WEAPONS
                { bounds: { xMin: 1740, xMax: 1860, yMin: 1150, yMax: 1500 } }  // HALLWAY
            ];
        }

        const isJammed = this.sabotageSystem && this.sabotageSystem.activeSabotage === 'comms';
        const onCamera = !isJammed && feeds.some(f => 
            victim.x >= f.bounds.xMin && victim.x <= f.bounds.xMax && 
            victim.y >= f.bounds.yMin && victim.y <= f.bounds.yMax
        );

        this.players.forEach(p => {
            if (!p.isDead && p.role !== 'evil Dog') {
                const distToKill = Math.hypot(p.x - victim.x, p.y - victim.y);
                const isWatchingCams = Math.hypot(p.x - camX, p.y - camY) <= 90;
                
                if (distToKill <= 280) {
                    p.witnessedKillerId = killer.id;
                    p.witnessedKillerName = killer.name;
                    p.witnessedVictimName = victim.name;
                    p.witnessedViaCams = false;
                } else if (onCamera && isWatchingCams) {
                    p.witnessedKillerId = killer.id;
                    p.witnessedKillerName = killer.name;
                    p.witnessedVictimName = victim.name;
                    p.witnessedViaCams = true;
                    
                    if (!p.isLocalPlayer) {
                        p.taskTimer = 0;
                        p.currentTaskToComplete = null;
                        if (this.selectedMap === 'catnip_observatory') {
                            p.currentPath = [
                                { x: 1400, y: 975 },
                                { x: 1400, y: 350, isEmergencyButtonTrigger: true }
                            ];
                        } else {
                            p.currentPath = [
                                { x: 650, y: 875 },
                                { x: 1800, y: 875 },
                                { x: 1800, y: 470 },
                                { x: 1800, y: 280, isEmergencyButtonTrigger: true }
                            ];
                        }
                    }
                }
            }
        });
    }

    handleReviveAction() {
        if (this.localPlayer.role !== 'Medic' || this.localPlayer.isDead || this.localPlayer.reviveUses <= 0) return;

        for (const p of this.players) {
            if (this.localPlayer.canRevive(p)) {
                p.isDead = false;
                this.localPlayer.reviveUses -= 1;
                soundManager.playTaskComplete();
                break;
            }
        }
    }

    handleVentAction() {
        if (this.localPlayer.role !== 'evil Dog' && this.localPlayer.role !== 'Engineer') return;
        if (this.localPlayer.isDead) return;
        const vent = VentSystem.getNearbyVent(this.localPlayer.x, this.localPlayer.y);
        if (vent) {
            soundManager.playVentWhoosh();
            const targetVent = VentSystem.getVentById(vent.connectId);
            if (targetVent) {
                this.localPlayer.x = targetVent.x;
                this.localPlayer.y = targetVent.y;
                this.checkVentWitnesses(this.localPlayer);
            }
        }
    }

    checkVentWitnesses(ventingPlayer) {
        this.players.forEach(p => {
            if (!p.isDead && !p.isLocalPlayer && p.role !== 'evil Dog' && p.id !== ventingPlayer.id) {
                const sameFloor = (p.y >= 2800) === (ventingPlayer.y >= 2800);
                if (sameFloor && Math.hypot(p.x - ventingPlayer.x, p.y - ventingPlayer.y) <= 280) {
                    if (window.isLineOfSightClear && window.isLineOfSightClear(p.x, p.y, ventingPlayer.x, ventingPlayer.y)) {
                        if (!p.suspicionLevels) p.suspicionLevels = {};
                        p.suspicionLevels[ventingPlayer.id] = 100;
                    }
                }
            }
        });
    }

    handleSabotageAction() {
        if (this.localPlayer.role === 'evil Dog' && !this.localPlayer.isDead && this.sabotageSystem.cooldown <= 0) {
            this.uiManager.showScreen('sabotage-modal');
        }
    }

    triggerSabotage(type) {
        this.sabotageSystem.triggerSabotage(type);
    }

    triggerMeeting(reporter, bodyPlayer) {
        if (this.sabotageSystem) {
            this.sabotageSystem.fixSabotage();
        }
        const sabBanner = document.getElementById('sabotage-banner');
        if (sabBanner) sabBanner.classList.add('hidden');

        this.state = 'MEETING';
        this.uiManager.showScreen('meeting-screen');
        // Teleport all players to the Bridge meeting table area
        this.players.forEach((p, idx) => {
            if (this.selectedMap === 'catnip_observatory') {
                p.x = 1320 + (idx % 5) * 40;
            } else {
                p.x = 1720 + (idx % 5) * 40;
            }
            p.y = 250 + Math.floor(idx / 5) * 40;
            p.inVent = false;
            p.currentVentId = null;
        });
        if (this.localPlayer) {
            this.mapRenderer.cameraX = this.localPlayer.x;
            this.mapRenderer.cameraY = this.localPlayer.y;
        }
        this.meetingManager.startMeeting(reporter, bodyPlayer, this.players, (ejectedPlayer, isTie, isSkipped) => {
            this.showEjectionScreen(ejectedPlayer, isTie, isSkipped);
        });
    }

    showEjectionScreen(ejectedPlayer, isTie, isSkipped) {
        this.state = 'EJECT';
        this.uiManager.showScreen('eject-screen');

        const textEl = document.getElementById('eject-result-text');
        const remEl = document.getElementById('eject-remaining-text');

        if (isTie) {
            textEl.innerText = 'No one was ejected. (Tie vote)';
        } else if (isSkipped || !ejectedPlayer) {
            textEl.innerText = 'No one was ejected. (Skipped vote)';
        } else {
            textEl.innerText = `${ejectedPlayer.name} was ${ejectedPlayer.role === 'evil Dog' ? 'The evil Dog!' : 'not The evil Dog.'}`;
        }

        const remainingDogs = this.players.filter(p => !p.isDead && p.role === 'evil Dog').length;
        remEl.innerText = `${remainingDogs} evil Dog impostor remains.`;
    }

    reassignDeadCatTasks(deadPlayer) {
        if (!deadPlayer || deadPlayer.role === 'evil Dog') return;
        const uncompleted = (deadPlayer.tasks || []).filter(t => !t.completed);
        if (uncompleted.length === 0) return;

        const livingCats = this.players.filter(p => !p.isDead && p.role !== 'evil Dog');
        if (livingCats.length > 0) {
            uncompleted.forEach((t, i) => {
                const assignee = livingCats[i % livingCats.length];
                assignee.tasks.push({ ...t, id: `${t.id}_reassigned_${Date.now()}_${i}` });
            });
        }
        deadPlayer.tasks = deadPlayer.tasks.filter(t => t.completed);
    }

    checkWinConditions() {
        if (this.state === 'GAME_OVER' || this.state === 'MENU' || (this.gameTimer || 0) < 5) return;
        const aliveCats = this.players.filter(p => !p.isDead && p.role !== 'evil Dog').length;
        const aliveDogs = this.players.filter(p => !p.isDead && p.role === 'evil Dog').length;
        
        const allCatTasks = [];
        this.players.forEach(p => { if (p.role !== 'evil Dog' && p.tasks) allCatTasks.push(...p.tasks); });
        const allTasksDone = allCatTasks.length > 0 && allCatTasks.every(t => t.completed);

        if (aliveDogs === 0) this.endGame('VICTORY!', 'The evil Dog impostor was ejected!');
        else if (aliveDogs >= aliveCats && aliveCats > 0) this.endGame('DEFEAT!', 'The evil Dog overran the spaceship!');
        else if (allTasksDone) this.endGame('VICTORY!', 'All ship tasks have been completed!');
    }

    endGame(title, reason) {
        this.state = 'GAME_OVER';
        this.uiManager.showScreen('gameover-screen');

        document.getElementById('gameover-title').innerText = title;
        document.getElementById('gameover-reason').innerText = reason;

        if (title.includes('VICTORY')) {
            soundManager.playVictory();
        } else {
            soundManager.playDefeat();
        }

        const list = document.getElementById('gameover-roles-list');
        list.innerHTML = '';
        this.players.forEach(p => {
            const div = document.createElement('div');
            div.style.cssText = 'padding:4px 0; color:#d1d5db; font-size:0.9rem;';
            div.innerText = `${p.name}: ${p.role} ${p.isDead ? (p.isEjected ? '(Ejected)' : '(Eliminated)') : '(Surviving)'}`;
            list.appendChild(div);
        });
    }

    startLoop() {
        let lastTime = performance.now();
        const loop = (now) => {
            const dt = Math.min((now - lastTime) / 1000, 0.1);
            lastTime = now;

            this.update(dt);
            this.render();

            requestAnimationFrame(loop);
        };
        requestAnimationFrame(loop);
    }

    update(dt) {
        if (this.state === 'PLAYING') {
            // Update local player
            this.localPlayer.update(dt, this.keysPressed, MAP_BOUNDS);
            this.mapRenderer.updateCamera(this.localPlayer.x, this.localPlayer.y, this.canvas.width, this.canvas.height);

            // Auto-close task modal if player walks too far from the task location (105px)
            if (this.activeTask) {
                if (this.activeTask.id !== 'monitor_cams_persistent') {
                    const roomObj = ROOMS.find(r => r.name.includes(this.activeTask.room));
                    if (roomObj) {
                        const baseTaskId = this.activeTask.id.split('_reassigned_')[0];
                        const taskLoc = roomObj.tasks.find(tk => tk.id === baseTaskId);
                        if (taskLoc) {
                            const dist = Math.hypot(this.localPlayer.x - taskLoc.x, this.localPlayer.y - taskLoc.y);
                            if (dist > 105) {
                                if (this.activeTaskCleanup) {
                                    this.activeTaskCleanup();
                                    this.activeTaskCleanup = null;
                                }
                                this.uiManager.hideScreen('task-modal');
                                this.activeTask = null;
                            }
                        }
                    }
                } else {
                    const camX = this.selectedMap === 'catnip_observatory' ? 1380 : 380;
                    const camY = this.selectedMap === 'catnip_observatory' ? 950 : 750;
                    const dist = Math.hypot(this.localPlayer.x - camX, this.localPlayer.y - camY);
                    if (dist > 105) {
                        if (this.activeTaskCleanup) {
                            this.activeTaskCleanup();
                            this.activeTaskCleanup = null;
                        }
                        this.uiManager.hideScreen('task-modal');
                        this.activeTask = null;
                    }
                }
            }

            // Update Sabotage System
            const sabResult = this.sabotageSystem.update(dt);
            if (sabResult === 'ENGINE_MELTDOWN') {
                this.endGame('DEFEAT!', 'Yarn Engine exploded!');
            }

            // Update Bots
            this.players.forEach(p => {
                if (!p.isLocalPlayer) {
                    AIController.updateBot(p, dt, this.players, this.sabotageSystem, (bot, body) => {
                        this.triggerMeeting(bot, body);
                    });
                }
            });

            // Update UI HUD
            this.uiManager.updateHUD(this.localPlayer, this.players, this.localPlayer.tasks, this.sabotageSystem);
        } else if (this.state === 'MEETING') {
            this.meetingManager.update(dt, this.players);
        }
    }

    render() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        if (this.state === 'PLAYING' || this.state === 'MEETING' || this.state === 'EJECT') {
            this.mapRenderer.render(
                this.ctx,
                this.canvas.width,
                this.canvas.height,
                this.localPlayer,
                this.players,
                this.sabotageSystem
            );

            // Minimap
            const miniCanvas = document.getElementById('minimap-canvas');
            if (miniCanvas) {
                this.mapRenderer.renderMinimap(miniCanvas, this.localPlayer, this.players);
            }
        }
    }
}

// Instantiate and start game when loaded
window.addEventListener('DOMContentLoaded', () => {
    new Game();
});
