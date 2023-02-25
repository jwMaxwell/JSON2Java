const fs = require("fs");
const cli = require("commander");

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

const getOptions = (args) => {
  packageInfo = readJson("./package.json");
  cli
    .option("-i, --input <path>", "path to JSON file")
    .option(
      "-o, --output <path>",
      "path to Java file (default: stdout)",
      "stdout"
    )
    .option("-t, --indent <number>", "indentation level (default: 4)", 4)
    .option(
      "-c, --indent-char <char>",
      'indentation character (default: space or "\\s")',
      "\\s"
    )
    .version(
      [
        `${packageInfo.name} ${packageInfo.version}`,
        `${fs.readFileSync("./LICENSE-stub", "utf8")}`,
        `Written by ${packageInfo.author}`,
      ].join("\n")
    );

  cli.parse(args);
  return cli.opts();
};

const _parse = (text, className, indentChar, indent = 1) => {
  return `class ${className} {\n${Object.keys(text)
    .map((n) =>
      Array.isArray(text[n])
        ? `public static String[] ${n} = {"${text[n].join('", "')}"};\n`
        : text[n] && typeof text[n] === "object"
        ? `public static ${_parse(text[n], n, indentChar, indent + 1)}`
        : typeof text[n] === "boolean"
        ? `public static boolean ${n} = ${text[n]};\n`
        : !isNaN(Number(text[n]))
        ? `${text[n]}`.includes(".")
          ? `public static double ${n} = ${text[n]};\n`
          : `public static int ${n} = ${text[n]};\n`
        : text[n].length === 1
        ? `public static char ${n} = '${text[n]}';\n`
        : `public static String ${n} = "${text[n]}";\n`
    )
    .map((n) => indentChar.repeat(indent) + n)
    .join("")}${indentChar.repeat(indent - 1)}}\n`;
};

const options = getOptions(process.argv);
if (options.input === undefined) throw new Error("Missing input path");
const res = _parse(
  readJson(options.input),
  options.input
    .slice(options.input.lastIndexOf("/") + 1, options.input.lastIndexOf("."))
    .replace(/\.\//, ""),
  escapeToChar(options.indentChar).repeat(Number(options.indent))
);

options.output === "stdout"
  ? console.log(res)
  : fs.writeFileSync(options.output, parse(res));

///////////////////////////////////////////////////////////////////////////////
//        Copyright 2023 Joshua Maxwell                                      //
//                                                                           //
// Licensed under the Apache License, Version 2.0 (the "License");           //
// you may not use this file except in compliance with the License.          //
// You may obtain a copy of the License at                                   //
//                                                                           //
//        http://www.apache.org/licenses/LICENSE-2.0                         //
//                                                                           //
// Unless required by applicable law or agreed to in writing, software       //
// distributed under the License is distributed on an "AS IS" BASIS,         //
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.  //
// See the License for the specific language governing permissions and       //
// limitations under the License.                                            //
///////////////////////////////////////////////////////////////////////////////
