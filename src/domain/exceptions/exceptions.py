class DomainException(Exception):
    pass

class ProductNotFoundException(DomainException):
    def __init__(self, product_id: int):
        self.message = f"Sản phẩm với ID {product_id} không tồn tại."
        super().__init__(self.message)