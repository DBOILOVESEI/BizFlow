from pydantic import BaseModel

class ProductCreateRequest(BaseModel):
    name: str
    unit: str
    price: float
    stock_quantity: int

class ProductResponse(BaseModel):
    id: int
    name: str
    unit: str
    price: float
    
    class Config:
        from_attributes = True