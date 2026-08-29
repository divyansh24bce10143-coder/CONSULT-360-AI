"""
Example 04: Template for Internal DWSIM GUI Python Scripting (IronPython)

NOTE: This script is designed to run INSIDE DWSIM's built-in Python Script window
or inside a 'Python Script Unit Operation' block within the DWSIM GUI.

In internal scripting mode:
- The `Flowsheet` object is automatically exposed by DWSIM into the global scope.
- You do NOT need `clr.AddReference("DWSIM.Automation")` or `Automation2()`.
"""

# Inside DWSIM GUI, `Flowsheet` is directly available:
# E.g.: feed_stream = Flowsheet.GetObject("Feed_Water")

def run_internal_dwsim_script():
    try:
        # Reference global Flowsheet object
        fs = Flowsheet
    except NameError:
        print("This script is intended to run inside DWSIM GUI where 'Flowsheet' is pre-defined.")
        return

    # Get objects from current flowsheet
    feed = fs.GetObject("Feed_Water")
    pump = fs.GetObject("P-101")
    discharge = fs.GetObject("Discharge_Water")

    if feed and pump:
        # Read temperature and pressure
        temp_k = feed.GetTemperature()
        press_pa = feed.GetPressure()
        print("Inlet Temperature (K): {0}".format(temp_k))
        print("Inlet Pressure (Pa): {0}".format(press_pa))

        # Dynamically set pump pressure boost based on custom logic
        if temp_k > 300:
            pump.DeltaP = 500000.0  # 5 bar
        else:
            pump.DeltaP = 300000.0  # 3 bar

        # Calculate flowsheet programmatically from within script
        fs.RequestCalculation(feed)

        print("Updated discharge pressure: {0} Pa".format(discharge.GetPressure()))


if __name__ == "__main__":
    run_internal_dwsim_script()
