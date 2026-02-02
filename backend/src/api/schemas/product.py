from marshmallow import Schema, fields

class ProductRequestSchema(Schema):
    product_name = fields.Str(required=True, description="Name of the product")
    product_code = fields.Str(required=True, description="Code of the product")
    description = fields.Str(required=False, description="Description of the product")
    category_name = fields.Str(required=True, description="Category of the product")
    base_price = fields.Decimal(required=True, as_string=True , description="Base price of the product")
    base_unit = fields.Str(required=True, description="Base unit of the product")
    cost_price = fields.Decimal(required=True, as_string=True, description="Cost price of the product")
    barcode = fields.Str(required=True, description="Barcode of the product")
    image_url = fields.Str(required=False, description="Image URL of the product")
    low_stock_threshold = fields.Int(required=True, description="Low stock threshold")

class ProductResponseSchema(Schema):
    product_id = fields.Int(required=True, description="ID of the product")
    product_name = fields.Str(required=True, description="Name of the product")
    product_code = fields.Str(required=True, description="Code of the product")
    description = fields.Str(required=False, description="Description of the product")
    category_name = fields.Str(required=True, description="Category of the product")
    base_price = fields.Decimal(required=True, as_string=True, description="Base price of the product")
    base_unit = fields.Str(required=True, description="Base unit of the product")
    cost_price = fields.Decimal(required=True, as_string=True, description="Cost price of the product")
    barcode = fields.Str(required=True, description="Barcode of the product")
    image_url = fields.Str(required=False, description="Image URL of the product")
    low_stock_threshold = fields.Int(required=True, description="Low stock threshold")
    is_active = fields.Bool(required=True, description="Is the product active")
    created_at = fields.DateTime(required=True, description="Creation timestamp")
    updated_at = fields.DateTime(required=True, description="Last update timestamp")