
import { GoogleGenAI, Type } from "@google/genai";
import { Product } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function parseNaturalLanguageOrder(text: string, availableProducts: Product[]) {
  const productContext = availableProducts.map(p => 
    `${p.name} (SKU: ${p.sku}) đơn vị: ${p.units.map(u => u.name).join(', ')}`
  ).join('\n');

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Danh sách sản phẩm:\n${productContext}\n\nYêu cầu khách hàng: "${text}"`,
    config: {
      systemInstruction: `Bạn là trợ lý bán hàng AI cho cửa hàng bán lẻ. 
      Chuyển đổi ngôn ngữ tự nhiên thành bản thảo đơn hàng JSON có cấu trúc. 
      Xác định sản phẩm từ danh sách có sẵn. Nếu không tìm thấy sản phẩm, đừng bao gồm nó.
      Xác định số lượng và đơn vị đo lường nếu được chỉ định. Phản hồi bằng tiếng Việt.`,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          customerName: { type: Type.STRING },
          items: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                productId: { type: Type.STRING },
                productName: { type: Type.STRING },
                quantity: { type: Type.NUMBER },
                unitName: { type: Type.STRING }
              },
              required: ["productName", "quantity"]
            }
          }
        },
        required: ["items"]
      }
    }
  });

  try {
    const jsonStr = response.text || "{}";
    return JSON.parse(jsonStr.trim());
  } catch (e) {
    console.error("Lỗi khi phân tích phản hồi AI", e);
    return null;
  }
}
