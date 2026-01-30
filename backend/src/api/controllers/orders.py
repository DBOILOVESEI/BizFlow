import jwt
from flask import g, Blueprint, request, jsonify, current_app
from flask_jwt_extended import get_jwt_identity

from modules.extensions import bcrypt, cors
from modules.decorators import role_required

from datetime import datetime, timedelta
from infrastructure.databases.engine import session

from repositories import user_repo
from repositories import orders_repo
from repositories import inventory_repo

orders_bp = Blueprint('orders', __name__, url_prefix='/')

@orders_bp.route('/orders', methods=['POST'])
@role_required("OWNER", "EMPLOYEE")
def orders():
    print("hello")

@orders_bp.route('/inventory', methods=['GET'])
@role_required("OWNER", "EMPLOYEE")
def inventory():
    """
    API lấy toàn bộ sản phẩm của kho để hiển thị lên bảng UI.
    """
    owner_id = get_jwt_identity()
    inventory = inventory_repo.get_inventory_from_owner_id(owner_id)
    if not inventory:
        return jsonify({"msg": f"Không thể tìm thấy inventory thuộc về owner id {owner_id}"}), 401

    inventory_id = inventory.inventory_id

    try:
        # Lấy dữ liệu thật từ DB thông qua hàm get_all_products trong repo
        products = orders_repo.get_all_products(inventory_id)
        
        # Chuyển đổi dữ liệu từ Model sang JSON cho Frontend
        products_data = []
        for p in products:
            products_data.append({
                "id": p.product_id,
                "name": p.product_name or "Unnamed product",
                "sku": p.product_code,
                "category": p.category_name or "Chung",
                "baseUnit": p.base_unit,
                "stockLevel": 100, # Tạm thời fix cứng hoặc lấy từ bảng Inventory sau
                "units": [{"name": p.base_unit, "price": p.base_price}]
            })

        return jsonify({
            "msg": "Tải dữ liệu thành công",
            "products_data": products_data
        }), 200

    except Exception as e:
        return jsonify({"msg": f"Lỗi tải dữ liệu: {str(e)}"}), 500
# orders.py

@orders_bp.route('/checkout', methods=['POST'])
@role_required("OWNER", "EMPLOYEE")
def checkout_api():
    try:
        data = request.get_json()
        user_info = getattr(g, 'user', None)
        u_id = user_info.get('id') if user_info else 1 

        # Truyền data, user_id và session đã import
        order, msg = orders_repo.save_order_only(data, u_id, session)

        if order:
            return jsonify({"msg": "Thành công"}), 201
        
        return jsonify({"msg": msg}), 400
    except Exception as e:
        return jsonify({"msg": str(e)}), 500

@orders_bp.route('/inventory', methods=['POST'])
@role_required("OWNER", "EMPLOYEE")
def add_to_inventory():
    print("ayaya XD - Bắt đầu thêm sản phẩm")
    
    owner_id = get_jwt_identity()
    inventory = inventory_repo.get_inventory_from_owner_id(owner_id)
    
    if not inventory:
        return jsonify({"msg": f"Không thể tìm thấy inventory thuộc về owner id {owner_id}"}), 401

    inventory_id = inventory.inventory_id

    # 1. Lấy dữ liệu từ request body
    data = request.get_json() 
    
    # 2. Kiểm tra format: Frontend gửi một mảng các sản phẩm dưới key "product"
    product = data.get("product")
    print(product)
    """
    if not isinstance(product) or not products_data_list:
        return jsonify({"msg": "Dữ liệu gửi lên không hợp lệ. Phải là một mảng các sản phẩm."}), 400
    """
    try:
        """
        frontend

        const dataToSend = {
            product_id: "",
            name: formData.name,
            category: formData.category || 'Chưa phân loại',
            baseUnit: formData.baseUnit,
            stockLevel: parseInt(formData.stockLevel) || 0,
            price: parseInt(formData.price) || 0, // Giá cơ sở
        };
        """
        name = product.get('name')
        price = product.get('price')
        unit = product.get('baseUnit')
        stock = product.get('stockLevel', 0)
        category = product.get('category', 'Chung')

        # Kiểm tra dữ liệu bắt buộc
        if not name or price is None or not unit:
            return jsonify({
                "msg": f"Tạo sản phẩm {name} thất bại.",
            }), 401

        # Gọi hàm logic tạo sản phẩm
        new_product = orders_repo.create_new_product(
            name=name,
            price=price,
            unit=unit,
            stock=stock, # Stock sẽ được xử lý riêng nếu có bảng Inventory
            category=category,
            inventory_id=inventory_id
        )

        if new_product:
            session.commit()
            return jsonify({
                "msg": f"Hoàn tất. Sản phẩmS {name} được thêm thành công.",
            }), 201
        else:
            return jsonify({
                "msg": f"Tạo sản phẩm {name} thất bại.",
            }), 401

    except Exception as e:
        # 6. ROLLBACK TOÀN BỘ NẾU CÓ LỖI HỆ THỐNG
        session.rollback()
        return jsonify({
                "msg": f"Tạo sản phẩm {name} thất bại.",
            }), 401

    

# cập nhật inventory
@orders_bp.route('/inventory', methods=['PUT'])
@role_required("OWNER", "EMPLOYEE")
def update_inventory():
    owner_id = get_jwt_identity()
    inventory = inventory_repo.get_inventory_from_owner_id(owner_id)
    
    if not inventory:
        return jsonify({"msg": f"Không thể tìm thấy inventory thuộc về owner id {owner_id}"}), 401

    inventory_id = inventory.inventory_id
    
    # 1. Lấy dữ liệu (Dự kiến là một MẢNG các sản phẩm)
    
    data = request.get_json() 
    products_data_list = data["products"]

    # 2. Kiểm tra xem dữ liệu có phải là MẢNG và không rỗng
    if not isinstance(products_data_list, list) or not products_data_list:
        return jsonify({"msg": "Dữ liệu gửi lên không hợp lệ. Phải là một mảng các sản phẩm."}), 400

    results = []
    success_count = 0
    
    try:
        # lặp qua từng sản phẩm và cập nhật
        for product in products_data_list:
            product_id = product.get('product_id')

            if not product_id:
                results.append({"product_id": "N/A", "status": "Lỗi", "message": "Thiếu product_id."})
                continue
            
            updated_prod, message = orders_repo.update_product_by_id(product_id, product, inventory_id)
            
            if updated_prod:
                success_count += 1
                results.append({"product_id": product_id, "status": "OK", "message": "Cập nhật thành công."})
            else:
                results.append({"product_id": product_id, "status": "Lỗi", "message": message})
        
        # COMMIT TOÀN BỘ TRANSACTION
        # Nếu không có lỗi xảy ra trong vòng lặp, commit toàn bộ thay đổi.
        session.commit()
        
        return jsonify({
            "msg": f"Hoàn tất cập nhật Batch. {success_count}/{len(products_data_list)} sản phẩm được cập nhật thành công.",
            "results": results
        }), 200

    except Exception as e:
        # 5. ROLLBACK TOÀN BỘ NẾU BẤT KỲ LỖI NÀO XẢY RA
        session.rollback()
        print(f"Lỗi hệ thống trong Batch Update: {e}")
        return jsonify({"msg": f"Lỗi hệ thống trong quá trình cập nhật hàng loạt: {str(e)}", "results": results}), 500

@orders_bp.route('/inventory', methods=['DELETE'])
@role_required("OWNER", "EMPLOYEE")
def delete_from_inventory():
    owner_id = get_jwt_identity()
    inventory = inventory_repo.get_inventory_from_owner_id(owner_id)
    
    if not inventory:
        return jsonify({"msg": f"Không thể tìm thấy inventory thuộc về owner id {owner_id}"}), 401

    inventory_id = inventory.inventory_id
    
    # 1. Lấy dữ liệu (Dự kiến là một MẢNG các sản phẩm)
    
    data = request.get_json()
    product_id = data["product_id"]

    print(product_id)
    success = orders_repo.remove_product_by_id(product_id, inventory_id)
    if not success:
        return jsonify({"msg": f"Xóa product {product_id} thất bại"}), 401

    return jsonify({"msg": f"Xóa {product_id} thành công"}), 201
