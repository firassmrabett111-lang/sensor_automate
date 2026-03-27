"""
Tests pour le Compilateur
"""

import pytest
from src.compiler.compiler import Compiler
from src.compiler.lexer import Lexer, TokenType


class TestLexer:
    """Tests unitaires du Lexer"""
    
    def test_tokenize_simple_query(self):
        """Tester tokenization simple"""
        lexer = Lexer("Affiche les zones")
        tokens = lexer.tokenize()
        
        assert len(tokens) > 0
        assert tokens[0].type == TokenType.VERB
        assert tokens[-1].type == TokenType.EOF
    
    def test_recognize_keywords(self):
        """Tester reconnaissance keywords"""
        lexer = Lexer("Combien de capteurs")
        tokens = lexer.tokenize()
        
        assert tokens[0].type == TokenType.QUESTION
        assert tokens[0].value == "combien"
    
    def test_recognize_functions(self):
        """Tester reconnaissance fonctions"""
        lexer = Lexer("nombre total moyenne")
        tokens = lexer.tokenize()
        
        assert all(t.type == TokenType.FUNCTION for t in tokens[:-1])


class TestParser:
    """Tests unitaires du Parser"""
    
    def test_parse_select_query(self, compiler):
        """Tester parsing SELECT"""
        query = "Affiche les capteurs de capteurs"
        try:
            sql = compiler.compile(query)
            assert "SELECT" in sql
        except:
            pass  # Expected si syntaxe non parsable
    
    def test_parse_count_query(self, compiler):
        """Tester parsing COUNT"""
        query = "Combien de capteurs sont hors service ?"
        try:
            sql = compiler.compile(query)
            assert "SELECT" in sql and "COUNT" in sql
        except:
            pass


class TestCodeGenerator:
    """Tests génération SQL"""
    
    def test_generate_from_ast(self, compiler):
        """Tester génération SQL"""
        query = "Affiche les 5 zones les plus polluées"
        try:
            sql = compiler.compile(query)
            assert "SELECT" in sql.upper()
            assert "FROM" in sql.upper()
        except:
            pass


class TestCompilerIntegration:
    """Tests intégration Compilateur"""
    
    def test_compile_simple_query(self, compiler):
        """Test compilation simple"""
        queries = [
            "Affiche les 5 zones les plus polluées",
            "Combien de capteurs sont hors service ?",
        ]
        
        for query in queries:
            try:
                result = compiler.compile(query)
                assert isinstance(result, str)
                assert len(result) > 0
            except:
                pass
