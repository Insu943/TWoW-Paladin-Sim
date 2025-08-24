if (typeof appendToLog !== 'function') {
    window.appendToLog = function(msg) {};
}

class CharacterStats {
    constructor() {
        this.currentStats = {};
        this.equippedItems = {};
    }
    async initialize() {
        try {
            await this.loadItemDatabase();
            await this.loadTalentBonuses();
            this.updateAllStats();
        } catch (e) {
        }
    }

    async loadTalentBonuses() {
        this.talentBonuses = {
            meleehit: 0,
            meleecrit: 0,
            spellcrit: 0,
            dodge: 0,
            parry: 0
        };
    }

    findItemByName(itemName) {
        if (!this.itemDatabase || !itemName) {
            return null;
        }
        const targetName = itemName.trim().toLowerCase();
        for (const category of this.itemDatabase) {
            if (category.items) {
                for (const item of category.items) {
                    if (item.name && item.name.trim().toLowerCase() === targetName) {
                        return item;
                    }
                }
            }
        }
        return null;
    }

    scanEquippedItems() {
        this.equippedItems = {};
        
        // Initialize all stats to 0, including basic stats for stat block
        this.currentStats = {
            // Basic stats that should always appear
            armor: 0, health: 0, mana: 0,
            stamina: 0, spirit: 0, strength: 0, agility: 0, intellect: 0,
            attackpower: 0, armorpen: 0, meleehit: 0, meleecrit: 0, meleehaste: 0,
            healingpower: 0, spellpower: 0, spellpen: 0, spellhit: 0, spellcrit: 0, spellhaste: 0,
            defense: 0, blockvalue: 0, block: 0, parry: 0, dodge: 0,
            // Dropdown stats
            mp5: 0, thorns: 0, spellstrike: 0,
            maces: 0, swords: 0, axes: 0, polearms: 0, twohandedmaces: 0, twohandedswords: 0,
            arcane: 0, fire: 0, frost: 0, nature: 0, shadow: 0
        };
        if (window.gearData) {
            Object.keys(window.gearData).forEach(slot => {
                // Skip race and enchants slots as they are handled separately
                if (slot === 'race' || slot === 'enchants') {
                    return;
                }
                
                const itemObj = window.gearData[slot];
                if (itemObj && itemObj.equipped && itemObj.name) {
                    // Try to find item in database, but always aggregate stats from itemObj
                    let itemStats = {};
                    const dbItem = this.findItemByName(itemObj.name);
                    if (dbItem) {
                        itemStats = dbItem;
                        this.equippedItems[slot] = dbItem;
                    } else {
                        // If not found, use itemObj directly
                        itemStats = itemObj;
                        this.equippedItems[slot] = itemObj;
                    }
                }
            });
    }
        
        // Initialize empty stats object
        this.currentStats = {};
        
        // Define weapon skill stats to ensure we don't double-count them
        const weaponSkillStats = ['maces', 'swords', 'axes', 'polearms', 'twohandedmaces', 'twohandedswords'];
        
        // Process equipped items
        Object.values(this.equippedItems).forEach(item => {
            if (item && typeof item === 'object') {
                Object.keys(item).forEach(statKey => {
                    if (statKey !== 'name' && statKey !== 'equipped' && typeof item[statKey] === 'number') {
                        this.currentStats[statKey] = (this.currentStats[statKey] || 0) + item[statKey];
                    }
                });
            }
        });
        
        // Process equipped enchants
        if (window.gearData && window.gearData.enchants) {
            console.log('[DEBUG] Found enchants data:', window.gearData.enchants);
            Object.values(window.gearData.enchants).forEach(enchant => {
                if (enchant && enchant.stats) {
                    console.log('[DEBUG] Processing enchant:', enchant.name, 'Stats:', enchant.stats);
                    Object.keys(enchant.stats).forEach(statKey => {
                        if (typeof enchant.stats[statKey] === 'number') {
                            console.log('[DEBUG] Adding', enchant.stats[statKey], 'to', statKey);
                            this.currentStats[statKey] = (this.currentStats[statKey] || 0) + enchant.stats[statKey];
                        }
                    });
                } else {
                    console.log('[DEBUG] Enchant has no stats:', enchant);
                }
            });
        } else {
            console.log('[DEBUG] No enchants found in gearData');
        }
    }

    addItemStats(item) {
        if (!item || typeof item !== 'object') {
            return;
        }
        for (const [key, value] of Object.entries(item)) {
            if (typeof value === 'number') {
                if (!this.currentStats[key]) this.currentStats[key] = 0;
                this.currentStats[key] += value;
            }
        }
    }

    calculateMeleeCritStat(itemCrit = 0) {
        const agility = this.currentStats.agility || 0;
        const meleeCritFromAgility = (agility * 0.0614) / (1 + agility / 1406.1);
        const meleeCritFromTalents = this.talentBonuses && this.talentBonuses.meleecrit ? this.talentBonuses.meleecrit : 0;
        
        this.currentStats.meleecrit = meleeCritFromAgility + meleeCritFromTalents + itemCrit;
    }

    calculateAvoidanceStats() {
    }

    calculateMP5Stat() {
        // Store the gear MP5 before conversion
        const gearMP5 = this.currentStats.mp5 || 0;
        
        // Reset MP5 to calculate from scratch
        this.currentStats.mp5 = 0;
        
        // Add MP5 from spirit conversion
        const spirit = this.currentStats.spirit || 0;
        if (spirit > 0 && typeof window.calculateMP5FromSpirit === 'function') {
            this.currentStats.mp5 += window.calculateMP5FromSpirit(spirit);
        }
        
        // Add gear MP5 (items may have raw MP5 values that need to be used as-is)
        // Note: Based on StatBreakdown, gear MP5 is converted but this may be for display only
        this.currentStats.mp5 += gearMP5;
    }

    calculateSpellCritStat(itemCrit = 0) {
        const intellect = this.currentStats.intellect || 0;
        let spellCritFromIntellect = (typeof window.calculateSpellCritFromIntellect === 'function')
            ? window.calculateSpellCritFromIntellect(intellect)
            : intellect * 0.04;
        let spellCritFromTalents = this.talentBonuses && this.talentBonuses.spellcrit ? this.talentBonuses.spellcrit : 0;
        
        this.currentStats.spellcrit = spellCritFromIntellect + spellCritFromTalents + itemCrit;
    }

    updateAllStats() {
        this.scanEquippedItems();
        
        // Add base stats if no race is equipped (default human-like base stats)
        if (!window.gearData || !window.gearData.race || !window.gearData.race.name) {
            this.currentStats.defense = 300; // Base defense for level 60
        }
        
        if (window.gearData && window.gearData.race && window.gearData.race.name && window.raceDatabase) {
            const raceObj = window.raceDatabase.find(r => r.name === window.gearData.race.name);
            if (raceObj) {
                Object.keys(raceObj).forEach(statKey => {
                    if (statKey !== 'name' && typeof raceObj[statKey] === 'number') {
                        this.currentStats[statKey] = (this.currentStats[statKey] || 0) + raceObj[statKey];
                    }
                });
            }
        }
        
        const baseHealth = this.currentStats.health || 0;
        const baseMana = this.currentStats.mana || 0;
        const baseAttackPower = this.currentStats.attackpower || 0;
        
        this.currentStats.health = baseHealth + ((this.currentStats.stamina || 0) * 10);
        this.currentStats.mana = baseMana + ((this.currentStats.intellect || 0) * 15);
        this.currentStats.attackpower = baseAttackPower + ((this.currentStats.strength || 0) * 2);
        
        // Store item block value before recalculating to avoid double-counting
        const itemBlockValue = this.currentStats.blockvalue || 0;
        this.currentStats.blockvalue = Math.floor((this.currentStats.strength || 0) / 20) + itemBlockValue;

        // Avoidance stats: aggregate only once
        // Check if race is equipped to determine base defense
        const hasRaceEquipped = window.gearData && window.gearData.race && window.gearData.race.name;
        
        // Store item/race avoidance values before recalculating to avoid overriding them
        const itemDodge = this.currentStats.dodge || 0;
        const itemParry = this.currentStats.parry || 0;
        const itemBlock = this.currentStats.block || 0;
        
        // Dodge
        const agility = this.currentStats.agility || 0;
        const defense = this.currentStats.defense || 0;
        const dodgeFromAgility = typeof window.calculateDodgeFromAgilityDirect === 'function'
            ? window.calculateDodgeFromAgilityDirect(agility)
            : (agility * 0.0607) / (1 + agility / 1406.1);
        
        // Defense above 300 gives dodge bonus (0.04% per point)
        // Since races already provide 300 defense base, only count defense above 300
        const defenseAbove300 = Math.max(0, defense - 300);
        const dodgeFromDefense = defenseAbove300 * 0.04;
        const dodgeFromTalents = this.talentBonuses && this.talentBonuses.dodge ? this.talentBonuses.dodge : 0;
        
        // Calculate total dodge from all sources
        this.currentStats.dodge = itemDodge + dodgeFromAgility + dodgeFromDefense + dodgeFromTalents;

        // Parry - add talent bonuses to item parry
        const parryFromTalents = this.talentBonuses && this.talentBonuses.parry ? this.talentBonuses.parry : 0;
        this.currentStats.parry = itemParry + parryFromTalents;

        // Block - add talent bonuses to item block
        const blockFromTalents = this.talentBonuses && this.talentBonuses.block ? this.talentBonuses.block : 0;
        this.currentStats.block = itemBlock + blockFromTalents;

        // Store item crit values before recalculating to avoid double-counting
        const itemMeleeCrit = this.currentStats.meleecrit || 0;
        const itemSpellCrit = this.currentStats.spellcrit || 0;

        // Calculate crit stats properly using the dedicated methods
        this.calculateMeleeCritStat(itemMeleeCrit);
        this.calculateSpellCritStat(itemSpellCrit);
        this.calculateMP5Stat();

        // Apply High Elf agility bonus AFTER all calculations
        if (window.gearData && window.gearData.race && window.gearData.race.name === 'High Elf') {
            if (typeof this.currentStats.agility === 'number') {
                this.currentStats.agility = Math.round(this.currentStats.agility * 1.02);
            }
        }
        
        // Do NOT call calculateAvoidanceStats again
        if (typeof window.renderStatBlock === 'function') {
            window.renderStatBlock(this.currentStats);
        }
        
        // Check for stat cap warnings after stats are updated
        this.checkForCapWarnings();
    }

    getEquippedWeaponSkill() {
        const mainhand = this.equippedItems.mainhand;
        if (!mainhand) return 300; // Base weapon skill
        
        // Determine weapon type
        const weaponType = this.getEquippedWeaponType();
        const skillMap = {
            'Axe': 'axes',
            'Mace': 'maces', 
            'Sword': 'swords',
            'Polearm': 'polearms',
            'Two-Handed Mace': 'twohandedmaces',
            'Two-Handed Sword': 'twohandedswords'
        };
        
        const skillStat = skillMap[weaponType];
        return skillStat ? (this.currentStats[skillStat] || 300) : 300;
    }

    getEquippedWeaponType() {
        const mainhand = this.equippedItems.mainhand;
        if (!mainhand) return '';
        
        // Check if it's a two-handed weapon
        if (mainhand.slot && mainhand.slot.toLowerCase().includes('two-hand')) {
            return `Two-Handed ${mainhand.type || 'Weapon'}`;
        }
        
        return mainhand.type || 'Weapon';
    }

    calculateMeleeHitCap() {
        const baseHitCap = 8.0;
        const weaponSkill = this.getEquippedWeaponSkill();
        const weaponSkillAbove300 = Math.max(0, weaponSkill - 300);
        
        // Each point of weapon skill above 300 reduces hit cap by 0.2%
        // Max reduction is at 315 weapon skill (15 points above 300)
        const cappedWeaponSkillBonus = Math.min(weaponSkillAbove300, 15);
        const hitCapReduction = cappedWeaponSkillBonus * 0.2;
        
        // Calculate actual hit cap (minimum 5% at 315 weapon skill)
        const actualHitCap = Math.max(baseHitCap - hitCapReduction, 5.0);
        
        return {
            hitCap: actualHitCap,
            weaponSkill: weaponSkill,
            weaponType: this.getEquippedWeaponType(),
            hitCapReduction: hitCapReduction,
            weaponSkillAbove300: weaponSkillAbove300
        };
    }

    checkForCapWarnings() {
        console.log('[DEBUG] checkForCapWarnings called');
        const warnings = [];
        
        // Check melee hit cap (only if weapon is equipped)
        if (this.equippedItems.mainhand) {
            const hitCapInfo = this.calculateMeleeHitCap();
            const currentMeleeHit = this.currentStats.meleehit || 0;
            console.log('[DEBUG] Melee hit check:', currentMeleeHit, 'vs cap:', hitCapInfo.hitCap);
            
            if (currentMeleeHit > hitCapInfo.hitCap) {
                const wastedHit = currentMeleeHit - hitCapInfo.hitCap;
                const weaponName = this.equippedItems.mainhand.name || 'equipped weapon';
                const weaponSkillText = hitCapInfo.weaponSkillAbove300 > 0 
                    ? ` (${hitCapInfo.weaponSkill} ${hitCapInfo.weaponType} skill reduces cap by ${hitCapInfo.hitCapReduction.toFixed(1)}%)` 
                    : '';
                    
                warnings.push(`Melee Hit: ${currentMeleeHit.toFixed(2)}% exceeds the ${hitCapInfo.hitCap.toFixed(2)}% cap for ${weaponName}${weaponSkillText} (${wastedHit.toFixed(2)}% wasted)`);
            }
        }
        
        // Check spell hit cap
        const currentSpellHit = this.currentStats.spellhit || 0;
        const spellHitCap = 16.0;
        console.log('[DEBUG] Spell hit check:', currentSpellHit, 'vs cap:', spellHitCap);
        if (currentSpellHit > spellHitCap) {
            const wastedSpellHit = currentSpellHit - spellHitCap;
            warnings.push(`Spell Hit: ${currentSpellHit.toFixed(2)}% exceeds the ${spellHitCap.toFixed(2)}% cap (${wastedSpellHit.toFixed(2)}% wasted)`);
        }
        
        // Check melee crit cap (typically around 100% but let's use a reasonable threshold)
        const currentMeleeCrit = this.currentStats.meleecrit || 0;
        const meleeCritCap = 100.0;
        console.log('[DEBUG] Melee crit check:', currentMeleeCrit, 'vs cap:', meleeCritCap);
        if (currentMeleeCrit > meleeCritCap) {
            const wastedMeleeCrit = currentMeleeCrit - meleeCritCap;
            warnings.push(`Melee Crit: ${currentMeleeCrit.toFixed(2)}% exceeds the ${meleeCritCap.toFixed(2)}% cap (${wastedMeleeCrit.toFixed(2)}% wasted)`);
        }
        
        // Check spell crit cap (typically around 100% but let's use a reasonable threshold)
        const currentSpellCrit = this.currentStats.spellcrit || 0;
        const spellCritCap = 100.0;
        console.log('[DEBUG] Spell crit check:', currentSpellCrit, 'vs cap:', spellCritCap);
        if (currentSpellCrit > spellCritCap) {
            const wastedSpellCrit = currentSpellCrit - spellCritCap;
            warnings.push(`Spell Crit: ${currentSpellCrit.toFixed(2)}% exceeds the ${spellCritCap.toFixed(2)}% cap (${wastedSpellCrit.toFixed(2)}% wasted)`);
        }
        
        // Check weapon skill caps (315 is the effective cap)
        const weaponSkillCap = 315;
        const weaponSkills = {
                'Axes': this.currentStats.axes,
                'Maces': this.currentStats.maces,
                'Polearms': this.currentStats.polearms,
                'Swords': this.currentStats.swords,
                'Two-Handed Maces': this.currentStats.twohandedmaces,
                'Two-Handed Swords': this.currentStats.twohandedswords
        };
        
        Object.entries(weaponSkills).forEach(([skillName, skillValue]) => {
            if (skillValue > weaponSkillCap) {
                const wastedSkill = skillValue - weaponSkillCap;
                warnings.push(`${skillName}: ${skillValue} exceeds the ${weaponSkillCap} cap (${wastedSkill} wasted)`);
            }
        });
        
        // Avoidance = dodge + parry + block (all as percentages)
        const dodge = Number(this.currentStats.dodge) || 0;
        const parry = Number(this.currentStats.parry) || 0;
        const block = Number(this.currentStats.block) || 0;
        const totalAvoidance = dodge + parry + block;
        if (totalAvoidance > 100) {
            warnings.push(`Warning: Your total avoidance (dodge + parry + block) is ${totalAvoidance.toFixed(2)}%. Any value above 100% is wasted.`);
        }

        this.latestCapWarnings = warnings;
        console.log('[DEBUG] Warnings found:', warnings.length, warnings);
        
        if (warnings.length > 0) {
            this.showStatCapWarning(warnings);
        }
    }

    getLatestCapWarnings() {
        return this.latestCapWarnings && this.latestCapWarnings.length > 0
            ? this.latestCapWarnings.slice()
            : [];
    }

    showStatCapWarning(warnings) {
        let popup = document.getElementById('stat-warning-popup');
        if (!popup) {
            popup = this.createStatWarningPopup();
        }
        
        const messageElement = document.getElementById('stat-warning-message');
        const confirmButton = document.getElementById('stat-warning-confirm');

        if (!popup || !messageElement) return;

        let message;
        if (warnings.length === 1) {
            message = `• ${warnings[0]}`;
        } else {
            message = "Multiple stat caps exceeded:<br><br>" + warnings.map(warning => `• ${warning}`).join('<br><br>');
        }

        messageElement.innerHTML = message;
        popup.style.display = 'flex';
        
        const closePopup = () => {
            popup.style.display = 'none';
        };
        
        if (confirmButton) {
            confirmButton.onclick = closePopup;
        }
        
        popup.onclick = (e) => {
            if (e.target === popup) {
                closePopup();
            }
        };
        
        const handleKeyPress = (e) => {
            if (e.key === 'Escape') {
                closePopup();
                document.removeEventListener('keydown', handleKeyPress);
            }
        };
        document.addEventListener('keydown', handleKeyPress);
    }

    createStatWarningPopup() {
        const existingPopup = document.getElementById('stat-warning-popup');
        if (existingPopup) {
            existingPopup.remove();
        }

        const popupHTML = `
            <div id="stat-warning-popup" class="stat-warning-popup" style="display: none;">
                <div class="stat-warning-overlay"></div>
                <div class="stat-warning-content">
                    <div class="stat-warning-header">
                        <h3>Stat Cap Warning</h3>
                    </div>
                    <div class="stat-warning-body">
                        <p id="stat-warning-message"></p>
                        <button id="stat-warning-confirm" class="stat-warning-btn">OK</button>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', popupHTML);
        this.addStatWarningStyles();
        return document.getElementById('stat-warning-popup');
    }

    addStatWarningStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .stat-warning-popup {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.8);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 10000;
            }
            .stat-warning-overlay {
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.7);
            }
            .stat-warning-content {
                position: relative;
                background: #2c2f33;
                border-radius: 8px;
                padding: 20px;
                max-width: 500px;
                width: 100%;
                z-index: 10001;
            }
            .stat-warning-header h3 {
                margin: 0;
                color: #ffffff;
                font-size: 18px;
            }
            .stat-warning-body {
                margin-top: 10px;
            }
            .stat-warning-body p {
                margin: 0;
                color: #ffffff;
                font-size: 14px;
            }
            .stat-warning-btn {
                background: #7289da;
                color: #ffffff;
                border: none;
                border-radius: 4px;
                padding: 10px 15px;
                cursor: pointer;
                font-size: 14px;
                transition: background 0.3s;
            }
            .stat-warning-btn:hover {
                background: #5b6eae;
            }
        `;
        document.head.appendChild(style);
    }
}

if (!window.characterStats || !(window.characterStats instanceof CharacterStats)) {
    window.characterStats = new CharacterStats();
    if (typeof window.characterStats.updateAllStats === 'function') {
        window.characterStats.updateAllStats();
    }
    if (!window.characterStats.currentStats) {
        window.characterStats.currentStats = {};
    }
}

// Render stat block UI from stats object
window.renderStatBlock = function(stats) {
    var statBlock = document.querySelector('.stat-block');
    const statOrder = [
        // Primary stats in requested order
        'armor', 'health', 'mana',
        'stamina', 'spirit', 'strength', 'agility', 'intellect',
        // Melee stats
        'attackpower', 'armorpen', 'meleehit', 'meleecrit', 'meleehaste',
        // Spell stats
        'healingpower', 'spellpower', 'spellpen', 'spellhit', 'spellcrit', 'spellhaste',
        // Defensive stats
        'defense', 'blockvalue', 'block', 'parry', 'dodge'
        // Weapon skills and special stats (mp5, thorns, spellstrike) moved to dropdowns only
    ];
    var mainPanel = document.querySelector('.main-panel');
    if (!mainPanel) return;
    var statBlock = mainPanel.querySelector('.stat-block');
    if (!statBlock) return;
    statBlock.innerHTML = '';
    // Add stat block title
    var titleDiv = document.createElement('div');
    titleDiv.className = 'stat-block-header';
    titleDiv.style.fontWeight = 'bold';
    titleDiv.style.fontSize = '18px';
    titleDiv.style.color = '#ffd700';
    titleDiv.style.textAlign = 'center';
    titleDiv.textContent = 'Stats - Level 60';
    statBlock.appendChild(titleDiv);

    // Check if anything is equipped
    var equipped = false;
    if (window.gearData) {
        for (let slot in window.gearData) {
            if (window.gearData[slot] && window.gearData[slot].equipped) {
                equipped = true;
                break;
            }
        }
    }

    // Helper to create a stat block spacer
    function createStatBlockSpacer() {
        var spacer = document.createElement('div');
        spacer.className = 'stat-block-spacer';
        spacer.style.height = '12px';
        return spacer;
    }

    statOrder.forEach(function(statKey, idx) {
        let value = 0;
        if (equipped && stats && typeof stats[statKey] !== 'undefined' && stats[statKey] !== null) {
            value = stats[statKey];
        } else if (stats && typeof stats[statKey] !== 'undefined' && stats[statKey] !== null) {
            value = 0;
        }
        // Format percent stats
        const percentStats = ["block", "parry", "dodge", "meleecrit", "spellcrit", "crit", "meleehit", "spellhit", "meleehaste", "spellhaste", "haste", "hit"];
        let displayValue = value;
        if (percentStats.includes(statKey.toLowerCase())) {
            if (typeof value === "number") {
                displayValue = value.toFixed(2) + "%";
            } else if (typeof value === "string" && value.match(/^\d+(\.\d+)?%?$/)) {
                let num = parseFloat(value);
                if (!isNaN(num)) displayValue = num.toFixed(2) + "%";
            }
        }
        var row = document.createElement('div');
        row.className = 'stat-row';
        var nameSpan = document.createElement('span');
        nameSpan.className = 'stat-name';
        // Map for multi-word stat display names
        var statDisplayNames = {
            armor: 'Armor',
            health: 'Health',
            mana: 'Mana',
            stamina: 'Stamina',
            spirit: 'Spirit',
            strength: 'Strength',
            agility: 'Agility',
            intellect: 'Intellect',
            attackpower: 'Attack Power',
            armorpen: 'Armor Penetration',
            meleehit: 'Melee Hit',
            meleecrit: 'Melee Crit',
            meleehaste: 'Melee Haste',
            healingpower: 'Healing Power',
            spellpower: 'Spell Power',
            spellpen: 'Spell Penetration',
            spellhit: 'Spell Hit',
            spellcrit: 'Spell Crit',
            spellhaste: 'Spell Haste',
            defense: 'Defense',
            blockvalue: 'Block Value',
            block: 'Block',
            parry: 'Parry',
            dodge: 'Dodge',
            mp5: 'MP5',
            thorns: 'Thorns',
            spellstrike: 'Spell Strike',
            fireres: 'Fire Resistance',
            frostres: 'Frost Resistance',
            natureres: 'Nature Resistance',
            arcaneres: 'Arcane Resistance',
            shadowres: 'Shadow Resistance',
            maces: 'Mace Skill',
            axes: 'Axe Skill',
            swords: 'Sword Skill',
            polearms: 'Polearm Skill',
            twohandedmaces: 'Two-Handed Mace Skill',
            twohandedswords: 'Two-Handed Sword Skill'
        };
        var displayName = statDisplayNames[statKey] || (statKey.charAt(0).toUpperCase() + statKey.slice(1));
        nameSpan.textContent = displayName;
        var valueSpan = document.createElement('span');
        valueSpan.className = 'stat-value';
        valueSpan.textContent = displayValue;
        row.appendChild(nameSpan);
        row.appendChild(valueSpan);
        statBlock.appendChild(row);
        
        // Add spacer lines between specific stat groups
        if (statKey === 'mana' || statKey === 'intellect' || statKey === 'meleehaste' || statKey === 'spellhaste') {
            var spacerLine = document.createElement('div');
            spacerLine.style.height = '1px';
            spacerLine.style.backgroundColor = '#444';
            spacerLine.style.margin = '6px 0';
            statBlock.appendChild(spacerLine);
        }
        
        // Resistances and weapon skills are now only in the dropdowns, not in the main stat block
    });
}

function updateCharacterStats() {
    if (window.characterStats && typeof window.characterStats.updateAllStats === 'function') {
        window.characterStats.updateAllStats();
    }
}

function calculateDodgeFromAgilityDirect(agility) {
    return (agility * 0.0607) / (1 + agility / 1406.1);
}