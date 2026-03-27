"""
Fixture configurations pour pytest
"""

import pytest
from src.compiler.compiler import Compiler
from src.automata.engine import AutomataEngine
from src.ia.report_generator import AIReportGenerator


@pytest.fixture
def compiler():
    """Fixture compilateur"""
    return Compiler()


@pytest.fixture
def automata_engine():
    """Fixture engine automates"""
    return AutomataEngine()


@pytest.fixture
def ia_generator():
    """Fixture générateur IA"""
    return AIReportGenerator(api_provider="openai")


@pytest.fixture
def sample_nl_queries():
    """Queries test"""
    return {
        "simple": "Affiche les 5 zones les plus polluées",
        "count": "Combien de capteurs sont hors service ?",
        "condition": "Quels citoyens ont un score écologique > 80 ?",
    }
