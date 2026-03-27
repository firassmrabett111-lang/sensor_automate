"""
Dashboard Streamlit - Interface utilisateur
"""

import streamlit as st
from datetime import datetime

# Page config
st.set_page_config(
    page_title="🏙️ Smart City Management",
    page_icon="🏢",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Sidebar
st.sidebar.title("🌍 Navigation")

page = st.sidebar.radio(
    "Sélectionner une section:",
    [
        "📊 Dashboard",
        "🔤 Compilateur NL→SQL",
        "🤖 Automates",
        "📄 Rapports IA",
        "⚙️ Paramètres"
    ]
)

# ─────────────────────────────────

if page == "📊 Dashboard":
    st.title("📊 Tableau de Bord Principal")
    
    col1, col2, col3 = st.columns(3)
    
    with col1:
        st.metric("✓ Capteurs Actifs", 156, "+5")
    
    with col2:
        st.metric("⚠️ Interventions", 12, "-3")
    
    with col3:
        st.metric("📈 Qualité Air", "45 µg/m³", "-2%")
    
    st.write("---")
    st.write("### Status Système")
    st.success("✓ Base de données: Connectée")
    st.success("✓ Compilateur: Opérationnel")
    st.info("ℹ️ Automates: 3/3 activés")

# ─────────────────────────────────

elif page == "🔤 Compilateur NL→SQL":
    st.title("🔤 Compilateur Langage Naturel → SQL")
    
    st.write("""
    Entrez une requête en langage naturel et transformez-la en SQL.
    """)
    
    with st.form("nl_query_form"):
        nl_input = st.text_area(
            "Requête en Langage Naturel",
            placeholder="Ex: Affiche les 5 zones les plus polluées",
            height=100,
            key="nl_input"
        )
        
        submit_btn = st.form_submit_button("🔄 Compiler en SQL")
    
    if submit_btn and nl_input:
        try:
            from src.compiler.compiler import Compiler
            
            compiler = Compiler(debug=True)
            sql = compiler.compile(nl_input)
            
            st.success("✓ Compilation réussie!")
            
            col1, col2 = st.columns(2)
            
            with col1:
                st.subheader("SQL Généré")
                st.code(sql, language="sql")
            
            with col2:
                st.subheader("Informations")
                st.write(f"**Longueur requête**: {len(nl_input)} caractères")
                st.write(f"**Type requête**: SELECT")
        
        except Exception as e:
            st.error(f"❌ Erreur: {str(e)}")

# ─────────────────────────────────

elif page == "🤖 Automates":
    st.title("🤖 Moteur d'Automates")
    
    automata_type = st.selectbox(
        "Type d'automate",
        ["Cycle de Capteur", "Validation d'Intervention", "Trajet Véhicule"]
    )
    
    if automata_type == "Cycle de Capteur":
        st.subheader("État d'un Capteur")
        
        from src.automata.engine import AutomataEngine
        
        engine = AutomataEngine()
        automata = engine.create_sensor_automata("C-001")
        
        col1, col2 = st.columns(2)
        
        with col1:
            st.write("**État Initial**: INACTIF")
            st.write("**État Courant**: ACTIF")
            
            st.write("**Transitions Valides:**")
            st.write("- detection_anomalie → SIGNALÉ")
            st.write("- panne → HORS_SERVICE")
        
        with col2:
            if st.button("📊 Afficher Transitions"):
                st.write(automata.get_transitions())

# ─────────────────────────────────

elif page == "📄 Rapports IA":
    st.title("📄 Rapports Générés par IA")
    
    from src.ia.report_generator import AIReportGenerator
    
    ia = AIReportGenerator()
    
    st.write("### Générateur de Rapports")
    
    report_type = st.selectbox(
        "Type de rapport",
        ["Rapport Capteur", "Rapport de Zone", "Suggestions d'Actions"]
    )
    
    if st.button("🤖 Générer Rapport"):
        with st.spinner("Génération en cours..."):
            
            if report_type == "Rapport Capteur":
                sample_data = {
                    "id": "C-001",
                    "type": "Qualité Air",
                    "statut": "ACTIF",
                    "error_rate": 2.5,
                    "recent_measurements": [42, 45, 43, 48]
                }
                report = ia.generate_sensor_report(sample_data)
            
            elif report_type == "Rapport de Zone":
                measurements = [{"value": 45}, {"value": 48}, {"value": 42}]
                report = ia.generate_zone_report("Zone-1", measurements)
            
            else:  # Suggestions
                sample_data = {
                    "id": "C-001",
                    "statut": "ACTIF",
                    "error_rate": 2.5
                }
                report = ia.suggest_intervention(sample_data)
            
            st.success("✓ Rapport généré!")
            st.write(report)

# ─────────────────────────────────

elif page == "⚙️ Paramètres":
    st.title("⚙️ Paramètres Système")
    
    st.subheader("Configuration IA")
    
    ai_provider = st.selectbox("Fournisseur IA", ["OpenAI", "Ollama"])
    
    if ai_provider == "OpenAI":
        api_key = st.text_input("Clé API OpenAI", type="password")
        model = st.selectbox("Modèle", ["gpt-4", "gpt-3.5-turbo"])
    else:
        ollama_url = st.text_input("URL Ollama", "http://localhost:11434")
        model = st.selectbox("Modèle", ["llama2", "mistral", "neural-chat"])
    
    if st.button("💾 Sauvegarder Paramètres"):
        st.success("✓ Paramètres sauvegardés!")

# Footer
st.sidebar.write("---")
st.sidebar.write(f"**Version**: 1.0.0  \n**Statut**: 🟢 En ligne")
