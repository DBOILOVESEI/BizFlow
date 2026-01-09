// MAIN MODULES

// Required modules
import 'package:flutter/material.dart';
import '../modules/navigate.dart';
import '../api/auth_api.dart';

// Helper modules
import '../config/types/auth_status.dart';
import '../modules/error.dart';
import '../config/app_config.dart';


// CONFIG - Simplified for re-theming
String notEnoughInfoErr = "Vui lòng điền đầy đủ tất cả các trường.";
String passwordDoNotMatchErr = "Mật khẩu xác nhận không khớp.";
String signupFailedErr = "Đăng ký thất bại. Vui lòng thử lại sau.";
String signupSuccessErr = "Đăng ký thành công. Đang chuyển về màn hình đăng nhập.";

const String loginPath = AppConfig.login;

// Placeholder functions for demonstration (replace with actual logic)

Future<void> _googleSignup(BuildContext context) async {
  // In a real implementation:
  // final user = await GoogleAuthService.signIn();
  const user = null; // Mocking failure for simplicity

  if (user != null && context.mounted) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(
          'Tài khoản đã được tạo cho ${user.displayName ?? user.email}',
        ),
      ),
    );
    // TODO: Send Google user info to backend
    // TODO: Navigate to dashboard
  } else {
    showError(context, 'Đăng nhập Google thất bại hoặc bị hủy.');
  }
}

Future<void> _signup(BuildContext context, String username, String email, String password, String confirmedPassword, String role) async {
  if (username.isEmpty || email.isEmpty || password.isEmpty || confirmedPassword.isEmpty) {
    showError(context, notEnoughInfoErr);
    return;
  }
  if (password != confirmedPassword) {
    showError(context, passwordDoNotMatchErr);
    return;
  }

  final AuthStatus status = await AuthApi.signup(username, email, password, role);
  if (!context.mounted) return;

   final authError = authErrorFromCode(status.errorCode);

  if (authError != AuthError.success) {
    final msg = getErrorStringMessage(authError);
    showError(context, msg);
    return;
  }

  // Signup success
  // Return to login screen
  showError(context, signupSuccessErr);
  Navigator.pop(context);
}

// MAIN RETHEMED WIDGET
class SignupPage extends StatefulWidget {
  const SignupPage({super.key});

  @override
  State<SignupPage> createState() => _SignupPageState();
}

class _SignupPageState extends State<SignupPage> {
  final TextEditingController usernameController = TextEditingController();
  final TextEditingController emailController = TextEditingController();
  final TextEditingController passwordController = TextEditingController();
  final TextEditingController confirmPasswordController = TextEditingController();
  String selectedRole = 'Employee'; // Default value
  final List<String> roles = ['Owner', 'Employee'];

  @override
  Widget build(BuildContext context) {
    // Changing the background to light white/off-white for better business feel and contrast
    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        // Use the primary business color (blue) for the app bar
        backgroundColor: Colors.blueAccent,
        iconTheme: const IconThemeData(color: Colors.white),
        title: const Text(
          'Đăng Ký Tài Khoản BizFlow', // Vietnamese Title
          style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold),
        ),
        centerTitle: true,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(24),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            const Text(
              'Tạo tài khoản Chủ cửa hàng hoặc Nhân viên.',
              style: TextStyle(fontSize: 16, color: Colors.black54),
            ),
            const SizedBox(height: 24),
            
            /// --- Username ---
            TextField(
              controller: usernameController,
              keyboardType: TextInputType.text,
              style: const TextStyle(color: Colors.black87),
              decoration: const InputDecoration(
                labelText: 'Tên đăng nhập',
                labelStyle: TextStyle(color: Colors.blueGrey),
                border: OutlineInputBorder(),
                prefixIcon: Icon(Icons.person_outline, color: Colors.blueAccent),
              ),
            ),
            const SizedBox(height: 16),

            /// --- Email ---
            TextField(
              controller: emailController,
              keyboardType: TextInputType.emailAddress,
              style: const TextStyle(color: Colors.black87),
              decoration: const InputDecoration(
                labelText: 'Email',
                labelStyle: TextStyle(color: Colors.blueGrey),
                border: OutlineInputBorder(),
                prefixIcon: Icon(Icons.email_outlined, color: Colors.blueAccent),
              ),
            ),
            const SizedBox(height: 16),

            /// --- Password ---
            TextField(
              controller: passwordController,
              obscureText: true,
              style: const TextStyle(color: Colors.black87),
              decoration: const InputDecoration(
                labelText: 'Mật khẩu',
                labelStyle: TextStyle(color: Colors.blueGrey),
                border: OutlineInputBorder(),
                prefixIcon: Icon(Icons.lock_outline, color: Colors.blueAccent),
              ),
            ),
            const SizedBox(height: 16),

            /// --- Confirm Password ---
            TextField(
              controller: confirmPasswordController,
              obscureText: true,
              style: const TextStyle(color: Colors.black87),
              decoration: const InputDecoration(
                labelText: 'Xác nhận Mật khẩu',
                labelStyle: TextStyle(color: Colors.blueGrey),
                border: OutlineInputBorder(),
                prefixIcon: Icon(Icons.lock_reset, color: Colors.blueAccent),
              ),
            ),
            const SizedBox(height: 32),

            /// --- Role Dropdown ---
            SizedBox(
              width: double.infinity,
              height: 50, // same height as buttons
              child: DecoratedBox(
                decoration: BoxDecoration(
                  color: Colors.white, // keep it dark
                  border: Border.all(color: Colors.blueGrey), // same as buttons
                  borderRadius: BorderRadius.circular(12), // rounded corners
                ),
                child: Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 12),
                  child: DropdownButton<String>(
                    value: selectedRole,
                    dropdownColor: Colors.white,
                    style: const TextStyle(color: Colors.blueGrey),
                    isExpanded: true,
                    underline: const SizedBox(), // remove default underline
                    icon: const Icon(Icons.arrow_drop_down, color: Colors.blueGrey),
                    items: roles.map((role) {
                      return DropdownMenuItem(
                        value: role,
                        child: Text(role),
                      );
                    }).toList(),
                    onChanged: (value) {
                      if (value != null) {
                        setState(() {
                          selectedRole = value;
                        });
                      }
                    },
                  ),
                ),
              ),
            ),

            Container(
              alignment: Alignment.centerLeft,
              margin: const EdgeInsets.only(bottom: 15.0, top: 10.0),
              child: Text(
                '(Lưu ý: Bạn sẽ không thể thay đổi role sau khi chọn.)',
                style: TextStyle(
                  color: Colors.blueGrey,
                  fontSize: 16,
                  fontWeight: FontWeight.w500,
                  
                ),
              ),
            ),
            const SizedBox(height: 8),

            // -- Normal Signup Button (Primary Action) --
            SizedBox(
              width: double.infinity,
              height: 55,
              child: ElevatedButton(
                onPressed: () => _signup(
                  context,
                  usernameController.text,
                  emailController.text,
                  passwordController.text,
                  confirmPasswordController.text,
                  selectedRole,
                ),
                style: ElevatedButton.styleFrom(
                  minimumSize: const Size(double.infinity, 50), // Full width button
                    backgroundColor: Colors.blueAccent,
                    textStyle: const TextStyle(fontSize: 18),
                ),
                child: const Text(
                  'Đăng ký',
                  style: TextStyle(
                    color: Colors.white,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ),
            ),

            const SizedBox(height: 24),
            const Center(
              child: Text(
                'HOẶC', // OR in Vietnamese
                style: TextStyle(color: Colors.black54, fontWeight: FontWeight.bold),
              ),
            ),
            const SizedBox(height: 24),

            // -- Google Signup Button (Secondary Action) --
            SizedBox(
              width: double.infinity,
              height: 55,
              child: OutlinedButton.icon(
                icon: const Icon(
                  // Use the standard Google logo icon (a simplified version is used here)
                  Icons.g_mobiledata,
                  size: 30,
                  color: Colors.black54, // Keep Google icon visible on white background
                ),
                label: const Text(
                  'Đăng ký bằng Google', // Vietnamese label
                  style: TextStyle(color: Colors.black87, fontSize: 16),
                ),
                onPressed: () => _googleSignup(context),
                style: OutlinedButton.styleFrom(
                  side: const BorderSide(color: Colors.grey, width: 1.5),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(12),
                  ),
                  backgroundColor: Colors.white,
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

/*
// MAIN MODULES
import 'package:flutter/material.dart';
import 'package:flutter_application_1/modules/navigate.dart';
import '../api/google_auth_service.dart';
import '../api/auth_api.dart';

// HELPER MODULES
import '../modules/error.dart';
import '../config/auth_status.dart';

// PAGES

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

Future<void> _signup(BuildContext context, String username, String email, String password, String confirmedPassword, String role) async {
  if (username.isEmpty || email.isEmpty || password.isEmpty || confirmedPassword.isEmpty || role.isEmpty) {
    showError(context, notEnoughInfoErr);
    return;
  }
  if (password != confirmedPassword) {
    showError(context, passwordDoNotMatchErr);
    return;
  }

  final AuthStatus status = await AuthApi.signup(username, email, password, role);
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
  //navigateToPage(context, );
}

// MAIN
class SignupPage extends StatefulWidget {
  const SignupPage({super.key});

  @override
  State<SignupPage> createState() => _SignupPageState();
}

class _SignupPageState extends State<SignupPage> {
  final TextEditingController usernameController = TextEditingController();
  final TextEditingController emailController = TextEditingController();
  final TextEditingController passwordController = TextEditingController();
  final TextEditingController confirmPasswordController = TextEditingController();

  // Role dropdown
  String selectedRole = 'Employee'; // Default value
  final List<String> roles = ['Owner', 'Employee'];

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
            const SizedBox(height: 12),

            /// --- Role Dropdown ---
            Align(
              alignment: Alignment.centerLeft,
              child: Text(
                'You are signing up as: ',
                style: TextStyle(
                  color: Colors.white70,
                  fontSize: 16,
                  fontWeight: FontWeight.w500,
                ),
              ),
            ),
            const SizedBox(height: 8),

            SizedBox(
              width: double.infinity,
              height: 50, // same height as buttons
              child: DecoratedBox(
                decoration: BoxDecoration(
                  color: Colors.transparent, // keep it dark
                  border: Border.all(color: Colors.white), // same as buttons
                  borderRadius: BorderRadius.circular(12), // rounded corners
                ),
                child: Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 12),
                  child: DropdownButton<String>(
                    value: selectedRole,
                    dropdownColor: Colors.black87,
                    style: const TextStyle(color: Colors.white),
                    isExpanded: true,
                    underline: const SizedBox(), // remove default underline
                    icon: const Icon(Icons.arrow_drop_down, color: Colors.white),
                    items: roles.map((role) {
                      return DropdownMenuItem(
                        value: role,
                        child: Text(role),
                      );
                    }).toList(),
                    onChanged: (value) {
                      if (value != null) {
                        setState(() {
                          selectedRole = value;
                        });
                      }
                    },
                  ),
                ),
              ),
            ),

            Container(
              alignment: Alignment.centerLeft,
              margin: const EdgeInsets.only(bottom: 15.0, top: 10.0),
              child: Text(
                '(Warning: Your option can not be changed after creating account.)',
                style: TextStyle(
                  color: Colors.white70,
                  fontSize: 16,
                  fontWeight: FontWeight.w500,
                  
                ),
              ),
            ),
            const SizedBox(height: 8),
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
                  confirmPasswordController.text,
                  selectedRole, // Pass role to signup function
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
*/