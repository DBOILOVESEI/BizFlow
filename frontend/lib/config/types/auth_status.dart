// SIGNUP
enum Error {
  success,
  unknown,

  noEmailOrPass,
  invalidRole,

  emailExists,
  invalidEmail,
  networkError,
  invalidCredentials
}

const Map<int, Error> authErrors = {
  200: Error.success,
  409: Error.emailExists,        // 409
  1003: Error.invalidCredentials, // 401
  1500: Error.networkError,       // DB / server
  1999: Error.unknown,
};

const Map<Error, String> errorMessages = {
  Error.noEmailOrPass: 'No email or password. Please fill in both fields.',
  Error.invalidRole: 'Invalid role.',
  Error.emailExists: 'Email already exists',
  Error.invalidEmail: 'Invalid email address',
  Error.networkError: 'Network error. Please try again.',
  Error.unknown: 'Unknown error.',
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
Error authErrorFromCode(int? code) {
  if (code == null || code == 0) {
    return Error.unknown;
  }
  return authErrors[code] ?? Error.unknown;
}

String getErrorStringMessage(Error error) {
  String? str = errorMessages[error];
  if (str == null) {
    return "Unknown error.";
  }

  return str;  
}