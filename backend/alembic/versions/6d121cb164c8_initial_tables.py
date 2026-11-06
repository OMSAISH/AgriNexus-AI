"""Initial tables for users, roles, farms, fields, and crops

Revision ID: 6d121cb164c8
Revises: 
Create Date: 2026-11-05 19:30:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = '6d121cb164c8'
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Tables already created via init schema
    pass


def downgrade() -> None:
    op.drop_table('crops')
    op.drop_table('fields')
    op.drop_table('farms')
    op.drop_table('user_roles')
    op.drop_table('roles')
    op.drop_table('users')
