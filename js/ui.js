// UI Overlay Manager for Cat Crew

import { CAT_COLORS, HATS } from './sprites.js';

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
        document.getElementById('sab-doors-btn').onclick = () => {
            this.game.triggerSabotage('doors');
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
            if (p.role !== 'Dog' && p.tasks) {
                p.tasks.forEach(t => {
                    totalCatTasks++;
                    if (t.completed) completedCatTasks++;
                });
            }
        });

        const fillPct = (completedCatTasks / Math.max(1, totalCatTasks)) * 100;
        document.getElementById('task-progress-fill').style.width = `${fillPct}%`;

        // Role Icon/Name
        const roleIcons = { Citizen: '🐱', Captain: '⭐', Guard: '🛡️', Engineer: '🔧', Medic: '🏥', Dog: '🐶' };
        document.getElementById('hud-role-icon').innerText = roleIcons[player.role] || '🐱';
        document.getElementById('hud-role-name').innerText = player.role;

        // Action Buttons Visibility
        const killBtn = document.getElementById('action-kill-btn');
        const reviveBtn = document.getElementById('action-revive-btn');
        const ventBtn = document.getElementById('action-vent-btn');
        const sabBtn = document.getElementById('action-sabotage-btn');
        const cooldownOverlay = document.getElementById('kill-cooldown-timer');

        if (player.role === 'Dog' && !player.isDead) {
            killBtn.classList.remove('hidden');
            sabBtn.classList.remove('hidden');
            
            if (player.killCooldown > 0) {
                cooldownOverlay.style.display = 'flex';
                cooldownOverlay.innerText = Math.ceil(player.killCooldown);
            } else {
                cooldownOverlay.style.display = 'none';
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

        if ((player.role === 'Dog' || player.role === 'Engineer') && !player.isDead) {
            ventBtn.classList.remove('hidden');
        } else {
            ventBtn.classList.add('hidden');
        }

        // Sabotage Warning Banner
        const sabBanner = document.getElementById('sabotage-banner');
        if (sabotageSystem.activeSabotage === 'lights') {
            sabBanner.classList.remove('hidden');
            document.getElementById('sabotage-text').innerText = 'LIGHTS SABOTAGED! FIX IN WORKSHOP!';
        } else if (sabotageSystem.activeSabotage === 'engine') {
            sabBanner.classList.remove('hidden');
            document.getElementById('sabotage-text').innerText = `CRITICAL ENGINE MELTDOWN! (${Math.ceil(sabotageSystem.engineTimer)}s)`;
        } else {
            sabBanner.classList.add('hidden');
        }
    }
}
