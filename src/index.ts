/*
 * Copyright 2024 Mayeku Khisa
 *
 * Use of this source code is governed by a MIT license as appearing in the
 * LICENSE file included in the root of this source tree.
 */
import { program } from "commander"
import { EOL } from "os"

program
   .name("codecap")
   .description("A file header standardization tool")
   .version("0.1.0", "--version", "Show the version and exit")
   .helpOption(undefined, "Show this message and exit")
   .addHelpText("after", EOL + "Homepage: https://github.com/mayekukhisa/codecap#readme")

program.parse(process.argv)

if (!process.argv.slice(2).length) {
   program.outputHelp()
}
