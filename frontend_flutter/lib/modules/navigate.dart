import 'package:flutter/material.dart';
import '../config/roles.dart';
import './error.dart';


// COFIG
String invalidRoleErr = "Invalid role.";

final Map<Role, String> _roleRoutes = {
  Role.employee: '/employee',
  Role.owner: '/owner',
  Role.admin: '/admin',
  Role.unknown: '/login'
};

void navigateByRole(BuildContext context, Role role) {
  final route = _roleRoutes[role];

  if (route == null) {
    showError(context, invalidRoleErr);
    return;
  }

  Navigator.pushReplacementNamed(context, route);
}

void navigateToPage(BuildContext context, String route) {
  Navigator.pushReplacementNamed(context, route);
}