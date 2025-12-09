from PyPDF2 import PdfReader
import sys

path = r"C:\Users\Admin\Desktop\portfolio\New Resume (1).pdf"
try:
    reader = PdfReader(path)
    for i, page in enumerate(reader.pages):
        text = page.extract_text()
        if text:
            sys.stdout.write(f"--- PAGE {i+1} ---\n")
            sys.stdout.write(text)
            sys.stdout.write("\n")
except Exception as e:
    sys.stderr.write(f"ERROR: {e}\n")
    sys.exit(1)
