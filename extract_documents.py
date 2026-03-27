#!/usr/bin/env python3
"""Extract text from PDF files in the project documentation folder"""

import os
import sys
from pathlib import Path

# Try importing pdfplumber, install if needed
try:
    import pdfplumber
except ImportError:
    print("Installing pdfplumber...")
    os.system(f"{sys.executable} -m pip install pdfplumber")
    import pdfplumber

def extract_pdf_text(pdf_path):
    """Extract all text from a PDF file"""
    try:
        with pdfplumber.open(pdf_path) as pdf:
            full_text = []
            for i, page in enumerate(pdf.pages):
                text = page.extract_text()
                if text:
                    full_text.append(f"\n--- PAGE {i+1} ---\n{text}")
            return "\n".join(full_text)
    except Exception as e:
        return f"Error reading {pdf_path}: {str(e)}"

def main():
    # Define the documents folder
    docs_folder = Path(r"c:\Users\Mrabet\Desktop\devops\outils\ps-main\projet DB\SensorLinker\SensorLinker\enancé et cours")
    
    # Find all PDF files
    pdf_files = list(docs_folder.glob("*.pdf"))
    
    print(f"Found {len(pdf_files)} PDF files in {docs_folder}\n")
    
    # Extract text from each PDF
    for pdf_file in sorted(pdf_files):
        print(f"\n{'='*80}")
        print(f"EXTRACTING: {pdf_file.name}")
        print(f"{'='*80}\n")
        
        text = extract_pdf_text(str(pdf_file))
        
        # Save extracted text to file
        output_file = docs_folder / f"{pdf_file.stem}_extracted.txt"
        with open(output_file, "w", encoding="utf-8") as f:
            f.write(text)
        
        print(f"✓ Saved to: {output_file}")
        
        # Print first 2000 chars to console
        preview = text[:2000] if len(text) > 2000 else text
        print(f"\nPREVIEW:\n{preview}...\n" if len(text) > 2000 else f"\nCONTENT:\n{preview}\n")

if __name__ == "__main__":
    main()
