"""
Example 02: Loading and Modifying an Existing DWSIM Flowsheet
Demonstrates:
- Loading an existing .dwxmz simulation file
- Finding streams/objects by name
- Modifying stream operating conditions (T, P, Flow, Compositions)
- Re-calculating the flowsheet
- Exporting results to CSV
"""

import sys
import os

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from dwsim_automation import DWSIMAutomationManager, utils


def run_example(file_path: str):
    manager = DWSIMAutomationManager()
    
    try:
        manager.initialize_automation()
    except Exception as e:
        print(f"Skipping: Could not initialize DWSIM Automation: {e}")
        return

    # Load Flowsheet
    print(f"Loading simulation file: {file_path}")
    sim = manager.load_flowsheet(file_path)

    # Inspect objects in flowsheet
    print("\nFlowsheet Objects:")
    for obj_name in sim.GetFlowsheetObjects().Keys:
        obj = sim.GetObject(obj_name)
        print(f"  - Name: {obj.Name}, GraphicType: {obj.GraphicObject.GraphicType}")

    # Modify Feed Stream if present
    feed_stream_name = "Feed_Water"  # Or name of stream in loaded file
    feed = sim.GetObject(feed_stream_name)
    if feed:
        print(f"\nModifying conditions for stream '{feed_stream_name}'...")
        feed.SetTemperature(utils.celsius_to_kelvin(50.0))  # Increase T to 50 C
        feed.SetMolarFlow(150.0)                            # Increase flow rate

    # Re-calculate flowsheet
    errors = manager.calculate_flowsheet()

    # Extract all material stream data into a list for CSV export
    results = []
    for obj_name in sim.GetFlowsheetObjects().Keys:
        obj = sim.GetObject(obj_name)
        # Check if object is material stream
        if hasattr(obj, "GetTemperature") and hasattr(obj, "GetPressure"):
            try:
                props = manager.get_material_stream_properties(obj.Name)
                results.append(props)
            except Exception as e:
                pass

    if results:
        csv_out = os.path.join(os.path.dirname(__file__), "modified_simulation_results.csv")
        utils.export_results_to_csv(results, csv_out)


if __name__ == "__main__":
    sample_file = os.path.join(os.path.dirname(__file__), "water_pump_simulation.dwxmz")
    if os.path.exists(sample_file):
        run_example(sample_file)
    else:
        print(f"Sample simulation file '{sample_file}' not found.")
        print("Run `01_create_pump_flowsheet.py` first to generate the sample simulation file.")
