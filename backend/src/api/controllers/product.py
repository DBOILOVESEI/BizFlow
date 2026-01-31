from flask import Blueprint, request, jsonify
from services.product_service import ProductService
from infrastructure.repositories.product_repository import ProductRepository
from api.schemas.product import ProductRequestSchema, ProductResponseSchema
from datetime import datetime
from infrastructure.databases.engine import session
bp = Blueprint('product', __name__, url_prefix='/products')

product_service = ProductService(ProductRepository(session))

request_schema = ProductRequestSchema()
response_schema = ProductResponseSchema()

@bp.route('/', methods=['GET'])
def list_products():
    """
    Get all products
    ---
    get:
      summary: Get all products
      tags:
        - Products
      responses:
        200:
          description: List of products
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/ProductResponse'
    """
    products = product_service.list_products()
    return jsonify(response_schema.dump(products, many=True)), 200

@bp.route('/<int:product_id>', methods=['GET'])
def get_product(product_id):
    """
    Get product by id
    ---
    get:
      summary: Get product by id
      parameters:
        - name: product_id
          in: path
          required: true
          schema:
            type: integer
          description: ID của product cần lấy
      tags:
        - Products
      responses:
        200:
          description: object of product
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ProductResponse'
        404:
          description: Product not found
          content:
            application/json:
              schema:
                type: object
                properties:
                  message:
                    type: string
    """
    product = product_service.get_product(product_id)
    if not product:
        return jsonify({'message': 'Product not found'}), 404
    return jsonify(response_schema.dump(product)), 200


@bp.route('/', methods=['POST'])
def create_product():
    """
    Create a new product
    ---
    post:
      summary: Create a new product
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/ProductRequest'
      tags:
        - Products
      responses:
        201:
          description: Product created successfully
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ProductResponse'
        400:
          description: Invalid input
          content:
            application/json:
              schema:
                type: object
                properties:
                  error:
                    type: string
    """
    data = request.get_json()
    errors = request_schema.validate(data)
    if errors:
        return jsonify(errors), 400
    now = datetime.utcnow()
    product = product_service.create_product(
        product_name=data['product_name'],
        product_code=data['product_code'],
        description=data.get('description', ''),
        category_name=data['category_name'],
        base_price=data['base_price'],
        base_unit=data['base_unit'],
        cost_price=data['cost_price'],
        barcode=data['barcode'],
        image_url=data.get('image_url', ''),
        low_stock_threshold=data['low_stock_threshold'],
        is_active=True,
        created_at=now,
        updated_at=now
    )
    return jsonify(response_schema.dump(product)), 201  

@bp.route('/<int:product_id>', methods=['PUT'])
def update_product(product_id):
    """
    Update a product by id
    ---
    put:
      summary: Update a product by id
      parameters:
        - name: product_id
          in: path
          required: true
          schema:
            type: integer
          description: ID của product cần cập nhật
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/ProductRequest'
      tags:
        - Products
      responses:
        200:
          description: Product updated successfully
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ProductResponse'
        400:
          description: Invalid input
          content:
            application/json:
              schema:
                type: object
                properties:
                  error:
                    type: string
        404:
          description: Todo not found
          content:
            application/json:
              schema:
                type: object
                properties:
                  message:
                    type: string
    """
    data = request.get_json()
    errors = request_schema.validate(data)
    if errors:
        return jsonify(errors), 400
    product = product_service.update_product(
        product_id=product_id,
        product_name=data['product_name'],
        description=data.get('description', ''),
        product_code=data['product_code'],
        category_name=data['category_name'],
        base_price=data['base_price'],
        base_unit=data['base_unit'],
        cost_price=data['cost_price'],
        barcode=data['barcode'],
        image_url=data.get('image_url', ''),
        low_stock_threshold=data['low_stock_threshold'],
        is_active=True,
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow()
    )
    return jsonify(response_schema.dump(product)), 200

@bp.route('/<int:product_id>', methods=['DELETE'])
def delete_product(product_id):
    """
    Delete a product by id
    ---
    delete:
      summary: Delete a product by id
      parameters:
        - name: product_id
          in: path
          required: true
          schema:
            type: integer
          description: ID của product cần xóa
      tags:
        - Products
      responses:
        204:
          description: Product deleted successfully
        404:
          description: Product not found
          content:
            application/json:
              schema:
                type: object
                properties:
                  message:
                    type: string
    """
    product_service.delete_product(product_id)
    return '', 204