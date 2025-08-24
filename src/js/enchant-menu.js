

// Global filter state variable
let currentStatFilter = null;

function showEnhancedFilterMenu(slotType, slotElement, items) {
    console.log('[DEBUG] Enhanced item menu called for slot:', slotType);
    removeItemMenu();
    currentSlot = slotElement;
    
    const popup = document.createElement('div');
    popup.id = 'item-popup';
    popup.className = 'item-popup';
    popup.setAttribute('data-gear-type', slotType); // Store gear type for refreshItemList
    popup.style.width = '900px';
    popup.style.height = '750px';
    popup.style.backgroundColor = '#222';
    popup.style.border = '2px solid #ffd700';
    popup.style.borderRadius = '8px';
    popup.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.8)';
    popup.style.zIndex = '10000';
    popup.style.display = 'flex';
    popup.style.flexDirection = 'column';
    popup.style.overflow = 'hidden';
    
    const popupTitle = document.createElement('div');
    popupTitle.className = 'popup-title';
    popupTitle.textContent = `Select Item for ${slotType.charAt(0).toUpperCase() + slotType.slice(1)}`;
    popupTitle.style.padding = '12px 16px';
    popupTitle.style.fontSize = '18px';
    popupTitle.style.fontWeight = 'bold';
    popupTitle.style.color = '#ffd700';
    popupTitle.style.borderBottom = '1px solid #444';
    popupTitle.style.userSelect = 'none';
    popup.appendChild(popupTitle);

    const closeBtn = document.createElement('button');
    closeBtn.className = 'popup-close';
    closeBtn.textContent = '\u00d7';
    closeBtn.style.position = 'absolute';
    closeBtn.style.top = '8px';
    closeBtn.style.right = '12px';
    closeBtn.style.background = 'none';
    closeBtn.style.border = 'none';
    closeBtn.style.color = '#fff';
    closeBtn.style.fontSize = '24px';
    closeBtn.style.cursor = 'pointer';
    closeBtn.style.zIndex = '10001';
    closeBtn.onclick = removeItemMenu;
    popup.appendChild(closeBtn);

    const slotsWithEnchants = ['helmet', 'neck', 'shoulders', 'cloak', 'chest', 'wrist', 'gloves', 'belt', 'pants', 'boots', 'ring1', 'ring2', 'mainhand', 'offhand'];
    const hasEnchants = slotsWithEnchants.includes(slotType);

    let currentTab = 'items';
    let contentContainer;
    let searchInput, filterBtn, popupControls;
    
    searchInput = document.createElement('input');
    searchInput.className = 'popup-search';
    searchInput.type = 'text';
    searchInput.placeholder = 'Search items...';
    
    filterBtn = document.createElement('button');
    filterBtn.className = 'popup-filters';
    filterBtn.textContent = 'Filter';
    filterBtn.style.marginLeft = 'auto';
    
    if (hasEnchants) {
        const tabContainer = document.createElement('div');
        tabContainer.style.display = 'flex';
        tabContainer.style.justifyContent = 'space-between';
        tabContainer.style.alignItems = 'center';
        tabContainer.style.borderBottom = '1px solid #444';
        tabContainer.style.backgroundColor = '#333';

        // Tab buttons container
        const tabButtonsContainer = document.createElement('div');
        tabButtonsContainer.style.display = 'flex';

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

        // Unequip button positioned on the right side of tabs
        const unequipBtn = document.createElement('button');
        unequipBtn.className = 'popup-unequip-btn';
        unequipBtn.textContent = currentTab === 'enchants' ? 'Remove Enchant' : 'Unequip';
        unequipBtn.style.padding = '10px 20px';
        unequipBtn.style.margin = '0';
        unequipBtn.style.backgroundColor = '#8B0000';
        unequipBtn.style.color = '#ffd700';
        unequipBtn.style.border = 'none';
        unequipBtn.style.cursor = 'pointer';
        unequipBtn.style.fontWeight = 'bold';
        unequipBtn.onclick = function() {
            if (currentTab === 'enchants') {
                window.equipEnchant(slotType, { name: '', equipped: false });
            } else {
                selectItem({ name: '', equipped: false }, true);
            }
            removeItemMenu();
        };

        // Tab click handlers
        itemsTab.onclick = function() {
            currentTab = 'items';
            updateTabStyles();
            refreshContent();
        };

        enchantsTab.onclick = function() {
            currentTab = 'enchants';
            updateTabStyles();
            refreshContent();
        };
        
        function updateTabStyles() {
            if (currentTab === 'items') {
                itemsTab.style.backgroundColor = '#ffd700';
                itemsTab.style.color = '#000';
                enchantsTab.style.backgroundColor = '#333';
                enchantsTab.style.color = '#ffd700';
                unequipBtn.textContent = 'Unequip';
            } else {
                enchantsTab.style.backgroundColor = '#ffd700';
                enchantsTab.style.color = '#000';
                itemsTab.style.backgroundColor = '#333';
                itemsTab.style.color = '#ffd700';
                unequipBtn.textContent = 'Remove Enchant';
            }
        }

        tabButtonsContainer.appendChild(itemsTab);
        tabButtonsContainer.appendChild(enchantsTab);
        tabContainer.appendChild(tabButtonsContainer);
        tabContainer.appendChild(unequipBtn);
        popup.appendChild(tabContainer);
    } else {
        // For slots without enchants, unequip button will be added between search and columns
    }

    // Create content container
    contentContainer = document.createElement('div');
    contentContainer.style.flex = '1';
    contentContainer.style.display = 'flex';
    contentContainer.style.flexDirection = 'column';
    popup.appendChild(contentContainer);
    
    // Filter system variables
    let subFilterMenu = null;
    let subFilterStatMenu = null;
    
    function removeSubFilterMenu() {
        if (subFilterMenu && subFilterMenu.parentNode) {
            subFilterMenu.parentNode.removeChild(subFilterMenu);
            subFilterMenu = null;
        }
        
        // Show the item container again
        const itemContainer = contentContainer.querySelector('.item-list-container');
        if (itemContainer) {
            itemContainer.style.display = 'flex';
        }
        
        // Reset filter button text if no filter is active
        if (!currentStatFilter) {
            filterBtn.textContent = 'Filter';
        }
    }
    
    function refreshContent() {
        contentContainer.innerHTML = '';
        
        // Get current items based on tab
        let currentItems, selectFunction;
        
        if (currentTab === 'enchants') {
            currentItems = getEnchantsForSlot(slotType);
            selectFunction = function(item) {
                window.equipEnchant(slotType, item);
                removeItemMenu();
            };
            searchInput.placeholder = 'Search enchants...';
        } else {
            currentItems = items;
            selectFunction = function(item) {
                selectItem(item, false);
            };
            searchInput.placeholder = 'Search items...';
        }
        
        // Apply default sorting based on slot type
        if (currentItems && currentItems.length > 0) {
            console.log('[DEBUG] Before filtering - items count:', currentItems.length, 'currentStatFilter:', currentStatFilter);
            
            // Apply stat filter first if one is active
            if (currentStatFilter) {
                console.log('[DEBUG] Applying stat filter:', currentStatFilter);
                currentItems = filterItemsByStat(currentItems, currentStatFilter);
                console.log('[DEBUG] After filtering - items count:', currentItems.length);
                
                // Sort by the filtered stat value (highest first)
                const statMap = {
                    'Attack Power': 'attackpower',
                    'Spell Power': 'spellpower',
                    'Healing Power': 'healingpower',
                    'Melee Hit': 'meleehit',
                    'Melee Crit': 'meleecrit',
                    'Spell Hit': 'spellhit',
                    'Spell Crit': 'spellcrit',
                    'Block Value': 'blockvalue',
                    'MP5': 'mp5',
                    'Fire Res': 'fire',
                    'Nature Res': 'nature',
                    'Arcane Res': 'arcane',
                    'Frost Res': 'frost',
                    'Shadow Res': 'shadow',
                    'Health': 'health',
                    'Mana': 'mana'
                };
                
                const internalStatName = statMap[currentStatFilter] || currentStatFilter.toLowerCase();
                console.log('[DEBUG] Sorting by stat:', internalStatName);
                
                currentItems = [...currentItems].sort((a, b) => {
                    const statValueA = getItemTotalStatValue(a, internalStatName);
                    const statValueB = getItemTotalStatValue(b, internalStatName);
                    return statValueB - statValueA; // Sort descending (highest first)
                });
            } else {
                // Apply default sorting based on slot type when no filter is active
                // Define armor slots that should be sorted by armor by default
                const armorSlots = ['helmet', 'shoulders', 'chest', 'wrist', 'offhand', 'gloves', 'belt', 'pants', 'boots'];
                
                // Define quality slots that should be sorted by quality by default
                const qualitySlots = ['ring1', 'ring2', 'trinket1', 'trinket2', 'neck', 'cloak'];
                
                if (slotType === 'mainhand') {
                    // Sort mainhand weapons by DPS (highest first)
                    currentItems = [...currentItems].sort((a, b) => {
                        const dpsA = calculateWeaponDPS(a);
                        const dpsB = calculateWeaponDPS(b);
                        return dpsB - dpsA; // Sort descending (highest DPS first)
                    });
                } else if (armorSlots.includes(slotType)) {
                    // Sort armor slots by armor value (highest first)
                    currentItems = [...currentItems].sort((a, b) => {
                        const armorA = a.armor || 0;
                        const armorB = b.armor || 0;
                        return armorB - armorA; // Sort descending (highest armor first)
                    });
                } else if (qualitySlots.includes(slotType)) {
                    // Sort quality slots by quality (epic > rare > uncommon > common)
                    const qualityOrder = { 5: 5, 4: 4, 3: 3, 2: 2, 1: 1, 0: 0 }; // legendary, epic, rare, uncommon, common, poor
                    currentItems = [...currentItems].sort((a, b) => {
                        const qualityA = qualityOrder[a.quality] || 0;
                        const qualityB = qualityOrder[b.quality] || 0;
                        return qualityB - qualityA; // Sort descending (highest quality first)
                    });
                }
            }
        }
        
        // Search and filter controls
        popupControls = document.createElement('div');
        popupControls.className = 'popup-controls';
        popupControls.style.display = 'flex';
        popupControls.style.flexDirection = 'row';
        popupControls.style.alignItems = 'center';
        popupControls.style.gap = '8px';
        popupControls.style.padding = '12px 16px';
        popupControls.style.borderBottom = '1px solid #444';
        popupControls.style.position = 'relative';
        
        // Update search input event handler
        searchInput.oninput = function() { 
            applySearchFilter(searchInput.value);
        };
        
        // Update filter button event handler - replace content instead of creating new windows
        filterBtn.onclick = function(e) {
            e.stopPropagation();
            
            if (subFilterMenu) {
                removeSubFilterMenu();
                return;
            }
            
            // Replace the main popup content with filter categories
            const itemContainer = contentContainer.querySelector('.item-list-container');
            if (itemContainer) {
                itemContainer.style.display = 'none';
            }
            
            // Create filter categories content within the existing popup
            subFilterMenu = document.createElement('div');
            subFilterMenu.className = 'filter-categories-content';
            subFilterMenu.style.flex = '1';
            subFilterMenu.style.display = 'flex';
            subFilterMenu.style.flexDirection = 'column';
            subFilterMenu.style.overflow = 'hidden';
            
            // Filter title
            const filterTitle = document.createElement('div');
            filterTitle.textContent = 'Select Filter Category';
            filterTitle.style.padding = '16px';
            filterTitle.style.fontSize = '16px';
            filterTitle.style.fontWeight = 'bold';
            filterTitle.style.color = '#ffd700';
            filterTitle.style.borderBottom = '2px solid #444';
            filterTitle.style.textAlign = 'center';
            subFilterMenu.appendChild(filterTitle);
            
            // Clear filter button (if a filter is active)
            if (currentStatFilter) {
                const clearFilterBtn = document.createElement('div');
                clearFilterBtn.textContent = `Clear Filter: ${currentStatFilter}`;
                clearFilterBtn.style.cursor = 'pointer';
                clearFilterBtn.style.padding = '12px 16px';
                clearFilterBtn.style.color = '#ffd700';
                clearFilterBtn.style.fontWeight = 'bold';
                clearFilterBtn.style.fontSize = '14px';
                clearFilterBtn.style.border = '1px solid #444';
                clearFilterBtn.style.borderRadius = '4px';
                clearFilterBtn.style.margin = '8px';
                clearFilterBtn.style.backgroundColor = '#8B0000';
                clearFilterBtn.style.textAlign = 'center';
                clearFilterBtn.onmouseenter = function() {
                    clearFilterBtn.style.backgroundColor = '#A52A2A';
                };
                clearFilterBtn.onmouseleave = function() {
                    clearFilterBtn.style.backgroundColor = '#8B0000';
                };
                clearFilterBtn.onclick = function() {
                    currentStatFilter = null;
                    filterBtn.textContent = 'Filter';
                    removeSubFilterMenu();
                    refreshContent();
                };
                subFilterMenu.appendChild(clearFilterBtn);
            }
            
            // Categories list
            const categoriesList = document.createElement('div');
            categoriesList.style.flex = '1';
            categoriesList.style.overflowY = 'auto';
            categoriesList.style.padding = '8px';
            
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
                catDiv.className = 'filter-category-option';
                catDiv.textContent = category;
                catDiv.style.cursor = 'pointer';
                catDiv.style.padding = '12px 16px';
                catDiv.style.color = '#ffd700';
                catDiv.style.fontWeight = 'bold';
                catDiv.style.fontSize = '14px';
                catDiv.style.border = '1px solid #444';
                catDiv.style.borderRadius = '4px';
                catDiv.style.margin = '4px 0';
                catDiv.style.backgroundColor = '#333';
                catDiv.onmouseenter = function() {
                    catDiv.style.backgroundColor = '#555';
                };
                catDiv.onmouseleave = function() {
                    catDiv.style.backgroundColor = '#333';
                };
                catDiv.onclick = function(ev) {
                    ev.stopPropagation();
                    
                    // Replace categories with stats for this category
                    categoriesList.innerHTML = '';
                    
                    // Back button
                    const backBtn = document.createElement('div');
                    backBtn.textContent = '← Back to Categories';
                    backBtn.style.cursor = 'pointer';
                    backBtn.style.padding = '12px 16px';
                    backBtn.style.color = '#ffd700';
                    backBtn.style.fontWeight = 'bold';
                    backBtn.style.fontSize = '14px';
                    backBtn.style.border = '1px solid #444';
                    backBtn.style.borderRadius = '4px';
                    backBtn.style.margin = '4px 0 8px 0';
                    backBtn.style.backgroundColor = '#8B0000';
                    backBtn.onmouseenter = function() {
                        backBtn.style.backgroundColor = '#A52A2A';
                    };
                    backBtn.onmouseleave = function() {
                        backBtn.style.backgroundColor = '#8B0000';
                    };
                    backBtn.onclick = function() {
                        // Recreate categories list
                        filterBtn.click();
                    };
                    categoriesList.appendChild(backBtn);
                    
                    // Category title
                    const categoryTitle = document.createElement('div');
                    categoryTitle.textContent = category;
                    categoryTitle.style.padding = '8px 16px';
                    categoryTitle.style.fontSize = '16px';
                    categoryTitle.style.fontWeight = 'bold';
                    categoryTitle.style.color = '#ffd700';
                    categoryTitle.style.borderBottom = '1px solid #ffd700';
                    categoryTitle.style.marginBottom = '8px';
                    categoriesList.appendChild(categoryTitle);
                    
                    // List stats for this category
                    const stats = getCategoryStats(category);
                    for (const stat of stats) {
                        const statDiv = document.createElement('div');
                        statDiv.className = 'filter-stat-option';
                        statDiv.textContent = stat;
                        statDiv.style.cursor = 'pointer';
                        statDiv.style.padding = '10px 16px';
                        statDiv.style.color = '#fff';
                        statDiv.style.border = '1px solid #444';
                        statDiv.style.borderRadius = '4px';
                        statDiv.style.margin = '2px 0';
                        
                        // Highlight if this is the current filter
                        if (currentStatFilter === stat) {
                            statDiv.style.backgroundColor = '#0070dd';
                            statDiv.style.color = '#fff';
                        } else {
                            statDiv.style.backgroundColor = '#444';
                        }
                        
                        statDiv.onmouseenter = function() {
                            if (currentStatFilter !== stat) {
                                statDiv.style.backgroundColor = '#555';
                            }
                        };
                        statDiv.onmouseleave = function() {
                            if (currentStatFilter === stat) {
                                statDiv.style.backgroundColor = '#0070dd';
                            } else {
                                statDiv.style.backgroundColor = '#444';
                            }
                        };
                        statDiv.onclick = function(e2) {
                            e2.stopPropagation();
                            const currentItems = currentTab === 'items' ? items : getEnchantsForSlot(slotType);
                            applyStatFilter(stat, currentItems);
                            removeSubFilterMenu();
                            refreshContent(); // Go back to item list
                        };
                        categoriesList.appendChild(statDiv);
                    }
                };
                categoriesList.appendChild(catDiv);
            });
            
            subFilterMenu.appendChild(categoriesList);
            contentContainer.appendChild(subFilterMenu);
            
            // Update filter button text
            filterBtn.textContent = 'Close Filter';
        };
        
        popupControls.appendChild(searchInput);
        popupControls.appendChild(filterBtn);
        contentContainer.appendChild(popupControls);
        
        // Update filter button text based on current state
        if (currentStatFilter) {
            filterBtn.textContent = `Filter: ${currentStatFilter}`;
        } else {
            filterBtn.textContent = 'Filter';
        }
        
        // Add unequip button between search controls and item list ONLY for slots without enchants
        if (!hasEnchants) {
            const unequipRow = document.createElement('div');
            unequipRow.className = 'popup-unequip-row';
            unequipRow.style.display = 'flex';
            unequipRow.style.justifyContent = 'stretch';
            unequipRow.style.padding = '0';
            unequipRow.style.borderBottom = 'none';
            unequipRow.style.backgroundColor = 'transparent';
            
            const unequipBtn = document.createElement('button');
            unequipBtn.className = 'popup-unequip-btn';
            unequipBtn.textContent = 'Unequip';
            unequipBtn.style.padding = '12px 16px';
            unequipBtn.style.width = '100%';
            unequipBtn.style.backgroundColor = '#8B0000';
            unequipBtn.style.color = '#ffd700';
            unequipBtn.style.border = 'none';
            unequipBtn.style.borderRadius = '4px';
            unequipBtn.style.cursor = 'pointer';
            unequipBtn.style.fontWeight = 'bold';
            unequipBtn.onclick = function() {
                selectItem({ name: '', equipped: false }, true);
                removeItemMenu();
            };
            unequipRow.appendChild(unequipBtn);
            contentContainer.appendChild(unequipRow);
        }
        
        // Item container with headers and scrollable list
        const itemContainer = document.createElement('div');
        itemContainer.className = 'item-list-container';
        itemContainer.style.flex = '1';
        itemContainer.style.display = 'flex';
        itemContainer.style.flexDirection = 'column';
        itemContainer.style.overflow = 'hidden';

        // Header row for item display
        const headerRow = document.createElement('div');
        headerRow.style.display = 'grid';
        // Grid layout: For mainhand items show damage column, for enchants show only name and stats (no type)
        if (slotType === 'mainhand' && currentTab === 'items') {
            headerRow.style.gridTemplateColumns = '25% 20% 35% 20%'; // Name, Damage, Stats, Type
        } else if (currentTab === 'enchants') {
            headerRow.style.gridTemplateColumns = '40% 60%'; // Name, Stats (no type for enchants)
        } else {
            headerRow.style.gridTemplateColumns = '35% 45% 20%'; // Name, Stats, Type
        }
        headerRow.style.gap = '8px';
        headerRow.style.padding = '8px 12px';
        headerRow.style.fontWeight = 'bold';
        headerRow.style.backgroundColor = '#333';
        headerRow.style.borderBottom = '2px solid #444';
        headerRow.style.color = '#ffd700';
        
        const nameHeader = document.createElement('div');
        nameHeader.textContent = 'Name';
        headerRow.appendChild(nameHeader);
        
        // Only add damage header for mainhand items (not enchants or offhand)
        if (slotType === 'mainhand' && currentTab === 'items') {
            const damageHeader = document.createElement('div');
            damageHeader.textContent = 'Damage';
            headerRow.appendChild(damageHeader);
        }
        
        const statsHeader = document.createElement('div');
        statsHeader.textContent = 'Stats';
        headerRow.appendChild(statsHeader);
        
        // Only add type header for non-enchant tabs
        if (currentTab !== 'enchants') {
            const typeHeader = document.createElement('div');
            typeHeader.textContent = 'Type';
            headerRow.appendChild(typeHeader);
        }

        // Item list (scrollable)
        const itemList = document.createElement('div');
        itemList.id = 'item-list';
        itemList.style.flex = '1';
        itemList.style.overflowY = 'auto';
        itemList.style.overflowX = 'hidden';
        itemList.style.minHeight = '300px';
        itemList.style.maxHeight = 'calc(100vh - 250px)';

        itemContainer.appendChild(headerRow);
        
        if (!currentItems || currentItems.length === 0) {
            const noItemsMsg = document.createElement('div');
            noItemsMsg.textContent = currentTab === 'enchants' ? 'No enchants available for this slot.' : 'No items available for this slot.';
            noItemsMsg.className = 'no-items-msg';
            noItemsMsg.style.textAlign = 'center';
            noItemsMsg.style.color = '#888';
            noItemsMsg.style.padding = '20px';
            itemList.appendChild(noItemsMsg);
        } else {
            currentItems.forEach(item => {
                const itemOption = createItemOption(item, slotType, currentTab === 'enchants');
                itemOption.onclick = function() {
                    selectFunction(item, false);
                };
                itemList.appendChild(itemOption);
            });
        }
        
        itemContainer.appendChild(itemList);
        contentContainer.appendChild(itemContainer);
    }
    
    function getQualityColor(quality) {
        if (typeof quality === 'string') {
            switch (quality.toLowerCase()) {
                case 'common': return '#ffffff';
                case 'uncommon': return '#1eff00';
                case 'rare': return '#0070dd';
                case 'epic': return '#a335ee';
                case 'legendary': return '#ff8000';
                default: return '#ffffff';
            }
        }
        return '#ffffff';
    }
    
    // Initial content load
    refreshContent();
    
    // Position and show popup
    positionPopup(popup, slotElement);
    document.body.appendChild(popup);
    if (typeof makeDraggable === 'function') {
        makeDraggable(popup, popupTitle);
    }
    
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

// Helper function to format item stats for display
function getStatsText(item) {
    const stats = item.stats || item;
    const statStrings = [];
    
    // Define stat order groups for display
    const statOrder = [
        'armor', 'health', 'mana',
        'stamina', 'spirit', 'strength', 'agility', 'intellect',
        'attackpower', 'armorpen', 'meleehit', 'meleecrit', 'meleehaste',
        'healingpower', 'spellpower', 'spellpen', 'spellhit', 'spellcrit', 'spellhaste',
        'defense', 'blockvalue', 'block', 'parry', 'dodge',
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
        'mp5', 'thorns', 'spellstrike', 'health', 'mana'
    ];
    
    directStatProps.forEach(prop => {
        if (item[prop] && typeof item[prop] === 'number' && item[prop] !== 0) {
            itemStats[prop.toLowerCase()] = item[prop];
        }
    });
    
    // Display stats in order
    statOrder.forEach(stat => {
        if (itemStats[stat] !== undefined) {
            const formattedStatName = window.formatStatName ? window.formatStatName(stat) : stat;
            statStrings.push(`+${itemStats[stat]} ${formattedStatName}`);
        }
    });
    
    return statStrings.join(', ') || 'No stats';
}

// Helper functions needed for filter system
function getCategoryStats(categoryName) {
    const statCategories = {
        'Primary Stats': ['Stamina', 'Spirit', 'Strength', 'Agility', 'Intellect', 'Armor', 'Health', 'Mana'],
        'Melee Stats': ['Attack Power', 'Melee Crit', 'Melee Hit', 'Armor Pen', 'Melee Haste'],
        'Spell Stats': ['Healing Power', 'Spell Power', 'Spell Pen', 'Spell Hit', 'Spell Crit', 'Spell Haste'],
        'Defensive Stats': ['Defense', 'Block Value', 'Block', 'Parry', 'Dodge'],
        'Resistances': ['Fire Res', 'Nature Res', 'Arcane Res', 'Frost Res', 'Shadow Res'],
        'Weapon Skills': ['Axes', 'Maces', 'Polearms', 'Swords', 'Two-Handed Swords', 'Two-Handed Maces'],
        'Misc Stats': ['Vampirism', 'MP5', 'Spellstrike', 'Thorns']
    };
     
    return statCategories[categoryName] || [];
}

function sortItemsByStat(statName, items) {
    if (!items || !Array.isArray(items)) return;
    
    // Convert display name to internal stat name
    const statMap = {
        'Attack Power': 'attackpower',
        'Spell Power': 'spellpower',
        'Healing Power': 'healingpower',
        'Melee Hit': 'meleehit',
        'Melee Crit': 'meleecrit',
        'Spell Hit': 'spellhit',
        'Spell Crit': 'spellcrit',
        'Block Value': 'blockvalue',
        'MP5': 'mp5'
    };
    
    const internalStatName = statMap[statName] || statName.toLowerCase();
    
    // Get slot type for armor prioritization
    let slotType = 'unknown';
    const popup = document.getElementById('item-popup');
    const titleText = popup ? popup.querySelector('.popup-title')?.textContent : '';
    
    if (titleText) {
        // Extract slotType from title like "Select Item for Helmet"
        const match = titleText.match(/Select Item for (\w+)/i);
        if (match && match[1]) {
            slotType = match[1].toLowerCase();
        }
    }
    
    // Define armor slots that should prioritize armor sorting
    const armorSlots = ['helmet', 'shoulders', 'chest', 'wrist', 'offhand', 'gloves', 'belt', 'pants', 'boots'];
    
    items.sort((a, b) => {
        if (armorSlots.includes(slotType)) {
            // For armor slots: Primary sort by armor, secondary sort by selected stat
            const armorA = a.armor || 0;
            const armorB = b.armor || 0;
            
            // If armor values are different, sort by armor (descending)
            if (armorA !== armorB) {
                return armorB - armorA;
            }
            
            // If armor values are the same, sort by selected stat (descending)
            const aValue = getItemStatValue(a, internalStatName);
            const bValue = getItemStatValue(b, internalStatName);
            return bValue - aValue;
        } else {
            // For non-armor slots: Sort only by selected stat
            const aValue = getItemStatValue(a, internalStatName);
            const bValue = getItemStatValue(b, internalStatName);
            return bValue - aValue; // Sort descending
        }
    });
}

function getItemStatValue(item, statName) {
    // Check direct properties first
    if (item[statName] !== undefined && typeof item[statName] === 'number') {
        console.log('[DEBUG] getItemStatValue found direct property:', item.name, statName, '=', item[statName]);
        return item[statName];
    }
    
    // Check stats object
    if (item.stats && item.stats[statName] !== undefined && typeof item.stats[statName] === 'number') {
        console.log('[DEBUG] getItemStatValue found in stats:', item.name, statName, '=', item.stats[statName]);
        return item.stats[statName];
    }
    
    // Special cases for direct stats
    if (statName === 'armor' && item.armor !== undefined) {
        console.log('[DEBUG] getItemStatValue found armor:', item.name, 'armor =', item.armor);
        return item.armor;
    }
    
    // Handle derived stats that come from base stat conversions
    let derivedValue = 0;
    
    // Health comes from Stamina (10 health per stamina)
    if (statName === 'health') {
        const stamina = getItemBaseStatValue(item, 'stamina');
        if (stamina > 0) {
            derivedValue = stamina * 10;
            console.log('[DEBUG] getItemStatValue calculated health from stamina:', item.name, 'stamina =', stamina, 'health =', derivedValue);
            return derivedValue;
        }
    }
    
    // Mana comes from Intellect (15 mana per intellect)
    if (statName === 'mana') {
        const intellect = getItemBaseStatValue(item, 'intellect');
        if (intellect > 0) {
            derivedValue = intellect * 15;
            console.log('[DEBUG] getItemStatValue calculated mana from intellect:', item.name, 'intellect =', intellect, 'mana =', derivedValue);
            return derivedValue;
        }
    }
    
    // Attack Power comes from Strength (2 AP per strength for paladins)
    if (statName === 'attackpower') {
        const strength = getItemBaseStatValue(item, 'strength');
        if (strength > 0) {
            derivedValue = strength * 2;
            console.log('[DEBUG] getItemStatValue calculated attackpower from strength:', item.name, 'strength =', strength, 'attackpower =', derivedValue);
            return derivedValue;
        }
        
        // Also check for direct attack power on the item
        const directAP = getItemBaseStatValue(item, 'attackpower');
        if (directAP > 0) {
            console.log('[DEBUG] getItemStatValue found direct attackpower:', item.name, 'attackpower =', directAP);
            return directAP;
        }
    }
    
    console.log('[DEBUG] getItemStatValue NOT FOUND:', item.name, 'missing', statName);
    return 0;
}

// Helper function to get base stat values without conversions
function getItemBaseStatValue(item, statName) {
    // Check direct properties first
    if (item[statName] !== undefined && typeof item[statName] === 'number') {
        return item[statName];
    }
    
    // Check stats object
    if (item.stats && item.stats[statName] !== undefined && typeof item.stats[statName] === 'number') {
        return item.stats[statName];
    }
    
    return 0;
}

// Function to get total stat value including conversions for filtering and sorting
function getItemTotalStatValue(item, statName) {
    let totalValue = 0;
    
    // Get direct stat value first
    const directValue = getItemBaseStatValue(item, statName);
    totalValue += directValue;
    
    // Add converted values for derived stats
    if (statName === 'health') {
        // Health from Stamina (10 health per stamina)
        const stamina = getItemBaseStatValue(item, 'stamina');
        totalValue += stamina * 10;
    } else if (statName === 'mana') {
        // Mana from Intellect (15 mana per intellect)
        const intellect = getItemBaseStatValue(item, 'intellect');
        totalValue += intellect * 15;
    } else if (statName === 'attackpower') {
        // Attack Power from Strength (2 AP per strength for paladins)
        const strength = getItemBaseStatValue(item, 'strength');
        totalValue += strength * 2;
    }
    
    console.log('[DEBUG] getItemTotalStatValue for', item.name, statName, '= direct:', directValue, 'total:', totalValue);
    return totalValue;
}

function applySearchFilter(searchTerm) {
    const itemList = document.getElementById('item-list');
    if (!itemList) return;
    
    const searchLower = searchTerm.toLowerCase();
    const itemElements = itemList.children;
    
    for (let i = 0; i < itemElements.length; i++) {
        const itemEl = itemElements[i];
        const nameEl = itemEl.querySelector('.item-name');
        if (nameEl) {
            const itemName = nameEl.textContent.toLowerCase();
            itemEl.style.display = itemName.includes(searchLower) ? 'grid' : 'none';
        }
    }
}

// Function to calculate weapon DPS for sorting
function calculateWeaponDPS(weapon) {
    if (!weapon) return 0;
    
    // Get weapon damage
    const minDamage = weapon.mindamage || weapon.minDamage || 0;
    const maxDamage = weapon.maxdamage || weapon.maxDamage || 0;
    const speed = weapon.speed || weapon.attackSpeed || 1; // Default to 1 if no speed found
    
    // Calculate average damage
    const avgDamage = (minDamage + maxDamage) / 2;
    
    // Calculate DPS (damage per second)
    const dps = speed > 0 ? avgDamage / speed : 0;
    
    console.log('[DEBUG] calculateWeaponDPS for', weapon.name || 'Unknown', '- minDamage:', minDamage, 'maxDamage:', maxDamage, 'speed:', speed, 'DPS:', dps);
    
    return dps;
}

// Apply stat filter - sets the current filter and updates button text
function applyStatFilter(statName) {
    console.log('[DEBUG] applyStatFilter called with:', statName);
    
    currentStatFilter = statName;
    console.log('[DEBUG] applyStatFilter - set currentStatFilter to:', currentStatFilter);
    
    // Update filter button text to show active filter
    const filterBtn = document.querySelector('.popup-filters');
    if (filterBtn) {
        filterBtn.textContent = `Filter: ${statName}`;
    }
    
    // Instead of recreating the entire popup, just refresh the item list
    refreshItemList();
}

// Function to refresh just the item list without recreating the entire popup
function refreshItemList() {
    console.log('[DEBUG] refreshItemList called');
    
    const popup = document.getElementById('item-popup');
    if (!popup) {
        console.log('[DEBUG] refreshItemList - no popup found');
        return;
    }
    
    const gearType = popup.getAttribute('data-gear-type');
    if (!gearType) {
        console.log('[DEBUG] refreshItemList - no gear type found');
        return;
    }
    
    console.log('[DEBUG] refreshItemList - refreshing for gearType:', gearType);
    
    // Get the current tab (items or enchants)
    const activeTab = popup.querySelector('.popup-tab.active');
    const currentTab = activeTab ? activeTab.textContent.toLowerCase() : 'items';
    
    // Get items based on current tab
    let currentItems;
    if (currentTab === 'enchants') {
        currentItems = getEnchantsForSlot(gearType);
    } else {
        currentItems = getItemsForSlot(gearType);
    }
    
    // Apply filtering and sorting (same logic as in showEnhancedFilterMenu)
    if (currentItems && currentItems.length > 0) {
        console.log('[DEBUG] refreshItemList - Before filtering - items count:', currentItems.length, 'currentStatFilter:', currentStatFilter);
        
        // Apply stat filter first if one is active
        if (currentStatFilter) {
            console.log('[DEBUG] refreshItemList - Applying stat filter:', currentStatFilter);
            currentItems = filterItemsByStat(currentItems, currentStatFilter);
            console.log('[DEBUG] refreshItemList - After filtering - items count:', currentItems.length);
            
            // Sort by the filtered stat value (highest first)
            const statMap = {
                'Attack Power': 'attackpower',
                'Spell Power': 'spellpower',
                'Healing Power': 'healingpower',
                'Melee Hit': 'meleehit',
                'Melee Crit': 'meleecrit',
                'Spell Hit': 'spellhit',
                'Spell Crit': 'spellcrit',
                'Block Value': 'blockvalue',
                'MP5': 'mp5',
                'Fire Res': 'fire',
                'Nature Res': 'nature',
                'Arcane Res': 'arcane',
                'Frost Res': 'frost',
                'Shadow Res': 'shadow',
                'Health': 'health',
                'Mana': 'mana'
            };
            
            const internalStatName = statMap[currentStatFilter] || currentStatFilter.toLowerCase();
            console.log('[DEBUG] refreshItemList - Sorting by stat:', internalStatName);
            
            currentItems = [...currentItems].sort((a, b) => {
                const statValueA = getItemTotalStatValue(a, internalStatName);
                const statValueB = getItemTotalStatValue(b, internalStatName);
                console.log('[DEBUG] refreshItemList - Comparing:', a.name, '(', statValueA, ') vs', b.name, '(', statValueB, ')');
                return statValueB - statValueA; // Sort descending (highest first)
            });
        } else {
            // Apply default sorting based on slot type when no filter is active
            const armorSlots = ['helmet', 'shoulders', 'chest', 'wrist', 'offhand', 'gloves', 'belt', 'pants', 'boots'];
            const qualitySlots = ['ring1', 'ring2', 'trinket1', 'trinket2', 'neck', 'cloak'];
            
            if (gearType === 'mainhand') {
                // Sort mainhand weapons by DPS (highest first)
                currentItems = [...currentItems].sort((a, b) => {
                    const dpsA = calculateWeaponDPS(a);
                    const dpsB = calculateWeaponDPS(b);
                    return dpsB - dpsA; // Sort descending (highest DPS first)
                });
            } else if (armorSlots.includes(gearType)) {
                currentItems = [...currentItems].sort((a, b) => {
                    const armorA = a.armor || 0;
                    const armorB = b.armor || 0;
                    return armorB - armorA;
                });
            } else if (qualitySlots.includes(gearType)) {
                const qualityOrder = { 5: 5, 4: 4, 3: 3, 2: 2, 1: 1, 0: 0 };
                currentItems = [...currentItems].sort((a, b) => {
                    const qualityA = qualityOrder[a.quality] || 0;
                    const qualityB = qualityOrder[b.quality] || 0;
                    return qualityB - qualityA;
                });
            } else {
                currentItems = [...currentItems].sort((a, b) => {
                    if (a.name && b.name) {
                        return a.name.localeCompare(b.name);
                    }
                    return 0;
                });
            }
        }
    }
    
    // Find the item list element and update it
    const itemList = popup.querySelector('#item-list');
    if (!itemList) {
        console.log('[DEBUG] refreshItemList - no item list found');
        return;
    }
    
    // Clear current items
    itemList.innerHTML = '';
    
    // Populate with new items
    if (!currentItems || currentItems.length === 0) {
        const noItemsMsg = document.createElement('div');
        noItemsMsg.textContent = currentTab === 'enchants' ? 'No enchants available for this slot.' : 'No items available for this slot.';
        noItemsMsg.className = 'no-items-msg';
        noItemsMsg.style.textAlign = 'center';
        noItemsMsg.style.color = '#888';
        noItemsMsg.style.padding = '20px';
        itemList.appendChild(noItemsMsg);
    } else {
        currentItems.forEach(item => {
            const itemOption = createItemOption(item, gearType, currentTab === 'enchants');
            itemOption.onclick = function() {
                if (currentTab === 'enchants') {
                    window.equipEnchant(gearType, item);
                    removeItemMenu();
                } else {
                    selectItem(item, false);
                }
            };
            itemList.appendChild(itemOption);
        });
    }
    
    console.log('[DEBUG] refreshItemList - completed, displayed', currentItems ? currentItems.length : 0, 'items');
}

// Filter items to only show those with the specified stat
function filterItemsByStat(items, statName) {
    console.log('[DEBUG] filterItemsByStat called with:', statName, 'items count:', items ? items.length : 0);
    
    if (!items || !Array.isArray(items) || !statName) {
        console.log('[DEBUG] filterItemsByStat early return - invalid params');
        return items;
    }
    
    // Convert display name to internal stat name
    const statMap = {
        'Attack Power': 'attackpower',
        'Spell Power': 'spellpower',
        'Healing Power': 'healingpower',
        'Melee Hit': 'meleehit',
        'Melee Crit': 'meleecrit',
        'Spell Hit': 'spellhit',
        'Spell Crit': 'spellcrit',
        'Block Value': 'blockvalue',
        'MP5': 'mp5',
        'Fire Res': 'fire',
        'Nature Res': 'nature',
        'Arcane Res': 'arcane',
        'Frost Res': 'frost',
        'Shadow Res': 'shadow',
        'Health': 'health',
        'Mana': 'mana'
    };
    
    const internalStatName = statMap[statName] || statName.toLowerCase();
    console.log('[DEBUG] filterItemsByStat mapping:', statName, '->', internalStatName);
    
    // Filter items that have this stat
    const filteredItems = items.filter(item => {
        const statValue = getItemTotalStatValue(item, internalStatName);
        const hasstat = statValue > 0;
        if (hasstat) {
            console.log('[DEBUG] Item', item.name, 'has', internalStatName, '=', statValue);
        }
        return hasstat;
    });
    
    console.log('[DEBUG] filterItemsByStat result: filtered', filteredItems.length, 'items from', items.length);
    return filteredItems;
}

// Create item option function for the enhanced menu
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
        
        // Check if weapon has min/max damage defined
        if (item.minDamage !== undefined && item.maxDamage !== undefined) {
            // Display damage range
            const damageText = document.createElement('div');
            damageText.textContent = `${item.minDamage} - ${item.maxDamage}`;
            damageText.style.fontWeight = 'bold';
            damageColumn.appendChild(damageText);
            
            // Add DPS if available or calculate it
            if (item.dps !== undefined) {
                const dpsText = document.createElement('div');
                dpsText.textContent = `${item.dps.toFixed(1)} DPS`;
                dpsText.style.fontSize = '12px';
                dpsText.style.color = '#aaa';
                damageColumn.appendChild(dpsText);
            } else if (item.speed !== undefined) {
                // Calculate DPS if speed is available
                const avgDamage = (item.minDamage + item.maxDamage) / 2;
                const calculatedDps = avgDamage / item.speed;
                
                const dpsText = document.createElement('div');
                dpsText.textContent = `${calculatedDps.toFixed(1)} DPS`;
                dpsText.style.fontSize = '12px';
                dpsText.style.color = '#aaa';
                damageColumn.appendChild(dpsText);
            }
            
            // Always add speed if available
            if (item.speed !== undefined) {
                const speedText = document.createElement('div');
                speedText.textContent = `${item.speed.toFixed(2)}s`;
                speedText.style.fontSize = '12px';
                speedText.style.color = '#aaa';
                damageColumn.appendChild(speedText);
            }
        } else {
            // Display placeholder for weapons without damage values
            const noDamageText = document.createElement('div');
            noDamageText.textContent = "N/A";
            noDamageText.style.color = '#777';
            damageColumn.appendChild(noDamageText);
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
    
    // Use the getStatsText function that's already defined
    const statsText = getStatsText(item);
    if (statsText && statsText !== 'No stats') {
        const statsLines = statsText.split(', ');
        statsLines.forEach(statLine => {
            const statSpan = document.createElement('span');
            statSpan.textContent = statLine;
            statSpan.style.margin = '1px 0';
            statsDiv.appendChild(statSpan);
        });
    } else {
        const noStatsSpan = document.createElement('span');
        noStatsSpan.textContent = 'No stats';
        noStatsSpan.style.color = '#777';
        statsDiv.appendChild(noStatsSpan);
    }
    
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
        } else {
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
                libram: 'Libram'
            };
            itemType = slotMapping[slotType] || '';
        }
        
        typeColumn.textContent = itemType;
        option.appendChild(typeColumn);
    }
    
    return option;
}

// Replace the original function
if (typeof showFilterMenu !== 'undefined') {
    window.originalShowFilterMenu = showFilterMenu;
}
window.showFilterMenu = showEnhancedFilterMenu;
