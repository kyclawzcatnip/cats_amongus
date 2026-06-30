// Map & Camera Renderer for Cat Crew

import { ROOMS, CORRIDORS, MAP_BOUNDS } from './rooms.js';
import { VENTS } from './vents.js';
import { SpriteRenderer } from './sprites.js';

export class MapRenderer {
    constructor() {
        this.cameraX = 1750;
        this.cameraY = 260;
    }

    renderRoomProps(ctx, room) {}

    updateCamera(targetX, targetY, viewportWidth, viewportHeight) {
        if (!targetX || !targetY) return;
        this.cameraX += (targetX - this.cameraX) * 0.12;
        this.cameraY += (targetY - this.cameraY) * 0.12;
    }

    render(ctx, width, height, localPlayer, players, sabotageSystem) {
        ctx.save();
        
        ctx.fillStyle = '#0a0c14';
        ctx.fillRect(0, 0, width, height);

        ctx.translate(width / 2 - this.cameraX, height / 2 - this.cameraY);

        ctx.strokeStyle = 'rgba(255, 117, 140, 0.5)'; ctx.lineWidth = 16; ctx.beginPath();
        ctx.moveTo(1800, 100); ctx.lineTo(2400, 50); ctx.lineTo(2350, 350); ctx.lineTo(3300, 1000); ctx.lineTo(3100, 2400);
        ctx.quadraticCurveTo(1800, 2550, 500, 2400); ctx.lineTo(300, 1000); ctx.lineTo(1250, 350); ctx.lineTo(1200, 50); ctx.lineTo(1800, 100);
        ctx.closePath(); ctx.stroke();

        ctx.fillStyle = '#1e272e';
        for (const corr of CORRIDORS) {
            ctx.beginPath();
            if (corr.x1 === corr.x2) ctx.rect(corr.x1 - corr.width / 2, Math.min(corr.y1, corr.y2), corr.width, Math.abs(corr.y2 - corr.y1));
            else ctx.rect(Math.min(corr.x1, corr.x2), corr.y1 - corr.width / 2, Math.abs(corr.x2 - corr.x1), corr.width);
            ctx.fill();
            
            ctx.strokeStyle = 'rgba(72, 219, 251, 0.4)'; ctx.lineWidth = 4; ctx.beginPath();
            ctx.moveTo(corr.x1, corr.y1); ctx.lineTo(corr.x2, corr.y2); ctx.stroke();
        }

        for (const room of ROOMS) {
            ctx.fillStyle = room.bgColor; ctx.fillRect(room.x, room.y, room.width, room.height);
            ctx.strokeStyle = room.color; ctx.lineWidth = 6; ctx.strokeRect(room.x, room.y, room.width, room.height);
            
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)'; ctx.lineWidth = 2;
            for (let gx = room.x + 50; gx < room.x + room.width; gx += 50) {
                ctx.beginPath(); ctx.moveTo(gx, room.y); ctx.lineTo(gx, room.y + room.height); ctx.stroke();
            }
            for (let gy = room.y + 50; gy < room.y + room.height; gy += 50) {
                ctx.beginPath(); ctx.moveTo(room.x, gy); ctx.lineTo(room.x + room.width, gy); ctx.stroke();
            }

            ctx.fillStyle = 'rgba(255, 255, 255, 0.9)'; ctx.font = '700 20px "Fredoka", cursive'; ctx.textAlign = 'center';
            ctx.fillText(room.name, room.x + room.width / 2, room.y + 35);

            for (const t of room.tasks) {
                const hasTask = localPlayer && localPlayer.tasks.find(tk => {
                    const baseId = tk.id.split('_reassigned_')[0];
                    let isLocked = false;
                    if (baseId === 'upload_data') {
                        const hasUncompletedDownload = localPlayer.tasks.some(d => (d.id.includes('download_data') || d.id.includes('download_comms')) && !d.completed);
                        isLocked = hasUncompletedDownload;
                    }
                    return baseId === t.id && !tk.completed && !isLocked;
                });
                if (hasTask) {
                    ctx.fillStyle = '#fdcb6e'; ctx.beginPath(); ctx.arc(t.x, t.y, 14, 0, Math.PI * 2); ctx.fill();
                    ctx.strokeStyle = '#ffeaa7'; ctx.lineWidth = 3; ctx.stroke();
                    ctx.fillStyle = '#2d3436'; ctx.font = '700 12px sans-serif'; ctx.fillText('⚡', t.x, t.y + 4);
                }
            }

            if (room.hasEmergencyButton) {
                ctx.fillStyle = 'rgba(214, 48, 49, 0.3)'; ctx.beginPath(); ctx.arc(room.buttonX, room.buttonY, 32, 0, Math.PI * 2); ctx.fill();
                ctx.fillStyle = '#d63031'; ctx.beginPath(); ctx.arc(room.buttonX, room.buttonY, 20, 0, Math.PI * 2); ctx.fill();
                ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 3; ctx.stroke();
                ctx.fillStyle = 'white'; ctx.font = '700 12px sans-serif'; ctx.fillText('MEET', room.buttonX, room.buttonY + 4);
            }
        }

        // 5. Draw Vents (visible to Dog & Engineer)
        const canSeeVents = localPlayer ? (localPlayer.role === 'Dog' || localPlayer.role === 'Engineer' || localPlayer.isDead) : true;
        for (const v of VENTS) {
            ctx.fillStyle = canSeeVents ? '#a29bfe' : '#636e72'; ctx.fillRect(v.x - 16, v.y - 16, 32, 32);
            ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 2; ctx.strokeRect(v.x - 16, v.y - 16, 32, 32);
            ctx.fillStyle = 'white'; ctx.font = '12px sans-serif'; ctx.textAlign = 'center'; ctx.fillText('🌀', v.x, v.y + 4);
        }

        // 6. Draw Players & Ghosts
        for (const p of players) {
            if (p.inVent) continue; // Hidden while inside vent
            
            // Check vision / fog of war line of sight
            if (localPlayer) {
                const dist = Math.hypot(p.x - localPlayer.x, p.y - localPlayer.y);
                const visionRadius = localPlayer.getVisionRadius(sabotageSystem.activeSabotage);
                
                const isVisible = localPlayer.isDead || p.isLocalPlayer || dist <= visionRadius;
                
                if (isVisible || p.isDead) {
                    SpriteRenderer.drawPlayer(ctx, p.x, p.y, p.radius, p, p.isDead);
                }
            } else {
                SpriteRenderer.drawPlayer(ctx, p.x, p.y, p.radius, p, p.isDead);
            }
            if (localPlayer && !p.isLocalPlayer && !p.isDead) {
                const dx = p.x - localPlayer.x;
                const dy = p.y - localPlayer.y;
                const dist = Math.hypot(dx, dy);
                if (dist > 300) {
                    const angle = Math.atan2(dy, dx);
                    const indicatorX = localPlayer.x + Math.cos(angle) * 110;
                    const indicatorY = localPlayer.y + Math.sin(angle) * 110;
                    const colorObj = CAT_COLORS[p.colorIndex % CAT_COLORS.length] || CAT_COLORS[0];
                    ctx.fillStyle = colorObj.main; ctx.beginPath(); ctx.arc(indicatorX, indicatorY, 9, 0, Math.PI * 2); ctx.fill();
                    ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 2; ctx.stroke();
                }
            }
        }

        ctx.restore();

        // 7. Render Fog of War (Darkness Mask around local player)
        if (!localPlayer.isDead) {
            this.drawFogOfWar(ctx, width, height, localPlayer, sabotageSystem);
        }
    }

    drawSpaceBackground(ctx) {
        ctx.fillStyle = '#0f111a';
        ctx.fillRect(0, 0, MAP_BOUNDS.width, MAP_BOUNDS.height);
    }

    drawCatSpaceshipHull(ctx) {
        // Draw giant cat hull outline in background
        ctx.strokeStyle = 'rgba(255, 117, 140, 0.3)';
        ctx.lineWidth = 12;

        ctx.beginPath();
        // Nose (Bridge)
        ctx.moveTo(1200, 150);
        // Right Ear
        ctx.lineTo(1700, 100); ctx.lineTo(1650, 300);
        // Right Side
        ctx.lineTo(2100, 800); ctx.lineTo(1900, 1650);
        // Tail
        ctx.quadraticCurveTo(1200, 1750, 500, 1650);
        // Left Side
        ctx.lineTo(300, 800); ctx.lineTo(750, 300);
        // Left Ear
        ctx.lineTo(700, 100); ctx.lineTo(1200, 150);
        ctx.closePath();
        ctx.stroke();
    }

    drawFogOfWar(ctx, width, height, localPlayer, sabotageSystem) {
        ctx.save();
        const visionRadius = localPlayer.getVisionRadius(sabotageSystem.activeSabotage);

        // Create radial gradient mask
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
        const ctx = canvas.getContext('2d');
        const scaleX = canvas.width / MAP_BOUNDS.width;
        const scaleY = canvas.height / MAP_BOUNDS.height;

        ctx.fillStyle = '#0f111a';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw rooms on minimap
        for (const r of ROOMS) {
            ctx.fillStyle = r.color;
            ctx.fillRect(r.x * scaleX, r.y * scaleY, r.width * scaleX, r.height * scaleY);
        }

        // Draw local player dot
        ctx.fillStyle = '#ff758c';
        ctx.beginPath();
        ctx.arc(localPlayer.x * scaleX, localPlayer.y * scaleY, 4, 0, Math.PI * 2);
        ctx.fill();
    }
}
