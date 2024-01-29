# Codecap

Codecap is a file header standardization tool that simplifies the updating and uniformity of headers across various file types within a project. It ensures consistent presentation of details like license information, author credentials, or project descriptions, promoting a harmonized style throughout your codebase.

## Features

-  **Header Inspection**: Check if files have the correct header.
-  **Header Correction**: Automatically fix files with incorrect headers.
-  **Flexible Targeting**: Apply rules to a wide range of file types, with support for both individual and multiple patterns.
-  **Exclusion Patterns**: Exclude specific files or directories from being processed, with support for single or multiple exclusion patterns.

## Getting Started

This section shows how to get the tool up and running on your local machine.

### System requirement

To use this tool, ensure the following software is installed on your system:

-  Node.js 16 or newer

### Installation

1. Open your terminal.

2. Navigate to your node project's directory.

3. Execute the following command:

   ```shell
   npm install codecap
   ```

### Configuration

Set up a `.codecaprc.json` file at the root level of your project directory as shown in the example below:

```json
{
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

-  **`ruleSet`**: An array of rules defining how headers should be applied. Each rule can handle different file types uniquely.
-  **`target`**: A pattern or an array of patterns for matching files. It specifies which files the rule should apply to.
-  **`targetExclude`**: A pattern or an array of patterns for files or directories to exclude from the rule.
-  **`headerFile`**: The path to a file containing the header content to be prepended to each matched file.
-  **`headerDelimiter`**: A regex pattern that helps identify where the header ends in a file for correct insertion or replacement.

### Usage

Integrate the tool into your project by adding script entries in your `package.json` file:

```json
{
   "scripts": {
      "check-headers": "codecap --check",
      "fix-headers": "codecap --fix"
   }
}
```

-  Run `npm run check-headers` to inspect your files for correct headers.
-  Use `npm run fix-headers` to automatically correct any incorrect headers.

Feel free to modify these scripts as needed to fit your project requirements.

## License

This tool is available under the terms of the [MIT license][1].

&copy; 2024 Mayeku Khisa.

[1]: LICENSE
