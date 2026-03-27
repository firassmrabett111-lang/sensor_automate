"""
Tests pour les Automates
"""

import pytest
from src.automata.engine import AutomataEngine
from src.automata.automata import SensorAutomata, InterventionAutomata, VehicleAutomata


class TestSensorAutomata:
    """Tests automate capteur"""
    
    def test_initial_state(self):
        """Test état initial"""
        automata = SensorAutomata("C-001")
        assert automata.get_state() == "inactif"
    
    def test_valid_transition(self):
        """Test transition valide"""
        automata = SensorAutomata("C-001")
        automata.trigger("installation")
        assert automata.get_state() == "actif"
    
    def test_invalid_transition(self):
        """Test transition invalide"""
        automata = SensorAutomata("C-001")
        with pytest.raises(ValueError):
            automata.trigger("reparation")  # Invalide depuis INACTIF
    
    def test_transition_sequence(self):
        """Test séquence transitions"""
        automata = SensorAutomata("C-001")
        
        automata.trigger("installation")
        assert automata.get_state() == "actif"
        
        automata.trigger("detection_anomalie")
        assert automata.get_state() == "signalé"
        
        assert len(automata.history) == 2


class TestInterventionAutomata:
    """Tests automate intervention"""
    
    def test_intervention_workflow(self):
        """Test workflow intervention"""
        automata = InterventionAutomata("INT-001")
        
        assert automata.get_state() == "demande"
        
        automata.trigger("assigner_tech1")
        assert automata.get_state() == "tech1_assigné"


class TestVehicleAutomata:
    """Tests automate véhicule"""
    
    def test_vehicle_journey(self):
        """Test parcours véhicule"""
        automata = VehicleAutomata("V-001")
        
        automata.trigger("demarrage")
        assert automata.get_state() == "en_route"
        
        automata.trigger("destination_atteinte")
        assert automata.get_state() == "arrivé"


class TestAutomataEngine:
    """Tests engine orchestrateur"""
    
    def test_create_automata(self, automata_engine):
        """Test création automates"""
        sensor = automata_engine.create_sensor_automata("C-001")
        assert sensor is not None
    
    def test_trigger_event(self, automata_engine):
        """Test déclenchement événement"""
        automata_engine.create_sensor_automata("C-001")
        
        result = automata_engine.trigger_event("C-001", "installation")
        assert result == True
    
    def test_verify_sequence(self, automata_engine):
        """Test vérification séquence"""
        automata_engine.create_sensor_automata("C-001")
        
        valid = automata_engine.verify_sequence("C-001", ["installation", "detection_anomalie"])
        assert valid == True
        
        invalid = automata_engine.verify_sequence("C-001", ["reparation"])
        assert invalid == False
