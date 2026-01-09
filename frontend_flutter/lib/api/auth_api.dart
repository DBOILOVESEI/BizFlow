// MODULES

// Important modules
import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';
import '../config/app_config.dart';

// Helper modules
import '../config/types/auth_status.dart';

// MAIN
class AuthApi {
  // ⚠️ If using Android emulator:
  // static const String baseUrl = "http://10.0.2.2:5000";
  static const String baseUrl = AppConfig.baseUrl;
  static const String loginUrl = AppConfig.login;
  static const String signupUrl = AppConfig.signup;
  
  static Future<AuthStatus> login(String email, String password) async {
  final response = await http.post(
    Uri.parse(loginUrl),
    headers: {'Content-Type': 'application/json'},
    body: jsonEncode({
      'email': email,
      'password': password,
    }),
  );

  // 🛡️ Ensure backend returned JSON
  if (!response.headers['content-type']!.contains('application/json')) {
    return AuthStatus(
      message: "Server error (non-JSON response)",
      errorCode: response.statusCode,
    );
  }

  final data = jsonDecode(response.body);
  final authError = authErrorFromCode(response.statusCode);
  final msg = getErrorStringMessage(authError);

  if (authError == AuthError.success) {
    final token = data['access_token'];

    if (token == null || token is! String) {
      return AuthStatus(
        message: "Invalid token from server",
        errorCode: 500,
      );
    }

    final prefs = await SharedPreferences.getInstance();
    await prefs.setString('token', token);

    // 🔐 role is OPTIONAL — only store if backend sends it
    if (data.containsKey('role') && data['role'] is String) {
      await prefs.setString('role', data['role']);
    }

    await prefs.setBool('logged_in', true);
  }

  return AuthStatus(
    message: msg,
    errorCode: response.statusCode,
  );
}


  static Future<AuthStatus> signup(String username, String email, String password, String role) async {
    final response = await http.post(
      Uri.parse(signupUrl),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({
        'username': username,
        'email': email,
        'password': password,
        'role': role,
      }),
    );
    
    final msg = getErrorStringMessage(authErrorFromCode(response.statusCode));
    return AuthStatus(
        message: msg,
        errorCode: response.statusCode,
    );
  }

  static Future<String?> getToken() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString('token');
  }
}
