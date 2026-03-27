"""
Automates Base - Classe de base pour tous les automates
"""

from abc import ABC, abstractmethod
from enum import Enum
from typing import List, Dict, Tuple, Callable, Optional
from datetime import datetime


class AutomataBase(ABC):
    """Classe de base pour automates à états finis"""
    
    class State(Enum):
        """Surcharger dans classes dérivées"""
        pass
    
    def __init__(self, entity_id: str):
        """Initialiser automate"""
        self.entity_id = entity_id
        self.current_state: self.State = None  # To override
        self.history: List[Tuple[datetime, State, str, State]] = []
        self.actions: Dict[str, Callable] = {}  # Callbacks
        self.created_at = datetime.now()
    
    @abstractmethod
    def get_transitions(self) -> Dict[State, Dict[str, State]]:
        """Retourner table de transition"""
        pass
    
    def is_valid_transition(self, event: str) -> bool:
        """Vérifier si transition valide"""
        transitions = self.get_transitions()
        return event in transitions.get(self.current_state, {})
    
    def trigger(self, event: str) -> None:
        """Déclencher un événement"""
        if not self.is_valid_transition(event):
            raise ValueError(
                f"Invalid transition: {self.current_state.name} + {event}. "
                f"Valid events: {list(self.get_transitions().get(self.current_state, {}).keys())}"
            )
        
        transitions = self.get_transitions()
        new_state = transitions[self.current_state][event]
        
        # Enregistrer transition
        self.history.append((
            datetime.now(),
            self.current_state,
            event,
            new_state
        ))
        
        old_state = self.current_state
        self.current_state = new_state
        
        # Exécuter action associée si existe
        if event in self.actions:
            self.actions[event](old_state, new_state)
    
    def get_state(self) -> str:
        """Retourner l'état courant"""
        return self.current_state.value if self.current_state else "UNKNOWN"
    
    def get_state_name(self) -> str:
        """Retourner le nom d'état"""
        return self.current_state.name if self.current_state else "UNKNOWN"
    
    def verify_sequence(self, events: List[str]) -> bool:
        """Vérifier si une séquence d'événements est valide"""
        # Créer copie pour tester sans modifier l'état
        test_state = self.current_state
        transitions = self.get_transitions()
        
        for event in events:
            if event not in transitions.get(test_state, {}):
                return False
            test_state = transitions[test_state][event]
        
        return True
    
    def reset(self) -> None:
        """Réinitialiser automate"""
        self.current_state = self.get_initial_state()
        self.history = []
    
    @abstractmethod
    def get_initial_state(self) -> State:
        """Retourner état initial"""
        pass
    
    def register_action(self, event: str, callback: Callable) -> None:
        """Enregistrer callback pour un événement"""
        self.actions[event] = callback
    
    def get_history(self) -> List[Dict]:
        """Retourner historique formaté"""
        return [
            {
                "timestamp": ts.isoformat(),
                "from_state": from_state.name,
                "event": event,
                "to_state": to_state.name,
            }
            for ts, from_state, event, to_state in self.history
        ]
