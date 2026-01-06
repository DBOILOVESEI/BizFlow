// MODULES

// Required modules
import 'package:shared_preferences/shared_preferences.dart';
import 'package:flutter/material.dart';
import '../../modules/navigate.dart';

// Important modules
import '../api/auth_api.dart';

// Helper modules
import "../../modules/error.dart";
import "../config/types/roles.dart";
import '../config/types/auth_status.dart';

// VARS
String noEmailOrPassErr = getErrorStringMessage(Error.noEmailOrPass);
String invalidRollErr = getErrorStringMessage(Error.invalidRole);

// FUNCTIONS
Future<bool> canLogin(BuildContext context, String email, String password) async {
  if (email.isEmpty || password.isEmpty) {
    showError(context, noEmailOrPassErr);
    return false;
  }

  // Send signal to server
  final AuthStatus status = await AuthApi.login(email, password);
  if (!context.mounted) return false;

  final authError = authErrorFromCode(status.errorCode);

  if (authError != Error.success) {
    final msg = getErrorStringMessage(authError);
    showError(context, msg);
    return false;
  }
  return true;
}

Future<void> _login(BuildContext context, String email, String password) async {
    final loginValid = await canLogin(context, email, password);

    if (loginValid) {
      final prefs = await SharedPreferences.getInstance();
      if (!context.mounted) return;
      
      final roleString = prefs.getString("role");
      final role = getRole(roleString);
      if (role == null) {
        showError(context, invalidRoleErr);
        return;
      }

      navigateByRole(context, role);
    }
  }

// MAIN
class LoginPage extends StatelessWidget {
  // Key makes the widget reusable, always use it.
  LoginPage({super.key});

  final TextEditingController emailController = TextEditingController();
  final TextEditingController passwordController = TextEditingController();  

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color.fromARGB(255, 18, 18, 21),
      appBar: AppBar(
        backgroundColor: Colors.black87,
        title: const Text('Sign In'),
      ),
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: [
            TextField(
              controller: emailController,
              style: const TextStyle(color: Colors.white),
              decoration: const InputDecoration(
                labelText: 'Email',
                labelStyle: TextStyle(color: Colors.white70),
              ),
            ),
            const SizedBox(height: 12),
            TextField(
              controller: passwordController,
              obscureText: true,
              style: const TextStyle(color: Colors.white),
              decoration: const InputDecoration(
                labelText: 'Password',
                labelStyle: TextStyle(color: Colors.white70),
              ),
            ),
            const SizedBox(height: 24),
            SizedBox(
              width: double.infinity,
              height: 50,
              child: ElevatedButton(
                onPressed: () => _login(
                  context,
                  emailController.text.trim(),
                  passwordController.text,
                ),
                child: const Text('Sign In'),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
