# JSON2Java

A script which will turn your JSON files into Java files.
This script came from my frustrations with current JSON parsers in Java. All of them are written in Java, and as a result, they suck. My implementation allows the user to use JSON as it was intended.

### Arguments

```
Usage: node JSON2Java.js [options]
Options:
-i, --input <path> Path to JSON file
-o, --output <path> Path to Java file
-t, --indent <number> Indentation level (default: 4)
-c, --indent-char <char> Indentation character (default: space or "\s")
-h, --help Show this help
```
