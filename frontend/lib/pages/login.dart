// MODULES

// Required modules
import 'package:shared_preferences/shared_preferences.dart';
import 'package:flutter/material.dart';
import '../../modules/navigate.dart';

// Important modules
import '../api/auth_api.dart';

// Helper modules
import "../../modules/error.dart";
import "../../modules/types/roles.dart";

// VARS
const String noEmailOrPass = "Invalid email or password.";
const String invalidLoginInfo = "Invalid credentials";
const String noValidRole = "Role not found.";

// FUNCTIONS
Future<bool> canLogin(BuildContext context, String emailOrUser, String password) async {
  if (emailOrUser.isEmpty || password.isEmpty) {
    showError(context, noEmailOrPass);
    return false;
  }

  // Send signal to server
  final bool success = await AuthApi.login(emailOrUser, password);
  if (!context.mounted) return false;
  if (!success) showError(context, invalidLoginInfo);

  return true;
}

// MAIN
class LoginPage extends StatelessWidget {
  // Key makes the widget reusable, always use it.
  LoginPage({super.key});

  final TextEditingController emailController = TextEditingController();
  final TextEditingController passwordController = TextEditingController();  

  Future<void> _login(BuildContext context) async {
    final String emailOrUser = emailController.text.trim();
    final String password = passwordController.text;
    final loginValid = await canLogin(context, emailOrUser, password);

    if (loginValid) {
      final prefs = await SharedPreferences.getInstance();
      final roleString = prefs.getString("role");
      final role = getRole(roleString);
      if (role == null) {
        showError(context, noValidRole);
        return;
      }

      navigateByRole(context, role);
    }
  }

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
                onPressed: () => _login(context),
                child: const Text('Sign In'),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
