enum Role {
  employee,
  owner,
  admin,
  unknown,
}

Role? getRole(String? roleString) {
  if (roleString == null) return null;

  try {
    return Role.values.firstWhere(
      (r) => r.name == roleString.toLowerCase(),
    );
  } catch (_) {
    return null;
  }
}

String roleToString(Role role) {
  return role.name; // Dart enum name = string
}