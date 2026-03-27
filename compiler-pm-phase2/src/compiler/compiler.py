"""
Compiler - Orchestrateur NL → SQL
"""

from .lexer import Lexer
from .parser import Parser
from .codegen import CodeGenerator


class Compiler:
    """Compilateur NL → SQL main orchestrator"""
    
    def __init__(self, debug: bool = False):
        """Initialiser compilateur"""
        self.debug = debug
    
    def compile(self, nl_query: str) -> str:
        """
        Compiler une requête en langage naturel vers SQL
        
        Args:
            nl_query: Requête en langage naturel
        
        Returns:
            Requête SQL exécutable
        
        Raises:
            SyntaxError: Si erreur syntaxique dans requête NL
        """
        
        try:
            # Phase 1: Lexicale
            lexer = Lexer(nl_query)
            tokens = lexer.tokenize()
            
            if self.debug:
                print("\n📋 TOKENS:")
                lexer.print_tokens()
            
            # Phase 2: Syntaxique
            parser = Parser(tokens)
            ast = parser.parse()
            
            if self.debug:
                print(f"\n🌳 AST: {ast}")
            
            # Phase 3: Génération Code
            codegen = CodeGenerator()
            sql = codegen.generate(ast)
            
            if self.debug:
                print(f"\n💾 SQL: {sql}")
            
            return sql
        
        except Exception as e:
            raise SyntaxError(f"Compilation failed: {str(e)}")
