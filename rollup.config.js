/*
 * Copyright 2024 Mayeku Khisa
 *
 * Use of this source code is governed by a MIT license as appearing in the
 * LICENSE file included in the root of this source tree.
 */
import replace from "@rollup/plugin-replace"
import typescript from "@rollup/plugin-typescript"
import { readFileSync } from "fs"

const packageJson = JSON.parse(readFileSync("package.json", "utf8"))

export default {
   input: "src/index.ts",
   output: {
      dir: "bin",
      format: "es",
      sourcemap: true,
   },
   external: ["chalk", "commander", "fs", "os", "glob", "readline"],
   plugins: [
      typescript(),
      replace({
         preventAssignment: true,
         values: {
            __projectName__: packageJson.name,
            __projectDescription__: packageJson.description,
            __projectVersion__: packageJson.version,
         },
      }),
   ],
}
