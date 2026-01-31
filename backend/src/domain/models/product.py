class Product:
    def __init__(self,product_id: int, product_code: str, category_name: str, product_name: str,
                 description: str, base_unit: str, base_price: float,
                 cost_price: float, image_url: str, barcode: str,
                 is_active: bool, low_stock_threshold: int,
                 created_at: str, updated_at: str):
        self.product_id = product_id
        self.product_code = product_code
        self.category_name = category_name
        self.product_name = product_name
        self.description = description
        self.base_unit = base_unit
        self.base_price = base_price
        self.cost_price = cost_price
        self.image_url = image_url
        self.barcode = barcode
        self.is_active = is_active
        self.low_stock_threshold = low_stock_threshold
        self.created_at = created_at
        self.updated_at = updated_at