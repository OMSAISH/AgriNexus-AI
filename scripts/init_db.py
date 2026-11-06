#!/usr/bin/env python3
"""
AgriNexus AI — Database Initialization & Case Study Seeding Script
Populates the Rahata, Ahilyanagar 5-acre case study for demonstration.
"""
import os
import sys
from datetime import date, datetime

# Add backend to sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "backend")))

from app.core.database import SessionLocal, engine, Base
from app.core.security import get_password_hash
from app.models.user import User, UserRoleEnum
from app.models.role import Role
from app.models.farm import Farm
from app.models.field import Field
from app.models.crop import Crop, CropTypeEnum, CropStageEnum


def init_and_seed_db():
    print("Connecting to PostgreSQL to seed AgriNexus AI initial data...")
    db = SessionLocal()
    try:
        # 1. Seed Roles
        roles_data = [
            ("FARMER", "Primary agricultural producer and farm owner"),
            ("AGRONOMIST", "Agricultural extension scientist and crop doctor"),
            ("CHC_OPERATOR", "Custom Hiring Center machinery operator"),
            ("ADMIN", "System administrator"),
        ]
        for role_name, desc in roles_data:
            existing_role = db.query(Role).filter(Role.name == role_name).first()
            if not existing_role:
                role_obj = Role(name=role_name, description=desc)
                db.add(role_obj)
        db.commit()
        print("✓ System roles confirmed.")

        # 2. Seed Rahata Case Study Farmer
        farmer_email = "farmer.rahata@agrinexus.ai"
        farmer = db.query(User).filter(User.email == farmer_email).first()
        if not farmer:
            farmer = User(
                email=farmer_email,
                hashed_password=get_password_hash("Farmer@Rahata2026"),
                full_name="Dnyaneshwar Kisan Shinde",
                phone_number="+91-98220-12345",
                primary_role=UserRoleEnum.FARMER,
                is_active=True,
            )
            db.add(farmer)
            db.commit()
            db.refresh(farmer)
            print(f"✓ Created case study user: {farmer.email} ({farmer.full_name})")
        else:
            print(f"✓ Case study user exists: {farmer.email}")

        # 3. Seed Rahata Farm (5.0 Acres)
        farm = db.query(Farm).filter(Farm.user_id == farmer.id).first()
        if not farm:
            farm = Farm(
                user_id=farmer.id,
                name="Shinde Krushi Farm - Rahata",
                village="Chitali / Rahata",
                taluka="Rahata",
                district="Ahilyanagar",
                state="Maharashtra",
                total_area_acres=5.00,
                latitude=19.712600,
                longitude=74.484200,
                soil_type="MEDIUM_BLACK",
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
            print(f"✓ Created farm: {farm.name} (5.0 Acres in Rahata)")
        else:
            print(f"✓ Farm exists: {farm.name}")

        # 4. Seed 3 Fields & Crops
        field_configs = [
            {
                "name": "Plot 1 - East (Onion)",
                "area_acres": 2.00,
                "soil_ph": 7.4,
                "irrigation_type": "DRIP",
                "crop_name": "Rabi Onion",
                "crop_type": CropTypeEnum.ONION,
                "variety": "Bhima Super",
                "sowing_date": date(2024, 12, 15),
                "stage": CropStageEnum.VEGETATIVE,
                "moisture_min": 50.0,
                "moisture_max": 75.0,
            },
            {
                "name": "Plot 2 - Center (Soybean)",
                "area_acres": 1.50,
                "soil_ph": 7.1,
                "irrigation_type": "SPRINKLER",
                "crop_name": "Soybean",
                "crop_type": CropTypeEnum.SOYBEAN,
                "variety": "JS 335",
                "sowing_date": date(2024, 10, 1),
                "stage": CropStageEnum.MATURITY,
                "moisture_min": 45.0,
                "moisture_max": 65.0,
            },
            {
                "name": "Plot 3 - West (Sugarcane)",
                "area_acres": 1.50,
                "soil_ph": 7.6,
                "irrigation_type": "DRIP",
                "crop_name": "Sugarcane Adsali",
                "crop_type": CropTypeEnum.SUGARCANE,
                "variety": "Co 86032",
                "sowing_date": date(2024, 7, 20),
                "stage": CropStageEnum.VEGETATIVE,
                "moisture_min": 60.0,
                "moisture_max": 85.0,
            },
        ]

        for fc in field_configs:
            existing_field = db.query(Field).filter(Field.farm_id == farm.id, Field.name == fc["name"]).first()
            if not existing_field:
                field = Field(
                    farm_id=farm.id,
                    name=fc["name"],
                    area_acres=fc["area_acres"],
                    soil_ph=fc["soil_ph"],
                    irrigation_type=fc["irrigation_type"],
                )
                db.add(field)
                db.commit()
                db.refresh(field)

                crop = Crop(
                    field_id=field.id,
                    crop_name=fc["crop_name"],
                    crop_type=fc["crop_type"],
                    variety=fc["variety"],
                    sowing_date=fc["sowing_date"],
                    current_stage=fc["stage"],
                    target_moisture_min=fc["moisture_min"],
                    target_moisture_max=fc["moisture_max"],
                )
                db.add(crop)
                db.commit()
                print(f"✓ Seeded field and crop: {field.name} -> {crop.crop_name} ({crop.variety})")
            else:
                print(f"✓ Field already exists: {existing_field.name}")

        print("\n✨ Database initialization & seeding completed successfully!")
    finally:
        db.close()


if __name__ == "__main__":
    init_and_seed_db()
