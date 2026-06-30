// Task Mini-games & Management System for Cat Crew

import { soundManager } from './sounds.js';
import { SpriteRenderer } from './sprites.js';

export const TASK_DEFINITIONS = {
    nav_ship: { name: 'Navigate Ship Path', room: 'Bridge', type: 'slider' },
    upload_data: { name: 'Upload Data to HQ', room: 'Bridge', type: 'fill_meter' },
    scan_asteroids: { name: 'Scan Space Sector', room: 'Bridge', type: 'click_sequence' },
    med_scan: { name: 'Submit Med Scan', room: 'Medical', type: 'rapid_click' },
    treat_scratches: { name: 'Treat Paw Scratches', room: 'Medical', type: 'click_sequence' },
    clear_asteroids: { name: 'Clear Asteroids', room: 'Weapons', type: 'shoot_asteroids' },
    load_torpedoes: { name: 'Load Catnip Torpedoes', room: 'Weapons', type: 'fill_meter' },
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

export class TaskManager {
    static generateTaskList() {
        const keys = Object.keys(TASK_DEFINITIONS).filter(k => k !== 'upload_data');
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
        return list;
    }

    static renderTaskMinigame(task, player, onComplete) {
        const container = document.getElementById('task-canvas-container');
        document.getElementById('task-modal-title').innerText = `${task.room} — ${task.name}`;
        container.innerHTML = '';

        const speedMultiplier = player.role === 'Captain' ? 1.35 : 1.0; // Captain completing tasks 35% faster!

        let currentVal = 0;

        if (task.type === 'rapid_click') {
            const btn = document.createElement('button');
            btn.className = 'btn-primary glow-button';
            btn.style.padding = '20px 40px';
            btn.style.fontSize = '1.5rem';
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
            wrap.innerHTML = `<p>Adjust dial to target range (70 - 90):</p>`;

            const slider = document.createElement('input');
            slider.type = 'range';
            slider.min = '0';
            slider.max = '100';
            slider.value = '20';
            slider.style.width = '300px';

            const valDisplay = document.createElement('h2');
            valDisplay.innerText = '20';

            slider.oninput = () => {
                valDisplay.innerText = slider.value;
                if (parseInt(slider.value) >= 70 && parseInt(slider.value) <= 90) {
                    task.completed = true;
                    soundManager.playTaskComplete();
                    onComplete();
                }
            };

            wrap.appendChild(slider);
            wrap.appendChild(valDisplay);
            container.appendChild(wrap);
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
            wrap.innerHTML = `<p style="font-size:1.1rem; margin-bottom:4px;">💥 Shoot the asteroids before they drift away! (Destroyed: <span id="ast-count">0</span> / 10)</p>`;

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
                asteroids.push({ x, y, vx, vy, radius, hp: 1 });
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
            const feeds = [
                { name: 'CAM 1: BRIDGE', bounds: { xMin: 1550, xMax: 2050, yMin: 150, yMax: 470 } },
                { name: 'CAM 2: ELECTRICAL', bounds: { xMin: 2350, xMax: 2800, yMin: 700, yMax: 1050 } },
                { name: 'CAM 3: WEAPONS', bounds: { xMin: 2300, xMax: 2750, yMin: 250, yMax: 570 } },
                { name: 'CAM 4: HALLWAY', bounds: { xMin: 1740, xMax: 1860, yMin: 1150, yMax: 1500 } }
            ];

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
        }
    }
}
