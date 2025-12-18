import 'package:flutter/material.dart';
import '../features/auth/login_page.dart';

class AppRoutes {
  static const String login = '/login';

  static Map<String, WidgetBuilder> routes = {
    login: (context) => const LoginPage(),
  };
}
