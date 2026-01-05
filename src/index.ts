/*
 * Copyright 2024 Mayeku Khisa
 *
 * Use of this source code is governed by a MIT license as appearing in the
 * LICENSE file included in the root of this source tree.
 */
import chalk from "chalk"
import { program } from "commander"
import { existsSync, readFileSync } from "fs"
import { EOL } from "os"

import { Config } from "./config.js"
import { HeaderManager } from "./header-manager.js"

program
  .name("__projectName__")
  .description("__projectDescription__")
  .version("__projectVersion__", "--version", "Show the version and exit")
  .helpOption(undefined, "Show this message and exit")
  .addHelpText("after", EOL + "Homepage: https://github.com/mayekukhisa/codecap#readme")

program
  .option("-c, --check", "Check if files have the correct header")
  .option("-f, --fix", "Fix files with incorrect header")

program.parse(process.argv)

if (!process.argv.slice(2).length) {
  program.outputHelp()
} else {
  const configFile = ".codecaprc.json"

  if (existsSync(configFile)) {
    try {
      const config: Config = JSON.parse(readFileSync(configFile, "utf8"))

      if (!config.ruleSet) {
        throw new Error("The 'ruleSet' property is not defined")
      }

      const options = program.opts()
      const headerManager = new HeaderManager(config)

      if (options.check) {
        headerManager.checkHeaders()
      }

      if (options.fix) {
        headerManager.fixHeaders()
      }
    } catch (error) {
      if (error instanceof SyntaxError) {
        console.log(chalk.red("Error parsing config file: %s"), configFile)
      } else {
        console.log(chalk.red("Invalid config file: %s"), configFile)
        console.log(chalk.red((error as Error).message))
      }
    }
  } else {
    console.log(chalk.red("Config file not found: %s"), configFile)
  }
}
