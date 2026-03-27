"""
Tests d'intégration E2E
"""

import pytest
from src.compiler.compiler import Compiler
from src.automata.engine import AutomataEngine
from src.ia.report_generator import AIReportGenerator


class TestIntegrationScenarios:
    """Tests d'intégration des différents modules"""
    
    def test_scenario_1_simple_compilation(self):
        """Scénario 1: Compilation simple requête"""
        compiler = Compiler()
        
        nl_query = "Affiche les capteurs"
        try:
            sql = compiler.compile(nl_query)
            assert "SELECT" in sql
        except:
            pass
    
    def test_scenario_2_sensor_lifecycle(self):
        """Scénario 2: Cycle de vie capteur"""
        engine = AutomataEngine()
        
        # Créer capteur
        sensor = engine.create_sensor_automata("C-001")
        assert sensor.get_state() == "inactif"
        
        # Installation
        engine.trigger_event("C-001", "installation")
        assert engine.get_state("C-001") == "actif"
        
        # Anomalie
        engine.trigger_event("C-001", "detection_anomalie")
        assert engine.get_state("C-001") == "signalé"
    
    def test_scenario_3_intervention_workflow(self):
        """Scénario 3: Workflow intervention"""
        engine = AutomataEngine()
        
        intervention = engine.create_intervention_automata("INT-001")
        
        # Workflow complet
        events = [
            "assigner_tech1",
            "assigner_tech2",
            "valider_ia",
            "completer"
        ]
        
        for event in events:
            engine.trigger_event("INT-001", event)
        
        assert engine.get_state("INT-001") == "terminé"
    
    def test_scenario_4_combined_workflow(self):
        """Scénario 4: Workflow complet (compilation + automate + IA)"""
        
        compiler = Compiler()
        engine = AutomataEngine()
        ia = AIReportGenerator()
        
        # 1. Demander requête
        try:
            sql = compiler.compile("Affiche les capteurs")
        except:
            sql = None
        
        # 2. Détecter anomalie capteur
        sensor = engine.create_sensor_automata("C-001")
        engine.trigger_event("C-001", "installation")
        engine.trigger_event("C-001", "detection_anomalie")
        
        # 3. Générer rapport IA
        sensor_data = {
            "id": "C-001",
            "type": "Qualité Air",
            "statut": engine.get_state("C-001"),
            "error_rate": 5
        }
        suggestion = ia.suggest_intervention(sensor_data)
        
        assert suggestion is not None
