"""
Code Generator - Transformation AST vers SQL
"""

from typing import Dict, Any
from .parser import (
    ASTNode, SelectNode, CountNode, ConditionNode, 
    FunctionCallNode
)


class CodeGenerator:
    """Générateur de code SQL à partir d'AST"""
    
    # Mapping table names (normalized)
    TABLE_MAPPING = {
        "capteurs": "capteurs",
        "capteur": "capteurs",
        "zones": "mesures",  # Via GROUP BY
        "interventions": "interventions",
        "intervention": "interventions",
        "citoyens": "citoyens",
        "citoyen": "citoyens",
        "vehicules": "vehicules",
        "vehicule": "vehicules",
        "trajets": "trajets",
        "trajet": "trajets",
        "techniciens": "techniciens",
        "technicien": "techniciens",
    }
    
    # Mapping column names
    COLUMN_MAPPING = {
        "zones": "zone",
        "polluées": "AVG(pollution)",
        "pollution": "pollution",
        "capteurs": "COUNT(*)",
        "score": "score_ecolo",
        "score_ecologiq": "score_ecolo",
        "trajet": "trajet_id",
        "economique": "economie_co2",
        "co2": "economie_co2",
    }
    
    # Mapping functions
    FUNCTION_MAPPING = {
        "nombre": "COUNT",
        "count": "COUNT",
        "total": "SUM",
        "sum": "SUM",
        "moyenne": "AVG",
        "avg": "AVG",
        "min": "MIN",
        "minimum": "MIN",
        "max": "MAX",
        "maximum": "MAX",
    }
    
    def generate(self, ast: ASTNode) -> str:
        """Generate SQL from AST"""
        
        if isinstance(ast, SelectNode):
            return self._generate_select(ast)
        
        elif isinstance(ast, CountNode):
            return self._generate_count(ast)
        
        else:
            raise ValueError(f"Unknown AST node type: {type(ast)}")
    
    def _generate_select(self, node: SelectNode) -> str:
        """Générer SELECT"""
        
        # SELECT phrase
        select_clause = self._generate_select_columns(node.columns, node.from_table)
        
        # FROM phrase
        from_clause = f"FROM {self.TABLE_MAPPING.get(node.from_table, node.from_table)}"
        
        # WHERE phrase (optionnel)
        where_clause = ""
        if node.where_clause:
            where_clause = f"WHERE {self._generate_condition(node.where_clause)}"
        
        # GROUP BY (si utilisant fonctions d'agrégation)
        group_by_clause = ""
        if any(func in col for col in node.columns for func in ["COUNT", "AVG", "SUM"]):
            if node.from_table == "zones":
                group_by_clause = "GROUP BY zone"
        
        # ORDER BY phrase (optionnel)
        order_by_clause = ""
        if node.order_by:
            orders = []
            for col, direction in node.order_by:
                orders.append(f"{col} {direction}")
            order_by_clause = f"ORDER BY {', '.join(orders)}"
        
        # LIMIT phrase (optionnel)
        limit_clause = ""
        if node.limit:
            limit_clause = f"LIMIT {node.limit}"
        
        # Assembler query
        parts = [
            select_clause,
            from_clause,
            where_clause,
            group_by_clause,
            order_by_clause,
            limit_clause
        ]
        
        query = " ".join(part for part in parts if part)
        return query
    
    def _generate_count(self, node: CountNode) -> str:
        """Générer COUNT"""
        
        table = self.TABLE_MAPPING.get(node.what, node.what)
        query = f"SELECT COUNT(*) FROM {table}"
        
        if node.where_clause:
            query += f" WHERE {self._generate_condition(node.where_clause)}"
        
        return query
    
    def _generate_select_columns(self, columns: list, table: str) -> str:
        """Gérer les colonnes SELECT"""
        
        if columns == ["*"]:
            return "SELECT *"
        
        selected = []
        for col in columns:
            # Vérifier si c'est une fonction
            if "(" in col:
                selected.append(col)
            else:
                mapped = self.COLUMN_MAPPING.get(col, col)
                selected.append(mapped)
        
        return f"SELECT {', '.join(selected)}"
    
    def _generate_condition(self, condition: ConditionNode) -> str:
        """Générer condition WHERE"""
        
        left = self.COLUMN_MAPPING.get(condition.left, condition.left)
        
        # Mapper opérateur si besoin
        operator = condition.operator
        if operator == "<>":
            operator = "!="
        
        # Traiter valeur (chaîne vs nombre)
        right = condition.right
        try:
            # Essayer convertir en nombre
            int(right)
            # Si succès, c'est un nombre
            right_val = right
        except ValueError:
            # Sinon, c'est une chaîne
            right_val = f"'{right}'"
        
        return f"{left} {operator} {right_val}"
