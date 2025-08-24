console.log('[DEBUG] itemmenu.js script loaded');

function showItemMenu(slotElement, slotType, items) {
    showFilterMenu(slotType, slotElement, items);
}

// Wire up gear slot event listeners after DOM is updated
window.wireGearSlotEvents = function() {
    const gearSlots = document.querySelectorAll('.gear-slot');
    console.log('[DEBUG] wireGearSlotEvents: Number of gear slots found:', gearSlots.length);
    gearSlots.forEach(slot => {
        slot.addEventListener('click', function(e) {
            e.stopPropagation();
            const slotType = slot.getAttribute('data-slot');
            if (!slotType) return;
            const items = getItemsForSlot(slotType);
            showItemMenu(slot, slotType, items);
        });
    });
}

// Returns the array of items for a given slot type from the item database
function getItemsForSlot(slotType) {
    // Special handling for race slot
    if (slotType === 'race') {
        console.log('[DEBUG] Race slot selected, raceDatabase:', window.raceDatabase);
        return window.raceDatabase && Array.isArray(window.raceDatabase) ? window.raceDatabase : [];
    }
    // Map slotType to item class name
    let className = '';
    switch (slotType) {
        case 'shoulders':
            className = 'Shoulder';
            // Top-level implementation for showItemMenu
            break;
        case 'wrist':
            className = 'Bracer';
            break;
        case 'ring1':
        case 'ring2':
            className = 'Ring';
            break;
        case 'trinket1':
        case 'trinket2':
            className = 'Trinkets';
            break;
        case 'mainhand':
            className = 'Weapons';
            break;
        case 'offhand':
            className = 'Off-Hands';
            break;
        default:
            className = slotType.charAt(0).toUpperCase() + slotType.slice(1);
            break;
    }
    if (!window.itemDatabase || !Array.isArray(window.itemDatabase)) return [];
    const category = window.itemDatabase.find(cat => cat.Class === className);
    return category && Array.isArray(category.items) ? category.items : [];
}

// Returns the array of enchants for a given slot type from the enchants database
function getEnchantsForSlot(slotType) {
    // Map slotType to enchant class name
    let className = '';
    switch (slotType) {
        case 'helmet': className = 'Helmet'; break;
        case 'neck': className = 'Neck'; break;
        case 'shoulders': className = 'Shoulders'; break;
        case 'cloak': className = 'Cloak'; break;
        case 'chest': className = 'Chest'; break;
        case 'wrist': className = 'Wrist'; break;
        case 'gloves': className = 'Gloves'; break;
        case 'belt': className = 'Belt'; break;
        case 'pants': className = 'Pants'; break;
        case 'boots': className = 'Boots'; break;
        case 'ring1':
        case 'ring2': className = 'Ring'; break;
        case 'mainhand': className = 'MainHand'; break;
        case 'offhand': className = 'OffHand'; break;
        default:
            return []; // No enchants for trinkets, race, libram
    }
    
    if (!window.enchantsDatabase || !Array.isArray(window.enchantsDatabase)) {
        console.error('enchantsDatabase not loaded or not an array:', window.enchantsDatabase);
        return [];
    }
    
    const category = window.enchantsDatabase.find(cat => cat.Class === className);
    return category && Array.isArray(category.items) ? category.items : [];
}

    // Create a DOM element for an item option in the item menu
    function createItemOption(item, slotType, isEnchant = false) {
        const option = document.createElement('div');
        option.className = 'item-option';
        option.style.display = 'grid';
        // Grid layout: For mainhand show damage, for enchants remove type column
        if (slotType === 'mainhand' && !isEnchant) {
            option.style.gridTemplateColumns = '25% 20% 35% 20%'; // Name, Damage, Stats, Type
        } else if (isEnchant) {
            option.style.gridTemplateColumns = '40% 60%'; // Name, Stats (no type for enchants)
        } else {
            option.style.gridTemplateColumns = '35% 45% 20%'; // Name, Stats, Type
        }
        option.style.gap = '8px';
        option.style.padding = '8px 12px';
        option.style.cursor = 'pointer';
        option.style.borderBottom = '1px solid #333';
        option.style.width = '100%';
        option.style.backgroundColor = '#222';
        option.style.transition = 'background-color 0.2s';
        
        // Hover effect
        option.onmouseenter = function() {
            option.style.backgroundColor = '#333';
        };
        option.onmouseleave = function() {
            option.style.backgroundColor = '#222';
        };
        
        // Column 1: Item name with icon
        const nameColumn = document.createElement('div');
        nameColumn.style.display = 'flex';
        nameColumn.style.alignItems = 'center';
        nameColumn.style.gap = '8px';
        
        // Icon
        if (item.icon) {
            const icon = document.createElement('img');
            icon.src = item.icon;
            icon.alt = item.name;
            icon.style.width = '32px';
            icon.style.height = '32px';
            icon.style.objectFit = 'contain';
            nameColumn.appendChild(icon);
        }
        
        // Name
        const name = document.createElement('span');
        name.textContent = item.name || 'Unnamed';
        name.className = 'item-name';
        name.style.fontWeight = 'bold';
        
        // Quality color
        if (item.quality) {
            // Handle both string and numeric quality values
            if (typeof item.quality === 'string') {
                name.classList.add('quality-' + item.quality.toLowerCase());
                switch (item.quality.toLowerCase()) {
                    case 'common': name.style.color = '#9d9d9d'; break;
                    case 'uncommon': name.style.color = '#1eff00'; break;
                    case 'rare': name.style.color = '#0070dd'; break;
                    case 'epic': name.style.color = '#a335ee'; break;
                    case 'legendary': name.style.color = '#ff8000'; break;
                    default: name.style.color = '#ffd700'; break;
                }
            } else if (typeof item.quality === 'number') {
                // Handle numeric quality values (1-5)
                switch (item.quality) {
                    case 1: name.style.color = '#9d9d9d'; name.classList.add('quality-common'); break;
                    case 2: name.style.color = '#1eff00'; name.classList.add('quality-uncommon'); break;
                    case 3: name.style.color = '#0070dd'; name.classList.add('quality-rare'); break;
                    case 4: name.style.color = '#a335ee'; name.classList.add('quality-epic'); break;
                    case 5: name.style.color = '#ff8000'; name.classList.add('quality-legendary'); break;
                    default: name.style.color = '#ffd700'; break;
                }
            }
        } else {
            name.style.color = '#ffd700'; // Default gold color if no quality specified
        }
        nameColumn.appendChild(name);
        option.appendChild(nameColumn);

        // Add damage column for weapons (only for mainhand items and not enchants)
        if (slotType === 'mainhand' && !isEnchant) {
            const damageColumn = document.createElement('div');
            damageColumn.style.display = 'flex';
            damageColumn.style.flexDirection = 'column';
            damageColumn.style.alignItems = 'center';
            damageColumn.style.justifyContent = 'center';
            damageColumn.style.fontSize = '13px';
            damageColumn.style.color = '#fffbe0';
            
            // Debug - log weapon properties
            console.log('Weapon item properties:', JSON.stringify(item, null, 2));
            
            // Check if weapon has min/max damage defined
            if (item.minDamage !== undefined && item.maxDamage !== undefined) {
                // Display min damage
                const minDamageText = document.createElement('div');
                minDamageText.textContent = `Min Damage ${item.minDamage}`;
                minDamageText.style.fontSize = '12px';
                damageColumn.appendChild(minDamageText);
                
                // Display max damage
                const maxDamageText = document.createElement('div');
                maxDamageText.textContent = `Max Damage ${item.maxDamage}`;
                maxDamageText.style.fontSize = '12px';
                damageColumn.appendChild(maxDamageText);
                
                // Add DPS if available or calculate it
                if (item.dps !== undefined) {
                    const dpsText = document.createElement('div');
                    dpsText.textContent = `${item.dps.toFixed(1)} DPS`;
                    dpsText.style.fontSize = '12px';
                    dpsText.style.color = '#aaa';
                    dpsText.style.marginTop = '3px';
                    damageColumn.appendChild(dpsText);
                } else if (item.speed !== undefined) {
                    // Calculate DPS if speed is available
                    const avgDamage = (item.minDamage + item.maxDamage) / 2;
                    const calculatedDps = avgDamage / item.speed;
                    
                    const dpsText = document.createElement('div');
                    dpsText.textContent = `${calculatedDps.toFixed(1)} DPS`;
                    dpsText.style.fontSize = '12px';
                    dpsText.style.color = '#aaa';
                    dpsText.style.marginTop = '3px';
                    damageColumn.appendChild(dpsText);
                }
                
                // Always add speed if available
                if (item.speed !== undefined) {
                    const speedText = document.createElement('div');
                    speedText.textContent = `${item.speed.toFixed(2)} Speed`;
                    speedText.style.fontSize = '12px';
                    speedText.style.color = '#aaa';
                    damageColumn.appendChild(speedText);
                }
            } else if (item.speed !== undefined) {
                // If no damage values but speed is available, show just the speed
                const speedText = document.createElement('div');
                speedText.textContent = `${item.speed.toFixed(2)} Speed`;
                speedText.style.fontWeight = 'bold';
                damageColumn.appendChild(speedText);
                
                if (item.dps !== undefined) {
                    const dpsText = document.createElement('div');
                    dpsText.textContent = `${item.dps.toFixed(1)} DPS`;
                    dpsText.style.fontSize = '12px';
                    dpsText.style.color = '#aaa';
                    damageColumn.appendChild(dpsText);
                }
            } else {
                // Display placeholder for weapons without damage values or speed
                const noDamageText = document.createElement('div');
                noDamageText.textContent = "N/A";
                noDamageText.style.color = '#777';
                damageColumn.appendChild(noDamageText);
                
                // Add placeholder damage values for debugging
                const minDamageText = document.createElement('div');
                minDamageText.textContent = `Min Damage: None`;
                minDamageText.style.fontSize = '12px';
                minDamageText.style.color = '#777';
                damageColumn.appendChild(minDamageText);
                
                const maxDamageText = document.createElement('div');
                maxDamageText.textContent = `Max Damage: None`;
                maxDamageText.style.fontSize = '12px';
                maxDamageText.style.color = '#777';
                damageColumn.appendChild(maxDamageText);
            }
            
            option.appendChild(damageColumn);
        }

        // Column 2/3: Stats
        const statsDiv = document.createElement('div');
        statsDiv.className = 'item-stats';
        statsDiv.style.display = 'flex';
        statsDiv.style.flexDirection = 'column';
        statsDiv.style.fontSize = '13px';
        statsDiv.style.color = '#fffbe0';
        
        let hasStats = false;
        
        // Define stat order groups
        const statOrder = [
            // Group 1: Basic stats
            'armor', 'health', 'mana',
            // Group 2: Primary attributes
            'stamina', 'spirit', 'strength', 'agility', 'intellect',
            // Group 3: Melee stats
            'attackpower', 'armorpen', 'meleehit', 'meleecrit', 'meleehaste',
            // Group 4: Spell stats
            'healingpower', 'spellpower', 'spellpen', 'spellhit', 'spellcrit', 'spellhaste',
            // Group 5: Defense stats
            'defense', 'blockvalue', 'block', 'parry', 'dodge',
            // Group 6: Misc stats at the end
            'mp5', 'thorns', 'spellstrike'
        ];
        
        // Collect all stats from the item
        const itemStats = {};
        
        // Get stats from item.stats object
        if (item.stats && typeof item.stats === 'object') {
            for (const [stat, value] of Object.entries(item.stats)) {
                if (typeof value === 'number' && value !== 0) {
                    itemStats[stat.toLowerCase()] = value;
                }
            }
        }
        
        // Get stats from direct item properties
        const directStatProps = [
            'stamina', 'strength', 'agility', 'intellect', 'spirit',
            'armor', 'defense', 'dodge', 'parry', 'block', 'blockvalue',
            'meleehit', 'meleecrit', 'meleehaste', 'attackpower', 'armorpen',
            'spellpower', 'healingpower', 'spellpen', 'spellhit', 'spellcrit', 'spellhaste',
            'mp5', 'thorns', 'spellstrike', 'health', 'mana',
            'arcane', 'fire', 'frost', 'nature', 'shadow', // resistances
            'maces', 'swords', 'axes', 'polearms', 'twohandedmaces', 'twohandedswords' // weapon skills
        ];
        
        directStatProps.forEach(prop => {
            if (item[prop] && typeof item[prop] === 'number' && item[prop] !== 0) {
                itemStats[prop.toLowerCase()] = item[prop];
            }
        });
        
        // First display the stats in the specified order
        statOrder.forEach(stat => {
            if (itemStats[stat] !== undefined) {
                hasStats = true;
                const statLine = document.createElement('span');
                statLine.textContent = `${formatStatName(stat)}: ${itemStats[stat]}`;
                statLine.style.color = '#fffbe0';
                statLine.style.margin = '1px 0';
                statsDiv.appendChild(statLine);
                // Remove from itemStats to track what we've already displayed
                delete itemStats[stat];
            }
        });
        
        // Next display any resistances
        const resistances = ['arcane', 'fire', 'frost', 'nature', 'shadow'];
        resistances.forEach(resistance => {
            if (itemStats[resistance] !== undefined) {
                hasStats = true;
                const statLine = document.createElement('span');
                statLine.textContent = `${formatStatName(resistance)}: ${itemStats[resistance]}`;
                statLine.style.color = '#fffbe0';
                statLine.style.margin = '1px 0';
                statsDiv.appendChild(statLine);
                delete itemStats[resistance];
            }
        });
        
        // Next display any weapon skills
        const weaponSkills = ['maces', 'swords', 'axes', 'polearms', 'twohandedmaces', 'twohandedswords'];
        weaponSkills.forEach(skill => {
            if (itemStats[skill] !== undefined) {
                hasStats = true;
                const statLine = document.createElement('span');
                statLine.textContent = `${formatStatName(skill)}: ${itemStats[skill]}`;
                statLine.style.color = '#fffbe0';
                statLine.style.margin = '1px 0';
                statsDiv.appendChild(statLine);
                delete itemStats[skill];
            }
        });
        
        // Finally display any remaining stats we didn't explicitly order
        for (const [stat, value] of Object.entries(itemStats)) {
            hasStats = true;
            const statLine = document.createElement('span');
            statLine.textContent = `${formatStatName(stat)}: ${value}`;
            statLine.style.color = '#fffbe0';
            statLine.style.margin = '1px 0';
            statsDiv.appendChild(statLine);
        }
        
        // Always add stats column even if empty
        option.appendChild(statsDiv);
        
        // Column 3: Item type (only for non-enchant items)
        if (!isEnchant) {
            const typeColumn = document.createElement('div');
            typeColumn.style.display = 'flex';
            typeColumn.style.alignItems = 'center';
            typeColumn.style.justifyContent = 'flex-end';
            typeColumn.style.fontSize = '13px';
            typeColumn.style.color = '#aaa';
            typeColumn.style.paddingRight = '25px';
            
            // Determine item type to display
            let itemType = '';
            if (item.type) {
                itemType = item.type;
            } else if (item.slot) {
                itemType = item.slot;
            } else if (slotType === 'mainhand' || slotType === 'offhand') {
                itemType = getWeaponDisplayType(item) || slotMapping[slotType] || '';
            } else {
                itemType = slotMapping[slotType] || '';
            }
            
            typeColumn.textContent = itemType;
            option.appendChild(typeColumn);
        }
        
        // Click handler to select item
        option.onclick = function() {
            selectItem(item, false);
        };
        return option;
    }

let currentSlot = null;

const slotMapping = {
    helmet: 'Helmet',
    neck: 'Neck',
    shoulders: 'Shoulders',
    cloak: 'Cloak',
    chest: 'Chest',
    wrist: 'Wrist',
    gloves: 'Gloves',
    belt: 'Belt',
    pants: 'Pants',
    boots: 'Boots',
    ring1: 'Ring',
    ring2: 'Ring',
    trinket1: 'Trinket',
    trinket2: 'Trinket',
    mainhand: 'MainHand',
    offhand: 'OffHand',
    libram: 'Libram',
    race: 'Race'
};

function getItemDatabase() {
    if (window.itemDatabase && Array.isArray(window.itemDatabase) && window.itemDatabase.length > 0) {
        return window.itemDatabase;
    }
    if (typeof itemDatabase !== 'undefined' && Array.isArray(itemDatabase) && itemDatabase.length > 0) {
        return itemDatabase;
    }
    return [];
}

async function ensureItemDatabaseLoaded() {
    if (!window.itemDatabase || !Array.isArray(window.itemDatabase) || window.itemDatabase.length === 0) {
        if (typeof loadItemDatabase === 'function') {
            await loadItemDatabase();
        }
    }
}

async function loadItemDatabase() {
    try {
        const response = await fetch('../data/database/Items.json');
        if (!response.ok) throw new Error('Failed to fetch Items.json');
        const data = await response.json();
        itemDatabase = data;
    } catch (e) {
        console.error('Error loading item database:', e);
    }
}

function showFilterMenu(slotType, slotElement, items) {
    console.log('[DEBUG] showItemMenu called for slot:', slotType, 'slotElement:', slotElement, 'items:', items);
    if (slotType === 'race') {
        console.log('[DEBUG] Race items to display:', items);
    }
    removeItemMenu();
    currentSlot = slotElement;
    
    // Create popup
    const popup = document.createElement('div');
    popup.id = 'item-popup';
    popup.className = 'item-popup';
    popup.style.width = '900px';
    popup.style.height = '750px';
    popup.style.display = 'flex';
    popup.style.flexDirection = 'column';
    popup.style.backgroundColor = '#222';
    popup.style.border = '2px solid #ffd700';
    popup.style.borderRadius = '8px';
    popup.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.8)';
    popup.style.overflow = 'hidden';
    
    // Title
    const popupTitle = document.createElement('div');
    popupTitle.className = 'popup-title';
    popupTitle.textContent = `Select Item for ${slotType.charAt(0).toUpperCase() + slotType.slice(1)}`;
    popupTitle.style.padding = '12px 16px';
    popupTitle.style.fontSize = '18px';
    popupTitle.style.fontWeight = 'bold';
    popupTitle.style.color = '#ffd700';
    popupTitle.style.borderBottom = '1px solid #444';
    popupTitle.style.userSelect = 'none'; // For draggable functionality
    popup.appendChild(popupTitle);

    // Close button (top right)
    const closeBtn = document.createElement('button');
    closeBtn.className = 'popup-close';
    closeBtn.textContent = '\u00d7';
    closeBtn.onclick = removeItemMenu;
    popup.appendChild(closeBtn);

    // Check if this slot can have enchants
    const slotsWithEnchants = ['helmet', 'neck', 'shoulders', 'cloak', 'chest', 'wrist', 'gloves', 'belt', 'pants', 'boots', 'ring1', 'ring2', 'mainhand', 'offhand'];
    const hasEnchants = slotsWithEnchants.includes(slotType);

    // Create tabs if enchants are available
    let currentTab = 'items'; // 'items' or 'enchants'
    if (hasEnchants) {
        const tabContainer = document.createElement('div');
        tabContainer.style.display = 'flex';
        tabContainer.style.borderBottom = '1px solid #444';
        tabContainer.style.backgroundColor = '#333';

        const itemsTab = document.createElement('button');
        itemsTab.textContent = 'Items';
        itemsTab.style.padding = '10px 20px';
        itemsTab.style.border = 'none';
        itemsTab.style.backgroundColor = '#ffd700';
        itemsTab.style.color = '#000';
        itemsTab.style.cursor = 'pointer';
        itemsTab.style.fontWeight = 'bold';

        const enchantsTab = document.createElement('button');
        enchantsTab.textContent = 'Enchants';
        enchantsTab.style.padding = '10px 20px';
        enchantsTab.style.border = 'none';
        enchantsTab.style.backgroundColor = '#333';
        enchantsTab.style.color = '#ffd700';
        enchantsTab.style.cursor = 'pointer';

        // Tab click handlers
        itemsTab.onclick = function() {
            currentTab = 'items';
            itemsTab.style.backgroundColor = '#ffd700';
            itemsTab.style.color = '#000';
            enchantsTab.style.backgroundColor = '#333';
            enchantsTab.style.color = '#ffd700';
            refreshTabContent();
        };

        enchantsTab.onclick = function() {
            currentTab = 'enchants';
            enchantsTab.style.backgroundColor = '#ffd700';
            enchantsTab.style.color = '#000';
            itemsTab.style.backgroundColor = '#333';
            itemsTab.style.color = '#ffd700';
            refreshTabContent();
        };

        tabContainer.appendChild(itemsTab);
        tabContainer.appendChild(enchantsTab);
        popup.appendChild(tabContainer);
    }
    
    // Create main content container
    const contentContainer = document.createElement('div');
    contentContainer.style.flex = '1';
    contentContainer.style.display = 'flex';
    contentContainer.style.flexDirection = 'column';
    
    // Function to refresh content based on current tab
    function refreshTabContent() {
        // Clear existing content
        contentContainer.innerHTML = '';
        
        // Get current items based on tab
        let currentItems;
        let currentSelectFunction;
        
        if (currentTab === 'enchants') {
            currentItems = getEnchantsForSlot(slotType);
            currentSelectFunction = function(item, isEmpty) {
                if (isEmpty) {
                    window.equipEnchant(slotType, { name: '', equipped: false });
                } else {
                    window.equipEnchant(slotType, item);
                }
                removeItemMenu();
            };
            // Update search placeholder
            searchInput.placeholder = 'Search enchants...';
        } else {
            currentItems = items;
            currentSelectFunction = selectItem;
            // Update search placeholder
            searchInput.placeholder = 'Search items...';
        }
        
        // Create search bar and controls for current tab
        const popupControls = document.createElement('div');
        popupControls.className = 'popup-controls';
        popupControls.style.display = 'flex';
        popupControls.style.flexDirection = 'row';
        popupControls.style.alignItems = 'center';
        popupControls.style.gap = '8px';
        popupControls.style.padding = '12px 16px';
        popupControls.style.borderBottom = '1px solid #444';
        popupControls.appendChild(searchInput);
        popupControls.appendChild(filterBtn);
        
        // Update search function
        searchInput.oninput = function() { 
            applySearchFilter(searchInput.value);
        };
        
        // Unequip button (for items only)
        if (currentTab === 'items') {
            const unequipRow = document.createElement('div');
            unequipRow.className = 'popup-unequip-row';
            unequipRow.style.display = 'flex';
            unequipRow.style.justifyContent = 'flex-end';
            unequipRow.style.padding = '12px 16px';
            unequipRow.style.borderBottom = '1px solid #444';
            
            const unequipBtn = document.createElement('button');
            unequipBtn.className = 'popup-unequip-btn';
            unequipBtn.textContent = 'Unequip';
            unequipBtn.onclick = function() {
                selectItem({ name: '', equipped: false }, true);
            };
            unequipRow.appendChild(unequipBtn);
            contentContainer.appendChild(unequipRow);
        } else {
            // Unenchant button for enchants
            const unenchantRow = document.createElement('div');
            unenchantRow.className = 'popup-unequip-row';
            unenchantRow.style.display = 'flex';
            unenchantRow.style.justifyContent = 'flex-end';
            unenchantRow.style.padding = '12px 16px';
            unenchantRow.style.borderBottom = '1px solid #444';
            
            const unenchantBtn = document.createElement('button');
            unenchantBtn.className = 'popup-unequip-btn';
            unenchantBtn.textContent = 'Remove Enchant';
            unenchantBtn.onclick = function() {
                currentSelectFunction({ name: '', equipped: false }, true);
            };
            unenchantRow.appendChild(unenchantBtn);
            contentContainer.appendChild(unenchantRow);
        }
        
        contentContainer.appendChild(popupControls);
        createItemList(currentItems, currentSelectFunction);
    }
    
    // Function to create item list
    function createItemList(itemsToShow, selectFunction) {
        // Define armor slots that should be sorted by armor by default
        const armorSlots = ['helmet', 'shoulders', 'chest', 'wrist', 'offhand', 'gloves', 'belt', 'pants', 'boots'];
        
        // Define quality slots that should be sorted by quality by default
        const qualitySlots = ['ring1', 'ring2', 'trinket1', 'trinket2', 'neck', 'cloak'];
        
        // Sort items based on slot type
        let sortedItems = itemsToShow;
        if (armorSlots.includes(slotType)) {
            // Sort armor slots by armor value (highest first)
            sortedItems = [...itemsToShow].sort((a, b) => {
                const armorA = a.armor || 0;
                const armorB = b.armor || 0;
                return armorB - armorA; // Sort descending (highest armor first)
            });
        } else if (qualitySlots.includes(slotType)) {
            // Sort quality slots by quality (epic > rare > uncommon > common)
            const qualityOrder = { 5: 5, 4: 4, 3: 3, 2: 2, 1: 1, 0: 0 }; // legendary, epic, rare, uncommon, common, poor
            sortedItems = [...itemsToShow].sort((a, b) => {
                const qualityA = qualityOrder[a.quality] || 0;
                const qualityB = qualityOrder[b.quality] || 0;
                return qualityB - qualityA; // Sort descending (highest quality first)
            });
        }
        
        // Item container
        const itemContainer = document.createElement('div');
        itemContainer.style.flex = '1';
        itemContainer.style.display = 'flex';
        itemContainer.style.flexDirection = 'column';
        itemContainer.style.overflow = 'hidden';

        // Header row for item display
        const headerRow = document.createElement('div');
        headerRow.style.display = 'grid';
        // Only show damage column for mainhand items
        headerRow.style.gridTemplateColumns = (slotType === 'mainhand') 
            ? '25% 20% 35% 20%' 
            : '35% 45% 20%';
        headerRow.style.gap = '8px';
        headerRow.style.padding = '8px 12px';
        headerRow.style.fontWeight = 'bold';
        headerRow.style.backgroundColor = '#333';
        headerRow.style.borderBottom = '2px solid #444';
        headerRow.style.color = '#ffd700';
        
        const nameHeader = document.createElement('div');
        nameHeader.textContent = 'Name';
        headerRow.appendChild(nameHeader);
        
        // Only add damage header for mainhand items
        if (slotType === 'mainhand') {
            const damageHeader = document.createElement('div');
            damageHeader.textContent = 'Damage';
            headerRow.appendChild(damageHeader);
        }
        
        const statsHeader = document.createElement('div');
        statsHeader.textContent = 'Stats';
        headerRow.appendChild(statsHeader);
        
        const typeHeader = document.createElement('div');
        typeHeader.textContent = 'Type';
        headerRow.appendChild(typeHeader);

        // Item list (scrollable)
        const itemList = document.createElement('div');
        itemList.id = 'item-list';
        itemList.style.flex = '1';
        itemList.style.overflowY = 'auto';
        itemList.style.overflowX = 'hidden';
        itemList.style.paddingBottom = '50px'; // Add margin at bottom to prevent cut-off

        // Add the header row to the container (not the scrollable list)
        itemContainer.appendChild(headerRow);

        if (!sortedItems || sortedItems.length === 0) {
            const noItemsMsg = document.createElement('div');
            noItemsMsg.textContent = currentTab === 'enchants' ? 'No enchants available for this slot.' : 'No items available for this slot.';
            noItemsMsg.className = 'no-items-msg';
            itemList.appendChild(noItemsMsg);
        } else {
            // Process items for display
            sortedItems.forEach(item => {
                const itemOption = createItemOption(item, slotType);
                // Update click handler for current select function
                itemOption.onclick = function() {
                    selectFunction(item, false);
                };
                itemList.appendChild(itemOption);
            });
        }

        // Add itemList to the container after the header
        itemContainer.appendChild(itemList);
        contentContainer.appendChild(itemContainer);
    }

    // Add content container to popup
    popup.appendChild(contentContainer);
    
    // Initial content load
    refreshTabContent();

    // Search bar and controls (moved to refreshTabContent)
    const popupControls = document.createElement('div');
    popupControls.className = 'popup-controls';
    popupControls.style.display = 'flex';
    popupControls.style.flexDirection = 'row';
    popupControls.style.alignItems = 'center';
    popupControls.style.gap = '8px';
    
    // Search input
    const searchInput = document.createElement('input');
    searchInput.className = 'popup-search';
    searchInput.type = 'text';
    searchInput.placeholder = 'Search items...';
    searchInput.oninput = function() { 
        applySearchFilter(searchInput.value);
    };
    popupControls.appendChild(searchInput);
    
    // Filter button
    const filterBtn = document.createElement('button');
    filterBtn.className = 'popup-filters';
    filterBtn.textContent = 'Filter';
    filterBtn.style.marginLeft = 'auto';
    filterBtn.style.display = 'block'; // Ensure filter button is visible
    popupControls.appendChild(filterBtn); // Add filter button to popup controls
    
    let subFilterMenu = null;
    let subFilterStatMenu = null;
    
    function removeSubFilterMenu() {
        if (subFilterStatMenu && subFilterStatMenu.parentNode) {
            subFilterStatMenu.parentNode.removeChild(subFilterStatMenu);
            subFilterStatMenu = null;
        }
        if (subFilterMenu && subFilterMenu.parentNode) {
            subFilterMenu.parentNode.removeChild(subFilterMenu);
            subFilterMenu = null;
        }
    }
    filterBtn.onclick = function(e) {
        e.stopPropagation();
        
        // If submenu already exists, just toggle it
        if (subFilterMenu) {
            removeSubFilterMenu();
            return;
        }
        
        // Create main filter categories menu as a separate floating window
        subFilterMenu = document.createElement('div');
        subFilterMenu.className = 'filter-categories-menu';
        
        // Position menu as a separate floating window to the right of the main popup
        const filterRect = filterBtn.getBoundingClientRect();
        const popupRect = popup.getBoundingClientRect();
        
        subFilterMenu.style.position = 'fixed';
        subFilterMenu.style.left = (popupRect.right + 10) + 'px';
        subFilterMenu.style.top = filterRect.top + 'px';
        subFilterMenu.style.zIndex = '10002'; // Higher than other elements
        subFilterMenu.style.background = '#222';
        subFilterMenu.style.border = '2px solid #ffd700';
        subFilterMenu.style.borderRadius = '8px';
        subFilterMenu.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.8)';
        subFilterMenu.style.padding = '8px 0';
        subFilterMenu.style.minWidth = '200px';
        subFilterMenu.style.maxHeight = '400px';
        subFilterMenu.style.overflowY = 'auto';
        
        // Use static stat categories for dropdown
        const statCategories = {
            'Primary Stats': ['Stamina', 'Spirit', 'Strength', 'Agility', 'Intellect', 'Armor'],
            'Melee Stats': ['Attack Power', 'Melee Crit', 'Melee Hit', 'Armor Pen', 'Melee Haste'],
            'Spell Stats': ['Healing Power', 'Spell Power', 'Spell Pen', 'Spell Hit', 'Spell Crit', 'Spell Haste'],
            'Defensive Stats': ['Defense', 'Block Value', 'Block', 'Parry', 'Dodge'],
            'Resistances': ['Fire Res', 'Nature Res', 'Arcane Res', 'Frost Res', 'Shadow Res'],
            'Weapon Skills': ['Axes', 'Maces', 'Polearms', 'Swords', 'Two-Handed Swords', 'Two-Handed Maces'],
            'Misc Stats': ['Vampirism', 'MP5', 'Spellstrike', 'Thorns']
        };

        let subFilterStatMenu = null;
        function removeSubFilterStatMenu() {
            if (subFilterStatMenu && subFilterStatMenu.parentNode) {
                subFilterStatMenu.parentNode.removeChild(subFilterStatMenu);
                subFilterStatMenu = null;
            }
        }

        Object.keys(statCategories).forEach(category => {
            const catDiv = document.createElement('div');
            catDiv.className = 'filter-category-option';
            catDiv.textContent = category;
            catDiv.style.cursor = 'pointer';
            catDiv.style.padding = '8px 16px';
            catDiv.style.borderBottom = '1px solid #444';
            catDiv.onmouseenter = function() {
                catDiv.style.background = '#333';
            };
            catDiv.onmouseleave = function() {
                catDiv.style.background = '';
            };
            catDiv.onclick = function(ev) {
                ev.stopPropagation();
                
                // Remove any existing stat submenu
                removeSubFilterStatMenu();
                
                // Create stat submenu as a new attached window
                subFilterStatMenu = document.createElement('div');
                subFilterStatMenu.className = 'filter-stats-menu';
                
                // Position stat menu to the right of the categories menu
                const categoryRect = subFilterMenu.getBoundingClientRect();
                subFilterStatMenu.style.position = 'fixed';
                subFilterStatMenu.style.left = (categoryRect.right + 10) + 'px';
                subFilterStatMenu.style.top = categoryRect.top + 'px';
                subFilterStatMenu.style.zIndex = '10003'; // Higher than categories menu
                subFilterStatMenu.style.background = '#222';
                subFilterStatMenu.style.border = '2px solid #ffd700';
                subFilterStatMenu.style.borderRadius = '8px';
                subFilterStatMenu.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.8)';
                subFilterStatMenu.style.padding = '8px 0';
                subFilterStatMenu.style.minWidth = '180px';
                subFilterStatMenu.style.maxHeight = '400px';
                subFilterStatMenu.style.overflowY = 'auto';
                
                // Add title for the stat category
                const titleDiv = document.createElement('div');
                titleDiv.textContent = category;
                titleDiv.style.fontWeight = 'bold';
                titleDiv.style.padding = '8px 16px';
                titleDiv.style.borderBottom = '2px solid #ffd700';
                titleDiv.style.marginBottom = '4px';
                subFilterStatMenu.appendChild(titleDiv);
                
                // List stats for this category
                const stats = getCategoryStats(category);
                for (const stat of stats) {
                    const statDiv = document.createElement('div');
                    statDiv.className = 'filter-stat-option';
                    statDiv.textContent = stat;
                    statDiv.style.cursor = 'pointer';
                    statDiv.style.padding = '6px 16px';
                    statDiv.onmouseenter = function() {
                        statDiv.style.background = '#333';
                    };
                    statDiv.onmouseleave = function() {
                        statDiv.style.background = '';
                    };
                    statDiv.onclick = function(e2) {
                        e2.stopPropagation();
                        sortItemsByStat(stat, items);
                        removeSubFilterStatMenu();
                        removeSubFilterMenu();
                    };
                    subFilterStatMenu.appendChild(statDiv);
                }
                
                document.body.appendChild(subFilterStatMenu);
                
                // Close stat menu when clicking outside
                setTimeout(() => {
                    document.addEventListener('click', function handleStatMenuOutsideClick(event) {
                        if (!subFilterStatMenu.contains(event.target) && !catDiv.contains(event.target)) {
                            removeSubFilterStatMenu();
                            document.removeEventListener('click', handleStatMenuOutsideClick);
                        }
                    });
                }, 50);
            };
            subFilterMenu.appendChild(catDiv);
        });
        
        document.body.appendChild(subFilterMenu);
        
        // Remove submenu if click outside
        setTimeout(() => {
            document.addEventListener('click', function handleCategoryMenuOutsideClick(event) {
                if (!subFilterMenu.contains(event.target) && event.target !== filterBtn && 
                    (!subFilterStatMenu || !subFilterStatMenu.contains(event.target))) {
                    removeSubFilterMenu();
                    document.removeEventListener('click', handleCategoryMenuOutsideClick);
                }
            });
        }, 50);
    };
    
    // Add unequip button in a bottom-right row
        const unequipRow = document.createElement('div');
        unequipRow.className = 'popup-unequip-row';
        const unequipBtn = document.createElement('button');
        unequipBtn.className = 'popup-unequip-btn';
        unequipBtn.textContent = 'Unequip';
        unequipBtn.onclick = function() {
            if (typeof window.equipItem === 'function') {
                window.equipItem(slotType, { name: '', equipped: false });
                removeItemMenu();
            }
        };
        unequipRow.appendChild(unequipBtn);
        popup.appendChild(unequipRow);

    // Define categoryName for stat filter section
    let categoryName = '';
    if (slotType === 'race') {
        categoryName = 'Race';
    } else if (slotType === 'mainhand' || slotType === 'offhand') {
        categoryName = 'Weapon';
    } else if (['helmet','shoulders','chest','wrist','gloves','belt','pants','boots'].includes(slotType)) {
        categoryName = 'Armor';
    } else if (slotType === 'ring1' || slotType === 'ring2') {
        categoryName = 'Ring';
    } else if (slotType === 'trinket1' || slotType === 'trinket2') {
        categoryName = 'Trinket';
    } else if (slotType === 'libram') {
        categoryName = 'Libram';
    } else if (slotType === 'neck') {
        categoryName = 'Neck';
    } else {
        categoryName = slotType.charAt(0).toUpperCase() + slotType.slice(1);
    }
    popup.appendChild(popupControls);
    // Item list container with headers and scrollable list
    // Item list container with headers and scrollable list
    const itemContainer = document.createElement('div');
    itemContainer.style.display = 'flex';
    itemContainer.style.flexDirection = 'column';
    itemContainer.style.height = 'calc(100% - 120px)'; // Leave space for controls and unequip button
    itemContainer.style.overflow = 'hidden';
    
    // Add column headers (outside of the scrollable area)
    const headerRow = document.createElement('div');
    headerRow.style.display = 'grid';
    headerRow.style.gridTemplateColumns = slotType === 'mainhand' || slotType === 'offhand' 
        ? '25% 20% 35% 20%' // For weapons: Name, Damage, Stats, Type
        : '35% 45% 20%';    // For other items: Name, Stats, Type
    headerRow.style.padding = '8px 12px';
    headerRow.style.borderBottom = '2px solid #ffd700';
    headerRow.style.fontWeight = 'bold';
    headerRow.style.color = '#ffd700';
    headerRow.style.fontSize = '14px';
    headerRow.style.backgroundColor = '#222';
    headerRow.style.position = 'sticky';
    headerRow.style.top = '0';
    headerRow.style.zIndex = '2';
    
    const nameHeader = document.createElement('div');
    nameHeader.textContent = 'Item Name';
    headerRow.appendChild(nameHeader);
    
    // Add damage column header for weapons
    if (slotType === 'mainhand' || slotType === 'offhand') {
        const damageHeader = document.createElement('div');
        damageHeader.textContent = 'Damage';
        damageHeader.style.textAlign = 'center';
        headerRow.appendChild(damageHeader);
    }
    
    const statsHeader = document.createElement('div');
    statsHeader.textContent = 'Stats';
    headerRow.appendChild(statsHeader);
    
    const typeHeader = document.createElement('div');
    typeHeader.textContent = 'Type';
    typeHeader.style.textAlign = 'right';
    typeHeader.style.paddingRight = '25px';
    headerRow.appendChild(typeHeader);
    
    // Create scrollable item list
    const itemList = document.createElement('div');
    itemList.id = 'item-list';
    itemList.className = 'item-list';
    itemList.style.overflowY = 'auto';
    itemList.style.overflowX = 'hidden';
    itemList.style.height = '100%';
    itemList.style.minHeight = '300px';
    itemList.style.maxHeight = '500px'; // Fixed height that fits within 750px popup
    itemList.style.paddingBottom = '50px'; // Add margin at bottom to prevent cut-off
    
    // Add the header row to the container (not the scrollable list)
    itemContainer.appendChild(headerRow);
    
    if (!items || items.length === 0) {
        const noItemsMsg = document.createElement('div');
        noItemsMsg.textContent = 'No items available for this slot.';
        noItemsMsg.className = 'no-items-msg';
        itemList.appendChild(noItemsMsg);
    } else {
        // Apply default sorting based on slot type
        let sortedItems = [...items];
        
        // Armor pieces and offhands sort by armor value
        const armorSlots = ['helmet', 'shoulders', 'chest', 'wrist', 'gloves', 'belt', 'pants', 'boots', 'offhand'];
        if (armorSlots.includes(slotType)) {
            sortedItems.sort((a, b) => (Number(b.armor) || 0) - (Number(a.armor) || 0));
            // Update filter button if it exists
            const filtersBtn = document.querySelector('.popup-filters');
            if (filtersBtn) {
                filtersBtn.textContent = 'Armor ▼';
            }
        } 
        // Weapons sort by DPS
        else if (slotType === 'mainhand' || slotType === 'offhand') {
            sortedItems.sort((a, b) => {
                // Calculate or get DPS
                const dpsA = a.dps || (a.damage && a.speed ? a.damage / a.speed : 0);
                const dpsB = b.dps || (b.damage && b.speed ? b.damage / b.speed : 0);
                return dpsB - dpsA;
            });
            // Update filter button if it exists
            const filtersBtn = document.querySelector('.popup-filters');
            if (filtersBtn) {
                filtersBtn.textContent = 'DPS ▼';
            }
        } 
        // Rings and trinkets sort by quality
        else if (slotType === 'ring1' || slotType === 'ring2' || slotType === 'trinket1' || slotType === 'trinket2') {
            const qualityOrder = {'legendary': 4, 'epic': 3, 'rare': 2, 'uncommon': 1, 'common': 0};
            sortedItems.sort((a, b) => {
                const qualityA = qualityOrder[typeof a.quality === 'string' ? a.quality.toLowerCase() : ''] || 0;
                const qualityB = qualityOrder[typeof b.quality === 'string' ? b.quality.toLowerCase() : ''] || 0;
                return qualityB - qualityA;
            });
            // Update filter button if it exists
            const filtersBtn = document.querySelector('.popup-filters');
            if (filtersBtn) {
                filtersBtn.textContent = 'Quality ▼';
            }
        }
        
        // Add all sorted items
        sortedItems.forEach(item => {
            const itemOption = createItemOption(item, slotType);
            itemList.appendChild(itemOption);
        });
    }
    
    // Add itemList to the container after the header
    itemContainer.appendChild(itemList);
    
    // Add the container to the popup
    popup.appendChild(itemContainer);
    
    // Position popup in center
    positionPopup(popup, slotElement);
    document.body.appendChild(popup);
    makeDraggable(popup, popupTitle);
    
    // Add click outside to close functionality
    setTimeout(() => {
        const handleClickOutside = function(event) {
            // Check if the click is outside the popup
            if (!popup.contains(event.target)) {
                console.log('[DEBUG] Click detected outside popup, closing menu');
                removeItemMenu();
                // Remove the event listener to prevent memory leaks
                document.removeEventListener('click', handleClickOutside);
            }
        };
        
        // Add the event listener with a slight delay to prevent immediate closure
        document.addEventListener('click', handleClickOutside);
    }, 100);

}

// Function to filter items by search term
function applySearchFilter(searchTerm) {
    const itemList = document.getElementById('item-list');
    if (!itemList) return;
    
    searchTerm = searchTerm.toLowerCase();
    const itemOptions = itemList.querySelectorAll('.item-option');
    
    itemOptions.forEach(option => {
        const itemName = option.querySelector('.item-name').textContent.toLowerCase();
        if (itemName.includes(searchTerm)) {
            option.style.display = 'grid'; // Use grid layout for item options
        } else {
            option.style.display = 'none';
        }
    });
}

// Format stat names to be more readable
function formatStatName(stat) {
    // Map of stats to their properly formatted display names
    const statDisplayNames = {
        // Basic stats
        'armor': 'Armor',
        'health': 'Health',
        'mana': 'Mana',
        
        // Primary attributes
        'stamina': 'Stamina',
        'spirit': 'Spirit',
        'strength': 'Strength',
        'agility': 'Agility',
        'intellect': 'Intellect',
        
        // Melee stats
        'attackpower': 'Attack Power',
        'armorpen': 'Armor Penetration',
        'meleehit': 'Melee Hit',
        'meleecrit': 'Melee Critical Strike',
        'meleehaste': 'Melee Haste',
        
        // Spell stats
        'healingpower': 'Healing Power',
        'spellpower': 'Spell Power',
        'spellpen': 'Spell Penetration',
        'spellhit': 'Spell Hit',
        'spellcrit': 'Spell Critical Strike',
        'spellhaste': 'Spell Haste',
        
        // Defense stats
        'defense': 'Defense',
        'blockvalue': 'Block Value',
        'block': 'Block',
        'parry': 'Parry',
        'dodge': 'Dodge',
        
        // Resistances
        'arcane': 'Arcane Resistance',
        'fire': 'Fire Resistance',
        'frost': 'Frost Resistance',
        'nature': 'Nature Resistance',
        'shadow': 'Shadow Resistance',
        
        // Weapon skills
        'maces': 'Mace Skill',
        'swords': 'Sword Skill',
        'axes': 'Axe Skill',
        'polearms': 'Polearm Skill',
        'twohandedmaces': 'Two-Handed Mace Skill',
        'twohandedswords': 'Two-Handed Sword Skill',
        
        // Misc stats
        'mp5': 'MP5',
        'thorns': 'Thorns Damage',
        'spellstrike': 'Spell Strike',
        'vampirism': 'Vampirism'
    };
    
    // Convert to lowercase for case-insensitive matching
    const statLower = stat.toLowerCase();
    
    // Return the mapped display name or fall back to a formatted version of the original
    if (statDisplayNames[statLower]) {
        return statDisplayNames[statLower];
    } else {
        // Convert camelCase to Title Case with spaces as fallback
        return stat
            .replace(/([a-z])([A-Z])/g, '$1 $2') // Add spaces between camelCase
            .replace(/\b\w/g, c => c.toUpperCase()); // Capitalize first letter of each word
    }
}

// Make formatStatName available globally
window.formatStatName = formatStatName;

function getCategoryStats(categoryName) {
    const statCategories = {
        'Primary Stats': ['Stamina', 'Spirit', 'Strength', 'Agility', 'Intellect', 'Armor'],
        'Melee Stats': ['Attack Power', 'Melee Crit', 'Melee Hit', 'Armor Pen', 'Melee Haste'],
        'Spell Stats': ['Healing Power', 'Spell Power', 'Spell Pen', 'Spell Hit', 'Spell Crit', 'Spell Haste'],
        'Defensive Stats': ['Defense', 'Block Value', 'Block', 'Parry', 'Dodge'],
        'Resistances': ['Fire Res', 'Nature Res', 'Arcane Res', 'Frost Res', 'Shadow Res'],
        'Weapon Stats': ['DPS', 'Axes', 'Maces', 'Polearms', 'Swords', 'Two-Handed Swords', 'Two-Handed Maces'],
        'Item Properties': ['Quality', 'Armor'],
        'Misc Stats': ['Vampirism', 'MP5', 'Spellstrike', 'Thorns']
    };
     
    return statCategories[categoryName] || [];
}

function sortItemsByStat(statName, items) {
    const itemList = document.getElementById('item-list');
    const filtersBtn = document.querySelector('.popup-filters');
    
    if (!itemList) return;
    
    // Update filter button text
    if (filtersBtn) {
        filtersBtn.textContent = `${statName} ▼`;
    }
    
    // Get slotType from the current popup
    const popup = document.getElementById('item-popup');
    const titleText = popup ? popup.querySelector('.popup-title')?.textContent : '';
    let slotType = 'unknown';
    
    if (titleText) {
        // Extract slotType from title like "Select Item for Helmet"
        const match = titleText.match(/Select Item for (\w+)/i);
        if (match && match[1]) {
            slotType = match[1].toLowerCase();
        }
    }
    
    // Define armor slots that should prioritize armor sorting
    const armorSlots = ['helmet', 'shoulders', 'chest', 'wrist', 'offhand', 'gloves', 'belt', 'pants', 'boots'];
    
    // Sort items with multi-level sorting for armor slots
    const sortedItems = [...items].sort((a, b) => {
        if (armorSlots.includes(slotType)) {
            // For armor slots: Primary sort by armor, secondary sort by selected stat
            const armorA = a.armor || 0;
            const armorB = b.armor || 0;
            
            // If armor values are different, sort by armor (descending)
            if (armorA !== armorB) {
                return armorB - armorA;
            }
            
            // If armor values are the same, sort by selected stat (descending)
            const valueA = getItemStatValue(a, statName);
            const valueB = getItemStatValue(b, statName);
            return valueB - valueA;
        } else {
            // For non-armor slots: Sort only by selected stat
            const valueA = getItemStatValue(a, statName);
            const valueB = getItemStatValue(b, statName);
            return valueB - valueA;
        }
    });
    
    // Clear and repopulate list
    itemList.innerHTML = '';
    
    sortedItems.forEach(item => {
        const itemOption = createItemOption(item, slotType);
        itemList.appendChild(itemOption);
    });
}

function getItemStatValue(item, statName) {
    // Special handling for DPS
    if (statName === 'DPS' || statName === 'Weapon DPS') {
        return item.dps || (item.damage && item.speed ? item.damage / item.speed : 0);
    }
    
    // Special handling for Quality
    if (statName === 'Quality') {
        const qualityOrder = {'legendary': 4, 'epic': 3, 'rare': 2, 'uncommon': 1, 'common': 0};
        return qualityOrder[item.quality?.toLowerCase()] || 0;
    }
    
    const statMap = {
        'Armor': 'armor',
        'Stamina': 'stamina',
        'Spirit': 'spirit',
        'Strength': 'strength',
        'Agility': 'agility',
        'Intellect': 'intellect',
        'Attack Power': 'attackpower',
        'Melee Hit': 'meleehit',
        'Melee Crit': 'meleecrit',
        'Armor Pen': 'armorpen',
        'Melee Haste': 'meleehaste',
        'Healing Power': 'healingpower',
        'Spell Power': 'spellpower',
        'Spell Pen': 'spellpen',
        'Spell Hit': 'spellhit',
        'Spell Crit': 'spellcrit',
        'Spell Haste': 'spellhaste',
        'Defense': 'defense',
        'Block Value': 'blockvalue',
        'Block': 'block',
        'Parry': 'parry',
        'Dodge': 'dodge',
        'Fire Res': 'fireresist',
        'Nature Res': 'natureresist',
        'Arcane Res': 'arcaneresist',
        'Frost Res': 'frostresist',
        'Shadow Res': 'shadowresist',
        'Axes': 'axes',
        'Maces': 'maces',
        'Polearms': 'polearms',
        'Swords': 'swords',
        'Two-Handed Swords': 'twohandedswords',
        'Two-Handed Maces': 'twohandedmaces',
        'Vampirism': 'vampirism',
        'MP5': 'mp5',
        'Spellstrike': ['spellstrike', 'arcanespellstrike', 'firespellstrike', 'naturespellstrike', 'shadowspellstrike', 'frostspellstrike'],
        'Thorns': ['thorns', 'arcanethorns', 'firethorns', 'naturethorns', 'shadowthorns', 'frostthorns']
    };
    
    const statKey = statMap[statName];
    if (!statKey) return 0;
    
    // Handle array of stat keys (for aggregated stats like thorns and spellstrike)
    if (Array.isArray(statKey)) {
        let total = 0;
        statKey.forEach(key => {
            total += Number(item[key]) || 0;
        });
        return total;
    }
    
    return Number(item[statKey]) || 0;
}

function getWeaponDisplayType(item) {
    if (!item.type) return '';
    if (item.slot && typeof item.slot === 'string' && item.slot.toLowerCase().includes('two-hand')) {
        if (item.type === 'Axe') return '';
        return `${item.type} (2H)`;
    }
    return item.type;
}

function createItemTypeFilters(slotType, items) {
    const container = document.createElement('div');
    container.className = 'item-type-filter-container';
    let filterOptions = [];
    let title = '';
    const armorSlots = ['helmet', 'shoulders', 'chest', 'wrist', 'gloves', 'belt', 'pants', 'boots'];
    if (armorSlots.includes(slotType)) {
        title = 'Armor Type:';
        const availableTypes = [...new Set(items.map(item => item.type).filter(type => type))];
        const armorTypes = ['Plate', 'Mail', 'Leather', 'Cloth'];
        filterOptions = armorTypes.filter(type => availableTypes.includes(type));
    } else if (slotType === 'mainhand') {
        title = 'Weapon Type:';
        let availableTypes = [...new Set(items.map(getWeaponDisplayType).filter(type => type))];
        availableTypes = availableTypes.filter(type => type !== 'Axe (2H)');
        filterOptions = availableTypes;
    } else if (slotType === 'offhand') {
        title = 'Off-Hand Type:';
        const availableTypes = [...new Set(items.map(item => item.type).filter(type => type))];
        const offhandTypes = ['Shield', 'Off-Hand'];
        filterOptions = offhandTypes.filter(type => availableTypes.includes(type));
    }
    if (filterOptions.length === 0) {
        return null;
    }
    const titleElement = document.createElement('div');
    titleElement.className = 'item-type-filter-title';
    titleElement.textContent = title;
    container.appendChild(titleElement);
    // Add spacer after filter title
    const filterSpacer = document.createElement('div');
    filterSpacer.className = 'popup-spacer';
    container.appendChild(filterSpacer);
    
    const buttonsContainer = document.createElement('div');
    // Close button (top right)
    const closeBtn = document.createElement('button');
    closeBtn.className = 'popup-close';
    closeBtn.textContent = '\u00d7';
    closeBtn.onclick = removeItemMenu;
    popup.appendChild(closeBtn);

    // Search bar and controls
    const popupControls = document.createElement('div');
    popupControls.className = 'popup-controls';
    popupControls.style.display = 'flex';
    popupControls.style.flexDirection = 'row';
    popupControls.style.alignItems = 'center';
    popupControls.style.gap = '8px';
    // Search input
    const searchInput = document.createElement('input');
    searchInput.className = 'popup-search';
    searchInput.type = 'text';
    searchInput.placeholder = 'Search items...';
    searchInput.oninput = function() { applySearchFilter(searchInput.value); };
    popupControls.appendChild(searchInput);
    
    // Filter button
    const filterBtn = document.createElement('button');
    filterBtn.className = 'popup-filters';
    filterBtn.textContent = 'Filter';
    filterBtn.style.marginLeft = 'auto';
    filterBtn.style.display = 'block'; // Ensure filter button is visible
    popupControls.appendChild(filterBtn); // Add filter button to controls
    
    let subFilterMenu = null;
    function removeSubFilterMenu() {
        if (subFilterMenu && subFilterMenu.parentNode) {
            subFilterMenu.parentNode.removeChild(subFilterMenu);
            subFilterMenu = null;
        }
    }
    filterBtn.onclick = function(e) {
        e.stopPropagation();
        
        // If submenu already exists, just toggle it
        if (subFilterMenu) {
            removeSubFilterMenu();
            return;
        }
        
        // Create submenu and position it properly
        subFilterMenu = document.createElement('div');
        subFilterMenu.className = 'sub-filter-menu';
        
        // Position submenu as a separate floating window to the right of the main popup
        const filterRect = filterBtn.getBoundingClientRect();
        const popupRect = popup.getBoundingClientRect();
        
        subFilterMenu.style.position = 'fixed';
        subFilterMenu.style.left = (popupRect.right + 10) + 'px';
        subFilterMenu.style.top = filterRect.top + 'px';
        subFilterMenu.style.zIndex = '10002'; // Higher than other elements
        subFilterMenu.style.background = '#222';
        subFilterMenu.style.border = '2px solid #ffd700';
        subFilterMenu.style.borderRadius = '8px';
        subFilterMenu.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.8)';
        subFilterMenu.style.padding = '8px 0';
        subFilterMenu.style.minWidth = '200px';
        subFilterMenu.style.maxHeight = '400px';
        subFilterMenu.style.overflowY = 'auto';
        // Use static stat categories for dropdown
        const statCategories = {
            'Primary Stats': ['Stamina', 'Spirit', 'Strength', 'Agility', 'Intellect', 'Armor'],
            'Melee Stats': ['Attack Power', 'Melee Crit', 'Melee Hit', 'Armor Pen', 'Melee Haste'],
            'Spell Stats': ['Healing Power', 'Spell Power', 'Spell Pen', 'Spell Hit', 'Spell Crit', 'Spell Haste'],
            'Defensive Stats': ['Defense', 'Block Value', 'Block', 'Parry', 'Dodge'],
            'Resistances': ['Fire Res', 'Nature Res', 'Arcane Res', 'Frost Res', 'Shadow Res'],
            'Weapon Skills': ['Axes', 'Maces', 'Polearms', 'Swords', 'Two-Handed Swords', 'Two-Handed Maces'],
            'Misc Stats': ['Vampirism', 'MP5', 'Spellstrike', 'Thorns']
        };
        Object.keys(statCategories).forEach(category => {
            const catDiv = document.createElement('div');
            catDiv.className = 'sub-filter-title';
            catDiv.textContent = category;
            catDiv.style.cursor = 'pointer';
            catDiv.style.padding = '6px 16px';
            catDiv.onmouseenter = function() {
                catDiv.style.background = '#333';
            };
            catDiv.onmouseleave = function() {
                catDiv.style.background = '';
            };
            catDiv.onclick = function(ev) {
                ev.stopPropagation();
                // Remove any previous stat submenu
                const prevStatMenu = subFilterMenu.querySelector('.sub-filter-stat-menu');
                if (prevStatMenu) prevStatMenu.remove();
                // Create stat submenu inside subFilterMenu
                const statMenu = document.createElement('div');
                statMenu.className = 'sub-filter-stat-menu';
                statMenu.style.position = 'relative';
                statMenu.style.left = '0';
                statMenu.style.top = '0';
                statMenu.style.background = '#222';
                statMenu.style.border = '1px solid #ffd700';
                statMenu.style.borderRadius = '8px';
                statMenu.style.boxShadow = '0 2px 8px #000';
                statMenu.style.padding = '8px 0';
                statMenu.style.minWidth = '160px';
                statMenu.style.marginTop = '4px';
                // List stats for this category
                const stats = getCategoryStats(category);
                for (const stat of stats) {
                    const statDiv = document.createElement('div');
                    statDiv.className = 'sub-filter-stat-option';
                    statDiv.textContent = stat;
                    statDiv.style.cursor = 'pointer';
                    statDiv.style.padding = '6px 16px';
                    statDiv.onmouseenter = function() {
                        statDiv.style.background = '#333';
                    };
                    statDiv.onmouseleave = function() {
                        statDiv.style.background = '';
                    };
                    statDiv.onclick = function(e2) {
                        e2.stopPropagation();
                        sortItemsByStat(stat, items);
                        removeSubFilterMenu();
                    };
                    statMenu.appendChild(statDiv);
                }
                catDiv.appendChild(statMenu);
            };
            subFilterMenu.appendChild(catDiv);
        });
        // Insert submenu in document body as a separate window, not inside popup  
        document.body.appendChild(subFilterMenu);
        // Remove submenu if click outside
        document.addEventListener('mousedown', outsideClickListener);
    };
    function outsideClickListener(event) {
        if (subFilterMenu && !subFilterMenu.contains(event.target) && event.target !== filterBtn) {
            removeSubFilterMenu();
            document.removeEventListener('mousedown', outsideClickListener);
        }
    }

    // Add unequip button in a bottom-right row
    const unequipRow = document.createElement('div');
    unequipRow.className = 'popup-unequip-row';
    const unequipBtn = document.createElement('button');
    unequipBtn.className = 'popup-unequip-btn';
    unequipBtn.textContent = 'Unequip';
    unequipBtn.onclick = function() {
        if (typeof window.equipItem === 'function') {
            window.equipItem(slotType, { name: '', equipped: false });
            removeItemMenu();
        }
    };
    unequipRow.appendChild(unequipBtn);

    // Ensure controls are at the top, before unequip row
    popup.appendChild(popupControls);
    popup.appendChild(unequipRow);
    

}

// Position popup in center of screen with new size
function positionPopup(popup, targetElement) {
    // Use the popup's actual size from its style
    const popupWidth = parseInt(popup.style.width) || 900;
    const popupHeight = parseInt(popup.style.height) || 750;
    
    const centerX = Math.max(0, (window.innerWidth - popupWidth) / 2);
    const centerY = Math.max(0, (window.innerHeight - popupHeight) / 2);
    
    popup.style.position = 'fixed';
    popup.style.left = centerX + 'px';
    popup.style.top = centerY + 'px';
    popup.style.zIndex = '10000';
}

function makeDraggable(element, handle) {
    let isDragging = false;
    let currentX = 0;
    let currentY = 0;
    let initialX = 0;
    let initialY = 0;
    let xOffset = 0;
    let yOffset = 0;

    handle.addEventListener('mousedown', dragStart);
    document.addEventListener('mousemove', drag);
    document.addEventListener('mouseup', dragEnd);

    function dragStart(e) {
        if (e.target.classList.contains('popup-close')) return;
        
        initialX = e.clientX - xOffset;
        initialY = e.clientY - yOffset;

        if (e.target === handle || handle.contains(e.target)) {
            isDragging = true;
        }
    }
    
    function drag(e) {
        if (isDragging) {
            e.preventDefault();
            currentX = e.clientX - initialX;
            currentY = e.clientY - initialY;

            xOffset = currentX;
            yOffset = currentY;

            element.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;
        }
    }

    function dragEnd() {
        initialX = currentX;
        initialY = currentY;
        isDragging = false;
    }
}

function getQualityClass(quality) {
    const qualityMap = {
        1: 'quality-common',
        2: 'quality-uncommon', 
        3: 'quality-rare',
        4: 'quality-epic',
        5: 'quality-legendary'
    };
    return qualityMap[quality] || 'quality-common';
}

function removeItemMenu() {
    const popup = document.getElementById('item-popup');
    if (popup) {
        popup.remove();
    }
    currentSlot = null;
}

function selectItem(item, isEmpty) {
    console.log(`[DEBUG] selectItem called for slot '${currentSlot ? currentSlot.dataset.slot : 'unknown'}', item:`, item, 'isEmpty:', isEmpty);
    if (!currentSlot) return;
    
    const slotType = currentSlot.dataset.slot;

    
    // Check for two-handed weapon conflicts before equipping
    if (!isEmpty && !validateItemEquip(item, slotType)) {
        return; // Validation failed, don't equip
    }
    
    // Use the equipItem function from main.js
    if (typeof equipItem === 'function') {
        // If unequipping, pass only { name: '', equipped: false }, else pass full item object
        if (isEmpty) {
            equipItem(slotType, { name: '', equipped: false });
        } else {
            equipItem(slotType, item);
        }
    } else {
        console.error('equipItem function not found!');
    }
    
    // Update character stats
    if (typeof updateCharacterStats === 'function') {
        updateCharacterStats();
    } else {
        console.error('updateCharacterStats function not found!');
    }
}

function validateItemEquip(item, slotType) {
    // Check if trying to equip off-hand item when two-handed weapon is equipped
    if (slotType === 'offhand') {
        const mainhandSlot = document.querySelector('.gear-slot[data-slot="mainhand"]');
        if (mainhandSlot) {
            const mainhandIcon = mainhandSlot.querySelector('.gear-icon');
            const mainhandName = mainhandSlot.querySelector('.gear-name');
            
            // Check if mainhand has an equipped item
            if (mainhandIcon && !mainhandIcon.classList.contains('empty') && mainhandName) {
                const mainhandItemName = mainhandName.textContent.trim();
                const mainhandItem = findItemByName(mainhandItemName);
                
                if (mainhandItem && isTwoHandedWeapon(mainhandItem)) {
                    alert(`Cannot equip off-hand item: ${mainhandItem.name} is a two-handed weapon.`);
                    return false;
                }
            }
        }
    }
    
    // Check if trying to equip two-handed weapon when off-hand item is equipped
    if (slotType === 'mainhand' && isTwoHandedWeapon(item)) {
        const offhandSlot = document.querySelector('.gear-slot[data-slot="offhand"]');
        if (offhandSlot) {
            const offhandIcon = offhandSlot.querySelector('.gear-icon');
            const offhandName = offhandSlot.querySelector('.gear-name');
            
            // Check if offhand has an equipped item
            if (offhandIcon && !offhandIcon.classList.contains('empty') && offhandName) {
                const offhandItemName = offhandName.textContent.trim();
                if (offhandItemName && offhandItemName !== 'Off Hand') {
                    console.log(`[DEBUG] Auto-unequipping ${offhandItemName} to equip two-handed weapon ${item.name}`);
                    
                    // Automatically unequip the offhand item
                    if (typeof equipItem === 'function') {
                        equipItem('offhand', { name: '', equipped: false });
                    }
                    
                    // Show notification that offhand was auto-unequipped
                    alert(`${offhandItemName} was automatically unequipped to make room for the two-handed weapon ${item.name}.`);
                }
            }
        }
    }
    
    return true;
}

function isTwoHandedWeapon(item) {
    if (!item) return false;
    
    // Check slot property first (most reliable)
    if (item.slot && typeof item.slot === 'string') {
        const slot = item.slot.toLowerCase();
        if (slot === 'two-hand' || slot.includes('two-hand')) {
            return true;
        }
    }
    
    // Fallback: Check type property for specific two-handed types
    if (item.type) {
        const twoHandedTypes = [
            'Two-Hand Sword',
            'Two-Handed Mace',
            'Polearm'
        ];
        return twoHandedTypes.includes(item.type);
    }
    
    return false;
}

function findItemByName(itemName) {
    const db = getItemDatabase();
    if (!db || db.length === 0) return null;
    for (const category of db) {
        const item = category.items.find(item => item.name === itemName);
        if (item) {
            return item;
        }
    }
    return null;
}

// Ensure mainhand gear icon opens the item menu
document.addEventListener('DOMContentLoaded', function() {
    console.log('[DEBUG] DOMContentLoaded fired in itemmenu.js');
    const gearSlots = document.querySelectorAll('.gear-slot');
    console.log('[DEBUG] Number of gear slots found:', gearSlots.length, gearSlots);
    gearSlots.forEach(slot => {
        const gearIcon = slot.querySelector('.gear-icon');
        if (gearIcon) {
            console.log('[DEBUG] Attaching click event to gear icon for slot:', slot.className);
            gearIcon.addEventListener('click', function(e) {
                console.log('[DEBUG] Gear icon clicked for slot:', slot.className);
                e.preventDefault();
                e.stopPropagation();
                const slotType = slot.dataset.slot;
                const items = getItemsForSlot(slotType);
                console.log('[DEBUG] Gear icon clicked:', slotType, slot, gearIcon, 'Event:', e);
                if (typeof showItemMenu === 'function') {
                    console.log('[DEBUG] Calling showItemMenu for slot:', slotType);
                    showItemMenu(slot, slotType, items);
                } else {
                    console.error('[DEBUG] showItemMenu is not defined');
                }
            });
        } else {
            console.log('[DEBUG] No gear icon found in slot:', slot.className);
        }
    });
});