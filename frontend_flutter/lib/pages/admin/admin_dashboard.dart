// MODULES

// Base modules
import 'package:flutter/material.dart';
//import '../../modules/navigate.dart';

// Essential modules
import 'package:shared_preferences/shared_preferences.dart';
import 'dart:convert';
import 'package:http/http.dart' as http;

// Helper modules
import '../../modules/error.dart';
import 'owner_management_page.dart';
import 'subscription_page.dart';
import 'platform_analytics_page.dart';
import 'system_config_page.dart';
import '../../utils/logout.dart';

// CONFIG
String tokenInvalidErr = "Session invalid. Please login again.";

// MAIN
Future<bool> adminTokenValid() async {
  final prefs = await SharedPreferences.getInstance();
  final token = prefs.getString('token');
  final role = prefs.getString('role');

  if (token == null) return false;
  final response = await http.post(
      Uri.parse('http://127.0.0.1:5000/admin'),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer $token',
      },
      body: jsonEncode(
        {
          "action": "do_something",
          "role": role
        }
      ),
    );

  if (response.statusCode == 200) {
    return true;
  }

  return false;
}


class AdminDashboard extends StatelessWidget {
  const AdminDashboard({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Administrator Dashboard'),
        backgroundColor: Colors.redAccent,
      ),
      drawer: const _AdminDrawer(),
      body: Padding(
        padding: const EdgeInsets.all(24),
        child: ListView(
          children: [
            _AdminTile(
              icon: Icons.business,
              title: 'Manage Owner Accounts',
              onTap: () async {
                final bool valid = await adminTokenValid();
                if (!context.mounted) return;
                
                if (!valid) {
                  showError(context, tokenInvalidErr);
                  //navigateToLogin(context);
                }

                Navigator.push(
                  context,
                  MaterialPageRoute(
                    builder: (_) => const OwnerManagementPage(),
                  ),
                );
              },
            ),
            _AdminTile(
              icon: Icons.payments,
              title: 'Subscription Plans',
              onTap: () {
                Navigator.push(
                  context,
                  MaterialPageRoute(
                    builder: (_) => const SubscriptionPage(),
                  ),
                );
              },
            ),
            _AdminTile(
              icon: Icons.analytics,
              title: 'Platform Analytics',
              onTap: () {
                Navigator.push(
                  context,
                  MaterialPageRoute(
                    builder: (_) => const PlatformAnalyticsPage(),
                  ),
                );
              },
            ),
            _AdminTile(
              icon: Icons.settings,
              title: 'System Configuration',
              onTap: () {
                Navigator.push(
                  context,
                  MaterialPageRoute(
                    builder: (_) => const SystemConfigPage(),
                  ),
                );
              },
            ),
          ],
        ),
      ),
    );
  }
}

/* ---------------- DRAWER ---------------- */

class _AdminDrawer extends StatelessWidget {
  const _AdminDrawer();

  @override
  Widget build(BuildContext context) {
    return Drawer(
      child: ListView(
        children: [
          const DrawerHeader(
            decoration: BoxDecoration(color: Colors.redAccent),
            child: Text(
              'Admin Panel',
              style: TextStyle(fontSize: 20, color: Colors.white),
            ),
          ),
          ListTile(
            leading: const Icon(Icons.dashboard),
            title: const Text('Dashboard'),
            onTap: () => Navigator.pop(context),
          ),
          ListTile(
            leading: const Icon(Icons.logout),
            title: const Text('Logout'),
            onTap: () => logout(context), // ✅
          ),
        ],
      ),
    );
  }
}


/* ---------------- TILE ---------------- */

class _AdminTile extends StatelessWidget {
  final IconData icon;
  final String title;
  final VoidCallback onTap;

  const _AdminTile({
    required this.icon,
    required this.title,
    required this.onTap,
    super.key,
  });

  @override
  Widget build(BuildContext context) {
    return Card(
      elevation: 2,
      margin: const EdgeInsets.only(bottom: 16),
      child: ListTile(
        leading: Icon(icon),
        title: Text(title),
        trailing: const Icon(Icons.arrow_forward_ios, size: 16),
        onTap: onTap,
      ),
    );
  }
}
