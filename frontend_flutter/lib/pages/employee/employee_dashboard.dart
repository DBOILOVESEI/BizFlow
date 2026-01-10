import 'package:flutter/material.dart';
import '../../utils/logout.dart';
class EmployeeDashboard extends StatelessWidget {
  const EmployeeDashboard({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Employee Dashboard'),
        backgroundColor: Colors.indigo,
      ),
      drawer: _EmployeeDrawer(),
      body: Padding(
        padding: const EdgeInsets.all(24),
        child: GridView.count(
          crossAxisCount: 3,
          crossAxisSpacing: 16,
          mainAxisSpacing: 16,
          children: const [
            _DashboardCard(
              title: 'Create Order',
              icon: Icons.point_of_sale,
            ),
            _DashboardCard(
              title: 'Draft Orders (AI)',
              icon: Icons.smart_toy,
            ),
            _DashboardCard(
              title: 'Print Orders',
              icon: Icons.print,
            ),
            _DashboardCard(
              title: 'Customer Debt',
              icon: Icons.warning_amber,
            ),
          ],
        ),
      ),
    );
  }
}

class _EmployeeDrawer extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Drawer(
      child: ListView(
        children: [
          const DrawerHeader(
            decoration: BoxDecoration(color: Colors.indigo),
            child: Text(
              'Employee Menu',
              style: TextStyle(fontSize: 20, color: Colors.white),
            ),
          ),
          const ListTile(
            leading: Icon(Icons.add),
            title: Text('Create Order'),
          ),
          const ListTile(
            leading: Icon(Icons.list),
            title: Text('Orders'),
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

class _DashboardCard extends StatelessWidget {
  final String title;
  final IconData icon;

  const _DashboardCard({required this.title, required this.icon});

  @override
  Widget build(BuildContext context) {
    return Card(
      elevation: 4,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      child: Center(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(icon, size: 48, color: Colors.indigo),
            const SizedBox(height: 12),
            Text(title, style: const TextStyle(fontSize: 16)),
          ],
        ),
      ),
    );
  }
}
