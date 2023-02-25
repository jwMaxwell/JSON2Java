const process = require("process");
const fs = require("fs");

const readJson = (path) => JSON.parse(fs.readFileSync(path, "utf8"));

const escapeToChar = (str) =>
  str
    .replace(/\\s/g, " ")
    .replace(/\\n/g, "\n")
    .replace(/\\r/g, "\r")
    .replace(/\\t/g, "\t")
    .replace(/\\b/g, "\b")
    .replace(/\\f/g, "\f")
    .replace(/\\'/g, "'")
    .replace(/\\"/g, '"')
    .replace(/\\\\/g, "\\");

const options = {
  fileName: "",
  input: "",
  output: "stdout",
  indent: 4,
  indentChar: " ",
};

const helpText = `Usage: node JSON2Java.js [options]
Options:
  -i, --input <path>  Path to JSON file
  -o, --output <path>  Path to Java file
  -t, --indent <number>  Indentation level (default: 4)
  -c, --indent-char <char>  Indentation character (default: space or "\\s")
  -h, --help            Show this help`;

for (let i = 2; i < process.argv.length; ++i) {
  switch (process.argv[i]) {
    case "-i":
    case "--input":
      options.fileName = process.argv[i + 1];
      options.input = readJson(options.fileName);
      break;
    case "-t":
    case "--indent":
      options.indent = Number(process.argv[i + 1]);
      break;
    case "-c":
    case "--indent-char":
      options.indentChar = escapeToChar(process.argv[i + 1]);
      break;
    case "-o":
    case "--output":
      options.output = process.argv[i + 1];
      break;
    case "-h":
    case "--help":
      console.log(helpText);
      if (process.argv.length === 3) process.exit(0);
      break;
    default:
      break;
  }
}

const parse = (text, className, indentChar, indent = 1) => {
  let res = `class ${className} {\n`;
  for (const n in text) {
    res += indentChar.repeat(indent);
    if (typeof text[n] === "object" && Array.isArray(text[n]))
      res += `public static String[] ${n} = {"${text[n].join('", "')}"};\n`;
    else if (typeof text[n] === "object")
      res += `public static ${parse(text[n], n, indentChar, indent + 1)}`;
    else if (typeof text[n] === "boolean")
      res += `public static boolean ${n} = ${text[n]};\n`;
    else if (!isNaN(Number(text[n])))
      res += `${text[n]}`.includes(".")
        ? `public static double ${n} = ${text[n]};\n`
        : `public static int ${n} = ${text[n]};\n`;
    else
      res +=
        text[n].length === 1
          ? `public static char ${n} = '${text[n]}';\n`
          : `public static String ${n} = "${text[n]}";\n`;
  }
  return res + `${indentChar.repeat(indent - 1)}}\n`;
};

if (options.output === "stdout") {
  console.log(
    parse(
      options.input,
      options.fileName
        .slice(0, options.fileName.lastIndexOf("."))
        .replace(/\.\//, ""),
      options.indentChar.repeat(options.indent)
    )
  );
} else {
  fs.writeFileSync(
    options.output,
    parse(
      options.input,
      options.fileName
        .slice(0, options.fileName.lastIndexOf("."))
        .replace(/\.\//, ""),
      options.indentChar.repeat(options.indent)
    )
  );
}
