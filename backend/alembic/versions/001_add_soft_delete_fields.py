"""Add soft delete fields to Task model and create TrashBin model

Revision ID: 001
Revises:
Create Date: 2026-01-14 14:54:00.000000

"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql
import uuid

# revision identifiers
revision: str = '001'
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Add soft_deleted column to task table
    op.add_column('task', sa.Column('soft_deleted', sa.Boolean(), nullable=False, server_default='false'))

    # Create trash_bin table
    op.create_table('trash_bin',
        sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('task_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('user_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('deleted_at', sa.DateTime(), nullable=False),
        sa.Column('scheduled_purge_at', sa.DateTime(), nullable=False),
        sa.Column('is_restored', sa.Boolean(), nullable=False, server_default='false'),
        sa.Column('original_task_data', sa.String(length=5000), nullable=False),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.Column('updated_at', sa.DateTime(), nullable=False),
        sa.ForeignKeyConstraint(['user_id'], ['user.id'], ),
        sa.PrimaryKeyConstraint('id')
    )

    # Create indexes for the new columns
    op.create_index('idx_task_soft_deleted', 'task', ['soft_deleted'])
    op.create_index('idx_trashbin_user_id', 'trash_bin', ['user_id'])
    op.create_index('idx_trashbin_task_id', 'trash_bin', ['task_id'])
    op.create_index('idx_trashbin_deleted_at', 'trash_bin', ['deleted_at'])
    op.create_index('idx_trashbin_scheduled_purge_at', 'trash_bin', ['scheduled_purge_at'])
    op.create_index('idx_trashbin_is_restored', 'trash_bin', ['is_restored'])


def downgrade() -> None:
    # Drop indexes
    op.drop_index('idx_trashbin_is_restored', table_name='trash_bin')
    op.drop_index('idx_trashbin_scheduled_purge_at', table_name='trash_bin')
    op.drop_index('idx_trashbin_deleted_at', table_name='trash_bin')
    op.drop_index('idx_trashbin_task_id', table_name='trash_bin')
    op.drop_index('idx_trashbin_user_id', table_name='trash_bin')
    op.drop_index('idx_task_soft_deleted', table_name='task')

    # Drop trash_bin table
    op.drop_table('trash_bin')

    # Drop soft_deleted column from task table
    op.drop_column('task', 'soft_deleted')