// Mockup of the Flutter structure
import 'package:flutter/material.dart';
import '../modules/navigate.dart';
import '../config/app_config.dart';

// PAGES
import 'login.dart';
import 'signup.dart';

// ROUTES
const String loginPath = AppConfig.login;
const String signupPath = AppConfig.signup;

// MAIN
class TitlePage extends StatelessWidget {
  const TitlePage({super.key});

  @override
  Widget build(BuildContext context) {
    // Scaffold provides the basic structure for the screen
    return Scaffold(
      body: SafeArea( // Ensures content avoids notches/status bar
        child: Padding(
          padding: const EdgeInsets.all(32.0),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children:
              <Widget>[
              // --- 1. Header/Logo ---
                const Flexible(
                  flex: 1,
                  child: Center(
                    child: Text(
                      'BizFlow',
                      style: TextStyle(
                        fontSize: 48,
                        fontWeight: FontWeight.bold,
                        color: Colors.blueAccent, // Example theme color
                      ),
                    ),
                  ),
                  ),
              logo(),
              const Text(
                      'Nền tảng chuyển đổi số cho hộ kinh doanh Việt Nam',
                      textAlign: TextAlign.center,
                      style: TextStyle(
                        fontSize: 24,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
              // --- 2. Title or catchphrase idk ---
              Flexible(
                flex: 3,
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  crossAxisAlignment: CrossAxisAlignment.start,
                ),
              ),
              
              const SizedBox(height: 40),

              // --- 3. Action Buttons ---
              Column(
                children: <Widget>[
                  // Login Button (Primary Action)
                  ElevatedButton(
                    onPressed: () {
                      Navigator.push(
                        context,
                        MaterialPageRoute(
                          builder: (context) => LoginPage(),
                        ),
                      );
                    },
                    style: ElevatedButton.styleFrom(
                      minimumSize: const Size(double.infinity, 50), // Full width button
                      backgroundColor: Colors.blueAccent,
                      textStyle: const TextStyle(fontSize: 18),
                    ),
                    child: const Text('Đăng nhập', style: TextStyle(color: Colors.white)),
                  ),
                  const SizedBox(height: 15),

                  // Sign Up Button (Secondary Action)
                  OutlinedButton(
                    onPressed: () {
                      Navigator.push(
                        context,
                        MaterialPageRoute(
                          builder: (context) => SignupPage(),
                        ),
                      );
                    },
                    style: OutlinedButton.styleFrom(
                      minimumSize: const Size(double.infinity, 50),
                      side: const BorderSide(color: Colors.blueAccent),
                      textStyle: const TextStyle(fontSize: 18),
                    ),
                    child: const Text('Đăng ký tài khoản mới', style: TextStyle(color: Colors.blueAccent)),
                  ),
                ],
              ),
              
              // --- 4. Footer ---
              const Padding(
                padding: EdgeInsets.only(top: 20.0),
                child: Text(
                  'Bản quyền thuộc về BizFlow 2026',
                  textAlign: TextAlign.center,
                  style: TextStyle(color: Colors.grey),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  // Helper widget for clear benefit listing
  Widget logo() {
    return Center(
      child: Image.asset(
        'assets/images/logo.png',
        width: 150,
      )
    );
  }
}

/*
import 'package:flutter/material.dart';

// PAGES
import 'login.dart';
import 'signup.dart';

class TitlePage extends StatelessWidget {
  const TitlePage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color.fromARGB(255, 18, 18, 21),
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(24.0),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              // Logo / App name
              Column(
                children: const [
                  SizedBox(height: 80),
                  Icon(
                    Icons.business_center,
                    size: 96,
                    color: Colors.white,
                  ),
                  SizedBox(height: 16),
                  Text(
                    'FlowBiz',
                    style: TextStyle(
                      color: Colors.white,
                      fontSize: 36,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  SizedBox(height: 8),
                  Text(
                    'Manage your business simply',
                    style: TextStyle(
                      color: Colors.white70,
                      fontSize: 16,
                    ),
                  ),
                ],
              ),

              // Buttons
              Column(
                children: [
                  // -- SIGN UP --
                  SizedBox(
                    width: double.infinity,
                    height: 50,
                    child: ElevatedButton(
                      onPressed: () {
                        Navigator.push(
                          context,
                          MaterialPageRoute(
                            builder: (context) => SignupPage(),
                          ),
                        );
                      },
                      style: ElevatedButton.styleFrom(
                        backgroundColor: Colors.white,
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(12),
                        ),
                        elevation: 0,
                      ),
                      child: const Text(
                        'Create Account',
                        style: TextStyle(
                          color: Colors.black,
                          fontSize: 16,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ),
                  ),

                  const SizedBox(height: 12),

                  // -- SIGN IN --
                  SizedBox(
                    width: double.infinity,
                    height: 50,
                    child: OutlinedButton(
                      onPressed: () {
                        Navigator.push(
                          context,
                          MaterialPageRoute(
                            builder: (context) => LoginPage(),
                          ),
                        );
                      },
                      style: OutlinedButton.styleFrom(
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(12),
                        ),
                      ),
                      child: const Text(
                        'Sign In',
                        style: TextStyle(
                          color: Colors.white,
                          fontSize: 16,
                        ),
                      ),
                    ),
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }
}
*/