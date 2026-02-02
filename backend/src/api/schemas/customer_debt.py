from marshmallow import Schema, fields

class CustomerDebtRequestSchema(Schema):
    customer_id = fields.Int(required=True, description="ID of the customer")
    amount = fields.Decimal(required=True, as_string=True, description="Amount of debt")
    due_date = fields.DateTime(required=True, description="Due date of the debt")
    description = fields.Str(required=False, description="Description of the debt")

class CustomerDebtResponseSchema(Schema):
    customer_debt_id = fields.Int(required=True, description="ID of the customer debt")
    customer_id = fields.Int(required=True, description="ID of the customer")
    amount = fields.Decimal(required=True, as_string=True, description="Amount of debt")
    due_date = fields.DateTime(required=True, description="Due date of the debt")
    description = fields.Str(required=False, description="Description of the debt")
    created_at = fields.DateTime(required=True, description="Creation timestamp")
    updated_at = fields.DateTime(required=True, description="Last update timestamp")