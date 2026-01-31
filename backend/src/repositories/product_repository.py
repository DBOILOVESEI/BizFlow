from domain.models.iproduct_repository import IProductRepository
from domain.models.product import Product
from typing import List, Optional
from dotenv import load_dotenv
import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from config import Config
from sqlalchemy import Column, Integer, String, DateTime
from infrastructure.databases import Base
from sqlalchemy.orm import Session
from infrastructure.models.product_model import ProductModel
from infrastructure.databases.engine import session
load_dotenv()

class ProductRepository(IProductRepository):
    def __init__(self, session: Session):
        self.session = session


    def add(self, product: Product) -> ProductModel:
        try:
            #Manual mapping from Product to ProductModel
            product = ProductModel(
                product_name=product.product_name,
                description=product.description,
                category_name=product.category_name,
                product_code=product.product_code,
                base_unit=product.base_unit,
                base_price=product.base_price,
                cost_price=product.cost_price,
                image_url=product.image_url,
                barcode=product.barcode,
                is_active=product.is_active,
                created_at=product.created_at,
                updated_at=product.updated_at
            )
            self.session.add(product)
            self.session.commit()
            self.session.refresh(product)
            return product
        except Exception as e:
            self.session.rollback()
            raise ValueError('Product not found')
        finally:
            self.session.close()
    
    # def add(self, todo: Todo) -> Todo:
    #     todo.id = self._id_counter
    #     self._id_counter += 1
    #     self._todos.append(todo)
    #     return todo

    def get_by_id(self, product_id: int) -> Optional[ProductModel]:
        return self.session.query(ProductModel).filter_by(id=product_id).first()


    # def list(self) -> List[Todo]:
    #     self._todos
    #     return self._todos
    def list(self) -> List[ProductModel]:
        self._products = session.query(ProductModel).all()
        # select * from products
        return self._products

    def update(self, product: ProductModel) -> ProductModel:
        try:
             #Manual mapping from Product to ProductModel
            product = ProductModel(
                product_id=product.product_id,
                product_name=product.product_name,  
                description=product.description,
                category_name=product.category_name,
                product_code=product.product_code,
                base_unit=product.base_unit,
                base_price=product.base_price,
                cost_price=product.cost_price,
                image_url=product.image_url,
                barcode=product.barcode,
                is_active=product.is_active,
                created_at=product.created_at,
                updated_at=product.updated_at
            )
            self.session.merge(product)
            self.session.commit()
            return product
        except Exception as e:
            self.session.rollback()
            raise ValueError('Product not found')
        finally:
            self.session.close()

    def delete(self, product_id: int) -> None:
        # self._products = [p for p in self._products if p.id != product_id] 
        try:
            product = self.session.query(ProductModel).filter_by(id=product_id).first()
            if product:
                self.session.delete(product)
                self.session.commit()
            else:
                raise ValueError('Product not found')
        except Exception as e:
            self.session.rollback()
            raise ValueError('Product not found')
        finally:
            self.session.close()

