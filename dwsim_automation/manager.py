"""
DWSIM Automation Manager module.
Handles pythonnet initialization, DLL loading, flowsheet creation/manipulation,
and result extraction for DWSIM simulation software.
"""

import os
import sys
from typing import List, Dict, Any, Optional, Tuple, Union


class DWSIMAutomationManager:
    """
    Manager class to interface Python with DWSIM via pythonnet (CLR).
    """

    DEFAULT_PATHS = [
        r"C:\Users\{username}\AppData\Local\DWSIM",
        r"C:\Program Files\DWSIM",
        r"C:\Program Files\DWSIM8",
        r"C:\Program Files\DWSIM7",
        r"C:\Program Files (x86)\DWSIM",
        r"C:\Program Files (x86)\DWSIM7",
    ]

    def __init__(self, dwsim_dir: Optional[str] = None):
        """
        Initialize the DWSIM Automation Manager.
        
        Args:
            dwsim_dir: Explicit path to DWSIM installation folder.
                       If None, searches standard installation locations.
        """
        self.dwsim_dir = dwsim_dir or self._find_dwsim_directory()
        self.interop = None
        self.sim = None
        self._is_initialized = False

    def _find_dwsim_directory(self) -> str:
        """Search system for DWSIM installation directory containing DWSIM.Automation.dll."""
        username = os.environ.get("USERNAME", "")
        search_paths = [p.format(username=username) for p in self.DEFAULT_PATHS]
        
        # Check LocalAppData env var if available
        local_appdata = os.environ.get("LOCALAPPDATA", "")
        if local_appdata:
            search_paths.insert(0, os.path.join(local_appdata, "DWSIM"))

        for path in search_paths:
            dll_path = os.path.join(path, "DWSIM.Automation.dll")
            if os.path.exists(dll_path):
                print(f"[DWSIM Manager] Found DWSIM installation at: {path}")
                return path

        print("[DWSIM Manager] Warning: Could not automatically locate DWSIM directory.")
        print("[DWSIM Manager] Please specify `dwsim_dir` explicitly when instantiating DWSIMAutomationManager.")
        return ""

    def initialize_automation(self) -> bool:
        """
        Add DWSIM assembly references to CLR and instantiate Automation2.
        
        Returns:
            bool: True if initialization succeeded, False otherwise.
        """
        if not self.dwsim_dir or not os.path.exists(self.dwsim_dir):
            raise FileNotFoundError(
                f"DWSIM directory not found: '{self.dwsim_dir}'. "
                "Ensure DWSIM is installed or provide valid `dwsim_dir`."
            )

        if self.dwsim_dir not in sys.path:
            sys.path.append(self.dwsim_dir)

        try:
            import clr

            # Add references to core DWSIM DLLs
            dlls = [
                "DWSIM.Automation",
                "DWSIM.Interfaces",
                "DWSIM.GlobalSettings",
                "DWSIM.SharedClasses",
                "DWSIM.Thermodynamics",
                "DWSIM.UnitOperations",
                "DWSIM.Inspector",
            ]

            for dll in dlls:
                dll_path = os.path.join(self.dwsim_dir, f"{dll}.dll")
                if os.path.exists(dll_path):
                    clr.AddReference(dll_path)
                else:
                    clr.AddReference(dll)

            from DWSIM.Automation import Automation2

            self.interop = Automation2()
            self._is_initialized = True
            print("[DWSIM Manager] Successfully initialized DWSIM Automation2 interface.")
            return True

        except Exception as e:
            print(f"[DWSIM Manager] Failed to initialize DWSIM Automation: {e}")
            raise e

    def create_flowsheet(self):
        """Create a new empty DWSIM flowsheet."""
        if not self._is_initialized:
            self.initialize_automation()

        self.sim = self.interop.CreateFlowsheet()
        print(f"[DWSIM Manager] Created new flowsheet ID: {self.sim.FlowsheetID if hasattr(self.sim, 'FlowsheetID') else 'New'}")
        return self.sim

    def load_flowsheet(self, filepath: str):
        """
        Load an existing DWSIM simulation file (.dwxmz or .dwxml).
        
        Args:
            filepath: Full path to the DWSIM simulation file.
        """
        if not self._is_initialized:
            self.initialize_automation()

        if not os.path.exists(filepath):
            raise FileNotFoundError(f"Simulation file does not exist: {filepath}")

        self.sim = self.interop.LoadFlowsheet(filepath)
        print(f"[DWSIM Manager] Loaded flowsheet from: {filepath}")
        return self.sim

    def save_flowsheet(self, filepath: str, overwrite: bool = True):
        """
        Save the current flowsheet to a file.
        
        Args:
            filepath: Target file path (.dwxmz).
            overwrite: Whether to overwrite existing file.
        """
        if not self.sim:
            raise ValueError("No active flowsheet to save.")

        self.interop.SaveFlowsheet(self.sim, filepath, overwrite)
        print(f"[DWSIM Manager] Flowsheet saved to: {filepath}")

    def add_compounds(self, compound_names: List[str]):
        """
        Add chemical compounds to the current flowsheet.
        
        Args:
            compound_names: List of compound names (e.g. ['Water', 'Ethanol', 'Methane']).
        """
        if not self.sim:
            raise ValueError("No active flowsheet. Call `create_flowsheet()` first.")

        added = []
        for name in compound_names:
            try:
                self.sim.AddCompound(name)
                added.append(name)
            except Exception as e:
                print(f"[DWSIM Manager] Error adding compound '{name}': {e}")

        print(f"[DWSIM Manager] Added compounds: {added}")
        return added

    def set_property_package(self, pp_name: str):
        """
        Create and assign a Property Package to the flowsheet.
        
        Args:
            pp_name: Name of property package (e.g. 'Peng-Robinson (PR)', 'NRTL', 'UNIQUAC', 'Raoult's Law').
        """
        if not self.sim:
            raise ValueError("No active flowsheet. Call `create_flowsheet()` first.")

        try:
            pp = self.sim.CreateAndAddPropertyPackage(pp_name)
            print(f"[DWSIM Manager] Assigned Property Package: {pp_name}")
            return pp
        except Exception as e:
            print(f"[DWSIM Manager] Error setting Property Package '{pp_name}': {e}")
            raise e

    def add_object(self, obj_type: str, x: int, y: int, name: str):
        """
        Add a flow object (Stream or Unit Operation) to the flowsheet.
        
        Args:
            obj_type: Object type string (e.g. 'MaterialStream', 'EnergyStream', 'Pump', 'Heater', 'Valve').
            x: X-coordinate on canvas.
            y: Y-coordinate on canvas.
            name: Name tag of the object.
        """
        if not self.sim:
            raise ValueError("No active flowsheet.")

        from DWSIM.Interfaces import System
        
        # Map common string names to System.ObjectType if available
        try:
            from DWSIM.Interfaces.Enums import ObjectType
            enum_type = getattr(ObjectType, obj_type)
            obj = self.sim.AddObject(enum_type, x, y, name)
        except Exception:
            # Fallback to direct string call if supported by interop
            obj = self.sim.AddObject(obj_type, x, y, name)

        print(f"[DWSIM Manager] Added object '{name}' of type '{obj_type}'")
        return obj

    def connect_objects(self, source_obj, target_obj, source_port: int = 0, target_port: int = 0):
        """
        Connect two objects in the flowsheet.
        
        Args:
            source_obj: Upstream object or stream.
            target_obj: Downstream object or stream.
            source_port: Source port index.
            target_port: Target port index.
        """
        if hasattr(self.sim, "ConnectObjects"):
            self.sim.ConnectObjects(source_obj.GraphicObject, target_obj.GraphicObject, source_port, target_port)
            print(f"[DWSIM Manager] Connected {source_obj.Name} -> {target_obj.Name}")

    def calculate_flowsheet(self) -> List[str]:
        """
        Solve/Calculate the current flowsheet.
        
        Returns:
            List of solver calculation error/warning messages.
        """
        if not self.sim:
            raise ValueError("No active flowsheet to calculate.")

        print("[DWSIM Manager] Solving flowsheet...")
        errors = self.interop.CalculateFlowsheet2(self.sim)
        
        err_list = [str(err) for err in errors] if errors else []
        if err_list:
            print(f"[DWSIM Manager] Solver finished with messages/warnings:\n" + "\n".join(err_list))
        else:
            print("[DWSIM Manager] Solver completed successfully with zero errors!")

        return err_list

    def get_material_stream_properties(self, stream_name: str) -> Dict[str, Any]:
        """
        Extract key thermodynamic and transport properties for a material stream.
        
        Args:
            stream_name: Name of the material stream.
            
        Returns:
            Dictionary containing temperature (K, C), pressure (Pa, bar), flow rates, compositions.
        """
        if not self.sim:
            raise ValueError("No active flowsheet.")

        stream = self.sim.GetObject(stream_name)
        if not stream:
            raise ValueError(f"Stream '{stream_name}' not found in flowsheet.")

        temp_k = float(stream.GetTemperature())
        press_pa = float(stream.GetPressure())
        mass_flow_kgs = float(stream.GetMassFlow())
        molar_flow_mols = float(stream.GetMolarFlow())
        vapor_frac = float(stream.GetVaporPhaseMolarFraction())

        # Extract composition
        comp_dict = {}
        try:
            comp_vector = stream.GetOverallComposition()
            compound_names = [c for c in self.sim.GetCompoundNames()]
            for i, comp_name in enumerate(compound_names):
                if i < len(comp_vector):
                    comp_dict[comp_name] = float(comp_vector[i])
        except Exception as e:
            print(f"[DWSIM Manager] Could not extract compositions for '{stream_name}': {e}")

        return {
            "Name": stream_name,
            "Temperature_K": temp_k,
            "Temperature_C": temp_k - 273.15,
            "Pressure_Pa": press_pa,
            "Pressure_bar": press_pa / 100000.0,
            "MassFlow_kgs": mass_flow_kgs,
            "MassFlow_kgh": mass_flow_kgs * 3600.0,
            "MolarFlow_mols": molar_flow_mols,
            "MolarFlow_kmolh": (molar_flow_mols * 3600.0) / 1000.0,
            "VaporFraction": vapor_frac,
            "Composition": comp_dict,
        }
