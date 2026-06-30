// Cat Crew Standalone Game Bundle (CORS-free for file:// protocol)

// ==========================================
// 1. SOUND MANAGER
// ==========================================
class SoundManager {
    constructor() {
        this.ctx = null;
        this.enabled = true;
    }

    init() {
        if (!this.ctx) {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            this.ctx = new AudioContext();
        }
        if (this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    }

    playFootstep() {
        if (!this.enabled || !this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(120, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(40, this.ctx.currentTime + 0.05);
        gain.gain.setValueAtTime(0.05, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.05);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.05);
    }

    playTaskComplete() {
        if (!this.enabled || !this.ctx) return;
        const now = this.ctx.currentTime;
        const notes = [523.25, 659.25, 783.99, 1046.50];
        notes.forEach((freq, i) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(freq, now + i * 0.08);
            gain.gain.setValueAtTime(0.15, now + i * 0.08);
            gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.08 + 0.2);
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(now + i * 0.08);
            osc.stop(now + i * 0.08 + 0.2);
        });
    }

    playVentWhoosh() {
        if (!this.enabled || !this.ctx) return;
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(300, now);
        osc.frequency.exponentialRampToValueAtTime(80, now + 0.3);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.3);
    }

    playElimination() {
        if (!this.enabled || !this.ctx) return;
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(150, now);
        osc.frequency.linearRampToValueAtTime(40, now + 0.4);
        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.4);
    }

    playEmergencyAlarm() {
        if (!this.enabled || !this.ctx) return;
        const now = this.ctx.currentTime;
        for (let i = 0; i < 3; i++) {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'square';
            osc.frequency.setValueAtTime(880, now + i * 0.25);
            osc.frequency.setValueAtTime(698.46, now + i * 0.25 + 0.12);
            gain.gain.setValueAtTime(0.1, now + i * 0.25);
            gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.25 + 0.22);
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(now + i * 0.25);
            osc.stop(now + i * 0.25 + 0.22);
        }
    }

    playVoteClick() {
        if (!this.enabled || !this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(600, this.ctx.currentTime);
        gain.gain.setValueAtTime(0.1, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.05);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.05);
    }

    playVictory() {
        if (!this.enabled || !this.ctx) return;
        const now = this.ctx.currentTime;
        const melody = [440, 554.37, 659.25, 880];
        melody.forEach((freq, i) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(freq, now + i * 0.15);
            gain.gain.setValueAtTime(0.2, now + i * 0.15);
            gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.15 + 0.4);
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(now + i * 0.15);
            osc.stop(now + i * 0.15 + 0.4);
        });
    }

    playDefeat() {
        if (!this.enabled || !this.ctx) return;
        const now = this.ctx.currentTime;
        const melody = [300, 280, 260, 220];
        melody.forEach((freq, i) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(freq, now + i * 0.2);
            gain.gain.setValueAtTime(0.2, now + i * 0.2);
            gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.2 + 0.35);
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(now + i * 0.2);
            osc.stop(now + i * 0.2 + 0.35);
        });
    }
}
const soundManager = new SoundManager();

// ==========================================
// 2. SPRITE RENDERER & COLORS
// ==========================================
const CAT_COLORS = [
    { name: 'Orange Tabby', main: '#F5A623', highlight: '#F7BF56', legs: '#E8941E', ear: '#FF8FAB', nose: '#FF6B8A', paw: '#FFFFFF' },
    { name: 'Tuxedo', main: '#222222', highlight: '#333333', legs: '#1a1a1a', ear: '#FF8FAB', nose: '#FF6B8A', paw: '#FFFFFF' },
    { name: 'Calico', main: '#E8A050', highlight: '#F0C080', legs: '#CC8833', ear: '#FFB6C1', nose: '#FF6B8A', paw: '#FFFFFF' },
    { name: 'Shadow', main: '#2a2a3e', highlight: '#3a3a50', legs: '#1a1a2e', ear: '#8866AA', nose: '#AA88CC', paw: '#4a4a5e' },
    { name: 'Snow', main: '#E8E8F0', highlight: '#F5F5FF', legs: '#D0D0DA', ear: '#FFB0C0', nose: '#FF8899', paw: '#FFFFFF' },
    { name: 'Ginger', main: '#CC5500', highlight: '#DD7722', legs: '#AA4400', ear: '#FF8FAB', nose: '#FF4466', paw: '#FFE0CC' },
    { name: 'Siamese', main: '#E8DCC8', highlight: '#F0E8D8', legs: '#8B7355', ear: '#8B7355', nose: '#A08060', paw: '#DDD0C0' },
    { name: 'Galaxy', main: '#2B1055', highlight: '#4A2080', legs: '#1A0A40', ear: '#FF66AA', nose: '#FF88CC', paw: '#7B68EE' }
];

const HATS = [
    { name: 'None', type: 'none' },
    { name: 'Crown', type: 'crown' },
    { name: 'Beanie', type: 'beanie' },
    { name: 'Top Hat', type: 'top_hat' },
    { name: 'Red Bow', type: 'bow' },
    { name: 'Flower', type: 'flower' },
    { name: 'Pirate Hat', type: 'pirate' },
    { name: 'Astronaut Helmet', type: 'astronaut' }
];

class SpriteRenderer {
    static drawPlayer(ctx, x, y, radius, player, isGhost = false) {
        if (!player || !ctx) return;
        try {
            ctx.save();
            ctx.translate(x, y);

            const isActualGhost = isGhost || (player.isDead && player.bodyCleaned);

            if (isActualGhost) {
                ctx.globalAlpha = 0.5;
            }

            const colorObj = (player.colorIndex !== undefined && CAT_COLORS[Math.abs(player.colorIndex) % CAT_COLORS.length]) ? CAT_COLORS[Math.abs(player.colorIndex) % CAT_COLORS.length] : CAT_COLORS[0];

            if (player.isDead && !player.bodyCleaned) {
                if (player.killedByInvader) {
                    ctx.save();
                    ctx.rotate(Math.PI / 2);
                    ctx.translate(0, -5);
                    this.drawCat(ctx, radius, colorObj, player);
                    ctx.save();
                    ctx.strokeStyle = '#d63031';
                    ctx.lineWidth = 2.5;
                    ctx.lineCap = 'round';
                    
                    // Scratch 1
                    ctx.beginPath();
                    ctx.moveTo(-10, -5); ctx.lineTo(-4, 5);
                    ctx.moveTo(-6, -7); ctx.lineTo(0, 3);
                    ctx.moveTo(-14, -3); ctx.lineTo(-8, 7);
                    ctx.stroke();

                    // Scratch 2
                    ctx.beginPath();
                    ctx.moveTo(4, -8); ctx.lineTo(10, 2);
                    ctx.moveTo(8, -10); ctx.lineTo(14, 0);
                    ctx.moveTo(0, -6); ctx.lineTo(6, 4);
                    ctx.stroke();

                    // Scratch 3
                    ctx.beginPath();
                    ctx.moveTo(-2, -15); ctx.lineTo(4, -5);
                    ctx.moveTo(-5, -13); ctx.lineTo(1, -3);
                    ctx.moveTo(1, -17); ctx.lineTo(7, -7);
                    ctx.stroke();
                    
                    ctx.restore();
                    ctx.restore();

                    // Name tag
                    ctx.save();
                    ctx.globalAlpha = 1.0;
                    ctx.font = '700 13px "Quicksand", sans-serif';
                    ctx.textAlign = 'center';
                    ctx.fillStyle = 'gray';
                    ctx.shadowColor = 'black';
                    ctx.shadowBlur = 4;
                    ctx.fillText(player.name, 0, -radius - 12);
                    ctx.shadowBlur = 0;
                    ctx.restore();

                    ctx.restore();
                    return;
                } else {
                    this.drawDeadBody(ctx, radius, colorObj);
                    ctx.restore();
                    return;
                }
            }

            // Standard Body Shadow
            if (!isActualGhost) {
                ctx.beginPath();
                ctx.arc(0, radius * 0.5, radius * 0.7, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
                ctx.fill();
            }

            // Subtle Red Impostor Aura for Local Dog Player only
            if (player.role === 'evil Dog' && player.isLocalPlayer && !isActualGhost) {
                ctx.beginPath();
                ctx.arc(0, 0, radius + 5, 0, Math.PI * 2);
                ctx.strokeStyle = 'rgba(214, 48, 49, 0.6)';
                ctx.lineWidth = 3;
                ctx.stroke();
            }

            // Always draw normal cute Cat sprite
            this.drawCat(ctx, radius, colorObj, player);

            if (player.health < 3 && player.health > 0) {
                ctx.save();
                ctx.strokeStyle = '#d63031';
                ctx.lineWidth = 2.5;
                ctx.lineCap = 'round';
                ctx.beginPath();
                ctx.moveTo(-10, -5); ctx.lineTo(-4, 5);
                ctx.moveTo(-6, -7); ctx.lineTo(0, 3);
                ctx.moveTo(-14, -3); ctx.lineTo(-8, 7);
                ctx.stroke();

                if (player.health === 1) {
                    ctx.beginPath();
                    ctx.moveTo(4, -8); ctx.lineTo(10, 2);
                    ctx.moveTo(8, -10); ctx.lineTo(14, 0);
                    ctx.moveTo(0, -6); ctx.lineTo(6, 4);
                    ctx.stroke();
                }
                ctx.restore();
            }

            // Draw Hat on top
            if (player.hatIndex > 0 && HATS[player.hatIndex]) {
                this.drawHat(ctx, radius, HATS[player.hatIndex].type);
            }

            // Draw Name Tag
            ctx.globalAlpha = 1.0;
            ctx.font = '700 13px "Quicksand", sans-serif';
            ctx.textAlign = 'center';
            let displayName = player.name;
            let fillStyle = (player.role === 'evil Dog' && player.isLocalPlayer) ? '#ff7675' : '#ffffff';
            if (window.gameInstance && window.gameInstance.localPlayer && window.gameInstance.localPlayer.role === 'Detective' && !player.isLocalPlayer) {
                if (player.lastKillTimestamp && Date.now() - player.lastKillTimestamp <= 15000) {
                    fillStyle = '#ff7675';
                    displayName = '🔍 ' + player.name + ' (KILLED!)';
                }
            }
            ctx.fillStyle = fillStyle;
            ctx.shadowColor = 'black';
            ctx.shadowBlur = 4;
            ctx.fillText(displayName, 0, -radius - 12);
            ctx.shadowBlur = 0;

            if (player.hasGun) {
                ctx.save();
                let targetInv = null;
                if (window.gameInstance && window.gameInstance.defensiveProtocolActive && window.gameInstance.invaders) {
                    const nearby = window.gameInstance.invaders.filter(inv => Math.hypot(player.x - inv.x, player.y - inv.y) <= 300);
                    if (nearby.length > 0) {
                        nearby.sort((a, b) => Math.hypot(player.x - a.x, player.y - a.y) - Math.hypot(player.x - b.x, player.y - b.y));
                        targetInv = nearby[0];
                    }
                }

                if (targetInv) {
                    const handX = player.scaleX * (radius + 6);
                    const handY = radius * 0.1;
                    const targetLocalX = (targetInv.x - player.x) * player.scaleX;
                    const targetLocalY = targetInv.y - player.y;
                    const angle = Math.atan2(targetLocalY - handY, targetLocalX - handX);
                    
                    ctx.translate(handX, handY);
                    ctx.rotate(angle);
                    
                    // Draw gun pointing forward relative to the rotation angle
                    ctx.fillStyle = '#2d3436';
                    ctx.fillRect(-6, 2, 4, 8); // Handle
                    
                    ctx.fillStyle = '#7f8c8d';
                    ctx.fillRect(0, -2, 10, 5); // Barrel
                    ctx.fillStyle = '#00cec9';
                    ctx.fillRect(4, -1, 4, 3); // Cyan power cell
                } else {
                    ctx.translate(player.scaleX === -1 ? -radius - 6 : radius + 6, radius * 0.1);
                    
                    // Blaster Handle
                    ctx.fillStyle = '#2d3436';
                    ctx.fillRect(-6, 2, 4, 8);
                    
                    // Blaster Barrel
                    ctx.fillStyle = '#7f8c8d';
                    if (player.scaleX === -1) {
                        ctx.fillRect(-12, -2, 10, 5);
                        ctx.fillStyle = '#00cec9'; // Glowing cyan cell
                        ctx.fillRect(-10, -1, 4, 3);
                    } else {
                        ctx.fillRect(2, -2, 10, 5);
                        ctx.fillStyle = '#00cec9'; // Glowing cyan cell
                        ctx.fillRect(6, -1, 4, 3);
                    }
                }
                ctx.restore();
            }

            ctx.restore();
        } catch (err) {
            console.error('Error drawing player:', err);
            try { ctx.restore(); } catch(e){}
        }
    }

    static drawCat(ctx, radius, colorObj, player) {
        const bodyColor = colorObj.main || '#F5A623';
        const highlightColor = colorObj.accent || '#F7BF56';
        const earColor = '#FF8FAB';
        const noseColor = '#FF6B8A';
        const pawColor = '#FFFFFF';
        const legsColor = colorObj.accent;

        const d = player.scaleX || 1;
        const cx = -12;
        const cy = -14;
        const f = d === -1;

        function px(rx, ry, w, h, col) {
            ctx.fillStyle = col;
            ctx.fillRect(f ? cx + 24 - rx - w : cx + rx, cy + ry, w, h);
        }

        // 1. Tail
        const wave = Math.sin((window.gameInstance?.gameTimer || 0) * 8) * 2;
        px(-4, 8 + wave, 6, 4, bodyColor);
        px(-6, 5 + wave, 4, 5, legsColor);

        // 2. Body
        px(2, 10, 20, 16, bodyColor);
        px(4, 12, 16, 12, highlightColor);

        // 3. Head
        px(6, 0, 16, 14, bodyColor);
        px(8, 2, 12, 10, highlightColor);

        // 4. Ears
        px(6, -4, 4, 6, bodyColor);
        px(16, -4, 4, 6, bodyColor);
        px(7, -3, 2, 4, earColor);
        px(17, -3, 2, 4, earColor);

        // 5. Eyes
        // 5. Eyes
        if (player.isDead && player.killedByInvader) {
            px(9, 3, 1, 1, '#1a1a2e');
            px(10, 4, 1, 1, '#1a1a2e');
            px(11, 5, 1, 1, '#1a1a2e');
            px(11, 3, 1, 1, '#1a1a2e');
            px(9, 5, 1, 1, '#1a1a2e');
            
            px(14, 3, 1, 1, '#1a1a2e');
            px(15, 4, 1, 1, '#1a1a2e');
            px(16, 5, 1, 1, '#1a1a2e');
            px(16, 3, 1, 1, '#1a1a2e');
            px(14, 5, 1, 1, '#1a1a2e');
        } else {
            px(9, 4, 3, 3, '#FFFFFF');
            px(14, 4, 3, 3, '#FFFFFF');
            px(10, 5, 2, 2, '#1a1a2e');
            px(15, 5, 2, 2, '#1a1a2e');
        }

        // 6. Nose
        px(12, 8, 2, 2, noseColor);

        // 7. Whiskers
        px(2, 7, 4, 1, '#DDDDDD');
        px(20, 7, 4, 1, '#DDDDDD');
        px(2, 9, 5, 1, '#DDDDDD');
        px(19, 9, 5, 1, '#DDDDDD');

        // 8. Legs (Walking animation)
        const isMoving = Math.hypot(player.vx || 0, player.vy || 0) > 0.1 || (player.isLocalPlayer && (window.gameInstance?.keysPressed['KeyW'] || window.gameInstance?.keysPressed['KeyS'] || window.gameInstance?.keysPressed['KeyA'] || window.gameInstance?.keysPressed['KeyD'] || window.gameInstance?.keysPressed['ArrowUp'] || window.gameInstance?.keysPressed['ArrowDown'] || window.gameInstance?.keysPressed['ArrowLeft'] || window.gameInstance?.keysPressed['ArrowRight']));
        const isBotMoving = !player.isLocalPlayer && player.currentPath && player.currentPath.length > 0;

        if (isMoving || isBotMoving) {
            const lo = Math.sin((window.gameInstance?.gameTimer || 0) * 15) * 3;
            px(4, 26, 4, Math.max(2, 5 + lo), legsColor);
            px(12, 26, 4, Math.max(2, 5 - lo), legsColor);
            px(18, 26, 4, Math.max(2, 5 + lo), legsColor);

            px(4, 30 + lo, 5, 2, pawColor);
            px(12, 30 - lo, 5, 2, pawColor);
            px(18, 30 + lo, 5, 2, pawColor);
        } else {
            px(4, 26, 4, 5, legsColor);
            px(12, 26, 4, 5, legsColor);
            px(18, 26, 4, 5, legsColor);

            px(4, 30, 5, 2, pawColor);
            px(12, 30, 5, 2, pawColor);
            px(18, 30, 5, 2, pawColor);
        }
    }

    static drawDog(ctx, radius, colorObj, player) {
        ctx.beginPath();
        ctx.ellipse(0, 0, radius * 1.1, radius * 0.95, 0, 0, Math.PI * 2);
        ctx.fillStyle = '#d63031';
        ctx.fill();

        ctx.fillStyle = '#b2bec3';
        ctx.beginPath();
        ctx.ellipse(-radius * 1.0, 0, 8, 16, Math.PI * 0.2, 0, Math.PI * 2);
        ctx.ellipse(radius * 1.0, 0, 8, 16, -Math.PI * 0.2, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#ffeaa7';
        ctx.beginPath();
        ctx.ellipse(0, radius * 0.25, 10, 7, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#2d3436';
        ctx.beginPath();
        ctx.arc(0, radius * 0.15, 4, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#d63031';
        ctx.beginPath();
        ctx.arc(-radius * 0.35, -radius * 0.15, 4, 0, Math.PI * 2);
        ctx.arc(radius * 0.35, -radius * 0.15, 4, 0, Math.PI * 2);
        ctx.fill();
    }

    static drawHat(ctx, radius, hatType) {
        ctx.save();
        ctx.translate(0, -radius * 0.85);

        switch (hatType) {
            case 'crown':
                ctx.fillStyle = '#fdcb6e';
                ctx.beginPath();
                ctx.moveTo(-12, 0); ctx.lineTo(-15, -18); ctx.lineTo(-7, -8);
                ctx.lineTo(0, -22); ctx.lineTo(7, -8); ctx.lineTo(15, -18); ctx.lineTo(12, 0);
                ctx.closePath(); ctx.fill();
                break;
            case 'beanie':
                ctx.fillStyle = '#6c5ce7';
                ctx.beginPath(); ctx.arc(0, -5, 14, Math.PI, 0); ctx.fill();
                ctx.fillStyle = '#ff758c';
                ctx.beginPath(); ctx.arc(0, -18, 5, 0, Math.PI * 2); ctx.fill();
                break;
            case 'top_hat':
                ctx.fillStyle = '#2d3436';
                ctx.fillRect(-16, -2, 32, 4);
                ctx.fillRect(-10, -20, 20, 18);
                ctx.fillStyle = '#d63031';
                ctx.fillRect(-10, -6, 20, 4);
                break;
            case 'bow':
                ctx.fillStyle = '#ff7675';
                ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(-12, -8); ctx.lineTo(-12, 8); ctx.closePath(); ctx.fill();
                ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(12, -8); ctx.lineTo(12, 8); ctx.closePath(); ctx.fill();
                ctx.beginPath(); ctx.arc(0, 0, 4, 0, Math.PI * 2); ctx.fill();
                break;
            case 'flower':
                ctx.fillStyle = '#ff758c';
                for (let i = 0; i < 5; i++) {
                    const ang = (i * Math.PI * 2) / 5;
                    ctx.beginPath(); ctx.arc(Math.cos(ang) * 8, Math.sin(ang) * 8 - 5, 5, 0, Math.PI * 2); ctx.fill();
                }
                ctx.fillStyle = '#fdcb6e';
                ctx.beginPath(); ctx.arc(0, -5, 5, 0, Math.PI * 2); ctx.fill();
                break;
            case 'pirate':
                ctx.fillStyle = '#2d3436';
                ctx.beginPath(); ctx.moveTo(-18, 2); ctx.quadraticCurveTo(0, -25, 18, 2); ctx.closePath(); ctx.fill();
                ctx.fillStyle = 'white';
                ctx.font = '10px sans-serif'; ctx.fillText('☠', 0, -6);
                break;
            case 'astronaut':
                ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
                ctx.lineWidth = 3;
                ctx.beginPath(); ctx.arc(0, radius * 0.4, radius * 1.1, 0, Math.PI * 2); ctx.stroke();
                break;
        }
        ctx.restore();
    }

    static drawDeadBody(ctx, radius, colorObj) {
        ctx.save();
        ctx.rotate(Math.PI / 2);

        const bodyColor = colorObj.main || '#F5A623';
        const highlightColor = colorObj.accent || '#F7BF56';
        const earColor = '#FF8FAB';
        const noseColor = '#FF6B8A';
        const pawColor = '#FFFFFF';
        const legsColor = colorObj.accent;

        const cx = -12;
        const cy = -16;

        function px(rx, ry, w, h, col) {
            ctx.fillStyle = col;
            ctx.fillRect(cx + rx, cy + ry, w, h);
        }

        // Tail
        px(-4, 8, 6, 4, bodyColor);
        px(-6, 5, 4, 5, legsColor);

        // Body
        px(2, 10, 20, 16, bodyColor);
        px(4, 12, 16, 12, highlightColor);

        // Head
        px(6, 0, 16, 14, bodyColor);
        px(8, 2, 12, 10, highlightColor);

        // Ears
        px(6, -4, 4, 6, bodyColor);
        px(16, -4, 4, 6, bodyColor);
        px(7, -3, 2, 4, earColor);
        px(17, -3, 2, 4, earColor);

        // Nose
        px(12, 8, 2, 2, noseColor);

        // Whiskers
        px(2, 7, 4, 1, '#DDDDDD');
        px(20, 7, 4, 1, '#DDDDDD');
        px(2, 9, 5, 1, '#DDDDDD');
        px(19, 9, 5, 1, '#DDDDDD');

        // Legs
        px(4, 26, 4, 5, legsColor);
        px(12, 26, 4, 5, legsColor);
        px(18, 26, 4, 5, legsColor);
        px(4, 30, 5, 2, pawColor);
        px(12, 30, 5, 2, pawColor);
        px(18, 30, 5, 2, pawColor);

        // Closed Dead Eyes (X X)
        px(9, 4, 3, 3, '#FFFFFF');
        px(14, 4, 3, 3, '#FFFFFF');
        ctx.strokeStyle = '#1a1a2e'; ctx.lineWidth = 1.5;
        // Left Eye X
        ctx.beginPath(); ctx.moveTo(cx + 9, cy + 4); ctx.lineTo(cx + 12, cy + 7); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(cx + 12, cy + 4); ctx.lineTo(cx + 9, cy + 7); ctx.stroke();
        // Right Eye X
        ctx.beginPath(); ctx.moveTo(cx + 14, cy + 4); ctx.lineTo(cx + 17, cy + 7); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(cx + 17, cy + 4); ctx.lineTo(cx + 14, cy + 7); ctx.stroke();

        // Big Red Scratch Mark
        ctx.strokeStyle = '#d63031';
        ctx.lineWidth = 3;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(cx + 6, cy + 14); ctx.lineTo(cx + 18, cy + 22);
        ctx.moveTo(cx + 8, cy + 12); ctx.lineTo(cx + 20, cy + 20);
        ctx.moveTo(cx + 10, cy + 10); ctx.lineTo(cx + 22, cy + 18);
        ctx.stroke();

        ctx.restore();
    }
}

const MAP_BOUNDS = { width: 3600, height: 2600 };

const WHISKER_STATION_ROOMS = [
    {
        id: 'bridge', name: '🚀 Bridge', color: '#48dbfb', bgColor: '#1b2a47',
        x: 1550, y: 150, width: 500, height: 320, icon: '🚀',
        tasks: [ { id: 'nav_ship', name: 'Navigate Ship Path', x: 1680, y: 250 }, { id: 'scan_asteroids', name: 'Scan Space Sector', x: 1920, y: 250 }, { id: 'upload_data', name: 'Upload Data to HQ', x: 1800, y: 200 } ],
        hasEmergencyButton: true, buttonX: 1800, buttonY: 310
    },
    {
        id: 'medical', name: '🏥 Medical', color: '#ff6b6b', bgColor: '#2d1b24',
        x: 850, y: 250, width: 450, height: 320, icon: '🏥',
        tasks: [ { id: 'med_scan', name: 'Submit Med Scan', x: 970, y: 380 }, { id: 'treat_scratches', name: 'Treat Paw Scratches', x: 1180, y: 380 } ]
    },
    {
        id: 'weapons', name: '⚔️ Weapons', color: '#ff793f', bgColor: '#331e1b',
        x: 2300, y: 250, width: 450, height: 320, icon: '⚔️',
        tasks: [ { id: 'clear_asteroids', name: 'Clear Asteroids', x: 2420, y: 380 }, { id: 'load_torpedoes', name: 'Load Catnip Torpedoes', x: 2620, y: 380 } ]
    },
    {
        id: 'security', name: '📹 Security', color: '#a29bfe', bgColor: '#201b3a',
        x: 250, y: 700, width: 400, height: 350, icon: '📹',
        tasks: [ { id: 'monitor_cams', name: 'Monitor Security Feeds', x: 380, y: 750 }, { id: 'rewind_tapes', name: 'Rewind Security Tapes', x: 520, y: 750 } ]
    },
    {
        id: 'fish_storage', name: '🐟 Fish Storage', color: '#00cec9', bgColor: '#1b2d33',
        x: 800, y: 700, width: 450, height: 350, icon: '🐟',
        tasks: [ { id: 'sort_fish', name: 'Sort Fish Bins', x: 920, y: 850 }, { id: 'check_freezer', name: 'Check Freezer Temp', x: 1120, y: 850 } ]
    },
    {
        id: 'ship_quarters', name: '🛏️ Ship Quarters', color: '#a29bfe', bgColor: '#27203d',
        x: 1550, y: 650, width: 500, height: 320, icon: '🛏️',
        tasks: [ { id: 'make_beds', name: 'Make Scratching Beds', x: 1680, y: 780 }, { id: 'clean_litter', name: 'Clean Space Litter', x: 1920, y: 780 } ]
    },
    {
        id: 'electrical', name: '⚡ Electrical', color: '#fbc531', bgColor: '#332e1b',
        x: 2350, y: 700, width: 450, height: 350, icon: '⚡',
        tasks: [ { id: 'calibrate_distributor', name: 'Calibrate Power', x: 2470, y: 850 }, { id: 'download_data', name: 'Download Power Logs', x: 2670, y: 850 } ],
        hasLightsFixPanel: true, lightsFixX: 2570, lightsFixY: 850
    },
    {
        id: 'shields', name: '🛡️ Shields', color: '#e84118', bgColor: '#331c1c',
        x: 2950, y: 700, width: 400, height: 350, icon: '🛡️',
        tasks: [ { id: 'prime_shields', name: 'Prime Deflector Shields', x: 3080, y: 850 }, { id: 'realign_panels', name: 'Realign Shield Panels', x: 3220, y: 850 } ]
    },
    {
        id: 'o2', name: '💨 Oxygen', color: '#2ed573', bgColor: '#1c3325',
        x: 250, y: 1150, width: 400, height: 350, icon: '💨',
        tasks: [ { id: 'clean_filters', name: 'Clean Oxygen Filter', x: 380, y: 1300 }, { id: 'refill_tanks', name: 'Refill O2 Storage Tanks', x: 520, y: 1300 } ]
    },
    {
        id: 'nap_quarters', name: '💤 Nap Quarters', color: '#9c88ff', bgColor: '#252136',
        x: 850, y: 1150, width: 450, height: 350, icon: '💤',
        tasks: [ { id: 'fluff_pillows', name: 'Fluff Nap Pillows', x: 970, y: 1300 }, { id: 'fix_clock', name: 'Set Alarm Clock', x: 1180, y: 1300 } ]
    },
    {
        id: 'cargo_bay', name: '📦 Cargo Bay', color: '#e84118', bgColor: '#301c22',
        x: 1550, y: 1150, width: 500, height: 350, icon: '📦',
        tasks: [ { id: 'sort_boxes', name: 'Sort Supply Crates', x: 1680, y: 1300 }, { id: 'check_manifest', name: 'Check Cargo Manifest', x: 1920, y: 1300 } ]
    },
    {
        id: 'kitchen', name: '🍽️ Kitchen', color: '#e1b12c', bgColor: '#332a1b',
        x: 2300, y: 1150, width: 450, height: 350, icon: '🍽️',
        tasks: [ { id: 'cook_fish', name: 'Prepare Fish Feast', x: 2420, y: 1300 }, { id: 'wash_bowls', name: 'Wash Food Bowls', x: 2620, y: 1300 } ]
    },
    {
        id: 'comms', name: '📡 Communications', color: '#0984e3', bgColor: '#1c2833',
        x: 2950, y: 1150, width: 400, height: 350, icon: '📡',
        tasks: [ { id: 'reboot_wifi', name: 'Reboot Space Comm Router', x: 3080, y: 1300 }, { id: 'download_comms', name: 'Download Signal Decryption', x: 3220, y: 1300 } ],
        hasCommsFixPanel: true, commsFixX: 3150, commsFixY: 1325
    },
    {
        id: 'records', name: '🗃️ Catnip Records', color: '#10ac84', bgColor: '#162b25',
        x: 250, y: 1600, width: 400, height: 350, icon: '🗃️',
        tasks: [ { id: 'file_records', name: 'File Catnip Inventory', x: 380, y: 1770 }, { id: 'scan_id', name: 'Scan Crewmate Paw ID', x: 520, y: 1770 } ]
    },
    {
        id: 'cat_garden', name: '🌿 Cat Garden', color: '#4cd137', bgColor: '#1b3320',
        x: 800, y: 1600, width: 450, height: 380, icon: '🌿',
        tasks: [ { id: 'water_plants', name: 'Water Catnip', x: 920, y: 1770 }, { id: 'trim_catnip', name: 'Trim Garden Hedges', x: 1120, y: 1770 } ]
    },
    {
        id: 'workshop', name: '🛠️ Workshop', color: '#487eb0', bgColor: '#1b2733',
        x: 2350, y: 1600, width: 450, height: 380, icon: '🛠️',
        tasks: [ { id: 'fix_wiring', name: 'Fix Electrical Wires', x: 2470, y: 1770 }, { id: 'tighten_bolts', name: 'Tighten Hull Bolts', x: 2670, y: 1770 }, { id: 'pickup_torpedo', name: 'Retrieve Catnip Torpedo', x: 2570, y: 1840 } ]
    },
    {
        id: 'thruster_a', name: '🚀 Thruster A', color: '#e84118', bgColor: '#331b1b',
        x: 200, y: 2050, width: 450, height: 420, icon: '🚀',
        tasks: [ { id: 'prime_thruster_a', name: 'Prime Left Thruster', x: 320, y: 2240 }, { id: 'flush_fuel_a', name: 'Flush Engine Fuel A', x: 520, y: 2240 } ]
    },
    {
        id: 'yarn_engine', name: '🧶 Yarn Engine', color: '#ff5252', bgColor: '#331b23',
        x: 1550, y: 2050, width: 500, height: 420, icon: '🧶',
        tasks: [ { id: 'untangle_yarn', name: 'Untangle Yarn Spool', x: 1680, y: 2240 }, { id: 'calibrate_engine', name: 'Calibrate Engine Dials', x: 1920, y: 2240 } ],
        hasEngineFixPanel: true, engineFixX: 1800, engineFixY: 2350
    },
    {
        id: 'thruster_b', name: '🚀 Thruster B', color: '#e84118', bgColor: '#331b1b',
        x: 2950, y: 2050, width: 450, height: 420, icon: '🚀',
        tasks: [ { id: 'prime_thruster_b', name: 'Prime Right Thruster', x: 3070, y: 2240 }, { id: 'flush_fuel_b', name: 'Flush Engine Fuel B', x: 3270, y: 2240 } ]
    },
    {
        id: 'admin', name: '💼 Admin Room', color: '#ff7675', bgColor: '#2d1a24',
        x: 2950, y: 1600, width: 400, height: 350, icon: '💼',
        tasks: [ { id: 'swipe_card', name: 'Swipe Admin Card', x: 3080, y: 1770 }, { id: 'upload_admin', name: 'Upload Admin Logs', x: 3220, y: 1770 } ]
    }
];

const WHISKER_STATION_CORRIDORS = [
    { x1: 1800, y1: 300, x2: 1800, y2: 2260, width: 120 },
    { x1: 1300, y1: 410, x2: 2300, y2: 410, width: 100 },
    { x1: 1250, y1: 875, x2: 2350, y2: 875, width: 100 },
    { x1: 1300, y1: 1325, x2: 2300, y2: 1325, width: 100 },
    { x1: 1250, y1: 1790, x2: 2350, y2: 1790, width: 100 },
    { x1: 650, y1: 2260, x2: 2950, y2: 2260, width: 100 },
    { x1: 650, y1: 875, x2: 800, y2: 875, width: 100 },
    { x1: 2800, y1: 875, x2: 2950, y2: 875, width: 100 },
    { x1: 650, y1: 1325, x2: 850, y2: 1325, width: 100 },
    { x1: 2750, y1: 1325, x2: 2950, y2: 1325, width: 100 },
    { x1: 650, y1: 1790, x2: 800, y2: 1790, width: 100 },
    { x1: 1025, y1: 570, x2: 1025, y2: 700, width: 100 },
    { x1: 1025, y1: 1050, x2: 1025, y2: 1150, width: 100 },
    { x1: 1025, y1: 1500, x2: 1025, y2: 1600, width: 100 },
    { x1: 2575, y1: 570, x2: 2575, y2: 700, width: 100 },
    { x1: 2575, y1: 1050, x2: 2575, y2: 1150, width: 100 },
    { x1: 2575, y1: 1500, x2: 2575, y2: 1600, width: 100 },
    { x1: 2950, y1: 1325, x2: 2950, y2: 2260, width: 100 }
];

const CATNIP_OBSERVATORY_ROOMS = [
    // FLOOR 1
    {
        id: 'bridge', name: '🚀 Bridge', color: '#48dbfb', bgColor: '#1b2a47',
        x: 1150, y: 150, width: 500, height: 350, icon: '🚀',
        tasks: [ { id: 'nav_ship', name: 'Navigate Ship Path', x: 1300, y: 300 }, { id: 'upload_data', name: 'Upload Data to HQ', x: 1500, y: 300 } ],
        hasEmergencyButton: true, buttonX: 1400, buttonY: 350
    },
    {
        id: 'greenhouse', name: '🌿 Catnip Greenhouse', color: '#4cd137', bgColor: '#1b3320',
        x: 200, y: 150, width: 450, height: 350, icon: '🌿',
        tasks: [ { id: 'trim_catnip', name: 'Trim Catnip Hedges', x: 320, y: 320 }, { id: 'water_plants', name: 'Water Catnip Plants', x: 520, y: 320 } ]
    },
    {
        id: 'laser_weapons', name: '⚔️ Laser Weapons', color: '#ff793f', bgColor: '#331e1b',
        x: 2150, y: 150, width: 450, height: 350, icon: '⚔️',
        tasks: [ { id: 'clear_asteroids', name: 'Clear Asteroids', x: 2250, y: 300 }, { id: 'load_torpedoes', name: 'Load Catnip Torpedoes', x: 2450, y: 300 } ]
    },
    {
        id: 'medical', name: '🏥 Medical Bay', color: '#ff6b6b', bgColor: '#2d1b24',
        x: 200, y: 800, width: 450, height: 350, icon: '🏥',
        tasks: [ { id: 'med_scan', name: 'Submit Med Scan', x: 320, y: 970 }, { id: 'treat_scratches', name: 'Treat Paw Scratches', x: 520, y: 970 } ]
    },
    {
        id: 'security', name: '📹 Security', color: '#a29bfe', bgColor: '#201b3a',
        x: 1150, y: 800, width: 500, height: 350, icon: '📹',
        tasks: [ { id: 'monitor_cams', name: 'Monitor Security Feeds', x: 1380, y: 950 }, { id: 'rewind_tapes', name: 'Rewind Security Tapes', x: 1450, y: 950 } ]
    },
    {
        id: 'electrical', name: '⚡ Electrical Room', color: '#fbc531', bgColor: '#332e1b',
        x: 2150, y: 800, width: 450, height: 350, icon: '⚡',
        tasks: [ { id: 'calibrate_distributor', name: 'Calibrate Power', x: 2270, y: 975 }, { id: 'download_data', name: 'Download Power Logs', x: 2470, y: 975 } ],
        hasLightsFixPanel: true, lightsFixX: 2375, lightsFixY: 975
    },
    {
        id: 'reactor', name: '🌀 Reactor Core', color: '#74b9ff', bgColor: '#1e3799',
        x: 200, y: 1450, width: 450, height: 400, icon: '🌀',
        tasks: [ { id: 'untangle_yarn', name: 'Untangle Yarn Spool', x: 320, y: 1650 }, { id: 'calibrate_engine', name: 'Calibrate Engine Dials', x: 520, y: 1650 } ]
    },
    {
        id: 'comms', name: '📡 Communications', color: '#0984e3', bgColor: '#1c2833',
        x: 1150, y: 1450, width: 500, height: 400, icon: '📡',
        tasks: [ { id: 'reboot_wifi', name: 'Reboot Space Comm Router', x: 1300, y: 1650 }, { id: 'download_comms', name: 'Download Signal Decryption', x: 1500, y: 1650 } ],
        hasCommsFixPanel: true, commsFixX: 1400, commsFixY: 1650
    },
    {
        id: 'thrusters', name: '🚀 Thruster Engines', color: '#e84118', bgColor: '#331b1b',
        x: 2150, y: 1450, width: 450, height: 400, icon: '🚀',
        tasks: [ { id: 'prime_thruster_b', name: 'Prime Right Thruster', x: 2270, y: 1650 }, { id: 'flush_fuel_b', name: 'Flush Engine Fuel B', x: 2470, y: 1650 } ],
        hasEngineFixPanel: true, engineFixX: 2375, engineFixY: 1650
    },

    // FLOOR 2
    {
        id: 'fish_storage', name: '🐟 Fish Storage', color: '#00cec9', bgColor: '#1b2d33',
        x: 200, y: 3150, width: 450, height: 350, icon: '🐟',
        tasks: [ { id: 'sort_fish', name: 'Sort Fish Bins', x: 320, y: 3320 }, { id: 'check_freezer', name: 'Check Freezer Temp', x: 520, y: 3320 } ]
    },
    {
        id: 'ship_quarters', name: '🛏️ Ship Quarters', color: '#a29bfe', bgColor: '#27203d',
        x: 1150, y: 3150, width: 500, height: 350, icon: '🛏️',
        tasks: [ { id: 'make_beds', name: 'Make Scratching Beds', x: 1300, y: 3320 }, { id: 'clean_litter', name: 'Clean Space Litter', x: 1500, y: 3320 } ]
    },
    {
        id: 'shields', name: '🛡️ Shields', color: '#e84118', bgColor: '#331c1c',
        x: 2150, y: 3150, width: 450, height: 350, icon: '🛡️',
        tasks: [ { id: 'prime_shields', name: 'Prime Deflector Shields', x: 2270, y: 3320 }, { id: 'realign_panels', name: 'Realign Shield Panels', x: 2470, y: 3320 } ]
    },
    {
        id: 'o2', name: '💨 Oxygen', color: '#2ed573', bgColor: '#1c3325',
        x: 200, y: 3800, width: 450, height: 350, icon: '💨',
        tasks: [ { id: 'clean_filters', name: 'Clean Oxygen Filter', x: 320, y: 3970 }, { id: 'refill_tanks', name: 'Refill O2 Storage Tanks', x: 520, y: 3970 } ]
    },
    {
        id: 'nap_quarters', name: '💤 Nap Quarters', color: '#9c88ff', bgColor: '#252136',
        x: 1150, y: 3800, width: 500, height: 350, icon: '💤',
        tasks: [ { id: 'fluff_pillows', name: 'Fluff Nap Pillows', x: 1300, y: 3970 }, { id: 'fix_clock', name: 'Set Alarm Clock', x: 1500, y: 3970 } ]
    },
    {
        id: 'cargo_bay', name: '📦 Cargo Bay', color: '#e84118', bgColor: '#301c22',
        x: 2150, y: 3800, width: 450, height: 350, icon: '📦',
        tasks: [ { id: 'sort_boxes', name: 'Sort Supply Crates', x: 2270, y: 3970 }, { id: 'check_manifest', name: 'Check Cargo Manifest', x: 2470, y: 3970 } ]
    },
    {
        id: 'kitchen', name: '🍽️ Kitchen', color: '#e1b12c', bgColor: '#332a1b',
        x: 200, y: 4450, width: 450, height: 400, icon: '🍽️',
        tasks: [ { id: 'cook_fish', name: 'Prepare Fish Feast', x: 320, y: 4620 }, { id: 'wash_bowls', name: 'Wash Food Bowls', x: 520, y: 4620 } ]
    },
    {
        id: 'records', name: '🗃️ Catnip Records', color: '#10ac84', bgColor: '#162b25',
        x: 1150, y: 4450, width: 500, height: 400, icon: '🗃️',
        tasks: [ { id: 'file_records', name: 'File Catnip Inventory', x: 1300, y: 4620 }, { id: 'scan_id', name: 'Scan Crewmate Paw ID', x: 1500, y: 4620 } ]
    },
    {
        id: 'workshop', name: '🛠️ Workshop', color: '#487eb0', bgColor: '#1b2733',
        x: 2150, y: 4450, width: 450, height: 400, icon: '🛠️',
        tasks: [ { id: 'fix_wiring', name: 'Fix Electrical Wires', x: 2270, y: 4620 }, { id: 'tighten_bolts', name: 'Tighten Hull Bolts', x: 2470, y: 4620 }, { id: 'pickup_torpedo', name: 'Retrieve Catnip Torpedo', x: 2370, y: 4720 } ]
    },
    {
        id: 'cat_garden', name: '🌿 Cat Garden', color: '#4cd137', bgColor: '#1b3320',
        x: 1150, y: 5100, width: 500, height: 400, icon: '🌿',
        tasks: [ { id: 'water_plants', name: 'Water Catnip', x: 1300, y: 5270 }, { id: 'trim_catnip', name: 'Trim Garden Hedges', x: 1500, y: 5270 } ]
    }
];

const CATNIP_OBSERVATORY_CORRIDORS = [
    // FLOOR 1
    { x1: 1400, y1: 300, x2: 1400, y2: 1800, width: 120 },
    { x1: 650, y1: 975, x2: 2150, y2: 975, width: 100 },
    { x1: 650, y1: 325, x2: 650, y2: 1650, width: 100 },
    { x1: 2150, y1: 325, x2: 2150, y2: 1650, width: 100 },
    { x1: 650, y1: 325, x2: 1150, y2: 325, width: 100 },
    { x1: 1650, y1: 325, x2: 2150, y2: 325, width: 100 },
    { x1: 650, y1: 1650, x2: 1150, y2: 1650, width: 100 },
    { x1: 1650, y1: 1650, x2: 2150, y2: 1650, width: 100 },
    // FLOOR 2
    { x1: 1400, y1: 3300, x2: 1400, y2: 5300, width: 120 },
    { x1: 650, y1: 3325, x2: 2150, y2: 3325, width: 100 },
    { x1: 650, y1: 3975, x2: 2150, y2: 3975, width: 100 },
    { x1: 650, y1: 4650, x2: 2150, y2: 4650, width: 100 },
    { x1: 650, y1: 5300, x2: 1150, y2: 5300, width: 100 },
    { x1: 650, y1: 3325, x2: 650, y2: 4650, width: 100 },
    { x1: 2150, y1: 3325, x2: 2150, y2: 4650, width: 100 }
];

const CATHQ_ROOMS = [
    {
        id: 'bridge', name: '🚀 Bridge', color: '#48dbfb', bgColor: '#1b2a47',
        x: 1750, y: 150, width: 500, height: 350, icon: '🚀',
        tasks: [ { id: 'nav_ship', name: 'Navigate Ship Path', x: 1850, y: 250 }, { id: 'upload_data', name: 'Upload Data to HQ', x: 2000, y: 250 }, { id: 'scan_asteroids', name: 'Scan Space Sector', x: 2150, y: 250 } ],
        hasEmergencyButton: true, buttonX: 2000, buttonY: 320
    },
    {
        id: 'medical', name: '🏥 Medical', color: '#ff6b6b', bgColor: '#2d1b24',
        x: 1050, y: 250, width: 450, height: 320, icon: '🏥',
        tasks: [ { id: 'med_scan', name: 'Submit Med Scan', x: 1150, y: 380 }, { id: 'treat_scratches', name: 'Treat Paw Scratches', x: 1350, y: 380 } ]
    },
    {
        id: 'weapons', name: '⚔️ Weapons', color: '#ff793f', bgColor: '#331e1b',
        x: 2500, y: 250, width: 450, height: 320, icon: '⚔️',
        tasks: [ { id: 'clear_asteroids', name: 'Clear Asteroids', x: 2600, y: 380 }, { id: 'load_torpedoes', name: 'Load Catnip Torpedoes', x: 2800, y: 380 } ]
    },
    {
        id: 'security', name: '📹 Security', color: '#a29bfe', bgColor: '#201b3a',
        x: 450, y: 700, width: 400, height: 350, icon: '📹',
        tasks: [ { id: 'monitor_cams', name: 'Monitor Security Feeds', x: 550, y: 875 }, { id: 'rewind_tapes', name: 'Rewind Security Tapes', x: 750, y: 875 } ]
    },
    {
        id: 'ship_quarters', name: '🛏️ Ship Quarters', color: '#ffeaa7', bgColor: '#2d2d2d',
        x: 1100, y: 750, width: 400, height: 320, icon: '🛏️',
        tasks: [ { id: 'make_beds', name: 'Make Scratching Beds', x: 1200, y: 910 }, { id: 'clean_litter', name: 'Clean Space Litter', x: 1400, y: 910 } ]
    },
    {
        id: 'cat_garden', name: '🌸 Cat Garden', color: '#10ac84', bgColor: '#1b332b',
        x: 1750, y: 750, width: 500, height: 350, icon: '🌸',
        tasks: [ { id: 'water_plants', name: 'Water Catnip', x: 1850, y: 920 }, { id: 'trim_catnip', name: 'Trim Garden Hedges', x: 2150, y: 920 } ]
    },
    {
        id: 'nap_quarters', name: '😴 Nap Quarters', color: '#fd79a8', bgColor: '#3d252f',
        x: 2500, y: 750, width: 400, height: 320, icon: '😴',
        tasks: [ { id: 'fluff_pillows', name: 'Fluff Nap Pillows', x: 2600, y: 910 }, { id: 'fix_clock', name: 'Set Alarm Clock', x: 2800, y: 910 } ]
    },
    {
        id: 'electrical', name: '⚡ Electrical', color: '#fbc531', bgColor: '#332e1b',
        x: 3150, y: 700, width: 400, height: 350, icon: '⚡',
        tasks: [ { id: 'calibrate_distributor', name: 'Calibrate Power', x: 3250, y: 875 }, { id: 'download_data', name: 'Download Power Logs', x: 3450, y: 875 } ],
        hasLightsFixPanel: true, lightsFixX: 3350, lightsFixY: 875
    },
    {
        id: 'o2', name: '💨 Oxygen (O2)', color: '#74b9ff', bgColor: '#1c2e3d',
        x: 450, y: 1300, width: 400, height: 320, icon: '💨',
        tasks: [ { id: 'clean_filters', name: 'Clean Oxygen Filter', x: 550, y: 1460 }, { id: 'refill_tanks', name: 'Refill O2 Storage Tanks', x: 750, y: 1460 } ]
    },
    {
        id: 'fish_storage', name: '🐟 Fish Storage', color: '#00cec9', bgColor: '#1b2d33',
        x: 1050, y: 1300, width: 450, height: 320, icon: '🐟',
        tasks: [ { id: 'sort_fish', name: 'Sort Fish Bins', x: 1150, y: 1460 }, { id: 'check_freezer', name: 'Check Freezer Temp', x: 1350, y: 1460 } ]
    },
    {
        id: 'admin', name: '📁 Admin Room', color: '#ffeaa7', bgColor: '#2c3e50',
        x: 1800, y: 1300, width: 400, height: 300, icon: '📁',
        tasks: [ { id: 'swipe_card', name: 'Swipe Admin Card', x: 1900, y: 1450 }, { id: 'upload_admin', name: 'Upload Admin Logs', x: 2100, y: 1450 } ]
    },
    {
        id: 'kitchen', name: '🍳 Kitchen', color: '#e67e22', bgColor: '#3d2c1e',
        x: 2500, y: 1300, width: 450, height: 320, icon: '🍳',
        tasks: [ { id: 'cook_fish', name: 'Prepare Fish Feast', x: 2600, y: 1460 }, { id: 'wash_bowls', name: 'Wash Food Bowls', x: 2800, y: 1460 } ]
    },
    {
        id: 'comms', name: '📻 Communications (Comms)', color: '#0984e3', bgColor: '#1c2833',
        x: 3150, y: 1300, width: 400, height: 320, icon: '📻',
        tasks: [ { id: 'reboot_wifi', name: 'Reboot Space Comm Router', x: 3250, y: 1460 }, { id: 'download_comms', name: 'Download Signal Decryption', x: 3450, y: 1460 } ],
        hasCommsFixPanel: true, commsFixX: 3350, commsFixY: 1460
    },
    {
        id: 'records', name: '📂 Catnip Records', color: '#a29bfe', bgColor: '#241b3a',
        x: 450, y: 1850, width: 450, height: 320, icon: '📂',
        tasks: [ { id: 'file_records', name: 'File Catnip Inventory', x: 550, y: 2010 }, { id: 'scan_id', name: 'Scan Paw ID', x: 750, y: 2010 } ]
    },
    {
        id: 'cargo_bay', name: '📦 Cargo Bay', color: '#ffeaa7', bgColor: '#2d3436',
        x: 1700, y: 1900, width: 600, height: 400, icon: '📦',
        tasks: [ { id: 'sort_boxes', name: 'Sort Supply Crates', x: 1850, y: 2100 }, { id: 'check_manifest', name: 'Check Cargo Manifest', x: 2150, y: 2100 } ]
    },
    {
        id: 'workshop', name: '🛠️ Workshop', color: '#81ecec', bgColor: '#1b2d2d',
        x: 3100, y: 1850, width: 450, height: 320, icon: '🛠️',
        tasks: [ { id: 'pickup_torpedo', name: 'Retrieve Catnip Torpedo', x: 3200, y: 2010 }, { id: 'fix_wiring', name: 'Fix Electrical Wires', x: 3350, y: 2010 }, { id: 'tighten_bolts', name: 'Tighten Hull Bolts', x: 3450, y: 2010 } ]
    },
    {
        id: 'yarn_engine', name: '🧶 Yarn Engine', color: '#fd79a8', bgColor: '#2d1b2b',
        x: 1000, y: 2350, width: 500, height: 400, icon: '🧶',
        tasks: [ { id: 'untangle_yarn', name: 'Untangle Yarn Spool', x: 1150, y: 2550 }, { id: 'calibrate_engine', name: 'Calibrate Engine Dials', x: 1350, y: 2550 } ],
        hasEngineFixPanel: true, engineFixX: 1250, engineFixY: 2550
    },
    {
        id: 'shields', name: '🛡️ Shields', color: '#74b9ff', bgColor: '#1c2833',
        x: 2500, y: 2350, width: 500, height: 400, icon: '🛡️',
        tasks: [ { id: 'prime_shields', name: 'Prime Deflector Shields', x: 2650, y: 2550 }, { id: 'realign_panels', name: 'Realign Shield Panels', x: 2850, y: 2550 } ]
    }
];

const CATHQ_CORRIDORS = [
    // Central Spine (x = 2000)
    { x1: 2000, y1: 500, x2: 2000, y2: 1900, width: 120 },
    // Left Spine (x = 900)
    { x1: 900, y1: 570, x2: 900, y2: 2350, width: 100 },
    // Right Spine (x = 3100)
    { x1: 3100, y1: 570, x2: 3100, y2: 2350, width: 100 },
    // Top Horizontal Corridor (y = 570)
    { x1: 900, y1: 570, x2: 3100, y2: 570, width: 100 },
    // Middle Horizontal Corridor (y = 1170)
    { x1: 650, y1: 1170, x2: 3350, y2: 1170, width: 100 },
    // Lower Middle Horizontal Corridor (y = 1720)
    { x1: 650, y1: 1720, x2: 3350, y2: 1720, width: 100 },
    // Bottom Horizontal Corridor (y = 2270)
    { x1: 900, y1: 2270, x2: 3100, y2: 2270, width: 100 }
];

const ROOMS = [...WHISKER_STATION_ROOMS];
const CORRIDORS = [...WHISKER_STATION_CORRIDORS];

const VENTS = [
    { id: 'v1', roomId: 'fish_storage', x: 1025, y: 760, connectId: 'v2', targetRoom: 'Kitchen' },
    { id: 'v2', roomId: 'kitchen', x: 2525, y: 1220, connectId: 'v1', targetRoom: 'Fish Storage' },
    { id: 'v3', roomId: 'yarn_engine', x: 1800, y: 2150, connectId: 'v4', targetRoom: 'Bridge' },
    { id: 'v4', roomId: 'bridge', x: 1800, y: 380, connectId: 'v3', targetRoom: 'Yarn Engine' },
    { id: 'v5', roomId: 'workshop', x: 2575, y: 1680, connectId: 'v6', targetRoom: 'Cat Garden' },
    { id: 'v6', roomId: 'cat_garden', x: 1025, y: 1680, connectId: 'v5', targetRoom: 'Workshop' },
    { id: 'v7', roomId: 'nap_quarters', x: 1075, y: 1220, connectId: 'v8', targetRoom: 'Cargo Bay' },
    { id: 'v8', roomId: 'cargo_bay', x: 1800, y: 1220, connectId: 'v7', targetRoom: 'Nap Quarters' }
];

function loadMap(mapId) {
    if (mapId === 'cat_hq') {
        MAP_BOUNDS.width = 4000;
        MAP_BOUNDS.height = 3000;
        ROOMS.length = 0;
        ROOMS.push(...CATHQ_ROOMS);
        CORRIDORS.length = 0;
        CORRIDORS.push(...CATHQ_CORRIDORS);
        VENTS.length = 0;
        VENTS.push(
            { id: 'hq_v1', roomId: 'security', x: 550, y: 800, connectId: 'hq_v2', targetRoom: 'Electrical' },
            { id: 'hq_v2', roomId: 'electrical', x: 3250, y: 800, connectId: 'hq_v1', targetRoom: 'Security' },
            { id: 'hq_v3', roomId: 'medical', x: 1150, y: 320, connectId: 'hq_v4', targetRoom: 'Weapons' },
            { id: 'hq_v4', roomId: 'weapons', x: 2600, y: 320, connectId: 'hq_v3', targetRoom: 'Medical' },
            { id: 'hq_v5', roomId: 'admin', x: 1900, y: 1350, connectId: 'hq_v6', targetRoom: 'Workshop' },
            { id: 'hq_v6', roomId: 'workshop', x: 3200, y: 1900, connectId: 'hq_v5', targetRoom: 'Admin Room' },
            { id: 'hq_v7', roomId: 'bridge', x: 1850, y: 200, connectId: 'hq_v8', targetRoom: 'Yarn Engine' },
            { id: 'hq_v8', roomId: 'yarn_engine', x: 1150, y: 2450, connectId: 'hq_v7', targetRoom: 'Bridge' }
        );
    } else if (mapId === 'catnip_observatory') {
        MAP_BOUNDS.width = 2800;
        MAP_BOUNDS.height = 5700;
        ROOMS.length = 0;
        ROOMS.push(...CATNIP_OBSERVATORY_ROOMS);
        CORRIDORS.length = 0;
        CORRIDORS.push(...CATNIP_OBSERVATORY_CORRIDORS);
        VENTS.length = 0;
        VENTS.push(
            { id: 'cv1', roomId: 'greenhouse', x: 350, y: 350, connectId: 'cv2', targetRoom: 'Reactor Core' },
            { id: 'cv2', roomId: 'reactor', x: 350, y: 1650, connectId: 'cv1', targetRoom: 'Catnip Greenhouse' },
            { id: 'cv3', roomId: 'laser_weapons', x: 2350, y: 350, connectId: 'cv4', targetRoom: 'Thrusters' },
            { id: 'cv4', roomId: 'thrusters', x: 2350, y: 1650, connectId: 'cv3', targetRoom: 'Laser Weapons' },
            { id: 'cv5', roomId: 'security', x: 1350, y: 950, connectId: 'cv6', targetRoom: 'Communications' },
            { id: 'cv6', roomId: 'comms', x: 1350, y: 1650, connectId: 'cv5', targetRoom: 'Security' }
        );
    } else {
        MAP_BOUNDS.width = 3600;
        MAP_BOUNDS.height = 2600;
        ROOMS.length = 0;
        ROOMS.push(...WHISKER_STATION_ROOMS);
        CORRIDORS.length = 0;
        CORRIDORS.push(...WHISKER_STATION_CORRIDORS);
        VENTS.length = 0;
        VENTS.push(
            { id: 'v1', roomId: 'fish_storage', x: 1025, y: 760, connectId: 'v2', targetRoom: 'Kitchen' },
            { id: 'v2', roomId: 'kitchen', x: 2525, y: 1220, connectId: 'v1', targetRoom: 'Fish Storage' },
            { id: 'v3', roomId: 'yarn_engine', x: 1800, y: 2150, connectId: 'v4', targetRoom: 'Bridge' },
            { id: 'v4', roomId: 'bridge', x: 1800, y: 380, connectId: 'v3', targetRoom: 'Yarn Engine' },
            { id: 'v5', roomId: 'workshop', x: 2575, y: 1680, connectId: 'v6', targetRoom: 'Cat Garden' },
            { id: 'v6', roomId: 'cat_garden', x: 1025, y: 1680, connectId: 'v5', targetRoom: 'Workshop' },
            { id: 'v7', roomId: 'nap_quarters', x: 1075, y: 1220, connectId: 'v8', targetRoom: 'Cargo Bay' },
            { id: 'v8', roomId: 'cargo_bay', x: 1800, y: 1220, connectId: 'v7', targetRoom: 'Nap Quarters' },
            { id: 'v9', roomId: 'thruster_a', x: 425, y: 2260, connectId: 'v10', targetRoom: 'Catnip Records' },
            { id: 'v10', roomId: 'records', x: 450, y: 1770, connectId: 'v9', targetRoom: 'Thruster A' },
            { id: 'v11', roomId: 'thruster_b', x: 3175, y: 2260, connectId: 'v12', targetRoom: 'Admin Room' },
            { id: 'v12', roomId: 'admin', x: 3150, y: 1790, connectId: 'v11', targetRoom: 'Thruster B' }
        );
    }
}

function getNearbyLadder(playerX, playerY, maxDist = 60) {
    const ladders = [
        { x1: 1400, y1: 650, x2: 1400, y2: 3650, name: 'Main Elevator' },
        { x1: 650, y1: 975, x2: 650, y2: 3975, name: 'Service Ladder Left' },
        { x1: 2150, y1: 975, x2: 2150, y2: 3975, name: 'Service Ladder Right' }
    ];
    for (const l of ladders) {
        if (Math.hypot(playerX - l.x1, playerY - l.y1) <= maxDist) {
            return { x: l.x2, y: l.y2, label: l.name };
        }
        if (Math.hypot(playerX - l.x2, playerY - l.y2) <= maxDist) {
            return { x: l.x1, y: l.y1, label: l.name };
        }
    }
    return null;
}

class VentSystem {
    static getNearbyVent(playerX, playerY, maxDist = 60) {
        for (const vent of VENTS) {
            const dx = playerX - vent.x;
            const dy = playerY - vent.y;
            if (Math.hypot(dx, dy) <= maxDist) return vent;
        }
        return null;
    }
    static getVentById(id) { return VENTS.find(v => v.id === id); }
}

class SabotageSystem {
    constructor() {
        this.activeSabotage = null;
        this.engineTimer = 45;
        this.doorTimer = 0;
        this.cooldown = 10; // 10-second initial grace period before sabotages can be triggered!
    }
    update(dt) {
        if (this.cooldown > 0) this.cooldown -= dt;
        if (this.activeSabotage === 'engine') {
            this.engineTimer -= dt;
            if (this.engineTimer <= 0) return 'ENGINE_MELTDOWN';
        }
        if (this.activeSabotage === 'doors') {
            this.doorTimer -= dt;
            if (this.doorTimer <= 0) this.activeSabotage = null;
        }
        return null;
    }
    triggerSabotage(type) {
        if (this.cooldown > 0 || this.activeSabotage) return false;
        this.activeSabotage = type;
        this.cooldown = 20; // 20s cooldown between sabotages
        if (type === 'engine') this.engineTimer = 45;
        else if (type === 'doors') this.doorTimer = 15;
        return true;
    }
    fixSabotage() { this.activeSabotage = null; }
}

// ==========================================
// 5. TASKS SYSTEM
// ==========================================
const TASK_DEFINITIONS = {
    nav_ship: { name: 'Navigate Ship Path', room: 'Bridge', type: 'slider' },
    upload_data: { name: 'Upload Data to HQ', room: 'Bridge', type: 'fill_meter' },
    scan_asteroids: { name: 'Scan Space Sector', room: 'Bridge', type: 'click_sequence' },
    med_scan: { name: 'Submit Med Scan', room: 'Medical', type: 'rapid_click' },
    treat_scratches: { name: 'Treat Paw Scratches', room: 'Medical', type: 'click_sequence' },
    clear_asteroids: { name: 'Clear Asteroids', room: 'Weapons', type: 'shoot_asteroids' },
    pickup_torpedo: { name: 'Retrieve Catnip Torpedo', room: 'Workshop', type: 'fill_meter' },
    load_torpedoes: { name: 'Load Catnip Torpedo', room: 'Weapons', type: 'fill_meter' },
    monitor_cams: { name: 'Monitor Security Feeds', room: 'Security', type: 'cams' },
    rewind_tapes: { name: 'Rewind Security Tapes', room: 'Security', type: 'slider' },
    sort_fish: { name: 'Sort Fish Bins', room: 'Fish Storage', type: 'click_sequence' },
    check_freezer: { name: 'Check Freezer Temp', room: 'Fish Storage', type: 'slider' },
    make_beds: { name: 'Make Scratching Beds', room: 'Ship Quarters', type: 'rapid_click' },
    clean_litter: { name: 'Clean Space Litter', room: 'Ship Quarters', type: 'scrub' },
    calibrate_distributor: { name: 'Calibrate Power', room: 'Electrical', type: 'wires' },
    download_data: { name: 'Download Power Logs', room: 'Electrical', type: 'rapid_click' },
    prime_shields: { name: 'Prime Deflector Shields', room: 'Shields', type: 'click_sequence' },
    realign_panels: { name: 'Realign Shield Panels', room: 'Shields', type: 'slider' },
    clean_filters: { name: 'Clean Oxygen Filter', room: 'Oxygen', type: 'scrub' },
    refill_tanks: { name: 'Refill O2 Storage Tanks', room: 'Oxygen', type: 'fill_meter' },
    fluff_pillows: { name: 'Fluff Nap Pillows', room: 'Nap Quarters', type: 'rapid_click' },
    fix_clock: { name: 'Set Alarm Clock', room: 'Nap Quarters', type: 'slider' },
    sort_boxes: { name: 'Sort Supply Crates', room: 'Cargo Bay', type: 'click_sequence' },
    check_manifest: { name: 'Check Cargo Manifest', room: 'Cargo Bay', type: 'rapid_click' },
    cook_fish: { name: 'Prepare Fish Feast', room: 'Kitchen', type: 'click_sequence' },
    wash_bowls: { name: 'Wash Food Bowls', room: 'Kitchen', type: 'scrub' },
    reboot_wifi: { name: 'Reboot Space Comm Router', room: 'Communications', type: 'rapid_click' },
    download_comms: { name: 'Download Signal Decryption', room: 'Communications', type: 'fill_meter' },
    file_records: { name: 'File Catnip Inventory', room: 'Catnip Records', type: 'click_sequence' },
    scan_id: { name: 'Scan Crewmate Paw ID', room: 'Catnip Records', type: 'slider' },
    water_plants: { name: 'Water Catnip', room: 'Cat Garden', type: 'fill_meter' },
    trim_catnip: { name: 'Trim Garden Hedges', room: 'Cat Garden', type: 'rapid_click' },
    fix_wiring: { name: 'Fix Electrical Wires', room: 'Workshop', type: 'wires' },
    tighten_bolts: { name: 'Tighten Hull Bolts', room: 'Workshop', type: 'click_sequence' },
    prime_thruster_a: { name: 'Prime Left Thruster', room: 'Thruster A', type: 'slider' },
    flush_fuel_a: { name: 'Flush Engine Fuel A', room: 'Thruster A', type: 'fill_meter' },
    untangle_yarn: { name: 'Untangle Yarn Spool', room: 'Yarn Engine', type: 'scrub' },
    calibrate_engine: { name: 'Calibrate Engine Dials', room: 'Yarn Engine', type: 'slider' },
    prime_thruster_b: { name: 'Prime Right Thruster', room: 'Thruster B', type: 'slider' },
    flush_fuel_b: { name: 'Flush Engine Fuel B', room: 'Thruster B', type: 'fill_meter' },
    swipe_card: { name: 'Swipe Admin Card', room: 'Admin Room', type: 'slider' },
    upload_admin: { name: 'Upload Admin Logs', room: 'Admin Room', type: 'fill_meter' }
};

class TaskManager {
    static generateTaskList() {
        const keys = Object.keys(TASK_DEFINITIONS).filter(k => {
            if (k === 'upload_data' || k === 'load_torpedoes') return false;
            const t = TASK_DEFINITIONS[k];
            return ROOMS.some(r => r.name.includes(t.room));
        });
        const shuffled = [...keys].sort(() => 0.5 - Math.random());
        const list = shuffled.slice(0, 5).map(key => ({
            id: key, ...TASK_DEFINITIONS[key], completed: false, progress: 0
        }));
        const hasDownload = list.some(t => t.id === 'download_data' || t.id === 'download_comms');
        if (hasDownload) {
            list.push({
                id: 'upload_data', ...TASK_DEFINITIONS.upload_data, completed: false, progress: 0, locked: true
            });
        }
        const hasPickup = list.some(t => t.id === 'pickup_torpedo');
        if (hasPickup) {
            list.push({
                id: 'load_torpedoes', ...TASK_DEFINITIONS.load_torpedoes, completed: false, progress: 0, locked: true
            });
        }
        return list;
    }

    static renderTaskMinigame(task, player, onComplete) {
        const container = document.getElementById('task-canvas-container');
        document.getElementById('task-modal-title').innerText = `${task.room} — ${task.name}`;
        container.innerHTML = '';

        const speedMultiplier = player.role === 'Captain' ? 1.35 : 1.0;
        let currentVal = 0;

        if (task.type === 'rapid_click') {
            const btn = document.createElement('button');
            btn.className = 'btn-primary glow-button';
            btn.style.cssText = 'padding:20px 40px; font-size:1.5rem;';
            btn.innerText = 'PAW HERE! (0/5)';
            btn.onclick = () => {
                currentVal += 1 * speedMultiplier;
                btn.innerText = `PAW HERE! (${Math.min(5, Math.floor(currentVal))}/5)`;
                soundManager.playVoteClick();
                if (currentVal >= 5) {
                    task.completed = true;
                    soundManager.playTaskComplete();
                    onComplete();
                }
            };
            container.appendChild(btn);
        } else if (task.type === 'slider') {
            const wrap = document.createElement('div');
            wrap.style.cssText = 'display:flex; flex-direction:column; align-items:center; gap:20px; color:white;';
            wrap.innerHTML = `<p style="font-size:1.2rem;">Adjust system dial to target range (70 - 90):</p>`;

            const slider = document.createElement('input');
            slider.type = 'range'; slider.min = '0'; slider.max = '100'; slider.value = '20'; slider.style.width = '320px';
            const valDisplay = document.createElement('h2'); valDisplay.innerText = '20'; valDisplay.style.fontSize = '2.5rem';

            slider.oninput = () => {
                valDisplay.innerText = slider.value;
                if (parseInt(slider.value) >= 70 && parseInt(slider.value) <= 90) {
                    task.completed = true; soundManager.playTaskComplete(); onComplete();
                }
            };
            wrap.appendChild(slider); wrap.appendChild(valDisplay); container.appendChild(wrap);
        } else if (task.type === 'wires') {
            const wrap = document.createElement('div');
            wrap.style.cssText = 'display:flex; flex-direction:column; align-items:center; color:white; font-family:var(--font-heading);';
            wrap.innerHTML = `<p style="font-size:1.1rem; margin-bottom:8px;">⚡ Match matching colored circuits:</p>`;

            const canvas = document.createElement('canvas');
            canvas.width = 340; canvas.height = 220;
            canvas.style.cssText = 'background:#1e272e; border:3px solid #2d3436; border-radius:12px; cursor:crosshair;';
            wrap.appendChild(canvas); container.appendChild(wrap);

            const ctx = canvas.getContext('2d');
            const colors = ['#ff7675', '#74b9ff', '#ffeaa7', '#55efc4'];
            const leftIndices = [0, 1, 2, 3];
            const rightIndices = [0, 1, 2, 3].sort(() => Math.random() - 0.5);

            const leftPorts = leftIndices.map((colorIdx, i) => ({
                id: i, x: 35, y: 35 + i * 50, colorIdx, color: colors[colorIdx], connected: false
            }));
            const rightPorts = rightIndices.map((colorIdx, i) => ({
                id: i, x: 305, y: 35 + i * 50, colorIdx, color: colors[colorIdx], connected: false
            }));

            let selectedLeft = null; let currentMousePos = null; const connections = [];

            const draw = () => {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                connections.forEach(conn => {
                    ctx.strokeStyle = conn.color; ctx.lineWidth = 6; ctx.lineCap = 'round';
                    ctx.shadowColor = conn.color; ctx.shadowBlur = 8;
                    ctx.beginPath(); ctx.moveTo(conn.fromX, conn.fromY); ctx.lineTo(conn.toX, conn.toY); ctx.stroke();
                    ctx.shadowBlur = 0;
                });
                if (selectedLeft && currentMousePos) {
                    ctx.strokeStyle = selectedLeft.color; ctx.lineWidth = 6; ctx.lineCap = 'round';
                    ctx.shadowColor = selectedLeft.color; ctx.shadowBlur = 8;
                    ctx.beginPath(); ctx.moveTo(selectedLeft.x, selectedLeft.y); ctx.lineTo(currentMousePos.x, currentMousePos.y); ctx.stroke();
                    ctx.shadowBlur = 0;
                }
                leftPorts.forEach(p => {
                    ctx.fillStyle = p.color; ctx.beginPath(); ctx.arc(p.x, p.y, 12, 0, Math.PI * 2); ctx.fill();
                    ctx.fillStyle = '#0f141d'; ctx.beginPath(); ctx.arc(p.x, p.y, 6, 0, Math.PI * 2); ctx.fill();
                    if (selectedLeft === p) { ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 2.5; ctx.stroke(); }
                });
                rightPorts.forEach(p => {
                    ctx.fillStyle = p.color; ctx.beginPath(); ctx.arc(p.x, p.y, 12, 0, Math.PI * 2); ctx.fill();
                    ctx.fillStyle = '#0f141d'; ctx.beginPath(); ctx.arc(p.x, p.y, 6, 0, Math.PI * 2); ctx.fill();
                });
            };

            const getMousePos = (e) => {
                const rect = canvas.getBoundingClientRect();
                const clientX = e.touches ? e.touches[0].clientX : e.clientX;
                const clientY = e.touches ? e.touches[0].clientY : e.clientY;
                return {
                    x: (clientX - rect.left) * (canvas.width / rect.width),
                    y: (clientY - rect.top) * (canvas.height / rect.height)
                };
            };

            const onStart = (e) => {
                const pos = getMousePos(e);
                const hit = leftPorts.find(p => !p.connected && Math.hypot(p.x - pos.x, p.y - pos.y) <= 22);
                if (hit) { selectedLeft = hit; currentMousePos = pos; soundManager.playVoteClick(); draw(); }
            };
            const onMove = (e) => {
                if (!selectedLeft) return;
                currentMousePos = getMousePos(e); draw();
            };
            const onEnd = (e) => {
                if (!selectedLeft) return;
                const pos = currentMousePos;
                const hitRight = rightPorts.find(p => !p.connected && Math.hypot(p.x - pos.x, p.y - pos.y) <= 22);
                if (hitRight && hitRight.colorIdx === selectedLeft.colorIdx) {
                    selectedLeft.connected = true; hitRight.connected = true;
                    connections.push({
                        color: selectedLeft.color, fromX: selectedLeft.x, fromY: selectedLeft.y, toX: hitRight.x, toY: hitRight.y
                    });
                    soundManager.playVoteClick();
                    if (connections.length === 4) {
                        task.completed = true;
                        setTimeout(() => { soundManager.playTaskComplete(); onComplete(); }, 250);
                    }
                } else {
                    soundManager.playVoteClick();
                }
                selectedLeft = null; currentMousePos = null; draw();
            };

            canvas.onmousedown = onStart; canvas.onmousemove = onMove; canvas.onmouseup = onEnd;
            canvas.ontouchstart = onStart; canvas.ontouchmove = onMove; canvas.ontouchend = onEnd;
            draw();
        } else if (task.type === 'scrub') {
            const wrap = document.createElement('div');
            wrap.style.cssText = 'display:flex; flex-direction:column; align-items:center; color:white; font-family:var(--font-heading);';
            wrap.innerHTML = `<p style="font-size:1.1rem; margin-bottom:8px;">🧼 Scrub mud overlay off canvas (reveal clean paw!):</p>`;

            const canvas = document.createElement('canvas');
            canvas.width = 300; canvas.height = 200;
            canvas.style.cssText = 'background:#f5a623; border:4px solid #2d3436; border-radius:12px; cursor:pointer; background-image: radial-gradient(#fff 20%, transparent 20%), radial-gradient(#fff 20%, transparent 20%); background-size: 16px 16px; background-position: 0 0, 8px 8px;';
            wrap.appendChild(canvas); container.appendChild(wrap);

            const ctx = canvas.getContext('2d');
            const cleanCanvas = document.createElement('canvas');
            cleanCanvas.width = 300; cleanCanvas.height = 200;
            const cCtx = cleanCanvas.getContext('2d');
            cCtx.fillStyle = '#ff7675'; cCtx.fillRect(0, 0, 300, 200);
            cCtx.fillStyle = '#fff';
            cCtx.beginPath();
            cCtx.arc(150, 105, 30, 0, Math.PI * 2);
            cCtx.arc(120, 65, 14, 0, Math.PI * 2); cCtx.arc(150, 52, 14, 0, Math.PI * 2); cCtx.arc(180, 65, 14, 0, Math.PI * 2);
            cCtx.fill();
            cCtx.fillStyle = '#ffffff'; cCtx.font = 'bold 20px sans-serif'; cCtx.textAlign = 'center';
            cCtx.fillText('✨ SCRUBBED! ✨', 150, 170);
            ctx.drawImage(cleanCanvas, 0, 0);

            const dirtCanvas = document.createElement('canvas');
            dirtCanvas.width = 300; dirtCanvas.height = 200;
            const dCtx = dirtCanvas.getContext('2d');
            dCtx.fillStyle = '#5c4033'; dCtx.fillRect(0, 0, 300, 200);
            dCtx.fillStyle = '#3a271c';
            for (let i = 0; i < 60; i++) {
                dCtx.beginPath(); dCtx.arc(Math.random() * 300, Math.random() * 200, 2 + Math.random() * 4, 0, Math.PI * 2); dCtx.fill();
            }
            dCtx.fillStyle = '#ffffff'; dCtx.font = 'bold 15px monospace'; dCtx.textAlign = 'center';
            dCtx.fillText('🧼 SCRUB MUD HERE 🧼', 150, 105);
            ctx.drawImage(dirtCanvas, 0, 0);

            let isDrawing = false;
            const getMousePos = (e) => {
                const rect = canvas.getBoundingClientRect();
                const clientX = e.touches ? e.touches[0].clientX : e.clientX;
                const clientY = e.touches ? e.touches[0].clientY : e.clientY;
                return {
                    x: (clientX - rect.left) * (canvas.width / rect.width),
                    y: (clientY - rect.top) * (canvas.height / rect.height)
                };
            };
            const scrub = (pos) => {
                dCtx.save(); dCtx.globalCompositeOperation = 'destination-out';
                dCtx.beginPath(); dCtx.arc(pos.x, pos.y, 25, 0, Math.PI * 2); dCtx.fill(); dCtx.restore();
                ctx.drawImage(cleanCanvas, 0, 0); ctx.drawImage(dirtCanvas, 0, 0);
            };
            const checkProgress = () => {
                const imgData = dCtx.getImageData(0, 0, 300, 200);
                let alphaSum = 0;
                for (let i = 3; i < imgData.data.length; i += 32) {
                    if (imgData.data[i] > 10) alphaSum++;
                }
                const totalSamples = imgData.data.length / 32;
                if ((alphaSum / totalSamples) < 0.12) {
                    task.completed = true;
                    canvas.onmousedown = null; canvas.onmousemove = null;
                    soundManager.playTaskComplete(); onComplete();
                }
            };
            const onStart = (e) => { isDrawing = true; const pos = getMousePos(e); scrub(pos); soundManager.playVoteClick(); };
            const onMove = (e) => { if (!isDrawing) return; const pos = getMousePos(e); scrub(pos); if (Math.random() < 0.2) soundManager.playVoteClick(); };
            const onEnd = () => { isDrawing = false; checkProgress(); };

            canvas.onmousedown = onStart; canvas.onmousemove = onMove; canvas.onmouseup = onEnd; canvas.onmouseleave = onEnd;
            canvas.ontouchstart = onStart; canvas.ontouchmove = onMove; canvas.ontouchend = onEnd;
        } else if (task.type === 'click_sequence') {
            const wrap = document.createElement('div');
            wrap.style.cssText = 'display:flex; flex-direction:column; align-items:center; color:white; font-family:var(--font-heading);';
            wrap.innerHTML = `<p style="font-size:1.1rem; margin-bottom:12px;">🐾 Click nodes in numerical sequence (1 ➡️ 2 ➡️ 3 ➡️ 4):</p>`;

            const grid = document.createElement('div');
            grid.style.cssText = 'display:grid; grid-template-columns:repeat(2, 1fr); gap:16px; width:280px;';
            const seqNumbers = [1, 2, 3, 4].sort(() => Math.random() - 0.5);
            let expectedNum = 1; const buttons = [];

            seqNumbers.forEach(num => {
                const btn = document.createElement('button');
                btn.className = 'btn-secondary';
                btn.style.cssText = 'height:80px; font-size:2rem; font-weight:700; border-radius:16px; transition: all 0.2s;';
                btn.innerText = num;
                btn.onclick = () => {
                    if (num === expectedNum) {
                        btn.style.background = '#00b894'; btn.style.color = '#fff'; btn.disabled = true;
                        expectedNum++; soundManager.playVoteClick();
                        if (expectedNum > 4) { task.completed = true; soundManager.playTaskComplete(); onComplete(); }
                    } else {
                        buttons.forEach(b => { if (b.disabled) b.style.background = '#d63031'; });
                        btn.style.background = '#d63031'; soundManager.playVoteClick();
                        setTimeout(() => {
                            expectedNum = 1;
                            buttons.forEach(b => { b.style.background = ''; b.style.color = ''; b.disabled = false; });
                        }, 500);
                    }
                };
                grid.appendChild(btn); buttons.push(btn);
            });
            wrap.appendChild(grid); container.appendChild(wrap);
        } else if (task.type === 'shoot_asteroids') {
            const wrap = document.createElement('div');
            wrap.style.cssText = 'display:flex; flex-direction:column; align-items:center; gap:10px; color:white; font-family:var(--font-heading);';
            
            const isProtocol = window.gameInstance && window.gameInstance.defensiveProtocolActive;
            player.loadedTorpedoes = player.loadedTorpedoes || 0;
            let ammo = 0;
            if (player.loadedTorpedoes > 0) {
                player.loadedTorpedoes--;
                ammo = 10;
            }

            const ammoHTML = `<div id="ammo-status" style="font-weight:bold; color:#ffeaa7; font-size:1.1rem; margin-top:4px;">🔋 Torpedoes Ready: <span id="torp-count">${player.loadedTorpedoes}</span> | 💥 Ammo: <span id="ammo-count">${ammo}</span> / 10</div>`;
            wrap.innerHTML = `<p style="font-size:1.1rem; margin-bottom:4px;">💥 Shoot the targets before they drift away! (Destroyed: <span id="ast-count">0</span> / 10)</p>${ammoHTML}`;

            const canvas = document.createElement('canvas');
            canvas.width = 400; canvas.height = 300;
            canvas.style.cssText = 'background:#000; border:3px solid #2d3436; border-radius:12px; cursor:crosshair; box-shadow:0 10px 30px rgba(0,0,0,0.5);';
            wrap.appendChild(canvas);
            container.appendChild(wrap);

            const ctx = canvas.getContext('2d');
            let destroyed = 0;
            let asteroids = [];
            let laserLine = null;
            let explosions = [];
            let mousePos = { x: 200, y: 150 };
            let active = true;
            let reloading = false;

            const spawnAsteroid = () => {
                if (!active) return;
                const side = Math.random() < 0.7 ? 'right' : 'top';
                let x, y, vx, vy;
                if (side === 'right') {
                    x = canvas.width + 20;
                    y = Math.random() * (canvas.height - 60) + 30;
                    vx = -(Math.random() * 100 + 80);
                    vy = (Math.random() - 0.5) * 40;
                } else {
                    x = Math.random() * (canvas.width - 60) + 30;
                    y = -20;
                    vx = (Math.random() - 0.5) * 80;
                    vy = Math.random() * 100 + 80;
                }
                const radius = Math.random() * 15 + 10;
                const isEnemyShip = isProtocol && Math.random() < 0.80;
                asteroids.push({ x, y, vx, vy, radius, hp: 1, isEnemyShip });
            };

            const getMousePos = (e) => {
                const rect = canvas.getBoundingClientRect();
                const clientX = e.touches ? e.touches[0].clientX : e.clientX;
                const clientY = e.touches ? e.touches[0].clientY : e.clientY;
                return {
                    x: (clientX - rect.left) * (canvas.width / rect.width),
                    y: (clientY - rect.top) * (canvas.height / rect.height)
                };
            };

            canvas.onmousemove = (e) => {
                mousePos = getMousePos(e);
            };

            canvas.onmousedown = (e) => {
                if (!active || task.completed) return;

                if (ammo <= 0) {
                    if (player.loadedTorpedoes > 0) {
                        player.loadedTorpedoes--;
                        ammo = 10;
                        const countEl = document.getElementById('ammo-status');
                        if (countEl) {
                            countEl.innerHTML = `🔋 Torpedoes Ready: <span id="torp-count">${player.loadedTorpedoes}</span> | 💥 Ammo: <span id="ammo-count">10</span> / 10`;
                        }
                        soundManager.playTaskComplete();
                    } else {
                        // Request/Assign reload task
                        if (!player.tasks.some(tk => tk.id === 'pickup_torpedo_reload')) {
                            player.tasks.push({
                                id: 'pickup_torpedo_reload',
                                name: 'Retrieve Torpedo (Reload)',
                                room: 'Workshop',
                                type: 'fill_meter',
                                completed: false
                            });
                            const workshopRoom = ROOMS.find(r => r.id === 'workshop');
                            if (workshopRoom && !workshopRoom.tasks.some(tk => tk.id === 'pickup_torpedo_reload')) {
                                const isObs = window.gameInstance && window.gameInstance.selectedMap === 'catnip_observatory';
                                const isHq = window.gameInstance && window.gameInstance.selectedMap === 'cat_hq';
                                const rx = isHq ? 3325 : (isObs ? 2370 : 2570);
                                const ry = isHq ? 2010 : (isObs ? 4720 : 1840);
                                workshopRoom.tasks.push({
                                    id: 'pickup_torpedo_reload',
                                    name: 'Retrieve Torpedo (Reload)',
                                    x: rx,
                                    y: ry
                                });
                            }
                        }
                        soundManager.playDefeat(); // Error buzz sound
                    }
                    return;
                }

                ammo--;
                const countEl = document.getElementById('ammo-count');
                if (countEl) {
                    countEl.innerText = ammo;
                }

                // If ammo just reached 0, auto-assign reload task if no torpedoes left
                if (ammo <= 0 && player.loadedTorpedoes === 0) {
                    if (!player.tasks.some(tk => tk.id === 'pickup_torpedo_reload')) {
                        player.tasks.push({
                            id: 'pickup_torpedo_reload',
                            name: 'Retrieve Torpedo (Reload)',
                            room: 'Workshop',
                            type: 'fill_meter',
                            completed: false
                        });
                        const workshopRoom = ROOMS.find(r => r.id === 'workshop');
                        if (workshopRoom && !workshopRoom.tasks.some(tk => tk.id === 'pickup_torpedo_reload')) {
                            const isObs = window.gameInstance && window.gameInstance.selectedMap === 'catnip_observatory';
                            const isHq = window.gameInstance && window.gameInstance.selectedMap === 'cat_hq';
                            const rx = isHq ? 3325 : (isObs ? 2370 : 2570);
                            const ry = isHq ? 2010 : (isObs ? 4720 : 1840);
                            workshopRoom.tasks.push({
                                id: 'pickup_torpedo_reload',
                                name: 'Retrieve Torpedo (Reload)',
                                x: rx,
                                y: ry
                            });
                        }
                    }
                }

                const clickPos = getMousePos(e);
                
                laserLine = {
                    fromX: canvas.width / 2,
                    fromY: canvas.height,
                    toX: clickPos.x,
                    toY: clickPos.y,
                    alpha: 1.0
                };
                
                soundManager.playVoteClick();

                let hitIndex = -1;
                for (let i = asteroids.length - 1; i >= 0; i--) {
                    const ast = asteroids[i];
                    const dist = Math.hypot(clickPos.x - ast.x, clickPos.y - ast.y);
                    if (dist <= ast.radius + 10) {
                        hitIndex = i;
                        break;
                    }
                }

                if (hitIndex !== -1) {
                    const hitAst = asteroids[hitIndex];
                    explosions.push({
                        x: hitAst.x,
                        y: hitAst.y,
                        radius: hitAst.radius,
                        alpha: 1.0
                    });
                    asteroids.splice(hitIndex, 1);
                    destroyed++;
                    document.getElementById('ast-count').innerText = destroyed;
                    
                    if (hitAst.isEnemyShip) {
                        if (window.gameInstance) {
                            window.gameInstance.enemyShipsDestroyed = (window.gameInstance.enemyShipsDestroyed || 0) + 1;
                            window.gameInstance.checkDefensiveProtocolStatus();
                        }
                    }

                    if (destroyed >= 10) {
                        task.completed = true;
                        soundManager.playTaskComplete();
                        setTimeout(() => {
                            active = false;
                            onComplete();
                        }, 500);
                    }
                }
            };

            const spawnInterval = setInterval(spawnAsteroid, 1000);

            const tick = () => {
                if (!active) return;
                
                const dt = 1 / 60;
                
                asteroids.forEach(ast => {
                    ast.x += ast.vx * dt;
                    ast.y += ast.vy * dt;
                });
                asteroids = asteroids.filter(ast => ast.x > -50 && ast.x < canvas.width + 50 && ast.y > -50 && ast.y < canvas.height + 50);

                if (laserLine) {
                    laserLine.alpha -= dt * 4;
                    if (laserLine.alpha <= 0) laserLine = null;
                }

                explosions.forEach(exp => {
                    exp.radius += dt * 40;
                    exp.alpha -= dt * 3;
                });
                explosions = explosions.filter(exp => exp.alpha > 0);

                ctx.fillStyle = '#0a0d16';
                ctx.fillRect(0, 0, canvas.width, canvas.height);

                ctx.strokeStyle = 'rgba(0, 184, 148, 0.15)';
                ctx.lineWidth = 1;
                const gridSize = 30;
                for (let x = 0; x < canvas.width; x += gridSize) {
                    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); ctx.stroke();
                }
                for (let y = 0; y < canvas.height; y += gridSize) {
                    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke();
                }

                asteroids.forEach(ast => {
                    if (ast.isEnemyShip) {
                        ctx.fillStyle = '#ff7675';
                        ctx.strokeStyle = '#d63031';
                        ctx.lineWidth = 2.5;
                        ctx.beginPath();
                        const angle = Math.atan2(ast.vy, ast.vx);
                        const p1x = ast.x + Math.cos(angle) * ast.radius * 1.4;
                        const p1y = ast.y + Math.sin(angle) * ast.radius * 1.4;
                        const p2x = ast.x + Math.cos(angle + 2.5) * ast.radius;
                        const p2y = ast.y + Math.sin(angle + 2.5) * ast.radius;
                        const p3x = ast.x + Math.cos(angle - 2.5) * ast.radius;
                        const p3y = ast.y + Math.sin(angle - 2.5) * ast.radius;
                        ctx.moveTo(p1x, p1y);
                        ctx.lineTo(p2x, p2y);
                        ctx.lineTo(p3x, p3y);
                        ctx.closePath();
                        ctx.fill();
                        ctx.stroke();

                        ctx.fillStyle = '#ff0000';
                        ctx.beginPath();
                        ctx.arc(ast.x, ast.y, ast.radius / 3.5, 0, Math.PI * 2);
                        ctx.fill();
                    } else {
                        ctx.fillStyle = '#b2bec3';
                        ctx.strokeStyle = '#636e72';
                        ctx.lineWidth = 2;
                        ctx.beginPath();
                        const steps = 8;
                        for (let i = 0; i <= steps; i++) {
                            const angle = (i / steps) * Math.PI * 2;
                            const bumpyRadius = ast.radius + (Math.sin(angle * 3) * 2);
                            const ax = ast.x + Math.cos(angle) * bumpyRadius;
                            const ay = ast.y + Math.sin(angle) * bumpyRadius;
                            if (i === 0) ctx.moveTo(ax, ay);
                            else ctx.lineTo(ax, ay);
                        }
                        ctx.closePath();
                        ctx.fill();
                        ctx.stroke();

                        ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
                        ctx.beginPath();
                        ctx.arc(ast.x - ast.radius/3, ast.y - ast.radius/3, ast.radius/4, 0, Math.PI * 2);
                        ctx.fill();
                        ctx.beginPath();
                        ctx.arc(ast.x + ast.radius/4, ast.y + ast.radius/5, ast.radius/6, 0, Math.PI * 2);
                        ctx.fill();
                    }
                });

                if (laserLine) {
                    ctx.strokeStyle = `rgba(0, 206, 201, ${laserLine.alpha})`;
                    ctx.lineWidth = 4;
                    ctx.beginPath();
                    ctx.moveTo(laserLine.fromX, laserLine.fromY);
                    ctx.lineTo(laserLine.toX, laserLine.toY);
                    ctx.stroke();
                }

                explosions.forEach(exp => {
                    ctx.fillStyle = `rgba(235, 94, 40, ${exp.alpha * 0.7})`;
                    ctx.beginPath();
                    ctx.arc(exp.x, exp.y, exp.radius, 0, Math.PI * 2);
                    ctx.fill();

                    ctx.fillStyle = `rgba(255, 230, 0, ${exp.alpha * 0.9})`;
                    ctx.beginPath();
                    ctx.arc(exp.x, exp.y, exp.radius * 0.6, 0, Math.PI * 2);
                    ctx.fill();
                });

                ctx.strokeStyle = '#00cec9';
                ctx.lineWidth = 1.5;
                ctx.beginPath();
                ctx.arc(mousePos.x, mousePos.y, 16, 0, Math.PI * 2);
                ctx.stroke();
                ctx.beginPath();
                ctx.moveTo(mousePos.x - 22, mousePos.y); ctx.lineTo(mousePos.x - 8, mousePos.y);
                ctx.moveTo(mousePos.x + 8, mousePos.y); ctx.lineTo(mousePos.x + 22, mousePos.y);
                ctx.moveTo(mousePos.x, mousePos.y - 22); ctx.lineTo(mousePos.x, mousePos.y - 8);
                ctx.moveTo(mousePos.x, mousePos.y + 8); ctx.lineTo(mousePos.x, mousePos.y + 22);
                ctx.stroke();

                if (ammo <= 0) {
                    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
                    ctx.fillRect(0, 0, canvas.width, canvas.height);
                    ctx.fillStyle = '#ff7675';
                    ctx.font = 'bold 16px var(--font-heading)';
                    ctx.textAlign = 'center';
                    if (player.loadedTorpedoes > 0) {
                        ctx.fillText('⚠️ WEAPON UNLOADED! ⚠️', canvas.width / 2, canvas.height / 2 - 12);
                        ctx.fillStyle = '#55efc4';
                        ctx.fillText('CLICK ANYWHERE TO LOAD TORPEDO', canvas.width / 2, canvas.height / 2 + 12);
                    } else {
                        ctx.fillText('⚠️ OUT OF TORPEDOES! ⚠️', canvas.width / 2, canvas.height / 2 - 15);
                        ctx.fillStyle = '#fff';
                        ctx.font = '14px var(--font-heading)';
                        ctx.fillText('GO TO WORKSHOP TO RETRIEVE A TORPEDO', canvas.width / 2, canvas.height / 2 + 15);
                    }
                }
                ctx.textAlign = 'left';

                requestAnimationFrame(tick);
            };

            requestAnimationFrame(tick);

            return () => {
                active = false;
                clearInterval(spawnInterval);
            };
        } else if (task.type === 'fill_meter') {
            const wrap = document.createElement('div');
            wrap.style.cssText = 'display:flex; flex-direction:column; align-items:center; gap:20px; color:white;';
            wrap.innerHTML = `<p style="font-size:1.2rem;">Hold Paw Button to Fill System Gauge:</p>`;
            const btn = document.createElement('button');
            btn.className = 'btn-primary glow-button';
            btn.style.cssText = 'padding:24px 48px; font-size:1.4rem; background:linear-gradient(135deg, #00cec9 0%, #0984e3 100%);';
            btn.innerText = 'HOLD PAW TO FILL (0%)';

            let fillTimer = null;
            const startFill = () => {
                fillTimer = setInterval(() => {
                    currentVal += 4 * speedMultiplier;
                    btn.innerText = `HOLD PAW TO FILL (${Math.min(100, Math.floor(currentVal))}%)`;
                    soundManager.playVoteClick();
                    if (currentVal >= 100) {
                        clearInterval(fillTimer); task.completed = true; soundManager.playTaskComplete(); onComplete();
                    }
                }, 100);
            };
            const stopFill = () => { if (fillTimer) clearInterval(fillTimer); };
            btn.onmousedown = startFill; btn.onmouseup = stopFill; btn.onmouseleave = stopFill;
            btn.ontouchstart = startFill; btn.ontouchend = stopFill;
            wrap.appendChild(btn); container.appendChild(wrap);
        } else if (task.type === 'cams') {
            const wrap = document.createElement('div');
            wrap.style.cssText = 'display:flex; flex-direction:column; align-items:center; width:100%; height:100%;';
            const p = document.createElement('p');
            p.style.color = '#ccc'; p.style.marginBottom = '12px'; p.innerText = '👀 Watch camera feeds. Click "CLOSE" in top right when done.';
            wrap.appendChild(p);

            const grid = document.createElement('div');
            grid.style.cssText = 'display:grid; grid-template-columns:repeat(2, 1fr); gap:12px; width:480px; justify-content:center;';
            const isObs = window.gameInstance && window.gameInstance.selectedMap === 'catnip_observatory';
            const isHq = window.gameInstance && window.gameInstance.selectedMap === 'cat_hq';
            let feeds = [];
            if (isHq) {
                feeds = [
                    { name: 'CAM 1: BRIDGE', bounds: { xMin: 1750, xMax: 2250, yMin: 150, yMax: 500 } },
                    { name: 'CAM 2: ELECTRICAL', bounds: { xMin: 3150, xMax: 3550, yMin: 700, yMax: 1050 } },
                    { name: 'CAM 3: CAT GARDEN', bounds: { xMin: 1750, xMax: 2250, yMin: 750, yMax: 1100 } },
                    { name: 'CAM 4: CENTRAL HALLWAY', bounds: { xMin: 1900, xMax: 2100, yMin: 1100, yMax: 1850 } }
                ];
            } else if (isObs) {
                feeds = [
                    { name: 'CAM 1: BRIDGE', bounds: { xMin: 1150, xMax: 1650, yMin: 150, yMax: 500 } },
                    { name: 'CAM 2: ELECTRICAL', bounds: { xMin: 2150, xMax: 2600, yMin: 800, yMax: 1150 } },
                    { name: 'CAM 3: MEDICAL', bounds: { xMin: 200, xMax: 650, yMin: 800, yMax: 1150 } },
                    { name: 'CAM 4: HALLWAY', bounds: { xMin: 1340, xMax: 1460, yMin: 1800, yMax: 3150 } }
                ];
            } else {
                feeds = [
                    { name: 'CAM 1: BRIDGE', bounds: { xMin: 1550, xMax: 2050, yMin: 150, yMax: 470 } },
                    { name: 'CAM 2: ELECTRICAL', bounds: { xMin: 2350, xMax: 2800, yMin: 700, yMax: 1050 } },
                    { name: 'CAM 3: WEAPONS', bounds: { xMin: 2300, xMax: 2750, yMin: 250, yMax: 570 } },
                    { name: 'CAM 4: HALLWAY', bounds: { xMin: 1740, xMax: 1860, yMin: 1150, yMax: 1500 } }
                ];
            }

            const canvasList = [];
            feeds.forEach(f => {
                const box = document.createElement('div');
                box.style.cssText = 'background:#121216; border:2px solid #2d3436; border-radius:8px; padding:6px; display:flex; flex-direction:column; align-items:center;';
                const title = document.createElement('div');
                title.style.cssText = 'color:#00cec9; font-size:0.75rem; font-family:var(--font-heading); margin-bottom:4px; display:flex; justify-content:space-between; width:100%;';
                title.innerHTML = `<span>${f.name}</span><span style="color:#ff7675; animation: camsBlink 1s infinite;">🔴 REC</span>`;
                box.appendChild(title);

                const canvas = document.createElement('canvas');
                canvas.width = 200; canvas.height = 130;
                canvas.style.cssText = 'background:#08080a; border:1px solid #1e272e; border-radius:4px;';
                box.appendChild(canvas);
                grid.appendChild(box);
                canvasList.push({ canvas, bounds: f.bounds });
            });
            wrap.appendChild(grid); container.appendChild(wrap);

            if (!document.getElementById('cams-blink-style')) {
                const style = document.createElement('style');
                style.id = 'cams-blink-style';
                style.innerHTML = `@keyframes camsBlink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }`;
                document.head.appendChild(style);
            }

            let active = true;
            const renderFeeds = () => {
                if (!active || !window.gameInstance) return;
                const isJammed = window.gameInstance.sabotageSystem && window.gameInstance.sabotageSystem.activeSabotage === 'comms';
                canvasList.forEach(item => {
                    const canvas = item.canvas;
                    const ctx = canvas.getContext('2d');
                    const b = item.bounds;

                    if (isJammed) {
                        const imgData = ctx.createImageData(canvas.width, canvas.height);
                        const data = imgData.data;
                        for (let i = 0; i < data.length; i += 4) {
                            const val = Math.floor(Math.random() * 255);
                            data[i] = val;
                            data[i+1] = val;
                            data[i+2] = val;
                            data[i+3] = 255;
                        }
                        ctx.putImageData(imgData, 0, 0);
                        
                        ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
                        ctx.fillRect(0, 0, canvas.width, canvas.height);
                        ctx.fillStyle = '#ff7675';
                        ctx.font = 'bold 11px monospace';
                        ctx.textAlign = 'center';
                        ctx.fillText('⚠️ NO SIGNAL ⚠️', canvas.width / 2, canvas.height / 2);
                        return;
                    }

                    ctx.fillStyle = '#111216'; ctx.fillRect(0, 0, canvas.width, canvas.height);
                    ctx.strokeStyle = '#20222a'; ctx.lineWidth = 1;
                    const gridSpacing = 20;
                    for (let x = 0; x < canvas.width; x += gridSpacing) {
                        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); ctx.stroke();
                    }
                    for (let y = 0; y < canvas.height; y += gridSpacing) {
                        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke();
                    }

                    // Draw blueprint decorations for accuracy
                    ctx.fillStyle = 'rgba(255, 255, 255, 0.03)';
                    ctx.strokeStyle = 'rgba(0, 206, 201, 0.15)';
                    ctx.lineWidth = 2;
                    if (item.bounds.xMin === 1550) { // BRIDGE
                        const cx = canvas.width / 2;
                        const cy = canvas.height / 2 + 10;
                        ctx.beginPath(); ctx.arc(cx, cy, 18, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
                        ctx.fillStyle = 'rgba(214, 48, 49, 0.3)';
                        ctx.beginPath(); ctx.arc(cx, cy, 6, 0, Math.PI * 2); ctx.fill();
                    } else if (item.bounds.xMin === 2350) { // ELECTRICAL
                        ctx.fillRect(30, 40, 25, 45); ctx.strokeRect(30, 40, 25, 45);
                        ctx.fillRect(145, 40, 25, 45); ctx.strokeRect(145, 40, 25, 45);
                    } else if (item.bounds.xMin === 2300) { // WEAPONS
                        ctx.fillRect(140, 20, 30, 15); ctx.strokeRect(140, 20, 30, 15);
                        ctx.fillRect(140, 85, 30, 15); ctx.strokeRect(140, 85, 30, 15);
                    } else if (item.bounds.xMin === 1740) { // HALLWAY
                        ctx.fillStyle = '#0f1013';
                        ctx.fillRect(0, 0, 15, canvas.height);
                        ctx.fillRect(canvas.width - 15, 0, 15, canvas.height);
                        ctx.strokeStyle = 'rgba(0, 206, 201, 0.3)';
                        ctx.lineWidth = 3;
                        ctx.beginPath(); ctx.moveTo(15, 0); ctx.lineTo(15, canvas.height); ctx.stroke();
                        ctx.beginPath(); ctx.moveTo(canvas.width - 15, 0); ctx.lineTo(canvas.width - 15, canvas.height); ctx.stroke();
                    }

                    // Draw outer border representing room walls
                    ctx.strokeStyle = '#2d3436';
                    ctx.lineWidth = 4;
                    ctx.strokeRect(0, 0, canvas.width, canvas.height);

                    window.gameInstance.players.forEach(p => {
                        if (p.x >= b.xMin && p.x <= b.xMax && p.y >= b.yMin && p.y <= b.yMax) {
                            const relX = ((p.x - b.xMin) / (b.xMax - b.xMin)) * canvas.width;
                            const relY = ((p.y - b.yMin) / (b.yMax - b.yMin)) * canvas.height;
                            
                            // High fidelity cat sprite render!
                            ctx.save();
                            ctx.translate(relX, relY);
                            ctx.scale(0.55, 0.55);
                            
                            const mockPlayer = { ...p, x: 0, y: 0, scaleX: p.scaleX, isDead: p.isDead };
                            SpriteRenderer.drawPlayer(ctx, 0, 0, 32, mockPlayer);
                            ctx.restore();

                            ctx.fillStyle = p.isDead ? '#787878' : '#ffffff';
                            ctx.font = '800 9px sans-serif'; ctx.textAlign = 'center';
                            ctx.shadowColor = 'black'; ctx.shadowBlur = 3;
                            ctx.fillText(p.name + (p.isDead ? ' (👻)' : ''), relX, relY - 18);
                            ctx.shadowBlur = 0;
                        }
                    });
                });
                if (active) requestAnimationFrame(renderFeeds);
            };
            renderFeeds();

            const originalOnComplete = onComplete;
            onComplete = () => { active = false; task.completed = true; originalOnComplete(); };
            return () => { active = false; };
        } else {
            const wrap = document.createElement('div');
            wrap.style.cssText = 'display:grid; grid-template-columns:repeat(2, 1fr); gap:20px; padding:20px;';
            for (let i = 1; i <= 4; i++) {
                const item = document.createElement('button');
                item.className = 'btn-secondary';
                item.style.cssText = 'height:80px; font-size:1.2rem; font-family:var(--font-heading);';
                item.innerText = `Complete Component #${i}`;
                item.onclick = () => {
                    item.style.background = '#00b894'; item.disabled = true;
                    currentVal += 1; soundManager.playVoteClick();
                    if (currentVal >= 4) { task.completed = true; soundManager.playTaskComplete(); onComplete(); }
                };
                wrap.appendChild(item);
            }
            container.appendChild(wrap);
        }
    }
}

// ==========================================
// 6. PLAYER CLASS
// ==========================================
class Player {
    constructor(id, name, colorIndex, hatIndex, role, isLocalPlayer = false) {
        this.id = id; this.name = name; this.colorIndex = colorIndex; this.hatIndex = hatIndex;
        this.role = role; this.isLocalPlayer = isLocalPlayer;
        this.x = 1800; this.y = 280; this.radius = 32; this.speed = 220;
        this.isDead = false; this.isEjected = false; this.bodyCleaned = false; this.inVent = false; this.hasKnife = false; this.currentVentId = null;
        this.killCooldown = 10; this.reviveUses = 2; this.tasks = []; this.stepTimer = 0;
        this.suspicionLevels = {}; this.completedTasksCount = 0;
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
        if (this.invulnTimer > 0) this.invulnTimer -= dt;
        if (this.inVent) return;
        let dx = 0, dy = 0;
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
        if (this.role === 'evil Dog' && this.killCooldown > 0) {
            this.killCooldown -= dt; if (this.killCooldown < 0) this.killCooldown = 0;
        }
        if (this.suspicionLevels) {
            for (const key in this.suspicionLevels) {
                if (this.suspicionLevels[key] > 0) {
                    this.suspicionLevels[key] = Math.max(0, this.suspicionLevels[key] - 0.25 * dt);
                }
            }
        }
        const currentCompletedCount = (this.tasks || []).filter(t => t.completed).length;
        if (currentCompletedCount > (this.completedTasksCount || 0)) {
            const delta = currentCompletedCount - (this.completedTasksCount || 0);
            this.completedTasksCount = currentCompletedCount;
            const allTasksCompleted = this.tasks.length > 0 && currentCompletedCount === this.tasks.length;
            
            const game = window.gameInstance;
            if (game && game.players) {
                game.players.forEach(other => {
                    if (other.suspicionLevels) {
                        if (allTasksCompleted) {
                            other.suspicionLevels[this.id] = 0;
                        } else {
                            other.suspicionLevels[this.id] = Math.max(0, (other.suspicionLevels[this.id] || 0) - 25 * delta);
                        }
                    }
                });
            }
        }
    }

    canKill(targetPlayer) {
        if (this.role !== 'evil Dog' || this.isDead || this.killCooldown > 0) return false;
        if (!targetPlayer || targetPlayer.isDead || targetPlayer.id === this.id || targetPlayer.role === 'evil Dog') return false;
        return Math.hypot(this.x - targetPlayer.x, this.y - targetPlayer.y) <= 80;
    }

    canRevive(targetPlayer) {
        if (this.role !== 'Medic' || this.isDead || this.reviveUses <= 0) return false;
        if (!targetPlayer || !targetPlayer.isDead) return false;
        return Math.hypot(this.x - targetPlayer.x, this.y - targetPlayer.y) <= 80;
    }
}

const isPointWalkable = (px, py) => {
    const margin = 8;
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
        if (!isPointWalkable(px, py)) return false;
    }
    return true;
};
window.isLineOfSightClear = isLineOfSightClear;

// ==========================================
// 7. MAP RENDERER
// ==========================================
class MapRenderer {
    constructor() { this.cameraX = 1750; this.cameraY = 260; }
    renderRoomProps(ctx, room) {
        if (room.id === 'security') {
            const camTask = room.tasks.find(t => t.id === 'monitor_cams');
            const deskX = camTask ? camTask.x : room.x + 130;
            const deskY = camTask ? camTask.y : room.y + 50;

            ctx.fillStyle = '#2d3436';
            ctx.fillRect(deskX - 40, deskY - 30, 80, 40); // desk
            
            ctx.fillStyle = '#1e272e';
            ctx.fillRect(deskX - 30, deskY - 25, 25, 18);
            ctx.fillRect(deskX + 5, deskY - 25, 25, 18);

            ctx.fillStyle = '#00d2d3';
            ctx.fillRect(deskX - 28, deskY - 23, 21, 14);
            ctx.fillRect(deskX + 7, deskY - 23, 21, 14);

            ctx.strokeStyle = '#57606f'; ctx.lineWidth = 3;
            ctx.beginPath(); ctx.moveTo(deskX - 18, deskY - 7); ctx.lineTo(deskX - 18, deskY - 4); ctx.stroke();
            ctx.beginPath(); ctx.moveTo(deskX + 17, deskY - 7); ctx.lineTo(deskX + 17, deskY - 4); ctx.stroke();
            
            ctx.fillStyle = '#00cec9'; ctx.font = '700 10px sans-serif'; ctx.textAlign = 'center';
            ctx.fillText('CAMS', deskX, deskY + 5);
        }
    }
    updateCamera(targetX, targetY, viewportWidth, viewportHeight) {
        if (!targetX || !targetY) return;
        this.cameraX += (targetX - this.cameraX) * 0.12;
        this.cameraY += (targetY - this.cameraY) * 0.12;
    }
    render(ctx, width, height, localPlayer, players, sabotageSystem) {
        ctx.save();
        
        // Fill full viewport background first
        ctx.fillStyle = '#0a0c14';
        ctx.fillRect(0, 0, width, height);

        ctx.translate(width / 2 - this.cameraX, height / 2 - this.cameraY);

        // Giant Cat Spaceship Hull Outline with Neon Glowing Ears & Whiskers
        ctx.strokeStyle = 'rgba(255, 117, 140, 0.6)'; ctx.lineWidth = 16; ctx.beginPath();
        ctx.moveTo(1800, 100); ctx.lineTo(2400, 50); ctx.lineTo(2350, 350); ctx.lineTo(3300, 1000); ctx.lineTo(3100, 2400);
        ctx.quadraticCurveTo(1800, 2550, 500, 2400); ctx.lineTo(300, 1000); ctx.lineTo(1250, 350); ctx.lineTo(1200, 50); ctx.lineTo(1800, 100);
        ctx.closePath(); ctx.stroke();

        // High-Tech Hallways & Metal Grid Lines
        ctx.fillStyle = '#1e272e';
        for (const corr of CORRIDORS) {
            ctx.beginPath();
            if (corr.x1 === corr.x2) ctx.rect(corr.x1 - corr.width / 2, Math.min(corr.y1, corr.y2), corr.width, Math.abs(corr.y2 - corr.y1));
            else ctx.rect(Math.min(corr.x1, corr.x2), corr.y1 - corr.width / 2, Math.abs(corr.x2 - corr.x1), corr.width);
            ctx.fill();
            
            // Hallway Center LED Strip
            ctx.strokeStyle = 'rgba(72, 219, 251, 0.4)'; ctx.lineWidth = 4; ctx.beginPath();
            ctx.moveTo(corr.x1, corr.y1); ctx.lineTo(corr.x2, corr.y2); ctx.stroke();
        }

        // Render Rooms with Furniture & Detailed Scenery
        for (const room of ROOMS) {
            ctx.fillStyle = room.bgColor; ctx.fillRect(room.x, room.y, room.width, room.height);
            ctx.strokeStyle = room.color; ctx.lineWidth = 6; ctx.strokeRect(room.x, room.y, room.width, room.height);
            
            // Room Metallic Tile Grid Lines
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)'; ctx.lineWidth = 2;
            for (let gx = room.x + 50; gx < room.x + room.width; gx += 50) {
                ctx.beginPath(); ctx.moveTo(gx, room.y); ctx.lineTo(gx, room.y + room.height); ctx.stroke();
            }
            for (let gy = room.y + 50; gy < room.y + room.height; gy += 50) {
                ctx.beginPath(); ctx.moveTo(room.x, gy); ctx.lineTo(room.x + room.width, gy); ctx.stroke();
            }

            // Room Name Header & Icon
            ctx.fillStyle = 'rgba(255, 255, 255, 0.9)'; ctx.font = '700 20px "Fredoka", cursive'; ctx.textAlign = 'center';
            ctx.fillText(room.name, room.x + room.width / 2, room.y + 35);

            // Render Specific Room Furniture & Props
            this.renderRoomProps(ctx, room);

            // Render Tasks Markers
            for (const t of room.tasks) {
                const hasTask = localPlayer && localPlayer.tasks.find(tk => {
                    const baseId = tk.id.split('_reassigned_')[0];
                    let isLocked = false;
                    if (baseId === 'upload_data') {
                        const hasUncompletedDownload = localPlayer.tasks.some(d => (d.id.includes('download_data') || d.id.includes('download_comms')) && !d.completed);
                        isLocked = hasUncompletedDownload;
                    } else if (baseId === 'load_torpedoes') {
                        const hasUncompletedPickup = localPlayer.tasks.some(p => p.id.includes('pickup_torpedo') && !p.completed);
                        isLocked = hasUncompletedPickup;
                    }
                    return baseId === t.id && !tk.completed && !isLocked;
                });
                if (hasTask) {
                    const isVisible = !localPlayer || localPlayer.isDead || isLineOfSightClear(localPlayer.x, localPlayer.y, t.x, t.y);
                    if (isVisible) {
                        ctx.fillStyle = '#fdcb6e'; ctx.beginPath(); ctx.arc(t.x, t.y, 14, 0, Math.PI * 2); ctx.fill();
                        ctx.strokeStyle = '#ffeaa7'; ctx.lineWidth = 3; ctx.stroke();
                        ctx.fillStyle = '#2d3436'; ctx.font = '700 12px sans-serif'; ctx.fillText('⚡', t.x, t.y + 4);
                    }
                }
            }

            // Emergency Meeting Pedestal
            if (room.hasEmergencyButton) {
                ctx.fillStyle = 'rgba(214, 48, 49, 0.3)'; ctx.beginPath(); ctx.arc(room.buttonX, room.buttonY, 32, 0, Math.PI * 2); ctx.fill();
                ctx.fillStyle = '#d63031'; ctx.beginPath(); ctx.arc(room.buttonX, room.buttonY, 20, 0, Math.PI * 2); ctx.fill();
                ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 3; ctx.stroke();
                ctx.fillStyle = 'white'; ctx.font = '700 12px sans-serif'; ctx.fillText('MEET', room.buttonX, room.buttonY + 4);
            }

            // Render active sabotage panels on the map
            if (sabotageSystem.activeSabotage === 'lights' && room.hasLightsFixPanel) {
                const pulse = 1 + 0.15 * Math.sin(Date.now() * 0.008);
                ctx.fillStyle = 'rgba(253, 203, 110, 0.25)'; ctx.beginPath(); ctx.arc(room.lightsFixX, room.lightsFixY, 22 * pulse, 0, Math.PI * 2); ctx.fill();
                ctx.fillStyle = '#fdcb6e'; ctx.beginPath(); ctx.arc(room.lightsFixX, room.lightsFixY, 15, 0, Math.PI * 2); ctx.fill();
                ctx.strokeStyle = '#ffeaa7'; ctx.lineWidth = 3; ctx.stroke();
                ctx.fillStyle = '#2d3436'; ctx.font = '700 13px sans-serif'; ctx.fillText('⚡', room.lightsFixX, room.lightsFixY + 4.5);
            }
            if (sabotageSystem.activeSabotage === 'engine' && room.hasEngineFixPanel) {
                const pulse = 1 + 0.2 * Math.sin(Date.now() * 0.01);
                ctx.fillStyle = 'rgba(214, 48, 49, 0.3)'; ctx.beginPath(); ctx.arc(room.engineFixX, room.engineFixY, 25 * pulse, 0, Math.PI * 2); ctx.fill();
                ctx.fillStyle = '#d63031'; ctx.beginPath(); ctx.arc(room.engineFixX, room.engineFixY, 17, 0, Math.PI * 2); ctx.fill();
                ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 3; ctx.stroke();
                ctx.fillStyle = '#ffffff'; ctx.font = '700 13px sans-serif'; ctx.fillText('⚠️', room.engineFixX, room.engineFixY + 4.5);
            }
            if (sabotageSystem.activeSabotage === 'comms' && room.hasCommsFixPanel) {
                const pulse = 1 + 0.2 * Math.sin(Date.now() * 0.009);
                ctx.fillStyle = 'rgba(9, 132, 227, 0.3)'; ctx.beginPath(); ctx.arc(room.commsFixX, room.commsFixY, 25 * pulse, 0, Math.PI * 2); ctx.fill();
                ctx.fillStyle = '#0984e3'; ctx.beginPath(); ctx.arc(room.commsFixX, room.commsFixY, 17, 0, Math.PI * 2); ctx.fill();
                ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 3; ctx.stroke();
                ctx.fillStyle = '#ffffff'; ctx.font = '700 13px sans-serif'; ctx.fillText('📡', room.commsFixX, room.commsFixY + 4.5);
            }
        }

        const canSeeVents = localPlayer ? (localPlayer.role === 'evil Dog' || localPlayer.role === 'Engineer' || localPlayer.isDead) : true;
        for (const v of VENTS) {
            ctx.fillStyle = canSeeVents ? '#a29bfe' : '#636e72'; ctx.fillRect(v.x - 16, v.y - 16, 32, 32);
            ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 2; ctx.strokeRect(v.x - 16, v.y - 16, 32, 32);
            ctx.fillStyle = 'white'; ctx.font = '12px sans-serif'; ctx.textAlign = 'center'; ctx.fillText('🌀', v.x, v.y + 4);
        }

        // 6. Draw Ladders (Catnip Observatory only)
        if (localPlayer && window.gameInstance && window.gameInstance.selectedMap === 'catnip_observatory') {
            const ladders = [
                { x: 1400, y: 650 },
                { x: 1400, y: 3650 },
                { x: 650, y: 975 },
                { x: 650, y: 3975 },
                { x: 2150, y: 975 },
                { x: 2150, y: 3975 }
            ];
            for (const l of ladders) {
                ctx.fillStyle = 'rgba(46, 213, 115, 0.2)';
                ctx.beginPath(); ctx.arc(l.x, l.y, 25, 0, Math.PI * 2); ctx.fill();
                ctx.strokeStyle = '#2ed573'; ctx.lineWidth = 3; ctx.stroke();
                ctx.fillStyle = '#ffffff'; ctx.font = '16px sans-serif'; ctx.textAlign = 'center';
                ctx.fillText('🪜', l.x, l.y + 5);
            }
        }

        if (window.gameInstance && window.gameInstance.defensiveProtocolActive && window.gameInstance.invaders) {
            window.gameInstance.invaders.forEach(inv => {
                const dist = Math.hypot(inv.x - localPlayer.x, inv.y - localPlayer.y);
                const sameFloor = (localPlayer.y >= 2800) === (inv.y >= 2800);
                const visionRadius = (localPlayer && typeof localPlayer.getVisionRadius === 'function') ? localPlayer.getVisionRadius(sabotageSystem.activeSabotage) : 750;
                const isVisible = localPlayer.isDead || (sameFloor && dist <= visionRadius && isLineOfSightClear(localPlayer.x, localPlayer.y, inv.x, inv.y));
                
                if (isVisible) {
                    ctx.save();
                    ctx.translate(inv.x, inv.y);
                    
                    ctx.beginPath();
                    ctx.ellipse(0, 12, 16, 8, 0, 0, Math.PI * 2);
                    ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
                    ctx.fill();

                    const pulse = 1 + 0.1 * Math.sin(Date.now() * 0.01);

                    ctx.fillStyle = '#6c5ce7';
                    ctx.strokeStyle = '#a29bfe';
                    ctx.lineWidth = 2.5;
                    ctx.beginPath();
                    ctx.arc(0, 0, 14 * pulse, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.stroke();

                    ctx.fillStyle = '#d63031';
                    ctx.beginPath();
                    ctx.arc(0, -2, 5, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.fillStyle = 'white';
                    ctx.beginPath();
                    ctx.arc(-1, -3, 1.5, 0, Math.PI * 2);
                    ctx.fill();

                    ctx.strokeStyle = '#6c5ce7';
                    ctx.lineWidth = 3;
                    ctx.beginPath();
                    ctx.moveTo(-6, -10); ctx.lineTo(-10, -18);
                    ctx.moveTo(6, -10); ctx.lineTo(10, -18);
                    ctx.stroke();

                    ctx.fillStyle = '#a29bfe';
                    ctx.beginPath();
                    ctx.arc(-10, -18, 3, 0, Math.PI * 2);
                    ctx.arc(10, -18, 3, 0, Math.PI * 2);
                    ctx.fill();

                    ctx.restore();
                }
            });
        }

        for (const p of players) {
            if (p.inVent) continue;
            let isVisible = true;
            const sameFloor = (p.y >= 2800) === (localPlayer.y >= 2800);
            if (localPlayer) {
                const dist = Math.hypot(p.x - localPlayer.x, p.y - localPlayer.y);
                const visionRadius = (localPlayer && typeof localPlayer.getVisionRadius === 'function') ? localPlayer.getVisionRadius(sabotageSystem.activeSabotage) : 750;
                isVisible = localPlayer.isDead || p.isLocalPlayer || (sameFloor && dist <= visionRadius && isLineOfSightClear(localPlayer.x, localPlayer.y, p.x, p.y));
            }
            if (isVisible) {
                SpriteRenderer.drawPlayer(ctx, p.x, p.y, p.radius, p, p.isDead);
                if (localPlayer && localPlayer.isDead && p.role === 'evil Dog') {
                    ctx.save();
                    ctx.translate(p.x, p.y);
                    ctx.beginPath();
                    ctx.arc(0, 0, p.radius + 6, 0, Math.PI * 2);
                    ctx.strokeStyle = '#ff7675';
                    ctx.lineWidth = 3;
                    ctx.shadowColor = '#d63031';
                    ctx.shadowBlur = 10;
                    ctx.stroke();
                    ctx.restore();
                } else {
                    let highestSus = 0;
                    for (const bot of players) {
                        if (!bot.isDead && !bot.isLocalPlayer && bot.suspicionLevels) {
                            const score = bot.suspicionLevels[p.id] || 0;
                            if (score > highestSus) highestSus = score;
                        }
                    }
                    if (highestSus >= 50) {
                        ctx.save();
                        ctx.translate(p.x, p.y);
                        ctx.beginPath();
                        ctx.arc(0, 0, p.radius + 6, 0, Math.PI * 2);
                        ctx.strokeStyle = highestSus >= 100 ? '#ff7675' : '#fdcb6e';
                        ctx.lineWidth = 3;
                        ctx.shadowColor = highestSus >= 100 ? '#d63031' : '#ffeaa7';
                        ctx.shadowBlur = highestSus >= 100 ? 12 : 8;
                        ctx.stroke();
                        ctx.restore();
                        
                        if (highestSus >= 100) {
                            ctx.save();
                            ctx.fillStyle = '#ffffff';
                            ctx.font = '16px sans-serif';
                            ctx.textAlign = 'center';
                            ctx.fillText('🚨', p.x, p.y - p.radius - 12);
                            ctx.restore();
                        }
                    }
                }
            }
        }
        ctx.restore();

        if (localPlayer && !localPlayer.isDead) {
            this.drawFogOfWar(ctx, width, height, localPlayer, sabotageSystem);
            this.drawSabotageIndicators(ctx, width, height, localPlayer, sabotageSystem);
        }
    }

    drawSabotageIndicators(ctx, width, height, localPlayer, sabotageSystem) {
        if (sabotageSystem.activeSabotage) {
            let targetX = 0, targetY = 0, label = "", color = "#ff7675";
            if (sabotageSystem.activeSabotage === 'lights') {
                const el = ROOMS.find(r => r.id === 'electrical');
                if (el) { targetX = el.lightsFixX; targetY = el.lightsFixY; label = "FIX LIGHTS"; color = "#fdcb6e"; }
            } else if (sabotageSystem.activeSabotage === 'engine') {
                const ye = ROOMS.find(r => r.hasEngineFixPanel);
                if (ye) { targetX = ye.engineFixX; targetY = ye.engineFixY; label = "FIX ENGINE"; color = "#d63031"; }
            } else if (sabotageSystem.activeSabotage === 'comms') {
                const cm = ROOMS.find(r => r.id === 'comms');
                if (cm) { targetX = cm.commsFixX; targetY = cm.commsFixY; label = "FIX COMMS"; color = "#0984e3"; }
            }

            if (targetX > 0 && targetY > 0) {
                const dx = targetX - localPlayer.x;
                const dy = targetY - localPlayer.y;
                const dist = Math.hypot(dx, dy);
                if (dist > 160) {
                    const angle = Math.atan2(dy, dx);
                    const cx = width / 2;
                    const cy = height / 2;
                    const radius = 135;
                    const indX = cx + Math.cos(angle) * radius;
                    const indY = cy + Math.sin(angle) * radius;

                    ctx.save();
                    ctx.shadowColor = color;
                    ctx.shadowBlur = 10;
                    ctx.fillStyle = color;
                    ctx.beginPath();
                    ctx.arc(indX, indY, 14, 0, Math.PI * 2);
                    ctx.fill();

                    ctx.translate(indX, indY);
                    ctx.rotate(angle);
                    ctx.fillStyle = '#ffffff';
                    ctx.beginPath();
                    ctx.moveTo(8, 0);
                    ctx.lineTo(-5, -6);
                    ctx.lineTo(-2, 0);
                    ctx.lineTo(-5, 6);
                    ctx.closePath();
                    ctx.fill();
                    ctx.restore();

                    ctx.fillStyle = '#ffffff';
                    ctx.font = '800 10px sans-serif';
                    ctx.textAlign = 'center';
                    ctx.shadowColor = 'black';
                    ctx.shadowBlur = 4;
                    ctx.fillText(`${label} (${Math.round(dist)}m)`, indX, indY - 20);
                    ctx.shadowBlur = 0;
                }
            }
        }
    }

    drawFogOfWar(ctx, width, height, localPlayer, sabotageSystem) {
        ctx.save();
        const visionRadius = localPlayer.getVisionRadius ? localPlayer.getVisionRadius(sabotageSystem.activeSabotage) : (sabotageSystem.activeSabotage === 'lights' ? 250 : 750);
        const grad = ctx.createRadialGradient(
            width / 2, height / 2, visionRadius * 0.7,
            width / 2, height / 2, visionRadius
        );
        grad.addColorStop(0, 'rgba(0, 0, 0, 0)');
        grad.addColorStop(1, 'rgba(0, 0, 0, 0.95)');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, width, height);
        ctx.restore();
    }

    renderMinimap(canvas, localPlayer, players) {
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const isJammed = window.gameInstance && window.gameInstance.sabotageSystem && window.gameInstance.sabotageSystem.activeSabotage === 'comms';
        if (isJammed) {
            ctx.fillStyle = '#111216'; ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.strokeStyle = '#20222a'; ctx.lineWidth = 1;
            for (let y = 0; y < canvas.height; y += 8) {
                ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke();
            }
            ctx.fillStyle = '#ff7675'; ctx.font = '800 10px sans-serif'; ctx.textAlign = 'center';
            ctx.fillText('📡 COMMS OFFLINE', canvas.width / 2, canvas.height / 2 + 3);
            return;
        }
        const scaleX = canvas.width / MAP_BOUNDS.width;
        const scaleY = canvas.height / MAP_BOUNDS.height;
        ctx.fillStyle = '#0f111a'; ctx.fillRect(0, 0, canvas.width, canvas.height);
        for (const r of ROOMS) {
            ctx.fillStyle = r.color; ctx.fillRect(r.x * scaleX, r.y * scaleY, r.width * scaleX, r.height * scaleY);
        }
        if (localPlayer) {
            ctx.fillStyle = '#ff758c'; ctx.beginPath(); ctx.arc(localPlayer.x * scaleX, localPlayer.y * scaleY, 4, 0, Math.PI * 2); ctx.fill();
        }
    }
}

// ==========================================
// 8. AI CONTROLLER
// ==========================================
class AIController {
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

        // 2. Fleeing Behavior (Flee from Invader Dogs during Defensive Protocol if unarmed or out of ammo)
        if (bot.role !== 'evil Dog' && window.gameInstance && window.gameInstance.defensiveProtocolActive && (!bot.hasGun || bot.gunAmmo === 0) && window.gameInstance.invaders) {
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

        if (selectedMap === 'cat_hq') {
            spineX = 2000;
            ROOM_NODES = {
                bridge: { center: { x: 2000, y: 325 }, door: { x: 2000, y: 500 } },
                medical: { center: { x: 1275, y: 410 }, door: { x: 1500, y: 410 } },
                weapons: { center: { x: 2725, y: 410 }, door: { x: 2500, y: 410 } },
                security: { center: { x: 650, y: 875 }, door: { x: 850, y: 875 } },
                ship_quarters: { center: { x: 1300, y: 910 }, door: { x: 1300, y: 1070 } },
                cat_garden: { center: { x: 2000, y: 925 }, door: { x: 2000, y: 1100 } },
                nap_quarters: { center: { x: 2700, y: 910 }, door: { x: 2700, y: 1070 } },
                electrical: { center: { x: 3350, y: 875 }, door: { x: 3150, y: 875 } },
                o2: { center: { x: 650, y: 1460 }, door: { x: 850, y: 1460 } },
                fish_storage: { center: { x: 1275, y: 1460 }, door: { x: 1275, y: 1620 } },
                admin: { center: { x: 2000, y: 1450 }, door: { x: 2000, y: 1600 } },
                kitchen: { center: { x: 2725, y: 1460 }, door: { x: 2725, y: 1620 } },
                comms: { center: { x: 3350, y: 1460 }, door: { x: 3150, y: 1460 } },
                records: { center: { x: 675, y: 2010 }, door: { x: 900, y: 2010 } },
                cargo_bay: { center: { x: 2000, y: 2100 }, door: { x: 2000, y: 1900 } },
                workshop: { center: { x: 3325, y: 2010 }, door: { x: 3100, y: 2010 } },
                yarn_engine: { center: { x: 1250, y: 2550 }, door: { x: 1250, y: 2350 } },
                shields: { center: { x: 2750, y: 2550 }, door: { x: 2750, y: 2350 } }
            };
        } else if (selectedMap === 'catnip_observatory') {
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

        // If doing task, count down task timer
        if (bot.taskTimer > 0) {
            bot.taskTimer -= dt;
            if (bot.taskTimer <= 0) {
                if (bot.currentTaskToComplete) {
                    bot.currentTaskToComplete.completed = true;
                    const baseId = bot.currentTaskToComplete.id.split('_reassigned_')[0];
                    if (baseId === 'def_get_weapons') {
                        bot.hasGun = true;
                        bot.gunAmmo = 5;
                    }
                    if (bot.currentTaskToComplete.id === 'post_def_heal') {
                        bot.health = 3;
                        bot.tasks = bot.tasks.filter(t => t.id !== 'post_def_heal');
                    }
                    if (bot.currentTaskToComplete.id === 'pickup_torpedo') {
                        bot.tasks.forEach(tk => {
                            if (tk.id === 'load_torpedoes') tk.locked = false;
                        });
                    }
                    soundManager.playVoteClick();
                    bot.currentTaskToComplete = null;
                }
            }
            return; // Pause movement while performing task!
        }

        // Initialize path or pick uncompleted task target
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

            if (window.gameInstance && window.gameInstance.defensiveProtocolActive && bot.role !== 'evil Dog') {
                if (!bot.hasGun) {
                    // Go to Kitchen to get the gun
                    const hasWeaponTask = uncompletedTasks.find(t => t.id === 'def_get_weapons');
                    if (hasWeaponTask) {
                        const roomObj = ROOMS.find(r => r.id === 'kitchen');
                        if (roomObj) {
                            targetKey = 'kitchen';
                            const baseTaskId = hasWeaponTask.id.split('_reassigned_')[0];
                            const tkLoc = roomObj.tasks.find(tk => tk.id === baseTaskId);
                            if (tkLoc) taskTarget = { ...tkLoc, taskObj: hasWeaponTask };
                        }
                    } else {
                        targetKey = 'kitchen';
                    }
                } else if (bot.gunAmmo === 0) {
                    // Go to Workshop to reload
                    targetKey = 'workshop';
                } else if (window.gameInstance.invaders && window.gameInstance.invaders.length > 0) {
                    // Active hunting! Seek out the nearest invader dog
                    const nearestInv = window.gameInstance.invaders.slice().sort((a, b) => Math.hypot(a.x - bot.x, a.y - bot.y) - Math.hypot(b.x - bot.x, b.y - bot.y))[0];
                    if (nearestInv) {
                        let closestRoom = 'bridge';
                        let minDist = Infinity;
                        for (const key of Object.keys(ROOM_NODES)) {
                            const d = Math.hypot(nearestInv.x - ROOM_NODES[key].center.x, nearestInv.y - ROOM_NODES[key].center.y);
                            if (d < minDist) { minDist = d; closestRoom = key; }
                        }
                        targetKey = closestRoom;
                        taskTarget = { x: nearestInv.x, y: nearestInv.y };
                    }
                } else {
                    // Normal tasks if no invaders currently
                    let tasksToSelect = uncompletedTasks;
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
                }
            } else {
                let tasksToSelect = uncompletedTasks;
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

        // Move towards next node in path
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
                        window.gameInstance.triggerMeeting(bot, null);
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

        if (bot.role === 'Detective' && !bot.isDead && window.gameInstance && window.gameInstance.state === 'PLAYING') {
            const nearbyKiller = players.find(p => !p.isDead && p.id !== bot.id && p.lastKillTimestamp && (Date.now() - p.lastKillTimestamp <= 15000) && Math.hypot(bot.x - p.x, bot.y - p.y) <= 250);
            if (nearbyKiller && isLineOfSightClear(bot.x, bot.y, nearbyKiller.x, nearbyKiller.y)) {
                window.gameInstance.detectiveAccusedId = nearbyKiller.id;
                window.gameInstance.detectiveExposedDog = true;
                window.gameInstance.triggerMeeting(bot, null);
                return;
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

            // 2. Target Selection (only chase isolated cats, unless Detective exposed the dog)
            if (!bot.justKilled && bot.killCooldown <= 0 && !bot.isLocalPlayer) {
                let targetCat = null;
                if (window.gameInstance && window.gameInstance.detectiveExposedDog) {
                    const detective = players.find(p => p.role === 'Detective' && !p.isDead);
                    if (detective) {
                        targetCat = detective;
                    }
                }
                if (!targetCat) {
                    let minDist = 350;
                    for (const p of players) {
                        if (!p.isDead && p.id !== bot.id && p.role !== 'evil Dog') {
                            if (checkIsolation(p)) {
                                const d = Math.hypot(bot.x - p.x, bot.y - p.y);
                                if (d < minDist) { minDist = d; targetCat = p; }
                            }
                        }
                    }
                }
                if (targetCat) {
                    bot.currentPath = [{ x: targetCat.x, y: targetCat.y }];
                }
            }

            // 3. Smart Killing (only kill if isolated and close)
            if (bot.killCooldown <= 0 && (!window.gameInstance || window.gameInstance.globalKillTimer <= 0)) {
                for (const target of players) {
                    if (!target.isDead && target.id !== bot.id && target.role !== 'evil Dog' && Math.hypot(bot.x - target.x, bot.y - target.y) <= 80) {
                        if (checkIsolation(target)) {
                            target.isDead = true;
                            bot.lastKillTimestamp = Date.now();
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
class MeetingManager {
    constructor() {
        this.active = false;
        this.timer = 30;
        this.reporter = null;
        this.bodyPlayer = null;
        this.votes = {};
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
            this.accusedId = witnessedKillerId; // Witness takes absolute priority
        } else {
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

        // Check Detective accusation
        const detective = players.find(p => p.role === 'Detective' && !p.isDead);
        const detectiveAccusedId = window.gameInstance && window.gameInstance.detectiveAccusedId;
        if (detective && detectiveAccusedId) {
            this.accusedId = detectiveAccusedId;
            const accusedPlayer = players.find(p => p.id === detectiveAccusedId);
            if (accusedPlayer) {
                setTimeout(() => {
                    if (this.active) {
                        const msgText = `🚨 ${accusedPlayer.name} is the dog i investigated him and all signs point to ${accusedPlayer.name} being the dog`;
                        if (detective.isLocalPlayer) {
                            this.sendUserChatMessage(msgText, detective.name, players);
                        } else {
                            const chatContainer = document.getElementById('chat-messages-container');
                            const msg = document.createElement('div');
                            msg.className = 'chat-msg bot-msg';
                            msg.innerHTML = `<strong>${detective.name}:</strong> ${msgText}`;
                            this.appendChatMessage(chatContainer, msg);
                        }
                    }
                }, 800);
            }
        }

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
        titleEl.innerText = this.bodyPlayer ? `📢 DEAD BODY REPORTED BY ${this.reporter.name.toUpperCase()}!` : `🚨 EMERGENCY MEETING CALLED BY ${this.reporter.name.toUpperCase()}!`;
        const grid = document.getElementById('voting-players-grid'); grid.innerHTML = '';
        
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
            const card = document.createElement('div'); card.className = `player-vote-card ${p.isDead ? 'dead' : ''}`;
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

        const chatContainer = document.getElementById('chat-messages-container'); chatContainer.innerHTML = '';
        
        // Schedule dynamic AI bot dialogue & voting timers
        const aliveBots = players.filter(p => !p.isLocalPlayer && !p.isDead);
        const aliveNames = players.filter(p => !p.isDead).map(p => p.name);
        const roomNames = ['Fish Storage', 'Yarn Engine', 'Nap Quarters', 'Kitchen', 'Workshop', 'Cat Garden', 'Bridge', 'Cargo Bay'];

        // Select a subset of up to 5 bots to speak in chat to prevent message spam
        const talkers = [...aliveBots].sort(() => 0.5 - Math.random()).slice(0, 5);
        talkers.forEach((bot, index) => {
            // Dialogue timer
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

                const msg = document.createElement('div'); msg.className = 'chat-msg bot-msg';
                msg.innerHTML = `<strong>${bot.name}:</strong> ${lineText}`;
                this.appendChatMessage(chatContainer, msg);
            }, (index + 1) * 600);
        });

        // Loop all alive bots to cast their votes with a fast, randomized delay (0.8s to 3.5s)
        aliveBots.forEach((bot) => {
            const voteDelay = 800 + Math.random() * 2700;
            setTimeout(() => {
                if (!this.active) return;
                if (bot.role === 'evil Dog') {
                    const detective = players.find(p => p.role === 'Detective' && !p.isDead);
                    if (detective && this.accusedId === bot.id) {
                        this.votes[bot.id] = detective.id;
                    } else {
                        this.votes[bot.id] = 'skip';
                    }
                } else if (bot.witnessedKillerId !== undefined && bot.witnessedKillerId !== null) {
                    this.votes[bot.id] = bot.witnessedKillerId;
                } else if (this.accusedId !== null) {
                    const r = Math.random();
                    if (r < 0.85) { // 85% chance to agree with the detective/accused player!
                        this.votes[bot.id] = this.accusedId;
                    } else if (r < 0.95) {
                        this.votes[bot.id] = 'skip';
                    } else {
                        const choices = players.filter(pl => !pl.isDead).map(pl => pl.id);
                        choices.push('skip');
                        this.votes[bot.id] = choices[Math.floor(Math.random() * choices.length)];
                    }
                } else {
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
        this.timer -= dt; document.getElementById('meeting-timer').innerText = Math.ceil(this.timer);
        if (this.timer <= 0) this.tallyVotes(players);
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

        // Trigger AI bot response
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
    tallyVotes(players) {
        this.active = false; const counts = { skip: 0 };
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

        // Display Among Us style voter icons on player cards!
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

        let maxVotes = 0, ejectedId = null, isTie = false;
        for (const [id, count] of Object.entries(counts)) {
            if (id === 'skip') continue;
            if (count > maxVotes) { maxVotes = count; ejectedId = id; isTie = false; }
            else if (count === maxVotes) isTie = true;
        }
        
        if (counts.skip >= maxVotes) {
            ejectedId = null;
        }

        const ejectedPlayer = players.find(p => p.id == ejectedId);

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

        // Pause 3.5 seconds so players can see who voted for whom!
        setTimeout(() => {
            if (ejectedPlayer && !isTie) {
                ejectedPlayer.isDead = true;
                ejectedPlayer.isEjected = true;
            }
            if (window.gameInstance) {
                window.gameInstance.detectiveAccusedId = null;
            }
            this.onComplete(ejectedPlayer, isTie);
        }, 3500);
    }
}

// ==========================================
// 10. UI MANAGER
// ==========================================
class UIManager {
    constructor(game) { this.game = game; this.setupEventListeners(); }
    setupEventListeners() {
        document.getElementById('start-game-btn').onclick = () => {
            const nameInput = document.getElementById('player-name-input').value.trim() || 'Whiskers';
            this.game.startNewGame(nameInput);
        };
        document.getElementById('prev-color-btn').onclick = () => this.changeColor(-1);
        document.getElementById('next-color-btn').onclick = () => this.changeColor(1);
        document.getElementById('prev-hat-btn').onclick = () => this.changeHat(-1);
        document.getElementById('next-hat-btn').onclick = () => this.changeHat(1);
        document.getElementById('prev-map-btn').onclick = () => this.changeMap(-1);
        document.getElementById('next-map-btn').onclick = () => this.changeMap(1);
        document.getElementById('prev-cats-btn').onclick = () => this.changeCats(-1);
        document.getElementById('next-cats-btn').onclick = () => this.changeCats(1);
        document.getElementById('role-continue-btn').onclick = () => { this.showScreen('hud-screen'); this.game.state = 'PLAYING'; };
        document.getElementById('close-task-btn').onclick = () => {
            if (this.game.activeTask && this.game.activeTask.type === 'cams') {
                if (this.game.activeTask.id === 'monitor_cams' || this.game.activeTask.id.includes('_reassigned_')) {
                    this.game.activeTask.completed = true;
                    soundManager.playTaskComplete();
                    this.game.checkWinConditions();
                } else {
                    const realTask = this.game.localPlayer.tasks.find(tk => tk.id.split('_reassigned_')[0] === 'monitor_cams' && !tk.completed);
                    if (realTask) {
                        realTask.completed = true;
                        soundManager.playTaskComplete();
                        this.game.checkWinConditions();
                    }
                }
            }
            if (this.game.activeTaskCleanup) {
                this.game.activeTaskCleanup();
                this.game.activeTaskCleanup = null;
            }
            this.hideScreen('task-modal');
            this.game.activeTask = null;
        };
        document.getElementById('close-sabotage-btn').onclick = () => { this.hideScreen('sabotage-modal'); };
        document.getElementById('action-use-btn').onclick = () => this.game.handleUseAction();
        document.getElementById('action-report-btn').onclick = () => this.game.handleReportAction();
        document.getElementById('action-kill-btn').onclick = () => this.game.handleKillAction();
        document.getElementById('action-revive-btn').onclick = () => this.game.handleReviveAction();
        document.getElementById('action-vent-btn').onclick = () => this.game.handleVentAction();
        document.getElementById('action-sabotage-btn').onclick = () => this.game.handleSabotageAction();
        document.getElementById('sab-lights-btn').onclick = () => { this.game.triggerSabotage('lights'); this.hideScreen('sabotage-modal'); };
        document.getElementById('sab-engine-btn').onclick = () => { this.game.triggerSabotage('engine'); this.hideScreen('sabotage-modal'); };
        document.getElementById('sab-comms-btn').onclick = () => { this.game.triggerSabotage('comms'); this.hideScreen('sabotage-modal'); };
        document.getElementById('skip-vote-btn').onclick = () => {
            this.game.meetingManager.submitPlayerVote(this.game.localPlayer.id, this.game.players);
        };
        const sendChat = () => {
            const input = document.getElementById('meeting-chat-input');
            if (input && input.value.trim()) {
                this.game.meetingManager.sendUserChatMessage(input.value, this.game.localPlayer.name, this.game.players);
                input.value = '';
            }
        };
        document.getElementById('meeting-chat-send-btn').onclick = sendChat;
        document.getElementById('meeting-chat-input').onkeydown = (e) => {
            if (e.key === 'Enter') sendChat();
        };
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
        document.getElementById('restart-game-btn').onclick = () => { this.showScreen('menu-screen'); this.game.state = 'MENU'; };
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
    showScreen(id) {
        if (id === 'task-modal' || id === 'sabotage-modal') {
            // Do not hide HUD when opening overlays!
            document.getElementById(id).classList.add('active');
            document.getElementById(id).classList.remove('hidden');
        } else {
            document.querySelectorAll('.ui-screen').forEach(s => { s.classList.remove('active'); s.classList.add('hidden'); });
            document.getElementById(id).classList.add('active');
            document.getElementById(id).classList.remove('hidden');
        }
    }
    hideScreen(id) { document.getElementById(id).classList.add('hidden'); document.getElementById(id).classList.remove('active'); }
    updateHUD(player, players, tasks, sabotageSystem) {
        // Local player's task list UI
        const listEl = document.getElementById('hud-task-list'); listEl.innerHTML = '';
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
                gunEl.innerText = `🔫 Gun: None`;
                gunEl.style.color = '#ffeaa7';
            }
        }
        if (torpEl) {
            const torpedoes = player.loadedTorpedoes || 0;
            torpEl.innerText = `🚀 Torpedoes Ready: ${torpedoes}`;
            torpEl.style.color = torpedoes === 0 ? '#ff7675' : '#55efc4';
        }

        // Global Task Progress Bar (Sum of ALL tasks across ALL crewmate cats)
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

        const ventBtn = document.getElementById('action-vent-btn');
        if (ventBtn) {
            if (player.role === 'Engineer' || player.role === 'evil Dog') {
                ventBtn.classList.remove('hidden');
            } else {
                ventBtn.classList.add('hidden');
            }
        }

        const killBtn = document.getElementById('action-kill-btn'), reviveBtn = document.getElementById('action-revive-btn'), sabBtn = document.getElementById('action-sabotage-btn'), cooldownOverlay = document.getElementById('kill-cooldown-timer'), sabCooldownOverlay = document.getElementById('sabotage-cooldown-timer');
        if (player.role === 'evil Dog' && !player.isDead) {
            killBtn.classList.remove('hidden'); sabBtn.classList.remove('hidden');
            if (player.killCooldown > 0) { cooldownOverlay.style.display = 'flex'; cooldownOverlay.innerText = Math.ceil(player.killCooldown); }
            else cooldownOverlay.style.display = 'none';
            if (sabotageSystem.activeSabotage) { sabCooldownOverlay.style.display = 'flex'; sabCooldownOverlay.innerText = 'ACT'; }
            else if (sabotageSystem.cooldown > 0) { sabCooldownOverlay.style.display = 'flex'; sabCooldownOverlay.innerText = Math.ceil(sabotageSystem.cooldown); }
            else sabCooldownOverlay.style.display = 'none';
        } else { killBtn.classList.add('hidden'); sabBtn.classList.add('hidden'); }

        if (player.role === 'Medic' && !player.isDead && player.reviveUses > 0) reviveBtn.classList.remove('hidden'); else reviveBtn.classList.add('hidden');
        if (ventBtn) {
            if ((player.role === 'evil Dog' || player.role === 'Engineer') && !player.isDead) ventBtn.classList.remove('hidden'); else ventBtn.classList.add('hidden');
        }

        const sabBanner = document.getElementById('sabotage-banner');
        if (sabotageSystem.activeSabotage === 'lights') { sabBanner.classList.remove('hidden'); document.getElementById('sabotage-text').innerText = 'LIGHTS SABOTAGED! FIX IN ELECTRICAL!'; }
        else if (sabotageSystem.activeSabotage === 'engine') { sabBanner.classList.remove('hidden'); document.getElementById('sabotage-text').innerText = `CRITICAL ENGINE MELTDOWN! (${Math.ceil(sabotageSystem.engineTimer)}s)`; }
        else if (sabotageSystem.activeSabotage === 'comms') { sabBanner.classList.remove('hidden'); document.getElementById('sabotage-text').innerText = 'COMMUNICATIONS JAMMED! RECONNECT IN COMMS!'; }
        else if (this.game && this.game.defensiveProtocolActive) {
            sabBanner.classList.remove('hidden');
            const hpStr = player.role === 'evil Dog' ? '😈' : '❤️'.repeat(this.game.localPlayer.health || 0);
            const shipsDestroyed = this.game.enemyShipsDestroyed || 0;
            let ammoStr = '';
            if (this.game.localPlayer.hasGun) {
                ammoStr = `🔫 AMMO: ${this.game.localPlayer.gunAmmo}/5`;
            } else {
                ammoStr = `⚠️ GET GUN IN KITCHEN!`;
            }
            document.getElementById('sabotage-text').innerText = `🚨 DEFENSIVE PROTOCOL ACTIVE! HP: ${hpStr} | ${ammoStr} | SHIPS DESTROYED: ${shipsDestroyed}/20 🚨`;
        }
        else sabBanner.classList.add('hidden');

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

        const bridge = ROOMS.find(r => r.id === 'bridge');
        if (Math.hypot(player.x - bridge.buttonX, player.y - bridge.buttonY) <= 45) {
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

class Game {
    constructor() {
        window.gameInstance = this;
        this.canvas = document.getElementById('game-canvas'); this.ctx = this.canvas.getContext('2d');
        this.state = 'MENU'; this.menuColorIndex = 0; this.menuHatIndex = 1; this.selectedMap = 'whisker_station'; this.catAmount = 10;
        this.mapRenderer = new MapRenderer(); this.sabotageSystem = new SabotageSystem();
        this.meetingManager = new MeetingManager(); this.uiManager = new UIManager(this);
        this.players = []; this.localPlayer = null; this.keysPressed = {}; this.activeTask = null; this.activeTaskCleanup = null; this.globalKillTimer = 0;
        this.defensiveProtocolTimer = 0; this.defensiveProtocolActive = false; this.invaders = [];
        this.setupWindow(); this.setupKeyListeners();
        
        // Immediately generate 8 cat crewmates so cats are visible everywhere!
        this.initDefaultPlayers();
        this.startLoop();
    }

    initDefaultPlayers() {
        const roles = ['evil Dog', 'Captain', 'Guard', 'Engineer', 'Medic', 'Citizen', 'Citizen', 'Citizen', 'Citizen', 'Citizen'];
        const botNames = ['Barnaby', 'Cleo', 'Felix', 'Mitten', 'Oliver', 'Shadow', 'Smokey', 'Luna', 'Garfield'];
        this.players = [];
        for (let i = 0; i < 10; i++) {
            const isLocal = i === 0;
            const p = new Player(i, isLocal ? 'Captain Whiskers' : botNames[i - 1], isLocal ? this.menuColorIndex : (i * 2 + 1) % 8, isLocal ? this.menuHatIndex : (i + 2) % 8, roles[i], isLocal);
            p.tasks = TaskManager.generateTaskList();
            p.loadedTorpedoes = 1; // Start with 1 loaded torpedo (10 shots) initially!
            p.x = 1720 + (i % 5) * 40; p.y = 250 + Math.floor(i / 5) * 40;
            this.players.push(p); if (isLocal) this.localPlayer = p;
        }
        if (this.localPlayer) {
            this.mapRenderer.cameraX = this.localPlayer.x;
            this.mapRenderer.cameraY = this.localPlayer.y;
        }
    }

    setupWindow() {
        const resize = () => { this.canvas.width = window.innerWidth; this.canvas.height = window.innerHeight; };
        window.addEventListener('resize', resize); resize();
    }

    setupKeyListeners() {
        window.addEventListener('keydown', (e) => {
            soundManager.init();
            this.keysPressed[e.code] = true;
            if (e.key) { this.keysPressed[e.key] = true; this.keysPressed[e.key.toLowerCase()] = true; }
            if (this.state === 'PLAYING') {
                const k = e.key ? e.key.toLowerCase() : '';
                if (e.code === 'KeyE' || k === 'e' || e.code === 'Space' || k === ' ') this.handleUseAction();
                else if (e.code === 'KeyR' || k === 'r') this.handleReportAction();
                else if ((e.code === 'KeyQ' || k === 'q') && this.localPlayer?.role === 'evil Dog') this.handleKillAction();
                else if (e.code === 'KeyP' || k === 'p') this.toggleDevMenu();
            }
        });
        window.addEventListener('keyup', (e) => {
            this.keysPressed[e.code] = false;
            if (e.key) { this.keysPressed[e.key] = false; this.keysPressed[e.key.toLowerCase()] = false; }
        });
    }

    startNewGame(playerName) {
        soundManager.init();
        loadMap(this.selectedMap);
        
        const roles = ['evil Dog', 'Captain', 'Detective'];
        
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
        this.state = 'ROLE_REVEAL'; this.uiManager.showScreen('role-screen');
        const roleIcons = { Citizen: '🐱', Captain: '⭐', Guard: '🛡️', Engineer: '🔧', Medic: '🏥', Detective: '🕵️', 'evil Dog': '🐶' };
        const roleDescs = {
            Citizen: 'Perform tasks across rooms and unmask the sneaky evil Dog!',
            Captain: 'Command the ship! You complete tasks 35% faster than standard cats.',
            Guard: 'Stay vigilant! You have 25% larger vision and see much better when lights go out.',
            Engineer: 'Use ship ventilation shafts to traverse rooms instantly.',
            Medic: 'Heal the crew! You can revive fallen cats up to 2 times per match.',
            Detective: 'Investigate crime scenes! You can see who has eliminated someone in the last 15 seconds and expose them!',
            'evil Dog': 'Eliminate cats, sabotage systems, and do not get caught!'
        };
        document.getElementById('role-icon').innerText = roleIcons[this.localPlayer.role];
        document.getElementById('role-title').innerText = `YOUR ROLE: ${this.localPlayer.role.toUpperCase()}`;
        document.getElementById('role-description').innerText = roleDescs[this.localPlayer.role];
        document.getElementById('role-team-list').innerText = this.localPlayer.role === 'evil Dog' ? '⚠️ You are the solitary evil Dog impostor!' : '🐾 Work with your fellow crew cats to finish all tasks!';
    }

    handleUseAction() {
        if (this.localPlayer.isDead) return;

        if (this.localPlayer.role === 'Detective') {
            const nearbyKiller = this.players.find(p => !p.isLocalPlayer && !p.isDead && p.lastKillTimestamp && (Date.now() - p.lastKillTimestamp <= 15000) && Math.hypot(this.localPlayer.x - p.x, this.localPlayer.y - p.y) <= 95);
            if (nearbyKiller) {
                this.detectiveAccusedId = nearbyKiller.id;
                this.detectiveExposedDog = true;
                this.triggerMeeting(this.localPlayer, null);
                
                const banner = document.createElement('div');
                banner.style.cssText = 'position:fixed; top:20px; left:50%; transform:translateX(-50%); background:#00cec9; color:white; padding:12px 24px; border-radius:10px; font-family:var(--font-heading); font-size:1.2rem; font-weight:bold; z-index:9999; box-shadow:0 8px 24px rgba(0,0,0,0.5); border:2px solid #81ecec;';
                banner.innerText = `🔍 EXPOSED THE SABOTEUR: ${nearbyKiller.name.toUpperCase()}!`;
                document.body.appendChild(banner);
                setTimeout(() => banner.remove(), 3000);
                return;
            }
        }

        // Check reloading at Workshop first!
        let wsX = 2570, wsY = 1840;
        if (this.selectedMap === 'catnip_observatory') {
            wsX = 2370; wsY = 4720;
        } else if (this.selectedMap === 'cat_hq') {
            wsX = 3325; wsY = 2010;
        }
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
        if (this.selectedMap === 'catnip_observatory') {
            const ladder = getNearbyLadder(this.localPlayer.x, this.localPlayer.y, 75);
            if (ladder) {
                this.localPlayer.x = ladder.x;
                this.localPlayer.y = ladder.y;
                soundManager.playFootstep();
                return;
            }
        }
        const bridge = ROOMS.find(r => r.id === 'bridge');
        if (Math.hypot(this.localPlayer.x - bridge.buttonX, this.localPlayer.y - bridge.buttonY) <= 45) {
            if (this.defensiveProtocolActive) {
                const banner = document.createElement('div');
                banner.style.cssText = 'position:fixed; top:20px; left:50%; transform:translateX(-50%); background:#d63031; color:white; padding:12px 24px; border-radius:10px; font-family:var(--font-heading); font-size:1.2rem; font-weight:bold; z-index:9999; box-shadow:0 8px 24px rgba(0,0,0,0.5); border:2px solid #ff7675;';
                banner.innerText = '🚨 BUTTON LOCKED DURING DEFENSIVE PROTOCOL! 🚨';
                document.body.appendChild(banner);
                setTimeout(() => banner.remove(), 2500);
                return;
            }
            this.triggerMeeting(this.localPlayer, null); return;
        }
        const security = ROOMS.find(r => r.id === 'security');
        let camX = 380, camY = 750;
        if (this.selectedMap === 'catnip_observatory') {
            camX = 1380; camY = 950;
        } else if (this.selectedMap === 'cat_hq') {
            camX = 550; camY = 875;
        }
        if (security && Math.hypot(this.localPlayer.x - camX, this.localPlayer.y - camY) <= 75) {
            const camTask = { id: 'monitor_cams_persistent', room: 'Security', name: 'Security Monitor', type: 'cams' };
            this.activeTask = camTask;
            this.uiManager.showScreen('task-modal');
            this.activeTaskCleanup = TaskManager.renderTaskMinigame(camTask, this.localPlayer, () => {
                this.uiManager.hideScreen('task-modal');
                this.activeTask = null;
            });
            return;
        }
        if (this.sabotageSystem.activeSabotage === 'lights') {
            const el = ROOMS.find(r => r.id === 'electrical');
            if (el && Math.hypot(this.localPlayer.x - el.lightsFixX, this.localPlayer.y - el.lightsFixY) <= 95) {
                this.sabotageSystem.fixSabotage(); soundManager.playTaskComplete(); return;
            }
        }
        if (this.sabotageSystem.activeSabotage === 'comms') {
            const cm = ROOMS.find(r => r.id === 'comms');
            if (cm && Math.hypot(this.localPlayer.x - cm.commsFixX, this.localPlayer.y - cm.commsFixY) <= 95) {
                const commsFixTask = { room: 'Communications', name: '📡 SYNC RADIO FREQUENCY', type: 'slider' };
                this.uiManager.showScreen('task-modal');
                this.activeTaskCleanup = TaskManager.renderTaskMinigame(commsFixTask, this.localPlayer, () => {
                    this.sabotageSystem.fixSabotage();
                    this.uiManager.hideScreen('task-modal');
                });
                return;
            }
        }
        if (this.sabotageSystem.activeSabotage === 'engine') {
            const ye = ROOMS.find(r => r.hasEngineFixPanel);
            if (ye && Math.hypot(this.localPlayer.x - ye.engineFixX, this.localPlayer.y - ye.engineFixY) <= 95) {
                const engineFixTask = { room: 'Yarn Engine', name: 'OVERLOAD REPAIR', type: 'rapid_click' };
                this.uiManager.showScreen('task-modal');
                this.activeTaskCleanup = TaskManager.renderTaskMinigame(engineFixTask, this.localPlayer, () => {
                    this.sabotageSystem.fixSabotage();
                    this.uiManager.hideScreen('task-modal');
                });
                return;
            }
        }
        for (const t of this.localPlayer.tasks) {
            if (t.completed && !(this.defensiveProtocolActive && (t.id === 'def_attack_ships' || t.id === 'clear_asteroids'))) continue;
            const roomObj = ROOMS.find(r => r.name.includes(t.room));
            if (!roomObj) continue;
            const baseTaskId = t.id.split('_reassigned_')[0];
            const taskLoc = roomObj.tasks.find(tk => tk.id === baseTaskId);
            if (taskLoc && Math.hypot(this.localPlayer.x - taskLoc.x, this.localPlayer.y - taskLoc.y) <= 95) {
                if ((baseTaskId === 'upload_data' || baseTaskId === 'load_torpedoes') && t.locked) {
                    continue;
                }
                this.activeTask = t; this.uiManager.showScreen('task-modal');
                this.activeTaskCleanup = TaskManager.renderTaskMinigame(t, this.localPlayer, () => {
                    this.uiManager.hideScreen('task-modal');
                    this.activeTask = null;
                    if (baseTaskId === 'def_get_weapons') {
                        this.localPlayer.hasGun = true;
                        this.localPlayer.gunAmmo = 5;
                    }
                    if (baseTaskId === 'post_def_heal') {
                        this.localPlayer.health = 3;
                        this.localPlayer.tasks = this.localPlayer.tasks.filter(tk => tk.id.split('_reassigned_')[0] !== 'post_def_heal');
                        const medRoom = ROOMS.find(r => r.id === 'medical');
                        if (medRoom) medRoom.tasks = medRoom.tasks.filter(tk => tk.id.split('_reassigned_')[0] !== 'post_def_heal');
                    }
                    if (baseTaskId === 'pickup_torpedo') {
                        this.localPlayer.loadedTorpedoes = (this.localPlayer.loadedTorpedoes || 0) + 1;
                        this.localPlayer.tasks.forEach(tk => {
                            if (tk.id.split('_reassigned_')[0] === 'load_torpedoes') tk.locked = false;
                        });
                    }
                    if (baseTaskId === 'pickup_torpedo_reload') {
                        this.localPlayer.loadedTorpedoes = (this.localPlayer.loadedTorpedoes || 0) + 1;
                        this.localPlayer.tasks = this.localPlayer.tasks.filter(tk => tk.id.split('_reassigned_')[0] !== 'pickup_torpedo_reload');
                        const workshopRoom = ROOMS.find(r => r.id === 'workshop');
                        if (workshopRoom) workshopRoom.tasks = workshopRoom.tasks.filter(tk => tk.id.split('_reassigned_')[0] !== 'pickup_torpedo_reload');
                    }
                    if (t.id.startsWith('def_')) {
                        this.checkDefensiveProtocolStatus();
                    }
                    this.checkWinConditions();
                });
                return;
            }
        }
        if (this.localPlayer.role === 'evil Dog' || this.localPlayer.role === 'Engineer') this.handleVentAction();
    }

    handleReportAction() {
        if (this.localPlayer.isDead) return;
        for (const p of this.players) {
            if (p.isDead && !p.bodyCleaned && Math.hypot(this.localPlayer.x - p.x, this.localPlayer.y - p.y) <= 80) {
                this.triggerMeeting(this.localPlayer, p); return;
            }
        }
    }

    handleKillAction() {
        if (this.localPlayer.role !== 'evil Dog' || this.localPlayer.isDead || this.localPlayer.killCooldown > 0 || this.globalKillTimer > 0) return;
        for (const target of this.players) {
            if (!target.isDead && target.id !== this.localPlayer.id && Math.hypot(this.localPlayer.x - target.x, this.localPlayer.y - target.y) <= 80) {
                target.isDead = true;
                this.localPlayer.lastKillTimestamp = Date.now();
                this.globalKillTimer = 15;
                this.recordKillWitnesses(this.localPlayer, target);
                this.reassignDeadCatTasks(target);
                this.localPlayer.killCooldown = 30; soundManager.playElimination(); this.checkWinConditions(); break;
            }
        }
    }

    handleReviveAction() {
        if (this.localPlayer.role !== 'Medic' || this.localPlayer.isDead || this.localPlayer.reviveUses <= 0) return;
        for (const p of this.players) {
            if (this.localPlayer.canRevive(p)) {
                p.isDead = false;
                p.health = 3;
                p.tasks = TaskManager.generateTaskList();
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
            soundManager.playVentWhoosh(); const targetVent = VentSystem.getVentById(vent.connectId);
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

    triggerSabotage(type) { this.sabotageSystem.triggerSabotage(type); }

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
                    p.tasks = TaskManager.generateTaskList();
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

        this.state = 'MEETING'; this.uiManager.showScreen('meeting-screen');
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

        // Clean up physical dead bodies from the ship floor after meeting!
        this.players.forEach(p => {
            if (p.isDead) p.bodyCleaned = true;
        });

        const catSprite = document.getElementById('ejected-cat-sprite');
        if (catSprite && ejectedPlayer) {
            const colorObj = CAT_COLORS[ejectedPlayer.colorIndex % CAT_COLORS.length];
            catSprite.innerHTML = `<span style="display:inline-block; width:80px; height:80px; border-radius:50%; background:${colorObj.main}; border:4px solid ${colorObj.accent}; box-shadow:0 10px 25px rgba(0,0,0,0.6); display:flex; justify-content:center; align-items:center; font-size:2.5rem;">🐱</span>`;
        }

        const textEl = document.getElementById('eject-result-text');
        const remEl = document.getElementById('eject-remaining-text');
        if (isTie) textEl.innerText = 'No one was ejected. (Tie vote)';
        else if (isSkipped || !ejectedPlayer) textEl.innerText = 'No one was ejected. (Skipped vote)';
        else textEl.innerText = `${ejectedPlayer.name} was ${ejectedPlayer.role === 'evil Dog' ? 'The evil Dog! 🐶' : 'not The evil Dog. 🐱'}`;
        remEl.innerText = `${this.players.filter(p => !p.isDead && p.role === 'evil Dog').length} evil Dog impostor remains.`;

        if (ejectedPlayer && !isTie && ejectedPlayer.role !== 'evil Dog') {
            this.reassignDeadCatTasks(ejectedPlayer);
        }
    }

    recordKillWitnesses(killer, victim) {
        if (!killer || !victim) return;
        
        let feeds = [];
        let camX = 380, camY = 750;
        if (this.selectedMap === 'cat_hq') {
            feeds = [
                { bounds: { xMin: 1750, xMax: 2250, yMin: 150, yMax: 500 } }, // BRIDGE
                { bounds: { xMin: 3150, xMax: 3550, yMin: 700, yMax: 1050 } }, // ELECTRICAL
                { bounds: { xMin: 1750, xMax: 2250, yMin: 750, yMax: 1100 } }, // CAT GARDEN
                { bounds: { xMin: 1900, xMax: 2100, yMin: 1100, yMax: 1850 } }  // CENTRAL HALLWAY
            ];
            camX = 550; camY = 875;
        } else if (this.selectedMap === 'catnip_observatory') {
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
                const sameFloor = (p.y >= 2800) === (victim.y >= 2800);
                const isLOS = sameFloor && isLineOfSightClear(p.x, p.y, victim.x, victim.y);
                
                if (distToKill <= 280 && isLOS) {
                    p.witnessedKillerId = killer.id;
                    p.witnessedKillerName = killer.name;
                    p.witnessedVictimName = victim.name;
                    p.witnessedViaCams = false;
                    
                    if (!p.isLocalPlayer) {
                        setTimeout(() => {
                            if (this.state === 'PLAYING') {
                                this.triggerMeeting(p, victim);
                            }
                        }, 500); // 500ms reaction delay
                    }
                } else if (onCamera && isWatchingCams) {
                    p.witnessedKillerId = killer.id;
                    p.witnessedKillerName = killer.name;
                    p.witnessedVictimName = victim.name;
                    p.witnessedViaCams = true;
                    
                    if (!p.isLocalPlayer) {
                        p.taskTimer = 0;
                        p.currentTaskToComplete = null;
                        p.currentPath = [
                            { x: 650, y: 875 },
                            { x: 1800, y: 875 },
                            { x: 1800, y: 470 },
                            { x: 1800, y: 280, isEmergencyButtonTrigger: true }
                        ];
                    }
                }
            }
        });
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
        this.state = 'GAME_OVER'; this.uiManager.showScreen('gameover-screen');
        document.getElementById('gameover-title').innerText = title;
        document.getElementById('gameover-reason').innerText = reason;
        if (title.includes('VICTORY')) soundManager.playVictory(); else soundManager.playDefeat();
        const list = document.getElementById('gameover-roles-list'); list.innerHTML = '';
        this.players.forEach(p => {
            const div = document.createElement('div'); div.style.cssText = 'padding:4px 0; color:#d1d5db; font-size:0.9rem;';
            div.innerText = `${p.name}: ${p.role} ${p.isDead ? (p.isEjected ? '(Ejected)' : '(Eliminated)') : '(Surviving)'}`; list.appendChild(div);
        });
    }

    startLoop() {
        let lastTime = performance.now();
        const loop = (now) => {
            const dt = Math.min((now - lastTime) / 1000, 0.1); lastTime = now;
            try {
                this.update(dt);
                this.render();
            } catch (err) {
                console.error('Game Loop Error:', err);
            }
            requestAnimationFrame(loop);
        };
        requestAnimationFrame(loop);
    }

    update(dt) {
        this.gameTimer = (this.gameTimer || 0) + dt;
        if (this.globalKillTimer > 0) this.globalKillTimer -= dt;
        if (this.state === 'PLAYING') {
            // Update active laser lines timers
            if (this.activeLaserLines) {
                this.activeLaserLines.forEach(line => line.timer -= dt);
                this.activeLaserLines = this.activeLaserLines.filter(line => line.timer > 0);
            }

            this.defensiveProtocolTimer += dt;
            if (this.defensiveProtocolTimer >= 20) {
                this.defensiveProtocolTimer = 0;
                if (!this.defensiveProtocolActive && Math.random() < 0.05) {
                    this.triggerDefensiveProtocol();
                }
            }
            if (this.defensiveProtocolActive && this.invaders) {
                this.updateSpaceInvaders(dt);
            }
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
                    let camX = 380, camY = 750;
                    if (this.selectedMap === 'catnip_observatory') {
                        camX = 1380; camY = 950;
                    } else if (this.selectedMap === 'cat_hq') {
                        camX = 550; camY = 875;
                    }
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
            if (this.sabotageSystem.update(dt) === 'ENGINE_MELTDOWN') {
                this.endGame('DEFEAT!', 'Yarn Engine exploded!');
            }
            this.players.forEach(p => {
                if (!p.isLocalPlayer) AIController.updateBot(p, dt, this.players, this.sabotageSystem, (b, bd) => {
                    if (this.gameTimer > 30) this.triggerMeeting(b, bd);
                });
            });
            this.uiManager.updateHUD(this.localPlayer, this.players, this.localPlayer.tasks, this.sabotageSystem);
        } else if (this.state === 'MEETING') {
            this.meetingManager.update(dt, this.players);
        }
    }

    render() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        const activePlayer = this.localPlayer || { x: 1800, y: 280, role: 'Citizen', isDead: false };
        this.mapRenderer.render(this.ctx, this.canvas.width, this.canvas.height, activePlayer, this.players || [], this.sabotageSystem);
        
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

        const miniCanvas = document.getElementById('minimap-canvas');
        if (miniCanvas) this.mapRenderer.renderMinimap(miniCanvas, activePlayer, this.players || []);
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
            let wsX = 2570, wsY = 1840;
            if (this.selectedMap === 'catnip_observatory') {
                wsX = 2370; wsY = 4720;
            } else if (this.selectedMap === 'cat_hq') {
                wsX = 3325; wsY = 2010;
            }
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
            // Find target cat to hunt (sight range = 300px)
            let targetCat = null;
            if (inv.targetId !== undefined) {
                targetCat = this.players.find(p => p.id === inv.targetId && !p.isDead && p.role !== 'evil Dog');
                // If cat goes out of sight range (300px), lose sight and stop chasing
                if (targetCat && Math.hypot(targetCat.x - inv.x, targetCat.y - inv.y) > 300) {
                    targetCat = null;
                    inv.targetId = undefined;
                }
            }

            if (!targetCat) {
                // Look for closest cat within 300px sight range
                const nearbyCats = this.players.filter(p => !p.isDead && p.role !== 'evil Dog' && Math.hypot(p.x - inv.x, p.y - inv.y) <= 300);
                if (nearbyCats.length > 0) {
                    nearbyCats.sort((a, b) => Math.hypot(a.x - inv.x, a.y - inv.y) - Math.hypot(b.x - inv.x, b.y - inv.y));
                    targetCat = nearbyCats[0];
                    inv.targetId = targetCat.id;
                }
            }

            // Move invader towards target or wander randomly
            if (targetCat) {
                const angle = Math.atan2(targetCat.y - inv.y, targetCat.x - inv.x);
                inv.vx = Math.cos(angle) * speed;
                inv.vy = Math.sin(angle) * speed;
            } else {
                if (Math.random() < 0.02 || (inv.vx === 0 && inv.vy === 0)) {
                    const angle = Math.random() * Math.PI * 2;
                    inv.vx = Math.cos(angle) * speed;
                    inv.vy = Math.sin(angle) * speed;
                }
            }

            // Execute movement with collision sliding
            const nextX = inv.x + inv.vx * dt;
            const nextY = inv.y + inv.vy * dt;
            if (isWalkable(nextX, nextY)) {
                inv.x = nextX;
                inv.y = nextY;
            } else {
                if (isWalkable(nextX, inv.y)) {
                    inv.x = nextX;
                } else if (isWalkable(inv.x, nextY)) {
                    inv.y = nextY;
                } else {
                    const angle = Math.random() * Math.PI * 2;
                    inv.vx = Math.cos(angle) * speed;
                    inv.vy = Math.sin(angle) * speed;
                    inv.targetId = undefined; // Reset target on collision corner lock
                }
            }

            if (inv.x < 100 || inv.x > 3200) { inv.vx *= -1; inv.targetId = undefined; }
            if (inv.y < 100 || inv.y > 2500) { inv.vy *= -1; inv.targetId = undefined; }
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

window.addEventListener('DOMContentLoaded', () => { new Game(); });
