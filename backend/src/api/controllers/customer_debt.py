from flask import Blueprint, request, jsonify
from services.customer_debt_service import CustomerDebtService
from infrastructure.repositories.customer_debt_repository import CustomerDebtRepository
from api.schemas.customer_debt import CustomerDebtRequestSchema, CustomerDebtResponseSchema
from datetime import datetime
from infrastructure.databases.engine import session
bp = Blueprint('customer_debt', __name__, url_prefix='/customer-debts')

customer_debt_service = CustomerDebtService(CustomerDebtRepository(session))

request_schema = CustomerDebtRequestSchema()
response_schema = CustomerDebtResponseSchema()

@bp.route('/', methods=['GET'])
def list_customer_debts():
    """
    Get all customer debts
    ---
    get:
      summary: Get all customer debts
      tags:
        - Customer Debts
      responses:
        200:
          description: List of products
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/CustomerDebtResponse'
    """
    customer_debts = customer_debt_service.list_customer_debts()
    return jsonify(response_schema.dump(customer_debts, many=True)), 200

@bp.route('/<int:customer_debt_id>', methods=['GET'])
def get_customer_debt(customer_debt_id):
    """
    Get customer debt by id
    ---
    get:
      summary: Get customer debt by id
      parameters:
        - name: customer_debt_id
          in: path
          required: true
          schema:
            type: integer
          description: ID của customer debt cần lấy
      tags:
        - Customer Debts
      responses:
        200:
          description: object of customer debt
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/CustomerDebtResponse'
        404:
          description: Customer debt not found
          content:
            application/json:
              schema:
                type: object
                properties:
                  message:
                    type: string
    """
    customer_debt = customer_debt_service.get_customer_debt(customer_debt_id)
    if not customer_debt:
        return jsonify({'message': 'Customer debt not found'}), 404
    return jsonify(response_schema.dump(customer_debt)), 200


@bp.route('/', methods=['POST'])
def create_customer_debt():
    """
    Create a new customer debt
    ---
    post:
      summary: Create a new customer debt
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/CustomerDebtRequest'
      tags:
        - Customer Debts
      responses:
        201:
          description: Customer debt created successfully
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/CustomerDebtResponse'
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
    customer_debt = customer_debt_service.create_customer_debt(
        customer_id=data['customer_id'],
        amount=data['amount'],
        debt_date=data['debt_date'],
        due_date=data['due_date'],
        description=data.get('description', ''),
        is_settled=data.get('is_settled', False),
        created_at=now,
        updated_at=now
    )
    return jsonify(response_schema.dump(customer_debt)), 201  

@bp.route('/<int:customer_debt_id>', methods=['PUT'])
def update_customer_debt(customer_debt_id):
    """
    Update a customer debt by id
    ---
    put:
      summary: Update a customer debt by id
      parameters:
        - name: customer_debt_id
          in: path
          required: true
          schema:
            type: integer
          description: ID của customer debt cần cập nhật
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/CustomerDebtRequest'
      tags:
        - Customer Debts
      responses:
        200:
          description: Customer debt updated successfully
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/CustomerDebtResponse'
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
          description: Customer debt not found
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
    customer_debt = customer_debt_service.update_customer_debt(
        customer_debt_id,
        customer_id=data['customer_id'],
        amount=data['amount'],
        debt_date=data['debt_date'],
        due_date=data['due_date'],
        description=data.get('description', ''),
        is_settled=data.get('is_settled', False),
        updated_at=datetime.utcnow()
    )
    return jsonify(response_schema.dump(customer_debt)), 200

@bp.route('/<int:customer_debt_id>', methods=['DELETE'])
def delete_customer_debt(customer_debt_id):
    """
    Delete a customer debt by id
    ---
    delete:
      summary: Delete a customer debt by id
      parameters:
        - name: customer_debt_id
          in: path
          required: true
          schema:
            type: integer
          description: ID của customer debt cần xóa
      tags:
        - Customer Debts
      responses:
        204:
          description: Customer debt deleted successfully
        404:
          description: Customer debt not found
          content:
            application/json:
              schema:
                type: object
                properties:
                  message:
                    type: string
    """
    customer_debt_service.delete_customer_debt(customer_debt_id)
    return '', 204