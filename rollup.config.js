/*
 * Copyright 2024-2026 Mayeku Khisa
 *
 * Use of this source code is governed by a MIT license as appearing in the
 * LICENSE file included in the root of this source tree.
 */
import replace from "@rollup/plugin-replace"
import typescript from "@rollup/plugin-typescript"
import { readFileSync } from "fs"

const isProduction = process.env.NODE_ENV === "production"
const packageJson = JSON.parse(readFileSync("package.json", "utf8"))

var bundleBanner = "#!/usr/bin/env node\n"
const copyrightHeaderMatch = readFileSync("rollup.config.js", "utf8").match(/\/\*[\s\S]*?Copyright[\s\S]*?\*\//)
if (copyrightHeaderMatch) {
  bundleBanner += `\n${copyrightHeaderMatch[0]}`
}

export default {
  input: "src/index.ts",
  output: {
    dir: "bin",
    format: "es",
    banner: bundleBanner,
    sourcemap: !isProduction,
  },
  external: ["chalk", "commander", "fs", "glob", "ignore", "os", "path", "readline"],
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
