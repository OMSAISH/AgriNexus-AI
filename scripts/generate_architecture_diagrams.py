import os
import subprocess

DIAGRAMS_DIR = "AgriNexus-AI-Report/AgriNexus_AI_Architecture_Diagrams"
os.makedirs(DIAGRAMS_DIR, exist_ok=True)

# 05_dfd_level_1.svg
svg_05 = '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1100 750" width="1100" height="750" style="background:#FFFFFF; font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <rect x="20" y="20" width="1060" height="710" rx="12" fill="#FAFBF8" stroke="#CBD5E1" stroke-width="1.5"/>
  <text x="40" y="55" font-size="20" font-weight="bold" fill="#174C38">AgriNexus AI — Data Flow Diagram (DFD Level 1)</text>
  <text x="40" y="78" font-size="12" fill="#64748B">Functional Subsystem Decomposition and Inter-Store Data Transformations</text>

  <!-- External Entities -->
  <!-- Entity 1: Farm Manager / Farmer -->
  <rect x="50" y="120" width="150" height="70" rx="6" fill="#1E293B" stroke="#0F172A" stroke-width="2"/>
  <text x="125" y="150" font-size="13" font-weight="bold" fill="#FFFFFF" text-anchor="middle">Farmer / Supervisor</text>
  <text x="125" y="170" font-size="11" fill="#94A3B8" text-anchor="middle">(Primary Operator)</text>

  <!-- Entity 2: Agronomist Consultant -->
  <rect x="50" y="420" width="150" height="70" rx="6" fill="#1E293B" stroke="#0F172A" stroke-width="2"/>
  <text x="125" y="450" font-size="13" font-weight="bold" fill="#FFFFFF" text-anchor="middle">Agronomist Specialist</text>
  <text x="125" y="470" font-size="11" fill="#94A3B8" text-anchor="middle">(Advisory Expert)</text>

  <!-- Entity 3: External Weather & APMC Services -->
  <rect x="900" y="260" width="150" height="70" rx="6" fill="#1E293B" stroke="#0F172A" stroke-width="2"/>
  <text x="975" y="290" font-size="13" font-weight="bold" fill="#FFFFFF" text-anchor="middle">External Agro APIs</text>
  <text x="975" y="310" font-size="11" fill="#94A3B8" text-anchor="middle">(IMD &amp; e-NAM/APMC)</text>

  <!-- Subsystem Processes (Circles / Rounded Rects) -->
  <!-- 1.0 Auth -->
  <rect x="290" y="115" width="180" height="80" rx="20" fill="#E8F2EA" stroke="#16845B" stroke-width="2"/>
  <text x="380" y="145" font-size="12" font-weight="bold" fill="#174C38" text-anchor="middle">1.0 User Authentication</text>
  <text x="380" y="165" font-size="11" fill="#16845B" text-anchor="middle">&amp; Session Security</text>

  <!-- 2.0 Farm & Field -->
  <rect x="560" y="115" width="180" height="80" rx="20" fill="#E8F2EA" stroke="#16845B" stroke-width="2"/>
  <text x="650" y="145" font-size="12" font-weight="bold" fill="#174C38" text-anchor="middle">2.0 Parcel &amp; Land</text>
  <text x="650" y="165" font-size="11" fill="#16845B" text-anchor="middle">Registry Management</text>

  <!-- 3.0 Crop Lifecycle -->
  <rect x="290" y="265" width="180" height="80" rx="20" fill="#E8F2EA" stroke="#16845B" stroke-width="2"/>
  <text x="380" y="295" font-size="12" font-weight="bold" fill="#174C38" text-anchor="middle">3.0 Crop Lifecycle</text>
  <text x="380" y="315" font-size="11" fill="#16845B" text-anchor="middle">&amp; Agronomic Tracking</text>

  <!-- 4.0 Inventory & Resources -->
  <rect x="560" y="265" width="180" height="80" rx="20" fill="#E8F2EA" stroke="#16845B" stroke-width="2"/>
  <text x="650" y="295" font-size="12" font-weight="bold" fill="#174C38" text-anchor="middle">4.0 Inventory &amp; Stock</text>
  <text x="650" y="315" font-size="11" fill="#16845B" text-anchor="middle">Ledger Controller</text>

  <!-- 5.0 Farm Operations & Labour -->
  <rect x="290" y="415" width="180" height="80" rx="20" fill="#E8F2EA" stroke="#16845B" stroke-width="2"/>
  <text x="380" y="445" font-size="12" font-weight="bold" fill="#174C38" text-anchor="middle">5.0 Labour, Task &amp;</text>
  <text x="380" y="465" font-size="11" fill="#16845B" text-anchor="middle">Machinery Scheduling</text>

  <!-- 6.0 Decision Support & Disease Diagnostics -->
  <rect x="560" y="415" width="180" height="80" rx="20" fill="#E8F2EA" stroke="#16845B" stroke-width="2"/>
  <text x="650" y="445" font-size="12" font-weight="bold" fill="#174C38" text-anchor="middle">6.0 Decision Support &amp;</text>
  <text x="650" y="465" font-size="11" fill="#16845B" text-anchor="middle">AI Crop Doctor</text>

  <!-- Data Stores (Open-ended rects / double lines) -->
  <g transform="translate(300, 560)">
    <line x1="0" y1="0" x2="160" y2="0" stroke="#0F172A" stroke-width="2"/>
    <line x1="0" y1="35" x2="160" y2="35" stroke="#0F172A" stroke-width="2"/>
    <rect x="0" y="0" width="160" height="35" fill="#F1F5F9" opacity="0.8"/>
    <text x="10" y="22" font-size="11" font-weight="bold" fill="#334155">D1: Users &amp; Auth Ledger</text>
  </g>

  <g transform="translate(560, 560)">
    <line x1="0" y1="0" x2="160" y2="0" stroke="#0F172A" stroke-width="2"/>
    <line x1="0" y1="35" x2="160" y2="35" stroke="#0F172A" stroke-width="2"/>
    <rect x="0" y="0" width="160" height="35" fill="#F1F5F9" opacity="0.8"/>
    <text x="10" y="22" font-size="11" font-weight="bold" fill="#334155">D2: Farms &amp; Field Parcels</text>
  </g>

  <g transform="translate(300, 620)">
    <line x1="0" y1="0" x2="160" y2="0" stroke="#0F172A" stroke-width="2"/>
    <line x1="0" y1="35" x2="160" y2="35" stroke="#0F172A" stroke-width="2"/>
    <rect x="0" y="0" width="160" height="35" fill="#F1F5F9" opacity="0.8"/>
    <text x="10" y="22" font-size="11" font-weight="bold" fill="#334155">D3: Crops &amp; Phenology</text>
  </g>

  <g transform="translate(560, 620)">
    <line x1="0" y1="0" x2="160" y2="0" stroke="#0F172A" stroke-width="2"/>
    <line x1="0" y1="35" x2="160" y2="35" stroke="#0F172A" stroke-width="2"/>
    <rect x="0" y="0" width="160" height="35" fill="#F1F5F9" opacity="0.8"/>
    <text x="10" y="22" font-size="11" font-weight="bold" fill="#334155">D4: Inventory &amp; Stock</text>
  </g>

  <g transform="translate(760, 560)">
    <line x1="0" y1="0" x2="170" y2="0" stroke="#0F172A" stroke-width="2"/>
    <line x1="0" y1="35" x2="170" y2="35" stroke="#0F172A" stroke-width="2"/>
    <rect x="0" y="0" width="170" height="35" fill="#F1F5F9" opacity="0.8"/>
    <text x="10" y="22" font-size="11" font-weight="bold" fill="#334155">D5: Operations &amp; Labour</text>
  </g>

  <g transform="translate(760, 620)">
    <line x1="0" y1="0" x2="170" y2="0" stroke="#0F172A" stroke-width="2"/>
    <line x1="0" y1="35" x2="170" y2="35" stroke="#0F172A" stroke-width="2"/>
    <rect x="0" y="0" width="170" height="35" fill="#F1F5F9" opacity="0.8"/>
    <text x="10" y="22" font-size="11" font-weight="bold" fill="#334155">D6: Diagnostics &amp; Advisory</text>
  </g>

  <!-- Connecting Arrows -->
  <defs>
    <marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="#16845B"/>
    </marker>
    <marker id="arrow-dark" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="#334155"/>
    </marker>
  </defs>

  <!-- Farmer to Auth -->
  <line x1="200" y1="150" x2="285" y2="150" stroke="#16845B" stroke-width="1.8" marker-end="url(#arrow)"/>
  <text x="242" y="142" font-size="9" fill="#174C38" text-anchor="middle">Credentials</text>

  <!-- Farmer to Operations -->
  <line x1="125" y1="190" x2="125" y2="305" stroke="#16845B" stroke-width="1.8"/>
  <line x1="125" y1="305" x2="285" y2="305" stroke="#16845B" stroke-width="1.8" marker-end="url(#arrow)"/>
  <text x="200" y="297" font-size="9" fill="#174C38" text-anchor="middle">Sowing &amp; Field Data</text>

  <!-- Farmer to Stock -->
  <line x1="200" y1="170" x2="245" y2="170" stroke="#16845B" stroke-width="1.8"/>
  <line x1="245" y1="170" x2="245" y2="320" stroke="#16845B" stroke-width="1.8"/>
  <line x1="245" y1="320" x2="555" y2="320" stroke="#16845B" stroke-width="1.8" marker-end="url(#arrow)"/>
  <text x="495" y="312" font-size="9" fill="#174C38" text-anchor="middle">Stock Updates</text>

  <!-- APMC/Weather to Decision Support -->
  <line x1="900" y1="305" x2="745" y2="445" stroke="#16845B" stroke-width="1.8" marker-end="url(#arrow)"/>
  <text x="835" y="365" font-size="9" fill="#174C38" text-anchor="middle">Telemetry &amp; Mandi Rates</text>

  <!-- Decision Support to Agronomist -->
  <line x1="560" y1="465" x2="205" y2="465" stroke="#16845B" stroke-width="1.8" marker-end="url(#arrow)"/>
  <text x="245" y="457" font-size="9" fill="#174C38" text-anchor="middle">Pathology Reports</text>

  <!-- Process to Stores -->
  <line x1="380" y1="195" x2="380" y2="555" stroke="#334155" stroke-width="1.5" stroke-dasharray="3" marker-end="url(#arrow-dark)"/>
  <line x1="650" y1="195" x2="650" y2="555" stroke="#334155" stroke-width="1.5" stroke-dasharray="3" marker-end="url(#arrow-dark)"/>
  <line x1="380" y1="345" x2="380" y2="615" stroke="#334155" stroke-width="1.5" stroke-dasharray="3" marker-end="url(#arrow-dark)"/>
  <line x1="650" y1="345" x2="650" y2="615" stroke="#334155" stroke-width="1.5" stroke-dasharray="3" marker-end="url(#arrow-dark)"/>
  <line x1="470" y1="455" x2="755" y2="570" stroke="#334155" stroke-width="1.5" stroke-dasharray="3" marker-end="url(#arrow-dark)"/>
  <line x1="680" y1="495" x2="775" y2="615" stroke="#334155" stroke-width="1.5" stroke-dasharray="3" marker-end="url(#arrow-dark)"/>
</svg>'''

with open(f"{DIAGRAMS_DIR}/05_dfd_level_1.svg", "w") as f:
    f.write(svg_05)

# 06_dfd_level_2.svg - Inventory and Labour decomposition
svg_06 = '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1100 700" width="1100" height="700" style="background:#FFFFFF; font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <rect x="20" y="20" width="1060" height="660" rx="12" fill="#FAFBF8" stroke="#CBD5E1" stroke-width="1.5"/>
  <text x="40" y="55" font-size="20" font-weight="bold" fill="#174C38">AgriNexus AI — Data Flow Diagram (DFD Level 2)</text>
  <text x="40" y="78" font-size="12" fill="#64748B">Detailed Decomposition of Inventory Control, Labour Allocation &amp; Financial Journalizing</text>

  <!-- External Entity: Storekeeper / Supervisor -->
  <rect x="40" y="150" width="140" height="80" rx="6" fill="#1E293B" stroke="#0F172A" stroke-width="2"/>
  <text x="110" y="185" font-size="13" font-weight="bold" fill="#FFFFFF" text-anchor="middle">Farm Supervisor</text>
  <text x="110" y="205" font-size="11" fill="#94A3B8" text-anchor="middle">&amp; Storekeeper</text>

  <!-- Sub-process 4.1: Stock Inward & Supplier Invoicing -->
  <rect x="250" y="120" width="200" height="70" rx="16" fill="#E8F2EA" stroke="#16845B" stroke-width="2"/>
  <text x="350" y="148" font-size="12" font-weight="bold" fill="#174C38" text-anchor="middle">4.1 Inward Stock Receipt</text>
  <text x="350" y="168" font-size="11" fill="#16845B" text-anchor="middle">&amp; Unit Cost Recalculation</text>

  <!-- Sub-process 4.2: Field Requisition & Negative Guard -->
  <rect x="250" y="230" width="200" height="70" rx="16" fill="#E8F2EA" stroke="#16845B" stroke-width="2"/>
  <text x="350" y="258" font-size="12" font-weight="bold" fill="#174C38" text-anchor="middle">4.2 Outward Issue Guard</text>
  <text x="350" y="278" font-size="11" fill="#16845B" text-anchor="middle">&amp; Non-Negative Validation</text>

  <!-- Sub-process 4.3: Low Stock Alert Engine -->
  <rect x="250" y="340" width="200" height="70" rx="16" fill="#E8F2EA" stroke="#16845B" stroke-width="2"/>
  <text x="350" y="368" font-size="12" font-weight="bold" fill="#174C38" text-anchor="middle">4.3 Threshold Evaluator</text>
  <text x="350" y="388" font-size="11" fill="#16845B" text-anchor="middle">&amp; Notification Dispatcher</text>

  <!-- Sub-process 5.1: Worker Roster & Attendance Tracking -->
  <rect x="620" y="120" width="210" height="70" rx="16" fill="#EFF6FF" stroke="#2563EB" stroke-width="2"/>
  <text x="725" y="148" font-size="12" font-weight="bold" fill="#1E3A8A" text-anchor="middle">5.1 Daily Attendance Logger</text>
  <text x="725" y="168" font-size="11" fill="#2563EB" text-anchor="middle">&amp; Shift Verification</text>

  <!-- Sub-process 5.2: Automated Wage Accrual -->
  <rect x="620" y="230" width="210" height="70" rx="16" fill="#EFF6FF" stroke="#2563EB" stroke-width="2"/>
  <text x="725" y="258" font-size="12" font-weight="bold" fill="#1E3A8A" text-anchor="middle">5.2 Daily Wage Calculator</text>
  <text x="725" y="278" font-size="11" fill="#2563EB" text-anchor="middle">&amp; Overtime Computation</text>

  <!-- Sub-process 5.3: Financial Journal Entry -->
  <rect x="620" y="340" width="210" height="70" rx="16" fill="#EFF6FF" stroke="#2563EB" stroke-width="2"/>
  <text x="725" y="368" font-size="12" font-weight="bold" fill="#1E3A8A" text-anchor="middle">5.3 Double-Entry Journal</text>
  <text x="725" y="388" font-size="11" fill="#2563EB" text-anchor="middle">&amp; Cashflow Aggregator</text>

  <!-- Data Stores -->
  <!-- D4.1 Inventory Items -->
  <g transform="translate(180, 520)">
    <line x1="0" y1="0" x2="180" y2="0" stroke="#0F172A" stroke-width="2"/>
    <line x1="0" y1="35" x2="180" y2="35" stroke="#0F172A" stroke-width="2"/>
    <rect x="0" y="0" width="180" height="35" fill="#F8FAFC"/>
    <text x="10" y="22" font-size="11" font-weight="bold" fill="#0F172A">D4.1: Inventory Ledger</text>
  </g>

  <!-- D4.2 Inventory Transactions -->
  <g transform="translate(390, 520)">
    <line x1="0" y1="0" x2="180" y2="0" stroke="#0F172A" stroke-width="2"/>
    <line x1="0" y1="35" x2="180" y2="35" stroke="#0F172A" stroke-width="2"/>
    <rect x="0" y="0" width="180" height="35" fill="#F8FAFC"/>
    <text x="10" y="22" font-size="11" font-weight="bold" fill="#0F172A">D4.2: Stock Audit Trail</text>
  </g>

  <!-- D5.1 Labour Profiles -->
  <g transform="translate(600, 520)">
    <line x1="0" y1="0" x2="180" y2="0" stroke="#0F172A" stroke-width="2"/>
    <line x1="0" y1="35" x2="180" y2="35" stroke="#0F172A" stroke-width="2"/>
    <rect x="0" y="0" width="180" height="35" fill="#F8FAFC"/>
    <text x="10" y="22" font-size="11" font-weight="bold" fill="#0F172A">D5.1: Worker Directory</text>
  </g>

  <!-- D5.2 Financial Transactions -->
  <g transform="translate(810, 520)">
    <line x1="0" y1="0" x2="180" y2="0" stroke="#0F172A" stroke-width="2"/>
    <line x1="0" y1="35" x2="180" y2="35" stroke="#0F172A" stroke-width="2"/>
    <rect x="0" y="0" width="180" height="35" fill="#F8FAFC"/>
    <text x="10" y="22" font-size="11" font-weight="bold" fill="#0F172A">D5.2: Financial Vouchers</text>
  </g>

  <!-- Flow Markers & Lines -->
  <defs>
    <marker id="arr-green" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="#16845B"/>
    </marker>
    <marker id="arr-blue" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="#2563EB"/>
    </marker>
  </defs>

  <line x1="180" y1="160" x2="245" y2="160" stroke="#16845B" stroke-width="1.8" marker-end="url(#arr-green)"/>
  <text x="210" y="152" font-size="9" fill="#16845B" text-anchor="middle">Inward PO</text>

  <line x1="180" y1="190" x2="215" y2="190" stroke="#16845B" stroke-width="1.8"/>
  <line x1="215" y1="190" x2="215" y2="265" stroke="#16845B" stroke-width="1.8"/>
  <line x1="215" y1="265" x2="245" y2="265" stroke="#16845B" stroke-width="1.8" marker-end="url(#arr-green)"/>
  <text x="235" y="250" font-size="9" fill="#16845B" text-anchor="middle">Issue Requisition</text>

  <!-- Connect to DB -->
  <line x1="350" y1="190" x2="270" y2="515" stroke="#16845B" stroke-width="1.5" stroke-dasharray="3" marker-end="url(#arr-green)"/>
  <line x1="350" y1="300" x2="480" y2="515" stroke="#16845B" stroke-width="1.5" stroke-dasharray="3" marker-end="url(#arr-green)"/>
  <line x1="350" y1="410" x2="110" y2="410" stroke="#DC2626" stroke-width="1.5"/>
  <line x1="110" y1="410" x2="110" y2="235" stroke="#DC2626" stroke-width="1.5" marker-end="url(#arr-green)"/>
  <text x="145" y="402" font-size="9" fill="#DC2626">Threshold Breach Alert</text>

  <!-- Labour Flow -->
  <line x1="725" y1="190" x2="725" y2="225" stroke="#2563EB" stroke-width="1.8" marker-end="url(#arr-blue)"/>
  <text x="765" y="210" font-size="9" fill="#2563EB">Present Days</text>
  
  <line x1="725" y1="300" x2="725" y2="335" stroke="#2563EB" stroke-width="1.8" marker-end="url(#arr-blue)"/>
  <text x="770" y="320" font-size="9" fill="#2563EB">Net Wage Amount</text>

  <line x1="725" y1="410" x2="890" y2="515" stroke="#2563EB" stroke-width="1.5" stroke-dasharray="3" marker-end="url(#arr-blue)"/>
</svg>'''

with open(f"{DIAGRAMS_DIR}/06_dfd_level_2.svg", "w") as f:
    f.write(svg_06)

# 07_entity_relationship_diagram.svg
svg_07 = '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 900" width="1200" height="900" style="background:#FFFFFF; font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <rect x="20" y="20" width="1160" height="860" rx="12" fill="#FAFBF8" stroke="#CBD5E1" stroke-width="1.5"/>
  <text x="40" y="55" font-size="20" font-weight="bold" fill="#174C38">AgriNexus AI — Comprehensive Entity-Relationship Diagram (ERD)</text>
  <text x="40" y="78" font-size="12" fill="#64748B">Relational Schema Covering 21 Tables with Foreign Keys, Normal Forms &amp; Referential Integrity</text>

  <!-- TABLE: users -->
  <g transform="translate(50, 110)">
    <rect x="0" y="0" width="190" height="150" rx="4" fill="#FFFFFF" stroke="#16845B" stroke-width="1.5"/>
    <rect x="0" y="0" width="190" height="26" rx="4" fill="#16845B"/>
    <text x="95" y="18" font-size="12" font-weight="bold" fill="#FFFFFF" text-anchor="middle">users</text>
    <text x="10" y="44" font-size="10" font-weight="bold" fill="#0F172A">PK  id: UUID</text>
    <text x="10" y="60" font-size="10" fill="#334155">email: VARCHAR (UQ)</text>
    <text x="10" y="76" font-size="10" fill="#334155">hashed_password: TEXT</text>
    <text x="10" y="92" font-size="10" fill="#334155">full_name: VARCHAR</text>
    <text x="10" y="108" font-size="10" fill="#334155">phone_number: VARCHAR</text>
    <text x="10" y="124" font-size="10" fill="#334155">role: UserRoleEnum</text>
    <text x="10" y="140" font-size="10" fill="#334155">created_at: TIMESTAMP</text>
  </g>

  <!-- TABLE: farms -->
  <g transform="translate(300, 110)">
    <rect x="0" y="0" width="190" height="150" rx="4" fill="#FFFFFF" stroke="#16845B" stroke-width="1.5"/>
    <rect x="0" y="0" width="190" height="26" rx="4" fill="#16845B"/>
    <text x="95" y="18" font-size="12" font-weight="bold" fill="#FFFFFF" text-anchor="middle">farms</text>
    <text x="10" y="44" font-size="10" font-weight="bold" fill="#0F172A">PK  id: INTEGER</text>
    <text x="10" y="60" font-size="10" fill="#2563EB">FK  owner_id: UUID</text>
    <text x="10" y="76" font-size="10" fill="#334155">name: VARCHAR(100)</text>
    <text x="10" y="92" font-size="10" fill="#334155">total_area: NUMERIC(10,2)</text>
    <text x="10" y="108" font-size="10" fill="#334155">area_unit: VARCHAR(10)</text>
    <text x="10" y="124" font-size="10" fill="#334155">district: VARCHAR(50)</text>
    <text x="10" y="140" font-size="10" fill="#334155">state: VARCHAR(50)</text>
  </g>

  <!-- TABLE: fields -->
  <g transform="translate(550, 110)">
    <rect x="0" y="0" width="190" height="150" rx="4" fill="#FFFFFF" stroke="#16845B" stroke-width="1.5"/>
    <rect x="0" y="0" width="190" height="26" rx="4" fill="#16845B"/>
    <text x="95" y="18" font-size="12" font-weight="bold" fill="#FFFFFF" text-anchor="middle">fields</text>
    <text x="10" y="44" font-size="10" font-weight="bold" fill="#0F172A">PK  id: INTEGER</text>
    <text x="10" y="60" font-size="10" fill="#2563EB">FK  farm_id: INTEGER</text>
    <text x="10" y="76" font-size="10" fill="#334155">name: VARCHAR(100)</text>
    <text x="10" y="92" font-size="10" fill="#334155">area: NUMERIC(10,2)</text>
    <text x="10" y="108" font-size="10" fill="#334155">soil_type: VARCHAR(50)</text>
    <text x="10" y="124" font-size="10" fill="#334155">irrigation_type: VARCHAR(50)</text>
    <text x="10" y="140" font-size="10" fill="#334155">coordinates: JSONB</text>
  </g>

  <!-- TABLE: crops -->
  <g transform="translate(800, 110)">
    <rect x="0" y="0" width="200" height="165" rx="4" fill="#FFFFFF" stroke="#16845B" stroke-width="1.5"/>
    <rect x="0" y="0" width="200" height="26" rx="4" fill="#16845B"/>
    <text x="100" y="18" font-size="12" font-weight="bold" fill="#FFFFFF" text-anchor="middle">crops</text>
    <text x="10" y="44" font-size="10" font-weight="bold" fill="#0F172A">PK  id: INTEGER</text>
    <text x="10" y="60" font-size="10" fill="#2563EB">FK  field_id: INTEGER</text>
    <text x="10" y="76" font-size="10" fill="#334155">crop_name: VARCHAR(50)</text>
    <text x="10" y="92" font-size="10" fill="#334155">variety: VARCHAR(50)</text>
    <text x="10" y="108" font-size="10" fill="#334155">growth_stage: VARCHAR(30)</text>
    <text x="10" y="124" font-size="10" fill="#334155">expected_yield: NUMERIC(8,2)</text>
    <text x="10" y="140" font-size="10" fill="#334155">actual_yield: NUMERIC(8,2)</text>
    <text x="10" y="156" font-size="10" fill="#334155">sowing_date: DATE</text>
  </g>

  <!-- TABLE: inventory_items -->
  <g transform="translate(50, 310)">
    <rect x="0" y="0" width="190" height="150" rx="4" fill="#FFFFFF" stroke="#0284C7" stroke-width="1.5"/>
    <rect x="0" y="0" width="190" height="26" rx="4" fill="#0284C7"/>
    <text x="95" y="18" font-size="12" font-weight="bold" fill="#FFFFFF" text-anchor="middle">inventory_items</text>
    <text x="10" y="44" font-size="10" font-weight="bold" fill="#0F172A">PK  id: INTEGER</text>
    <text x="10" y="60" font-size="10" fill="#2563EB">FK  farm_id: INTEGER</text>
    <text x="10" y="76" font-size="10" fill="#334155">name: VARCHAR(100)</text>
    <text x="10" y="92" font-size="10" fill="#334155">category: VARCHAR(50)</text>
    <text x="10" y="108" font-size="10" fill="#334155">quantity: NUMERIC(10,2)</text>
    <text x="10" y="124" font-size="10" fill="#334155">unit: VARCHAR(20)</text>
    <text x="10" y="140" font-size="10" fill="#334155">unit_price: NUMERIC(10,2)</text>
  </g>

  <!-- TABLE: inventory_transactions -->
  <g transform="translate(300, 310)">
    <rect x="0" y="0" width="200" height="150" rx="4" fill="#FFFFFF" stroke="#0284C7" stroke-width="1.5"/>
    <rect x="0" y="0" width="200" height="26" rx="4" fill="#0284C7"/>
    <text x="100" y="18" font-size="12" font-weight="bold" fill="#FFFFFF" text-anchor="middle">inventory_transactions</text>
    <text x="10" y="44" font-size="10" font-weight="bold" fill="#0F172A">PK  id: INTEGER</text>
    <text x="10" y="60" font-size="10" fill="#2563EB">FK  item_id: INTEGER</text>
    <text x="10" y="76" font-size="10" fill="#334155">transaction_type: VARCHAR</text>
    <text x="10" y="92" font-size="10" fill="#334155">quantity: NUMERIC(10,2)</text>
    <text x="10" y="108" font-size="10" fill="#334155">unit_price: NUMERIC(10,2)</text>
    <text x="10" y="124" font-size="10" fill="#334155">total_cost: NUMERIC(12,2)</text>
    <text x="10" y="140" font-size="10" fill="#334155">created_at: TIMESTAMP</text>
  </g>

  <!-- TABLE: labour -->
  <g transform="translate(550, 310)">
    <rect x="0" y="0" width="190" height="150" rx="4" fill="#FFFFFF" stroke="#D97706" stroke-width="1.5"/>
    <rect x="0" y="0" width="190" height="26" rx="4" fill="#D97706"/>
    <text x="95" y="18" font-size="12" font-weight="bold" fill="#FFFFFF" text-anchor="middle">labour</text>
    <text x="10" y="44" font-size="10" font-weight="bold" fill="#0F172A">PK  id: INTEGER</text>
    <text x="10" y="60" font-size="10" fill="#2563EB">FK  farm_id: INTEGER</text>
    <text x="10" y="76" font-size="10" fill="#334155">name: VARCHAR(100)</text>
    <text x="10" y="92" font-size="10" fill="#334155">contact_phone: VARCHAR</text>
    <text x="10" y="108" font-size="10" fill="#334155">daily_wage: NUMERIC(8,2)</text>
    <text x="10" y="124" font-size="10" fill="#334155">skill_type: VARCHAR(50)</text>
    <text x="10" y="140" font-size="10" fill="#334155">is_active: BOOLEAN</text>
  </g>

  <!-- TABLE: labour_attendance -->
  <g transform="translate(800, 310)">
    <rect x="0" y="0" width="200" height="150" rx="4" fill="#FFFFFF" stroke="#D97706" stroke-width="1.5"/>
    <rect x="0" y="0" width="200" height="26" rx="4" fill="#D97706"/>
    <text x="100" y="18" font-size="12" font-weight="bold" fill="#FFFFFF" text-anchor="middle">labour_attendance</text>
    <text x="10" y="44" font-size="10" font-weight="bold" fill="#0F172A">PK  id: INTEGER</text>
    <text x="10" y="60" font-size="10" fill="#2563EB">FK  labour_id: INTEGER</text>
    <text x="10" y="76" font-size="10" fill="#334155">date: DATE</text>
    <text x="10" y="92" font-size="10" fill="#334155">status: VARCHAR(20)</text>
    <text x="10" y="108" font-size="10" fill="#334155">hours_worked: NUMERIC(4,1)</text>
    <text x="10" y="124" font-size="10" fill="#334155">wage_paid: NUMERIC(8,2)</text>
    <text x="10" y="140" font-size="10" fill="#334155">payment_status: VARCHAR</text>
  </g>

  <!-- TABLE: equipment -->
  <g transform="translate(50, 500)">
    <rect x="0" y="0" width="190" height="150" rx="4" fill="#FFFFFF" stroke="#475569" stroke-width="1.5"/>
    <rect x="0" y="0" width="190" height="26" rx="4" fill="#475569"/>
    <text x="95" y="18" font-size="12" font-weight="bold" fill="#FFFFFF" text-anchor="middle">equipment</text>
    <text x="10" y="44" font-size="10" font-weight="bold" fill="#0F172A">PK  id: INTEGER</text>
    <text x="10" y="60" font-size="10" fill="#2563EB">FK  farm_id: INTEGER</text>
    <text x="10" y="76" font-size="10" fill="#334155">name: VARCHAR(100)</text>
    <text x="10" y="92" font-size="10" fill="#334155">category: VARCHAR(50)</text>
    <text x="10" y="108" font-size="10" fill="#334155">purchase_cost: NUMERIC(10,2)</text>
    <text x="10" y="124" font-size="10" fill="#334155">status: VARCHAR(30)</text>
    <text x="10" y="140" font-size="10" fill="#334155">next_service_date: DATE</text>
  </g>

  <!-- TABLE: financial_transactions -->
  <g transform="translate(300, 500)">
    <rect x="0" y="0" width="200" height="150" rx="4" fill="#FFFFFF" stroke="#16A34A" stroke-width="1.5"/>
    <rect x="0" y="0" width="200" height="26" rx="4" fill="#16A34A"/>
    <text x="100" y="18" font-size="12" font-weight="bold" fill="#FFFFFF" text-anchor="middle">financial_transactions</text>
    <text x="10" y="44" font-size="10" font-weight="bold" fill="#0F172A">PK  id: INTEGER</text>
    <text x="10" y="60" font-size="10" fill="#2563EB">FK  farm_id: INTEGER</text>
    <text x="10" y="76" font-size="10" fill="#334155">transaction_type: VARCHAR</text>
    <text x="10" y="92" font-size="10" fill="#334155">category: VARCHAR(50)</text>
    <text x="10" y="108" font-size="10" fill="#334155">amount: NUMERIC(12,2)</text>
    <text x="10" y="124" font-size="10" fill="#334155">date: DATE</text>
    <text x="10" y="140" font-size="10" fill="#334155">payment_method: VARCHAR</text>
  </g>

  <!-- TABLE: farm_activities -->
  <g transform="translate(550, 500)">
    <rect x="0" y="0" width="190" height="150" rx="4" fill="#FFFFFF" stroke="#9333EA" stroke-width="1.5"/>
    <rect x="0" y="0" width="190" height="26" rx="4" fill="#9333EA"/>
    <text x="95" y="18" font-size="12" font-weight="bold" fill="#FFFFFF" text-anchor="middle">farm_activities</text>
    <text x="10" y="44" font-size="10" font-weight="bold" fill="#0F172A">PK  id: INTEGER</text>
    <text x="10" y="60" font-size="10" fill="#2563EB">FK  farm_id / field_id</text>
    <text x="10" y="76" font-size="10" fill="#334155">activity_type: VARCHAR</text>
    <text x="10" y="92" font-size="10" fill="#334155">scheduled_date: DATE</text>
    <text x="10" y="108" font-size="10" fill="#334155">status: VARCHAR(20)</text>
    <text x="10" y="124" font-size="10" fill="#334155">assigned_to: INTEGER</text>
    <text x="10" y="140" font-size="10" fill="#334155">notes: TEXT</text>
  </g>

  <!-- TABLE: disease_diagnoses -->
  <g transform="translate(800, 500)">
    <rect x="0" y="0" width="200" height="150" rx="4" fill="#FFFFFF" stroke="#E11D48" stroke-width="1.5"/>
    <rect x="0" y="0" width="200" height="26" rx="4" fill="#E11D48"/>
    <text x="100" y="18" font-size="12" font-weight="bold" fill="#FFFFFF" text-anchor="middle">disease_diagnoses</text>
    <text x="10" y="44" font-size="10" font-weight="bold" fill="#0F172A">PK  id: INTEGER</text>
    <text x="10" y="60" font-size="10" fill="#2563EB">FK  field_id: INTEGER</text>
    <text x="10" y="76" font-size="10" fill="#334155">crop_type: VARCHAR(50)</text>
    <text x="10" y="92" font-size="10" fill="#334155">disease_name: VARCHAR(100)</text>
    <text x="10" y="108" font-size="10" fill="#334155">confidence: NUMERIC(5,2)</text>
    <text x="10" y="124" font-size="10" fill="#334155">treatment_plan: JSONB</text>
    <text x="10" y="140" font-size="10" fill="#334155">diagnosed_at: TIMESTAMP</text>
  </g>

  <!-- Relation Lines -->
  <!-- users -> farms (1:N) -->
  <line x1="240" y1="180" x2="300" y2="180" stroke="#0F172A" stroke-width="1.5"/>
  <circle cx="243" cy="180" r="3" fill="#0F172A"/>
  <text x="270" y="173" font-size="9" fill="#0F172A">1:N</text>

  <!-- farms -> fields (1:N) -->
  <line x1="490" y1="180" x2="550" y2="180" stroke="#0F172A" stroke-width="1.5"/>
  <circle cx="493" cy="180" r="3" fill="#0F172A"/>
  <text x="520" y="173" font-size="9" fill="#0F172A">1:N</text>

  <!-- fields -> crops (1:N) -->
  <line x1="740" y1="180" x2="800" y2="180" stroke="#0F172A" stroke-width="1.5"/>
  <circle cx="743" cy="180" r="3" fill="#0F172A"/>
  <text x="770" y="173" font-size="9" fill="#0F172A">1:N</text>

  <!-- farms -> inventory_items (1:N) -->
  <line x1="395" y1="260" x2="395" y2="285" stroke="#0F172A" stroke-width="1.5"/>
  <line x1="395" y1="285" x2="145" y2="285" stroke="#0F172A" stroke-width="1.5"/>
  <line x1="145" y1="285" x2="145" y2="310" stroke="#0F172A" stroke-width="1.5"/>

  <!-- inventory_items -> inventory_transactions (1:N) -->
  <line x1="240" y1="380" x2="300" y2="380" stroke="#0F172A" stroke-width="1.5"/>
  <circle cx="243" cy="380" r="3" fill="#0F172A"/>
  <text x="270" y="373" font-size="9" fill="#0F172A">1:N</text>

  <!-- labour -> labour_attendance (1:N) -->
  <line x1="740" y1="380" x2="800" y2="380" stroke="#0F172A" stroke-width="1.5"/>
  <circle cx="743" cy="380" r="3" fill="#0F172A"/>
  <text x="770" y="373" font-size="9" fill="#0F172A">1:N</text>

  <!-- Footnote -->
  <text x="50" y="720" font-size="11" font-weight="bold" fill="#334155">Additional Architectural Schema Tables:</text>
  <text x="50" y="740" font-size="10" fill="#64748B">• user_roles &amp; roles (RBAC association table)</text>
  <text x="50" y="756" font-size="10" fill="#64748B">• crop_cycles (Agronomic phase timeline records)</text>
  <text x="50" y="772" font-size="10" fill="#64748B">• equipment_maintenance (Service logs, oil change &amp; part expenses)</text>
  <text x="400" y="740" font-size="10" fill="#64748B">• soil_records (pH, N-P-K, electrical conductivity history)</text>
  <text x="400" y="756" font-size="10" fill="#64748B">• irrigation_records (Water volume m³, pump run hours, valve state)</text>
  <text x="400" y="772" font-size="10" fill="#64748B">• notifications (Event triggers, low-stock, frost &amp; rain alerts)</text>
  <text x="750" y="740" font-size="10" fill="#64748B">• audit_logs (Security and admin compliance tracking)</text>
  <text x="750" y="756" font-size="10" fill="#64748B">• market_prices (Historical APMC mandi price cache)</text>
</svg>'''

with open(f"{DIAGRAMS_DIR}/07_entity_relationship_diagram.svg", "w") as f:
    f.write(svg_07)

# 08_uml_class_diagram.svg
svg_08 = '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1100 800" width="1100" height="800" style="background:#FFFFFF; font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <rect x="20" y="20" width="1060" height="760" rx="12" fill="#FAFBF8" stroke="#CBD5E1" stroke-width="1.5"/>
  <text x="40" y="55" font-size="20" font-weight="bold" fill="#174C38">AgriNexus AI — UML Domain Class Diagram</text>
  <text x="40" y="78" font-size="12" fill="#64748B">Object-Oriented Domain Entities, Field Attributes, Type Signatures and Method Contracts</text>

  <!-- CLASS: User -->
  <g transform="translate(50, 110)">
    <rect x="0" y="0" width="200" height="180" rx="4" fill="#FFFFFF" stroke="#0F172A" stroke-width="1.5"/>
    <rect x="0" y="0" width="200" height="26" rx="4" fill="#0F172A"/>
    <text x="100" y="18" font-size="12" font-weight="bold" fill="#FFFFFF" text-anchor="middle">User</text>
    <text x="10" y="44" font-size="10" fill="#334155">+ id: UUID</text>
    <text x="10" y="58" font-size="10" fill="#334155">+ email: str</text>
    <text x="10" y="72" font-size="10" fill="#334155">+ full_name: str</text>
    <text x="10" y="86" font-size="10" fill="#334155">+ role: UserRoleEnum</text>
    <text x="10" y="100" font-size="10" fill="#334155">+ is_active: bool</text>
    <line x1="0" y1="108" x2="200" y2="108" stroke="#CBD5E1"/>
    <text x="10" y="124" font-size="10" fill="#16845B">+ verify_password(raw): bool</text>
    <text x="10" y="138" font-size="10" fill="#16845B">+ generate_jwt_token(): str</text>
    <text x="10" y="152" font-size="10" fill="#16845B">+ has_permission(role): bool</text>
  </g>

  <!-- CLASS: Farm -->
  <g transform="translate(320, 110)">
    <rect x="0" y="0" width="210" height="180" rx="4" fill="#FFFFFF" stroke="#16845B" stroke-width="1.5"/>
    <rect x="0" y="0" width="210" height="26" rx="4" fill="#16845B"/>
    <text x="105" y="18" font-size="12" font-weight="bold" fill="#FFFFFF" text-anchor="middle">Farm</text>
    <text x="10" y="44" font-size="10" fill="#334155">+ id: int</text>
    <text x="10" y="58" font-size="10" fill="#334155">+ owner_id: UUID</text>
    <text x="10" y="72" font-size="10" fill="#334155">+ name: str</text>
    <text x="10" y="86" font-size="10" fill="#334155">+ total_area: Decimal</text>
    <text x="10" y="100" font-size="10" fill="#334155">+ district: str</text>
    <line x1="0" y1="108" x2="210" y2="108" stroke="#CBD5E1"/>
    <text x="10" y="124" font-size="10" fill="#16845B">+ get_allocated_area(): Decimal</text>
    <text x="10" y="138" font-size="10" fill="#16845B">+ get_remaining_capacity(): Decimal</text>
    <text x="10" y="152" font-size="10" fill="#16845B">+ validate_field_addition(area): bool</text>
  </g>

  <!-- CLASS: Field -->
  <g transform="translate(600, 110)">
    <rect x="0" y="0" width="210" height="180" rx="4" fill="#FFFFFF" stroke="#16845B" stroke-width="1.5"/>
    <rect x="0" y="0" width="210" height="26" rx="4" fill="#16845B"/>
    <text x="105" y="18" font-size="12" font-weight="bold" fill="#FFFFFF" text-anchor="middle">Field</text>
    <text x="10" y="44" font-size="10" fill="#334155">+ id: int</text>
    <text x="10" y="58" font-size="10" fill="#334155">+ farm_id: int</text>
    <text x="10" y="72" font-size="10" fill="#334155">+ name: str</text>
    <text x="10" y="86" font-size="10" fill="#334155">+ area: Decimal</text>
    <text x="10" y="100" font-size="10" fill="#334155">+ soil_type: str</text>
    <line x1="0" y1="108" x2="210" y2="108" stroke="#CBD5E1"/>
    <text x="10" y="124" font-size="10" fill="#16845B">+ get_current_crop(): Crop</text>
    <text x="10" y="138" font-size="10" fill="#16845B">+ calculate_water_quota(): float</text>
    <text x="10" y="152" font-size="10" fill="#16845B">+ get_geojson_boundary(): dict</text>
  </g>

  <!-- CLASS: Crop -->
  <g transform="translate(870, 110)">
    <rect x="0" y="0" width="200" height="180" rx="4" fill="#FFFFFF" stroke="#16845B" stroke-width="1.5"/>
    <rect x="0" y="0" width="200" height="26" rx="4" fill="#16845B"/>
    <text x="100" y="18" font-size="12" font-weight="bold" fill="#FFFFFF" text-anchor="middle">Crop</text>
    <text x="10" y="44" font-size="10" fill="#334155">+ id: int</text>
    <text x="10" y="58" font-size="10" fill="#334155">+ field_id: int</text>
    <text x="10" y="72" font-size="10" fill="#334155">+ crop_name: str</text>
    <text x="10" y="86" font-size="10" fill="#334155">+ growth_stage: str</text>
    <text x="10" y="100" font-size="10" fill="#334155">+ sowing_date: date</text>
    <line x1="0" y1="108" x2="200" y2="108" stroke="#CBD5E1"/>
    <text x="10" y="124" font-size="10" fill="#16845B">+ calculate_gdd(): float</text>
    <text x="10" y="138" font-size="10" fill="#16845B">+ advance_stage(new_stage): void</text>
    <text x="10" y="152" font-size="10" fill="#16845B">+ estimate_yield_deviation(): float</text>
  </g>

  <!-- CLASS: InventoryItem -->
  <g transform="translate(50, 350)">
    <rect x="0" y="0" width="210" height="180" rx="4" fill="#FFFFFF" stroke="#0284C7" stroke-width="1.5"/>
    <rect x="0" y="0" width="210" height="26" rx="4" fill="#0284C7"/>
    <text x="105" y="18" font-size="12" font-weight="bold" fill="#FFFFFF" text-anchor="middle">InventoryItem</text>
    <text x="10" y="44" font-size="10" fill="#334155">+ id: int</text>
    <text x="10" y="58" font-size="10" fill="#334155">+ farm_id: int</text>
    <text x="10" y="72" font-size="10" fill="#334155">+ quantity: Decimal</text>
    <text x="10" y="86" font-size="10" fill="#334155">+ min_stock_threshold: Decimal</text>
    <text x="10" y="100" font-size="10" fill="#334155">+ unit: str</text>
    <line x1="0" y1="108" x2="210" y2="108" stroke="#CBD5E1"/>
    <text x="10" y="124" font-size="10" fill="#0284C7">+ dispense(qty): bool</text>
    <text x="10" y="138" font-size="10" fill="#0284C7">+ replenish(qty, price): void</text>
    <text x="10" y="152" font-size="10" fill="#0284C7">+ is_low_stock(): bool</text>
  </g>

  <!-- CLASS: Labour -->
  <g transform="translate(320, 350)">
    <rect x="0" y="0" width="210" height="180" rx="4" fill="#FFFFFF" stroke="#D97706" stroke-width="1.5"/>
    <rect x="0" y="0" width="210" height="26" rx="4" fill="#D97706"/>
    <text x="105" y="18" font-size="12" font-weight="bold" fill="#FFFFFF" text-anchor="middle">Labour</text>
    <text x="10" y="44" font-size="10" fill="#334155">+ id: int</text>
    <text x="10" y="58" font-size="10" fill="#334155">+ farm_id: int</text>
    <text x="10" y="72" font-size="10" fill="#334155">+ name: str</text>
    <text x="10" y="86" font-size="10" fill="#334155">+ daily_wage: Decimal</text>
    <text x="10" y="100" font-size="10" fill="#334155">+ is_active: bool</text>
    <line x1="0" y1="108" x2="210" y2="108" stroke="#CBD5E1"/>
    <text x="10" y="124" font-size="10" fill="#D97706">+ mark_attendance(date, hrs): void</text>
    <text x="10" y="138" font-size="10" fill="#D97706">+ compute_payroll(month): Decimal</text>
    <text x="10" y="152" font-size="10" fill="#D97706">+ get_work_history(): list</text>
  </g>

  <!-- CLASS: Equipment -->
  <g transform="translate(600, 350)">
    <rect x="0" y="0" width="210" height="180" rx="4" fill="#FFFFFF" stroke="#475569" stroke-width="1.5"/>
    <rect x="0" y="0" width="210" height="26" rx="4" fill="#475569"/>
    <text x="105" y="18" font-size="12" font-weight="bold" fill="#FFFFFF" text-anchor="middle">Equipment</text>
    <text x="10" y="44" font-size="10" fill="#334155">+ id: int</text>
    <text x="10" y="58" font-size="10" fill="#334155">+ name: str</text>
    <text x="10" y="72" font-size="10" fill="#334155">+ category: str</text>
    <text x="10" y="86" font-size="10" fill="#334155">+ status: str</text>
    <text x="10" y="100" font-size="10" fill="#334155">+ next_service_date: date</text>
    <line x1="0" y1="108" x2="210" y2="108" stroke="#CBD5E1"/>
    <text x="10" y="124" font-size="10" fill="#475569">+ record_service(cost, notes): void</text>
    <text x="10" y="138" font-size="10" fill="#475569">+ is_service_due(): bool</text>
    <text x="10" y="152" font-size="10" fill="#475569">+ log_operating_hours(hrs): void</text>
  </g>

  <!-- CLASS: FinancialTransaction -->
  <g transform="translate(870, 350)">
    <rect x="0" y="0" width="200" height="180" rx="4" fill="#FFFFFF" stroke="#16A34A" stroke-width="1.5"/>
    <rect x="0" y="0" width="200" height="26" rx="4" fill="#16A34A"/>
    <text x="100" y="18" font-size="12" font-weight="bold" fill="#FFFFFF" text-anchor="middle">FinancialTransaction</text>
    <text x="10" y="44" font-size="10" fill="#334155">+ id: int</text>
    <text x="10" y="58" font-size="10" fill="#334155">+ farm_id: int</text>
    <text x="10" y="72" font-size="10" fill="#334155">+ transaction_type: str</text>
    <text x="10" y="86" font-size="10" fill="#334155">+ amount: Decimal</text>
    <text x="10" y="100" font-size="10" fill="#334155">+ date: date</text>
    <line x1="0" y1="108" x2="200" y2="108" stroke="#CBD5E1"/>
    <text x="10" y="124" font-size="10" fill="#16A34A">+ post_to_ledger(): bool</text>
    <text x="10" y="138" font-size="10" fill="#16A34A">+ categorize_pnl(): str</text>
    <text x="10" y="152" font-size="10" fill="#16A34A">+ export_voucher(): dict</text>
  </g>

  <!-- Aggregation & Association Lines -->
  <!-- User to Farm (1 to 0..*) -->
  <line x1="250" y1="180" x2="320" y2="180" stroke="#0F172A" stroke-width="1.5"/>
  <polygon points="320,180 310,175 310,185" fill="#0F172A"/>
  <text x="255" y="173" font-size="9" fill="#0F172A">1</text>
  <text x="300" y="173" font-size="9" fill="#0F172A">0..*</text>

  <!-- Farm to Field (Composition: filled diamond) -->
  <line x1="530" y1="180" x2="600" y2="180" stroke="#0F172A" stroke-width="1.5"/>
  <polygon points="530,180 540,175 550,180 540,185" fill="#0F172A"/>
  <text x="555" y="173" font-size="9" fill="#0F172A">1</text>
  <text x="585" y="173" font-size="9" fill="#0F172A">1..*</text>

  <!-- Field to Crop (Aggregation: open diamond) -->
  <line x1="810" y1="180" x2="870" y2="180" stroke="#0F172A" stroke-width="1.5"/>
  <polygon points="810,180 820,175 830,180 820,185" fill="#FFFFFF" stroke="#0F172A" stroke-width="1.2"/>
  <text x="835" y="173" font-size="9" fill="#0F172A">1</text>
  <text x="855" y="173" font-size="9" fill="#0F172A">0..*</text>

  <!-- Farm to Inventory, Labour, Equipment -->
  <line x1="425" y1="290" x2="425" y2="320" stroke="#0F172A" stroke-width="1.2"/>
  <line x1="155" y1="320" x2="705" y2="320" stroke="#0F172A" stroke-width="1.2"/>
  <line x1="155" y1="320" x2="155" y2="350" stroke="#0F172A" stroke-width="1.2"/>
  <line x1="425" y1="320" x2="425" y2="350" stroke="#0F172A" stroke-width="1.2"/>
  <line x1="705" y1="320" x2="705" y2="350" stroke="#0F172A" stroke-width="1.2"/>
</svg>'''

with open(f"{DIAGRAMS_DIR}/08_uml_class_diagram.svg", "w") as f:
    f.write(svg_08)

# 09_angular_component_hierarchy.svg
svg_09 = '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1150 780" width="1150" height="780" style="background:#FFFFFF; font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <rect x="20" y="20" width="1110" height="740" rx="12" fill="#FAFBF8" stroke="#CBD5E1" stroke-width="1.5"/>
  <text x="40" y="55" font-size="20" font-weight="bold" fill="#174C38">AgriNexus AI — Angular 22 Component Hierarchy</text>
  <text x="40" y="78" font-size="12" fill="#64748B">Standalone Component Architecture, Routing Outlets &amp; Dependency Injection Graph</text>

  <!-- Root: AppComponent -->
  <rect x="475" y="110" width="200" height="45" rx="6" fill="#1E293B" stroke="#0F172A" stroke-width="2"/>
  <text x="575" y="137" font-size="13" font-weight="bold" fill="#FFFFFF" text-anchor="middle">AppComponent (Root)</text>

  <!-- Intermediate: AppLayoutComponent -->
  <rect x="460" y="200" width="230" height="50" rx="6" fill="#16845B" stroke="#174C38" stroke-width="2"/>
  <text x="575" y="225" font-size="12" font-weight="bold" fill="#FFFFFF" text-anchor="middle">AppLayoutComponent</text>
  <text x="575" y="240" font-size="10" fill="#E8F2EA" text-anchor="middle">(Master Application Shell)</text>

  <!-- Shell Subcomponents -->
  <rect x="180" y="290" width="170" height="40" rx="4" fill="#E8F2EA" stroke="#16845B" stroke-width="1.5"/>
  <text x="265" y="315" font-size="11" font-weight="bold" fill="#174C38" text-anchor="middle">SidebarComponent</text>

  <rect x="380" y="290" width="170" height="40" rx="4" fill="#E8F2EA" stroke="#16845B" stroke-width="1.5"/>
  <text x="465" y="315" font-size="11" font-weight="bold" fill="#174C38" text-anchor="middle">NavbarComponent</text>

  <rect x="580" y="290" width="190" height="40" rx="4" fill="#FEE2E2" stroke="#DC2626" stroke-width="1.5"/>
  <text x="675" y="315" font-size="11" font-weight="bold" fill="#991B1B" text-anchor="middle">&lt;router-outlet&gt;</text>

  <rect x="800" y="290" width="170" height="40" rx="4" fill="#E8F2EA" stroke="#16845B" stroke-width="1.5"/>
  <text x="885" y="315" font-size="11" font-weight="bold" fill="#174C38" text-anchor="middle">NotificationToast</text>

  <!-- Feature Routed Components under router-outlet -->
  <g transform="translate(40, 390)">
    <!-- Dashboard -->
    <rect x="0" y="0" width="150" height="60" rx="4" fill="#FFFFFF" stroke="#CBD5E1" stroke-width="1.5"/>
    <text x="75" y="26" font-size="11" font-weight="bold" fill="#0F172A" text-anchor="middle">Dashboard</text>
    <text x="75" y="44" font-size="9" fill="#64748B" text-anchor="middle">ECharts &amp; KPI Cards</text>

    <!-- Farms -->
    <rect x="165" y="0" width="150" height="60" rx="4" fill="#FFFFFF" stroke="#CBD5E1" stroke-width="1.5"/>
    <text x="240" y="26" font-size="11" font-weight="bold" fill="#0F172A" text-anchor="middle">FarmsView</text>
    <text x="240" y="44" font-size="9" fill="#64748B" text-anchor="middle">FarmCards + Modal</text>

    <!-- Fields -->
    <rect x="330" y="0" width="150" height="60" rx="4" fill="#FFFFFF" stroke="#CBD5E1" stroke-width="1.5"/>
    <text x="405" y="26" font-size="11" font-weight="bold" fill="#0F172A" text-anchor="middle">FieldsView</text>
    <text x="405" y="44" font-size="9" fill="#64748B" text-anchor="middle">Leaflet Map + Quota</text>

    <!-- Crops -->
    <rect x="495" y="0" width="150" height="60" rx="4" fill="#FFFFFF" stroke="#CBD5E1" stroke-width="1.5"/>
    <text x="570" y="26" font-size="11" font-weight="bold" fill="#0F172A" text-anchor="middle">CropLifecycle</text>
    <text x="570" y="44" font-size="9" fill="#64748B" text-anchor="middle">Phenology Stepper</text>

    <!-- Inventory -->
    <rect x="660" y="0" width="150" height="60" rx="4" fill="#FFFFFF" stroke="#CBD5E1" stroke-width="1.5"/>
    <text x="735" y="26" font-size="11" font-weight="bold" fill="#0F172A" text-anchor="middle">InventoryView</text>
    <text x="735" y="44" font-size="9" fill="#64748B" text-anchor="middle">Stock Table + Ledger</text>

    <!-- Labour -->
    <rect x="825" y="0" width="150" height="60" rx="4" fill="#FFFFFF" stroke="#CBD5E1" stroke-width="1.5"/>
    <text x="900" y="26" font-size="11" font-weight="bold" fill="#0F172A" text-anchor="middle">LabourView</text>
    <text x="900" y="44" font-size="9" fill="#64748B" text-anchor="middle">Attendance + Wages</text>
  </g>

  <g transform="translate(40, 480)">
    <!-- Equipment -->
    <rect x="0" y="0" width="150" height="60" rx="4" fill="#FFFFFF" stroke="#CBD5E1" stroke-width="1.5"/>
    <text x="75" y="26" font-size="11" font-weight="bold" fill="#0F172A" text-anchor="middle">EquipmentView</text>
    <text x="75" y="44" font-size="9" fill="#64748B" text-anchor="middle">Service Log &amp; Status</text>

    <!-- Activities -->
    <rect x="165" y="0" width="150" height="60" rx="4" fill="#FFFFFF" stroke="#CBD5E1" stroke-width="1.5"/>
    <text x="240" y="26" font-size="11" font-weight="bold" fill="#0F172A" text-anchor="middle">ActivitiesView</text>
    <text x="240" y="44" font-size="9" fill="#64748B" text-anchor="middle">Gantt &amp; Task Roster</text>

    <!-- Financials -->
    <rect x="330" y="0" width="150" height="60" rx="4" fill="#FFFFFF" stroke="#CBD5E1" stroke-width="1.5"/>
    <text x="405" y="26" font-size="11" font-weight="bold" fill="#0F172A" text-anchor="middle">FinancialsView</text>
    <text x="405" y="44" font-size="9" fill="#64748B" text-anchor="middle">P&amp;L Charts &amp; Cashflow</text>

    <!-- Crop Doctor -->
    <rect x="495" y="0" width="150" height="60" rx="4" fill="#FFFFFF" stroke="#CBD5E1" stroke-width="1.5"/>
    <text x="570" y="26" font-size="11" font-weight="bold" fill="#0F172A" text-anchor="middle">CropDoctorView</text>
    <text x="570" y="44" font-size="9" fill="#64748B" text-anchor="middle">AI Diagnosis + Rx</text>

    <!-- Weather -->
    <rect x="660" y="0" width="150" height="60" rx="4" fill="#FFFFFF" stroke="#CBD5E1" stroke-width="1.5"/>
    <text x="735" y="26" font-size="11" font-weight="bold" fill="#0F172A" text-anchor="middle">WeatherView</text>
    <text x="735" y="44" font-size="9" fill="#64748B" text-anchor="middle">7-Day Agro Forecast</text>

    <!-- Market -->
    <rect x="825" y="0" width="150" height="60" rx="4" fill="#FFFFFF" stroke="#CBD5E1" stroke-width="1.5"/>
    <text x="900" y="26" font-size="11" font-weight="bold" fill="#0F172A" text-anchor="middle">MarketView</text>
    <text x="900" y="44" font-size="9" fill="#64748B" text-anchor="middle">Mandi Ticker &amp; Trends</text>
  </g>

  <!-- Service Tier (Injected via providedIn: 'root') -->
  <rect x="50" y="600" width="1010" height="110" rx="8" fill="#F1F5F9" stroke="#94A3B8" stroke-width="1.5"/>
  <text x="70" y="625" font-size="12" font-weight="bold" fill="#334155">INJECTABLE SERVICES &amp; HTTP INTERCEPTORS (RxJS Reactive State Store)</text>
  
  <g transform="translate(70, 640)">
    <rect x="0" y="0" width="130" height="50" rx="4" fill="#FFFFFF" stroke="#CBD5E1"/>
    <text x="65" y="24" font-size="10" font-weight="bold" fill="#174C38" text-anchor="middle">AuthService</text>
    <text x="65" y="38" font-size="8" fill="#64748B" text-anchor="middle">JWT &amp; Session</text>

    <rect x="145" y="0" width="130" height="50" rx="4" fill="#FFFFFF" stroke="#CBD5E1"/>
    <text x="210" y="24" font-size="10" font-weight="bold" fill="#174C38" text-anchor="middle">FarmService</text>
    <text x="210" y="38" font-size="8" fill="#64748B" text-anchor="middle">Parcels &amp; Crops</text>

    <rect x="290" y="0" width="130" height="50" rx="4" fill="#FFFFFF" stroke="#CBD5E1"/>
    <text x="355" y="24" font-size="10" font-weight="bold" fill="#174C38" text-anchor="middle">InventoryService</text>
    <text x="355" y="38" font-size="8" fill="#64748B" text-anchor="middle">Stock &amp; Audit</text>

    <rect x="435" y="0" width="130" height="50" rx="4" fill="#FFFFFF" stroke="#CBD5E1"/>
    <text x="500" y="24" font-size="10" font-weight="bold" fill="#174C38" text-anchor="middle">LabourService</text>
    <text x="500" y="38" font-size="8" fill="#64748B" text-anchor="middle">Attendance &amp; Wage</text>

    <rect x="580" y="0" width="130" height="50" rx="4" fill="#FFFFFF" stroke="#CBD5E1"/>
    <text x="645" y="24" font-size="10" font-weight="bold" fill="#174C38" text-anchor="middle">FinancialService</text>
    <text x="645" y="38" font-size="8" fill="#64748B" text-anchor="middle">Journal &amp; P&amp;L</text>

    <rect x="725" y="0" width="130" height="50" rx="4" fill="#FFFFFF" stroke="#CBD5E1"/>
    <text x="790" y="24" font-size="10" font-weight="bold" fill="#174C38" text-anchor="middle">AuthInterceptor</text>
    <text x="790" y="38" font-size="8" fill="#64748B" text-anchor="middle">Bearer Header Injector</text>

    <rect x="870" y="0" width="100" height="50" rx="4" fill="#FFFFFF" stroke="#CBD5E1"/>
    <text x="920" y="24" font-size="10" font-weight="bold" fill="#174C38" text-anchor="middle">ToastService</text>
    <text x="920" y="38" font-size="8" fill="#64748B" text-anchor="middle">Alerts</text>
  </g>

  <!-- Connectors -->
  <line x1="575" y1="155" x2="575" y2="200" stroke="#0F172A" stroke-width="1.8"/>
  <line x1="575" y1="250" x2="575" y2="270" stroke="#0F172A" stroke-width="1.8"/>
  <line x1="265" y1="270" x2="885" y2="270" stroke="#0F172A" stroke-width="1.8"/>
  <line x1="265" y1="270" x2="265" y2="290" stroke="#0F172A" stroke-width="1.8"/>
  <line x1="465" y1="270" x2="465" y2="290" stroke="#0F172A" stroke-width="1.8"/>
  <line x1="675" y1="270" x2="675" y2="290" stroke="#0F172A" stroke-width="1.8"/>
  <line x1="885" y1="270" x2="885" y2="290" stroke="#0F172A" stroke-width="1.8"/>
</svg>'''

with open(f"{DIAGRAMS_DIR}/09_angular_component_hierarchy.svg", "w") as f:
    f.write(svg_09)

# 10_deployment_diagram.svg
svg_10 = '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1100 750" width="1100" height="750" style="background:#FFFFFF; font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <rect x="20" y="20" width="1060" height="710" rx="12" fill="#FAFBF8" stroke="#CBD5E1" stroke-width="1.5"/>
  <text x="40" y="55" font-size="20" font-weight="bold" fill="#174C38">AgriNexus AI — UML Deployment Diagram</text>
  <text x="40" y="78" font-size="12" fill="#64748B">Hardware Execution Nodes, Network Communication Protocols and Runtime Environments</text>

  <!-- NODE 1: Client Workstation / Mobile Device -->
  <g transform="translate(50, 120)">
    <polygon points="0,20 20,0 260,0 260,340 240,360 0,360" fill="#F8FAFC" stroke="#0F172A" stroke-width="1.5"/>
    <line x1="240" y1="20" x2="260" y2="0" stroke="#0F172A" stroke-width="1.5"/>
    <line x1="0" y1="20" x2="240" y2="20" stroke="#0F172A" stroke-width="1.5"/>
    <line x1="240" y1="20" x2="240" y2="360" stroke="#0F172A" stroke-width="1.5"/>
    <text x="120" y="15" font-size="11" font-weight="bold" fill="#0F172A" text-anchor="middle">&lt;&lt;device&gt;&gt; Client Machine</text>
    
    <!-- Artifact -->
    <rect x="20" y="45" width="200" height="290" rx="4" fill="#FFFFFF" stroke="#16845B" stroke-width="1.5"/>
    <text x="120" y="70" font-size="12" font-weight="bold" fill="#174C38" text-anchor="middle">Modern Web Browser</text>
    <text x="120" y="85" font-size="10" fill="#64748B" text-anchor="middle">(Brave / Chrome / Safari)</text>
    
    <rect x="35" y="105" width="170" height="40" rx="4" fill="#E8F2EA"/>
    <text x="120" y="128" font-size="10" font-weight="bold" fill="#174C38" text-anchor="middle">Angular 22 SPA Runtime</text>
    
    <rect x="35" y="155" width="170" height="40" rx="4" fill="#E8F2EA"/>
    <text x="120" y="178" font-size="10" font-weight="bold" fill="#174C38" text-anchor="middle">Zone.js Change Detector</text>
    
    <rect x="35" y="205" width="170" height="40" rx="4" fill="#E8F2EA"/>
    <text x="120" y="228" font-size="10" font-weight="bold" fill="#174C38" text-anchor="middle">Apache ECharts Canvas</text>

    <rect x="35" y="255" width="170" height="40" rx="4" fill="#E8F2EA"/>
    <text x="120" y="278" font-size="10" font-weight="bold" fill="#174C38" text-anchor="middle">JWT Local Storage</text>
  </g>

  <!-- NODE 2: Application Web Server Node -->
  <g transform="translate(420, 120)">
    <polygon points="0,20 20,0 280,0 280,480 260,500 0,500" fill="#F8FAFC" stroke="#0F172A" stroke-width="1.5"/>
    <line x1="260" y1="20" x2="280" y2="0" stroke="#0F172A" stroke-width="1.5"/>
    <line x1="0" y1="20" x2="260" y2="20" stroke="#0F172A" stroke-width="1.5"/>
    <line x1="260" y1="20" x2="260" y2="500" stroke="#0F172A" stroke-width="1.5"/>
    <text x="130" y="15" font-size="11" font-weight="bold" fill="#0F172A" text-anchor="middle">&lt;&lt;execution environment&gt;&gt; App Server</text>

    <!-- Artifact: FastAPI ASGI -->
    <rect x="20" y="45" width="220" height="430" rx="4" fill="#FFFFFF" stroke="#0284C7" stroke-width="1.5"/>
    <text x="130" y="70" font-size="12" font-weight="bold" fill="#0369A1" text-anchor="middle">FastAPI Backend Daemon</text>
    <text x="130" y="85" font-size="10" fill="#64748B" text-anchor="middle">Uvicorn ASGI Engine (Port 8000)</text>

    <rect x="35" y="105" width="190" height="45" rx="4" fill="#F0F9FF"/>
    <text x="130" y="128" font-size="10" font-weight="bold" fill="#0369A1" text-anchor="middle">CORSMiddleware</text>
    <text x="130" y="142" font-size="8" fill="#64748B" text-anchor="middle">Origins: localhost:4200</text>

    <rect x="35" y="160" width="190" height="45" rx="4" fill="#F0F9FF"/>
    <text x="130" y="183" font-size="10" font-weight="bold" fill="#0369A1" text-anchor="middle">JWT OAuth2 Bearer Handler</text>
    <text x="130" y="197" font-size="8" fill="#64748B" text-anchor="middle">HMAC-SHA256 Token Validator</text>

    <rect x="35" y="215" width="190" height="45" rx="4" fill="#F0F9FF"/>
    <text x="130" y="238" font-size="10" font-weight="bold" fill="#0369A1" text-anchor="middle">Pydantic v2 Schema Engine</text>
    <text x="130" y="252" font-size="8" fill="#64748B" text-anchor="middle">Request/Response Deserialization</text>

    <rect x="35" y="270" width="190" height="45" rx="4" fill="#F0F9FF"/>
    <text x="130" y="293" font-size="10" font-weight="bold" fill="#0369A1" text-anchor="middle">SQLAlchemy 2.0 ORM</text>
    <text x="130" y="307" font-size="8" fill="#64748B" text-anchor="middle">Unit of Work &amp; Query Builder</text>

    <rect x="35" y="325" width="190" height="45" rx="4" fill="#F0F9FF"/>
    <text x="130" y="348" font-size="10" font-weight="bold" fill="#0369A1" text-anchor="middle">Alembic Migration Runner</text>
    <text x="130" y="362" font-size="8" fill="#64748B" text-anchor="middle">Schema Versioning Controller</text>

    <rect x="35" y="380" width="190" height="45" rx="4" fill="#F0F9FF"/>
    <text x="130" y="403" font-size="10" font-weight="bold" fill="#0369A1" text-anchor="middle">Domain Controllers (18 Modules)</text>
    <text x="130" y="417" font-size="8" fill="#64748B" text-anchor="middle">Farms, Crops, Stock, Wages, etc.</text>
  </g>

  <!-- NODE 3: Database Server Node -->
  <g transform="translate(800, 120)">
    <polygon points="0,20 20,0 240,0 240,360 220,380 0,380" fill="#F8FAFC" stroke="#0F172A" stroke-width="1.5"/>
    <line x1="220" y1="20" x2="240" y2="0" stroke="#0F172A" stroke-width="1.5"/>
    <line x1="0" y1="20" x2="220" y2="20" stroke="#0F172A" stroke-width="1.5"/>
    <line x1="220" y1="20" x2="220" y2="380" stroke="#0F172A" stroke-width="1.5"/>
    <text x="110" y="15" font-size="11" font-weight="bold" fill="#0F172A" text-anchor="middle">&lt;&lt;database server&gt;&gt; DB Node</text>

    <!-- Artifact: PostgreSQL -->
    <rect x="20" y="45" width="180" height="310" rx="4" fill="#FFFFFF" stroke="#334155" stroke-width="1.5"/>
    <text x="110" y="70" font-size="12" font-weight="bold" fill="#1E293B" text-anchor="middle">PostgreSQL 18 RDBMS</text>
    <text x="110" y="85" font-size="10" fill="#64748B" text-anchor="middle">Cluster Port 5433 (Homebrew)</text>

    <rect x="35" y="105" width="150" height="40" rx="4" fill="#F1F5F9"/>
    <text x="110" y="128" font-size="10" font-weight="bold" fill="#334155" text-anchor="middle">agrinexus_db</text>
    
    <rect x="35" y="155" width="150" height="40" rx="4" fill="#F1F5F9"/>
    <text x="110" y="178" font-size="10" font-weight="bold" fill="#334155" text-anchor="middle">21 Relational Tables</text>

    <rect x="35" y="205" width="150" height="40" rx="4" fill="#F1F5F9"/>
    <text x="110" y="228" font-size="10" font-weight="bold" fill="#334155" text-anchor="middle">ACID &amp; WAL Journaling</text>

    <rect x="35" y="255" width="150" height="40" rx="4" fill="#F1F5F9"/>
    <text x="110" y="278" font-size="10" font-weight="bold" fill="#334155" text-anchor="middle">PostgreSQL Enum Types</text>
  </g>

  <!-- Network Connectors -->
  <!-- Client to Backend -->
  <line x1="290" y1="280" x2="420" y2="280" stroke="#16845B" stroke-width="2.5"/>
  <text x="355" y="265" font-size="10" font-weight="bold" fill="#174C38" text-anchor="middle">HTTPS / REST</text>
  <text x="355" y="277" font-size="8" fill="#64748B" text-anchor="middle">JSON over HTTP/2</text>
  <text x="355" y="297" font-size="8" fill="#64748B" text-anchor="middle">Bearer JWT Auth</text>

  <!-- Backend to DB -->
  <line x1="680" y1="280" x2="800" y2="280" stroke="#0284C7" stroke-width="2.5"/>
  <text x="740" y="265" font-size="10" font-weight="bold" fill="#0369A1" text-anchor="middle">TCP Socket / 5433</text>
  <text x="740" y="277" font-size="8" fill="#64748B" text-anchor="middle">asyncpg / psycopg2</text>
  <text x="740" y="297" font-size="8" fill="#64748B" text-anchor="middle">Connection Pool</text>
</svg>'''

with open(f"{DIAGRAMS_DIR}/10_deployment_diagram.svg", "w") as f:
    f.write(svg_10)

print("SVGs 05 to 10 successfully written.")
