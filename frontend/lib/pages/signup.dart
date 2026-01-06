// MAIN MODULES
import 'package:flutter/material.dart';
import 'package:flutter_application_1/modules/navigate.dart';
import '../api/google_auth_service.dart';
import '../api/auth_api.dart';

// HELPER MODULES
import '../modules/error.dart';
import '../config/types/auth_status.dart';

// CONFIG
String notEnoughInfoErr = "Missing fields detected. Please fill in all the empty fields.";
String passwordDoNotMatchErr = "Passwords do not match.";
String signupFailedErr = "Sign up failed. Please try again later.";
String signupSuccessErr = "Sign up success. Redirecting back to login screen.";

// FUNCTIONS
Future<void> _googleSignup(BuildContext context) async {
  final user = await GoogleAuthService.signIn();

  if (user != null && context.mounted) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(
          'Account created for ${user.displayName ?? user.email}',
        ),
      ),
    );
    // TODO: Send Google user info to backend
    // TODO: Navigate to dashboard
  }
}

Future<void> _signup(BuildContext context, String username, String email, String password, String confirmedPassword) async {
  if (username.isEmpty || email.isEmpty || password.isEmpty || confirmedPassword.isEmpty) {
    showError(context, notEnoughInfoErr);
    return;
  }
  if (password != confirmedPassword) {
    showError(context, passwordDoNotMatchErr);
    return;
  }

  final AuthStatus status = await AuthApi.signup(username, email, password);
  if (!context.mounted) return;

   final authError = authErrorFromCode(status.errorCode);

  if (authError != Error.success) {
    final msg = getErrorStringMessage(authError);
    showError(context, msg);
    return;
  }

  // Signup success
  // Return to login screen
  showError(context, signupSuccessErr);
  navigateToLogin(context);
}

// MAIN
class SignupPage extends StatelessWidget {
  SignupPage({super.key});

  final TextEditingController usernameController = TextEditingController();
  final TextEditingController emailController = TextEditingController();
  final TextEditingController passwordController = TextEditingController();
  final TextEditingController confirmPasswordController = TextEditingController();

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color.fromARGB(255, 18, 18, 21),
      appBar: AppBar(
        backgroundColor: Colors.black87,
        iconTheme: const IconThemeData(color: Colors.white),
        title: const Text(
          'Create Account',
          style: TextStyle(color: Colors.white),
        ),
      ),
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: [
            /// --- Username ---
            TextField(
              controller: usernameController,
              style: const TextStyle(color: Colors.white),
              decoration: const InputDecoration(
                labelText: 'Username',
                labelStyle: TextStyle(color: Colors.white70),
              ),
            ),
            const SizedBox(height: 12),

            /// --- Email ---
            TextField(
              controller: emailController,
              style: const TextStyle(color: Colors.white),
              decoration: const InputDecoration(
                labelText: 'Email',
                labelStyle: TextStyle(color: Colors.white70),
              ),
            ),
            const SizedBox(height: 12),

            /// --- Password ---
            TextField(
              controller: passwordController,
              obscureText: true,
              style: const TextStyle(color: Colors.white),
              decoration: const InputDecoration(
                labelText: 'Password',
                labelStyle: TextStyle(color: Colors.white70),
              ),
            ),
            const SizedBox(height: 12),

            /// --- Confirm Password ---
            TextField(
              controller: confirmPasswordController,
              obscureText: true,
              style: const TextStyle(color: Colors.white),
              decoration: const InputDecoration(
                labelText: 'Confirm Password',
                labelStyle: TextStyle(color: Colors.white70),
              ),
            ),
            const SizedBox(height: 24),

            // -- Normal Signup --
            SizedBox(
              width: double.infinity,
              height: 50,
              child: ElevatedButton(
                onPressed: () => _signup(
                  context,
                  usernameController.text,
                  emailController.text,
                  passwordController.text,
                  confirmPasswordController.text
                ),
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.white,
                  elevation: 0,
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(12),
                  ),
                ),
                child: const Text(
                  'Create Account',
                  style: TextStyle(
                    color: Colors.black,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ),
            ),

            const SizedBox(height: 16),
            const Text(
              'OR',
              style: TextStyle(color: Colors.white),
            ),
            const SizedBox(height: 16),

            // -- Google Signup --
            SizedBox(
              width: double.infinity,
              height: 50,
              child: OutlinedButton.icon(
                icon: const Icon(
                  Icons.g_mobiledata,
                  size: 28,
                  color: Colors.white,
                ),
                label: const Text(
                  'Sign up with Google',
                  style: TextStyle(color: Colors.white),
                ),
                onPressed: () => _googleSignup(context),
                style: OutlinedButton.styleFrom(
                  side: const BorderSide(color: Colors.white),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(12),
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
