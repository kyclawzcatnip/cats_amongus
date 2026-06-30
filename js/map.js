// Map & Camera Renderer for Cat Crew

import { ROOMS, CORRIDORS, MAP_BOUNDS } from './rooms.js';
import { VENTS } from './vents.js';
import { SpriteRenderer } from './sprites.js';

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

export class MapRenderer {
    constructor() {
        this.cameraX = 1750;
        this.cameraY = 260;
    }

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
                    const isVisible = !localPlayer || localPlayer.isDead || isLineOfSightClear(localPlayer.x, localPlayer.y, t.x, t.y);
                    if (isVisible) {
                        ctx.fillStyle = '#fdcb6e'; ctx.beginPath(); ctx.arc(t.x, t.y, 14, 0, Math.PI * 2); ctx.fill();
                        ctx.strokeStyle = '#ffeaa7'; ctx.lineWidth = 3; ctx.stroke();
                        ctx.fillStyle = '#2d3436'; ctx.font = '700 12px sans-serif'; ctx.fillText('⚡', t.x, t.y + 4);
                    }
                }
            }

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

        // 5. Draw Vents (visible to Dog & Engineer)
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

        // 7. Draw Players & Ghosts
        for (const p of players) {
            if (p.inVent) continue; // Hidden while inside vent
            
            const sameFloor = (p.y >= 2800) === (localPlayer.y >= 2800);
            
            // Check vision / fog of war line of sight
            if (localPlayer) {
                const dist = Math.hypot(p.x - localPlayer.x, p.y - localPlayer.y);
                const visionRadius = localPlayer.getVisionRadius(sabotageSystem.activeSabotage);
                
                const isVisible = localPlayer.isDead || p.isLocalPlayer || (sameFloor && dist <= visionRadius && isLineOfSightClear(localPlayer.x, localPlayer.y, p.x, p.y));
                
                if (isVisible) {
                    SpriteRenderer.drawPlayer(ctx, p.x, p.y, p.radius, p, p.isDead);
                }
            } else {
                SpriteRenderer.drawPlayer(ctx, p.x, p.y, p.radius, p, p.isDead);
            }
            if (localPlayer && !p.isLocalPlayer && !p.isDead && sameFloor) {
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
                const ye = ROOMS.find(r => r.id === 'yarn_engine');
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
