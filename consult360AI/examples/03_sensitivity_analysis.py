"""
Example 03: Parameter Sensitivity Analysis & Parametric Sweep
Demonstrates:
- Running a loop varying feed temperature or pressure
- Recalculating DWSIM flowsheet at each step
- Recording power consumption / outlet temperature / vapor fraction
- Saving dataset to CSV and generating performance plots using pandas & matplotlib
"""

import sys
import os
import pandas as pd
import numpy as np

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from dwsim_automation import DWSIMAutomationManager, utils


def run_sensitivity_sweep(sim_file: str):
    manager = DWSIMAutomationManager()
    
    try:
        manager.initialize_automation()
    except Exception as e:
        print(f"Skipping sensitivity sweep: DWSIM not available ({e})")
        return

    sim = manager.load_flowsheet(sim_file)

    feed_stream = sim.GetObject("Feed_Water")
    pump = sim.GetObject("P-101")
    energy_stream = sim.GetObject("Pump_Power")

    if not (feed_stream and pump and energy_stream):
        print("Required objects (Feed_Water, P-101, Pump_Power) not found in simulation.")
        return

    # Define sweep range for Discharge Pressure (2 bar to 20 bar)
    pressure_range_bar = np.linspace(2.0, 20.0, 10)
    sweep_results = []

    print("\nStarting Parametric Sweep over Discharge Pressure...")
    for p_bar in pressure_range_bar:
        # Set pump deltaP or discharge pressure
        p_pa = utils.bar_to_pascal(p_bar)
        inlet_p_pa = float(feed_stream.GetPressure())
        delta_p = p_pa - inlet_p_pa

        pump.DeltaP = delta_p

        # Recalculate
        errors = manager.calculate_flowsheet()

        # Record metrics
        disc_props = manager.get_material_stream_properties("Discharge_Water")
        pump_power_kw = float(energy_stream.GetEnergyFlow()) / 1000.0 if hasattr(energy_stream, "GetEnergyFlow") else 0.0

        sweep_results.append({
            "DischargePressure_bar": p_bar,
            "DeltaP_bar": utils.pascal_to_bar(delta_p),
            "PumpPower_kW": pump_power_kw,
            "OutletTemperature_C": disc_props["Temperature_C"],
            "MassFlow_kgh": disc_props["MassFlow_kgh"]
        })

    # Save to CSV
    df = pd.DataFrame(sweep_results)
    csv_path = os.path.join(os.path.dirname(__file__), "pump_sensitivity_results.csv")
    df.to_csv(csv_path, index=False)
    print(f"\nSaved sensitivity analysis results to {csv_path}")

    # Plot results if matplotlib is available
    try:
        import matplotlib.pyplot as plt

        plt.figure(figsize=(10, 5))
        
        plt.subplot(1, 2, 1)
        plt.plot(df["DischargePressure_bar"], df["PumpPower_kW"], 'b-o', linewidth=2)
        plt.title("Pump Power vs Discharge Pressure")
        plt.xlabel("Discharge Pressure (bar)")
        plt.ylabel("Power (kW)")
        plt.grid(True)

        plt.subplot(1, 2, 2)
        plt.plot(df["DischargePressure_bar"], df["OutletTemperature_C"], 'r-s', linewidth=2)
        plt.title("Outlet Temperature vs Discharge Pressure")
        plt.xlabel("Discharge Pressure (bar)")
        plt.ylabel("Temperature (°C)")
        plt.grid(True)

        plt.tight_layout()
        plot_path = os.path.join(os.path.dirname(__file__), "pump_sensitivity_plot.png")
        plt.savefig(plot_path)
        print(f"Saved plot to {plot_path}")

    except Exception as err:
        print(f"Plotting skipped: {err}")


if __name__ == "__main__":
    sample_file = os.path.join(os.path.dirname(__file__), "water_pump_simulation.dwxmz")
    if os.path.exists(sample_file):
        run_sensitivity_sweep(sample_file)
    else:
        print("Please run `01_create_pump_flowsheet.py` first to generate the base simulation file.")
