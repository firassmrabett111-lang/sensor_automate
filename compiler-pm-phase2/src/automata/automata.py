"""
Automates - Implémentations concrètes
"""

from enum import Enum
from typing import Dict
from .base import AutomataBase


class SensorAutomata(AutomataBase):
    """Automate: Cycle de vie d'un Capteur"""
    
    class State(Enum):
        INACTIF = "inactif"
        ACTIF = "actif"
        SIGNALE = "signalé"
        EN_MAINTENANCE = "en_maintenance"
        HORS_SERVICE = "hors_service"
    
    def __init__(self, entity_id: str):
        """Initialiser automate capteur"""
        self.entity_id = entity_id
        self.current_state = self.State.INACTIF
        self.history = []
        self.actions = {}
        super().__init__(entity_id)
        self.current_state = self.State.INACTIF
    
    def get_initial_state(self) -> State:
        return self.State.INACTIF
    
    def get_transitions(self) -> Dict[State, Dict[str, State]]:
        """Retourner table de transitions pour capteur"""
        return {
            self.State.INACTIF: {
                "installation": self.State.ACTIF,
            },
            self.State.ACTIF: {
                "detection_anomalie": self.State.SIGNALE,
                "panne": self.State.HORS_SERVICE,
            },
            self.State.SIGNALE: {
                "reparation": self.State.EN_MAINTENANCE,
                "panne": self.State.HORS_SERVICE,
                "reset": self.State.ACTIF,
            },
            self.State.EN_MAINTENANCE: {
                "reparation_complete": self.State.ACTIF,
                "panne": self.State.HORS_SERVICE,
            },
            self.State.HORS_SERVICE: {
                "remplacement": self.State.INACTIF,
                "reactivation": self.State.ACTIF,
            },
        }


class InterventionAutomata(AutomataBase):
    """Automate: Validation d'Intervention (workflow)"""
    
    class State(Enum):
        DEMANDE = "demande"
        TECH1_ASSIGNÉ = "tech1_assigné"
        TECH2_VALIDE = "tech2_valide"
        IA_VALIDE = "ia_valide"
        TERMINÉ = "terminé"
        REJETÉE = "rejetée"
    
    def __init__(self, entity_id: str):
        """Initialiser automate intervention"""
        self.entity_id = entity_id
        self.current_state = self.State.DEMANDE
        self.history = []
        self.actions = {}
        super().__init__(entity_id)
        self.current_state = self.State.DEMANDE
    
    def get_initial_state(self) -> State:
        return self.State.DEMANDE
    
    def get_transitions(self) -> Dict[State, Dict[str, State]]:
        """Retourner table de transitions pour intervention"""
        return {
            self.State.DEMANDE: {
                "assigner_tech1": self.State.TECH1_ASSIGNÉ,
                "rejeter": self.State.REJETÉE,
            },
            self.State.TECH1_ASSIGNÉ: {
                "assigner_tech2": self.State.TECH2_VALIDE,
                "rejeter": self.State.REJETÉE,
            },
            self.State.TECH2_VALIDE: {
                "valider_ia": self.State.IA_VALIDE,
                "rejeter": self.State.REJETÉE,
            },
            self.State.IA_VALIDE: {
                "completer": self.State.TERMINÉ,
                "rejeter": self.State.REJETÉE,
            },
            self.State.TERMINÉ: {},
            self.State.REJETÉE: {
                "reinitialiser": self.State.DEMANDE,
            },
        }


class VehicleAutomata(AutomataBase):
    """Automate: Trajet Véhicule Autonome"""
    
    class State(Enum):
        STATIONNÉ = "stationné"
        EN_ROUTE = "en_route"
        EN_PANNE = "en_panne"
        ARRIVÉ = "arrivé"
    
    def __init__(self, entity_id: str):
        """Initialiser automate véhicule"""
        self.entity_id = entity_id
        self.current_state = self.State.STATIONNÉ
        self.history = []
        self.actions = {}
        super().__init__(entity_id)
        self.current_state = self.State.STATIONNÉ
    
    def get_initial_state(self) -> State:
        return self.State.STATIONNÉ
    
    def get_transitions(self) -> Dict[State, Dict[str, State]]:
        """Retourner table de transitions pour véhicule"""
        return {
            self.State.STATIONNÉ: {
                "demarrage": self.State.EN_ROUTE,
            },
            self.State.EN_ROUTE: {
                "panne_detectée": self.State.EN_PANNE,
                "destination_atteinte": self.State.ARRIVÉ,
            },
            self.State.EN_PANNE: {
                "reparation_complete": self.State.EN_ROUTE,
                "remorquage": self.State.STATIONNÉ,
            },
            self.State.ARRIVÉ: {
                "stationnement": self.State.STATIONNÉ,
                "redemarrage": self.State.EN_ROUTE,
            },
        }
