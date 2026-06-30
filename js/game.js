// Main Game Orchestration for Cat Crew

import { soundManager } from './sounds.js';
import { Player } from './player.js';
import { MapRenderer } from './map.js';
import { MAP_BOUNDS, ROOMS, CORRIDORS, loadMap, getNearbyLadder } from './rooms.js';
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
        this.defensiveProtocolTimer = 0;
        this.defensiveProtocolActive = false;
        this.invaders = [];

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
                } else if (e.code === 'KeyP') {
                    this.toggleDevMenu();
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
            p.loadedTorpedoes = 1; // Start with 1 loaded torpedo (10 shots) initially!

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

        // Check reloading at Workshop first!
        const isObs = this.selectedMap === 'catnip_observatory';
        const wsX = isObs ? 2370 : 2570;
        const wsY = isObs ? 4720 : 1840;
        const nearWorkshop = Math.hypot(this.localPlayer.x - wsX, this.localPlayer.y - wsY) <= 95;
        if (this.localPlayer.hasGun && this.localPlayer.gunAmmo < 5 && nearWorkshop) {
            this.localPlayer.gunAmmo = 5;
            soundManager.playTaskComplete();
            const banner = document.createElement('div');
            banner.style.cssText = 'position:fixed; top:20px; left:50%; transform:translateX(-50%); background:#2ed573; color:white; padding:12px 24px; border-radius:10px; font-family:var(--font-heading); font-size:1.2rem; font-weight:bold; z-index:9999; box-shadow:0 8px 24px rgba(0,0,0,0.5); border:2px solid #55efc4;';
            banner.innerText = '🔋 GUN FULLY RELOADED! (5/5 Ammo)';
            document.body.appendChild(banner);
            setTimeout(() => banner.remove(), 2500);
            return;
        }

        // Check if player has gun and ammo to shoot at the closest nearby invader
        if (this.localPlayer.hasGun && this.localPlayer.gunAmmo > 0 && this.invaders) {
            const nearbyInvaders = this.invaders.filter(inv => Math.hypot(this.localPlayer.x - inv.x, this.localPlayer.y - inv.y) <= 300);
            if (nearbyInvaders.length > 0) {
                nearbyInvaders.sort((a, b) => Math.hypot(this.localPlayer.x - a.x, this.localPlayer.y - a.y) - Math.hypot(this.localPlayer.x - b.x, this.localPlayer.y - b.y));
                const nearbyInvader = nearbyInvaders[0];
                this.localPlayer.gunAmmo--;
                soundManager.playVoteClick(); // Shoot sound effect!
                
                // Add laser beam effect
                this.activeLaserLines = this.activeLaserLines || [];
                this.activeLaserLines.push({
                    fromX: this.localPlayer.x,
                    fromY: this.localPlayer.y,
                    toX: nearbyInvader.x,
                    toY: nearbyInvader.y,
                    timer: 0.15
                });

                this.killInvader(nearbyInvader.id, this.localPlayer);
                
                if (this.localPlayer.gunAmmo === 0) {
                    const banner = document.createElement('div');
                    banner.style.cssText = 'position:fixed; top:20px; left:50%; transform:translateX(-50%); background:#ff7675; color:white; padding:12px 24px; border-radius:10px; font-family:var(--font-heading); font-size:1.2rem; font-weight:bold; z-index:9999; box-shadow:0 8px 24px rgba(0,0,0,0.5); border:2px solid #d63031;';
                    banner.innerText = '⚠️ OUT OF AMMO! Go to the Workshop to reload.';
                    document.body.appendChild(banner);
                    setTimeout(() => banner.remove(), 3000);
                }
                return;
            }
        }

        // Check if player is evil Dog and wants to sabotage defensive tasks
        if (this.localPlayer.role === 'evil Dog' && this.defensiveProtocolActive) {
            let nearbyDefTask = null;
            ROOMS.forEach(room => {
                const found = room.tasks.find(t => t.id.startsWith('def_') && Math.hypot(this.localPlayer.x - t.x, this.localPlayer.y - t.y) <= 95);
                if (found) nearbyDefTask = found;
            });
            if (nearbyDefTask) {
                this.players.forEach(p => {
                    if (p.tasks) {
                        const t = p.tasks.find(tk => tk.id === nearbyDefTask.id);
                        if (t) {
                            t.completed = false;
                            t.progress = 0;
                        }
                    }
                });
                soundManager.playVoteClick();
                const banner = document.createElement('div');
                banner.style.cssText = 'position:fixed; top:20px; left:50%; transform:translateX(-50%); background:#d63031; color:white; padding:12px 24px; border-radius:10px; font-family:var(--font-heading); font-size:1.2rem; font-weight:bold; z-index:9999; box-shadow:0 8px 24px rgba(0,0,0,0.5); border:2px solid #ff7675;';
                banner.innerText = `⚠️ SABOTAGED: ${nearbyDefTask.name} progress reset!`;
                document.body.appendChild(banner);
                setTimeout(() => banner.remove(), 2500);
                return;
            }
        }

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
            if (this.defensiveProtocolActive) {
                // Show floating warning notification
                const banner = document.createElement('div');
                banner.style.cssText = 'position:fixed; top:20px; left:50%; transform:translateX(-50%); background:#d63031; color:white; padding:12px 24px; border-radius:10px; font-family:var(--font-heading); font-size:1.2rem; font-weight:bold; z-index:9999; box-shadow:0 8px 24px rgba(0,0,0,0.5); border:2px solid #ff7675;';
                banner.innerText = '🚨 BUTTON LOCKED DURING DEFENSIVE PROTOCOL! 🚨';
                document.body.appendChild(banner);
                setTimeout(() => banner.remove(), 2500);
                return;
            }
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
            if (t.completed && !(this.defensiveProtocolActive && (t.id === 'def_attack_ships' || t.id === 'clear_asteroids'))) continue;
            const roomObj = ROOMS.find(r => r.name.includes(t.room));
            if (!roomObj) continue;
            const baseTaskId = t.id.split('_reassigned_')[0];
            const taskLoc = roomObj.tasks.find(tk => tk.id === baseTaskId);
            if (taskLoc) {
                const dist = Math.hypot(this.localPlayer.x - taskLoc.x, this.localPlayer.y - taskLoc.y);
                if (dist <= 60) {
                    if ((baseTaskId === 'upload_data' || baseTaskId === 'load_torpedoes') && t.locked) {
                        continue;
                    }
                    this.activeTask = t;
                    this.uiManager.showScreen('task-modal');
                    TaskManager.renderTaskMinigame(t, this.localPlayer, () => {
                        this.uiManager.hideScreen('task-modal');
                        this.activeTask = null;
                        
                        if (t.id === 'def_get_weapons') {
                            this.localPlayer.hasGun = true;
                            this.localPlayer.gunAmmo = 5;
                        }
                        if (t.id === 'post_def_heal') {
                            this.localPlayer.health = 3;
                            this.localPlayer.tasks = this.localPlayer.tasks.filter(tk => tk.id !== 'post_def_heal');
                            const medRoom = ROOMS.find(r => r.id === 'medical');
                            if (medRoom) medRoom.tasks = medRoom.tasks.filter(tk => tk.id !== 'post_def_heal');
                        }
                        if (t.id === 'pickup_torpedo') {
                            this.localPlayer.loadedTorpedoes = (this.localPlayer.loadedTorpedoes || 0) + 1;
                            this.localPlayer.tasks.forEach(tk => {
                                if (tk.id === 'load_torpedoes') tk.locked = false;
                            });
                        }
                        if (t.id === 'pickup_torpedo_reload') {
                            this.localPlayer.loadedTorpedoes = (this.localPlayer.loadedTorpedoes || 0) + 1;
                            this.localPlayer.tasks = this.localPlayer.tasks.filter(tk => tk.id !== 'pickup_torpedo_reload');
                            const workshopRoom = ROOMS.find(r => r.id === 'workshop');
                            if (workshopRoom) workshopRoom.tasks = workshopRoom.tasks.filter(tk => tk.id !== 'pickup_torpedo_reload');
                        }
                        if (t.id.startsWith('def_')) {
                            this.checkDefensiveProtocolStatus();
                        }

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

    toggleDevMenu() {
        let menu = document.getElementById('dev-debug-menu');
        if (menu) {
            menu.remove();
            return;
        }

        menu = document.createElement('div');
        menu.id = 'dev-debug-menu';
        menu.style.cssText = 'position:fixed; top:20px; right:20px; background:rgba(45, 52, 54, 0.95); border:3px solid #0984e3; border-radius:12px; padding:16px; width:260px; font-family:var(--font-heading); color:white; z-index:99999; box-shadow:0 12px 30px rgba(0,0,0,0.6); display:flex; flex-direction:column; gap:10px;';
        
        const title = document.createElement('h3');
        title.innerText = '🛠️ Developer Debug Menu';
        title.style.cssText = 'margin:0 0 6px 0; font-size:1.1rem; text-align:center; border-bottom:1.5px solid rgba(255,255,255,0.15); padding-bottom:6px; color:#74b9ff;';
        menu.appendChild(title);

        const createBtn = (label, color, onClick) => {
            const btn = document.createElement('button');
            btn.innerText = label;
            btn.style.cssText = `background:${color}; color:white; border:none; padding:8px 12px; border-radius:6px; font-size:0.9rem; font-weight:bold; cursor:pointer; width:100%; text-align:center; transition:filter 0.15s;`;
            btn.addEventListener('mouseover', () => btn.style.filter = 'brightness(1.15)');
            btn.addEventListener('mouseout', () => btn.style.filter = 'none');
            btn.addEventListener('click', onClick);
            menu.appendChild(btn);
        };

        createBtn('🚨 Trigger Defensive Protocol', '#6c5ce7', () => {
            if (!this.defensiveProtocolActive) {
                this.triggerDefensiveProtocol();
            }
        });

        createBtn('💡 Sabotage Lights', '#fdcb6e', () => {
            this.sabotageSystem.triggerSabotage('lights');
        });

        createBtn('⚙️ Sabotage Yarn Engine', '#d63031', () => {
            this.sabotageSystem.triggerSabotage('engine');
        });

        createBtn('📡 Sabotage Communications', '#0984e3', () => {
            this.sabotageSystem.triggerSabotage('comms');
        });

        createBtn('❤️ Heal All Cats (3 HP)', '#2ed573', () => {
            this.localPlayer.health = 3;
            this.players.forEach(p => p.health = 3);
            soundManager.playTaskComplete();
            
            // Auto remove healing task if present
            this.localPlayer.tasks = this.localPlayer.tasks.filter(tk => tk.id !== 'post_def_heal');
            this.players.forEach(p => {
                if (p.tasks) p.tasks = p.tasks.filter(tk => tk.id !== 'post_def_heal');
            });
            ROOMS.forEach(r => r.tasks = r.tasks.filter(tk => tk.id !== 'post_def_heal'));
        });

        createBtn('☠️ Kill Nearest Crew Cat', '#ff7675', () => {
            const nearest = this.players.filter(p => !p.isLocalPlayer && !p.isDead && p.role !== 'evil Dog')
                .sort((a, b) => Math.hypot(a.x - this.localPlayer.x, a.y - this.localPlayer.y) - Math.hypot(b.x - this.localPlayer.x, b.y - this.localPlayer.y))[0];
            if (nearest) {
                nearest.isDead = true;
                soundManager.playDefeat();
            }
        });

        createBtn('😇 Revive All Dead Cats', '#10ac84', () => {
            this.players.forEach(p => {
                if (p.isDead) {
                    p.isDead = false;
                    p.isEjected = false;
                    p.bodyCleaned = false;
                    p.health = 3;
                }
            });
            soundManager.playTaskComplete();
        });

        document.body.appendChild(menu);
    }

    triggerMeeting(reporter, bodyPlayer) {
        if (this.defensiveProtocolActive) return;
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
            // Update active laser lines timers
            if (this.activeLaserLines) {
                this.activeLaserLines.forEach(line => line.timer -= dt);
                this.activeLaserLines = this.activeLaserLines.filter(line => line.timer > 0);
            }

            // Update Defensive Protocol Timer
            this.defensiveProtocolTimer += dt;
            if (this.defensiveProtocolTimer >= 20) {
                this.defensiveProtocolTimer = 0;
                if (!this.defensiveProtocolActive && Math.random() < 0.05) {
                    this.triggerDefensiveProtocol();
                }
            }

            // Update Space Invaders
            if (this.defensiveProtocolActive && this.invaders) {
                this.updateSpaceInvaders(dt);
            }

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

            // Draw active gun laser lines
            if (this.activeLaserLines && this.activeLaserLines.length > 0) {
                const camX = this.mapRenderer.cameraX;
                const camY = this.mapRenderer.cameraY;
                const halfW = this.canvas.width / 2;
                const halfH = this.canvas.height / 2;
                this.ctx.lineWidth = 4;
                this.ctx.strokeStyle = '#00cec9'; // Bright cyan laser beam!
                this.activeLaserLines.forEach(line => {
                    const fromX = line.fromX - camX + halfW;
                    const fromY = line.fromY - camY + halfH;
                    const toX = line.toX - camX + halfW;
                    const toY = line.toY - camY + halfH;
                    this.ctx.beginPath();
                    this.ctx.moveTo(fromX, fromY);
                    this.ctx.lineTo(toX, toY);
                    this.ctx.stroke();
                });
            }

            // Minimap
            const miniCanvas = document.getElementById('minimap-canvas');
            if (miniCanvas) {
                this.mapRenderer.renderMinimap(miniCanvas, this.localPlayer, this.players);
            }
        }
    }

    triggerDefensiveProtocol() {
        this.defensiveProtocolActive = true;
        this.invaders = [];
        const shuffledRooms = [...ROOMS].sort(() => 0.5 - Math.random());
        for (let i = 0; i < 3; i++) {
            const room = shuffledRooms[i % shuffledRooms.length];
            const rx = room.x + room.width / 2;
            const ry = room.y + room.height / 2;
            this.invaders.push({
                id: i,
                x: rx,
                y: ry,
                vx: (Math.random() - 0.5) * 80,
                vy: (Math.random() - 0.5) * 80,
                radius: 16
            });
        }
        soundManager.playVictory();
        const emergencyTasks = [
            { id: 'def_repair_shields', name: 'Emergency: Repair Shields', room: 'Shields', type: 'fill_meter', completed: false },
            { id: 'def_attack_ships', name: 'Emergency: Attack Enemy Ships', room: 'Bridge', type: 'shoot_asteroids', completed: false },
            { id: 'def_get_weapons', name: 'Emergency: Obtain Defensive Gun', room: 'Kitchen', type: 'rapid_click', completed: false },
            { id: 'def_reload_torpedoes', name: 'Emergency: Reload Torpedoes', room: 'Weapons', type: 'fill_meter', completed: false }
        ];
        emergencyTasks.forEach(task => {
            if (!this.localPlayer.tasks.some(t => t.id === task.id)) {
                this.localPlayer.tasks.push(task);
            }
            this.players.forEach(p => {
                if (!p.isLocalPlayer && !p.isDead && p.role !== 'evil Dog') {
                    if (!p.tasks.some(t => t.id === task.id)) {
                        p.tasks.push({ ...task });
                    }
                }
            });
        });
        const shieldsRoom = ROOMS.find(r => r.id === 'shields');
        if (shieldsRoom && !shieldsRoom.tasks.some(t => t.id === 'def_repair_shields')) {
            shieldsRoom.tasks.push({ id: 'def_repair_shields', name: 'Emergency: Repair Shields', x: shieldsRoom.x + shieldsRoom.width / 2, y: shieldsRoom.y + shieldsRoom.height / 2 });
        }
        const bridgeRoom = ROOMS.find(r => r.id === 'bridge');
        if (bridgeRoom && !bridgeRoom.tasks.some(t => t.id === 'def_attack_ships')) {
            bridgeRoom.tasks.push({ id: 'def_attack_ships', name: 'Emergency: Attack Enemy Ships', x: bridgeRoom.x + 100, y: bridgeRoom.y + 100 });
        }
        const kitchenRoom = ROOMS.find(r => r.id === 'kitchen');
        if (kitchenRoom && !kitchenRoom.tasks.some(t => t.id === 'def_get_weapons')) {
            kitchenRoom.tasks.push({ id: 'def_get_weapons', name: 'Emergency: Obtain Defensive Gun', x: kitchenRoom.x + kitchenRoom.width / 2, y: kitchenRoom.y + kitchenRoom.height / 2 });
        }
        const weaponsRoom = ROOMS.find(r => r.id === 'weapons');
        if (weaponsRoom && !weaponsRoom.tasks.some(t => t.id === 'def_reload_torpedoes')) {
            weaponsRoom.tasks.push({ id: 'def_reload_torpedoes', name: 'Emergency: Reload Torpedoes', x: weaponsRoom.x + 120, y: weaponsRoom.y + 80 });
        }
    }

    updateSpaceInvaders(dt) {
        const speed = 80;
        
        // Continuous Spawning: every 5.0 seconds, keep spawning invaders (max 5 active)
        this.invaderSpawnTimer = (this.invaderSpawnTimer || 0) + dt;
        if (this.invaderSpawnTimer >= 5.0) {
            this.invaderSpawnTimer = 0;
            if (this.invaders.length < 5) {
                const shuffledRooms = [...ROOMS].sort(() => 0.5 - Math.random());
                const room = shuffledRooms[0];
                const rx = room.x + room.width / 2;
                const ry = room.y + room.height / 2;
                const nextId = Math.max(...this.invaders.map(inv => inv.id), -1) + 1;
                this.invaders.push({
                    id: nextId,
                    x: rx,
                    y: ry,
                    vx: (Math.random() - 0.5) * 80,
                    vy: (Math.random() - 0.5) * 80,
                    radius: 16
                });
            }
        }

        // Let bots shoot invaders if they have a gun and ammo
        this.players.forEach(p => {
            if (p.isLocalPlayer || p.isDead || p.role === 'evil Dog' || !p.hasGun || p.gunAmmo <= 0) return;
            p.shootCooldown = p.shootCooldown || 0;
            if (p.shootCooldown > 0) {
                p.shootCooldown -= dt;
            } else {
                const targetInv = this.invaders.find(inv => Math.hypot(p.x - inv.x, p.y - inv.y) <= 250);
                if (targetInv) {
                    p.gunAmmo--;
                    p.shootCooldown = 1.0; // 1s shoot cooldown
                    soundManager.playVoteClick();
                    this.activeLaserLines = this.activeLaserLines || [];
                    this.activeLaserLines.push({
                        fromX: p.x,
                        fromY: p.y,
                        toX: targetInv.x,
                        toY: targetInv.y,
                        timer: 0.15
                    });
                    this.killInvader(targetInv.id, p);
                }
            }
        });

        // Let bots reload their guns at the Workshop if out of ammo
        this.players.forEach(p => {
            if (p.isLocalPlayer || p.isDead || p.role === 'evil Dog' || !p.hasGun || p.gunAmmo > 0) return;
            const isObs = this.selectedMap === 'catnip_observatory';
            const wsX = isObs ? 2370 : 2570;
            const wsY = isObs ? 4720 : 1840;
            const nearWorkshop = Math.hypot(p.x - wsX, p.y - wsY) <= 95;
            if (nearWorkshop) {
                p.gunAmmo = 5;
                soundManager.playTaskComplete();
            }
        });

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

        this.invaders.forEach(inv => {
            const nextX = inv.x + inv.vx * dt;
            const nextY = inv.y + inv.vy * dt;
            if (isWalkable(nextX, nextY)) {
                inv.x = nextX;
                inv.y = nextY;
            } else {
                const angle = Math.random() * Math.PI * 2;
                inv.vx = Math.cos(angle) * speed;
                inv.vy = Math.sin(angle) * speed;
            }
            if (Math.random() < 0.02) {
                const angle = Math.random() * Math.PI * 2;
                inv.vx = Math.cos(angle) * speed;
                inv.vy = Math.sin(angle) * speed;
            }
            if (inv.x < 100 || inv.x > 3200) inv.vx *= -1;
            if (inv.y < 100 || inv.y > 2500) inv.vy *= -1;
            this.players.forEach(p => {
                if (p.isDead) return;
                const dist = Math.hypot(p.x - inv.x, p.y - inv.y);
                if (dist <= p.radius + inv.radius) {
                    if (p.role === 'evil Dog') {
                        return; // Invaders do not attack the evil dog
                    }
                    if (!p.invulnTimer || p.invulnTimer <= 0) {
                        p.health = (p.health || 3) - 1;
                        p.invulnTimer = 1.5;
                        
                        if (p.isLocalPlayer) {
                            const angle = Math.atan2(p.y - inv.y, p.x - inv.x);
                            p.x += Math.cos(angle) * 45;
                            p.y += Math.sin(angle) * 45;
                            const overlay = document.createElement('div');
                            overlay.style.cssText = 'position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(214, 48, 49, 0.45); z-index:9999; pointer-events:none; transition:opacity 0.4s;';
                            document.body.appendChild(overlay);
                            setTimeout(() => overlay.remove(), 400);
                            soundManager.playDefeat();
                            
                            if (p.health <= 0) {
                                p.isDead = true;
                                p.killedByInvader = true;
                                this.reassignDeadCatTasks(p);
                                this.checkWinConditions();
                            }
                        } else {
                            soundManager.playDefeat();
                            if (p.health <= 0) {
                                p.isDead = true;
                                p.killedByInvader = true;
                                this.reassignDeadCatTasks(p);
                                this.checkWinConditions();
                            } else {
                                p.isFleeing = true;
                                p.fleeTimer = 3.0;
                                p.currentPath = [];
                            }
                        }
                    }
                }
            });
        });
    }

    killInvader(id, killer) {
        this.invaders = this.invaders.filter(inv => inv.id !== id);
        soundManager.playTaskComplete();
        if (killer) {
            this.players.forEach(p => {
                if (p.suspicionLevels) {
                    p.suspicionLevels[killer.id] = 0;
                }
            });
        }
        this.checkDefensiveProtocolStatus();
    }

    checkDefensiveProtocolStatus() {
        if (!this.defensiveProtocolActive) return;
        const shipsWin = (this.enemyShipsDestroyed || 0) >= 20;
        if (shipsWin) {
            this.defensiveProtocolActive = false;
            this.enemyShipsDestroyed = 0;
            this.localPlayer.tasks = this.localPlayer.tasks.filter(t => !t.id.startsWith('def_'));
            this.players.forEach(p => {
                if (p.tasks) p.tasks = p.tasks.filter(t => !t.id.startsWith('def_'));
                p.hasGun = false;
                p.gunAmmo = 0;
            });
            ROOMS.forEach(room => {
                room.tasks = room.tasks.filter(t => !t.id.startsWith('def_'));
            });

            // Assign post-protocol healing task to injured cats
            if (this.localPlayer.health < 3 && !this.localPlayer.isDead && this.localPlayer.role !== 'evil Dog') {
                if (!this.localPlayer.tasks.some(t => t.id === 'post_def_heal')) {
                    this.localPlayer.tasks.push({
                        id: 'post_def_heal',
                        name: 'Heal Injuries',
                        room: 'Medical',
                        type: 'fill_meter',
                        completed: false
                    });
                }
                const medRoom = ROOMS.find(r => r.id === 'medical');
                if (medRoom && !medRoom.tasks.some(t => t.id === 'post_def_heal')) {
                    medRoom.tasks.push({ id: 'post_def_heal', name: 'Heal Injuries', x: medRoom.x + medRoom.width / 2, y: medRoom.y + medRoom.height / 2 });
                }
            }
            this.players.forEach(p => {
                if (p.health < 3 && !p.isDead && p.role !== 'evil Dog') {
                    if (p.tasks && !p.tasks.some(t => t.id === 'post_def_heal')) {
                        p.tasks.push({
                            id: 'post_def_heal',
                            name: 'Heal Injuries',
                            room: 'Medical',
                            type: 'fill_meter',
                            completed: false
                        });
                    }
                }
            });
            soundManager.playTaskComplete();
            const banner = document.createElement('div');
            banner.style.cssText = 'position:fixed; top:20px; left:50%; transform:translateX(-50%); background:#00b894; color:white; padding:16px 32px; border-radius:12px; font-family:var(--font-heading); font-size:1.5rem; font-weight:bold; z-index:9999; box-shadow:0 10px 30px rgba(0,0,0,0.5); border:3px solid #55efc4; text-shadow:0 2px 4px rgba(0,0,0,0.5);';
            banner.innerText = '🛡️ SHIP SECURED! DEFENSIVE PROTOCOL DEACTIVATED!';
            document.body.appendChild(banner);
            setTimeout(() => banner.remove(), 4000);
        }
    }
}

// Instantiate and start game when loaded
window.addEventListener('DOMContentLoaded', () => {
    new Game();
});
