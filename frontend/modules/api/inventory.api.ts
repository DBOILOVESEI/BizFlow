
import { User, UserRole } from '../../types'
import { API_BASE_URL, ENDPOINTS } from '../../modules/api/api.config';

export async function updateProductOnServer(user: User, data: any): Promise<any> {
    // Thường sử dụng phương thức PUT hoặc PATCH để cập nhật.
    // Thêm ID vào URL: /products/:id
    const response = await fetch(`${API_BASE_URL}${ENDPOINTS.INVENTORY}`, {
        method: 'PUT', // Hoặc 'PATCH'
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${user.token}`,
        },
        body: JSON.stringify(
            {
                "products": data
            }
        ),
    });

    if (!response.ok) {
        // Lỗi 404, 500, etc.
        const errorText = await response.text();
        throw new Error(`Lỗi cập nhật sản phẩm: ${response.status} - ${errorText}`);
    }
    
    // Server có thể trả về JSON của sản phẩm đã cập nhật.
    return response.json(); 
};

/**
 * Gửi yêu cầu thêm mới (POST) lên server
 * @param data Dữ liệu sản phẩm mới
 * @returns Trả về dữ liệu sản phẩm đã được tạo (bao gồm ID, SKU từ server)
 */
export async function addProductToServer(user: User, data: any): Promise<any> {
    // Thường sử dụng phương thức POST.
    const response = await fetch(`${API_BASE_URL}${ENDPOINTS.INVENTORY}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${user.token}`,
        },
        body: JSON.stringify({
            "product": data
        }),
    });

    if (!response.ok) {
        // Lỗi 400, 500, etc.
        const errorText = await response.text();
        throw new Error(`Lỗi thêm mới sản phẩm: ${response.status} - ${errorText}`);
    }
    
    // Server BẮT BUỘC phải trả về JSON của sản phẩm vừa tạo (có ID và SKU thật).
    return response.json();
};

export async function deleteProductOnServer(user: User, productId: string) {
    const response = await fetch(`${API_BASE_URL}${ENDPOINTS.INVENTORY}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${user.token}`,
        },
        body: JSON.stringify({
            "product_id": productId
        }),
    });
    if (!response.ok) {
        // Lỗi 400, 500, etc.
        const errorText = await response.text();
        throw new Error(`Lỗi thêm mới sản phẩm: ${response.status} - ${errorText}`);
    }
    
    return { success: true, message: `Đã xóa mềm sản phẩm ${productId}` };
};