import 'package:flutter/material.dart';

// Basic
void showError(BuildContext context, String errorMessage) {
  ScaffoldMessenger.of(context).showSnackBar(
    SnackBar(
      content: Text(
        errorMessage,
        style: TextStyle(
          fontWeight: FontWeight.bold
        ),
        ),
      backgroundColor: Colors.red,
      ),
  );
}