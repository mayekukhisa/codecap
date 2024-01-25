/*
 * Copyright 2024 Mayeku Khisa
 *
 * Use of this source code is governed by a MIT license as appearing in the
 * LICENSE file included in the root of this source tree.
 */
import replace from "@rollup/plugin-replace"
import typescript from "@rollup/plugin-typescript"
import { readFileSync } from "fs"

const isProduction = process.env.NODE_ENV === "production"
const packageJson = JSON.parse(readFileSync("package.json", "utf8"))

export default {
   input: "src/index.ts",
   output: {
      dir: "bin",
      format: "es",
      banner: "#!/usr/bin/env node\n",
      sourcemap: !isProduction,
   },
   external: ["chalk", "commander", "fs", "os", "glob", "readline"],
   plugins: [
      typescript({ sourceMap: !isProduction }),
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
