import 'package:flutter/material.dart';

class AdminDashboard extends StatelessWidget {
  const AdminDashboard({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Administrator Dashboard'),
        backgroundColor: Colors.redAccent,
      ),
      drawer: _AdminDrawer(),
      body: Padding(
        padding: const EdgeInsets.all(24),
        child: ListView(
          children: const [
            _AdminTile(
              icon: Icons.business,
              title: 'Manage Owner Accounts',
            ),
            _AdminTile(
              icon: Icons.payments,
              title: 'Subscription Plans',
            ),
            _AdminTile(
              icon: Icons.analytics,
              title: 'Platform Analytics',
            ),
            _AdminTile(
              icon: Icons.settings,
              title: 'System Configuration',
            ),
          ],
        ),
      ),
    );
  }
}

class _AdminDrawer extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Drawer(
      child: ListView(
        children: const [
          DrawerHeader(
            decoration: BoxDecoration(color: Colors.redAccent),
            child: Text('Admin Panel',
                style: TextStyle(fontSize: 20, color: Colors.white)),
          ),
          ListTile(leading: Icon(Icons.dashboard), title: Text('Dashboard')),
          ListTile(leading: Icon(Icons.logout), title: Text('Logout')),
        ],
      ),
    );
  }
}

class _AdminTile extends StatelessWidget {
  final IconData icon;
  final String title;

  const _AdminTile({required this.icon, required this.title});

  @override
  Widget build(BuildContext context) {
    return Card(
      elevation: 2,
      margin: const EdgeInsets.only(bottom: 16),
      child: ListTile(
        leading: Icon(icon),
        title: Text(title),
        trailing: const Icon(Icons.arrow_forward_ios, size: 16),
      ),
    );
  }
}
