// Meeting & Voting Logic for Cat Crew

import { soundManager } from './sounds.js';
import { CAT_COLORS } from './sprites.js';

export class MeetingManager {
    constructor() {
        this.active = false;
        this.timer = 30;
        this.reporter = null;
        this.bodyPlayer = null;
        this.votes = {}; // playerId -> votedPlayerId | 'skip'
        this.selectedVote = null;
        this.hasVoted = false;
        this.accusedId = null;
    }

    appendChatMessage(container, element) {
        if (!container) return;
        const isNearBottom = container.scrollHeight - container.scrollTop - container.clientHeight <= 60;
        container.appendChild(element);
        if (isNearBottom) {
            container.scrollTop = container.scrollHeight;
        }
    }

    startMeeting(reporter, bodyPlayer, players, onComplete) {
        this.active = true;
        this.timer = 30;
        this.reporter = reporter;
        this.bodyPlayer = bodyPlayer;
        this.votes = {};
        this.selectedVote = null;
        this.onComplete = onComplete;
        this.hasVoted = false;
        this.accusedId = null;

        // Priority 1: Check if anyone witnessed the kill (including local player)
        let witnessedKillerId = null;
        players.forEach(p => {
            if (!p.isDead && p.witnessedKillerId !== undefined && p.witnessedKillerId !== null) {
                witnessedKillerId = p.witnessedKillerId;
            }
        });

        // Establish initial AI voting consensus direction
        const dogPlayer = players.find(p => !p.isDead && p.role === 'Dog');
        const innocentPlayers = players.filter(p => !p.isDead && p.role !== 'Dog');
        const rand = Math.random();

        if (witnessedKillerId !== null) {
            this.accusedId = witnessedKillerId; // Witness takes priority
        } else {
            this.accusedId = null; // No one knows who it is!
        }

        soundManager.playEmergencyAlarm();
        this.setupMeetingUI(players);

        // If local player saw the kill, automatically post the witness chat line
        const localPlayer = players.find(p => p.isLocalPlayer);
        if (localPlayer && !localPlayer.isDead && localPlayer.witnessedKillerName) {
            setTimeout(() => {
                if (this.active) {
                    const msgText = `🚨 I SAW ${localPlayer.witnessedKillerName.toUpperCase()} ELIMINATE SOMEONE IN FRONT OF ME! IT'S THEM!`;
                    this.sendUserChatMessage(msgText, localPlayer.name, players);
                }
            }, 1000);
        }
    }

    setupMeetingUI(players) {
        const titleEl = document.getElementById('meeting-title');
        if (this.bodyPlayer) {
            titleEl.innerText = `📢 DEAD BODY REPORTED BY ${this.reporter.name.toUpperCase()}!`;
        } else {
            titleEl.innerText = `🚨 EMERGENCY MEETING CALLED BY ${this.reporter.name.toUpperCase()}!`;
        }

        const grid = document.getElementById('voting-players-grid');
        grid.innerHTML = '';

        const localPlayer = players.find(p => p.isLocalPlayer);
        const skipBtn = document.getElementById('skip-vote-btn');

        if (localPlayer && localPlayer.isDead) {
            this.hasVoted = true;
            if (skipBtn) {
                skipBtn.innerText = 'SPECTATING';
                skipBtn.disabled = true;
                skipBtn.className = 'btn-secondary';
            }
        } else {
            this.hasVoted = false;
            if (skipBtn) {
                skipBtn.innerText = 'SKIP VOTE';
                skipBtn.disabled = false;
                skipBtn.className = 'btn-secondary';
            }
        }

        players.forEach(p => {
            const card = document.createElement('div');
            card.className = `player-vote-card ${p.isDead ? 'dead' : ''}`;
            card.id = `vote-card-${p.id}`;
            
            const colorObj = CAT_COLORS[p.colorIndex % CAT_COLORS.length];
            card.innerHTML = `
                <div class="player-info">
                    <span style="display:inline-block; width:20px; height:20px; border-radius:50%; background:${colorObj.main}; border:2px solid ${colorObj.accent};"></span>
                    <strong>${p.name}</strong>
                </div>
                <span class="vote-tag" id="vote-tag-${p.id}"></span>
            `;

            if (!p.isDead) {
                card.onclick = () => {
                    if (this.hasVoted) return;
                    soundManager.playVoteClick();
                    
                    if (card.classList.contains('selected')) {
                        card.classList.remove('selected');
                        this.selectedVote = null;
                        if (skipBtn) {
                            skipBtn.innerText = 'SKIP VOTE';
                            skipBtn.className = 'btn-secondary';
                        }
                    } else {
                        document.querySelectorAll('.player-vote-card').forEach(c => c.classList.remove('selected'));
                        card.classList.add('selected');
                        this.selectedVote = p.id;
                        if (skipBtn) {
                            skipBtn.innerText = 'CONFIRM VOTE';
                            skipBtn.className = 'btn-primary glow-button';
                        }
                    }
                };
            }
            grid.appendChild(card);
        });

        const chatContainer = document.getElementById('chat-messages-container');
        chatContainer.innerHTML = '';
        
        const aliveBots = players.filter(p => !p.isLocalPlayer && !p.isDead);
        const aliveNames = players.filter(p => !p.isDead).map(p => p.name);
        const roomNames = ['Fish Storage', 'Yarn Engine', 'Nap Quarters', 'Kitchen', 'Workshop', 'Cat Garden', 'Bridge', 'Cargo Bay'];

        aliveBots.forEach((bot, index) => {
            setTimeout(() => {
                if (!this.active) return;
                let lineText = "";
                if (bot.witnessedKillerName) {
                    lineText = `🚨 I SAW ${bot.witnessedKillerName.toUpperCase()} ELIMINATE SOMEONE IN FRONT OF ME! IT'S THEM!`;
                } else if (this.accusedId !== null && Math.random() < 0.5) {
                    const accusedPlayer = players.find(p => p.id === this.accusedId);
                    if (accusedPlayer) {
                        lineText = `I agree, ${accusedPlayer.name} looks super suspicious!`;
                    } else {
                        lineText = `Let's vote carefully crewmates.`;
                    }
                } else {
                    const otherBot = aliveNames.filter(n => n !== bot.name)[Math.floor(Math.random() * (aliveNames.length - 1))];
                    const room = roomNames[Math.floor(Math.random() * roomNames.length)];
                    let lines = [
                        `I was in ${room} finishing my tasks!`,
                        `Did anyone see ${otherBot}? I saw them near ${room}.`,
                        `I was with ${otherBot} in ${room}, they seem innocent!`,
                        `Who was near ${room} when the meeting started?`,
                        `I saw someone vent near ${room}! Super suspicious!`,
                        `If we're not sure, let's skip this vote.`
                    ];
                    if (this.bodyPlayer) {
                        lines.push(`Where exactly did you find ${this.bodyPlayer.name}'s body?`);
                        lines.push(`I saw ${otherBot} walking away from ${room} right before the report!`);
                    }
                    lineText = lines[Math.floor(Math.random() * lines.length)];
                }

                const msg = document.createElement('div');
                msg.className = 'chat-msg bot-msg';
                msg.innerHTML = `<strong>${bot.name}:</strong> ${lineText}`;
                this.appendChatMessage(chatContainer, msg);
            }, (index + 1) * 800);

            setTimeout(() => {
                if (!this.active) return;
                if (bot.witnessedKillerId !== undefined && bot.witnessedKillerId !== null) {
                    this.votes[bot.id] = bot.witnessedKillerId;
                } else if (this.accusedId !== null) {
                    const r = Math.random();
                    if (r < 0.50) {
                        this.votes[bot.id] = this.accusedId;
                    } else if (r < 0.80) {
                        this.votes[bot.id] = 'skip';
                    } else {
                        const choices = players.filter(pl => !pl.isDead).map(pl => pl.id);
                        choices.push('skip');
                        this.votes[bot.id] = choices[Math.floor(Math.random() * choices.length)];
                    }
                } else {
                    const r = Math.random();
                    if (r < 0.60) {
                        this.votes[bot.id] = 'skip';
                    } else {
                        const choices = players.filter(pl => !pl.isDead).map(pl => pl.id);
                        choices.push('skip');
                        this.votes[bot.id] = choices[Math.floor(Math.random() * choices.length)];
                    }
                }
                const tag = document.getElementById(`vote-tag-${bot.id}`);
                if (tag) tag.innerText = '🗳️ VOTED';
                soundManager.playVoteClick();

                // Check if meeting should end early because everyone voted
                const alivePlayers = players.filter(pl => !pl.isDead);
                const allVoted = alivePlayers.every(pl => this.votes[pl.id] !== undefined);
                if (allVoted) {
                    this.tallyVotes(players);
                }
            }, (index + 1) * 1200 + 1000);
        });
    }

    update(dt, players) {
        if (!this.active) return;

        this.timer -= dt;
        document.getElementById('meeting-timer').innerText = Math.ceil(this.timer);

        if (this.timer <= 0) {
            this.tallyVotes(players);
        }
    }

    sendUserChatMessage(msgText, localPlayerName, players) {
        if (!this.active || !msgText.trim()) return;
        const localP = players.find(p => p.isLocalPlayer);
        if (localP && localP.isDead) {
            const container = document.getElementById('chat-messages-container');
            const msg = document.createElement('div');
            msg.className = 'chat-msg system-msg';
            msg.style.cssText = 'color:#ff7675; background:rgba(255, 118, 117, 0.1); border:1px solid rgba(255, 118, 117, 0.2); width:100%; text-align:center; align-self:center; box-sizing:border-box;';
            msg.innerHTML = `<em>👻 Dead cats cannot speak during emergency meetings!</em>`;
            this.appendChatMessage(container, msg);
            return;
        }

        const container = document.getElementById('chat-messages-container');
        const msg = document.createElement('div');
        msg.className = 'chat-msg self-msg';
        msg.innerHTML = `<strong>${localPlayerName} (You):</strong> ${msgText}`;
        this.appendChatMessage(container, msg);

        soundManager.playVoteClick();

        const aliveBots = players.filter(p => !p.isLocalPlayer && !p.isDead);
        const aliveNames = players.filter(p => !p.isDead).map(p => p.name);
        const roomNames = ['Fish Storage', 'Yarn Engine', 'Nap Quarters', 'Kitchen', 'Workshop', 'Cat Garden', 'Bridge', 'Cargo Bay'];

        if (aliveBots.length > 0) {
            const responder = aliveBots[Math.floor(Math.random() * aliveBots.length)];
            const otherBot = aliveNames.filter(n => n !== responder.name && n !== localPlayerName)[0] || 'someone';
            const room = roomNames[Math.floor(Math.random() * roomNames.length)];

            const botResponses = [
                `I agree with ${localPlayerName}! ${otherBot} was acting suspicious in ${room}.`,
                `Wait ${localPlayerName}, are you sure? I was in ${room} with ${otherBot}!`,
                `I saw ${otherBot} near the vents in ${room}!`,
                `Let's vote carefully crewmates. ${localPlayerName} raises a good point.`
            ];
            setTimeout(() => {
                if (!this.active) return;
                const bMsg = document.createElement('div');
                bMsg.className = 'chat-msg bot-msg';
                bMsg.innerHTML = `<strong>${responder.name}:</strong> ${botResponses[Math.floor(Math.random() * botResponses.length)]}`;
                this.appendChatMessage(container, bMsg);
            }, 1000);
        }
    }

    submitPlayerVote(localPlayerId, players) {
        if (this.hasVoted) return;
        this.hasVoted = true;

        const skipBtn = document.getElementById('skip-vote-btn');
        if (skipBtn) {
            skipBtn.innerText = 'VOTED';
            skipBtn.disabled = true;
            skipBtn.className = 'btn-secondary';
        }

        const tag = document.getElementById(`vote-tag-${localPlayerId}`);
        if (tag) tag.innerText = '🗳️ VOTED';

        document.querySelectorAll('.player-vote-card').forEach(c => c.classList.remove('selected'));
        
        this.votes[localPlayerId] = this.selectedVote !== null ? this.selectedVote : 'skip';
        soundManager.playVoteClick();

        const alivePlayers = players.filter(pl => !pl.isDead);
        const allVoted = alivePlayers.every(pl => this.votes[pl.id] !== undefined);
        if (allVoted) {
            this.tallyVotes(players);
        }
    }

    tallyVotes(players) {
        this.active = false;
        const counts = { skip: 0 };
        players.forEach(p => {
            if (!p.isDead) {
                let v = this.votes[p.id];
                if (!v) {
                    if (p.witnessedKillerId !== undefined && p.witnessedKillerId !== null) {
                        v = p.witnessedKillerId;
                    } else if (this.accusedId !== null) {
                        const r = Math.random();
                        if (r < 0.65) v = this.accusedId;
                        else if (r < 0.85) v = 'skip';
                        else {
                            const choices = players.filter(pl => !pl.isDead).map(pl => pl.id);
                            choices.push('skip');
                            v = choices[Math.floor(Math.random() * choices.length)];
                        }
                    } else {
                        const r = Math.random();
                        if (r < 0.60) v = 'skip';
                        else {
                            const choices = players.filter(pl => !pl.isDead).map(pl => pl.id);
                            choices.push('skip');
                            v = choices[Math.floor(Math.random() * choices.length)];
                        }
                    }
                    this.votes[p.id] = v;
                }
                counts[v] = (counts[v] || 0) + 1;
            }
        });

        players.forEach(voter => {
            if (!voter.isDead && this.votes[voter.id]) {
                const targetId = this.votes[voter.id];
                const targetCard = document.getElementById(`vote-card-${targetId}`) || document.getElementById('skip-vote-btn');
                if (targetCard) {
                    let voterBox = targetCard.querySelector('.voters-box');
                    if (!voterBox) {
                        voterBox = document.createElement('div');
                        voterBox.className = 'voters-box';
                        voterBox.style.cssText = 'display:inline-flex; gap:4px; margin-left:8px; align-items:center;';
                        targetCard.appendChild(voterBox);
                    }
                    const colorObj = CAT_COLORS[voter.colorIndex % CAT_COLORS.length];
                    const dot = document.createElement('span');
                    dot.title = `${voter.name} voted here`;
                    dot.style.cssText = `width:16px; height:16px; border-radius:50%; background:${colorObj.main}; border:1.5px solid ${colorObj.accent}; display:inline-block; box-shadow:0 2px 4px rgba(0,0,0,0.5);`;
                    voterBox.appendChild(dot);
                }
            }
        });

        let maxVotes = 0;
        let ejectedId = null;
        let isTie = false;

        for (const [id, count] of Object.entries(counts)) {
            if (id === 'skip') continue;
            if (count > maxVotes) {
                maxVotes = count;
                ejectedId = id;
                isTie = false;
            } else if (count === maxVotes) {
                isTie = true;
            }
        }

        if (counts.skip >= maxVotes) {
            ejectedId = null;
        }

        const ejectedPlayer = players.find(p => p.id == ejectedId);

        setTimeout(() => {
            if (ejectedPlayer && !isTie) {
                ejectedPlayer.isDead = true;
            }
            this.onComplete(ejectedPlayer, isTie);
        }, 3500);
    }
}
