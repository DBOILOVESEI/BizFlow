import 'package:flutter/material.dart';

class SystemConfigPage extends StatelessWidget {
  const SystemConfigPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('System Configuration'),
        backgroundColor: Colors.redAccent,
      ),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          SwitchListTile(
            title: const Text('Enable AI Draft Orders'),
            value: true,
            onChanged: (value) {
              // TODO: Enable / disable AI
            },
          ),
          SwitchListTile(
            title: const Text('Auto Accounting (Circular 88)'),
            value: true,
            onChanged: (value) {
              // TODO: Toggle accounting automation
            },
          ),
          ListTile(
            leading: const Icon(Icons.description),
            title: const Text('Update Accounting Templates'),
            trailing: const Icon(Icons.arrow_forward_ios, size: 16),
            onTap: () {
              // TODO: Upload/update templates
            },
          ),
          ListTile(
            leading: const Icon(Icons.announcement),
            title: const Text('Broadcast Announcement'),
            trailing: const Icon(Icons.arrow_forward_ios, size: 16),
            onTap: () {
              // TODO: System-wide announcement
            },
          ),
        ],
      ),
    );
  }
}
