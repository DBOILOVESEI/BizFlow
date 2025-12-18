import 'package:flutter_application_1/core/network/api_client.dart';
import 'package:flutter_application_1/core/constants/api_constants.dart';
import 'package:flutter_application_1/features/auth/auth_model.dart';

class AuthService {
  Future<AuthModel> login(String email, String password) async {
    final response = await ApiClient.post(
      ApiConstants.login,
      {
        'email': email,
        'password': password,
      },
    );

    return AuthModel.fromJson(response);
  }
}
