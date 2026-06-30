// Meeting & Voting Logic for Cat Crew

import { soundManager } from './sounds.js';
import { CAT_COLORS } from './sprites.js';
import { ROOMS } from './rooms.js';

function getPlayerRoom(player, roomsList) {
    if (player.inVent) return 'Vents';
    const room = roomsList.find(r => 
        player.x >= r.x && 
        player.x <= r.x + r.width && 
        player.y >= r.y && 
        player.y <= r.y + r.height
    );
    return room ? room.name.replace(/[^a-zA-Z0-9\s]/g, '').trim() : 'Corridors';
}

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
        const dogPlayer = players.find(p => !p.isDead && p.role === 'evil Dog');
        const innocentPlayers = players.filter(p => !p.isDead && p.role !== 'evil Dog');
        const rand = Math.random();

        if (witnessedKillerId !== null) {
            this.accusedId = witnessedKillerId; // Witness takes priority
        } else {
            // Find player with highest suspicion (from the perspective of alive crewmates)
            let highestSusId = null;
            let highestSusVal = 0;
            players.forEach(p => {
                if (p.isDead) return;
                let averageSusForP = 0;
                let crewCount = 0;
                players.forEach(voter => {
                    if (!voter.isDead && !voter.isLocalPlayer && voter.role !== 'evil Dog' && voter.suspicionLevels) {
                        averageSusForP += voter.suspicionLevels[p.id] || 0;
                        crewCount++;
                    }
                });
                const averageVal = crewCount > 0 ? (averageSusForP / crewCount) : 0;
                if (averageVal > highestSusVal) {
                    highestSusVal = averageVal;
                    highestSusId = p.id;
                }
            });

            if (highestSusId !== null && highestSusVal >= 50) {
                this.accusedId = highestSusId;
            } else {
                this.accusedId = null; // No one knows who it is!
            }
        }

        soundManager.playEmergencyAlarm();
        this.setupMeetingUI(players);

        // If local player saw the kill, automatically post the witness chat line
        const localPlayer = players.find(p => p.isLocalPlayer);
        if (localPlayer && !localPlayer.isDead && localPlayer.witnessedKillerName) {
            setTimeout(() => {
                if (this.active) {
                    const victimName = localPlayer.witnessedVictimName ? localPlayer.witnessedVictimName.toUpperCase() : "SOMEONE";
                    const msgText = localPlayer.witnessedViaCams ?
                        `🚨 I SAW IN CAMS THAT ${localPlayer.witnessedKillerName.toUpperCase()} ELIMINATE ${victimName}! IT'S THEM!` :
                        `🚨 I SAW ${localPlayer.witnessedKillerName.toUpperCase()} ELIMINATE ${victimName} IN FRONT OF ME! IT'S THEM!`;
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

        // Select a subset of up to 5 bots to speak in chat to prevent message spam
        const talkers = [...aliveBots].sort(() => 0.5 - Math.random()).slice(0, 5);
        talkers.forEach((bot, index) => {
            setTimeout(() => {
                if (!this.active) return;
                let lineText = "";
                if (bot.witnessedKillerName) {
                    const victimName = bot.witnessedVictimName ? bot.witnessedVictimName.toUpperCase() : "SOMEONE";
                    if (bot.witnessedViaCams) {
                        lineText = `🚨 I SAW IN CAMS THAT ${bot.witnessedKillerName.toUpperCase()} ELIMINATE ${victimName}! IT'S THEM!`;
                    } else {
                        lineText = `🚨 I SAW ${bot.witnessedKillerName.toUpperCase()} ELIMINATE ${victimName} IN FRONT OF ME! IT'S THEM!`;
                    }
                } else if (this.accusedId !== null && Math.random() < 0.5) {
                    const accusedPlayer = players.find(p => p.id === this.accusedId);
                    if (accusedPlayer) {
                        lineText = `I agree, ${accusedPlayer.name} looks super suspicious!`;
                    } else {
                        lineText = `Let's vote carefully crewmates.`;
                    }
                } else {
                    const botRoom = getPlayerRoom(bot, ROOMS);
                    const sameRoomPlayers = players.filter(p => p.id !== bot.id && !p.isDead && getPlayerRoom(p, ROOMS) === botRoom);
                    
                    let lines = [];
                    if (botRoom !== 'Corridors') {
                        lines.push(`I was in ${botRoom} finishing my tasks!`);
                        lines.push(`I was in the ${botRoom} area.`);
                        if (sameRoomPlayers.length > 0) {
                            const companion = sameRoomPlayers[Math.floor(Math.random() * sameRoomPlayers.length)];
                            lines.push(`I was with ${companion.name} in ${botRoom}, they seem innocent!`);
                            lines.push(`I saw ${companion.name} in ${botRoom} doing tasks.`);
                        } else {
                            lines.push(`I was alone in ${botRoom}.`);
                        }
                    } else {
                        lines.push(`I was moving through the corridors.`);
                        const nearby = players.filter(p => p.id !== bot.id && !p.isDead && Math.hypot(p.x - bot.x, p.y - bot.y) < 300);
                        if (nearby.length > 0) {
                            const seen = nearby[Math.floor(Math.random() * nearby.length)];
                            const seenRoom = getPlayerRoom(seen, ROOMS);
                            lines.push(`Did anyone see ${seen.name}? I saw them near ${seenRoom}.`);
                            lines.push(`I saw ${seen.name} near ${seenRoom}.`);
                        } else {
                            lines.push(`I didn't see anyone near me.`);
                        }
                    }

                    if (this.bodyPlayer) {
                        lines.push(`Oh no, they got ${this.bodyPlayer.name}! 😢`);
                        lines.push(`Poor ${this.bodyPlayer.name}! Who did it?`);
                        lines.push(`Where exactly did you find ${this.bodyPlayer.name}'s body?`);
                    } else {
                        lines.push(`If we're not sure, let's skip this vote.`);
                        lines.push(`Did anyone see anything suspicious?`);
                    }
                    
                    lineText = lines[Math.floor(Math.random() * lines.length)];
                }

                const msg = document.createElement('div');
                msg.className = 'chat-msg bot-msg';
                msg.innerHTML = `<strong>${bot.name}:</strong> ${lineText}`;
                this.appendChatMessage(chatContainer, msg);
            }, (index + 1) * 600);
        });

        // Loop all alive bots to cast their votes with a fast, randomized delay (0.8s to 3.5s)
        aliveBots.forEach((bot) => {
            const voteDelay = 800 + Math.random() * 2700;
            setTimeout(() => {
                if (!this.active) return;
                if (bot.witnessedKillerId !== undefined && bot.witnessedKillerId !== null) {
                    this.votes[bot.id] = bot.witnessedKillerId;
                } else if (this.accusedId !== null) {
                    const r = Math.random();
                    if (r < 0.85) { // Crewmates are much more unified when someone is accused!
                        this.votes[bot.id] = this.accusedId;
                    } else if (r < 0.95) {
                        this.votes[bot.id] = 'skip';
                    } else {
                        const choices = players.filter(pl => !pl.isDead).map(pl => pl.id);
                        choices.push('skip');
                        this.votes[bot.id] = choices[Math.floor(Math.random() * choices.length)];
                    }
                } else {
                    // Check if there is any highly suspected player (> 40% sus) for this bot specifically
                    let localAccusedId = null;
                    let highestSusVal = 0;
                    if (bot.suspicionLevels) {
                        for (const [suspectedId, value] of Object.entries(bot.suspicionLevels)) {
                            const pl = players.find(p => p.id == suspectedId);
                            if (pl && !pl.isDead && value > highestSusVal) {
                                highestSusVal = value;
                                localAccusedId = suspectedId;
                            }
                        }
                    }
                    if (localAccusedId !== null && highestSusVal >= 40) {
                        const r = Math.random();
                        if (r < 0.80) {
                            this.votes[bot.id] = localAccusedId;
                        } else {
                            this.votes[bot.id] = 'skip';
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
                }
                const tag = document.getElementById(`vote-tag-${bot.id}`);
                if (tag) tag.innerText = '🗳️ VOTED';
                soundManager.playVoteClick();

                // Check if meeting should end early because everyone voted (with 10s minimum)
                const alivePlayers = players.filter(pl => !pl.isDead);
                const allVoted = alivePlayers.every(pl => this.votes[pl.id] !== undefined);
                if (allVoted) {
                    const elapsed = 30 - this.timer;
                    if (elapsed >= 10) {
                        this.tallyVotes(players);
                    } else {
                        const remainingToWait = (10 - elapsed) * 1000;
                        setTimeout(() => {
                            if (this.active) {
                                const checkAlive = players.filter(pl => !pl.isDead);
                                const checkAllVoted = checkAlive.every(pl => this.votes[pl.id] !== undefined);
                                if (checkAllVoted) {
                                    this.tallyVotes(players);
                                }
                            }
                        }, remainingToWait);
                    }
                }
            }, voteDelay);
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

        // Process accusation check
        const lowerMsg = msgText.toLowerCase();
        const accuseKeywords = ['sus', 'impostor', 'imposter', 'dog', 'killer', 'accuse', 'vote', 'evil', 'guilty', 'lying', 'vented', 'eliminate'];
        const isAccusation = accuseKeywords.some(keyword => lowerMsg.includes(keyword));
        if (isAccusation) {
            for (const p of players) {
                if (!p.isLocalPlayer && !p.isDead && lowerMsg.includes(p.name.toLowerCase())) {
                    players.forEach(other => {
                        if (!other.isDead) {
                            if (!other.suspicionLevels) other.suspicionLevels = {};
                            other.suspicionLevels[p.id] = Math.min(100, (other.suspicionLevels[p.id] || 0) + 50);
                        }
                    });
                    this.accusedId = p.id;
                    break;
                }
            }
        }

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
        if (this.selectedVote && this.selectedVote !== 'skip') {
            const targetPlayer = players.find(p => p.id === this.selectedVote);
            if (targetPlayer) {
                players.forEach(other => {
                    if (!other.isDead) {
                        if (!other.suspicionLevels) other.suspicionLevels = {};
                        other.suspicionLevels[targetPlayer.id] = Math.min(100, (other.suspicionLevels[targetPlayer.id] || 0) + 50);
                    }
                });
            }
        }
        soundManager.playVoteClick();

        const alivePlayers = players.filter(pl => !pl.isDead);
        const allVoted = alivePlayers.every(pl => this.votes[pl.id] !== undefined);
        if (allVoted) {
            const elapsed = 30 - this.timer;
            if (elapsed >= 10) {
                this.tallyVotes(players);
            } else {
                const remainingToWait = (10 - elapsed) * 1000;
                setTimeout(() => {
                    if (this.active) {
                        const checkAlive = players.filter(pl => !pl.isDead);
                        const checkAllVoted = checkAlive.every(pl => this.votes[pl.id] !== undefined);
                        if (checkAllVoted) {
                            this.tallyVotes(players);
                        }
                    }
                }, remainingToWait);
            }
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
        let skipVotes = counts['skip'] || 0;

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

        let actualEjectedPlayer = null;
        let isSkipped = false;
        let isActualTie = isTie;

        if (maxVotes === 0 && skipVotes === 0) {
            isSkipped = true;
        } else if (skipVotes > maxVotes) {
            isSkipped = true;
        } else if (skipVotes === maxVotes) {
            isActualTie = true;
        } else if (isTie) {
            isActualTie = true;
        } else {
            actualEjectedPlayer = players.find(p => p.id == ejectedId);
        }

        // Increase suspicion for players who got votes
        for (const [id, count] of Object.entries(counts)) {
            if (id === 'skip') continue;
            const targetPlayer = players.find(p => p.id == id);
            if (targetPlayer) {
                players.forEach(p => {
                    if (!p.isLocalPlayer) {
                        if (!p.suspicionLevels) p.suspicionLevels = {};
                        p.suspicionLevels[targetPlayer.id] = Math.min(100, (p.suspicionLevels[targetPlayer.id] || 0) + count * 15);
                    }
                });
            }
        }

        setTimeout(() => {
                actualEjectedPlayer.isDead = true;
                actualEjectedPlayer.isEjected = true;
            }
            this.onComplete(actualEjectedPlayer, isActualTie, isSkipped);
        }, 3500);
    }
}
