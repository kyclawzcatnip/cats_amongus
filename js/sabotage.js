// Sabotage System Mechanics for Cat Crew

export class SabotageSystem {
    constructor() {
        this.activeSabotage = null; // null | 'lights' | 'engine' | 'doors'
        this.engineTimer = 45;
        this.doorTimer = 0;
        this.cooldown = 60; // 60s initial grace period for Dog
        this.engineProgress = 0;
    }

    update(dt) {
        if (this.cooldown > 0) {
            this.cooldown -= dt;
        }

        if (this.activeSabotage === 'engine') {
            this.engineTimer -= dt;
            if (this.engineTimer <= 0) {
                return 'ENGINE_MELTDOWN'; // Dog win condition!
            }
        }

        if (this.activeSabotage === 'doors') {
            this.doorTimer -= dt;
            if (this.doorTimer <= 0) {
                this.activeSabotage = null;
            }
        }

        return null;
    }

    triggerSabotage(type) {
        if (this.cooldown > 0 || this.activeSabotage) return false;
        if (type === 'doors') return false; // Door sabotage doesn't work!

        this.activeSabotage = type;
        this.cooldown = 20; // 20 second cooldown between sabotages

        if (type === 'engine') {
            this.engineTimer = 45;
            this.engineProgress = 0;
        } else if (type === 'doors') {
            this.doorTimer = 15;
        }

        return true;
    }

    fixSabotage() {
        this.activeSabotage = null;
    }
}
