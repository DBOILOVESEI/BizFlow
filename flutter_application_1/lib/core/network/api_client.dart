import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:flutter_application_1/core/constants/api_constants.dart';

class ApiClient {
  static Future<Map<String, dynamic>> post(
    String endpoint,
    Map<String, dynamic> body,
  ) async {
    final response = await http.post(
      Uri.parse(ApiConstants.baseUrl + endpoint),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode(body),
    );

    if (response.statusCode == 200) {
      return jsonDecode(response.body);
    } else {
      throw Exception('API Error: ${response.statusCode}');
    }
  }
}
