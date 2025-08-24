if (!window.raceDatabase) {
    fetch('../data/database/Race.json')
        .then(response => response.json())
        .then(data => {
            window.raceDatabase = data;
            updateRaceSlotUI();
        });
}

if (!window.itemDatabase) {
    fetch('../data/database/Items.json')
        .then(response => response.json())
        .then(data => {
            window.itemDatabase = data;
        });
}

if (!window.enchantsDatabase) {
    fetch('../data/database/Enchants.json')
        .then(response => response.json())
        .then(data => {
            window.enchantsDatabase = data;
        });
}

function updateRaceSlotUI() {
    const raceSlot = document.querySelector('.gear-slot.gear-race');
    if (!raceSlot) return;
    const raceIcon = raceSlot.querySelector('.gear-icon');
    const raceName = raceSlot.querySelector('.gear-name');
    if (!raceIcon || !raceName) return;
    if (window.gearData && window.gearData.race && window.gearData.race.name) {
        const raceLower = window.gearData.race.name.toLowerCase();
        let raceImg = '../assets/gear-icon/empty.jpg';
        if (raceLower === 'human') raceImg = '../assets/gear-icon/race-human.jpg';
        else if (raceLower === 'dwarf') raceImg = '../assets/gear-icon/race-dwarf.jpg';
        else if (raceLower === 'high elf') raceImg = '../assets/gear-icon/race-highelf.jpg';
        raceIcon.style.backgroundImage = `url('${raceImg}')`;
        raceIcon.className = 'gear-icon equipped';
        raceName.textContent = window.gearData.race.name;
        raceName.className = 'gear-name quality-race';
        raceName.style.color = '#ffffff';
    } else {
        raceIcon.style.backgroundImage = `url('../assets/gear-icon/empty.jpg')`;
        raceIcon.className = 'gear-icon empty';
        raceName.textContent = 'Race';
        raceName.className = 'gear-name quality-common';
        raceName.style.color = '#ffffff';
    }
}

const miscStats = [ 'mp5', 'thorns', 'spellstrike' ];
const weaponSkillStats = [ 'maces', 'swords', 'axes', 'polearms', 'twohandedmaces', 'twohandedswords' ];
const resistanceStats = [ 'arcane', 'fire', 'frost', 'nature', 'shadow' ];

window.unequipAllGear = function() {
    const slots = [
        'helmet','neck','shoulders','cloak','chest','wrist','gloves','belt','pants','boots',
        'ring1','ring2','trinket1','trinket2','mainhand','offhand','libram'
    ];
    window.gearData = window.gearData || {};
    slots.forEach(slotType => {
        window.gearData[slotType] = { name: '', equipped: false };
        const slotEl = document.querySelector(`.gear-slot.gear-${slotType}`);
        if (slotEl) {
            const iconEl = slotEl.querySelector('.gear-icon');
            const nameEl = slotEl.querySelector('.gear-name');
            if (iconEl) {
                const baseType = (slotType === 'ring1' || slotType === 'ring2') ? 'ring'
                    : (slotType === 'trinket1' || slotType === 'trinket2') ? 'trinket'
                    : slotType;
                const emptyIconPath = `../assets/gear-icon/${baseType}-empty.jpg`;
                if (iconEl.tagName === 'IMG') {
                    iconEl.src = emptyIconPath;
                } else {
                    iconEl.style.backgroundImage = `url('${emptyIconPath}')`;
                }
                iconEl.className = 'gear-icon empty';
                iconEl.removeAttribute('data-quality');
                iconEl.style.border = '2px solid #ffffff';
            }
            if (nameEl) {
                const slotNames = {
                    helmet: 'Helmet', neck: 'Neck', shoulders: 'Shoulders', cloak: 'Cloak', chest: 'Chest', wrist: 'Wrist', gloves: 'Gloves', belt: 'Belt', pants: 'Pants', boots: 'Boots',
                    ring1: 'Ring 1', ring2: 'Ring 2', trinket1: 'Trinket 1', trinket2: 'Trinket 2', mainhand: 'Main Hand', offhand: 'Off Hand', libram: 'Libram', race: 'Race'
                };
                nameEl.textContent = slotNames[slotType] || slotType;
                nameEl.className = 'gear-name';
                nameEl.style.color = '#ffffff';
            }
        }
    });
    if (window.gearData.enchants) {
        window.gearData.enchants = {};
    }
    slots.forEach(slotType => {
        const slotEl = document.querySelector(`.gear-slot.gear-${slotType}`);
        if (slotEl) {
            const gearName = slotEl.querySelector('.gear-name');
            if (gearName) {
                const enchantDisplay = gearName.querySelector('.enchant-display');
                if (enchantDisplay) {
                    enchantDisplay.remove();
                }
            }
        }
    });
    window.gearData.race = null;
    updateRaceSlotUI();
    if (window.characterStats && typeof window.characterStats.updateAllStats === 'function') {
        window.characterStats.updateAllStats();
    }
    if (typeof window.updateCharacterStats === 'function') {
        window.updateCharacterStats();
    }
    if (typeof window.renderStatBlock === 'function' && window.characterStats && window.characterStats.currentStats) {
        window.renderStatBlock(window.characterStats.currentStats);
    }
    if (typeof window.updateAllDropdownStats === 'function') {
        window.updateAllDropdownStats();
    }
}

// Confirmation modal logic
document.addEventListener('DOMContentLoaded', function() {
    if (typeof window.renderStatBlock === 'function') {
        window.renderStatBlock({
            health: 0,
            mana: 0,
            armor: 0,
            stamina: 0,
            strength: 0,
            agility: 0,
            intellect: 0,
            spirit: 0,
            attackpower: 0,
            armorpen: 0,
            meleehit: 0,
            meleecrit: 0,
            meleehaste: 0,
            healingpower: 0,
            spellpower: 0,
            spellpen: 0,
            spellhit: 0,
            spellcrit: 0,
            spellhaste: 0,
            defense: 0,
            blockvalue: 0,
            block: 0,
            parry: 0,
            dodge: 0,
        });
    }

    // Wire up race slot to use the same item menu as other gear slots
    setTimeout(function() {
        const raceSlotIcon = document.querySelector('.gear-slot.gear-race .gear-icon');
        
        // Initialize race slot text using the centralized function
        updateRaceSlotUI();
        
        if (raceSlotIcon) {
            raceSlotIcon.onclick = function(e) {
                e.stopPropagation();
        // Ensure dropdown stats update after unequipping all gear
        if (typeof window.updateAllDropdownStats === 'function') {
            window.updateAllDropdownStats();
        }
                const parentSlot = raceSlotIcon.closest('.gear-slot');
                if (window.showItemMenu && window.getItemsForSlot) {
                    const items = window.getItemsForSlot('race');
                    window.showItemMenu(parentSlot, 'race', items);
                } else {
                    console.error('[ERROR] showItemMenu or getItemsForSlot functions not available');
                }
            };
        } else {
            console.error('[ERROR] Race slot icon not found in DOM');
        }
    }, 500);
    // Unequip All confirmation
    const unequipBtn = document.getElementById('unequip-all-btn');
    const confirmUnequipModal = document.getElementById('confirm-unequip-modal');
    const confirmUnequipYes = document.getElementById('confirm-unequip-yes');
    const confirmUnequipNo = document.getElementById('confirm-unequip-no');
    if (unequipBtn && confirmUnequipModal && confirmUnequipYes && confirmUnequipNo) {
        unequipBtn.onclick = function(e) {
            e.preventDefault();
            confirmUnequipModal.style.display = 'flex';
        };
        confirmUnequipYes.onclick = function() {
            confirmUnequipModal.style.display = 'none';
            if (typeof window.unequipAllGear === 'function') window.unequipAllGear();
        };
        confirmUnequipNo.onclick = function() {
            confirmUnequipModal.style.display = 'none';
        };
        // Close modal when clicking outside of it
        confirmUnequipModal.onclick = function(e) {
            if (e.target === confirmUnequipModal) {
                confirmUnequipModal.style.display = 'none';
            }
        };
    }

    // Delete Preset confirmation
    const deletePresetBtn = document.getElementById('delete-preset-btn');
    const confirmDeleteModal = document.getElementById('confirm-delete-modal');
    const confirmDeleteYes = document.getElementById('confirm-delete-yes');
    const confirmDeleteNo = document.getElementById('confirm-delete-no');
    if (deletePresetBtn && confirmDeleteModal) {
        deletePresetBtn.onclick = function(e) {
            e.preventDefault();
            confirmDeleteModal.style.display = 'flex';
        };
        confirmDeleteYes.onclick = function() {
            confirmDeleteModal.style.display = 'none';
            // Call your delete preset logic here
            if (typeof window.deletePreset === 'function') window.deletePreset();
        };
        confirmDeleteNo.onclick = function() {
            confirmDeleteModal.style.display = 'none';
        };
        // Close modal when clicking outside of it
        confirmDeleteModal.onclick = function(e) {
            if (e.target === confirmDeleteModal) {
                confirmDeleteModal.style.display = 'none';
            }
        };
    }

    // Save Preset functionality
    const savePresetBtn = document.getElementById('save-preset-btn');
    
    if (savePresetBtn) {
        // Function to create a completely new preset name modal
        function createNewPresetNameModal() {
            // Remove any existing preset name modals (including old ones with different IDs)
            const existingModals = document.querySelectorAll('[id*="preset-name-modal"]');
            existingModals.forEach(modal => modal.remove());
            
            // Force a complete DOM cleanup and wait
            setTimeout(() => {
                // Generate unique IDs to ensure fresh elements
                const timestamp = Date.now() + Math.random();
                const modalId = `preset-name-modal-${timestamp}`;
                const inputId = `preset-name-input-${timestamp}`;
                const okBtnId = `preset-name-ok-btn-${timestamp}`;
                const cancelBtnId = `preset-name-cancel-btn-${timestamp}`;
                const errorId = `preset-name-error-${timestamp}`;
                
                // Create modal container
                const modalContainer = document.createElement('div');
                modalContainer.id = modalId;
                modalContainer.style.cssText = 'display:flex; position:fixed; top:0; left:0; width:100vw; height:100vh; background:rgba(0,0,0,0.4); z-index:9999; align-items:center; justify-content:center;';
                
                // Create inner modal
                const innerModal = document.createElement('div');
                innerModal.style.cssText = 'background:#222; color:#ffd700; padding:32px 24px; border-radius:12px; box-shadow:0 2px 16px #000; min-width:300px; display:flex; flex-direction:column; align-items:center;';
                
                // Create title
                const title = document.createElement('div');
                title.textContent = 'Enter preset name:';
                title.style.cssText = 'font-size:18px; margin-bottom:16px;';
                
                // Create input wrapper
                const inputWrapper = document.createElement('div');
                inputWrapper.style.cssText = 'width:100%; position:relative;';
                
                // Create fresh input element - force Electron to treat this as completely new
                const input = document.createElement('input');
                input.id = inputId;
                input.type = 'text';
                input.value = ''; // Explicitly set empty value
                input.placeholder = 'Type preset name here...';
                input.style.cssText = 'width:100%; padding:8px; font-size:16px; margin-bottom:8px; border-radius:6px; border:1px solid #ffd700; background:#fff; color:#222; outline:none; box-sizing:border-box;';
                
                // Electron-specific: Force input to be editable
                input.readOnly = false;
                input.disabled = false;
                input.tabIndex = 0;
                
                // Create error div
                const errorDiv = document.createElement('div');
                errorDiv.id = errorId;
                errorDiv.textContent = 'Please give a name.';
                errorDiv.style.cssText = 'color:#ff4444; font-size:15px; margin-bottom:8px; display:none;';
                
                // Create button container
                const buttonContainer = document.createElement('div');
                buttonContainer.style.cssText = 'display:flex; gap:10px;';
                
                // Create OK button
                const okBtn = document.createElement('button');
                okBtn.id = okBtnId;
                okBtn.textContent = 'OK';
                okBtn.style.cssText = 'background:#ffd700; color:#222; font-weight:bold; padding:8px 24px; border:none; border-radius:6px; font-size:16px; cursor:pointer;';
                
                // Create Cancel button
                const cancelBtn = document.createElement('button');
                cancelBtn.id = cancelBtnId;
                cancelBtn.textContent = 'Cancel';
                cancelBtn.style.cssText = 'background:#8B0000; color:#ffd700; font-weight:bold; padding:8px 24px; border:none; border-radius:6px; font-size:16px; cursor:pointer;';
                
                // Assemble the modal
                inputWrapper.appendChild(input);
                buttonContainer.appendChild(okBtn);
                buttonContainer.appendChild(cancelBtn);
                innerModal.appendChild(title);
                innerModal.appendChild(inputWrapper);
                innerModal.appendChild(errorDiv);
                innerModal.appendChild(buttonContainer);
                modalContainer.appendChild(innerModal);
                
                // Add to DOM
                document.body.appendChild(modalContainer);
                
                // Function to close modal
                function closeModal() {
                    if (modalContainer && modalContainer.parentNode) {
                        modalContainer.parentNode.removeChild(modalContainer);
                    }
                }
                
                // Electron-specific input initialization
                setTimeout(() => {
                    if (input) {
                        // Clear any Electron cached state
                        input.value = '';
                        input.defaultValue = '';
                        
                        // Electron: Force webContents to recognize this as a new input
                        input.blur();
                        setTimeout(() => {
                            input.focus();
                            
                            // Test if input is actually working by trying to type
                            setTimeout(() => {
                                console.log('Input test - Can focus:', document.activeElement === input);
                                console.log('Input test - ReadOnly:', input.readOnly, 'Disabled:', input.disabled);
                                
                                // Force cursor to appear
                                if (document.activeElement === input) {
                                    input.setSelectionRange(0, 0);
                                }
                            }, 100);
                        }, 50);
                    }
                }, 100);
                
                // OK button handler
                okBtn.onclick = function() {
                    const presetName = input.value.trim();
                    if (!presetName) {
                        errorDiv.style.display = 'block';
                        input.focus();
                        return;
                    }
                    closeModal();
                    // Call save preset logic without reopening modal
                    if (typeof window.savePreset === 'function') {
                        window.savePreset(presetName).then(function() {
                            // Don't reopen modal after saving - just close
                            console.log('Preset saved successfully');
                        }).catch(function(error) {
                            console.error('Error saving preset:', error);
                        });
                    }
                };
                
                // Cancel button handler
                cancelBtn.onclick = closeModal;
                
                // Close on backdrop click
                modalContainer.onclick = function(e) {
                    if (e.target === modalContainer) {
                        closeModal();
                    }
                };
                
                // Keyboard handlers
                input.onkeydown = function(e) {
                    if (e.key === 'Enter') {
                        okBtn.click();
                    } else if (e.key === 'Escape') {
                        closeModal();
                    }
                };
                
                // Clear error when typing
                input.oninput = function() {
                    if (errorDiv.style.display === 'block') {
                        errorDiv.style.display = 'none';
                    }
                };
                
            }, 50); // Delay to ensure complete cleanup
        }        // Save button click handler
        savePresetBtn.onclick = function(e) {
            e.preventDefault();
            createNewPresetNameModal();
        };
    }

    // Load Preset functionality
    const loadPresetBtn = document.getElementById('load-preset-btn');
    const presetDropdown = document.getElementById('preset-dropdown');
    
    if (loadPresetBtn && presetDropdown) {
        loadPresetBtn.onclick = function(e) {
            e.preventDefault();
            const selectedPreset = presetDropdown.value;
            if (!selectedPreset) {
                console.log('No preset selected to load.');
                return;
            }
            // Call load preset logic
            if (typeof window.loadPreset === 'function') {
                window.loadPreset(selectedPreset);
            }
        };
    }

    // Initialize StatBreakdown once
    if (window.StatBreakdown && typeof window.StatBreakdown === 'function' && !window.statBreakdown) {
        window.statBreakdown = new window.StatBreakdown();
        window.statBreakdown.initialize();
    }

    // Load preset list on page load
    if (typeof window.loadPresetList === 'function') {
        window.loadPresetList();
    }

    // Force stat block and dropdowns to render base stats on page load
    if (typeof window.updateCharacterStats === 'function') {
        window.updateCharacterStats();
        if (typeof updateAllDropdownStats === 'function') updateAllDropdownStats();
    }

    // Function to wire up stat name click events
    function wireStatNameClicks() {
        // Attach click event to all .stat-name elements in stat block and dropdowns
        document.querySelectorAll('.stat-name').forEach(function(statNameEl) {
            statNameEl.classList.add('stat-name-clickable');
            statNameEl.style.cursor = 'pointer';
            var statKey = statNameEl.getAttribute('data-stat') || statNameEl.textContent.trim().toLowerCase().replace(/\s+/g, '');
            statNameEl.setAttribute('data-stat', statKey);
            statNameEl.onclick = function(e) {
                e.stopPropagation();
                if (window.statBreakdown && typeof window.statBreakdown.showStatBreakdown === 'function') {
                    window.statBreakdown.showStatBreakdown(statKey);
                }
            };
        });
    }

        function getStatDisplayName(statKey) {
            const names = {
                mp5: 'MP5', armorpen: 'Armor Penetration', spellpen: 'Spell Penetration', thorns: 'Thorns', spellstrike: 'Spellstrike',
                maces: 'Maces', swords: 'Swords', axes: 'Axes', polearms: 'Polearms', twohandedmaces: '2H Maces', twohandedswords: '2H Swords', defense: 'Defense',
                arcane: 'Arcane Resist', fire: 'Fire Resist', frost: 'Frost Resist', nature: 'Nature Resist', shadow: 'Shadow Resist'
            };
            return names[statKey] || statKey;
        }

        function renderDropdownStats(dropdownId, statKeys) {
            const dropdown = document.getElementById(dropdownId);
            if (!dropdown) return;
            const content = dropdown.querySelector('.stat-dropdown-content');
            if (!content) return;
            content.innerHTML = '';
            // Always start with 0 for all stats until race/gear is equipped
            statKeys.forEach(function(statKey) {
                // Always show the aggregated stat value from characterStats.currentStats
                let value = 0;
                if (window.characterStats && window.characterStats.currentStats) {
                    if (typeof window.characterStats.currentStats[statKey] !== 'undefined') {
                        value = window.characterStats.currentStats[statKey];
                    } else if (["fire","frost","nature","arcane","shadow"].includes(statKey)) {
                        // For resistances, check multiple possible key formats
                        const possibleKeys = [
                            statKey + "res",                    // fireres
                            statKey + "Resistance",             // fireResistance
                            statKey + "resistance"              // fireresistance
                        ];
                        for (const key of possibleKeys) {
                            if (typeof window.characterStats.currentStats[key] !== 'undefined') {
                                value = window.characterStats.currentStats[key];
                                break;
                            }
                        }
                    } else if (statKey === 'mp5') {
                        // Calculate MP5 using exact same logic as StatBreakdown
                        value = 0;
                        
                        // MP5 from spirit conversion
                        const currentSpirit = window.characterStats.currentStats.spirit || 0;
                        if (currentSpirit > 0 && typeof window.calculateMP5FromSpirit === 'function') {
                            const mp5FromSpirit = window.calculateMP5FromSpirit(currentSpirit);
                            value += mp5FromSpirit;
                        }
                        
                        // MP5 from gear (with conversion formula)
                        if (window.characterStats && window.characterStats.equippedItems) {
                            Object.values(window.characterStats.equippedItems).forEach(item => {
                                if (item && item.mp5) {
                                    const convertedMP5 = Math.round(Number(item.mp5) * 2 / 5);
                                    value += convertedMP5;
                                }
                            });
                        }
                        
                        // MP5 from enchants (with conversion formula)
                        if (window.gearData && window.gearData.enchants) {
                            Object.entries(window.gearData.enchants).forEach(([slot, enchant]) => {
                                if (enchant && enchant.mp5 && Number(enchant.mp5) > 0) {
                                    const convertedMP5 = Math.round(Number(enchant.mp5) * 2 / 5);
                                    value += convertedMP5;
                                }
                            });
                        }
                        
                    } else if (statKey === 'thorns') {
                        // Sum all element-specific thorns values
                        const elements = ['arcane', 'fire', 'frost', 'nature', 'shadow'];
                        elements.forEach(element => {
                            const thornsStat = element + 'thorns';
                            if (window.characterStats.currentStats[thornsStat]) {
                                value += window.characterStats.currentStats[thornsStat];
                            }
                        });
                    } else if (statKey === 'spellstrike') {
                        // Sum all element-specific spellstrike values
                        const elements = ['arcane', 'fire', 'frost', 'nature', 'shadow'];
                        elements.forEach(element => {
                            const spellstrikeStat = element + 'spellstrike';
                            if (window.characterStats.currentStats[spellstrikeStat]) {
                                value += window.characterStats.currentStats[spellstrikeStat];
                            }
                        });
                    }
                }
                const row = document.createElement('div');
                row.className = 'stat-row';
                const nameDiv = document.createElement('div');
                nameDiv.className = 'stat-name';
                nameDiv.textContent = getStatDisplayName(statKey);
                const valueDiv = document.createElement('div');
                valueDiv.className = 'stat-value';
                valueDiv.textContent = value;
                row.appendChild(nameDiv);
                row.appendChild(valueDiv);
                content.appendChild(row);
            });
        }

        function updateAllDropdownStats() {
            renderDropdownStats('misc-stats-dropdown', miscStats);
            renderDropdownStats('weapon-skill-dropdown', weaponSkillStats);
            renderDropdownStats('resistances-dropdown', resistanceStats);
        }

        // Make updateAllDropdownStats globally available
        window.updateAllDropdownStats = updateAllDropdownStats;

        // Make toggleDropdown globally available for inline HTML onclick
        window.toggleDropdown = function(dropdownId) {
            var dropdown = document.getElementById(dropdownId);
            if (!dropdown) {
                return;
            }
            var content = dropdown.querySelector('.stat-dropdown-content');
            if (!content) {
                return;
            }
            // Toggle display
            if (content.style.display === '' || content.style.display === 'none') {
                content.style.display = 'block';
            } else {
                content.style.display = 'none';
            }
            // Optionally rotate arrow
            var arrow = dropdown.querySelector('.dropdown-arrow');
            if (arrow) {
                arrow.style.transform = (content.style.display === 'block') ? 'rotate(180deg)' : 'rotate(0deg)';
            }
        }

        // Initial render
        updateAllDropdownStats();
        wireDropdownHeaderClicks();
        // Remove inline onclick attributes if present and wire up via JS
        document.querySelectorAll('.stat-dropdown-header').forEach(function(header) {
            header.removeAttribute('onclick');
        });

        // Ensure dropdown headers are always clickable after dropdowns are rendered
        function wireDropdownHeaderClicks() {
            document.querySelectorAll('.stat-dropdown-header').forEach(function(header) {
                header.onclick = function(e) {
                    e.stopPropagation();
                    const parent = header.closest('.stat-dropdown');
                    if (parent && parent.id) {
                        window.toggleDropdown(parent.id);
                    }
                };
            });
        }

        // Update stat block and dropdowns whenever stats are updated
        if (typeof window.updateCharacterStats === 'function') {
            const origUpdate = window.updateCharacterStats;
            window.updateCharacterStats = function() {
                origUpdate();
                if (typeof window.renderStatBlock === 'function' && window.characterStats && window.characterStats.currentStats) {
                    window.renderStatBlock(window.characterStats.currentStats);
                }
                updateAllDropdownStats();
                wireDropdownHeaderClicks();
                // Always update race slot UI when stats are updated
                updateRaceSlotUI();
            };
        }

    // Wire up stat name clicks after initial load
    setTimeout(wireStatNameClicks, 500);

    // Re-wire stat name clicks whenever stats are updated
    if (typeof window.updateCharacterStats === 'function') {
        const origUpdateCharacterStats = window.updateCharacterStats;
        window.updateCharacterStats = function() {
            origUpdateCharacterStats.apply(this, arguments);
            wireStatNameClicks();
        };
    }

    // DEBUG: DOMContentLoaded fired in main.js
    console.log('[DEBUG] DOMContentLoaded fired in main.js');
    const gearSlots = document.querySelectorAll('.gear-slot');
    console.log('[DEBUG] [main.js] Number of gear slots found:', gearSlots.length, gearSlots);
    
    // Initialize enchant displays for all slots
    setTimeout(function() {
        const slotsWithEnchants = ['helmet', 'neck', 'shoulders', 'cloak', 'chest', 'wrist', 'gloves', 'belt', 'pants', 'boots', 'ring1', 'ring2', 'mainhand', 'offhand'];
        slotsWithEnchants.forEach(slotType => {
            updateSlotEnchantDisplay(slotType);
        });
    }, 1000); // Wait for gear data to load
});

console.log('[DEBUG] main.js script loaded');

// Delete preset logic
window.deletePreset = async function() {
    // Get selected preset name from dropdown or UI
    let presetDropdown = document.querySelector('.preset-dropdown');
    if (!presetDropdown) {
        console.log('No preset selected.');
        return;
    }
    let presetName = presetDropdown.value;
    if (!presetName || presetName.trim() === '') {
        console.log('No preset selected.');
        return;
    }

    // Use IPC to delete preset file
    if (window.safeIpcInvoke) {
        try {
            await window.safeIpcInvoke('delete-preset', presetName);
            console.log('Preset deleted: ' + presetName);
            // Refresh preset list to update UI
            if (typeof window.loadPresetList === 'function') {
                await window.loadPresetList();
            }
        } catch (err) {
            console.error('Failed to delete preset: ' + err);
        }
    } else {
        console.error('IPC not available. Cannot delete preset.');
    }
}

// Save current gear setup as a preset
window.savePreset = async function(presetName) {
    console.log('[DEBUG] savePreset called with name:', presetName);
    if (!presetName || presetName.trim() === '') {
        console.log('Please provide a preset name.');
        return;
    }

    // Collect current gear data
    const presetData = {
        gearData: window.gearData || {},
        timestamp: new Date().toISOString()
    };
    
    console.log('[DEBUG] presetData to save:', presetData);

    // Use IPC to save preset file
    if (window.safeIpcInvoke) {
        try {
            console.log('[DEBUG] Calling safeIpcInvoke save-preset');
            const result = await window.safeIpcInvoke('save-preset', presetName, presetData);
            console.log('[DEBUG] save-preset result:', result);
            if (result.success) {
                console.log('Preset saved: ' + presetName);
                // Optionally refresh preset list here
                await loadPresetList();
            } else {
                console.error('Failed to save preset: ' + (result.error || 'Unknown error'));
            }
        } catch (err) {
            console.error('Failed to save preset: ' + err);
        }
    } else {
        console.error('IPC not available. Cannot save preset.');
    }
}

// Load a preset and apply it to current gear
window.loadPreset = async function(presetName) {
    if (!presetName || presetName.trim() === '') {
        alert('Please select a preset to load.');
        return;
    }

    // Use IPC to load preset data
    if (window.safeIpcInvoke) {
        try {
            const presetData = await window.safeIpcInvoke('load-preset-data', presetName);
            if (presetData && presetData.gearData) {
                // Apply the loaded gear data
                window.gearData = presetData.gearData;
                
                // Update all gear slot UIs
                updateAllGearSlots();
                
                // Update stats
                if (window.characterStats && typeof window.characterStats.updateAllStats === 'function') {
                    window.characterStats.updateAllStats();
                }
                if (typeof window.updateCharacterStats === 'function') {
                    window.updateCharacterStats();
                }
                if (typeof window.renderStatBlock === 'function' && window.characterStats && window.characterStats.currentStats) {
                    window.renderStatBlock(window.characterStats.currentStats);
                }
                if (typeof window.updateAllDropdownStats === 'function') {
                    window.updateAllDropdownStats();
                }
                
                alert('Preset loaded: ' + presetName);
            } else {
                alert('Invalid preset data.');
            }
        } catch (err) {
            alert('Failed to load preset: ' + err);
        }
    } else {
        alert('IPC not available. Cannot load preset.');
    }
}

// Load preset list into dropdown
window.loadPresetList = async function() {
    const presetDropdown = document.getElementById('preset-dropdown');
    if (!presetDropdown) return;
    
    if (window.safeIpcInvoke) {
        try {
            const presets = await window.safeIpcInvoke('load-presets');
            
            // Clear existing options
            presetDropdown.innerHTML = '<option value="">Select a preset...</option>';
            
            // Add preset options
            presets.forEach(presetName => {
                const option = document.createElement('option');
                option.value = presetName;
                option.textContent = presetName;
                presetDropdown.appendChild(option);
            });
        } catch (err) {
            console.error('Failed to load preset list:', err);
        }
    }
}

// Function to update all gear slot UIs after loading a preset
function updateAllGearSlots() {
    const slots = [
        'helmet','neck','shoulders','cloak','chest','wrist','gloves','belt','pants','boots',
        'ring1','ring2','trinket1','trinket2','mainhand','offhand','libram'
    ];
    
    slots.forEach(slotType => {
        const gearItem = window.gearData[slotType];
        if (gearItem && gearItem.equipped && gearItem.name) {
            // Item is equipped, update UI to show equipped state
            window.equipItem(slotType, gearItem);
        } else {
            // Item is not equipped, update UI to show empty state
            window.equipItem(slotType, { name: '' });
        }
    });
    
    // Handle race slot separately
    updateRaceSlotUI();
}

// GLOBAL EQUIP ITEM FUNCTION
// window.gearData is a global object that stores currently equipped items for each slot.
// It is initialized at the bottom of this file and updated by equipItem and unequipAllGear.
window.equipItem = function(slotType, item) {
    const slot = document.querySelector(`.gear-slot[data-slot="${slotType}"]`) || document.querySelector(`.gear-slot.gear-${slotType}`);
    // Remove the item popup menu if present
    if (typeof removeItemMenu === 'function') removeItemMenu();
    if (!slot) return;

    let icon = slot.querySelector('.gear-icon');
    let name = slot.querySelector('.gear-name');

    // Ensure .gear-icon exists
    if (!icon) {
        icon = document.createElement('img');
        icon.className = 'gear-icon empty';
        slot.appendChild(icon);
    }
    // Ensure .gear-name exists
    if (!name) {
        name = document.createElement('div');
        name.className = 'gear-name';
        slot.appendChild(name);
    }


    // Special handling for race slot
    if (slotType === 'race') {
        console.log('[DEBUG] equipItem called for race slot');
        console.log('[DEBUG] Race item:', item);
        
        if (item && item.name) {
            console.log('[DEBUG] Equipping race:', item.name);
            // Store the race data so it persists through updates
            window.gearData.race = { 
                ...item, 
                equipped: true,
                _persistName: item.name // Add a special field to preserve the name
            };
            console.log('[DEBUG] window.gearData.race set to:', window.gearData.race);
        } else {
            console.log('[DEBUG] Clearing race slot');
            window.gearData.race = null;
        }
        
        // Use the centralized function to update race slot UI
        console.log('[DEBUG] Calling updateRaceSlotUI()');
        updateRaceSlotUI();
        
        // Update stats
        if (typeof window.updateCharacterStats === 'function') window.updateCharacterStats();
        if (window.characterStats && window.characterStats.currentStats && typeof window.renderStatBlock === 'function') window.renderStatBlock(window.characterStats.currentStats);
        if (typeof updateAllDropdownStats === 'function') updateAllDropdownStats();
        return;
    }

        // Helper for slot asset name
        const baseType = (slotType === 'ring1' || slotType === 'ring2') ? 'ring'
            : (slotType === 'trinket1' || slotType === 'trinket2') ? 'trinket'
            : slotType;

        if (item && item.name === '') {
            // Unequip: reset icon and name to empty state
            const emptyIconPath = `../assets/gear-icon/${baseType}-empty.jpg`;
            if (icon.tagName === 'IMG') {
                icon.src = emptyIconPath;
            } else {
                icon.style.backgroundImage = `url('${emptyIconPath}')`;
            }
            icon.className = 'gear-icon empty';
            icon.removeAttribute('data-quality');
            icon.style.border = '2px solid #ffffff'; // Always white for empty
            // Reset gear name to default slot name
            const slotNames = {
                helmet: 'Helmet', neck: 'Neck', shoulders: 'Shoulders', cloak: 'Cloak', chest: 'Chest', wrist: 'Wrist', gloves: 'Gloves', belt: 'Belt', pants: 'Pants', boots: 'Boots',
                ring1: 'Ring 1', ring2: 'Ring 2', trinket1: 'Trinket 1', trinket2: 'Trinket 2', mainhand: 'Main Hand', offhand: 'Off Hand', libram: 'Libram', race: 'Race'
            };
            name.textContent = slotNames[slotType] || slotType;
            name.className = 'gear-name';
            name.style.color = '#ffffff';
            // Reset gearData for slot
            window.gearData[slotType] = { name: '', equipped: false };
            // If unequipping race, also set gearData.race to null
            if (slotType === 'race') {
                window.gearData.race = null;
            }
            // Force stat update and stat block re-render
            if (window.characterStats && typeof window.characterStats.updateAllStats === 'function') {
                window.characterStats.updateAllStats();
            }
            if (typeof window.updateCharacterStats === 'function') {
                window.updateCharacterStats();
            }
            if (typeof window.renderStatBlock === 'function' && window.characterStats && window.characterStats.currentStats) {
                window.renderStatBlock(window.characterStats.currentStats);
            }
            if (typeof window.updateAllDropdownStats === 'function') {
                window.updateAllDropdownStats();
            }
            return;
        } else if (item && item.name) {
            const equippedIconPath = `../assets/gear-icon/${baseType}-equipped.jpg`;
            if (icon.tagName === 'IMG') {
                icon.src = equippedIconPath;
            } else {
                icon.style.backgroundImage = `url('${equippedIconPath}')`;
            }
            icon.className = 'gear-icon equipped';
            icon.setAttribute('data-quality', item.quality || '');
            // Set border color based on item quality
            let borderColor = '#cccccc'; // Default to gray for common
            if (item.quality === 2) borderColor = '#1eff00'; // Uncommon
            else if (item.quality === 3) borderColor = '#0070dd'; // Rare
            else if (item.quality === 4) borderColor = '#a335ee'; // Epic
            else if (item.quality === 5) borderColor = '#ff8000'; // Legendary
            icon.style.border = `2px solid ${borderColor}`;
            name.textContent = item.name || '';
            // Set gear name color class based on quality
            let qualityClass = '';
            if (item.quality === 2) qualityClass = 'quality-uncommon';
            else if (item.quality === 3) qualityClass = 'quality-rare';
            else if (item.quality === 4) qualityClass = 'quality-epic';
            else if (item.quality === 5) qualityClass = 'quality-legendary';
            else qualityClass = 'quality-common';
            name.className = `gear-name ${qualityClass}`;
            name.style.color = '';
    }
        // Map slotType to base asset name for rings/trinkets
        function getBaseSlotType(type) {
            if (type === 'ring1' || type === 'ring2') return 'ring';
            if (type === 'trinket1' || type === 'trinket2') return 'trinket';
            return type;
        }

        if (item && item.name === '') {
            // Unequip: reset icon and name to empty state
            if (icon) {
                let emptyIconPath;
                if (slotType === 'race') {
                    emptyIconPath = '../assets/gear-icon/empty.jpg';
                } else {
                    const baseType = getBaseSlotType(slotType);
                    emptyIconPath = `../assets/gear-icon/${baseType}-empty.jpg`;
                }
                if (icon.tagName === 'IMG') {
                    icon.src = emptyIconPath;
                } else {
                    icon.style.backgroundImage = `url('${emptyIconPath}')`;
                }
                icon.className = 'gear-icon empty';
                icon.removeAttribute('data-quality');
                // Remove border
                icon.style.border = '';
            }
            // For race slot, clear the name
            if (slotType === 'race' && name) {
                name.textContent = '';
                name.className = 'gear-name quality-common';
            }
        } else {
            if (icon) {
                const baseType = getBaseSlotType(slotType);
                const equippedIconPath = `../assets/gear-icon/${baseType}-equipped.jpg`;
                if (icon.tagName === 'IMG') {
                    icon.src = equippedIconPath;
                } else {
                    icon.style.backgroundImage = `url('${equippedIconPath}')`;
                }
                icon.className = 'gear-icon equipped';
                // Set border color based on item quality
                let borderColor = '';
                if (item.quality) {
                    switch (item.quality) {
                        case 2: borderColor = '#1eff00'; break; // Uncommon
                        case 3: borderColor = '#0070dd'; break; // Rare
                        case 4: borderColor = '#a335ee'; break; // Epic
                        case 5: borderColor = '#ff8000'; break; // Legendary
                        default: borderColor = '';
                    }
                }
                icon.style.border = borderColor ? `2px solid ${borderColor}` : '';
                if (item.quality) {
                    icon.setAttribute('data-quality', item.quality);
                } else {
                    icon.removeAttribute('data-quality');
                }
            }
            if (name) {
                name.textContent = item.name || '';
                // Set gear name color class based on quality
                let qualityClass = '';
                switch (item.quality) {
                    case 2: qualityClass = 'quality-uncommon'; break;
                    case 3: qualityClass = 'quality-rare'; break;
                    case 4: qualityClass = 'quality-epic'; break;
                    case 5: qualityClass = 'quality-legendary'; break;
                    default: qualityClass = 'quality-common';
                }
                name.className = `gear-name ${qualityClass}`;
            }
        }
    // window.gearData is initialized globally below
    if (!window.gearData) window.gearData = {};
    
    // Handle two-handed weapon auto-unequip logic
    if (item && item.name && item.name !== '' && slotType === 'mainhand') {
        // Check if the item being equipped is a two-handed weapon
        if (isTwoHandedWeapon(item)) {
            // Check if there's an offhand item equipped
            const offhandData = window.gearData.offhand;
            if (offhandData && offhandData.name && offhandData.name !== '') {
                console.log(`[DEBUG] Auto-unequipping ${offhandData.name} to equip two-handed weapon ${item.name}`);
                
                // Auto-unequip the offhand
                window.equipItem('offhand', { name: '', equipped: false });
                
                // Show notification
                alert(`${offhandData.name} was automatically unequipped to make room for the two-handed weapon ${item.name}.`);
            }
        }
    }
    
    if (item && item.name && item.name !== '') {
        window.gearData[slotType] = { ...item, equipped: true };
    } else {
        window.gearData[slotType] = { name: '', equipped: false };
        // If unequipping race, just call stat update and UI refresh functions
        if (slotType === 'race') {
            if (typeof window.updateCharacterStats === 'function') window.updateCharacterStats();
            if (typeof window.renderStatBlock === 'function' && window.characterStats && window.characterStats.currentStats) window.renderStatBlock(window.characterStats.currentStats);
            if (typeof updateAllDropdownStats === 'function') updateAllDropdownStats();
        }
    }
    if (window.characterStats && typeof window.characterStats.updateAllStats === 'function') {
        window.characterStats.updateAllStats();
    }
    if (window.characterStats && window.characterStats.currentStats && typeof window.renderStatBlock === 'function') {
        window.renderStatBlock(window.characterStats.currentStats);
    }
    
    // Update enchant display for this slot
    updateSlotEnchantDisplay(slotType);
    // Ensure dropdown stats update after equipping/unequipping
    if (typeof window.updateAllDropdownStats === 'function') {
        window.updateAllDropdownStats();
    }
}

// Use IPC for file operations instead of direct fs access
let ipcRenderer = null;
if (window.require) {
    try {
        ipcRenderer = window.require('electron').ipcRenderer;
    } catch (e) {
        ipcRenderer = null;
    }
}

function safeIpcInvoke(channel, ...args) {
    if (ipcRenderer && typeof ipcRenderer.invoke === 'function') {
        return ipcRenderer.invoke(channel, ...args);
    } else {
        alert('Error: IPC is not available. Please run this app via Electron.');
        return Promise.reject('IPC not available');
    }
}

// Expose safeIpcInvoke to window for use in preset functions
window.safeIpcInvoke = safeIpcInvoke;



// Initialize global variables
// window.gearData is initialized here as a global object for equipped items
window.gearData = window.gearData || {};

// Function to equip enchants
window.equipEnchant = function(slotType, enchant) {
    // Remove the item popup menu if present
    if (typeof removeItemMenu === 'function') removeItemMenu();
    
    // Initialize enchants in gearData if not exists
    if (!window.gearData.enchants) {
        window.gearData.enchants = {};
    }
    
    if (enchant && enchant.name && enchant.name !== '') {
        window.gearData.enchants[slotType] = { ...enchant, equipped: true };
    } else {
        // Unequip enchant
        if (window.gearData.enchants[slotType]) {
            delete window.gearData.enchants[slotType];
        }
    }
    
    // Update the gear slot UI to show enchant
    updateSlotEnchantDisplay(slotType);
    
    // Force stat update and stat block re-render
    if (window.characterStats && typeof window.characterStats.updateAllStats === 'function') {
        window.characterStats.updateAllStats();
    }
    if (typeof window.updateCharacterStats === 'function') {
        window.updateCharacterStats();
    }
    if (typeof window.renderStatBlock === 'function' && window.characterStats && window.characterStats.currentStats) {
        window.renderStatBlock(window.characterStats.currentStats);
    }
    if (typeof window.updateAllDropdownStats === 'function') {
        window.updateAllDropdownStats();
    }
}

// Function to update slot display with enchant info
function updateSlotEnchantDisplay(slotType) {
    const slot = document.querySelector(`.gear-slot[data-slot="${slotType}"]`) || document.querySelector(`.gear-slot.gear-${slotType}`);
    if (!slot) return;
    
    const gearName = slot.querySelector('.gear-name');
    if (!gearName) return;
    
    // Remove existing enchant display
    const existingEnchant = gearName.querySelector('.enchant-display');
    if (existingEnchant) {
        existingEnchant.remove();
    }
    
    // Add enchant display if enchant is equipped
    if (window.gearData.enchants && window.gearData.enchants[slotType]) {
        const enchant = window.gearData.enchants[slotType];
        const enchantDiv = document.createElement('div');
        enchantDiv.className = 'enchant-display';
        enchantDiv.style.color = '#1eff00'; // Green text
        enchantDiv.style.fontSize = '11px';
        enchantDiv.style.fontStyle = 'italic';
        enchantDiv.style.marginTop = '2px';
        enchantDiv.style.lineHeight = '1.2';
        enchantDiv.style.wordWrap = 'break-word';
        enchantDiv.style.whiteSpace = 'normal';
        enchantDiv.style.overflowWrap = 'break-word';
        
        // Format enchant stats for display
        const statsText = getEnchantStatsText(enchant);
        enchantDiv.textContent = statsText;
        gearName.appendChild(enchantDiv);
    }
}

// Helper function to format enchant stats for display
function getEnchantStatsText(enchant) {
    if (!enchant || !enchant.stats) return 'No stats';
    
    const stats = enchant.stats;
    const statStrings = [];
    
    // Define stat order for display
    const statOrder = [
        'armor', 'health', 'mana',
        'stamina', 'spirit', 'strength', 'agility', 'intellect',
        'attackpower', 'armorpen', 'meleehit', 'meleecrit', 'meleehaste',
        'healingpower', 'spellpower', 'spellpen', 'spellhit', 'spellcrit', 'spellhaste',
        'defense', 'blockvalue', 'block', 'parry', 'dodge',
        'mp5', 'thorns', 'spellstrike'
    ];
    
    // Get stat name formatting function (use the one from itemmenu.js)
    const formatStatName = window.formatStatName || function(stat) {
        // Fallback formatting if formatStatName is not available
        return stat.charAt(0).toUpperCase() + stat.slice(1).replace(/([A-Z])/g, ' $1');
    };
    
    // Display stats in order
    statOrder.forEach(stat => {
        if (stats[stat] !== undefined && stats[stat] !== 0) {
            statStrings.push(`+${stats[stat]} ${formatStatName(stat)}`);
        }
    });
    
    return statStrings.join(', ') || 'No stats';
}

// Helper function to check if an item is a two-handed weapon
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


    // CRIT CALCULATION HELPERS
    function getCritFromAgi(agility, critFromGear = 0, critFromBuffs = 0, critFromTalents = 0) {
        const critFromAgility = (agility * 0.0614) / (1 + agility / 1406.1);
        return critFromAgility + critFromGear + critFromBuffs + critFromTalents;
    }

    function calculateCritFromGear() {
        const equippedItems = Object.values(window.gearData || {});
        let totalCrit = 0;
        equippedItems.forEach(item => {
            if (item.stats && item.stats.meleecrit) {
                totalCrit += Number(item.stats.meleecrit);
            }
        });
        return totalCrit;
    }