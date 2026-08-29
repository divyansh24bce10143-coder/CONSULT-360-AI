"""
Utility functions for DWSIM Python Automation.
Includes unit conversion helpers, data extraction tools, and formatting.
"""

from typing import Dict, Any, List
import pandas as pd


def celsius_to_kelvin(celsius: float) -> float:
    """Convert Celsius to Kelvin."""
    return celsius + 273.15


def kelvin_to_celsius(kelvin: float) -> float:
    """Convert Kelvin to Celsius."""
    return kelvin - 273.15


def bar_to_pascal(bar: float) -> float:
    """Convert bar to Pascal."""
    return bar * 100000.0


def pascal_to_bar(pascal: float) -> float:
    """Convert Pascal to bar."""
    return pascal / 100000.0


def kPa_to_pascal(kpa: float) -> float:
    """Convert kPa to Pascal."""
    return kpa * 1000.0


def pascal_to_kPa(pascal: float) -> float:
    """Convert Pascal to kPa."""
    return pascal / 1000.0


def kw_to_watt(kw: float) -> float:
    """Convert kW to Watt."""
    return kw * 1000.0


def watt_to_kw(watt: float) -> float:
    """Convert Watt to kW."""
    return watt / 1000.0


def format_stream_summary(stream_data: Dict[str, Any]) -> str:
    """Format stream property data into a readable summary string."""
    lines = [
        f"=== Stream: {stream_data.get('Name', 'Unknown')} ===",
        f"Temperature: {stream_data.get('Temperature_C', 0):.2f} °C ({stream_data.get('Temperature_K', 0):.2f} K)",
        f"Pressure: {stream_data.get('Pressure_bar', 0):.3f} bar ({stream_data.get('Pressure_Pa', 0):.0f} Pa)",
        f"Mass Flow: {stream_data.get('MassFlow_kgh', 0):.2f} kg/h",
        f"Molar Flow: {stream_data.get('MolarFlow_kmolh', 0):.2f} kmol/h",
        f"Vapor Fraction: {stream_data.get('VaporFraction', 0):.4f}",
    ]
    
    comp = stream_data.get("Composition", {})
    if comp:
        lines.append("Compositions (Molar Fraction):")
        for compound, x in comp.items():
            lines.append(f"  - {compound}: {x:.4f}")
            
    return "\n".join(lines)


def export_results_to_csv(data_list: List[Dict[str, Any]], filepath: str) -> pd.DataFrame:
    """
    Export list of result dictionaries to a CSV file.
    
    Args:
        data_list: List of dictionaries containing simulation run data.
        filepath: Target CSV output path.
        
    Returns:
        Pandas DataFrame created from the result data.
    """
    df = pd.DataFrame(data_list)
    df.to_csv(filepath, index=False)
    print(f"Results successfully saved to {filepath}")
    return df
