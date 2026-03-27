"""
Lexer - Tokenization du langage naturel
"""

from enum import Enum
from typing import List, NamedTuple
import re


class TokenType(Enum):
    """Types de tokens"""
    # Mots-clés
    VERB = "VERB"  # affiche, montre, donne
    ARTICLE = "ARTICLE"  # les, un, des, du
    PREPOSITION = "PREP"  # de, du, d', par
    CONJUNCTION = "CONJ"  # et, ou
    QUESTION = "QUESTION"  # combien, quels, quoi
    
    # Types de données
    IDENTIFIER = "IDENTIFIER"  # noms de colonnes/tables
    NUMBER = "NUMBER"  # nombres
    STRING = "STRING"  # texte entre guillemets
    
    # Opérateurs
    OPERATOR = "OPERATOR"  # >, <, =, !=, >=, <=
    FUNCTION = "FUNCTION"  # moyenne, total, min, max, nombre
    
    # Structures
    LPAREN = "LPAREN"  # (
    RPAREN = "RPAREN"  # )
    COMMA = "COMMA"  # ,
    
    # Spécial
    EOF = "EOF"
    UNKNOWN = "UNKNOWN"


class Token(NamedTuple):
    """Représentation d'un token"""
    type: TokenType
    value: str
    position: int = 0


class Lexer:
    """Lexer pour tokenization du langage naturel"""
    
    # Dictionnaires de reconnaissance
    KEYWORDS = {
        # Verbes
        "affiche": TokenType.VERB,
        "montre": TokenType.VERB,
        "donne": TokenType.VERB,
        "affiche-moi": TokenType.VERB,
        
        # Questions
        "combien": TokenType.QUESTION,
        "quels": TokenType.QUESTION,
        "quelles": TokenType.QUESTION,
        "qui": TokenType.QUESTION,
        "quel": TokenType.QUESTION,
        
        # Articles
        "le": TokenType.ARTICLE,
        "la": TokenType.ARTICLE,
        "les": TokenType.ARTICLE,
        "un": TokenType.ARTICLE,
        "une": TokenType.ARTICLE,
        "des": TokenType.ARTICLE,
        "du": TokenType.ARTICLE,
        
        # Prépositions
        "de": TokenType.PREPOSITION,
        "du": TokenType.PREPOSITION,
        "d": TokenType.PREPOSITION,
        "par": TokenType.PREPOSITION,
        
        # Conjonctions
        "et": TokenType.CONJUNCTION,
        "ou": TokenType.CONJUNCTION,
        
        # Fonctions
        "moyenne": TokenType.FUNCTION,
        "total": TokenType.FUNCTION,
        "min": TokenType.FUNCTION,
        "max": TokenType.FUNCTION,
        "nombre": TokenType.FUNCTION,
        "count": TokenType.FUNCTION,
        "sum": TokenType.FUNCTION,
        "avg": TokenType.FUNCTION,
        "minimum": TokenType.FUNCTION,
        "maximum": TokenType.FUNCTION,
    }
    
    OPERATORS = {
        ">": TokenType.OPERATOR,
        "<": TokenType.OPERATOR,
        "=": TokenType.OPERATOR,
        "!=": TokenType.OPERATOR,
        "<>": TokenType.OPERATOR,
        ">=": TokenType.OPERATOR,
        "<=": TokenType.OPERATOR,
    }
    
    def __init__(self, text: str):
        """Initialiser lexer avec texte d'entrée"""
        self.text = text.lower().strip()
        self.position = 0
        self.tokens: List[Token] = []
    
    def error(self, message: str) -> None:
        """Signal erreur lexer"""
        context = self.text[max(0, self.position - 20):self.position + 20]
        raise SyntaxError(f"Lexer error at position {self.position}: {message}\n  Context: ...{context}...")
    
    def current_char(self) -> str:
        """Obtenir caractère actuel"""
        if self.position >= len(self.text):
            return None
        return self.text[self.position]
    
    def peek_char(self, offset: int = 1) -> str:
        """Regarder caractère suivant"""
        pos = self.position + offset
        if pos >= len(self.text):
            return None
        return self.text[pos]
    
    def advance(self) -> None:
        """Avancer position"""
        self.position += 1
    
    def skip_whitespace(self) -> None:
        """Passer les espaces"""
        while self.current_char() and self.current_char().isspace():
            self.advance()
    
    def read_number(self) -> Token:
        """Lire un nombre"""
        start_pos = self.position
        number_str = ""
        
        while self.current_char() and (self.current_char().isdigit() or self.current_char() == "."):
            number_str += self.current_char()
            self.advance()
        
        return Token(TokenType.NUMBER, number_str, start_pos)
    
    def read_word(self) -> Token:
        """Lire un mot (identifier ou keyword)"""
        start_pos = self.position
        word = ""
        
        while self.current_char() and (self.current_char().isalnum() or self.current_char() in "-_"):
            word += self.current_char()
            self.advance()
        
        token_type = self.KEYWORDS.get(word, TokenType.IDENTIFIER)
        return Token(token_type, word, start_pos)
    
    def read_string(self, quote_char: str) -> Token:
        """Lire une chaîne entre guillemets"""
        start_pos = self.position
        self.advance()  # skip opening quote
        string_val = ""
        
        while self.current_char() and self.current_char() != quote_char:
            if self.current_char() == "\\":
                self.advance()
                if self.current_char():
                    string_val += self.current_char()
                    self.advance()
            else:
                string_val += self.current_char()
                self.advance()
        
        if self.current_char() != quote_char:
            self.error(f"Unterminated string starting at position {start_pos}")
        
        self.advance()  # skip closing quote
        return Token(TokenType.STRING, string_val, start_pos)
    
    def tokenize(self) -> List[Token]:
        """Tokenize l'entrée complète"""
        self.tokens = []
        
        while self.position < len(self.text):
            self.skip_whitespace()
            
            if self.position >= len(self.text):
                break
            
            char = self.current_char()
            
            # Nombres
            if char.isdigit():
                self.tokens.append(self.read_number())
            
            # Mots (keywords ou identifiers)
            elif char.isalpha():
                self.tokens.append(self.read_word())
            
            # Chaînes
            elif char in ("'", '"'):
                self.tokens.append(self.read_string(char))
            
            # Opérateurs multi-caractères
            elif char in ("<", ">", "!", "="):
                start_pos = self.position
                op = char
                self.advance()
                
                if self.current_char() == "=" or (char == "<" and self.current_char() == ">"):
                    op += self.current_char()
                    self.advance()
                
                if op in self.OPERATORS:
                    self.tokens.append(Token(TokenType.OPERATOR, op, start_pos))
                else:
                    self.tokens.append(Token(TokenType.UNKNOWN, op, start_pos))
            
            # Parenthèses
            elif char == "(":
                self.tokens.append(Token(TokenType.LPAREN, char, self.position))
                self.advance()
            
            elif char == ")":
                self.tokens.append(Token(TokenType.RPAREN, char, self.position))
                self.advance()
            
            # Virgule
            elif char == ",":
                self.tokens.append(Token(TokenType.COMMA, char, self.position))
                self.advance()
            
            # Caractère inconnu
            else:
                self.tokens.append(Token(TokenType.UNKNOWN, char, self.position))
                self.advance()
        
        # Ajouter EOF
        self.tokens.append(Token(TokenType.EOF, "", self.position))
        
        return self.tokens
    
    def print_tokens(self) -> None:
        """Debug: afficher tokens"""
        for token in self.tokens:
            if token.type != TokenType.EOF:
                print(f"  {token.type.value:15} : {token.value}")
