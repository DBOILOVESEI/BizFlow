import 'package:flutter/material.dart';
import 'package:flutter_application_1/pages/signup.dart';
import 'package:flutter_application_1/pages/title.dart';
import 'package:flutter_application_1/pages/login.dart';

// Dashboards
/*
import 'package:flutter_application_1/pages/employee/employee_dashboard.dart';
import 'package:flutter_application_1/pages/owner/owner_dashboard.dart';
import 'package:flutter_application_1/pages/admin/admin_dashboard.dart';
*/
void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        fontFamily: 'Arimo Nerd Font Propo',
      ),

      home: const TitlePage(),

      routes: {
        '/login': (context) => LoginPage(),
        '/signup': (context) => SignupPage()

        /*
        '/employee': (context) => const EmployeeDashboard(),
        '/owner': (context) => const OwnerDashboard(),
        '/admin': (context) => const AdminDashboard(),
        */
      },
    );
  }
}
