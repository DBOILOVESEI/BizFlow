import 'package:flutter/material.dart';
import '../../utils/logout.dart';
class OwnerDashboard extends StatelessWidget {
  const OwnerDashboard({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Owner Dashboard'),
        backgroundColor: Colors.green,
      ),
      drawer: _OwnerDrawer(),
      body: Padding(
        padding: const EdgeInsets.all(24),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text('Overview',
                style: TextStyle(fontSize: 22, fontWeight: FontWeight.bold)),
            const SizedBox(height: 16),
            Row(
              children: const [
                _StatCard(title: 'Today Revenue', value: '12,500,000 ₫'),
                _StatCard(title: 'Outstanding Debt', value: '3,200,000 ₫'),
                _StatCard(title: 'Low Stock Items', value: '5'),
              ],
            ),
          ],
        ),
      ),
    );
  }
}

class _OwnerDrawer extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Drawer(
      child: ListView(
        children: [
          const DrawerHeader(
            decoration: BoxDecoration(color: Colors.green),
            child: Text(
              'Owner Menu',
              style: TextStyle(fontSize: 20, color: Colors.white),
            ),
          ),
          const ListTile(leading: Icon(Icons.inventory), title: Text('Products')),
          const ListTile(leading: Icon(Icons.store), title: Text('Inventory')),
          const ListTile(leading: Icon(Icons.people), title: Text('Customers')),
          const ListTile(leading: Icon(Icons.bar_chart), title: Text('Reports')),
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


class _StatCard extends StatelessWidget {
  final String title;
  final String value;

  const _StatCard({required this.title, required this.value});

  @override
  Widget build(BuildContext context) {
    return Expanded(
      child: Card(
        margin: const EdgeInsets.only(right: 16),
        elevation: 3,
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Column(
            children: [
              Text(title,
                  style: const TextStyle(color: Colors.grey, fontSize: 14)),
              const SizedBox(height: 8),
              Text(value,
                  style: const TextStyle(
                      fontSize: 18, fontWeight: FontWeight.bold)),
            ],
          ),
        ),
      ),
    );
  }
}
