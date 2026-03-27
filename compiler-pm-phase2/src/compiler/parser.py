"""
Parser - Analyse syntaxique
"""

from typing import List, Optional
from dataclasses import dataclass

from .lexer import Token, TokenType, Lexer


@dataclass
class ASTNode:
    """Nœud de base pour AST"""
    pass


@dataclass
class SelectNode(ASTNode):
    """Nœud SELECT"""
    columns: List[str]
    from_table: str
    where_clause: Optional['ConditionNode'] = None
    order_by: Optional[List[tuple]] = None  # [(column, direction), ...]
    limit: Optional[int] = None


@dataclass
class ConditionNode(ASTNode):
    """Nœud de condition (WHERE)"""
    left: str  # column name
    operator: str  # >, <, =, !=, >=, <=
    right: str  # value ou column


@dataclass
class FunctionCallNode(ASTNode):
    """Nœud appel fonction"""
    name: str  # min, max, avg, count, sum
    argument: str


@dataclass
class CountNode(ASTNode):
    """Nœud pour COUNT questions"""
    what: str  # ce qu'on compte
    where_clause: Optional[ConditionNode] = None


class Parser:
    """Parser pour langage naturel"""
    
    def __init__(self, tokens: List[Token]):
        """Initialiser parser"""
        self.tokens = tokens
        self.position = 0
    
    def error(self, message: str) -> None:
        """Signal erreur parser"""
        token = self.current_token()
        raise SyntaxError(f"Parser error at token '{token.value}': {message}")
    
    def current_token(self) -> Token:
        """Obtenir token actuel"""
        if self.position >= len(self.tokens):
            return self.tokens[-1]  # EOF
        return self.tokens[self.position]
    
    def peek_token(self, offset: int = 1) -> Token:
        """Regarder token suivant"""
        pos = self.position + offset
        if pos >= len(self.tokens):
            return self.tokens[-1]  # EOF
        return self.tokens[pos]
    
    def advance(self) -> None:
        """Avancer position"""
        self.position += 1
    
    def expect(self, token_type: TokenType) -> Token:
        """S'attendre à un type de token"""
        token = self.current_token()
        if token.type != token_type:
            self.error(f"Expected {token_type.value}, got {token.type.value}")
        self.advance()
        return token
    
    def match(self, *token_types: TokenType) -> bool:
        """Vérifier si token courant correspond à un des types"""
        return self.current_token().type in token_types
    
    def parse(self) -> ASTNode:
        """Parse l'entrée complète"""
        
        # Déterminer type de requête
        if self.match(TokenType.QUESTION):
            return self.parse_question()
        elif self.match(TokenType.VERB):
            return self.parse_select()
        else:
            self.error(f"Unexpected token: {self.current_token().value}")
    
    def parse_question(self) -> ASTNode:
        """Parse une question (combien..., quels...)"""
        
        question = self.current_token().value
        self.advance()
        
        if question == "combien":
            # "Combien de capteurs sont..."
            self.expect(TokenType.ARTICLE)  # de/du/d'
            what = self.expect(TokenType.IDENTIFIER).value
            
            # Optionnel: "are"
            if self.match(TokenType.VERB):
                self.advance()
            
            where_clause = None
            
            # Optionnel: condition
            if self.match(TokenType.PREPOSITION):
                self.advance()
                where_clause = self.parse_condition()
            
            return CountNode(what=what, where_clause=where_clause)
        
        else:
            self.error(f"Unsupported question type: {question}")
    
    def parse_select(self) -> SelectNode:
        """Parse une requête SELECT"""
        
        # "Affiche/Montre/Donne"
        self.advance()
        
        # Optionnel: article
        if self.match(TokenType.ARTICLE):
            self.advance()
        
        # Optionnel: nombre (les 5 premiers...)
        limit = None
        if self.match(TokenType.NUMBER):
            limit = int(self.current_token().value)
            self.advance()
        
        # Colonnes
        columns = self.parse_columns()
        
        # "de/du" TABLE
        if not self.match(TokenType.EOF):
            self.expect(TokenType.PREPOSITION)  # de/du
            from_table = self.expect(TokenType.IDENTIFIER).value
        else:
            self.error("Missing FROM clause")
        
        # Optionnel: WHERE
        where_clause = None
        if self.match(TokenType.PREPOSITION) and self.current_token().value == "où":
            self.advance()
            where_clause = self.parse_condition()
        
        # Optionnel: ORDER BY
        order_by = None
        if self.match(TokenType.VERB) and self.current_token().value in ("ordonnées", "triées"):
            self.advance()
            if self.match(TokenType.PREPOSITION):
                self.advance()  # "par"
                column = self.expect(TokenType.IDENTIFIER).value
                direction = "DESC" if "polluées" in self.current_token().value else "ASC"
                order_by = [(column, direction)]
        
        return SelectNode(
            columns=columns,
            from_table=from_table,
            where_clause=where_clause,
            order_by=order_by,
            limit=limit
        )
    
    def parse_columns(self) -> List[str]:
        """Parse liste de colonnes"""
        columns = []
        
        # Vérifier fonction
        if self.match(TokenType.FUNCTION):
            func_name = self.current_token().value
            self.advance()
            
            # Optionnel: parenthèses
            if self.match(TokenType.LPAREN):
                self.advance()
                column = self.expect(TokenType.IDENTIFIER).value
                self.expect(TokenType.RPAREN)
            else:
                column = self.expect(TokenType.IDENTIFIER).value
            
            columns.append(f"{func_name}({column})")
        
        # Ou identifiers simples
        else:
            while self.match(TokenType.IDENTIFIER) or self.current_token().value == "*":
                columns.append(self.current_token().value)
                self.advance()
                
                if self.match(TokenType.COMMA):
                    self.advance()
                else:
                    break
        
        return columns if columns else ["*"]
    
    def parse_condition(self) -> ConditionNode:
        """Parse une condition WHERE"""
        
        left = self.expect(TokenType.IDENTIFIER).value
        operator = self.expect(TokenType.OPERATOR).value
        
        if self.match(TokenType.NUMBER):
            right = self.current_token().value
            self.advance()
        elif self.match(TokenType.STRING):
            right = self.current_token().value
            self.advance()
        else:
            right = self.expect(TokenType.IDENTIFIER).value
        
        return ConditionNode(left=left, operator=operator, right=right)
