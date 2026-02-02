from infrastructure.databases.engine import session
from infrastructure.models.product_model import ProductModel
from infrastructure.models.order_detail_model import OrderDetailModel
from infrastructure.models.inventory_model import InventoryModel
import uuid
from flask import g, jsonify, request
from infrastructure.models.user_model import UserModel
from datetime import datetime 
from infrastructure.models.order_model import OrderModel
from infrastructure.models.customer_debt_model import CustomerDebtModel
from infrastructure.models.customer_model import CustomerModel

def get_all_products(inventory_id: int):
    """Lấy danh sách sản phẩm theo đúng kho hàng của chủ sở hữu"""
    return session.query(ProductModel).filter(
        ProductModel.inventory_id == inventory_id, # Phải dùng ProductModel.inventory_id
        ProductModel.is_active == True
    ).all()

def get_product_by_id(product_id: int):
    """Tìm sản phẩm theo ID"""
    return session.query(ProductModel).filter_by(product_id=product_id).first()

def get_cart_items():
    """Lấy danh sách các mục đã thêm vào giỏ hàng (order_detail)"""
    return session.query(OrderDetailModel).all()

def add_item_to_order_logic(product_id: int, quantity: int):
    """Logic xử lý thêm sản phẩm vào bảng order_detail"""
    product = get_product_by_id(product_id)
    if not product:
        return None, "Sản phẩm không tồn tại"

    try:
        price = product.base_price
        total = float(price) * float(quantity)

        new_item = OrderDetailModel(
            product_id=product.product_id,
            product_name=product.product_name,
            quantity=quantity,
            unit=product.base_unit,
            unit_price=price,
            line_total=total,
            discount_percent=0,
            discount_amount=0,
            notes="Added from UI"
        )

        session.add(new_item)
        session.commit()
        return new_item, "Thành công"

    except Exception as e:
        session.rollback()
        return None, str(e)

def create_new_product(name, price, unit, stock, category, inventory_id):
    try:
        # Tạo mã SKU và Barcode
        code_suffix = uuid.uuid4().hex[:8].upper()
        generated_code = f"PRD-{code_suffix}"
        generated_barcode = f"BAR-{code_suffix}"

        # --- SỬA Ở ĐÂY ---
        new_product = ProductModel(
            inventory_id=inventory_id,
            product_name=name,
            category_name=category,
            base_unit=unit,
            base_price=price,
            
            # THÊM DÒNG NÀY ĐỂ HẾT LỖI NOT NULL
            stock_quantity=stock,  # <--- Quan trọng!
            
            product_code=generated_code,
            barcode=generated_barcode,
            cost_price=price, # Tạm thời gán giá vốn = giá bán để không bị null
            low_stock_threshold=5,
            is_active=True,
            description=f"Sản phẩm {name}",
            image_url="", 
            created_at=datetime.utcnow(),
            updated_at=datetime.utcnow()
        )
        
        session.add(new_product)
        session.flush() 
        return new_product

    except Exception as e:
        print(f"Error creating product: {e}")
        session.rollback() # Rollback để tránh lỗi PendingRollbackError cho request sau
        return None

def update_product_by_id(product_id: int, data: dict, inventory_id: int):
    """Cập nhật thông tin của một sản phẩm."""
    try:
        product_to_update = session.query(ProductModel).filter_by(
            product_id=product_id, 
            inventory_id=inventory_id # Thêm điều kiện inventory_id để bảo mật
        ).first()

        if not product_to_update:
            return None, f"Không tìm thấy sản phẩm ID {product_id} hoặc không thuộc kho hàng này."

        # Ánh xạ các trường từ Frontend sang Backend Model
        if 'name' in data: # Frontend gửi 'name'
            product_to_update.product_name = data['name'] # Backend dùng 'product_name'
        if 'price' in data: # Frontend gửi 'price'
            product_to_update.base_price = float(data['price'])
            product_to_update.cost_price = float(data['price']) # Giả sử giá vốn bằng giá cơ sở
        if 'baseUnit' in data: # Frontend gửi 'baseUnit'
            product_to_update.base_unit = data['baseUnit']
        if 'category' in data: # Frontend gửi 'category'
            product_to_update.category_name = data['category']
        if 'stockLevel' in data:
            # Nếu bạn có bảng tồn kho riêng, bạn cần logic cập nhật bảng đó ở đây
            pass # Tạm thời bỏ qua việc cập nhật stockLevel trực tiếp trên ProductModel
            
        product_to_update.updated_at = datetime.utcnow()

        # Không commit ở đây, sẽ commit sau khi loop hoàn tất để đảm bảo tính nguyên tử (transaction)
        session.add(product_to_update)
        return product_to_update, "success"

    except Exception as e:
        # Không rollback ở đây, để hàm gọi bên ngoài quyết định rollback toàn bộ batch
        print(f"Lỗi khi xử lý sản phẩm ID {product_id}: {e}")
        return None, str(e)

def remove_product_by_id(product_id: int, inventory_id: int):
    """
    Xóa một sản phẩm khỏi cơ sở dữ liệu dựa trên product_id và inventory_id.

    Args:
        product_id: ID của sản phẩm cần xóa.
        inventory_id: ID kho hàng để đảm bảo sản phẩm thuộc quyền quản lý.
        session: Phiên làm việc SQLAlchemy.

    Returns:
        Một Tuple (thành công - True/False, thông báo).
    """
    try:
        # 1. Tìm sản phẩm cần xóa, bao gồm điều kiện inventory_id để bảo mật
        product_to_delete = session.query(ProductModel).filter(
            ProductModel.product_id == product_id, 
            ProductModel.inventory_id == inventory_id
        ).first()

        if not product_to_delete:
            # Không tìm thấy sản phẩm hoặc sản phẩm không thuộc kho hàng này
            return False, f"Không tìm thấy sản phẩm ID {product_id} hoặc không thuộc kho hàng này."

        # 2. Xóa sản phẩm khỏi phiên làm việc
        session.delete(product_to_delete)
        
        # 3. Commit thay đổi vào cơ sở dữ liệu
        # NOTE: Trong môi trường thực tế, việc commit có thể được xử lý ở lớp dịch vụ (Service Layer)
        # hoặc lớp quản lý giao dịch (Transaction Manager) cao hơn.
        session.commit()
        
        return True, f"Đã xóa thành công sản phẩm ID {product_id}."

    except Exception as e:
        # Rollback trong trường hợp có lỗi xảy ra
        session.rollback()
        print(f"Lỗi khi xóa sản phẩm ID {product_id}: {e}")
        return False, f"Đã xảy ra lỗi hệ thống khi xóa sản phẩm: {e}"

def add_product_to_owner_inventory():
    try:
        # BƯỚC 1: get owner_id (từ token thông qua g.user)
        user_info = getattr(g, 'user', None)
        owner_id = 1 #user_info.get('id') if user_info else None

        # BƯỚC 2: owner? ok next (Kiểm tra xem có ID người dùng không)
        if not owner_id:
            return jsonify({"msg": "Lỗi: Không xác định được danh tính người dùng!"}), 401

        # BƯỚC 3: get inventory_id from owner_id
        inventory_record = session.query(InventoryModel).filter_by(owner_id=owner_id).first() #nho chinh lai owner_id=owner_id

        # BƯỚC 4: if no inventory_id? report to admin to fix
        if not inventory_record:
            return jsonify({
                "msg": f"LỖI: Không tìm thấy kho hàng cho tài khoản (ID: {owner_id}). Vui lòng báo Admin!",
                "owner_id": owner_id
            }), 404

        # BƯỚC 5: create new product, with inventory_id = inventory_id
        data = request.get_json()
        
        # Lấy chính xác inventory_id từ bản ghi vừa tìm thấy
        target_inv_id = inventory_record.inventory_id 

        new_product = create_new_product(
            name=data.get('product_name'),
            price=data.get('base_price'),
            unit=data.get('base_unit'),
            stock=data.get('stock_quantity', 0),
            category=data.get('category', 'Chung'),
            inventory_id=target_inv_id  # Truyền ID kho vào hàm tạo
        )

        # BƯỚC CUỐI: ok
        if new_product:
            return jsonify({
                "msg": "OK", 
                "product_id": new_product.product_id,
                "inventory_id": target_inv_id
            }), 201
            
        return jsonify({"msg": "Lỗi khi lưu sản phẩm vào Database"}), 400

    except Exception as e:
        session.rollback()
        return jsonify({"msg": f"Lỗi hệ thống: {str(e)}"}), 500
def save_order_only(data, user_id, db_session):
    """
    Lưu đơn hàng + Tự động tạo khách hàng (Fix lỗi thiếu customer_code)
    """
    try:

        customer_phone = data.get('customerPhone')
        customer_name = data.get('customerName')
        payment_mode = data.get('paymentMode')
        total_amount = float(data.get('totalAmount', 0))
        debt_amount = float(data.get('debtAmount', 0))

        # Validate cơ bản
        if payment_mode == 'DEBT' and (not customer_phone or not customer_name):
            return None, "Lỗi: Đơn ghi nợ bắt buộc phải có Tên và SĐT khách hàng!"

        current_customer = None
        
        if customer_phone:
            current_customer = db_session.query(CustomerModel).filter_by(phone=customer_phone).first()

            if not current_customer:

                generated_code = f"CUS-{uuid.uuid4().hex[:8].upper()}"
                
                print(f"--- Tạo khách hàng mới: {customer_name} (Code: {generated_code}) ---")
                
                current_customer = CustomerModel(
                    customer_code=generated_code,       # <--- Bắt buộc có
                    customer_name=customer_name,
                    phone=customer_phone,
                    address=data.get('customerAddress', ''),
                    customer_type='RETAIL',             # <--- Bắt buộc có (Enum: RETAIL, WHOLESALE, VIP)
                    total_debt=0,
                    created_by=user_id,
                    created_at=datetime.utcnow(),
                    updated_at=datetime.utcnow()
                )
                db_session.add(current_customer)
                db_session.flush() 

        # Cập nhật số liệu khách hàng
        customer_id_for_order = None
        if current_customer:
            customer_id_for_order = current_customer.customer_id
            if payment_mode == 'DEBT':
                current_customer.total_debt = (current_customer.total_debt or 0) + debt_amount

        new_order = OrderModel(
            order_number=f"HD-{datetime.now().strftime('%y%m%d%H%M%S')}",
            order_type='AT_COUNTER',
            order_status='COMPLETED',
            customer_id=customer_id_for_order,
            customer_name=customer_name or "Khách lẻ",
            order_date=datetime.utcnow(),
            total_amount=total_amount,
            final_amount=total_amount,
            payment_method=payment_mode,
            paid_amount=data.get('paidAmount', 0),
            debt_amount=debt_amount,
            created_by=user_id,
            confirmed_by=user_id,
            confirmed_at=datetime.utcnow(),
            created_at=datetime.utcnow()
        )
        
        db_session.add(new_order)
        db_session.flush()

        # ---------------------------------------------------------
        # BƯỚC 3: LƯU LỊCH SỬ NỢ
        # ---------------------------------------------------------
        if payment_mode == 'DEBT' and customer_id_for_order:
            new_debt_record = CustomerDebtModel(
                customer_id=customer_id_for_order,
                order_id=new_order.order_id,
                debt_amount=debt_amount,
                paid_amount=0,
                remaining_amount=debt_amount,
                debt_date=datetime.utcnow(),
                status='UNPAID',
                created_at=datetime.utcnow()
            )
            db_session.add(new_debt_record)

        db_session.commit()
        return new_order, "Thành công"

    except Exception as e:
        db_session.rollback()
        print(f"Lỗi save_order: {e}")
        # In chi tiết lỗi để debug dễ hơn
        import traceback
        traceback.print_exc()
        return None, str(e)