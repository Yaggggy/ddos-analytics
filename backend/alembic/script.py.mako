"""${message}

Revision ID: ${up_revision}
Revises: ${down_revision | none}
Create Date: ${create_date}

"""
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = ${repr(up_revision)}
down_revision = ${repr(down_revision)}
branch_labels = ${repr(branch_labels)}
depends_on = ${repr(depends_on)}


def upgrade():
% for upgrade_ops in upgrade_ops_list:
    ${upgrade_ops}
% endfor


def downgrade():
% for downgrade_ops in downgrade_ops_list:
    ${downgrade_ops}
% endfor
