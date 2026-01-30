import 'package:flutter/material.dart';

class SubscriptionPage extends StatelessWidget {
  const SubscriptionPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Subscription Plans'),
        backgroundColor: Colors.redAccent,
      ),
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: [
            _PlanCard(
              plan: 'Basic',
              price: '99,000 VND / month',
            ),
            _PlanCard(
              plan: 'Pro',
              price: '199,000 VND / month',
            ),
          ],
        ),
      ),
      floatingActionButton: FloatingActionButton(
        backgroundColor: Colors.redAccent,
        onPressed: () {
          // TODO: Add new subscription plan
        },
        child: const Icon(Icons.add),
      ),
    );
  }
}

class _PlanCard extends StatelessWidget {
  final String plan;
  final String price;

  const _PlanCard({required this.plan, required this.price});

  @override
  Widget build(BuildContext context) {
    return Card(
      margin: const EdgeInsets.only(bottom: 16),
      child: ListTile(
        title: Text(plan),
        subtitle: Text(price),
        trailing: IconButton(
          icon: const Icon(Icons.edit),
          onPressed: () {
            // TODO: Edit pricing
          },
        ),
      ),
    );
  }
}
