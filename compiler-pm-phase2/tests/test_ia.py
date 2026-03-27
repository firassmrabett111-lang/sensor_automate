"""
Tests pour module IA
"""

import pytest
from src.ia.report_generator import AIReportGenerator


class TestAIReportGenerator:
    """Tests générateur rapports IA"""
    
    def test_sensor_report_fallback(self):
        """Test génération rapport capteur (fallback)"""
        ia = AIReportGenerator()
        
        sensor_data = {
            "id": "C-001",
            "type": "Qualité Air",
            "statut": "ACTIF",
            "error_rate": 2.5,
        }
        
        report = ia._fallback_sensor_report(sensor_data)
        assert report is not None
        assert "C-001" in report
    
    def test_suggest_intervention(self):
        """Test suggestions intervention"""
        ia = AIReportGenerator()
        
        sensor_data = {
            "id": "C-001",
            "statut": "HORS_SERVICE",
            "error_rate": 5
        }
        
        suggestion = ia.suggest_intervention(sensor_data)
        assert "CRITIQUE" in suggestion
    
    def test_zone_report_fallback(self):
        """Test rapport zone (fallback)"""
        ia = AIReportGenerator()
        
        report = ia._fallback_zone_report("Zone-1", 45.5, 60.0)
        assert report is not None
        assert "Zone-1" in report
