import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';

Future<void> logout(BuildContext context) async {
  final prefs = await SharedPreferences.getInstance();
  await prefs.clear();

  if (!context.mounted) return;

  Navigator.pushNamedAndRemoveUntil(
    context,
    '/', 
    (route) => false,
  );
}
