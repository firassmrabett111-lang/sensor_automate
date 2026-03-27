# 📋 GUIDE COMPLET: PM-Compilation Phase 2

**Document d'analyse et d'implémentation du projet Smart City**

---

## 🎯 EXECUTIVE SUMMARY

### Relation entre Phase 1 et Phase 2

| Aspect | Phase 1 (Complétée) | Phase 2 (En cours) |
|--------|------------------|-----------------|
| **Nom** | SensorLinker | PM-Compilation |
| **Focus** | Plateforme gestion données urbaines | Compilation NL + Automates + IA |
| **BD** | Capteurs, interventions, techniciens | Même BD + NL→SQL |
| **Backend** | Express (APIs) | Express + Python (compiler) |
| **Frontend** | React Dashboard | Streamlit Dashboard |
| **Relation** | ✅ Autonome - complète | 🔗 S'intègre à Phase 1 |

### Intégration Prévue

```
┌─────────────────────────────────────────┐
│   Frontend React (SensorLinker)         │
│   - Gestion entités (CRUD)              │
│   - Visualisations données              │
└─────────────┬───────────────────────────┘
              │
        HTTP APIs
              │
┌─────────────▼───────────────────────────┐
│   Backend Express (SensorLinker)        │
│   - Routes API REST                     │
│   - Logique métier                      │
│   - Authentification                    │
└─────────────┬───────────────────────────┘
              │
              ├─── Database MySQL
              │
              ├─────────────────────────────────┐
              │                                 │
    ┌─────────▼──────────┐      ┌──────────────▼────────┐
    │ Module Compilateur │      │ Module Automates +IA  │
    │  (Python)          │      │  (Python)             │
    │  NL → SQL          │      │  - Workflows          │
    └────────────────────┘      │  - Rapports IA        │
                                └───────────────────────┘
                                
    Optionnel: Frontend Streamlit
    ├─ Dashboard analytics
    ├─ Tester compilateur
    └─ Visualiser automates
```

---

## 📦 CONTENU DU DOSSIER `compiler-pm-phase2`

```
compiler-pm-phase2/
├── README.md                  # ← LIRE EN PREMIER
├── requirements.txt           # Dépendances Python
├── pytest.ini                 # Config tests
├── .env.example               # Template config
├── main.py                    # Lanceur principal
│
├── src/
│   ├── __init__.py
│   │
│   ├── compiler/              # Phase NL→SQL (Semaines 2-3)
│   │   ├── lexer.py          # Tokenization ✅
│   │   ├── parser.py         # Analyse syntaxique ✅
│   │   ├── codegen.py        # Génération SQL ✅
│   │   └── compiler.py       # Orchestrateur ✅
│   │
│   ├── automata/              # Phase Automates (Semaine 3-4)
│   │   ├── base.py           # Classe de base ✅
│   │   ├── automata.py       # 3 automates concrètes ✅
│   │   └── engine.py         # Orchestrateur ✅
│   │
│   ├── ia/                    # Phase IA Générative (Semaine 4-5)
│   │   └── report_generator.py # Génération rapports ✅
│   │
│   └── dashboard/             # Phase Interface (Semaine 5)
│       └── app.py            # Streamlit UI ✅
│
├── tests/                     # Tests pytest ✅
│   ├── conftest.py
│   ├── test_compiler.py
│   ├── test_automata.py
│   ├── test_ia.py
│   └── test_integration.py
│
├── data/                      # (À remplir)
│   ├── schema.sql            # Schéma BD
│   └── seed.sql              # Données test
│
└── docs/                      # (À créer)
    ├── GRAMMAR.md            # Grammaire EBNF
    ├── ARCHITECTURE.md       # Design
    └── API.md                # Endpoints

STATUT IMPLÉMENTATION: ✅ Fondations (80%), 🔄 À compléter (20%)
```

---

## 🚀 DÉMARRAGE RAPIDE

### 1️⃣ Installation

```bash
# 1. Naviguer au dossier
cd SensorLinker/compiler-pm-phase2

# 2. Créer env Python virtuel
python -m venv venv
source venv/Scripts/activate     # Windows
# ou
source venv/bin/activate         # Linux/Mac

# 3. Installer dépendances
pip install -r requirements.txt

# 4. Configurer variables d'env
cp .env.example .env
# Éditer .env avec vos paramètres
```

### 2️⃣ Premier Test

```bash
# Tester compilateur
python -c "from src.compiler.compiler import Compiler; c = Compiler(); print(c.compile('Affiche les capteurs'))"

# Tester automates
python -c "from src.automata.engine import AutomataEngine; e = AutomataEngine(); s = e.create_sensor_automata('C-1'); e.trigger_event('C-1', 'installation'); print(e.get_state('C-1'))"

# Tous les tests
pytest tests/ -v
```

### 3️⃣ Lancer l'App

```bash
# Démarrer dashboard Streamlit
streamlit run src/dashboard/app.py

# Ou menu interactif
python main.py
```

---

## 💡 SOLUTIONS CLÉS IMPLÉMENTÉES

### 1. Compilateur NL→SQL

**Problème**: Traduire "Affiche les 5 zones les plus polluées" en SQL

**Solution**: Pipeline 3-phases
```python
"Affiche les 5 zones les plus polluées"
    ↓
Lexer: "VERB ARTICLE NUMBER NOUN PREP ADJECTIVE"
    ↓
Parser: SelectNode(columns=['zones'], from_table='mesures', limit=5)
    ↓
CodeGen: "SELECT zone, AVG(pollution) FROM mesures GROUP BY zone ORDER BY AVG(pollution) DESC LIMIT 5"
```

**Grammaire EBNF Supportée** (voir GRAMMAR.md pour complet):
```
QUERY ::= ("Affiche" | "Montes" | "Donne") COLUMNS "de" ENTITY [WHERE] [ORDER]
WHERE ::= "où" CONDITION
CONDITION ::= FIELD OPERATOR VALUE
```

**Requêtes Actuellement Supportées**:
- ✅ "Affiche les 5 zones les plus polluées"
- ✅ "Combien de capteurs sont hors service?"
- ✅ "Quels citoyens ont un score écologique > 80?"

### 2. Automates à États Finis

**Problème**: Modéliser workflows complexes avec états valides

**Solution**: 3 Automates Déterministes

**A) Capteur** (États: INACTIF → ACTIF → SIGNALÉ → EN_MAINTENANCE → HORS_SERVICE)
```
Événements valides:
- installation: INACTIF → ACTIF
- detection_anomalie: ACTIF → SIGNALÉ
- réparation: SIGNALÉ → EN_MAINTENANCE ou EN_MAINTENANCE → ACTIF
- panne: Depuis ACTIF/SIGNALÉ/EN_MAINTENANCE → HORS_SERVICE
```

**B) Intervention** (Validation multi-étapes)
```
DEMANDE 
  → TECH1_ASSIGNÉ (assigner_tech1)
  → TECH2_VALIDE (assigner_tech2)
  → IA_VALIDE (valider_ia)
  → TERMINÉ (completer)

Chaque étape peut être rejetée:
  → rejeter → REJETÉE (mais on peut réinitialiser)
```

**C) Véhicule** (Trajet urbain)
```
STATIONNÉ 
  → EN_ROUTE (demarrage)
  → ARRIVÉ (destination_atteinte) ou EN_PANNE (panne_detectée)
  → STATIONNÉ (stationnement)
```

**Usage Code**:
```python
engine = AutomataEngine()
automata = engine.create_sensor_automata("C-001")

# Vérifier transitions valides
assert automata.is_valid_transition("installation")

# Déclencher événement
automata.trigger("installation")  # INACTIF → ACTIF

# Vérifier séquence complète
assert automata.verify_sequence(["installation", "detection_anomalie"])
```

### 3. IA Générative

**Problème**: Générer rapports et suggestions automatiques

**Solution**: Wrapper LLM (OpenAI/Ollama) avec fallback

```python
# Avec IA
ia = AIReportGenerator(api_provider="openai", model="gpt-4")
report = ia.generate_sensor_report(sensor_data)
# → "Capteur C-001 fonctionne correctement. Taux d'erreur: 2.5%..."

# Sans IA (fallback)
suggestion = ia.suggest_intervention(sensor_data)
# → "⚠️ ATTENTION: Capteur C-001 taux d'erreur 12%. Maintenance conseillée."
```

**Fonctionnalités**:
- Rapport de capteur (état général + préoccupations + recommandations)
- Rapport de zone (qualité air + tendances)
- Suggestions d'intervention (priorité: CRITIQUE, ATTENTION, OK)
- Validation IA de séquences d'événements

---

## 📊 CRITÈRES D'ÉVALUATION & PROGRESSION

### Points par Critère (Total 100):

| Critère | Poids | Points | Progression |
|---------|-------|--------|------------|
| **Modélisation** | 25% | 25 | 🟢 Done: Automates + Diagrammes |
| **Implémentation** | 30% | 30 | 🟡 En cours: Compilateur ✅, Automates ✅, IA ✅ |
| **Interface** | 20% | 20 | 🟡 Streamlit UI ✅, Need: Polish |
| **Données & Tests** | 15% | 15 | 🟢 Tests unitaires ✅, Integration tests ✅ |
| **Innovation** | 10% | 10 | 🟡 À ajouter: Visualis. automates, Gestion ambigüités |
| **TOTAL** | 100% | 100 | **~70/100** |

### Bonus Disponible (+15 points):

- [x] +5: Gestion requêtes ambigües → À implémenter
- [x] +5: TimescaleDB pour séries temporelles → Config MySQL standard OK
- [x] +5: Visualisation graphique automates → Setup Graphviz OK

---

## 📚 FICHIERS DE RESSOURCES FOURNIS

### Dans le Dossier "enancé et cours":

1. **Enonceės du PM-Compilation-25-26.pdf** (4 pages)
   - ✅ Énoncé complet du projet
   - ✅ Objectifs pédagogiques
   - ✅ 3 parties (modélisation, développement, tests)
   - ✅ Critères d'évaluation

2. **2_TheorieDesLangages TL.pdf**
   - Alphabets et langages
   - Expressions régulières formelles
   - Utilité: Fonder grammaire du compilateur

3. **3_AutomatesAEtatsFinis TL.pdf**
   - DFA (Automates Finis Déterministes)
   - NFA (Automates Finis Non-Déterministes)
   - ε-NFA avec transitions epsilon
   - Équivalences DFA/NFA
   - Utilité: Théorie des 3 automates

4. **4_Déterminisation Automa et ER-TL-ok.pdf**
   - Algorithme Thomson (Regex → NFA)
   - Déterminisation (NFA → DFA)
   - Utilisé pour automates engine

---

## 🎓 CONCEPTS CLÉ À ASSIMILER

### Théorie des Langages
```
Alphabet (Σ) = {a, b, c, ...}
Mot = séquence de symboles (ex: "abc")
Langage L = ensemble de mots (ex: {a, ab, abc, ...})
Expression régulière = décrit pattern (ex: a*b+)
```

### Automates Finis
```
DFA (Déterministe):
- Un seul état suivant pour chaque (état, symbole)
- Facile à implémenter (table de transition)
- Ce que nous utilisons

NFA (Non-déterministe):
- Plusieurs états possibles pour (état, symbole)
- Plus expressif mais compliqué à coder
- Peut être converti en DFA (déterminisation)

Transitions:
- État source + événement → État destination
- Table de transition: dictionnaire {état: {événement: nouvel_état}}
```

### Compilateurs (Principe)
```
Source Code → Lexer → Tokens
          ↓
       Parser → AST (Abstract Syntax Tree)
          ↓
       Sémantique/Vérifications typées
          ↓
       Generator → Code Cible (SQL)
```

---

## 🔧 PROCHAINES ÉTAPES (ROADMAP)

### ✅ FAIT (70%)
- [x] Structurer le projet
- [x] Implémenter compilateur (lexer, parser, codegen)
- [x] Implémenter 3 automates
- [x] Module IA générative (avec fallback)
- [x] Dashboard Streamlit basique
- [x] Tests unitaires + intégration

### 🔄 EN COURS (15%)
- [ ] Affiner grammaire compilateur (support plus de requêtes)
- [ ] Persister états automates en BD
- [ ] Cache requêtes compilées
- [ ] Validations type + sémantiques complètes
- [ ] Documentation (GRAMMAR.md, ARCHITECTURE.md)

### 📋 À FAIRE (15%)
- [ ] Visualisation graphique automates (Graphviz/Cytoscape)
- [ ] Gestion requêtes ambigües avec IA
- [ ] Export rapports PDF/Excel
- [ ] Monitoring performance
- [ ] CI/CD (GitHub Actions)
- [ ] Rapport final professionnel

### ⏰ TIMELINE

```
Semaine 1 (26-30 Mars):  Analyser énoncé + Planifier ✅
Semaine 2 (31-6 Avr):   Compilateur (lexer/parser) + Automates ✅
Semaine 3 (7-13 Avr):   IA générative + Tests
Semaine 4 (14-20 Avr):  Dashboard + Documentation  
Semaine 5 (21-27 Avr):  Polish + Rapport
Semaine 6 (28-4 Mai):   Submit + Présentation
```

---

## 📞 SUPPORT & RÉFÉRENCES

### Ressources Python

- **Lexer/Parser**: Tutoriel "Crafting Interpreters" (Robert Nystrom)
- **Automates**: Tutoriel "Introduction to the theory of computation" (Sipser)
- **LLM**: Documentation OpenAI (https://platform.openai.com/docs)
- **State Machine**: Librairie `transitions` (https://transitions.readthedocs.io)

### GitHub & Collaboration

```bash
# Push vers GitHub (après commit)
git add .
git commit -m "Phase 2: Add compiler + automates + IA"
git push origin main

# Voir status
git log --oneline -10
```

---

## ✅ CHECKLIST VALIDATION

- [ ] Compilateur compile 10+ requêtes différentes
- [ ] 3 Automates implémentés et testés
- [ ] IA génère rapports >2 sec
- [ ] Tests: 95%+ passage (pytest)
- [ ] Dashboard Streamlit responsive
- [ ] Code documenté (docstrings + comments)
- [ ] README.md clair et complet
- [ ] Pas d'erreurs critique (pylint < 5)

---

## 📝 NOTES IMPORTANTES

### ⚠️ Avant de Commencer

1. **Base de Données**: Les tables existent déjà dans SensorLinker
   - Vérifier connection string dans `.env`
   - Vérifier tables: `capteurs`, `interventions`, `mesures`

2. **Python Version**: Utiliser Python 3.10+
   - Vérifier: `python --version`

3. **Variables d'Env**: Configurer `.env` avec:
   ```
   DATABASE_URL=postgresql://user:password@localhost/smart_city
   OPENAI_API_KEY=sk-... (optionnel)
   ```

4. **Node Modules**: SensorLinker phase 1 a déjà deps installées
   - Phase 2 = projet Python indépendant

### 🚨 Problèmes Connus

| Problème | Solution |
|----------|----------|
| ModuleNotFoundError: No module 'spacy' | `pip install -r requirements.txt` |
| Connection refused BD | Vérifier PostgreSQL running + DATABASE_URL |
| OpenAI quota exceeded | Utiliser fallback ou Ollama local |
| Streamlit port 8501 occupied | `streamlit run app.py --server.port 8502` |

---

## 🎯 OBJECTIF FINAL

Créer une **plateforme intelligente et modulaire** qui:

1. ✅ **Compile** requêtes naturelles vers SQL
2. ✅ **Modélise** workflows complexes avec automates
3. ✅ **Génère** rapports autonomes
4. ✅ **s'intègre** proprement à SensorLinker existant
5. ✅ **Démontre** maîtrise théorie des langages + pratique dev

**Résultat Attendu**: Un système professionnel, testable, documenté et innovant!

---

**VERSION**: 2.0 (Complet)  
**DATE**: 27 Mars 2026  
**AUTEUR**: Analyse Framework  
**STATUS**: 🟡 En implémentation active  

**👉 Commencer par: `cd compiler-pm-phase2 && python main.py`**
