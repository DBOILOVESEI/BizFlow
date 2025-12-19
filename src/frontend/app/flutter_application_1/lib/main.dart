import 'package:flutter/material.dart';
import 'package:flutter_application_1/pages/title.dart';
//import 'app.dart';

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
        fontFamily: 'Arimo Nerd Font Propo'
      ),
      home: const TitlePage()
    );
  }
}