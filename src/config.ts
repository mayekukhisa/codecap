/*
 * Copyright 2024 Mayeku Khisa
 *
 * Use of this source code is governed by a MIT license as appearing in the
 * LICENSE file included in the root of this source tree.
 */
export interface Rule {
   target: string | string[]
   targetExclude?: string | string[]
   headerFile: string
   headerDelimiter: string
}

export interface Config {
   ruleSet: Rule[]
}
