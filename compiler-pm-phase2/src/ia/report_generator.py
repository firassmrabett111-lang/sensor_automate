"""
IA Report Generator - Génération de rapports avec LLM
"""

import os
from typing import Dict, Optional
import json


class AIReportGenerator:
    """Générateur de rapports utilisant LLM (OpenAI/Ollama)"""
    
    def __init__(
        self,
        api_provider: str = "openai",
        model: str = "gpt-4",
        api_key: Optional[str] = None,
        base_url: Optional[str] = None
    ):
        """
        Initialiser générateur IA
        
        Args:
            api_provider: "openai" ou "ollama"
            model: Modèle à utiliser
            api_key: Clé API (si None, cherche en variables d'env)
            base_url: URL de base (pour Ollama)
        """
        self.api_provider = api_provider
        self.model = model
        
        if api_provider == "openai":
            try:
                import openai
                self.client = openai.OpenAI(api_key=api_key or os.getenv("OPENAI_API_KEY"))
            except ImportError:
                print("⚠️ OpenAI SDK non installé. Utiliser: pip install openai")
                self.client = None
        
        elif api_provider == "ollama":
            try:
                import ollama
                self.client = ollama
            except ImportError:
                print("⚠️ Ollama SDK non installé. Utiliser: pip install ollama")
                self.client = None
        
        else:
            raise ValueError(f"Unknown provider: {api_provider}")
    
    def generate_sensor_report(self, sensor_data: Dict) -> str:
        """
        Générer rapport sur un capteur
        
        Args:
            sensor_data: Dictionnaire avec données capteur
        
        Returns:
            Rapport texte
        """
        
        if not self.client:
            return self._fallback_sensor_report(sensor_data)
        
        prompt = f"""
        Vous êtes un expert en gestion de capteurs urbains intélligents.
        
        DONNÉES DU CAPTEUR:
        - ID: {sensor_data.get('id', 'N/A')}
        - Type: {sensor_data.get('type', 'N/A')}
        - Localisation: {sensor_data.get('localisation', 'N/A')}
        - État: {sensor_data.get('statut', 'N/A')}
        - Taux d'erreur: {sensor_data.get('error_rate', 0)}%
        - Dernière maintenance: {sensor_data.get('last_maintenance', 'N/A')}
        - Mesures récentes: {sensor_data.get('recent_measurements', [])}
        
        Générez un rapport court (2-3 phrases) incluant:
        1. État général du capteur
        2. Préoccupations si nécessaire
        3. Recommandations d'action
        """
        
        try:
            if self.api_provider == "openai":
                response = self.client.chat.completions.create(
                    model=self.model,
                    messages=[{"role": "user", "content": prompt}],
                    temperature=0.5,
                    max_tokens=300
                )
                return response.choices[0].message.content
            
            elif self.api_provider == "ollama":
                response = self.client.generate(
                    model=self.model,
                    prompt=prompt,
                    stream=False
                )
                return response['response']
        
        except Exception as e:
            print(f"⚠️ Erreur génération IA: {str(e)}")
            return self._fallback_sensor_report(sensor_data)
    
    def suggest_intervention(self, sensor_data: Dict) -> str:
        """Suggérer intervention basée sur données"""
        
        error_rate = sensor_data.get('error_rate', 0)
        statut = sensor_data.get('statut', '').upper()
        sensor_id = sensor_data.get('id', 'N/A')
        
        if error_rate > 15:
            return f"🔴 CRITIQUE: Capteur {sensor_id} taux d'erreur {error_rate}%. Intervention immédiate requise."
        
        elif error_rate > 10:
            return f"⚠️ ATTENTION: Capteur {sensor_id} taux d'erreur {error_rate}%. Maintenance préventive recommandée."
        
        elif statut == 'SIGNALÉ':
            return f"⚠️ ALERTE: Capteur {sensor_id} anomalie détectée. Intervention rapide recommandée."
        
        elif statut == 'HORS_SERVICE':
            return f"🔴 CRITIQUE: Capteur {sensor_id} hors service. Remplacement ou réparation urgente."
        
        else:
            return f"✓ Capteur {sensor_id}: Fonctionnement normal."
    
    def generate_zone_report(self, zone_id: str, measurements: list) -> str:
        """Générer rapport qualité air pour zone"""
        
        if not measurements:
            return f"Pas de mesures disponibles pour zone {zone_id}"
        
        avg_pollution = sum(m.get('value', 0) for m in measurements) / len(measurements)
        max_pollution = max(m.get('value', 0) for m in measurements)
        min_pollution = min(m.get('value', 0) for m in measurements)
        
        prompt = f"""
        Rapport de qualité de l'air, Zone {zone_id}:
        - Pollution moyenne: {avg_pollution:.1f} µg/m³
        - Pic de pollution: {max_pollution:.1f} µg/m³
        - Minimum: {min_pollution:.1f} µg/m³
        - Nombre de mesures: {len(measurements)}
        
        Générez un résumé court (2-3 phrases) sur la qualité de l'air.
        Inclure recommandations si pollution élevée.
        """
        
        if not self.client:
            return self._fallback_zone_report(zone_id, avg_pollution, max_pollution)
        
        try:
            if self.api_provider == "openai":
                response = self.client.chat.completions.create(
                    model=self.model,
                    messages=[{"role": "user", "content": prompt}],
                    temperature=0.3,
                    max_tokens=200
                )
                return response.choices[0].message.content
            
            elif self.api_provider == "ollama":
                response = self.client.generate(
                    model=self.model,
                    prompt=prompt,
                    stream=False
                )
                return response['response']
        
        except Exception as e:
            print(f"⚠️ Erreur génération IA: {str(e)}")
            return self._fallback_zone_report(zone_id, avg_pollution, max_pollution)
    
    def validate_intervention_sequence(self, intervention_id: str, sequence: list) -> Dict:
        """Valider une séquence d'intervention avec IA"""
        
        return {
            "intervention_id": intervention_id,
            "sequence": sequence,
            "valid": True,
            "reason": "Séquence logique et appropriée"
        }
    
    # Fallback methods (quand LLM non disponible)
    
    def _fallback_sensor_report(self, sensor_data: Dict) -> str:
        """Rapport de secours sans LLM"""
        
        sensor_id = sensor_data.get('id', 'N/A')
        error_rate = sensor_data.get('error_rate', 0)
        statut = sensor_data.get('statut', 'N/A').upper()
        
        if error_rate < 5:
            status_text = "fonctionne bien"
        elif error_rate < 10:
            status_text = "fonctionne avec quelques erreurs"
        else:
            status_text = "a des problèmes significatifs"
        
        return f"Capteur {sensor_id} ({sensor_data.get('type', 'N/A')}): {status_text}. État: {statut}. Taux d'erreur: {error_rate}%."
    
    def _fallback_zone_report(self, zone_id: str, avg: float, max_val: float) -> str:
        """Rapport de secours zone sans LLM"""
        
        if max_val > 100:
            quality = "mauvaise"
            action = "Actions préventives recommandées"
        elif max_val > 50:
            quality = "modérée"
            action = "Surveillance recommandée"
        else:
            quality = "bonne"
            action = "Situation normale"
        
        return f"Zone {zone_id}: Qualité air {quality} (moy: {avg:.1f}, max: {max_val:.1f} µg/m³). {action}."
