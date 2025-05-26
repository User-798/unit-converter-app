// Unit Converter Application JavaScript

// DOM Elements
const categorySelect = document.getElementById('category-select');
const fromUnitSelect = document.getElementById('from-unit');
const toUnitSelect = document.getElementById('to-unit');
const fromValueInput = document.getElementById('from-value');
const toValueInput = document.getElementById('to-value');
const swapButton = document.getElementById('swap-units');
const formulaText = document.getElementById('formula-text');
const quickConversionList = document.getElementById('quick-conversion-list');
const historyList = document.getElementById('history-list');
const clearHistoryButton = document.getElementById('clear-history');
const themeToggle = document.getElementById('theme-toggle-checkbox');

// Unit Definitions
const unitData = {
    length: {
        name: 'Length',
        icon: 'fa-ruler',
        units: {
            meter: { name: 'Meter (m)', factor: 1 },
            kilometer: { name: 'Kilometer (km)', factor: 1000 },
            centimeter: { name: 'Centimeter (cm)', factor: 0.01 },
            millimeter: { name: 'Millimeter (mm)', factor: 0.001 },
            micrometer: { name: 'Micrometer (μm)', factor: 0.000001 },
            nanometer: { name: 'Nanometer (nm)', factor: 1e-9 },
            mile: { name: 'Mile (mi)', factor: 1609.344 },
            yard: { name: 'Yard (yd)', factor: 0.9144 },
            foot: { name: 'Foot (ft)', factor: 0.3048 },
            inch: { name: 'Inch (in)', factor: 0.0254 },
            nauticalMile: { name: 'Nautical Mile (nmi)', factor: 1852 }
        }
    },
    mass: {
        name: 'Mass/Weight',
        icon: 'fa-weight-hanging',
        units: {
            kilogram: { name: 'Kilogram (kg)', factor: 1 },
            gram: { name: 'Gram (g)', factor: 0.001 },
            milligram: { name: 'Milligram (mg)', factor: 0.000001 },
            metricTon: { name: 'Metric Ton (t)', factor: 1000 },
            pound: { name: 'Pound (lb)', factor: 0.45359237 },
            ounce: { name: 'Ounce (oz)', factor: 0.028349523125 },
            stone: { name: 'Stone (st)', factor: 6.35029318 },
            ton: { name: 'US Ton (ton)', factor: 907.18474 }
        }
    },
    temperature: {
        name: 'Temperature',
        icon: 'fa-temperature-half',
        units: {
            celsius: { name: 'Celsius (°C)', factor: 1 },
            fahrenheit: { name: 'Fahrenheit (°F)', factor: 1 },
            kelvin: { name: 'Kelvin (K)', factor: 1 }
        },
        // Special conversion functions for temperature
        convert: function(value, fromUnit, toUnit) {
            if (fromUnit === toUnit) return value;
            
            // Convert to Celsius first
            let celsius;
            if (fromUnit === 'celsius') {
                celsius = value;
            } else if (fromUnit === 'fahrenheit') {
                celsius = (value - 32) * 5/9;
            } else if (fromUnit === 'kelvin') {
                celsius = value - 273.15;
            }
            
            // Convert from Celsius to target unit
            if (toUnit === 'celsius') {
                return celsius;
            } else if (toUnit === 'fahrenheit') {
                return (celsius * 9/5) + 32;
            } else if (toUnit === 'kelvin') {
                return celsius + 273.15;
            }
        },
        getFormula: function(fromUnit, toUnit) {
            if (fromUnit === toUnit) return 'No conversion needed';
            
            const formulas = {
                'celsius-fahrenheit': '°F = (°C × 9/5) + 32',
                'celsius-kelvin': 'K = °C + 273.15',
                'fahrenheit-celsius': '°C = (°F - 32) × 5/9',
                'fahrenheit-kelvin': 'K = (°F - 32) × 5/9 + 273.15',
                'kelvin-celsius': '°C = K - 273.15',
                'kelvin-fahrenheit': '°F = (K - 273.15) × 9/5 + 32'
            };
            
            return formulas[`${fromUnit}-${toUnit}`] || 'Custom conversion';
        }
    },
    area: {
        name: 'Area',
        icon: 'fa-vector-square',
        units: {
            squareMeter: { name: 'Square Meter (m²)', factor: 1 },
            squareKilometer: { name: 'Square Kilometer (km²)', factor: 1000000 },
            squareCentimeter: { name: 'Square Centimeter (cm²)', factor: 0.0001 },
            squareMillimeter: { name: 'Square Millimeter (mm²)', factor: 0.000001 },
            squareMile: { name: 'Square Mile (mi²)', factor: 2589988.11 },
            squareYard: { name: 'Square Yard (yd²)', factor: 0.83612736 },
            squareFoot: { name: 'Square Foot (ft²)', factor: 0.09290304 },
            squareInch: { name: 'Square Inch (in²)', factor: 0.00064516 },
            acre: { name: 'Acre (ac)', factor: 4046.8564224 },
            hectare: { name: 'Hectare (ha)', factor: 10000 }
        }
    },
    volume: {
        name: 'Volume',
        icon: 'fa-cube',
        units: {
            cubicMeter: { name: 'Cubic Meter (m³)', factor: 1 },
            liter: { name: 'Liter (L)', factor: 0.001 },
            milliliter: { name: 'Milliliter (mL)', factor: 0.000001 },
            cubicCentimeter: { name: 'Cubic Centimeter (cm³)', factor: 0.000001 },
            cubicFoot: { name: 'Cubic Foot (ft³)', factor: 0.028316846592 },
            cubicInch: { name: 'Cubic Inch (in³)', factor: 0.000016387064 },
            usGallon: { name: 'US Gallon (gal)', factor: 0.003785411784 },
            usQuart: { name: 'US Quart (qt)', factor: 0.000946352946 },
            usPint: { name: 'US Pint (pt)', factor: 0.000473176473 },
            usFluidOunce: { name: 'US Fluid Ounce (fl oz)', factor: 0.0000295735296 },
            imperialGallon: { name: 'Imperial Gallon (gal)', factor: 0.00454609 }
        }
    },
    time: {
        name: 'Time',
        icon: 'fa-clock',
        units: {
            second: { name: 'Second (s)', factor: 1 },
            millisecond: { name: 'Millisecond (ms)', factor: 0.001 },
            microsecond: { name: 'Microsecond (μs)', factor: 0.000001 },
            nanosecond: { name: 'Nanosecond (ns)', factor: 1e-9 },
            minute: { name: 'Minute (min)', factor: 60 },
            hour: { name: 'Hour (h)', factor: 3600 },
            day: { name: 'Day (d)', factor: 86400 },
            week: { name: 'Week (wk)', factor: 604800 },
            month: { name: 'Month (avg)', factor: 2629746 },
            year: { name: 'Year (yr)', factor: 31556952 }
        }
    },
    speed: {
        name: 'Speed',
        icon: 'fa-gauge-high',
        units: {
            meterPerSecond: { name: 'Meter per Second (m/s)', factor: 1 },
            kilometerPerHour: { name: 'Kilometer per Hour (km/h)', factor: 0.277777778 },
            milePerHour: { name: 'Mile per Hour (mph)', factor: 0.44704 },
            knot: { name: 'Knot (kn)', factor: 0.514444444 },
            footPerSecond: { name: 'Foot per Second (ft/s)', factor: 0.3048 }
        }
    },
    pressure: {
        name: 'Pressure',
        icon: 'fa-gauge',
        units: {
            pascal: { name: 'Pascal (Pa)', factor: 1 },
            kilopascal: { name: 'Kilopascal (kPa)', factor: 1000 },
            bar: { name: 'Bar (bar)', factor: 100000 },
            psi: { name: 'Pound per Square Inch (psi)', factor: 6894.75729 },
            atmosphere: { name: 'Atmosphere (atm)', factor: 101325 },
            torr: { name: 'Torr (Torr)', factor: 133.322368 },
            mmHg: { name: 'Millimeter of Mercury (mmHg)', factor: 133.322368 }
        }
    },
    energy: {
        name: 'Energy',
        icon: 'fa-bolt',
        units: {
            joule: { name: 'Joule (J)', factor: 1 },
            kilojoule: { name: 'Kilojoule (kJ)', factor: 1000 },
            calorie: { name: 'Calorie (cal)', factor: 4.184 },
            kilocalorie: { name: 'Kilocalorie (kcal)', factor: 4184 },
            watthour: { name: 'Watt-hour (Wh)', factor: 3600 },
            kilowatthour: { name: 'Kilowatt-hour (kWh)', factor: 3600000 },
            electronvolt: { name: 'Electronvolt (eV)', factor: 1.602176634e-19 },
            britishThermalUnit: { name: 'British Thermal Unit (BTU)', factor: 1055.05585262 }
        }
    },
    power: {
        name: 'Power',
        icon: 'fa-plug',
        units: {
            watt: { name: 'Watt (W)', factor: 1 },
            kilowatt: { name: 'Kilowatt (kW)', factor: 1000 },
            megawatt: { name: 'Megawatt (MW)', factor: 1000000 },
            horsepower: { name: 'Horsepower (hp)', factor: 745.699872 },
            btuPerHour: { name: 'BTU per Hour (BTU/h)', factor: 0.29307107 }
        }
    },
    data: {
        name: 'Digital Storage',
        icon: 'fa-database',
        units: {
            bit: { name: 'Bit (b)', factor: 1 },
            byte: { name: 'Byte (B)', factor: 8 },
            kilobit: { name: 'Kilobit (Kb)', factor: 1000 },
            kilobyte: { name: 'Kilobyte (KB)', factor: 8000 },
            megabit: { name: 'Megabit (Mb)', factor: 1000000 },
            megabyte: { name: 'Megabyte (MB)', factor: 8000000 },
            gigabit: { name: 'Gigabit (Gb)', factor: 1000000000 },
            gigabyte: { name: 'Gigabyte (GB)', factor: 8000000000 },
            terabit: { name: 'Terabit (Tb)', factor: 1000000000000 },
            terabyte: { name: 'Terabyte (TB)', factor: 8000000000000 }
        }
    },
    angle: {
        name: 'Angle',
        icon: 'fa-circle-half-stroke',
        units: {
            degree: { name: 'Degree (°)', factor: 1 },
            radian: { name: 'Radian (rad)', factor: 57.29577951 },
            gradian: { name: 'Gradian (grad)', factor: 0.9 },
            arcminute: { name: 'Arcminute (′)', factor: 0.016666667 },
            arcsecond: { name: 'Arcsecond (″)', factor: 0.000277778 },
            revolution: { name: 'Revolution (rev)', factor: 360 }
        }
    },
    numeral: {
        name: 'Numeral System',
        icon: 'fa-code',
        units: {
            decimal: { name: 'Decimal', factor: 10 },
            binary: { name: 'Binary', factor: 2 },
            octal: { name: 'Octal', factor: 8 },
            hexadecimal: { name: 'Hexadecimal', factor: 16 }
        },
        convert: function(value, fromUnit, toUnit) {
            if (fromUnit === toUnit) return value;
            
            // Validate input based on the source base
            if (!this.validateInput(value, fromUnit)) {
                return 'Invalid input';
            }
            
            // Parse the input value based on the source base
            let decimalValue;
            if (fromUnit === 'decimal') {
                decimalValue = parseInt(value, 10);
            } else if (fromUnit === 'binary') {
                decimalValue = parseInt(value, 2);
            } else if (fromUnit === 'octal') {
                decimalValue = parseInt(value, 8);
            } else if (fromUnit === 'hexadecimal') {
                decimalValue = parseInt(value, 16);
            }
            
            // Check for NaN (invalid conversion)
            if (isNaN(decimalValue)) {
                return 'Invalid input';
            }
            
            // Convert to the target base
            if (toUnit === 'decimal') {
                return decimalValue.toString();
            } else if (toUnit === 'binary') {
                return decimalValue.toString(2);
            } else if (toUnit === 'octal') {
                return decimalValue.toString(8);
            } else if (toUnit === 'hexadecimal') {
                return decimalValue.toString(16).toUpperCase();
            }
        },
        validateInput: function(value, unit) {
            if (value === '') return false;
            
            const patterns = {
                decimal: /^-?[0-9]+$/,
                binary: /^[01]+$/,
                octal: /^[0-7]+$/,
                hexadecimal: /^[0-9A-Fa-f]+$/
            };
            
            return patterns[unit].test(value);
        },
        getFormula: function(fromUnit, toUnit) {
            if (fromUnit === toUnit) return 'No conversion needed';
            
            const formulas = {
                'decimal-binary': 'Convert decimal to binary using repeated division by 2',
                'decimal-octal': 'Convert decimal to octal using repeated division by 8',
                'decimal-hexadecimal': 'Convert decimal to hexadecimal using repeated division by 16',
                'binary-decimal': 'Convert binary to decimal using positional notation (sum of 2^n)',
                'binary-octal': 'Convert binary to decimal, then decimal to octal',
                'binary-hexadecimal': 'Convert binary to decimal, then decimal to hexadecimal',
                'octal-decimal': 'Convert octal to decimal using positional notation (sum of 8^n)',
                'octal-binary': 'Convert octal to decimal, then decimal to binary',
                'octal-hexadecimal': 'Convert octal to decimal, then decimal to hexadecimal',
                'hexadecimal-decimal': 'Convert hexadecimal to decimal using positional notation (sum of 16^n)',
                'hexadecimal-binary': 'Convert hexadecimal to decimal, then decimal to binary',
                'hexadecimal-octal': 'Convert hexadecimal to decimal, then decimal to octal'
            };
            
            return formulas[`${fromUnit}-${toUnit}`] || 'Custom conversion';
        }
    },
    bmi: {
        name: 'BMI Calculator',
        icon: 'fa-weight-scale',
        units: {
            metric: { name: 'Metric (kg, m)', factor: 1 },
            imperial: { name: 'Imperial (lb, in)', factor: 703 }
        },
        convert: function(value, fromUnit, toUnit) {
            // BMI calculator doesn't really convert between units
            // It calculates BMI based on height and weight
            // This is a placeholder for the UI
            return value;
        },
        getFormula: function(fromUnit, toUnit) {
            if (fromUnit === 'metric') {
                return 'BMI = weight(kg) / height²(m)';
            } else {
                return 'BMI = 703 × weight(lb) / height²(in)';
            }
        }
    },
    discount: {
        name: 'Discount Calculator',
        icon: 'fa-percent',
        units: {
            percentage: { name: 'Percentage Discount', factor: 1 },
            amount: { name: 'Amount Discount', factor: 1 },
            finalPrice: { name: 'Final Price', factor: 1 }
        },
        convert: function(value, fromUnit, toUnit) {
            // Discount calculator doesn't really convert between units
            // It calculates discount, final price, etc.
            // This is a placeholder for the UI
            return value;
        },
        getFormula: function(fromUnit, toUnit) {
            const formulas = {
                'percentage': 'Discount Amount = Original Price × (Discount % ÷ 100)',
                'amount': 'Discount % = (Discount Amount ÷ Original Price) × 100',
                'finalPrice': 'Final Price = Original Price - Discount Amount'
            };
            
            return formulas[fromUnit] || 'Custom calculation';
        }
    }
};

// Initialize the application
function initApp() {
    // Load saved theme preference
    loadThemePreference();
    
    // Load saved history
    loadHistory();
    
    // Set up event listeners
    setupEventListeners();
    
    // Initialize the category and units
    updateUnitSelects();
    
    // Generate quick conversions
    generateQuickConversions();
    
    // Initialize specialized calculators
    initSpecializedCalculators();
}

// Set up event listeners
function setupEventListeners() {
    // Category change
    categorySelect.addEventListener('change', () => {
        const category = categorySelect.value;
        
        // Show/hide specialized calculators based on category
        document.getElementById('standard-converter').style.display = 
            (category === 'bmi' || category === 'discount') ? 'none' : 'flex';
        document.getElementById('bmi-calculator').style.display = 
            (category === 'bmi') ? 'flex' : 'none';
        document.getElementById('discount-calculator').style.display = 
            (category === 'discount') ? 'flex' : 'none';
        
        // Update formula display visibility
        document.querySelector('.formula-display').style.display = 
            (category === 'bmi' || category === 'discount') ? 'none' : 'block';
        
        // Update quick conversions visibility
        document.querySelector('.quick-conversions').style.display = 
            (category === 'bmi' || category === 'discount') ? 'none' : 'block';
        
        // Load numeral system info if needed
        if (category === 'numeral') {
            loadNumeralSystemInfo();
        } else {
            // Hide numeral system info if it exists
            const numeralInfo = document.querySelector('.numeral-system-info');
            if (numeralInfo) {
                numeralInfo.style.display = 'none';
            }
        }
        
        updateUnitSelects();
        generateQuickConversions();
        convert();
    });
    
    
    // Unit changes
    fromUnitSelect.addEventListener('change', () => {
        convert();
    });
    
    toUnitSelect.addEventListener('change', () => {
        convert();
    });
    
    // Value input
    fromValueInput.addEventListener('input', () => {
        convert();
    });
    
    // Swap units
    swapButton.addEventListener('click', () => {
        const tempUnit = fromUnitSelect.value;
        fromUnitSelect.value = toUnitSelect.value;
        toUnitSelect.value = tempUnit;
        
        // If there's a value, swap the values too
        if (toValueInput.value) {
            fromValueInput.value = toValueInput.value;
        }
        
        convert();
    });
    
    // Clear history
    clearHistoryButton.addEventListener('click', () => {
        clearHistory();
    });
    
    // Theme toggle
    themeToggle.addEventListener('change', () => {
        toggleTheme();
    });
}

// Update unit select options based on selected category
function updateUnitSelects() {
    const category = categorySelect.value;
    const units = unitData[category].units;
    
    // Clear existing options
    fromUnitSelect.innerHTML = '';
    toUnitSelect.innerHTML = '';
    
    // Add new options
    for (const [unitKey, unitInfo] of Object.entries(units)) {
        const fromOption = document.createElement('option');
        fromOption.value = unitKey;
        fromOption.textContent = unitInfo.name;
        fromUnitSelect.appendChild(fromOption);
        
        const toOption = document.createElement('option');
        toOption.value = unitKey;
        toOption.textContent = unitInfo.name;
        toUnitSelect.appendChild(toOption);
    }
    
    // Set default selections (different if possible)
    if (fromUnitSelect.options.length > 1) {
        fromUnitSelect.selectedIndex = 0;
        toUnitSelect.selectedIndex = 1;
    } else {
        fromUnitSelect.selectedIndex = 0;
        toUnitSelect.selectedIndex = 0;
    }
}

// Perform the conversion
function convert() {
    const category = categorySelect.value;
    const fromUnit = fromUnitSelect.value;
    const toUnit = toUnitSelect.value;
    
    // For numeral system, we need the raw input value (not parsed)
    const rawFromValue = fromValueInput.value;
    const fromValue = category === 'numeral' ? rawFromValue : parseFloat(rawFromValue);
    
    // For standard conversions, validate numeric input
    if (category !== 'numeral' && isNaN(fromValue)) {
        toValueInput.value = '';
        formulaText.textContent = '-';
        return;
    }
    
    let result;
    
    // Check if category has special conversion function
    if (unitData[category].convert) {
        result = unitData[category].convert(fromValue, fromUnit, toUnit);
        formulaText.textContent = unitData[category].getFormula(fromUnit, toUnit);
    } else {
        // Standard conversion using factors
        const fromFactor = unitData[category].units[fromUnit].factor;
        const toFactor = unitData[category].units[toUnit].factor;
        result = (fromValue * fromFactor) / toFactor;
        
        // Display formula
        if (fromUnit === toUnit) {
            formulaText.textContent = 'No conversion needed';
        } else {
            const fromUnitName = unitData[category].units[fromUnit].name.split(' ')[0];
            const toUnitName = unitData[category].units[toUnit].name.split(' ')[0];
            formulaText.textContent = `${toUnitName} = ${fromUnitName} × ${fromFactor} ÷ ${toFactor}`;
        }
    }
    
    // Handle string results (like 'Invalid input')
    if (typeof result === 'string') {
        toValueInput.value = result;
        return;
    }
    
    // Format the result based on its magnitude
    toValueInput.value = formatResult(result);
    
    // Add to history if valid conversion
    if (!isNaN(result) && fromValueInput.value !== '') {
        addToHistory(category, fromValue, fromUnit, result, toUnit);
    }
}

// Format the result to appropriate precision
function formatResult(value) {
    if (Math.abs(value) < 0.000001 && value !== 0) {
        return value.toExponential(6);
    } else if (Math.abs(value) >= 1000000) {
        return value.toExponential(6);
    } else {
        // Determine appropriate precision based on value
        const absValue = Math.abs(value);
        let precision = 10;
        
        if (absValue >= 100) precision = 2;
        else if (absValue >= 10) precision = 4;
        else if (absValue >= 1) precision = 6;
        else if (absValue >= 0.1) precision = 8;
        
        // Round to precision
        return parseFloat(value.toPrecision(precision));
    }
}

// Generate quick conversion options
function generateQuickConversions() {
    const category = categorySelect.value;
    const units = unitData[category].units;
    const unitKeys = Object.keys(units);
    
    quickConversionList.innerHTML = '';
    
    // Create common conversion pairs
    const pairs = [];
    
    // Add some common pairs based on category
    if (category === 'length') {
        pairs.push(['meter', 'foot'], ['kilometer', 'mile'], ['centimeter', 'inch']);
    } else if (category === 'mass') {
        pairs.push(['kilogram', 'pound'], ['gram', 'ounce'], ['metricTon', 'ton']);
    } else if (category === 'temperature') {
        pairs.push(['celsius', 'fahrenheit'], ['celsius', 'kelvin'], ['fahrenheit', 'kelvin']);
    } else {
        // For other categories, create some random pairs
        for (let i = 0; i < Math.min(6, unitKeys.length); i++) {
            const fromIndex = i % unitKeys.length;
            const toIndex = (i + 1) % unitKeys.length;
            pairs.push([unitKeys[fromIndex], unitKeys[toIndex]]);
        }
    }
    
    // Create quick conversion items
    pairs.forEach(pair => {
        const [fromUnit, toUnit] = pair;
        if (units[fromUnit] && units[toUnit]) {
            const item = document.createElement('div');
            item.className = 'quick-conversion-item';
            item.textContent = `${units[fromUnit].name.split(' ')[0]} → ${units[toUnit].name.split(' ')[0]}`;
            
            item.addEventListener('click', () => {
                fromUnitSelect.value = fromUnit;
                toUnitSelect.value = toUnit;
                convert();
            });
            
            quickConversionList.appendChild(item);
        }
    });
}

// Add conversion to history
function addToHistory(category, fromValue, fromUnit, toValue, toUnit) {
    const categoryName = unitData[category].name;
    const fromUnitName = unitData[category].units[fromUnit].name;
    const toUnitName = unitData[category].units[toUnit].name;
    
    // Format values for display
    const displayFromValue = category === 'numeral' ? fromValue : formatResult(fromValue);
    const displayToValue = category === 'numeral' ? toValue : formatResult(toValue);
    
    const historyItem = {
        id: Date.now(),
        timestamp: new Date().toISOString(),
        category: categoryName,
        fromValue: displayFromValue,
        fromUnit: fromUnitName,
        toValue: displayToValue,
        toUnit: toUnitName,
        isNumeral: category === 'numeral'
    };
    
    // Get existing history
    let history = JSON.parse(localStorage.getItem('conversionHistory')) || [];
    
    // Add new item (avoid duplicates)
    const isDuplicate = history.some(item => 
        item.category === historyItem.category &&
        item.fromValue === historyItem.fromValue &&
        item.fromUnit === historyItem.fromUnit &&
        item.toUnit === historyItem.toUnit
    );
    
    if (!isDuplicate) {
        // Add to beginning of array
        history.unshift(historyItem);
        
        // Limit history to 20 items
        if (history.length > 20) {
            history = history.slice(0, 20);
        }
        
        // Save to localStorage
        localStorage.setItem('conversionHistory', JSON.stringify(history));
        
        // Update display
        displayHistory();
    }
}

// Display conversion history
function displayHistory() {
    const history = JSON.parse(localStorage.getItem('conversionHistory')) || [];
    
    historyList.innerHTML = '';
    
    if (history.length === 0) {
        const emptyMessage = document.createElement('div');
        emptyMessage.className = 'history-empty';
        emptyMessage.textContent = 'No conversion history yet';
        historyList.appendChild(emptyMessage);
        return;
    }
    
    history.forEach(item => {
        const historyItem = document.createElement('div');
        historyItem.className = 'history-item';
        
        const formattedTime = new Date(item.timestamp).toLocaleString();
        
        historyItem.innerHTML = `
            <div class="history-item-details">
                <div>${formatResult(item.fromValue)} ${item.fromUnit.split(' ')[0]} = ${formatResult(item.toValue)} ${item.toUnit.split(' ')[0]}</div>
                <div class="history-item-time">${item.category} · ${formattedTime}</div>
            </div>
            <div class="history-item-action">
                <button class="reuse-btn" title="Reuse this conversion"><i class="fas fa-redo"></i></button>
                <button class="delete-btn" title="Remove from history"><i class="fas fa-times"></i></button>
            </div>
        `;
        
        // Add event listeners for buttons
        historyItem.querySelector('.reuse-btn').addEventListener('click', () => {
            reuseConversion(item);
        });
        
        historyItem.querySelector('.delete-btn').addEventListener('click', () => {
            removeHistoryItem(item.id);
        });
        
        historyList.appendChild(historyItem);
    });
}

// Reuse a conversion from history
function reuseConversion(item) {
    // Find the category key
    let categoryKey = '';
    for (const [key, value] of Object.entries(unitData)) {
        if (value.name === item.category) {
            categoryKey = key;
            break;
        }
    }
    
    if (!categoryKey) return;
    
    // Find unit keys
    let fromUnitKey = '';
    let toUnitKey = '';
    
    for (const [key, value] of Object.entries(unitData[categoryKey].units)) {
        if (value.name === item.fromUnit) fromUnitKey = key;
        if (value.name === item.toUnit) toUnitKey = key;
    }
    
    if (!fromUnitKey || !toUnitKey) return;
    
    // Set values in the converter
    categorySelect.value = categoryKey;
    updateUnitSelects();
    
    // Set units and value
    fromUnitSelect.value = fromUnitKey;
    toUnitSelect.value = toUnitKey;
    fromValueInput.value = item.fromValue;
    
    // Perform conversion
    convert();
}

// Remove an item from history
function removeHistoryItem(id) {
    let history = JSON.parse(localStorage.getItem('conversionHistory')) || [];
    history = history.filter(item => item.id !== id);
    localStorage.setItem('conversionHistory', JSON.stringify(history));
    displayHistory();
}

// Clear all history
function clearHistory() {
    localStorage.removeItem('conversionHistory');
    displayHistory();
}

// Load history from localStorage
function loadHistory() {
    displayHistory();
}

// Toggle between light and dark theme
function toggleTheme() {
    if (themeToggle.checked) {
        document.body.classList.add('dark-theme');
        localStorage.setItem('theme', 'dark');
    } else {
        document.body.classList.remove('dark-theme');
        localStorage.setItem('theme', 'light');
    }
}

// Load theme preference from localStorage
function loadThemePreference() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        themeToggle.checked = true;
        document.body.classList.add('dark-theme');
    }
}

// Initialize specialized calculators
function initSpecializedCalculators() {
    // BMI Calculator
    const bmiWeightInput = document.getElementById('bmi-weight');
    const bmiHeightInput = document.getElementById('bmi-height');
    const weightUnitSelect = document.getElementById('weight-unit');
    const heightUnitSelect = document.getElementById('height-unit');
    const calculateBmiButton = document.getElementById('calculate-bmi');
    const bmiValueElement = document.getElementById('bmi-value');
    const bmiCategoryElement = document.getElementById('bmi-category');
    
    // Discount Calculator
    const originalPriceInput = document.getElementById('original-price');
    const discountValueInput = document.getElementById('discount-value');
    const percentDiscountRadio = document.getElementById('percent-discount');
    const amountDiscountRadio = document.getElementById('amount-discount');
    const calculateDiscountButton = document.getElementById('calculate-discount');
    const discountAmountElement = document.getElementById('discount-amount');
    const discountPercentageElement = document.getElementById('discount-percentage');
    const finalPriceElement = document.getElementById('final-price');
    const youSaveElement = document.getElementById('you-save');
    
    // BMI Calculator Event Listener
    calculateBmiButton.addEventListener('click', () => {
        const weight = parseFloat(bmiWeightInput.value);
        const height = parseFloat(bmiHeightInput.value);
        const weightUnit = weightUnitSelect.value;
        const heightUnit = heightUnitSelect.value;
        
        if (isNaN(weight) || isNaN(height) || weight <= 0 || height <= 0) {
            bmiValueElement.textContent = 'Invalid input';
            bmiCategoryElement.textContent = '-';
            return;
        }
        
        // Convert weight to kg if needed
        let weightInKg = weight;
        if (weightUnit === 'lb') {
            weightInKg = weight * 0.45359237;
        }
        
        // Convert height to meters if needed
        let heightInMeters = height;
        if (heightUnit === 'cm') {
            heightInMeters = height / 100;
        } else if (heightUnit === 'in') {
            heightInMeters = height * 0.0254;
        } else if (heightUnit === 'ft') {
            heightInMeters = height * 0.3048;
        }
        
        // Calculate BMI
        const bmi = weightInKg / (heightInMeters * heightInMeters);
        const roundedBmi = parseFloat(bmi.toFixed(2));
        
        // Determine BMI category
        let category;
        if (roundedBmi < 18.5) {
            category = 'Underweight';
        } else if (roundedBmi < 25) {
            category = 'Normal weight';
        } else if (roundedBmi < 30) {
            category = 'Overweight';
        } else {
            category = 'Obese';
        }
        
        // Update UI
        bmiValueElement.textContent = roundedBmi;
        bmiCategoryElement.textContent = category;
        
        // Highlight the appropriate section on the BMI scale
        const scaleItems = document.querySelectorAll('.bmi-scale .scale-item');
        scaleItems.forEach(item => item.classList.remove('active'));
        
        if (roundedBmi < 18.5) {
            scaleItems[0].classList.add('active');
        } else if (roundedBmi < 25) {
            scaleItems[1].classList.add('active');
        } else if (roundedBmi < 30) {
            scaleItems[2].classList.add('active');
        } else {
            scaleItems[3].classList.add('active');
        }
    });
    
    // Discount Calculator Event Listener
    calculateDiscountButton.addEventListener('click', () => {
        const originalPrice = parseFloat(originalPriceInput.value);
        const discountValue = parseFloat(discountValueInput.value);
        const isPercentDiscount = percentDiscountRadio.checked;
        
        if (isNaN(originalPrice) || isNaN(discountValue) || originalPrice <= 0 || discountValue < 0) {
            discountAmountElement.textContent = 'Invalid input';
            discountPercentageElement.textContent = '-';
            finalPriceElement.textContent = '-';
            youSaveElement.textContent = '-';
            return;
        }
        
        let discountAmount, discountPercentage, finalPrice;
        
        if (isPercentDiscount) {
            // Calculate discount amount from percentage
            discountAmount = originalPrice * (discountValue / 100);
            discountPercentage = discountValue;
        } else {
            // Calculate discount percentage from amount
            discountAmount = discountValue;
            discountPercentage = (discountValue / originalPrice) * 100;
        }
        
        // Ensure discount amount doesn't exceed original price
        discountAmount = Math.min(discountAmount, originalPrice);
        finalPrice = originalPrice - discountAmount;
        
        // Update UI
        discountAmountElement.textContent = formatCurrency(discountAmount);
        discountPercentageElement.textContent = discountPercentage.toFixed(2) + '%';
        finalPriceElement.textContent = formatCurrency(finalPrice);
        youSaveElement.textContent = formatCurrency(discountAmount);
    });
    
    // Helper function to format currency
    function formatCurrency(value) {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(value);
    }
}

// Load numeral system information panel
function loadNumeralSystemInfo() {
    // Check if the numeral system info panel already exists
    let numeralInfo = document.querySelector('.numeral-system-info');
    
    if (!numeralInfo) {
        // If it doesn't exist, fetch it from the HTML file
        fetch('numeral-info.html')
            .then(response => response.text())
            .then(html => {
                // Create a container for the numeral system info
                numeralInfo = document.createElement('div');
                numeralInfo.innerHTML = html;
                
                // Insert it after the formula display
                const formulaDisplay = document.querySelector('.formula-display');
                formulaDisplay.parentNode.insertBefore(numeralInfo.firstElementChild, formulaDisplay.nextSibling);
            })
            .catch(error => {
                console.error('Error loading numeral system info:', error);
                
                // Create a simple info panel if fetch fails
                numeralInfo = document.createElement('div');
                numeralInfo.className = 'numeral-system-info';
                numeralInfo.innerHTML = `
                    <h4>About Numeral Systems</h4>
                    <p>Convert between decimal, binary, octal, and hexadecimal number systems.</p>
                `;
                
                // Insert it after the formula display
                const formulaDisplay = document.querySelector('.formula-display');
                formulaDisplay.parentNode.insertBefore(numeralInfo, formulaDisplay.nextSibling);
            });
    } else {
        // If it exists, show it
        numeralInfo.style.display = 'block';
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', initApp);