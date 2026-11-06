#!/usr/bin/env python3
"""
AgriNexus AI — Comprehensive Phase 3 Seed Script for Demonstration Data
Populates the Rahata, Ahilyanagar case study:
- 5.0 Acre Farm in Rahata
- Plot 1 (2.0 ac Onion), Plot 2 (2.0 ac Soybean), Plot 3 (1.0 ac Sugarcane)
- Crop Cycles, Scheduled Activities, Soil Records, Irrigation Records, and Financial Ledger
All records are explicitly tagged as Demonstration Data.
"""
import os
import sys
from datetime import date, datetime, timedelta
from decimal import Decimal

# Add backend directory to sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "backend")))

from app.core.database import SessionLocal
from app.core.security import get_password_hash
from app.models.user import User, UserRoleEnum
from app.models.role import Role
from app.models.farm import Farm
from app.models.field import Field
from app.models.crop import Crop, CropTypeEnum, CropStageEnum
from app.models.crop_cycle import CropCycle
from app.models.farm_activity import FarmActivity
from app.models.soil_record import SoilRecord
from app.models.irrigation_record import IrrigationRecord
from app.models.inventory import InventoryItem, InventoryTransaction
from app.models.labour import Labour, LabourAttendance
from app.models.equipment import Equipment, EquipmentMaintenance
from app.models.finance import FinancialTransaction
from app.models.notification import Notification


def seed_demo_data():
    print("🌱 Starting AgriNexus AI Phase 3 demonstration data seeding...")
    db = SessionLocal()
    try:
        # 1. System Roles
        roles_data = [
            ("FARMER", "Primary agricultural producer and farm owner"),
            ("AGRONOMIST", "Agricultural extension scientist and crop doctor"),
            ("CHC_OPERATOR", "Custom Hiring Center machinery operator"),
            ("ADMIN", "System administrator"),
        ]
        for role_name, desc in roles_data:
            existing_role = db.query(Role).filter(Role.name == role_name).first()
            if not existing_role:
                db.add(Role(name=role_name, description=desc))
        db.commit()

        # 2. Case Study Farmer
        farmer_email = "farmer.rahata@agrinexus.ai"
        farmer = db.query(User).filter(User.email == farmer_email).first()
        if not farmer:
            farmer = User(
                email=farmer_email,
                hashed_password=get_password_hash("Farmer@Rahata2026"),
                full_name="Dnyaneshwar Kisan Shinde",
                phone_number="+91-98220-12345",
                preferred_language="en",
                primary_role=UserRoleEnum.FARMER,
                is_active=True,
            )
            db.add(farmer)
            db.commit()
            db.refresh(farmer)
            print(f"✓ Case study farmer created: {farmer.email}")
        else:
            print(f"✓ Case study farmer confirmed: {farmer.email}")

        # 3. 5-Acre Holding in Rahata
        farm = db.query(Farm).filter(Farm.user_id == farmer.id).first()
        if not farm:
            farm = Farm(
                user_id=farmer.id,
                name="Shinde Krushi Farm - Rahata [DEMO]",
                village="Chitali / Rahata",
                taluka="Rahata",
                district="Ahilyanagar",
                state="Maharashtra",
                total_area_acres=Decimal("5.00"),
                area_unit="acres",
                description="[DEMO] 5-acre progressive irrigated farm holding in Rahata cultivating Rabi Onion, Soybean, and Adsali Sugarcane.",
                latitude=Decimal("19.712600"),
                longitude=Decimal("74.484200"),
                soil_type="MEDIUM_BLACK",
                irrigation_source="DRIP",
                boundary_geojson={
                    "type": "Polygon",
                    "coordinates": [[
                        [74.4820, 19.7110],
                        [74.4865, 19.7112],
                        [74.4862, 19.7145],
                        [74.4818, 19.7142],
                        [74.4820, 19.7110]
                    ]]
                }
            )
            db.add(farm)
            db.commit()
            db.refresh(farm)
            print(f"✓ Farm created: {farm.name}")
        else:
            farm.total_area_acres = Decimal("5.00")
            farm.name = "Shinde Krushi Farm - Rahata [DEMO]"
            farm.description = "[DEMO] 5-acre progressive irrigated farm holding in Rahata cultivating Rabi Onion, Soybean, and Adsali Sugarcane."
            db.commit()
            print(f"✓ Farm updated: {farm.name}")

        # 4. Fields (2.0 acres Onion, 2.0 acres Soybean, 1.0 acre Sugarcane)
        field_configs = [
            {
                "name": "Plot 1 - East (Onion) [DEMO]",
                "area_acres": Decimal("2.00"),
                "soil_type": "MEDIUM_BLACK",
                "soil_ph": Decimal("7.4"),
                "location": "Eastern sector adjoining main farm canal inlet",
                "irrigation_type": "DRIP",
                "description": "[DEMO] Raised-bed drip fertigation plot dedicated to Rabi Onion.",
                "crop_name": "Rabi Onion",
                "crop_type": CropTypeEnum.ONION,
                "variety": "Bhima Super",
                "sowing_date": date(2024, 12, 15),
                "expected_harvest": date(2025, 4, 15),
                "stage": CropStageEnum.VEGETATIVE,
                "expected_yield": Decimal("180.00"),
                "moisture_min": Decimal("50.0"),
                "moisture_max": Decimal("75.0"),
            },
            {
                "name": "Plot 2 - Center (Soybean) [DEMO]",
                "area_acres": Decimal("2.00"),
                "soil_type": "MEDIUM_BLACK",
                "soil_ph": Decimal("7.1"),
                "location": "Central block with sprinkler connectivity",
                "irrigation_type": "SPRINKLER",
                "description": "[DEMO] High-drainage plot rotated with leguminous soybean.",
                "crop_name": "Soybean",
                "crop_type": CropTypeEnum.SOYBEAN,
                "variety": "JS 335",
                "sowing_date": date(2024, 10, 1),
                "expected_harvest": date(2025, 2, 10),
                "stage": CropStageEnum.MATURITY,
                "expected_yield": Decimal("22.00"),
                "moisture_min": Decimal("45.0"),
                "moisture_max": Decimal("65.0"),
            },
            {
                "name": "Plot 3 - West (Sugarcane) [DEMO]",
                "area_acres": Decimal("1.00"),
                "soil_type": "MEDIUM_BLACK",
                "soil_ph": Decimal("7.6"),
                "location": "Western perimeter along Pravara canal feeder",
                "irrigation_type": "DRIP",
                "description": "[DEMO] Long-duration perennial Adsali sugarcane plot.",
                "crop_name": "Sugarcane Adsali",
                "crop_type": CropTypeEnum.SUGARCANE,
                "variety": "Co 86032",
                "sowing_date": date(2024, 7, 20),
                "expected_harvest": date(2025, 10, 20),
                "stage": CropStageEnum.VEGETATIVE,
                "expected_yield": Decimal("850.00"),
                "moisture_min": Decimal("60.0"),
                "moisture_max": Decimal("85.0"),
            },
        ]

        seeded_crops = []
        seeded_fields = []
        for fc in field_configs:
            fld = db.query(Field).filter(Field.farm_id == farm.id, Field.name == fc["name"]).first()
            if not fld:
                fld = Field(
                    farm_id=farm.id,
                    name=fc["name"],
                    area_acres=fc["area_acres"],
                    soil_type=fc["soil_type"],
                    soil_ph=fc["soil_ph"],
                    location=fc["location"],
                    irrigation_type=fc["irrigation_type"],
                    description=fc["description"],
                )
                db.add(fld)
                db.commit()
                db.refresh(fld)
            else:
                fld.area_acres = fc["area_acres"]
                fld.description = fc["description"]
                db.commit()
            seeded_fields.append(fld)

            crp = db.query(Crop).filter(Crop.field_id == fld.id, Crop.crop_name == fc["crop_name"]).first()
            if not crp:
                crp = Crop(
                    field_id=fld.id,
                    crop_name=fc["crop_name"],
                    crop_type=fc["crop_type"],
                    variety=fc["variety"],
                    sowing_date=fc["sowing_date"],
                    expected_harvest_date=fc["expected_harvest"],
                    current_stage=fc["stage"],
                    cultivated_area=fc["area_acres"],
                    expected_yield=fc["expected_yield"],
                    current_status="ACTIVE",
                    target_moisture_min=fc["moisture_min"],
                    target_moisture_max=fc["moisture_max"],
                )
                db.add(crp)
                db.commit()
                db.refresh(crp)
            else:
                crp.cultivated_area = fc["area_acres"]
                crp.expected_yield = fc["expected_yield"]
                db.commit()
            seeded_crops.append(crp)

        print(f"✓ Seeded/Updated {len(seeded_fields)} fields and {len(seeded_crops)} crops.")

        # 5. Crop Cycles
        for crp, fld, season in [
            (seeded_crops[0], seeded_fields[0], "RABI"),
            (seeded_crops[1], seeded_fields[1], "KHARIF"),
            (seeded_crops[2], seeded_fields[2], "ANNUAL"),
        ]:
            existing_cycle = db.query(CropCycle).filter(CropCycle.crop_id == crp.id).first()
            if not existing_cycle:
                cycle = CropCycle(
                    crop_id=crp.id,
                    field_id=fld.id,
                    cycle_name=f"[DEMO] {crp.crop_name} {season} 2024-25",
                    season=season,
                    start_date=crp.sowing_date,
                    end_date=crp.expected_harvest_date,
                    target_yield_quintals=crp.expected_yield,
                    status="ACTIVE",
                    notes="[DEMO] Monitored under AgriNexus AI precision protocol.",
                )
                db.add(cycle)
        db.commit()
        print("✓ Seeded crop cycles.")

        # 6. Farm Activities (Recent completed and upcoming)
        today = date.today()
        activities_data = [
            (farm.id, seeded_fields[0].id, seeded_crops[0].id, "[DEMO] Basal Fertilizer Application (DAP + Potash)", "FERTILIZATION", "COMPLETED", "HIGH", today - timedelta(days=20), today - timedelta(days=20), Decimal("6800.00"), "Dnyaneshwar Shinde"),
            (farm.id, seeded_fields[0].id, seeded_crops[0].id, "[DEMO] Pre-emergence Herbicide Spray (Oxyfluorfen)", "SPRAYING", "COMPLETED", "MEDIUM", today - timedelta(days=12), today - timedelta(days=12), Decimal("2400.00"), "Ramesh Pawar"),
            (farm.id, seeded_fields[0].id, seeded_crops[0].id, "[DEMO] Drip Fertigation: 19:19:19 + Sulphur", "IRRIGATION", "COMPLETED", "HIGH", today - timedelta(days=3), today - timedelta(days=3), Decimal("3200.00"), "Dnyaneshwar Shinde"),
            (farm.id, seeded_fields[0].id, seeded_crops[0].id, "[DEMO] Onion Bulb Development & Thrips Scouting", "PEST_SCOUTING", "SCHEDULED", "HIGH", today + timedelta(days=1), None, Decimal("0.00"), "Dnyaneshwar Shinde"),
            (farm.id, seeded_fields[1].id, seeded_crops[1].id, "[DEMO] Soybean Pod Maturity & Pod Borer Inspection", "PEST_SCOUTING", "SCHEDULED", "MEDIUM", today + timedelta(days=3), None, Decimal("0.00"), "Agronomist Team"),
            (farm.id, seeded_fields[2].id, seeded_crops[2].id, "[DEMO] Sugarcane Earthing-up and Nitrogen Top-dressing", "FERTILIZATION", "SCHEDULED", "MEDIUM", today + timedelta(days=6), None, Decimal("5500.00"), "Contract Labour"),
        ]

        for fid, fld_id, crp_id, title, a_type, st, prio, sched_d, comp_d, cst, assigned in activities_data:
            existing_act = db.query(FarmActivity).filter(FarmActivity.farm_id == fid, FarmActivity.title == title).first()
            if not existing_act:
                act = FarmActivity(
                    farm_id=fid,
                    field_id=fld_id,
                    crop_id=crp_id,
                    title=title,
                    activity_type=a_type,
                    status=st,
                    priority=prio,
                    scheduled_date=sched_d,
                    completed_date=comp_d,
                    cost=cst,
                    assigned_to=assigned,
                    notes="[DEMO] Recommended precision agricultural intervention.",
                )
                db.add(act)
        db.commit()
        print("✓ Seeded farm activities.")

        # 7. Financial Transactions (Income & Expenses)
        finance_data = [
            ("INCOME", "HARVEST_SALE", Decimal("350000.00"), today - timedelta(days=25), farm.id, seeded_crops[0].id, "UPI", "INV-2025-0101", "[DEMO] Advance payment for export-grade Rabi Onion harvest (Lasalgaon APMC trader)"),
            ("INCOME", "HARVEST_SALE", Decimal("280000.00"), today - timedelta(days=45), farm.id, seeded_crops[2].id, "BANK_TRANSFER", "INV-2024-SUG-01", "[DEMO] Pravara Sahakari Sakhar Karkhana cane billing first installment"),
            ("INCOME", "HARVEST_SALE", Decimal("115000.00"), today - timedelta(days=60), farm.id, seeded_crops[1].id, "CASH", "INV-2024-SOY-04", "[DEMO] Certified seed soybean sale to Shrirampur Krushi Kendra"),
            ("EXPENSE", "SEEDS", Decimal("38500.00"), today - timedelta(days=50), farm.id, seeded_crops[0].id, "CASH", "RCPT-SEED-88", "[DEMO] Certified Bhima Super onion seeds & JS 335 seed packets"),
            ("EXPENSE", "FERTILIZERS", Decimal("42000.00"), today - timedelta(days=35), farm.id, seeded_crops[0].id, "UPI", "RCPT-FERT-102", "[DEMO] Bulk purchase of DAP, 19:19:19, MOP and Zinc Sulphate"),
            ("EXPENSE", "PESTICIDES", Decimal("24500.00"), today - timedelta(days=28), farm.id, seeded_crops[0].id, "UPI", "RCPT-PEST-45", "[DEMO] Preventive systemic fungicides and bio-pesticides for onion thrips"),
            ("EXPENSE", "LABOUR", Decimal("45000.00"), today - timedelta(days=22), farm.id, seeded_crops[0].id, "CASH", "VCHR-LAB-12", "[DEMO] Transplanting labour wages and plot weeding operations"),
            ("EXPENSE", "DIESEL", Decimal("28000.00"), today - timedelta(days=40), farm.id, None, "CASH", "RCPT-DSL-09", "[DEMO] Diesel for Mahindra tractor deep ploughing and rotavator"),
            ("EXPENSE", "IRRIGATION", Decimal("16500.00"), today - timedelta(days=15), farm.id, None, "UPI", "RCPT-DRIP-77", "[DEMO] Drip lateral replacement and Venturi fertigation maintenance"),
        ]

        for t_type, cat, amt, t_date, f_id, c_id, method, inv, desc in finance_data:
            existing_tx = db.query(FinancialTransaction).filter(
                FinancialTransaction.user_id == farmer.id,
                FinancialTransaction.invoice_number == inv
            ).first()
            if not existing_tx:
                tx = FinancialTransaction(
                    user_id=farmer.id,
                    farm_id=f_id,
                    crop_id=c_id,
                    transaction_type=t_type,
                    category=cat,
                    amount=amt,
                    transaction_date=t_date,
                    payment_method=method,
                    invoice_number=inv,
                    description=desc,
                )
                db.add(tx)
        db.commit()
        print("✓ Seeded financial ledger transactions (Total Income: ₹7,45,000 | Total Expenses: ₹1,94,500 | Net: ₹5,50,500).")

        # 8. Notifications
        notifications_data = [
            (farmer.id, "[DEMO] Purple Blotch Alert in Rahata", "Atmospheric humidity > 80% with overcast skies. High risk of Alternaria porri (Purple Blotch) in Rabi Onion. Conduct protective spray.", "ALERT", "/crop-doctor"),
            (farmer.id, "[DEMO] Lasalgaon Mandi Onion Price Surge", "Modal rates for red onion reached ₹2,850/quintal at Lasalgaon APMC (+14% over 7 days).", "ADVISORY", "/market-intelligence"),
            (farmer.id, "[DEMO] Drip Irrigation Completed", "2 hours drip fertigation cycle (12,000 L) successfully completed for Plot 1 - East.", "INFO", "/irrigation"),
        ]
        for u_id, title, msg, n_type, link in notifications_data:
            existing_notif = db.query(Notification).filter(Notification.user_id == u_id, Notification.title == title).first()
            if not existing_notif:
                notif = Notification(
                    user_id=u_id,
                    title=title,
                    message=msg,
                    notification_type=n_type,
                    link_url=link,
                )
                db.add(notif)
        db.commit()
        print("✓ Seeded user notifications.")

        # 9. Inventory Items & Initial Transactions
        inventory_data = [
            ("DAP (Di-Ammonium Phosphate 18:46:0)", "FERTILIZER", "BAG", Decimal("12.00"), Decimal("5.00"), Decimal("1350.00"), "IFFCO Rahata Kendra", "BAT-2025-DAP-01", today + timedelta(days=500)),
            ("Water Soluble NPK 19:19:19", "FERTILIZER", "KG", Decimal("75.00"), Decimal("20.00"), Decimal("140.00"), "Mahadhan Agri", "BAT-2025-NPK-88", today + timedelta(days=400)),
            ("Bhima Super Onion Certified Seeds", "SEEDS", "KG", Decimal("4.00"), Decimal("5.00"), Decimal("1850.00"), "Mahagrapes Seed Corp", "BAT-BHM-24", today + timedelta(days=180)),
            ("Mancozeb 75% WP (Contact Fungicide)", "PESTICIDE", "KG", Decimal("8.50"), Decimal("3.00"), Decimal("480.00"), "UPL India", "BAT-MNZ-99", today + timedelta(days=360)),
            ("Drip Emitters & 16mm Lateral Spares", "TOOL", "NOS", Decimal("150.00"), Decimal("50.00"), Decimal("12.50"), "Jain Irrigation Systems", "DRP-JN-01", None),
        ]
        seeded_inventory = []
        for name, cat, unit, stock, reorder, price, supp, batch, exp in inventory_data:
            existing_it = db.query(InventoryItem).filter(InventoryItem.farm_id == farm.id, InventoryItem.name == name).first()
            if not existing_it:
                it = InventoryItem(
                    farm_id=farm.id,
                    name=name,
                    category=cat,
                    unit=unit,
                    current_stock=stock,
                    reorder_level=reorder,
                    unit_price=price,
                    supplier=supp,
                    batch_number=batch,
                    expiry_date=exp,
                )
                db.add(it)
                db.flush()
                # Record initial transaction
                tx = InventoryTransaction(
                    item_id=it.id,
                    transaction_type="INWARD",
                    quantity=stock,
                    unit_price=price,
                    total_cost=stock * price,
                    transaction_date=today - timedelta(days=30),
                    notes="Season opening stock procurement",
                )
                db.add(tx)
                seeded_inventory.append(it)
            else:
                seeded_inventory.append(existing_it)
        db.commit()
        print(f"✓ Seeded {len(seeded_inventory)} inventory items and inward stock transactions.")

        # 10. Labour Pool & Attendance
        labour_data = [
            ("Ramesh Maruti Pawar", "+91 98221 44551", "OPERATOR", Decimal("450.00"), True),
            ("Sunita Ramesh Pawar", "+91 98221 44552", "HARVESTER", Decimal("350.00"), True),
            ("Anil Balasaheb Jadhav", "+91 98221 44553", "GENERAL", Decimal("400.00"), True),
            ("Dattatray V. Kadam", "+91 98221 44554", "SUPERVISOR", Decimal("600.00"), True),
        ]
        seeded_labour = []
        for full_name, phone, skill, wage, active in labour_data:
            existing_l = db.query(Labour).filter(Labour.farm_id == farm.id, Labour.full_name == full_name).first()
            if not existing_l:
                l = Labour(
                    farm_id=farm.id,
                    full_name=full_name,
                    phone_number=phone,
                    skill_type=skill,
                    daily_wage=wage,
                    is_active=active,
                )
                db.add(l)
                db.flush()
                # Add attendance for today and yesterday
                for d_offset in [0, 1, 2]:
                    att = LabourAttendance(
                        labour_id=l.id,
                        farm_id=farm.id,
                        attendance_date=today - timedelta(days=d_offset),
                        status="PRESENT",
                        hours_worked=Decimal("8.0"),
                        wage_paid=wage,
                        notes="Normal field operations and drip monitoring",
                    )
                    db.add(att)
                seeded_labour.append(l)
            else:
                seeded_labour.append(existing_l)
        db.commit()
        print(f"✓ Seeded {len(seeded_labour)} farm workers and attendance records.")

        # 11. Equipment Fleet & Maintenance
        equipment_data = [
            ("Mahindra 475 DI (42 HP)", "TRACTOR", "M-475-DI-2021", "MH-17-EQ-8842", today - timedelta(days=730), Decimal("620000.00"), "OPERATIONAL"),
            ("Kirloskar 7.5 HP Submersible Pump", "PUMP", "KSB-75-SP", "SN-KIRL-99812", today - timedelta(days=400), Decimal("48000.00"), "OPERATIONAL"),
            ("ASPEE Knapsack Power Sprayer", "SPRAYER", "HTP-PSP-25", "SN-ASP-4411", today - timedelta(days=200), Decimal("14500.00"), "OPERATIONAL"),
            ("Jain Drip Automated Controller Valve", "DRIP_CONTROLLER", "JN-AUTO-4Z", "SN-JN-2200", today - timedelta(days=150), Decimal("32000.00"), "OPERATIONAL"),
        ]
        seeded_eq = []
        for name, eq_type, model, serial, p_date, price, eq_status in equipment_data:
            existing_eq = db.query(Equipment).filter(Equipment.farm_id == farm.id, Equipment.name == name).first()
            if not existing_eq:
                eq = Equipment(
                    farm_id=farm.id,
                    name=name,
                    equipment_type=eq_type,
                    model_number=model,
                    serial_number=serial,
                    purchase_date=p_date,
                    purchase_price=price,
                    status=eq_status,
                )
                db.add(eq)
                db.flush()
                # Add routine service record
                maint = EquipmentMaintenance(
                    equipment_id=eq.id,
                    maintenance_date=today - timedelta(days=25),
                    service_type="ROUTINE",
                    cost=Decimal("2800.00") if eq_type == "TRACTOR" else Decimal("650.00"),
                    description="Engine oil replacement, grease pack, and fuel filter cleaning.",
                    technician_name="Mahesh Tractor Garage, Rahata",
                    next_service_due=today + timedelta(days=65),
                )
                db.add(maint)
                seeded_eq.append(eq)
            else:
                seeded_eq.append(existing_eq)
        db.commit()
        print(f"✓ Seeded {len(seeded_eq)} farm machinery assets and maintenance logs.")

        print("\n✨ Phase 3 demonstration data seeding finished successfully!")

    finally:
        db.close()


if __name__ == "__main__":
    seed_demo_data()
