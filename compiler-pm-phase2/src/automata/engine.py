"""
Automates Engine - Orchestrateur pour gérer automates
"""

from typing import Dict, Optional
from .automata import SensorAutomata, InterventionAutomata, VehicleAutomata


class AutomataEngine:
    """Orchestrateur pour gérer instances automates"""
    
    def __init__(self):
        """Initialiser engine"""
        self.automata_instances: Dict[str, object] = {}
        self.entity_types: Dict[str, str] = {}  # entity_id -> type
    
    def create_sensor_automata(self, sensor_id: str) -> SensorAutomata:
        """Créer instance automate capteur"""
        automata = SensorAutomata(sensor_id)
        self.automata_instances[sensor_id] = automata
        self.entity_types[sensor_id] = "sensor"
        return automata
    
    def create_intervention_automata(self, intervention_id: str) -> InterventionAutomata:
        """Créer instance automate intervention"""
        automata = InterventionAutomata(intervention_id)
        self.automata_instances[intervention_id] = automata
        self.entity_types[intervention_id] = "intervention"
        return automata
    
    def create_vehicle_automata(self, vehicle_id: str) -> VehicleAutomata:
        """Créer instance automate véhicule"""
        automata = VehicleAutomata(vehicle_id)
        self.automata_instances[vehicle_id] = automata
        self.entity_types[vehicle_id] = "vehicle"
        return automata
    
    def get_automata(self, entity_id: str) -> Optional[object]:
        """Récupérer instance automate"""
        return self.automata_instances.get(entity_id)
    
    def trigger_event(self, entity_id: str, event: str) -> bool:
        """Déclencher événement sur automate"""
        automata = self.get_automata(entity_id)
        if not automata:
            return False
        
        try:
            automata.trigger(event)
            return True
        except ValueError:
            return False
    
    def verify_sequence(self, entity_id: str, events: list) -> bool:
        """Vérifier validité d'une séquence"""
        automata = self.get_automata(entity_id)
        if not automata:
            return False
        return automata.verify_sequence(events)
    
    def get_state(self, entity_id: str) -> Optional[str]:
        """Obtenir état courant d'une entité"""
        automata = self.get_automata(entity_id)
        if not automata:
            return None
        return automata.get_state()
    
    def get_valid_transitions(self, entity_id: str) -> list:
        """Obtenir transitions valides depuis état courant"""
        automata = self.get_automata(entity_id)
        if not automata:
            return []
        
        transitions = automata.get_transitions()
        current_state = automata.current_state
        return list(transitions.get(current_state, {}).keys())
    
    def get_history(self, entity_id: str) -> list:
        """Obtenir historique des transitions"""
        automata = self.get_automata(entity_id)
        if not automata:
            return []
        return automata.get_history()
    
    def list_all_automata(self) -> Dict[str, Dict]:
        """Lister tous les automates"""
        result = {}
        for entity_id, automata in self.automata_instances.items():
            entity_type = self.entity_types.get(entity_id, "unknown")
            result[entity_id] = {
                "type": entity_type,
                "state": automata.get_state(),
                "valid_transitions": self.get_valid_transitions(entity_id),
            }
        return result
