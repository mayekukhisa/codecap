/*
 * Copyright 2024 Mayeku Khisa
 *
 * Use of this source code is governed by a MIT license as appearing in the
 * LICENSE file included in the root of this source tree.
 */
import chalk from "chalk"
import { createReadStream, existsSync, readFileSync, writeFileSync } from "fs"
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

            const headerTemplate = this.readHeaderFile(rule)
            const headerDelimiter = new RegExp(rule.headerDelimiter)

            const filePaths = globSync(rule.target, { ignore: rule.targetExclude })
            for (const filePath of filePaths) {
               const fileHeaderContent = await this.readFileUntilPattern(filePath, headerDelimiter)
               const expectedHeaderContent = this.getExpectedHeaderContent(headerTemplate, fileHeaderContent)

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

   public async fixHeaders() {
      console.log("Fixing file headers...")
      try {
         let fixCount = 0

         for (const rule of this.config.ruleSet) {
            this.validateRule(rule)

            const headerTemplate = this.readHeaderFile(rule)
            const headerDelimiter = new RegExp(rule.headerDelimiter)

            const filePaths = globSync(rule.target, { ignore: rule.targetExclude })
            for (const filePath of filePaths) {
               const fileHeaderContent = await this.readFileUntilPattern(filePath, headerDelimiter)
               const expectedHeaderContent = this.getExpectedHeaderContent(headerTemplate, fileHeaderContent)

               if (fileHeaderContent !== expectedHeaderContent) {
                  const fileContent = this.normalizeLineEndings(readFileSync(filePath, "utf8"))
                  const updatedFileContent =
                     fileHeaderContent.length === 0
                        ? expectedHeaderContent + fileContent
                        : fileContent.replace(fileHeaderContent, expectedHeaderContent)

                  writeFileSync(filePath, updatedFileContent, "utf8")
                  console.log(chalk.green("\u2713 %s"), filePath)
                  fixCount++
               }
            }
         }

         if (fixCount === 0) {
            console.log("All matched files have the correct header!")
         } else {
            console.log("Changed %d %s!", fixCount, fixCount === 1 ? "file" : "files")
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

   private readHeaderFile(rule: Rule): string {
      if (!existsSync(rule.headerFile)) {
         throw new Error("Header file not found: " + rule.headerFile)
      }

      return this.normalizeLineEndings(readFileSync(rule.headerFile, "utf8"))
   }

   private async readFileUntilPattern(filePath: string, pattern: RegExp): Promise<string> {
      const fileStream = createReadStream(filePath)
      const lineReader = createInterface({ input: fileStream, crlfDelay: Infinity })

      let fileContent = ""
      for await (const line of lineReader) {
         if (pattern.test(line)) {
            break
         }
         fileContent += line + "\n"
      }
      return fileContent
   }

   private normalizeLineEndings(text: string): string {
      return text.replace(/\r\n/g, "\n")
   }

   private getExpectedHeaderContent(headerTemplate: string, fileHeaderContent: string): string {
      const currentYear = new Date().getFullYear().toString()
      const fileYear = fileHeaderContent.match(/\d{4}/)?.[0]

      const displayYear =
         this.config.useYearRange && fileYear && fileYear !== currentYear ? `${fileYear}-${currentYear}` : currentYear

      return headerTemplate.replace("$YEAR", displayYear)
   }
}
