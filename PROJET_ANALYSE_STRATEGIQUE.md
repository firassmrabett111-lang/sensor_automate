# Analyse Stratégique du Projet PM-Compilation 2025-26
**Date**: Mars 26, 2026  
**Projet**: Deuxième Phase - Plateforme SensorLinker + Compilateur  
**Responsable**: Firaz Mrabett  

---

## 1. CONTEXTE PROJET

### Phase 1 (Complétée)
- ✅ Plateforme **SensorLinker** (Frontend React + Backend Express + MySQL)
- ✅ Gestion de capteurs, interventions, citoyens, véhicules, techniciens
- ✅ Dashboard interactif et visualisation de données
- ✅ Stockage en base de données relationnelle

### Phase 2 (EN COURS D'ANALYSE)
- Compiler/Langage/Automates
- Théorie des Langages Formels
- Automates à États Finis (AEF)
- Implémentation avec concepts théoriques

---

## 2. ANTICIPATION DES EXIGENCES TYPIQUES

### Éléments Probables de l'Énoncé (à confirmer):

**A) Analyse Lexicale**
- Tokenization d'un langage source
- Table des symboles
- Gestion des identificateurs, mots-clés, opérateurs
- Types de tokens (IDENTIFIER, KEYWORD, OPERATOR, LITERAL, etc.)

**B) Analyse Syntaxique**
- Grammaire formelle (BNF/EBNF)
- Parser (descendant/ascendant)
- Arbre syntaxique (AST)
- Gestion d'erreurs syntaxiques

**C) Automates**
- Automate fini (NFA/DFA)
- Déterminisation (Thomson → Déterminisation)
- Minimisation d'automates
- Reconnaissance de patterns (expressions régulières)

**D) Implémentation**
- Langage: Probablement TypeScript/Python/Java
- Structure modulaire
- Tests unitaires

---

## 3. STRUCTURE ANTICIPÉE DU PROJET

```
compiler-project/
├── src/
│   ├── lexer/
│   │   ├── tokenizer.ts
│   │   ├── tokens.ts
│   │   └── symbolTable.ts
│   ├── parser/
│   │   ├── parser.ts
│   │   ├── ast.ts
│   │   └── grammar.ts
│   ├── automata/
│   │   ├── nfa.ts
│   │   ├── dfa.ts
│   │   └── minimizer.ts
│   └── compiler.ts (orchestrateur)
├── tests/
│   ├── lexer.test.ts
│   ├── parser.test.ts
│   └── automata.test.ts
├── examples/
│   ├── input.src (fichier source test)
│   └── expected_output.json
└── docs/
    ├── specification.md
    ├── grammar.md
    └── report.md
```

---

## 4. LIVRABLES ATTENDUS (Hypothèse)

1. **Compilateur fonctionnel** avec 3 phases (lexer → parser → automate)
2. **Documentation technique** (grammaire, algorithmes)
3. **Tests complets** (unitaires + intégration)
4. **Rapports d'analyse** (AST, traces d'exécution)
5. **Exemplaires d'utilisation** (fichiers sources test)

---

## 5. PROCHAINES ÉTAPES

**Étape 1**: Lire l'énoncé réel (Enonceės du PM-Compilation-25-26.pdf) ✓  
**Étape 2**: Analyser les cours en détail  
**Étape 3**: Créer la structure de projet attendue  
**Étape 4**: Implémenter phase par phase (lexer → parser → automate)  
**Étape 5**: Tests et validation  
**Étape 6**: Documentation complète  
**Étape 7**: Rapport professionnel  

---

## 6. TECHNOLOGIES RECOMMANDÉES

- **Langage**: TypeScript (aligné avec SensorLinker)
- **Framework**: Même stack que SensorLinker pour cohérence
- **Testing**: Vitest/Jest
- **Documentation**: Markdown + Diagrams.net/Mermaid

---

*À compléter une fois l'énoncé réel analysé*
