/*
 * Copyright 2024 Mayeku Khisa
 *
 * Use of this source code is governed by a MIT license as appearing in the
 * LICENSE file included in the root of this source tree.
 */
import chalk from "chalk"
import { createReadStream, existsSync, readFileSync } from "fs"
import { globSync } from "glob"
import { EOL } from "os"
import { createInterface } from "readline"

import { Config, Rule } from "./config.js"

export class HeaderManager {
   private config: Config

   constructor(config: Config) {
      this.config = config
   }

   public async checkHeaders() {
      console.log("Checking file headers...")
      try {
         let issueCount = 0

         for (const rule of this.config.ruleSet) {
            this.validateRule(rule)

            if (!existsSync(rule.headerFile)) {
               throw new Error("Header file not found: " + rule.headerFile)
            }

            const headerFileContent = readFileSync(rule.headerFile, "utf8").replace(/\r\n/g, "\n")
            const currentYear = new Date().getFullYear().toString()
            const expectedHeaderContent = headerFileContent.replace("$YEAR", currentYear)

            const headerDelimiter = new RegExp(rule.headerDelimiter)

            const filePaths = globSync(rule.target, { ignore: rule.targetExclude })
            for (const filePath of filePaths) {
               const fileStream = createReadStream(filePath)
               const lineReader = createInterface({ input: fileStream, crlfDelay: Infinity })

               let fileHeaderContent = ""
               for await (const line of lineReader) {
                  if (headerDelimiter.test(line)) {
                     break
                  }
                  fileHeaderContent += line + "\n"
               }

               if (fileHeaderContent !== expectedHeaderContent) {
                  console.log(chalk.yellow("\u26A0 %s"), filePath)
                  issueCount++
               }
            }
         }

         if (issueCount === 0) {
            console.log("All matched files have the correct header!")
         } else {
            console.log("Found %d %s!", issueCount, issueCount === 1 ? "issue" : "issues")
         }
      } catch (error) {
         console.log(chalk.red((error as Error).message))
      }
   }

   private validateRule(rule: Rule) {
      const errorMessage = "Invalid rule:" + EOL + JSON.stringify(rule, null, 3) + EOL

      if (!rule.target) throw new Error(errorMessage + "The 'target' property is not defined")
      if (!rule.headerFile) throw new Error(errorMessage + "The 'headerFile' property is not defined")
      if (!rule.headerDelimiter) throw new Error(errorMessage + "The 'headerDelimiter' property is not defined")
   }
}
