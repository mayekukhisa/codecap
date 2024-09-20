# Codecap

Codecap is a file header standardization tool designed to streamline the process of maintaining consistent headers across diverse file types in your project. It automates the task of updating and unifying essential information such as license details, author credentials, and project descriptions, ensuring a cohesive style throughout your codebase.

## Key Features

-  🔍 **Smart Header Inspection**: Efficiently detect files with missing or incorrect headers.
-  🛠️ **Automatic Correction**: Seamlessly fix and update file headers with a single command.
-  🎯 **Versatile Targeting**: Support for multiple file types and patterns, enabling precise rule application.
-  🚫 **Intelligent Exclusions**: Respect `.gitignore` and custom exclusion patterns for granular control.
-  🔄 **Year Range Automation**: Automatically update copyright year ranges to stay current.
-  🧩 **Flexible Configuration**: Easily customize rules and headers via JSON configuration file.

## Getting Started

This section shows how to get Codecap up and running on your local machine.

### System Requirements

Ensure the following software is installed on your system before using Codecap:

-  Node.js (v16 or later)

### Installation

You can install Codecap either globally or locally in your project.

#### Global Installation

To install Codecap globally, use the following command:

```shell
npm install -g codecap
```

#### Local Installation

To install Codecap as a dev dependency in your project, use one of the following commands based on your package manager:

```shell
# npm
npm install -D codecap

# pnpm
pnpm add -D codecap

# yarn
yarn add -D codecap
```

### Configuration

Create a `.codecaprc.json` file at the root level of your project directory to define rules for managing headers. Here's an example configuration:

```json
{
   "useYearRange": true,
   "ruleSet": [
      {
         "target": ["**/*.{js,ts}", "**/*.css"],
         "targetExclude": ["node_modules/**", "dist/**"],
         "headerFile": "path/to/file",
         "headerDelimiter": "^(?![\\/ ]\\*)."
      }
   ]
}
```

| Key                            | Type         | Description                                                       |
| :----------------------------- | :----------- | :---------------------------------------------------------------- |
| `ruleSet`                      | Array        | Defines rules for applying headers to different file types.       |
| `target`                       | String/Array | Specifies file patterns to match for each rule.                   |
| `headerFile`                   | String       | Specifies the path to the file containing the header content.     |
| `headerDelimiter`              | Regex        | Specifies the pattern to identify the end of the header in files. |
| `useYearRange` **(Optional)**  | Boolean      | Enables automatic year range updates.                             |
| `targetExclude` **(Optional)** | String/Array | Specifies patterns for files/directories to exclude.              |

> [!TIP]
>
> Use the `$YEAR` placeholder in your header files to automatically keep copyright years current. Codecap will update this to the latest year when fixing headers.

### Usage

#### Global Usage

If you've installed Codecap globally, you can run it directly from any directory:

```shell
codecap --check
codecap --fix
```

#### Local Usage

If you've installed Codecap locally in your project, integrate it into your project by adding script entries in your `package.json` file:

```json
{
   "scripts": {
      "check": "codecap --check",
      "fix": "codecap --fix"
   }
}
```

Then you can run:

-  `npm run check` (or `pnpm check` or `yarn check`) to inspect your files for correct headers.
-  `npm run fix` (or `pnpm fix` or `yarn fix`) to automatically correct any incorrect headers.

Feel free to modify these scripts as needed to fit your project requirements.

## License

Codecap is available under the terms of the [MIT license][1].

&copy; 2024 Mayeku Khisa.

[1]: LICENSE
