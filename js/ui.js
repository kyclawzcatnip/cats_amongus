// UI Overlay Manager for Cat Crew

import { CAT_COLORS, HATS } from './sprites.js';
import { ROOMS, getNearbyLadder } from './rooms.js';
import { VENTS } from './vents.js';

export class UIManager {
    constructor(game) {
        this.game = game;
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Start Game Button
        document.getElementById('start-game-btn').onclick = () => {
            const nameInput = document.getElementById('player-name-input').value.trim() || 'Whiskers';
            this.game.startNewGame(nameInput);
        };

        // Color Selectors
        document.getElementById('prev-color-btn').onclick = () => this.changeColor(-1);
        document.getElementById('next-color-btn').onclick = () => this.changeColor(1);

        // Hat Selectors
        document.getElementById('prev-hat-btn').onclick = () => this.changeHat(-1);
        document.getElementById('next-hat-btn').onclick = () => this.changeHat(1);

        // Map Selectors
        document.getElementById('prev-map-btn').onclick = () => this.changeMap(-1);
        document.getElementById('next-map-btn').onclick = () => this.changeMap(1);

        // Cat Amount Selectors
        document.getElementById('prev-cats-btn').onclick = () => this.changeCats(-1);
        document.getElementById('next-cats-btn').onclick = () => this.changeCats(1);

        // Role Selectors
        document.getElementById('prev-role-btn').onclick = () => this.changeRole(-1);
        document.getElementById('next-role-btn').onclick = () => this.changeRole(1);

        // Role Continue Button
        document.getElementById('role-continue-btn').onclick = () => {
            this.showScreen('hud-screen');
            this.game.state = 'PLAYING';
        };

        // Close Task Button
        document.getElementById('close-task-btn').onclick = () => {
            if (this.game.activeTaskCleanup) {
                this.game.activeTaskCleanup();
                this.game.activeTaskCleanup = null;
            }
            this.hideScreen('task-modal');
            this.game.activeTask = null;
        };

        // Close Sabotage Button
        document.getElementById('close-sabotage-btn').onclick = () => {
            this.hideScreen('sabotage-modal');
        };

        // Action Buttons
        document.getElementById('action-use-btn').onclick = () => this.game.handleUseAction();
        document.getElementById('action-report-btn').onclick = () => this.game.handleReportAction();
        document.getElementById('action-kill-btn').onclick = () => this.game.handleKillAction();
        document.getElementById('action-revive-btn').onclick = () => this.game.handleReviveAction();
        document.getElementById('action-vent-btn').onclick = () => this.game.handleVentAction();
        document.getElementById('action-sabotage-btn').onclick = () => this.game.handleSabotageAction();

        // Sabotage Options
        document.getElementById('sab-lights-btn').onclick = () => {
            this.game.triggerSabotage('lights');
            this.hideScreen('sabotage-modal');
        };
        document.getElementById('sab-engine-btn').onclick = () => {
            this.game.triggerSabotage('engine');
            this.hideScreen('sabotage-modal');
        };
        document.getElementById('sab-comms-btn').onclick = () => {
            this.game.triggerSabotage('comms');
            this.hideScreen('sabotage-modal');
        };

        // Meeting Skip Vote
        document.getElementById('skip-vote-btn').onclick = () => {
            this.game.meetingManager.submitPlayerVote(this.game.localPlayer.id, this.game.players);
        };

        // Eject Continue
        document.getElementById('eject-continue-btn').onclick = () => {
            this.hideScreen('eject-screen');
            this.showScreen('hud-screen');
            this.game.state = 'PLAYING';
            this.game.keysPressed = {};
            this.game.players.forEach(p => {
                p.witnessedKillerId = null;
                p.witnessedKillerName = null;
                p.witnessedVictimName = null;
                p.currentPath = null;
                p.currentTaskToComplete = null;
                p.taskTimer = 0;
            });
            this.game.checkWinConditions();
        };

        // Restart Game Button
        document.getElementById('restart-game-btn').onclick = () => {
            this.showScreen('menu-screen');
            this.game.state = 'MENU';
        };
    }

    changeColor(dir) {
        this.game.menuColorIndex = (this.game.menuColorIndex + dir + CAT_COLORS.length) % CAT_COLORS.length;
        document.getElementById('color-preview-name').innerText = CAT_COLORS[this.game.menuColorIndex].name;
    }

    changeHat(dir) {
        this.game.menuHatIndex = (this.game.menuHatIndex + dir + HATS.length) % HATS.length;
        document.getElementById('hat-preview-name').innerText = HATS[this.game.menuHatIndex].name;
    }

    changeMap(dir) {
        const maps = [
            { id: 'whisker_station', name: 'Whisker-Station' },
            { id: 'catnip_observatory', name: 'Catnip Observatory' },
            { id: 'cat_hq', name: 'CatHQ' }
        ];
        let curIdx = maps.findIndex(m => m.id === this.game.selectedMap);
        if (curIdx === -1) curIdx = 0;
        const nextIdx = (curIdx + dir + maps.length) % maps.length;
        this.game.selectedMap = maps[nextIdx].id;
        document.getElementById('map-preview-name').innerText = maps[nextIdx].name;
    }

    changeCats(dir) {
        let newAmount = this.game.catAmount + dir;
        if (newAmount < 10) newAmount = 30;
        else if (newAmount > 30) newAmount = 10;
        this.game.catAmount = newAmount;
        document.getElementById('cats-preview-amount').innerText = `${newAmount} Cats`;
    }

    changeRole(dir) {
        const roles = ['Random', 'Citizen', 'Captain', 'Guard', 'Engineer', 'Medic', 'Detective', 'evil Dog'];
        let curIdx = roles.indexOf(this.game.selectedRole || 'Random');
        if (curIdx === -1) curIdx = 0;
        const nextIdx = (curIdx + dir + roles.length) % roles.length;
        this.game.selectedRole = roles[nextIdx];
        document.getElementById('role-preview-selection').innerText = roles[nextIdx];
    }

    showScreen(id) {
        document.querySelectorAll('.ui-screen').forEach(s => s.classList.remove('active'));
        document.getElementById(id).classList.add('active');
        document.getElementById(id).classList.remove('hidden');
    }

    hideScreen(id) {
        document.getElementById(id).classList.add('hidden');
        document.getElementById(id).classList.remove('active');
    }

    updateHUD(player, players, tasks, sabotageSystem) {
        const listEl = document.getElementById('hud-task-list');
        listEl.innerHTML = '';
        
        const downloadTask = tasks.find(tk => (tk.id.includes('download_data') || tk.id.includes('download_comms')));
        const uploadTask = tasks.find(tk => tk.id.includes('upload_data'));
        if (uploadTask) {
            uploadTask.locked = downloadTask && !downloadTask.completed;
        }
        const pickupTorpedoTask = tasks.find(tk => tk.id.includes('pickup_torpedo'));
        const loadTorpedoTask = tasks.find(tk => tk.id.includes('load_torpedoes'));
        if (loadTorpedoTask) {
            loadTorpedoTask.locked = pickupTorpedoTask && !pickupTorpedoTask.completed;
        }

        tasks.forEach(t => {
            const li = document.createElement('li');
            if (t.completed) {
                li.className = 'completed';
                li.innerHTML = `✅ ${t.room}: ${t.name}`;
            } else if (t.id.includes('upload_data') && t.locked) {
                li.className = 'locked';
                li.style.color = '#7f8c8d';
                li.innerHTML = `🔒 ${t.room}: ${t.name} (Download first)`;
            } else if (t.id.includes('load_torpedoes') && t.locked) {
                li.className = 'locked';
                li.style.color = '#7f8c8d';
                li.innerHTML = `🔒 ${t.room}: ${t.name} (Retrieve from Workshop first)`;
            } else {
                li.innerHTML = `📌 ${t.room}: ${t.name}`;
            }
            listEl.appendChild(li);
        });

        const gunEl = document.getElementById('hud-inventory-gun');
        const torpEl = document.getElementById('hud-inventory-torpedo');
        if (gunEl) {
            if (player.hasGun) {
                gunEl.innerText = `🔫 Gun: ${player.gunAmmo}/5 Ammo`;
                gunEl.style.color = player.gunAmmo === 0 ? '#ff7675' : '#55efc4';
            } else {
                gunEl.innerText = `🔫 Gun: None (Get in Kitchen)`;
                gunEl.style.color = '#ffeaa7';
            }
        }
        if (torpEl) {
            const torpedoes = player.loadedTorpedoes || 0;
            torpEl.innerText = `🚀 Torpedoes Ready: ${torpedoes}`;
            torpEl.style.color = torpedoes === 0 ? '#ff7675' : '#55efc4';
        }

        let totalCatTasks = 0;
        let completedCatTasks = 0;
        players.forEach(p => {
            if (p.role !== 'evil Dog' && p.tasks) {
                p.tasks.forEach(t => {
                    totalCatTasks++;
                    if (t.completed) completedCatTasks++;
                });
            }
        });

        const fillPct = (completedCatTasks / Math.max(1, totalCatTasks)) * 100;
        document.getElementById('task-progress-fill').style.width = `${fillPct}%`;

        // Role Icon/Name
        const roleIcons = { Citizen: '🐱', Captain: '⭐', Guard: '🛡️', Engineer: '🔧', Medic: '🏥', Detective: '🕵️', 'evil Dog': '🐶' };
        document.getElementById('hud-role-icon').innerText = roleIcons[player.role] || '🐱';
        document.getElementById('hud-role-name').innerText = player.role === 'evil Dog' ? 'Evil Dog' : player.role;

        // Floor Badge
        const floorBadge = document.getElementById('hud-floor-badge');
        if (floorBadge) {
            if (this.game.selectedMap === 'catnip_observatory') {
                floorBadge.classList.remove('hidden');
                const floorName = player.y >= 2800 ? '2nd Floor' : '1st Floor';
                document.getElementById('hud-floor-name').innerText = floorName;
            } else {
                floorBadge.classList.add('hidden');
            }
        }

        // Action Buttons Visibility
        const killBtn = document.getElementById('action-kill-btn');
        const reviveBtn = document.getElementById('action-revive-btn');
        const ventBtn = document.getElementById('action-vent-btn');
        const sabBtn = document.getElementById('action-sabotage-btn');
        const reportBtn = document.getElementById('action-report-btn');
        const cooldownOverlay = document.getElementById('kill-cooldown-timer');
        const sabCooldownOverlay = document.getElementById('sabotage-cooldown-timer');

        if (player.role === 'evil Dog' && !player.isDead) {
            killBtn.classList.remove('hidden');
            sabBtn.classList.remove('hidden');
            
            if (player.killCooldown > 0) {
                cooldownOverlay.style.display = 'flex';
                cooldownOverlay.innerText = Math.ceil(player.killCooldown);
            } else {
                cooldownOverlay.style.display = 'none';
            }

            if (sabotageSystem.activeSabotage) {
                sabCooldownOverlay.style.display = 'flex';
                sabCooldownOverlay.innerText = 'ACT';
            } else if (sabotageSystem.cooldown > 0) {
                sabCooldownOverlay.style.display = 'flex';
                sabCooldownOverlay.innerText = Math.ceil(sabotageSystem.cooldown);
            } else {
                sabCooldownOverlay.style.display = 'none';
            }
        } else {
            killBtn.classList.add('hidden');
            sabBtn.classList.add('hidden');
        }

        if (player.role === 'Medic' && !player.isDead && player.reviveUses > 0) {
            reviveBtn.classList.remove('hidden');
        } else {
            reviveBtn.classList.add('hidden');
        }

        if ((player.role === 'evil Dog' || player.role === 'Engineer') && !player.isDead) {
            ventBtn.classList.remove('hidden');
        } else {
            ventBtn.classList.add('hidden');
        }

        let canReport = false;
        if (player.role !== 'evil Dog' && !player.isDead) {
            for (const p of this.game.players) {
                if (p.isDead && !p.bodyCleaned && Math.hypot(player.x - p.x, player.y - p.y) <= 80) {
                    canReport = true;
                    break;
                }
            }
        }
        if (canReport) {
            reportBtn.classList.remove('hidden');
        } else {
            reportBtn.classList.add('hidden');
        }

        // Sabotage Warning Banner
        const sabBanner = document.getElementById('sabotage-banner');
        if (sabotageSystem.activeSabotage === 'lights') {
            sabBanner.classList.remove('hidden');
            document.getElementById('sabotage-text').innerText = 'LIGHTS SABOTAGED! FIX IN ELECTRICAL!';
        } else if (sabotageSystem.activeSabotage === 'engine') {
            sabBanner.classList.remove('hidden');
            document.getElementById('sabotage-text').innerText = `CRITICAL ENGINE MELTDOWN! (${Math.ceil(sabotageSystem.engineTimer)}s)`;
        } else if (sabotageSystem.activeSabotage === 'comms') {
            sabBanner.classList.remove('hidden');
            document.getElementById('sabotage-text').innerText = 'COMMUNICATIONS JAMMED! RECONNECT IN COMMS!';
        } else if (this.game && this.game.defensiveProtocolActive) {
            sabBanner.classList.remove('hidden');
            const hpStr = player.role === 'evil Dog' ? '😈' : '❤️'.repeat(this.game.localPlayer.health || 0);
            const shipsDestroyed = this.game.enemyShipsDestroyed || 0;
            let ammoStr = '';
            if (this.game.localPlayer.hasGun) {
                ammoStr = `🔫 AMMO: ${this.game.localPlayer.gunAmmo}/8`;
            } else {
                const locName = (this.game.selectedMap === 'catnip_observatory') ? 'WEAPONS/CAFETERIA' : 'WEAPONS/SECURITY';
                ammoStr = `⚠️ GET GUN IN ${locName}!`;
            }
            document.getElementById('sabotage-text').innerText = `🚨 DEFENSIVE PROTOCOL ACTIVE! HP: ${hpStr} | ${ammoStr} | SHIPS DESTROYED: ${shipsDestroyed}/20 🚨`;
        } else {
            sabBanner.classList.add('hidden');
        }

        const redAlert = document.getElementById('red-alert-overlay');
        if (redAlert) {
            redAlert.classList.add('hidden');
        }

        let canUse = false;
        let useText = "USE";
        let useIcon = "⚡";

        if (this.game.selectedMap === 'catnip_observatory') {
            const ladder = getNearbyLadder(player.x, player.y, 75);
            if (ladder) {
                canUse = true; useText = "CLIMB"; useIcon = "🪜";
            }
        }

        const buttonRoom = ROOMS.find(r => r.hasEmergencyButton);
        if (buttonRoom && Math.hypot(player.x - buttonRoom.buttonX, player.y - buttonRoom.buttonY) <= 45) {
            if (this.game.defensiveProtocolActive) {
                canUse = true; useText = "LOCKED"; useIcon = "🔒";
            } else {
                canUse = true; useText = "BUTTON"; useIcon = "🚨";
            }
        }
        
        const security = ROOMS.find(r => r.id === 'security');
        let camX = 380, camY = 750;
        if (this.game.selectedMap === 'catnip_observatory') {
            camX = 1380; camY = 950;
        } else if (this.game.selectedMap === 'cat_hq') {
            camX = 550; camY = 875;
        }
        if (security && Math.hypot(player.x - camX, player.y - camY) <= 75) {
            canUse = true; useText = "CAMERAS"; useIcon = "📹";
        }

        if (sabotageSystem.activeSabotage === 'lights') {
            const el = ROOMS.find(r => r.id === 'electrical');
            if (el && Math.hypot(player.x - el.lightsFixX, player.y - el.lightsFixY) <= 95) {
                canUse = true; useText = "FIX LIGHTS"; useIcon = "💡";
            }
        }

        if (sabotageSystem.activeSabotage === 'engine') {
            const ye = ROOMS.find(r => r.hasEngineFixPanel);
            if (ye && Math.hypot(player.x - ye.engineFixX, player.y - ye.engineFixY) <= 95) {
                canUse = true; useText = "REPAIR"; useIcon = "⚙️";
            }
        }

        if (sabotageSystem.activeSabotage === 'comms') {
            const cm = ROOMS.find(r => r.id === 'comms');
            if (cm && Math.hypot(player.x - cm.commsFixX, player.y - cm.commsFixY) <= 95) {
                canUse = true; useText = "FIX COMMS"; useIcon = "📡";
            }
        }

        if (!canUse && player.hasGun && this.game && this.game.defensiveProtocolActive) {
            let wsX = 2570, wsY = 1840;
            if (this.game.selectedMap === 'catnip_observatory') {
                wsX = 2370; wsY = 4720;
            } else if (this.game.selectedMap === 'cat_hq') {
                wsX = 3325; wsY = 2010;
            }
            const nearWorkshop = Math.hypot(player.x - wsX, player.y - wsY) <= 95;
            
            if (player.gunAmmo < 5 && nearWorkshop) {
                canUse = true; useText = "RELOAD"; useIcon = "🔋";
            } else if (player.gunAmmo > 0 && this.game.invaders) {
                const nearbyInvader = this.game.invaders.find(inv => Math.hypot(player.x - inv.x, player.y - inv.y) <= 300);
                if (nearbyInvader) {
                    canUse = true; useText = `SHOOT (${player.gunAmmo})`; useIcon = "🔫";
                }
            } else if (player.gunAmmo === 0) {
                canUse = true; useText = "NO AMMO"; useIcon = "⚠️";
            }
        }

        if (!canUse && player.role !== 'evil Dog' && this.game && this.game.defensiveProtocolActive && this.game.invaders) {
            const nearbyInvader = this.game.invaders.find(inv => Math.hypot(player.x - inv.x, player.y - inv.y) <= 80);
            if (nearbyInvader) {
                canUse = true; useText = "STAB"; useIcon = "🔪";
            }
        }

        if (!canUse && player.role === 'evil Dog' && this.game && this.game.defensiveProtocolActive) {
            let nearbyDefTask = null;
            ROOMS.forEach(room => {
                const found = room.tasks.find(t => t.id.startsWith('def_') && Math.hypot(player.x - t.x, player.y - t.y) <= 95);
                if (found) nearbyDefTask = found;
            });
            if (nearbyDefTask) {
                canUse = true; useText = "SABOTAGE"; useIcon = "⚠️";
            }
        }

        if (!canUse && player.role === 'Detective') {
            const nearbyKiller = this.game.players.find(p => !p.isLocalPlayer && !p.isDead && p.lastKillTimestamp && (Date.now() - p.lastKillTimestamp <= 15000) && Math.hypot(player.x - p.x, player.y - p.y) <= 95);
            if (nearbyKiller) {
                canUse = true; useText = "EXPOSE"; useIcon = "🔍";
            }
        }

        if (!canUse) {
            for (const t of player.tasks) {
                if (t.completed) continue;
                const baseTaskId = t.id.split('_reassigned_')[0];
                let taskLoc = null;
                for (const r of ROOMS) {
                    if (t.room.toLowerCase().includes(r.id) || r.id.includes(t.room.toLowerCase()) || r.name.toLowerCase().includes(t.room.toLowerCase())) {
                        const found = r.tasks.find(tk => tk.id === baseTaskId);
                        if (found) {
                            const dist = Math.hypot(player.x - found.x, player.y - found.y);
                            if (dist <= 95) {
                                taskLoc = found;
                                break;
                            }
                        }
                    }
                }
                if (taskLoc) {
                    if (baseTaskId === 'upload_data' && t.locked) continue;
                    canUse = true; useText = "TASK"; useIcon = "📋";
                    break;
                }
            }
        }

        if (!canUse && (player.role === 'evil Dog' || player.role === 'Engineer')) {
            const nearbyVent = VENTS.find(v => Math.hypot(player.x - v.x, player.y - v.y) <= 80);
            if (nearbyVent) {
                canUse = true; useText = player.inVent ? "EXIT" : "VENT"; useIcon = "🌀";
            }
        }

        const useBtn = document.getElementById('action-use-btn');
        if (useBtn) {
            if (canUse) {
                useBtn.style.borderColor = '#00cec9';
                useBtn.style.boxShadow = '0 0 15px rgba(0, 206, 201, 0.6)';
                useBtn.querySelector('.action-text').innerText = useText;
                useBtn.querySelector('.action-icon').innerText = useIcon;
            } else {
                useBtn.style.borderColor = '';
                useBtn.style.boxShadow = '';
                useBtn.querySelector('.action-text').innerText = 'USE';
                useBtn.querySelector('.action-icon').innerText = '⚡';
            }
        }
    }
}
