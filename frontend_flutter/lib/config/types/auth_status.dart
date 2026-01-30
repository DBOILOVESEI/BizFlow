// SIGNUP
enum AuthError {
  success,
  unknown,

  noEmailOrPass,
  invalidRole,

  emailExists,
  invalidEmail,
  networkError,
  invalidCredentials
}

const Map<int, AuthError> authErrors = {
  200: AuthError.success,
  409: AuthError.emailExists,        // 409
  1003: AuthError.invalidCredentials, // 401
  1500: AuthError.networkError,       // DB / server
  1999: AuthError.unknown,
};

const Map<AuthError, String> errorMessages = {
  AuthError.noEmailOrPass: 'No email or password. Please fill in both fields.',
  AuthError.invalidRole: 'Invalid role.',
  AuthError.emailExists: 'Email already exists',
  AuthError.invalidEmail: 'Invalid email address',
  AuthError.networkError: 'Network error. Please try again.',
  AuthError.unknown: 'Unknown error.',
};

// GENERAL


// SIGNUP

class AuthStatus {
  final String message;
  final int errorCode;

  const AuthStatus({
    required this.message,
    required this.errorCode,
  });

  /// success helper
  bool get isSuccess => errorCode == 0;
}

// HELPERS
AuthError authErrorFromCode(int? code) {
  if (code == null || code == 0) {
    return AuthError.unknown;
  }
  return authErrors[code] ?? AuthError.unknown;
}

String getErrorStringMessage(AuthError error) {
  String? str = errorMessages[error];
  if (str == null) {
    return "Unknown error.";
  }

  return str;  
}