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
  
  static Future<AuthStatus> login(String username, String password) async {
    final response = await http.post(
      Uri.parse(loginUrl),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({
        'username': username,
        'password': password,
      }),
    );

    final data = jsonDecode(response.body);
    final authError = authErrorFromCode(response.statusCode);
    final msg = getErrorStringMessage(authError);
    
    if (authError == Error.success) {
      final prefs = await SharedPreferences.getInstance();
      await prefs.setString('token', data['access_token']);
      await prefs.setString('role', data['role']);
      await prefs.setBool('logged_in', true);
    }
    
    return AuthStatus(
        message: msg,
        errorCode: response.statusCode,
    );
  }

  static Future<AuthStatus> signup(String username, String email, String password) async {
    final response = await http.post(
      Uri.parse(signupUrl),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({
        'username': username,
        'email': email,
        'password': password,
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
