# 📋 ANALYSE COMPLÈTE DU PROJET PM-COMPILATION 2025-26
**Plateforme Smart City avec Compilation et IA Générative**

---

## 📍 STATUT DU PROJET

| Élément | Statut | Détails |
|---------|--------|---------|
| **Phase 1** | ✅ COMPLÉTÉE | Plateforme SensorLinker (Frontend + Backend + MySQL) |
| **Phase 2** | 🔄 À DÉMARRER | Compilation NL→SQL + Automates + IA générative |
| **Durée totale** | ⏱️ 6 semaines | À partir de Mars 26, 2026 |
| **Équipe** | 👥 2 étudiants | Firaz Mrabett + ... |

---

## 🎯 OBJECTIFS PÉDAGOGIQUES

1. ✓ Appliquer la **théorie des langages** (concepts du cours)
2. ✓ Modéliser les processus avec des **automates à états finis**
3. ✓ Intégrer **l'IA générative** dans un système réel
4. ✓ Développer une **architecture logicielle complète**
5. ✓ Travailler sur des **données urbaines réelles** (simulées)

---

## 🏗️ STRUCTURE DU PROJET (3 PARTIES)

### **PARTIE 1: MODÉLISATION ET CONCEPTION (25%)**

#### 1.1 Automates à États Finis (AEF)

Modéliser 3 automates déterministes:

**A) Cycle de Vie d'un Capteur**
```
États: INACTIF → ACTIF → SIGNALÉ → EN_MAINTENANCE → HORS_SERVICE

Événements:
- installation (INACTIF → ACTIF)
- détection_anomalie (ACTIF → SIGNALÉ)
- réparation (SIGNALÉ → EN_MAINTENANCE ou EN_MAINTENANCE → ACTIF)
- panne (ACTIF → HORS_SERVICE)
- remplacement (HORS_SERVICE → INACTIF)

Livrables:
- Diagramme graphique (Graphviz/Draw.io)
- Table de transition (état × symbole → état)
- Règles de déterminisme
```

**B) Validation d'Intervention (Workflow)**
```
États: 
DEMANDE 
  → TECH1_ASSIGNÉ
  → TECH2_VALIDE
  → IA_VALIDE
  → TERMINÉ

Événements:
- creer_demande (INITIAL → DEMANDE)
- assigner_tech1 (DEMANDE → TECH1_ASSIGNÉ)
- assigner_tech2 (TECH1_ASSIGNÉ → TECH2_VALIDE)
- valider_ia (TECH2_VALIDE → IA_VALIDE)
- completer (IA_VALIDE → TERMINÉ)
- rejeter (TECH1_ASSIGNÉ/TECH2_VALIDE/IA_VALIDE → DEMANDE)

Livrables:
- Diagramme avec boucles de rejet
- Conditions de transition
- Actions déclenché à chaque transition
```

**C) Trajet Véhicule Autonome**
```
États: STATIONNÉ → EN_ROUTE → EN_PANNE → ARRIVÉ

Événements:
- demarrage (STATIONNÉ → EN_ROUTE)
- panne_detectée (EN_ROUTE → EN_PANNE)
- reparation_complete (EN_PANNE → EN_ROUTE)
- destination_atteinte (EN_ROUTE → ARRIVÉ)
- stationnement (ARRIVÉ → STATIONNÉ)

Livrables:
- Diagramme minimal
- Table de transition complète
```

#### 1.2 Schéma Base de Données
```
Tables requises (déjà existantes dans SensorLinker):
- capteurs (id, nom, type, localisation, statut, date_installation)
- interventions (id, capteur_id, description, statut_intervention, date_demande)
- citoyens (id, nom, email, score_ecolo, quartier)
- vehicules (id, immatriculation, type, statut, co2_emissions)
- mesures (capteur_id, timestamp, valeur, unite)
- techniciens (id, nom, specialite, disponible)
- trajets (id, vehicle_id, point_depart, destination, economie_co2)

Contraintes:
- Clés primaires et étrangères
- Normalisation 3FN minimum
- Indices sur colonnes critiques (statut, timestamp)
```

---

### **PARTIE 2: DÉVELOPPEMENT (30%)**

#### 2.1 Moteur de Compilation (NL → SQL)

**Architecture du Compilateur:**

```
┌─────────────────────────────────────────┐
│     Requête en Langage Naturel          │
│  "Affiche les 5 zones les plus polluées"│
└────────────────┬────────────────────────┘
                 │
                 ▼
        ┌────────────────┐
        │   1. LEXER     │  Tokenization
        │ (Tokenization) │  → [VERBE, ARTICLE, NOMBRE, ...]
        └────────────────┘
                 │
                 ▼
        ┌────────────────┐
        │   2. PARSER    │  Analyse syntaxique
        │  (Grammaire)   │  → Construction AST
        └────────────────┘
                 │
                 ▼
        ┌────────────────┐
        │  3. AST BUILD  │  Arbre Syntaxique Abstrait
        │  (Nœuds)       │
        └────────────────┘
                 │
                 ▼
        ┌────────────────┐
        │  4. SEMANTICS  │  Vérification sémantique
        │  (Validation)  │  → Types, colonnes, fonctions
        └────────────────┘
                 │
                 ▼
        ┌────────────────┐
        │  5. CODEGEN    │  Génération SQL
        │  (SQL)         │  → SELECT zone, AVG(pollution)...
        └────────────────┘
                 │
                 ▼
     SELECT zone, AVG(pollution) FROM mesures 
     GROUP BY zone ORDER BY AVG(pollution) DESC LIMIT 5
```

**Grammaire EBNF Simplifiée:**

```ebnf
QUERY       ::= SELECT_QUERY | COUNT_QUERY | STATS_QUERY
SELECT_QUERY ::= "Affiche" | "Montre" | "Donne" COLUMNS FROM_CLAUSE [WHERE_CLAUSE] [ORDER_BY] [LIMIT]
COUNT_QUERY ::= "Combien" "de" ENTITY "sont" CONDITION
STATS_QUERY ::= ENTITY_QUERY FILTER_CLAUSE

COLUMNS     ::= COLUMN_NAME | COLUMN_NAME "," COLUMNS | "*"
COLUMN_NAME ::= IDENTIFIER | FUNCTION "(" IDENTIFIER ")"
FUNCTION    ::= "moyenne" | "total" | "min" | "max" | "nombre"

FROM_CLAUSE ::= "de" | "du" | "d'" ENTITY
ENTITY      ::= "capteurs" | "interventions" | "citoyens" | "zones" | ...

WHERE_CLAUSE ::= "où" | "si" CONDITION ["et" CONDITION]*
CONDITION   ::= IDENTIFIER OPERATOR VALUE
OPERATOR    ::= ">" | "<" | "=" | "!=" | ">=" | "<="
VALUE       ::= NUMBER | STRING | IDENTIFIER

ORDER_BY    ::= "ordonnés" | "triés" "par" IDENTIFIER ["croissant" | "décroissant"]
LIMIT       ::= "les" NUMBER "premiers" | "max" NUMBER
```

**Implémentation Python (Structure):**

```python
# lexer.py
class Token:
    def __init__(self, type, value, position):
        self.type = type
        self.value = value
        self.position = position

class Lexer:
    KEYWORDS = {"affiche", "montre", "combien", "où", "et", ...}
    FUNCTIONS = {"moyenne", "total", "min", "max", "nombre"}
    
    def tokenize(self, text) -> List[Token]:
        # Découper en tokens, reconnaître mots-clés, opérateurs, etc.
        pass

# parser.py
class Parser:
    def __init__(self, tokens):
        self.tokens = tokens
        self.pos = 0
    
    def parse(self) -> ASTNode:
        # Construire l'arbre syntaxique selon la grammaire
        pass
    
    def parse_query(self) -> SelectNode:
        pass
    
    def parse_where(self) -> WhereNode:
        pass

# ast.py
class ASTNode:
    pass

class SelectNode(ASTNode):
    def __init__(self, columns, from_clause, where, order_by, limit):
        self.columns = columns
        self.from_clause = from_clause
        self.where = where
        self.order_by = order_by
        self.limit = limit

class ConditionNode(ASTNode):
    def __init__(self, left, operator, right):
        self.left = left
        self.operator = operator
        self.right = right

# codegen.py
class CodeGenerator:
    def generate(self, ast: ASTNode) -> str:
        """Transformer AST en SQL"""
        if isinstance(ast, SelectNode):
            return self._generate_select(ast)
    
    def _generate_select(self, node: SelectNode) -> str:
        query = "SELECT " + ", ".join(node.columns)
        query += " FROM " + node.from_clause
        if node.where:
            query += " WHERE " + self._generate_where(node.where)
        # ... ORDER BY, LIMIT, etc.
        return query

# compiler.py
class Compiler:
    def compile(self, text: str) -> str:
        """NL → SQL Pipeline"""
        lexer = Lexer(text)
        tokens = lexer.tokenize(text)
        
        parser = Parser(tokens)
        ast = parser.parse()
        
        codegen = CodeGenerator()
        sql = codegen.generate(ast)
        
        return sql
```

#### 2.2 Moteur d'Automates

**Implémentation Python:**

```python
# automata.py
from enum import Enum
from typing import Dict, Callable, List

class AutomataEngine:
    """Engine pour gérer les automates avec state machine"""
    
    def __init__(self):
        self.automata_instances = {}  # {entity_id: AutomataeInstance}
    
    class SensorAutomata:
        """Automate de cycle de vie capteur"""
        
        class State(Enum):
            INACTIF = "inactif"
            ACTIF = "actif"
            SIGNALE = "signalé"
            EN_MAINTENANCE = "en_maintenance"
            HORS_SERVICE = "hors_service"
        
        TRANSITIONS = {
            State.INACTIF: {
                "installation": State.ACTIF
            },
            State.ACTIF: {
                "detection_anomalie": State.SIGNALE,
                "panne": State.HORS_SERVICE
            },
            State.SIGNALE: {
                "reparation": State.EN_MAINTENANCE,
                "panne": State.HORS_SERVICE
            },
            State.EN_MAINTENANCE: {
                "reparation_complete": State.ACTIF,
                "panne": State.HORS_SERVICE
            },
            State.HORS_SERVICE: {
                "remplacement": State.INACTIF
            }
        }
        
        def __init__(self):
            self.current_state = self.State.INACTIF
            self.history = []
            self.actions = {}  # callbacks pour événements
        
        def is_valid_transition(self, event: str) -> bool:
            """Vérifie si transition existe du statut courant"""
            return event in self.TRANSITIONS.get(self.current_state, {})
        
        def trigger(self, event: str):
            """Déclencher un événement"""
            if not self.is_valid_transition(event):
                raise ValueError(f"Transition invalide: {self.current_state} + {event}")
            
            new_state = self.TRANSITIONS[self.current_state][event]
            self.history.append((self.current_state, event, new_state))
            self.current_state = new_state
            
            # Exécuter actions associées
            if event in self.actions:
                self.actions[event]()
        
        def get_state(self) -> str:
            return self.current_state.value
    
    class InterventionAutomata:
        """Automate de validation d'intervention"""
        
        class State(Enum):
            DEMANDE = "demande"
            TECH1_ASSIGNÉ = "tech1_assigné"
            TECH2_VALIDE = "tech2_valide"
            IA_VALIDE = "ia_valide"
            TERMINÉ = "terminé"
        
        TRANSITIONS = {
            State.DEMANDE: {
                "assigner_tech1": State.TECH1_ASSIGNÉ,
                "rejeter": State.DEMANDE
            },
            State.TECH1_ASSIGNÉ: {
                "assigner_tech2": State.TECH2_VALIDE,
                "rejeter": State.DEMANDE
            },
            State.TECH2_VALIDE: {
                "valider_ia": State.IA_VALIDE,
                "rejeter": State.DEMANDE
            },
            State.IA_VALIDE: {
                "completer": State.TERMINÉ,
                "rejeter": State.DEMANDE
            },
            State.TERMINÉ: {}
        }
        
        def __init__(self):
            self.current_state = self.State.DEMANDE
            self.history = []
        
        def trigger(self, event: str):
            if event not in self.TRANSITIONS.get(self.current_state, {}):
                raise ValueError(f"Transition invalide: {self.current_state} + {event}")
            
            self.current_state = self.TRANSITIONS[self.current_state][event]
            self.history.append((self.current_state, event))
    
    def create_sensor_automata(self, sensor_id: str) -> SensorAutomata:
        """Créer instance automate capteur"""
        automata = self.SensorAutomata()
        self.automata_instances[sensor_id] = automata
        return automata
    
    def verify_sequence(self, entity_id: str, events: List[str]) -> bool:
        """Vérifier si une séquence d'événements est valide"""
        if entity_id not in self.automata_instances:
            return False
        
        automata = self.automata_instances[entity_id]
        
        try:
            for event in events:
                automata.trigger(event)
            return True
        except ValueError:
            return False
    
    def trigger_alert_on_timeout(self, sensor_id: str, max_time_seconds: int):
        """Déclencher alerte si capteur reste en HORS_SERVICE > max_time"""
        # Implémentation avec timers
        pass
```

#### 2.3 Module d'IA Générative

**Intégration avec OpenAI/Ollama:**

```python
# ia_module.py
import openai
from typing import List, Dict
import json

class AIReportGenerator:
    """Génération de rapports et suggestions avec IA"""
    
    def __init__(self, api_key: str = None, model: str = "gpt-4"):
        self.model = model
        if api_key:
            openai.api_key = api_key
    
    def generate_sensor_report(self, sensor_data: Dict) -> str:
        """Générer rapport sur qualité d'un capteur"""
        
        prompt = f"""
        Vous êtes un expert en gestion de capteurs urbains. 
        
        Données du capteur:
        - ID: {sensor_data['id']}
        - Type: {sensor_data['type']}
        - Localisation: {sensor_data['localisation']}
        - Statut: {sensor_data['statut']}
        - Taux d'erreur: {sensor_data['error_rate']}%
        - Dernière maintenance: {sensor_data['last_maintenance']}
        - Mesures récentes: {sensor_data['recent_measurements']}
        
        Générez un rapport professionnel court (3-4 phrases) incluant:
        1. État général du capteur
        2. Points de préoccupation
        3. Actions recommandées
        """
        
        response = openai.ChatCompletion.create(
            model=self.model,
            messages=[{"role": "user", "content": prompt}],
            temperature=0.5,
            max_tokens=300
        )
        
        return response['choices'][0]['message']['content']
    
    def generate_zone_report(self, zone_id: str, measurements: List[Dict]) -> str:
        """Rapport qualité air par zone"""
        
        avg_pollution = sum(m['value'] for m in measurements) / len(measurements)
        max_pollution = max(m['value'] for m in measurements)
        
        prompt = f"""
        Rapport de qualité de l'air pour la zone {zone_id}:
        - Pollution moyenne: {avg_pollution:.1f} µg/m³
        - Pic de pollution: {max_pollution:.1f} µg/m³
        - Nombre de mesures: {len(measurements)}
        
        Générez un rapport court sur la qualité de l'air de cette zone.
        """
        
        response = openai.ChatCompletion.create(
            model=self.model,
            messages=[{"role": "user", "content": prompt}],
            temperature=0.3
        )
        
        return response['choices'][0]['message']['content']
    
    def suggest_intervention(self, sensor_data: Dict) -> str:
        """Suggérer intervention basée sur données"""
        
        if sensor_data['error_rate'] > 10:
            return f"⚠️ INTERVENTION RECOMMANDÉE: Le capteur {sensor_data['id']} a un taux d'erreur de {sensor_data['error_rate']}%. Maintenance préventive conseillée."
        
        if sensor_data['statut'] == 'SIGNALÉ':
            return f"⚠️ ALERTE: Le capteur {sensor_data['id']} a détecté une anomalie. Intervention rapide recommandée."
        
        return "✓ Le capteur fonctionne normalement."
    
    def validate_intervention_sequence(self, intervention_id: str, sequence: List[str]) -> str:
        """Validation IA d'une séquence d'intervention"""
        
        prompt = f"""
        Validez cette séquence d'intervention (ID: {intervention_id}):
        {' → '.join(sequence)}
        
        Est-ce une séquence logique et prudente? 
        Répondez par "VALIDÉ" ou "REJETÉ" avec justification.
        """
        
        response = openai.ChatCompletion.create(
            model=self.model,
            messages=[{"role": "user", "content": prompt}],
            temperature=0.0
        )
        
        return response['choices'][0]['message']['content']
```

#### 2.4 Tableau de Bord Interactif

**Interface avec Streamlit (ou React/TypeScript pour cohérence SensorLinker):**

```python
# dashboard.py
import streamlit as st
import plotly.express as px
from datetime import datetime
from compiler import Compiler
from automata import AutomataEngine
from ia_module import AIReportGenerator

st.set_page_config(page_title="Smart City Dashboard", layout="wide")

# Sidebar
st.sidebar.title("🌍 Smart City Management")

page = st.sidebar.radio(
    "Navigation",
    ["Dashboard", "Requêtes NL→SQL", "Automates", "Rapports IA", "Paramètres"]
)

compiler = Compiler()
automata_engine = AutomataEngine()
ia_gen = AIReportGenerator()

# ─────────────────────────────────────────────

if page == "Dashboard":
    st.title("📊 Dashboard Principal")
    
    col1, col2, col3 = st.columns(3)
    
    with col1:
        st.metric("Capteurs en Ligne", 156, "+5")
    
    with col2:
        st.metric("Interventions Actives", 12, "-3")
    
    with col3:
        st.metric("Qualité Air Moy.", "45 µg/m³", "-2%")
    
    # Graphiques
    st.subheader("Mesures Récentes par Zone")
    # df = query_recent_measurements()
    # fig = px.bar(df, x="zone", y="pollution", color="zone")
    # st.plotly_chart(fig)

# ─────────────────────────────────────────────

elif page == "Requêtes NL→SQL":
    st.title("🔤 Compilateur NL → SQL")
    
    st.write("**Entrez une requête en langage naturel:**")
    
    nl_query = st.text_area(
        "Requête",
        placeholder="Ex: Affiche les 5 zones les plus polluées",
        height=100
    )
    
    if st.button("🔄 Compiler en SQL"):
        try:
            sql = compiler.compile(nl_query)
            
            st.success("✓ Compilation réussie!")
            
            col1, col2 = st.columns(2)
            
            with col1:
                st.subheader("SQL Généré")
                st.code(sql, language="sql")
            
            with col2:
                st.subheader("Résultats")
                # results = execute_sql(sql)
                # st.dataframe(results)
        
        except Exception as e:
            st.error(f"❌ Erreur de compilation: {str(e)}")

# ─────────────────────────────────────────────

elif page == "Automates":
    st.title("🤖 Moteur d'Automates")
    
    automata_type = st.selectbox(
        "Type d'automate",
        ["Cycle de Capteur", "Validation d'Intervention", "Trajet Véhicule"]
    )
    
    if automata_type == "Cycle de Capteur":
        st.subheader("État d'un Capteur")
        
        sensor_id = st.text_input("ID Capteur", "C-001")
        
        col1, col2 = st.columns(2)
        
        with col1:
            st.write("**État Actuel:** ACTIF ✓")
            st.write("**Transitions Valides:**")
            st.write("- detection_anomalie → SIGNALÉ")
            st.write("- panne → HORS_SERVICE")
        
        with col2:
            if st.button("📊 Afficher Diagramme"):
                st.image("./diagrams/sensor_automata.png")
            
            if st.button("⏱️ Historique"):
                st.write("""
                | Timestamp | Événement | Nouvel État |
                |-----------|-----------|-------------|
                | 10:30 | installation | ACTIF |
                | 14:15 | detection_anomalie | SIGNALÉ |
                """)

# ─────────────────────────────────────────────

elif page == "Rapports IA":
    st.title("📄 Rapports Générés par IA")
    
    report_type = st.selectbox(
        "Type de rapport",
        ["Rapport de Zone", "Statut Capteur", "Qualité de l'Air", "Interventions"]
    )
    
    if st.button("🤖 Générer Rapport"):
        with st.spinner("Génération en cours..."):
            # report = ia_gen.generate_zone_report("zone_1", measurements)
            st.success("✓ Rapport généré!")
            
            report_text = """
            **Rapport Qualité Air - Zone 5**
            
            La pollution moyenne mesurée dans la zone 5 est de 47 µg/m³...
            """
            
            st.write(report_text)

# ─────────────────────────────────────────────

elif page == "Paramètres":
    st.title("⚙️ Paramètres")
    
    st.subheader("Configuration IA")
    api_provider = st.selectbox("Fournisseur IA", ["OpenAI", "Ollama", "Cohere"])
    api_key = st.text_input("Clé API", type="password")
```

---

### **PARTIE 3: DONNÉES ET TESTS (15%)**

#### 3.1 Base de Données

```sql
-- Seed données réalistes (~1000+ enregistrements)

-- Capteurs (200)
INSERT INTO capteurs (nom, type, localisation, statut, date_installation)
VALUES 
  ('C-001', 'Qualité Air', 'Zone Centre', 'ACTIF', '2024-01-15'),
  ('C-002', 'Pollution', 'Zone 5', 'ACTIF', '2024-02-10'),
  ('C-003', 'Température', 'Zone Nord', 'SIGNALÉ', '2024-03-05'),
  ...

-- Mesures temporelles (+ de 2000)
INSERT INTO mesures (capteur_id, timestamp, valeur, unite)
VALUES
  (1, '2026-03-26 08:00:00', 42.5, 'µg/m³'),
  (1, '2026-03-26 09:00:00', 45.2, 'µg/m³'),
  ...

-- Interventions (100+)
INSERT INTO interventions 
VALUES (1, 1, 'Maintenance capteur', 'TERMINÉE', '2026-03-20'),
...
```

#### 3.2 Scénarios de Test

**Test 1: Requête Simple**
```python
def test_simple_query():
    compiler = Compiler()
    nl = "Affiche les 5 zones les plus polluées"
    sql = compiler.compile(nl)
    
    expected = "SELECT zone, AVG(pollution) FROM mesures GROUP BY zone ORDER BY AVG(pollution) DESC LIMIT 5"
    
    assert normalize_sql(sql) == normalize_sql(expected)
    print("✓ Test 1 Passed")
```

**Test 2: Automate Capteur - Transition Valide**
```python
def test_sensor_automata_valid_transition():
    automata = SensorAutomata()
    
    automata.trigger("installation")  # INACTIF → ACTIF
    assert automata.get_state() == "ACTIF"
    
    automata.trigger("detection_anomalie")  # ACTIF → SIGNALÉ
    assert automata.get_state() == "SIGNALÉ"
    
    print("✓ Test 2 Passed")
```

**Test 3: Automate - Transition Invalide**
```python
def test_sensor_automata_invalid_transition():
    automata = SensorAutomata()
    
    try:
        automata.trigger("reparation")  # Invalide depuis INACTIF
        assert False, "Should have raised error"
    except ValueError:
        print("✓ Test 3 Passed")
```

**Test 4: Requête Complexe avec Conditions**
```python
def test_complex_query():
    compiler = Compiler()
    nl = "Quels citoyens ont un score écologique > 80 ?"
    sql = compiler.compile(nl)
    
    expected = "SELECT nom, score FROM citoyens WHERE score_ecolo > 80 ORDER BY score_ecolo DESC"
    
    assert normalize_sql(sql) == normalize_sql(expected)
    print("✓ Test 4 Passed")
```

**Test 5: Scénario Complet (Intégration)**
```python
def test_complete_scenario():
    # Setup
    db = Database("test.db")
    compiler = Compiler()
    automata = SensorAutomata()
    ia = AIReportGenerator()
    
    # 1. Capteur détecte anomalie
    automata.trigger("installation")
    automata.trigger("detection_anomalie")
    assert automata.get_state() == "SIGNALÉ"
    
    # 2. Système crée demande d'intervention
    intervention = create_intervention(sensor_id=1, description="Anomalie détectée")
    
    # 3. Requête: "Quelles interventions sont en cours?"
    sql = compiler.compile("Quelles interventions sont en cours?")
    results = db.execute(sql)
    assert len(results) > 0
    assert results[0]['statut'] == 'DEMANDE'
    
    # 4. IA génère rapport
    report = ia.generate_sensor_report(db.get_sensor(1))
    assert "capteur" in report.lower()
    
    print("✓ Test 5 (Scénario Complet) Passed")
```

---

## 📊 CRITÈRES D'ÉVALUATION

| Critère | Poids | Points | Détails |
|---------|-------|--------|---------|
| **Modélisation** | 25% | 25 pts | Automates + Diagrammes + Grammaire |
| **Implémentation** | 30% | 30 pts | Compilateur + Automates Engine + IA |
| **Interface** | 20% | 20 pts | Dashboard interactif + UX |
| **Données & Tests** | 15% | 15 pts | Qualité données + Scénarios test |
| **Innovation** | 10% | 10 pts | Fonctionnalités créatives |
| **TOTAL** | 100% | 100 pts | |

**Bonus:** 
- +5 pts: Gestion requêtes ambigües
- +5 pts: Intégration TimescaleDB
- +5 pts: Visualisation graphique automates

---

## 🔧 TECHNOLOGIES RECOMMANDÉES

```
Languages:
- Python 3.10+ (compilateur, automates, IA)
- TypeScript/React (optionnel, pour cohérence SensorLinker)
- SQL

Base de Données:
- PostgreSQL 14+ (recommandé)
- MySQL (existant sur SensorLinker)
- TimescaleDB (bonus)

Librairies Python:
├── NLP & Compilation:
│   ├── spacy (NLP, tokenization)
│   ├── sqlparse (parsing SQL)
│   └── parso (parsing syntaxe)
├── Automates:
│   ├── transitions (state machine)
│   └── automaton (manipulation automates)
├── IA Générative:
│   ├── openai (GPT-4 API)
│   ├── langchain (orchestration LLM)
│   ├── ollama (local models)
│   └── transformers (Hugging Face)
├── Data:
│   ├── pandas (dataframes)
│   ├── sqlalchemy (ORM)
│   └── psycopg2 (PostgreSQL driver)
└── Dashboard:
    ├── streamlit (UI rapide, recommandé)
    ├── dash (alternative)
    ├── plotly (visualisations)
    └── graphviz (diagrammes automates)

Front-End (optionnel):
- D3.js (visualisations complexes)
- Cytoscape.js (graphes/automates)
- Chart.js (graphiques)

Testing:
- pytest (tests unitaires)
- pytest-cov (couverture code)
```

---

## 📅 PLAN DE TRAVAIL (6 semaines)

### **SEMAINE 1: Modélisation**
- [ ] Définir 3 automates formellement
- [ ] Créer diagrammes graphiques
- [ ] Tables de transition
- [ ] Schéma BD (normalisation 3FN)

### **SEMAINE 2: Compilateur (Partie 1)**
- [ ] Définir grammaire EBNF
- [ ] Implémenter Lexer
- [ ] Implémenter Parser
- [ ] Construire AST

### **SEMAINE 3: Compilateur (Partie 2) + Automates**
- [ ] Générateur SQL (codegen)
- [ ] Tests compilateur
- [ ] Implémentation automates engine
- [ ] Tests automates

### **SEMAINE 4: IA Générative**
- [ ] Intégration OpenAI/Ollama
- [ ] Module générations rapports
- [ ] Module suggestions interventions
- [ ] Validation IA

### **SEMAINE 5: Interface & Intégration**
- [ ] Dashboard Streamlit/React
- [ ] Connexion BD
- [ ] Tests d'intégration
- [ ] Génération données

### **SEMAINE 6: Polish & Documentation**
- [ ] Tests complets (10+ scénarios)
- [ ] Optimisation performance
- [ ] Documentation technique
- [ ] Rapport final

---

## 📚 RESSOURCES FOURNIES

| Fichier | Contenu |
|---------|---------|
| `2_TheorieDesLangages TL.pdf` | Concepts: alphabets, langages, expressions régulières |
| `3_AutomatesAEtatsFinis TL.pdf` | DFA, NFA, déterminisation |
| `4_Déterminisation Automa...pdf` | Algorithme Thomson, déterminisation |
| `SensorLinker/` | BD existante + données + APIs |

---

## 🎯 PIÈCES À LIVRER

1. **Rapports**
   - [ ] `01_MODÉLISATION.pdf` (automates + diagrammes + schéma BD)
   - [ ] `02_SPÉCIFICATION_COMPILATEUR.md` (grammaire + architecture)
   - [ ] `03_RAPPORT_FINAL.pdf` (synthèse + conclusions)

2. **Code**
   - [ ] `src/compiler/` (lexer, parser, codegen)
   - [ ] `src/automata/` (automates engine)
   - [ ] `src/ia/` (générateur rapports)
   - [ ] `src/dashboard/` (interface)
   - [ ] `tests/` (10+ tests)

3. **Documentation**
   - [ ] `README.md` (installation + utilisation)
   - [ ] `API.md` (endpoints + usage)
   - [ ] `GRAMMAR.md` (grammaire détaillée)

4. **Données**
   - [ ] `data/schema.sql` (structure BD)
   - [ ] `data/seed.sql` (1000+ enregistrements)
   - [ ] `data/test_cases.json` (scénarios test)

---

## 📞 SUPPORT & RÉFÉRENCES

**Si questions sur compilation:**
- Concepts lexer/parser: voir cours + tutoriels "Writing a Compiler"
- AST: "Crafting Interpreters" by Robert Nystrom

**Si questions sur automates:**
- Théorie: cours PDF fourni
- Implémentation Python: librairie `transitions`

**Si questions sur IA:**
- API OpenAI: https://platform.openai.com/docs
- LangChain: https://python.langchain.com

---

**Version:** 1.0  
**Date:** 26 Mars 2026  
**Auteur:** Analysis Framework  
**Status:** 📋 Prêt pour implémentation

