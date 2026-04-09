"""init fastapi crowdfunding schema

Revision ID: 20260409_0001
Revises:
Create Date: 2026-04-09
"""

from alembic import op
import sqlalchemy as sa


revision = "20260409_0001"
down_revision = None
branch_labels = None
depends_on = None


profile_role = sa.Enum("pyme", "investor", name="profilerole")
request_status = sa.Enum("pending", "approved", "funded", "rejected", name="requeststatus")
goal_category = sa.Enum("equipo", "inventario", "remodelacion", name="goalcategory")


def upgrade() -> None:
    op.create_table(
        "users",
        sa.Column("id", sa.CHAR(36), primary_key=True),
        sa.Column("email", sa.String(255), nullable=False, unique=True),
        sa.Column("password_hash", sa.String(255), nullable=False),
        sa.Column("created_at", sa.DateTime(), server_default=sa.func.now(), nullable=False),
        sa.Column("updated_at", sa.DateTime(), server_default=sa.func.now(), nullable=False),
    )
    op.create_table(
        "profiles",
        sa.Column("id", sa.CHAR(36), sa.ForeignKey("users.id", ondelete="CASCADE"), primary_key=True),
        sa.Column("role", profile_role, nullable=False),
        sa.Column("full_name", sa.String(255), nullable=False, server_default=""),
        sa.Column("avatar_url", sa.Text()),
        sa.Column("nessie_customer_id", sa.String(100)),
        sa.Column("nessie_account_id", sa.String(100)),
        sa.Column("created_at", sa.DateTime(), server_default=sa.func.now(), nullable=False),
    )
    op.create_table(
        "businesses",
        sa.Column("id", sa.CHAR(36), primary_key=True),
        sa.Column("owner_id", sa.CHAR(36), sa.ForeignKey("profiles.id", ondelete="CASCADE"), nullable=False),
        sa.Column("name", sa.String(255), nullable=False),
        sa.Column("sector", sa.String(100), nullable=False, server_default="Otro"),
        sa.Column("location_city", sa.String(100), nullable=False, server_default=""),
        sa.Column("location_state", sa.String(10), nullable=False, server_default=""),
        sa.Column("years_operating", sa.Integer(), nullable=False, server_default="0"),
        sa.Column("employees", sa.Integer(), nullable=False, server_default="1"),
        sa.Column("daily_sales", sa.Numeric(12, 2), nullable=False, server_default="0"),
        sa.Column("fixed_costs", sa.Numeric(12, 2), nullable=False, server_default="0"),
        sa.Column("variable_costs", sa.Numeric(12, 2), nullable=False, server_default="0"),
        sa.Column("has_debts", sa.Integer(), nullable=False, server_default="0"),
        sa.Column("debt_amount", sa.Numeric(12, 2), nullable=False, server_default="0"),
        sa.Column("created_at", sa.DateTime(), server_default=sa.func.now(), nullable=False),
    )
    op.create_table(
        "crowdfunding_requests",
        sa.Column("id", sa.CHAR(36), primary_key=True),
        sa.Column("business_id", sa.CHAR(36), sa.ForeignKey("businesses.id", ondelete="CASCADE"), nullable=False),
        sa.Column("owner_id", sa.CHAR(36), sa.ForeignKey("profiles.id", ondelete="CASCADE"), nullable=False),
        sa.Column("title", sa.String(255), nullable=False),
        sa.Column("description", sa.Text(), nullable=False),
        sa.Column("objective", sa.Text(), nullable=False),
        sa.Column("goal_category", goal_category, nullable=False),
        sa.Column("funding_goal", sa.Numeric(12, 2), nullable=False),
        sa.Column("funded_amount", sa.Numeric(12, 2), nullable=False, server_default="0"),
        sa.Column("deadline_days", sa.Integer(), nullable=False, server_default="30"),
        sa.Column("reward_tiers_json", sa.Text()),
        sa.Column("status", request_status, nullable=False, server_default="pending"),
        sa.Column("created_at", sa.DateTime(), server_default=sa.func.now(), nullable=False),
        sa.Column("updated_at", sa.DateTime(), server_default=sa.func.now(), nullable=False),
    )
    op.create_table(
        "investments",
        sa.Column("id", sa.CHAR(36), primary_key=True),
        sa.Column("investor_id", sa.CHAR(36), sa.ForeignKey("profiles.id", ondelete="CASCADE"), nullable=False),
        sa.Column(
            "crowdfunding_request_id",
            sa.CHAR(36),
            sa.ForeignKey("crowdfunding_requests.id", ondelete="CASCADE"),
            nullable=False,
        ),
        sa.Column("amount", sa.Numeric(12, 2), nullable=False),
        sa.Column("investment_date", sa.DateTime(), server_default=sa.func.now(), nullable=False),
        sa.Column("next_payment_date", sa.Date()),
    )


def downgrade() -> None:
    op.drop_table("investments")
    op.drop_table("crowdfunding_requests")
    op.drop_table("businesses")
    op.drop_table("profiles")
    op.drop_table("users")
    goal_category.drop(op.get_bind(), checkfirst=True)
    request_status.drop(op.get_bind(), checkfirst=True)
    profile_role.drop(op.get_bind(), checkfirst=True)
