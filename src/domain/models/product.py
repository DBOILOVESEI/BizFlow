from dataclasses import dataclass
from typing import Optional

@dataclass
class Product:
    id: Optional[int]
    name: str
    unit: str  # Đơn vị tính (theo Thông tư 88)
    price: float
    stock_quantity: int