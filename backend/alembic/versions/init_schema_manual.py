"""init schema

Revision ID: manual_init
Revises: 
Create Date: 2025-08-16 18:50:00.000000

"""
from alembic import op
import sqlalchemy as sa
from datetime import datetime

revision = 'manual_init'
down_revision = None
branch_labels = None
depends_on = None

def upgrade():
    op.create_table(
        'incidents',
        sa.Column('id', sa.Integer, primary_key=True, index=True),
        sa.Column('src_ip', sa.String, nullable=False),
        sa.Column('dst', sa.String),
        sa.Column('vector', sa.String),
        sa.Column('bytes', sa.Float),
        sa.Column('requests', sa.Integer),
        sa.Column('score', sa.Float),
        sa.Column('level', sa.String),
        sa.Column('country', sa.String),
        sa.Column('lat', sa.Float),
        sa.Column('lon', sa.Float),
        sa.Column('details', sa.String),
        sa.Column('created_at', sa.DateTime, default=datetime.utcnow),
    )

def downgrade():
    op.drop_table('incidents')
