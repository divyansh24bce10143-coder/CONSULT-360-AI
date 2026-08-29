"""
Example 01: Creating a Water Pumping System Flowsheet from Scratch
Demonstrates:
- Initializing DWSIM Automation interface
- Creating a new simulation flowsheet
- Adding Water compound & Property Package
- Adding Feed Stream, Pump, and Discharge Stream
- Setting operating parameters
- Solving the flowsheet and printing performance metrics
"""

import sys
import os

# Add parent directory to path to import dwsim_automation package
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from dwsim_automation import DWSIMAutomationManager, utils


def run_example():
    # 1. Initialize DWSIM Automation Manager
    # Optional: pass explicit path if DWSIM is in custom directory
    # manager = DWSIMAutomationManager(dwsim_dir=r"C:\Program Files\DWSIM")
    manager = DWSIMAutomationManager()

    try:
        manager.initialize_automation()
    except Exception as e:
        print(f"Skipping execution: DWSIM installation not found or pythonnet failed: {e}")
        print("Ensure DWSIM is installed and pythonnet is installed via `pip install pythonnet`.")
        return

    # 2. Create new flowsheet
    sim = manager.create_flowsheet()

    # 3. Add Compounds
    manager.add_compounds(["Water"])

    # 4. Set Property Package (e.g. Peng-Robinson or Steam Tables)
    manager.set_property_package("Peng-Robinson (PR)")

    # 5. Add Feed Stream (Material Stream 1)
    feed = manager.add_object("MaterialStream", 50, 50, "Feed_Water")
    feed.SetTemperature(utils.celsius_to_kelvin(25.0))  # 25 °C
    feed.SetPressure(utils.bar_to_pascal(1.01325))       # 1 atm / 1.01325 bar
    feed.SetMolarFlow(100.0)                             # mol/s
    feed.SetOverallComposition([1.0])                    # 100% Water

    # 6. Add Pump
    pump = manager.add_object("Pump", 200, 50, "P-101")
    # Set pump discharge pressure to 10 bar
    pump.DeltaP = utils.bar_to_pascal(8.98675)  # 10 bar discharge pressure

    # 7. Add Discharge Stream
    discharge = manager.add_object("MaterialStream", 350, 50, "Discharge_Water")

    # 8. Add Energy Stream for Pump
    energy = manager.add_object("EnergyStream", 200, 150, "Pump_Power")

    # 9. Connect Objects
    manager.connect_objects(feed, pump, 0, 0)
    manager.connect_objects(pump, discharge, 0, 0)
    manager.connect_objects(energy, pump, 0, 0)

    # 10. Solve Flowsheet
    errors = manager.calculate_flowsheet()

    # 11. Read & Display Stream Properties
    feed_props = manager.get_material_stream_properties("Feed_Water")
    disc_props = manager.get_material_stream_properties("Discharge_Water")

    print("\n--- INLET STREAM RESULTS ---")
    print(utils.format_stream_summary(feed_props))

    print("\n--- OUTLET STREAM RESULTS ---")
    print(utils.format_stream_summary(disc_props))

    # 12. Save Flowsheet
    output_path = os.path.join(os.path.dirname(__file__), "water_pump_simulation.dwxmz")
    manager.save_flowsheet(output_path)


if __name__ == "__main__":
    run_example()
