// UI Overlay Manager for Cat Crew

import { CAT_COLORS, HATS } from './sprites.js';
import { ROOMS } from './rooms.js';
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

        // Role Continue Button
        document.getElementById('role-continue-btn').onclick = () => {
            this.showScreen('hud-screen');
            this.game.state = 'PLAYING';
        };

        // Close Task Button
        document.getElementById('close-task-btn').onclick = () => {
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
            this.game.players.forEach(p => {
                p.witnessedKillerId = null;
                p.witnessedKillerName = null;
                p.witnessedVictimName = null;
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
            { id: 'catnip_observatory', name: 'Catnip Observatory' }
        ];
        let curIdx = maps.findIndex(m => m.id === this.game.selectedMap);
        if (curIdx === -1) curIdx = 0;
        const nextIdx = (curIdx + dir + maps.length) % maps.length;
        this.game.selectedMap = maps[nextIdx].id;
        document.getElementById('map-preview-name').innerText = maps[nextIdx].name;
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
        tasks.forEach(t => {
            const li = document.createElement('li');
            li.className = t.completed ? 'completed' : '';
            li.innerHTML = `${t.completed ? '✅' : '📌'} ${t.room}: ${t.name}`;
            listEl.appendChild(li);
        });

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
        const roleIcons = { Citizen: '🐱', Captain: '⭐', Guard: '🛡️', Engineer: '🔧', Medic: '🏥', 'evil Dog': '🐶' };
        document.getElementById('hud-role-icon').innerText = roleIcons[player.role] || '🐱';
        document.getElementById('hud-role-name').innerText = player.role === 'evil Dog' ? 'Evil Dog' : player.role;

        // Action Buttons Visibility
        const killBtn = document.getElementById('action-kill-btn');
        const reviveBtn = document.getElementById('action-revive-btn');
        const ventBtn = document.getElementById('action-vent-btn');
        const sabBtn = document.getElementById('action-sabotage-btn');
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
        } else {
            sabBanner.classList.add('hidden');
        }

        let canUse = false;
        let useText = "USE";
        let useIcon = "⚡";

        const bridge = ROOMS.find(r => r.id === 'bridge');
        if (Math.hypot(player.x - bridge.buttonX, player.y - bridge.buttonY) <= 45) {
            canUse = true; useText = "BUTTON"; useIcon = "🚨";
        }
        
        const security = ROOMS.find(r => r.id === 'security');
        const camX = this.game.selectedMap === 'catnip_observatory' ? 1380 : 380;
        const camY = this.game.selectedMap === 'catnip_observatory' ? 950 : 750;
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
            const ye = ROOMS.find(r => r.id === 'yarn_engine');
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

        if (!canUse) {
            for (const t of player.tasks) {
                if (t.completed) continue;
                const roomObj = ROOMS.find(r => r.name.includes(t.room));
                if (!roomObj) continue;
                const baseTaskId = t.id.split('_reassigned_')[0];
                const taskLoc = roomObj.tasks.find(tk => tk.id === baseTaskId);
                if (taskLoc && Math.hypot(player.x - taskLoc.x, player.y - taskLoc.y) <= 95) {
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
