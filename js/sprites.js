// Procedural Canvas Sprite Renderer for Cat Crew

export const CAT_COLORS = [
    { name: 'Orange Tabby', main: '#ff7675', accent: '#d63031' },
    { name: 'Snow White', main: '#ffffff', accent: '#dfe6e9' },
    { name: 'Midnight Black', main: '#2d3436', accent: '#636e72' },
    { name: 'Calico Patch', main: '#ffeaa7', accent: '#e17055' },
    { name: 'Royal Blue', main: '#0984e3', accent: '#74b9ff' },
    { name: 'Minty Teal', main: '#00b894', accent: '#55efc4' },
    { name: 'Lavender Gray', main: '#a29bfe', accent: '#6c5ce7' },
    { name: 'Golden Yellow', main: '#fdcb6e', accent: '#ffeaa7' }
];

export const HATS = [
    { name: 'None', type: 'none' },
    { name: 'Crown', type: 'crown' },
    { name: 'Beanie', type: 'beanie' },
    { name: 'Top Hat', type: 'top_hat' },
    { name: 'Red Bow', type: 'bow' },
    { name: 'Flower', type: 'flower' },
    { name: 'Pirate Hat', type: 'pirate' },
    { name: 'Astronaut Helmet', type: 'astronaut' }
];

export class SpriteRenderer {
    static drawPlayer(ctx, x, y, radius, player, isGhost = false) {
        ctx.save();
        ctx.translate(x, y);

        if (isGhost) {
            ctx.globalAlpha = 0.5;
        }

        const colorObj = CAT_COLORS[player.colorIndex % CAT_COLORS.length];

        if (player.isDead && !isGhost) {
            this.drawDeadBody(ctx, radius, colorObj);
            ctx.restore();
            return;
        }

        // Body Shadow
        ctx.beginPath();
        ctx.ellipse(0, radius * 0.8, radius * 0.9, radius * 0.4, 0, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
        ctx.fill();

        // Subtle Red Impostor Aura for Local Dog Player only
        if (player.role === 'evil Dog' && player.isLocalPlayer && !isGhost) {
            ctx.beginPath();
            ctx.arc(0, 0, radius + 5, 0, Math.PI * 2);
            ctx.strokeStyle = 'rgba(214, 48, 49, 0.6)';
            ctx.lineWidth = 3;
            ctx.stroke();
        }

        // Always draw as cute Cat to blend in!
        this.drawCat(ctx, radius, colorObj, player);

        // Draw scratch marks overlay if health is 2 or 1
        if (player.health < 3 && player.health > 0) {
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

            // Scratch 2 (if health is 1)
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
        ctx.font = '700 12px "Quicksand", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillStyle = (player.role === 'evil Dog' && player.isLocalPlayer) ? '#ff7675' : 'white';
        ctx.shadowColor = 'black';
        ctx.shadowBlur = 4;
        ctx.fillText(player.name, 0, -radius - 12);
        ctx.shadowBlur = 0;

        if (player.hasKnife) {
            ctx.save();
            ctx.translate(player.scaleX === -1 ? -radius - 8 : radius + 8, radius * 0.2);
            ctx.fillStyle = '#8B4513';
            ctx.fillRect(-2, 4, 4, 8);
            ctx.fillStyle = '#dcdde1';
            ctx.beginPath();
            ctx.moveTo(-3, 4);
            ctx.lineTo(3, 4);
            ctx.lineTo(3, -12);
            ctx.lineTo(-3, -6);
            ctx.closePath();
            ctx.fill();
            ctx.restore();
        }

        ctx.restore();
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
        px(9, 4, 3, 3, '#FFFFFF');
        px(14, 4, 3, 3, '#FFFFFF');
        px(10, 5, 2, 2, '#1a1a2e');
        px(15, 5, 2, 2, '#1a1a2e');

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
        // Dog body - slightly oval
        ctx.beginPath();
        ctx.ellipse(0, 0, radius * 1.1, radius * 0.95, 0, 0, Math.PI * 2);
        ctx.fillStyle = '#d63031'; // Suspicious brown/red dog tone or main color
        ctx.fill();

        // Floppy Ears
        ctx.fillStyle = '#b2bec3';
        ctx.beginPath();
        ctx.ellipse(-radius * 1.0, 0, 8, 16, Math.PI * 0.2, 0, Math.PI * 2);
        ctx.ellipse(radius * 1.0, 0, 8, 16, -Math.PI * 0.2, 0, Math.PI * 2);
        ctx.fill();

        // Snout
        ctx.fillStyle = '#ffeaa7';
        ctx.beginPath();
        ctx.ellipse(0, radius * 0.25, 10, 7, 0, 0, Math.PI * 2);
        ctx.fill();

        // Dog Nose
        ctx.fillStyle = '#2d3436';
        ctx.beginPath();
        ctx.arc(0, radius * 0.15, 4, 0, Math.PI * 2);
        ctx.fill();

        // Suspicious Eyes
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
                ctx.beginPath();
                ctx.arc(0, -5, 14, Math.PI, 0);
                ctx.fill();
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
                ctx.beginPath();
                ctx.moveTo(0, 0); ctx.lineTo(-12, -8); ctx.lineTo(-12, 8); ctx.closePath(); ctx.fill();
                ctx.beginPath();
                ctx.moveTo(0, 0); ctx.lineTo(12, -8); ctx.lineTo(12, 8); ctx.closePath(); ctx.fill();
                ctx.beginPath(); ctx.arc(0, 0, 4, 0, Math.PI * 2); ctx.fill();
                break;
            case 'flower':
                ctx.fillStyle = '#ff758c';
                for (let i = 0; i < 5; i++) {
                    const ang = (i * Math.PI * 2) / 5;
                    ctx.beginPath();
                    ctx.arc(Math.cos(ang) * 8, Math.sin(ang) * 8 - 5, 5, 0, Math.PI * 2);
                    ctx.fill();
                }
                ctx.fillStyle = '#fdcb6e';
                ctx.beginPath(); ctx.arc(0, -5, 5, 0, Math.PI * 2); ctx.fill();
                break;
            case 'pirate':
                ctx.fillStyle = '#2d3436';
                ctx.beginPath();
                ctx.moveTo(-18, 2); ctx.quadraticCurveTo(0, -25, 18, 2); ctx.closePath(); ctx.fill();
                ctx.fillStyle = 'white';
                ctx.font = '10px sans-serif'; ctx.fillText('☠', 0, -6);
                break;
            case 'astronaut':
                ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
                ctx.lineWidth = 3;
                ctx.beginPath();
                ctx.arc(0, radius * 0.4, radius * 1.1, 0, Math.PI * 2);
                ctx.stroke();
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
