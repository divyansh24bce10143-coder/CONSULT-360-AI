# DWSIM Python Automation Guide & Framework

A complete, production-ready framework and guide for automating **DWSIM Process Simulator** using Python.

---

## 🌟 Overview

DWSIM is an open-source CAPE-OPEN compliant chemical process simulator. DWSIM provides a powerful Standalone Automation API (`DWSIM.Automation.dll`) that allows full control of process flowsheets, thermodynamic calculations, unit operations, and property estimation through Python.

Automation can be performed in **two modes**:
1. **External Python Automation (Recommended)**: Running CPython scripts (VS Code, Jupyter Notebooks, optimization loops, parameter sweeps) using `pythonnet` to load DWSIM's .NET assemblies.
2. **Internal DWSIM GUI Scripting**: Running IronPython / Python scripts directly inside DWSIM's built-in script window or Script Block Unit Operation.

---

## 📁 Repository Structure

```
antigravity_project/
├── dwsim_automation/
│   ├── __init__.py           # Package exports
│   ├── manager.py            # DWSIMAutomationManager wrapper class
│   └── utils.py              # Unit conversions & summary helpers
├── examples/
│   ├── 01_create_pump_flowsheet.py    # Build flowsheet from scratch
│   ├── 02_load_and_modify_simulation.py # Load .dwxmz & modify stream specs
│   ├── 03_sensitivity_analysis.py     # Parametric sweep & matplotlib plotting
│   └── 04_internal_script_template.py # Template for DWSIM GUI internal script
├── requirements.txt          # Python dependencies (pythonnet, pandas, matplotlib)
└── README.md                 # Full documentation
```

---

## ⚙️ Prerequisites & Setup

### 1. Install DWSIM
Download and install DWSIM (v7 or v8 recommended) from the official website or SourceForge:
- **Windows Default Path**: `C:\Users\<Username>\AppData\Local\DWSIM` or `C:\Program Files\DWSIM`
- **Architecture**: Make sure your Python architecture matches DWSIM (64-bit Python for 64-bit DWSIM).

### 2. Install Python Dependencies
Install required packages using pip:
```bash
pip install -r requirements.txt
```

---

## 🚀 Quickstart Guide

### 1. Initializing Automation & Creating Flowsheet

```python
from dwsim_automation import DWSIMAutomationManager, utils

# Instantiate Manager (automatically detects DWSIM installation path)
manager = DWSIMAutomationManager()
manager.initialize_automation()

# Create a new simulation flowsheet
sim = manager.create_flowsheet()
```

### 2. Adding Compounds & Property Package

```python
# Add chemical compounds from DWSIM database
manager.add_compounds(["Water", "Ethanol"])

# Set property package (e.g., Peng-Robinson, NRTL, UNIQUAC, Raoult's Law)
manager.set_property_package("NRTL")
```

### 3. Adding Streams & Unit Operations

```python
# Add Material Stream 1
feed = manager.add_object("MaterialStream", 50, 50, "Feed_Stream")
feed.SetTemperature(utils.celsius_to_kelvin(25.0))  # 25 °C -> Kelvin
feed.SetPressure(utils.bar_to_pascal(1.01325))       # 1 atm -> Pascal
feed.SetMolarFlow(100.0)                             # mol/s
feed.SetOverallComposition([0.5, 0.5])               # 50 mol% Water, 50 mol% Ethanol

# Add Pump Unit Operation
pump = manager.add_object("Pump", 200, 50, "P-101")
pump.DeltaP = utils.bar_to_pascal(5.0)              # 5 bar pressure boost

# Add Outlet Material Stream & Energy Stream
discharge = manager.add_object("MaterialStream", 350, 50, "Discharge_Stream")
power_stream = manager.add_object("EnergyStream", 200, 150, "Pump_Power")

# Connect objects
manager.connect_objects(feed, pump, 0, 0)
manager.connect_objects(pump, discharge, 0, 0)
manager.connect_objects(power_stream, pump, 0, 0)
```

### 4. Solving Flowsheet & Extracting Results

```python
# Solve flowsheet
errors = manager.calculate_flowsheet()

# Extract properties
discharge_props = manager.get_material_stream_properties("Discharge_Stream")
print(utils.format_stream_summary(discharge_props))

# Save simulation file
manager.save_flowsheet("ethanol_water_pumping.dwxmz")
```

---

## 📊 Advanced Automation Workflows

### Parameter Sensitivity & Optimization Sweeps
Check `examples/03_sensitivity_analysis.py` for a full parametric sweep script. You can run optimization algorithms (e.g., `scipy.optimize`) directly on top of DWSIM simulations to find optimal heat duties, column reflux ratios, or operating pressures!

---

## 🛠️ Troubleshooting & FAQ

1. **`ModuleNotFoundError: No module named 'clr'`**
   - Run `pip install pythonnet`.
2. **`BadImageFormatException` or Architecture Mismatch**
   - Ensure both Python and DWSIM are 64-bit.
3. **`FileNotFoundError: DWSIM directory not found`**
   - Explicitly pass your DWSIM folder path to the manager:
     ```python
     manager = DWSIMAutomationManager(dwsim_dir=r"C:\Custom\Path\To\DWSIM")
     ```
4. **Linux / macOS Support**
   - Linux requires `mono` framework installed to execute DWSIM's .NET assemblies via `pythonnet`.
