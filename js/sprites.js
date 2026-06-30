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
        if (player.role === 'Dog' && player.isLocalPlayer && !isGhost) {
            ctx.beginPath();
            ctx.arc(0, 0, radius + 5, 0, Math.PI * 2);
            ctx.strokeStyle = 'rgba(214, 48, 49, 0.6)';
            ctx.lineWidth = 3;
            ctx.stroke();
        }

        // Always draw as cute Cat to blend in!
        this.drawCat(ctx, radius, colorObj, player);

        // Draw Hat on top
        if (player.hatIndex > 0 && HATS[player.hatIndex]) {
            this.drawHat(ctx, radius, HATS[player.hatIndex].type);
        }

        // Draw Name Tag
        ctx.globalAlpha = 1.0;
        ctx.font = '700 12px "Quicksand", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillStyle = (player.role === 'Dog' && player.isLocalPlayer) ? '#ff7675' : 'white';
        ctx.shadowColor = 'black';
        ctx.shadowBlur = 4;
        ctx.fillText(player.name, 0, -radius - 12);
        ctx.shadowBlur = 0;

        ctx.restore();
    }

    static drawCat(ctx, radius, colorObj, player) {
        // Tail
        ctx.beginPath();
        ctx.moveTo(-radius * 0.6, radius * 0.2);
        ctx.quadraticCurveTo(-radius * 1.3, radius * 0.5, -radius * 1.1, radius * 0.8);
        ctx.lineWidth = 6;
        ctx.strokeStyle = colorObj.main;
        ctx.lineCap = 'round';
        ctx.stroke();

        // Ears
        ctx.fillStyle = colorObj.main;
        // Left Ear
        ctx.beginPath();
        ctx.moveTo(-radius * 0.7, -radius * 0.3);
        ctx.lineTo(-radius * 0.9, -radius * 1.1);
        ctx.lineTo(-radius * 0.2, -radius * 0.8);
        ctx.closePath();
        ctx.fill();
        // Inner Ear
        ctx.fillStyle = '#ff758c';
        ctx.beginPath();
        ctx.moveTo(-radius * 0.65, -radius * 0.4);
        ctx.lineTo(-radius * 0.8, -radius * 0.95);
        ctx.lineTo(-radius * 0.3, -radius * 0.75);
        ctx.closePath();
        ctx.fill();

        // Right Ear
        ctx.fillStyle = colorObj.main;
        ctx.beginPath();
        ctx.moveTo(radius * 0.7, -radius * 0.3);
        ctx.lineTo(radius * 0.9, -radius * 1.1);
        ctx.lineTo(radius * 0.2, -radius * 0.8);
        ctx.closePath();
        ctx.fill();
        // Inner Right Ear
        ctx.fillStyle = '#ff758c';
        ctx.beginPath();
        ctx.moveTo(radius * 0.65, -radius * 0.4);
        ctx.lineTo(radius * 0.8, -radius * 0.95);
        ctx.lineTo(radius * 0.3, -radius * 0.75);
        ctx.closePath();
        ctx.fill();

        // Main Head/Body (Round Shape)
        ctx.beginPath();
        ctx.arc(0, 0, radius, 0, Math.PI * 2);
        ctx.fillStyle = colorObj.main;
        ctx.fill();

        // Fur Stripes / Accent
        ctx.beginPath();
        ctx.arc(0, 0, radius, -Math.PI * 0.2, Math.PI * 0.2);
        ctx.fillStyle = colorObj.accent;
        ctx.fill();

        // Eyes
        ctx.fillStyle = '#1e272e';
        ctx.beginPath();
        ctx.arc(-radius * 0.35, -radius * 0.1, 4, 0, Math.PI * 2);
        ctx.arc(radius * 0.35, -radius * 0.1, 4, 0, Math.PI * 2);
        ctx.fill();

        // Eye highlights
        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.arc(-radius * 0.35 - 1, -radius * 0.1 - 1, 1.5, 0, Math.PI * 2);
        ctx.arc(radius * 0.35 - 1, -radius * 0.1 - 1, 1.5, 0, Math.PI * 2);
        ctx.fill();

        // Nose & Whiskers
        ctx.fillStyle = '#ff758c';
        ctx.beginPath();
        ctx.arc(0, radius * 0.1, 3, 0, Math.PI * 2);
        ctx.fill();

        // Whiskers
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        // Left whiskers
        ctx.moveTo(-radius * 0.3, radius * 0.1); ctx.lineTo(-radius * 1.1, 0);
        ctx.moveTo(-radius * 0.3, radius * 0.15); ctx.lineTo(-radius * 1.1, radius * 0.2);
        // Right whiskers
        ctx.moveTo(radius * 0.3, radius * 0.1); ctx.lineTo(radius * 1.1, 0);
        ctx.moveTo(radius * 0.3, radius * 0.15); ctx.lineTo(radius * 1.1, radius * 0.2);
        ctx.stroke();
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
        // Intact cat body lying down with eyes closed
        ctx.save();
        ctx.fillStyle = colorObj.main;
        ctx.beginPath();
        ctx.arc(0, 0, radius, 0, Math.PI * 2);
        ctx.fill();

        // Ears
        ctx.beginPath();
        ctx.moveTo(-radius * 0.7, -radius * 0.3);
        ctx.lineTo(-radius * 0.9, -radius * 0.9);
        ctx.lineTo(-radius * 0.2, -radius * 0.7);
        ctx.closePath();
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(radius * 0.7, -radius * 0.3);
        ctx.lineTo(radius * 0.9, -radius * 0.9);
        ctx.lineTo(radius * 0.2, -radius * 0.7);
        ctx.closePath();
        ctx.fill();

        // Closed eyes (x x)
        ctx.strokeStyle = '#2d3436';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        // Left eye X
        ctx.moveTo(-radius * 0.4, -radius * 0.2); ctx.lineTo(-radius * 0.2, 0);
        ctx.moveTo(-radius * 0.2, -radius * 0.2); ctx.lineTo(-radius * 0.4, 0);
        // Right eye X
        ctx.moveTo(radius * 0.2, -radius * 0.2); ctx.lineTo(radius * 0.4, 0);
        ctx.moveTo(radius * 0.4, -radius * 0.2); ctx.lineTo(radius * 0.2, 0);
        ctx.stroke();

        // Big Scratch Mark (3 red diagonal claw slashes across chest)
        ctx.strokeStyle = '#d63031';
        ctx.lineWidth = 3.5;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(-radius * 0.5, radius * 0.1); ctx.lineTo(radius * 0.2, Math.max(10, radius * 0.6));
        ctx.moveTo(-radius * 0.3, -radius * 0.1); ctx.lineTo(radius * 0.4, radius * 0.4);
        ctx.moveTo(-radius * 0.1, -radius * 0.3); ctx.lineTo(radius * 0.6, radius * 0.2);
        ctx.stroke();

        ctx.restore();
    }
}
