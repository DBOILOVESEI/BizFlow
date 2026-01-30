// MODULES

// Required modules
import 'package:flutter/material.dart';
import '../api/auth_api.dart';

// Helper modules
import '../config/types/auth_status.dart';
import '../modules/error.dart';

// Errors
const String noEmailOrPassErr = "Please fill in all the required fields.";

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

  if (authError != AuthError.success) {
    final msg = getErrorStringMessage(authError);
    showError(context, msg);
    return false;
  }
  return true;
}

/*
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
*/
// MAIN
class LoginPage extends StatelessWidget {
  // Key makes the widget reusable, always use it.
  LoginPage({super.key});

  final TextEditingController emailController = TextEditingController();
  final TextEditingController passwordController = TextEditingController();  

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text(
          'Đăng nhập BizFlow',
          style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold),
          ),
        centerTitle: true,
        backgroundColor: Colors.blueAccent,
        iconTheme: const IconThemeData(color: Colors.white),
      ),
      body: SafeArea(
        child: SingleChildScrollView( // Allows scrolling if keyboard is active
          padding: const EdgeInsets.all(32.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: <Widget>[
              // Visual space and context
              const Icon(Icons.lock_outline, size: 80, color: Colors.blueAccent),
              const SizedBox(height: 20),
              
              // --- Input Fields ---
              
              // 1. Phone Number / Email Input
              TextField(
                keyboardType: TextInputType.emailAddress,
                controller: emailController,
                decoration: InputDecoration(
                  labelText: 'Email',
                  hintText: 'Nhập email đã đăng ký',
                  border: OutlineInputBorder(),
                  prefixIcon: Icon(Icons.person_outline),
                ),
              ),
              const SizedBox(height: 20),

              // 2. Password Input
              TextField(
                controller: passwordController,
                obscureText: true, // Hides input for security
                decoration: InputDecoration(
                  labelText: 'Mật khẩu',
                  hintText: 'Nhập mật khẩu của bạn',
                  border: OutlineInputBorder(),
                  prefixIcon: Icon(Icons.lock),
                ),
              ),
              const SizedBox(height: 10),

              // --- Action Links ---

              // Forgot Password Link
              Align(
                alignment: Alignment.centerRight,
                child: TextButton(
                  onPressed: () {
                    // Navigate to Forgot Password Screen
                    print('Navigating to Forgot Password...'); 
                  },
                  child: const Text(
                    'Quên mật khẩu?',
                    style: TextStyle(color: Colors.blue),
                  ),
                ),
              ),
              const SizedBox(height: 30),

              // --- Primary Action Button ---

              ElevatedButton(
                onPressed: () {
                  // Perform authentication logic
                  // On success: Navigate to Dashboard (Employee or Owner)
                  print('Attempting to Log In...');
                },
                style: ElevatedButton.styleFrom(
                  minimumSize: const Size(double.infinity, 55),
                  backgroundColor: Colors.blueAccent,
                  textStyle: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                ),
                child: const Text('Đăng nhập', style: TextStyle(color: Colors.white)),
              ),
              const SizedBox(height: 40),

              // --- Secondary Navigation ---
              
              Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  const Text('Chưa có tài khoản?'),
                  TextButton(
                    onPressed: () {
                      // Navigate to the Sign Up Screen
                      Navigator.pop(context); // Go back to Welcome/Home if applicable
                      // OR: Navigator.pushReplacement(context, MaterialPageRoute(builder: (context) => SignUpScreen()));
                      print('Navigating to Sign Up Screen...');
                    },
                    child: const Text(
                      'Đăng ký ngay',
                      style: TextStyle(fontWeight: FontWeight.bold),
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

/*
// MODULES

// Required modules
import 'package:shared_preferences/shared_preferences.dart';
import 'package:flutter/material.dart';
import '../../modules/navigate.dart';

// Important modules
import '../api/auth_api.dart';

// Helper modules
import "../../modules/error.dart";
import "../config/roles.dart";
import '../config/auth_status.dart';

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
      appBar: AppBar(
        title: const Text('Đăng nhập BizFlow'),
        centerTitle: true,
      ),
      body: SafeArea(
        child: SingleChildScrollView( // Allows scrolling if keyboard is active
          padding: const EdgeInsets.all(32.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: <Widget>[
              // Visual space and context
              const Icon(Icons.lock_outline, size: 80, color: Colors.blueAccent),
              const SizedBox(height: 20),
              
              // --- Input Fields ---
              
              // 1. Phone Number / Email Input
              const TextField(
                keyboardType: TextInputType.emailAddress,
                decoration: InputDecoration(
                  labelText: 'Email hoặc Số điện thoại',
                  hintText: 'Nhập email hoặc SĐT đã đăng ký',
                  border: OutlineInputBorder(),
                  prefixIcon: Icon(Icons.person_outline),
                ),
              ),
              const SizedBox(height: 20),

              // 2. Password Input
              const TextField(
                obscureText: true, // Hides input for security
                decoration: InputDecoration(
                  labelText: 'Mật khẩu',
                  hintText: 'Nhập mật khẩu của bạn',
                  border: OutlineInputBorder(),
                  prefixIcon: Icon(Icons.lock),
                ),
              ),
              const SizedBox(height: 10),

              // --- Action Links ---

              // Forgot Password Link
              Align(
                alignment: Alignment.centerRight,
                child: TextButton(
                  onPressed: () {
                    // Navigate to Forgot Password Screen
                    print('Navigating to Forgot Password...'); 
                  },
                  child: const Text(
                    'Quên mật khẩu?',
                    style: TextStyle(color: Colors.blue),
                  ),
                ),
              ),
              const SizedBox(height: 30),

              // --- Primary Action Button ---

              ElevatedButton(
                onPressed: () {
                  // Perform authentication logic
                  // On success: Navigate to Dashboard (Employee or Owner)
                  print('Attempting to Log In...');
                },
                style: ElevatedButton.styleFrom(
                  minimumSize: const Size(double.infinity, 55),
                  backgroundColor: Colors.blueAccent,
                  textStyle: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                ),
                child: const Text('Đăng nhập', style: TextStyle(color: Colors.white)),
              ),
              const SizedBox(height: 40),

              // --- Secondary Navigation ---
              
              Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  const Text('Chưa có tài khoản?'),
                  TextButton(
                    onPressed: () {
                      // Navigate to the Sign Up Screen
                      Navigator.pop(context); // Go back to Welcome/Home if applicable
                      // OR: Navigator.pushReplacement(context, MaterialPageRoute(builder: (context) => SignUpScreen()));
                      print('Navigating to Sign Up Screen...');
                    },
                    child: const Text(
                      'Đăng ký ngay',
                      style: TextStyle(fontWeight: FontWeight.bold),
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