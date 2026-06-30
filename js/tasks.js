// Task Mini-games & Management System for Cat Crew

import { soundManager } from './sounds.js';

export const TASK_DEFINITIONS = {
    nav_ship: { name: 'Navigate Ship Path', room: 'Bridge', type: 'slider' },
    upload_data: { name: 'Upload Data to HQ', room: 'Bridge', type: 'fill_meter' },
    scan_asteroids: { name: 'Scan Space Sector', room: 'Bridge', type: 'click_sequence' },
    med_scan: { name: 'Submit Med Scan', room: 'Medical', type: 'rapid_click' },
    treat_scratches: { name: 'Treat Paw Scratches', room: 'Medical', type: 'click_sequence' },
    clear_asteroids: { name: 'Clear Asteroids', room: 'Weapons', type: 'click_sequence' },
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
    flush_fuel_b: { name: 'Flush Engine Fuel B', room: 'Thruster B', type: 'fill_meter' }
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
        }
    }
}
