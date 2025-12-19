import 'package:flutter/material.dart';
import '../api/google_auth_service.dart';

class LoginPage extends StatelessWidget {
  const LoginPage({super.key});

  Future<void> _googleLogin(BuildContext context) async {
    final user = await GoogleAuthService.signIn();

    if (user != null && context.mounted) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Logged in as ${user.email}')),
      );
      // TODO: Send user.id / email to backend
      // TODO: Navigate to dashboard
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color.fromARGB(255, 18, 18, 21),
      appBar: AppBar(
        backgroundColor: Colors.black87,
        iconTheme: const IconThemeData(
          color: Colors.white
        ),
        title: const Text(
          'Sign In',
          style: TextStyle(
            color: Colors.white
          )
          )
        ),
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: [
            TextField(
              style: TextStyle(
                color: Colors.white,
              ),
              decoration: const InputDecoration(
                labelText: 'Email',
                labelStyle: TextStyle(
                  color: Colors.white70, // label color
                ),
                ),
            ),
            const SizedBox(height: 12),
            TextField(
              obscureText: true,

              style: TextStyle(
                color: Colors.white,
              ),
              decoration: const InputDecoration(
                labelText: 'Password',
                labelStyle: TextStyle(
                  color: Colors.white70
                )
                ),
            ),
            const SizedBox(height: 24),

            // -- Normal Login -- //
            SizedBox(
              width: double.infinity,
              height: 50,
              child: ElevatedButton(
                onPressed: () {
                  // TODO: normal login API
                },
                style: ElevatedButton.styleFrom(
                        backgroundColor: Colors.white,
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(12),
                        ),
                        elevation: 0
                      ),
                child: const Text(
                  'Sign In',
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
              style: TextStyle(
                color: Colors.white,
              ),
              ),
            const SizedBox(height: 16),

            // -- Google Login -- //
            SizedBox(
              width: double.infinity,
              height: 50,
              child: OutlinedButton.icon(
                icon: const Icon(Icons.g_mobiledata, size: 28, color: Colors.white),
                label: const Text(
                'Continue with Google',
                style: TextStyle(
                  color: Colors.white
                ),
                ),
                onPressed: () => _googleLogin(context),

                style: OutlinedButton.styleFrom(
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(12)
                        )
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
