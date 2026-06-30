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
        } else if (task.type === 'wires' || task.type === 'click_sequence' || task.type === 'scrub' || task.type === 'fill_meter') {
            // Interactive 4-target sequence
            const wrap = document.createElement('div');
            wrap.style.cssText = 'display:grid; grid-template-columns:repeat(2, 1fr); gap:20px; padding:20px;';

            for (let i = 1; i <= 4; i++) {
                const item = document.createElement('button');
                item.className = 'btn-secondary';
                item.style.cssText = 'height:80px; font-size:1.2rem; font-family:var(--font-heading);';
                item.innerText = `Fix Wire / Component #${i}`;

                item.onclick = () => {
                    item.style.background = '#00b894';
                    item.disabled = true;
                    currentVal += 1;
                    soundManager.playVoteClick();
                    if (currentVal >= 4) {
                        task.completed = true;
                        soundManager.playTaskComplete();
                        onComplete();
                    }
                };
                wrap.appendChild(item);
            }
            container.appendChild(wrap);
        }
    }
}
