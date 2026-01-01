import 'package:flutter/material.dart';
import './types/roles.dart';
import './error.dart';

final Map<Role, String> _roleRoutes = {
  Role.employee: '/employee',
  Role.owner: '/owner',
  Role.admin: '/admin',
};

void navigateByRole(BuildContext context, Role role) {
  final route = _roleRoutes[role];

  if (route == null) {
    showError(context, 'Invalid role');
    return;
  }

  Navigator.pushReplacementNamed(context, route);
}
