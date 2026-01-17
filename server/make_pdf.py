from fpdf import FPDF
import random

pdf = FPDF()
pdf.add_page()
pdf.set_font("Arial", size=12)

pdf.cell(200, 10, txt="RideWise Historical Fleet Data Report", ln=1, align='C')
pdf.cell(200, 10, txt="Confidential - Internal Use Only", ln=1, align='C')
pdf.ln(10)

# Header
pdf.set_font("Arial", 'B', 10)
pdf.cell(40, 10, "Date", 1)
pdf.cell(40, 10, "Region", 1)
pdf.cell(40, 10, "Bikes Used", 1)
pdf.cell(40, 10, "Weather", 1)
pdf.ln()

# Generate 50 dummy rows
pdf.set_font("Arial", size=10)
regions = ["Versova", "Andheri", "Ghatkopar", "Marol"]
weather = ["Clear", "Rain", "Cloudy"]

for i in range(50):
    date = f"2026-05-{random.randint(1,30):02d}"
    region = random.choice(regions)
    bikes = str(random.randint(50, 500))
    cond = random.choice(weather)

    pdf.cell(40, 10, date, 1)
    pdf.cell(40, 10, region, 1)
    pdf.cell(40, 10, bikes, 1)
    pdf.cell(40, 10, cond, 1)
    pdf.ln()

pdf.output("ridewise_dummy_data.pdf")
print("✅ PDF Created: ridewise_dummy_data.pdf")
