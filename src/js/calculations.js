// Stat Equation Functions for TWoW Paladin Simulator

function calculateHealthFromStamina(stamina) {
    return stamina * 10;
}

function calculateManaFromIntellect(intellect) {
    return intellect * 15;
}

function calculateSpellCritFromIntellect(intellect) {
    return intellect * 0.04;
}

function calculateBlockValueFromStrength(strength) {
    return Math.floor(strength / 20);
}

function calculateMP5FromSpirit(spirit) {
    const mp5FromSpirit = (75.0 * spirit) / (spirit + 125.0);
    return Math.floor(mp5FromSpirit);
}

function calculateDodgeFromAgilityDirect(agility) {
    return (agility * 0.0607) / (1 + agility / 1406.1);
}

function calculateHitWithCap(hitRating, baseHit = 0, talentBonus = 0, weaponSkill = 300) {
    const hitFromRating = hitRating || 0;
    const totalHit = baseHit + hitFromRating + talentBonus;
    const baseHitCap = 8.0;
    const weaponSkillAbove300 = Math.max(0, weaponSkill - 300);
    const cappedWeaponSkillBonus = Math.min(weaponSkillAbove300, 15);
    const hitCapReduction = cappedWeaponSkillBonus * 0.2;
    const actualHitCap = Math.max(baseHitCap - hitCapReduction, 0.0);
    const isOverCap = totalHit > actualHitCap;
    const wastedHit = isOverCap ? totalHit - actualHitCap : 0;
    
    return {
        hitPercentage: totalHit,
        isOverCap: isOverCap,
        wastedHit: wastedHit,
        hitCap: actualHitCap,
        weaponSkill: weaponSkill,
        hitCapReduction: hitCapReduction,
        warning: isOverCap ? `Warning: ${wastedHit.toFixed(2)}% hit over the ${actualHitCap.toFixed(2)}% cap is wasted!` : null
    };
}

function calculateAttackPowerFromStrength(strength) {
    return strength * 2;
}

function calculateMeleeCritFromAgility(agility) {
    return agility * 0.04;
}

function calculateEffectiveDodge(dodgeFromGear, verticalStretch = 1.0, horizontalShift = 0.0) {
    const denominator = dodgeFromGear * verticalStretch + horizontalShift;
    
    if (denominator === 0) {
        return 0;
    }
    
    return dodgeFromGear / denominator;
}

function calculateCriticalStrikeDamage(baseDamage, isCrit = false, critMultiplier = 2.0) {
    if (isCrit) {
        return baseDamage * critMultiplier;
    }
    return baseDamage;
}

function calculateDamageWithCrit(baseDamage, critChance, critMultiplier = 2.0) {
    const randomRoll = Math.random() * 100;
    const isCrit = randomRoll <= critChance;
    
    const finalDamage = calculateCriticalStrikeDamage(baseDamage, isCrit, critMultiplier);
    
    return {
        baseDamage: baseDamage,
        finalDamage: finalDamage,
        isCrit: isCrit,
        critChance: critChance,
        critMultiplier: critMultiplier,
        bonusDamage: isCrit ? finalDamage - baseDamage : 0
    };
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        calculateHealthFromStamina,
        calculateManaFromIntellect,
        calculateSpellCritFromIntellect,
        calculateMP5FromSpirit,
        calculateHitWithCap,
        calculateAttackPowerFromStrength,
        calculateBlockValueFromStrength,
        calculateDodgeFromAgilityDirect,
        calculateMeleeCritFromAgility,
        calculateEffectiveDodge,
        calculateCriticalStrikeDamage,
        calculateDamageWithCrit
    };
}

if (typeof window !== 'undefined') {
    window.calculateHealthFromStamina = calculateHealthFromStamina;
    window.calculateManaFromIntellect = calculateManaFromIntellect;
    window.calculateMP5FromSpirit = calculateMP5FromSpirit;
    window.calculateHitWithCap = calculateHitWithCap;
    window.calculateAttackPowerFromStrength = calculateAttackPowerFromStrength;
    window.calculateBlockValueFromStrength = calculateBlockValueFromStrength;
    window.calculateCriticalStrikeDamage = calculateCriticalStrikeDamage;
    window.calculateDamageWithCrit = calculateDamageWithCrit;
}
