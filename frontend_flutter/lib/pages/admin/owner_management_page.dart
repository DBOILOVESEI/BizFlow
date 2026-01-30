import 'package:flutter/material.dart';

class OwnerManagementPage extends StatelessWidget {
  const OwnerManagementPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Owner Management'),
        backgroundColor: Colors.redAccent,
      ),
      body: ListView.builder(
        padding: const EdgeInsets.all(16),
        itemCount: 5,
        itemBuilder: (context, index) {
          return Card(
            margin: const EdgeInsets.only(bottom: 12),
            child: ListTile(
              leading: const Icon(Icons.store),
              title: Text('Household Business #$index'),
              subtitle: const Text('Status: Active'),
              trailing: Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  IconButton(
                    icon: const Icon(Icons.visibility),
                    onPressed: () {
                      // TODO: View owner detail
                    },
                  ),
                  Switch(
                    value: true,
                    onChanged: (value) {
                      // TODO: Activate / Deactivate owner
                    },
                  ),
                ],
              ),
            ),
          );
        },
      ),
    );
  }
}
