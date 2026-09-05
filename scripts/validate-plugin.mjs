#!/usr/bin/env node

import { promises as fs } from "node:fs"
import path from "node:path"
import process from "node:process"
import { fileURLToPath } from "node:url"

const pluginDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const errors = []

const pluginNamePattern = /^[a-z0-9](?:[a-z0-9.-]*[a-z0-9])?$/
const skillNamePattern = /^[a-z0-9](?:[a-z0-9.-]*[a-z0-9])?$/
const requiredManifestFields = [
  "name",
  "displayName",
  "version",
  "description",
  "author",
  "license",
  "logo",
  "mcpServers",
]

const addError = (message) => {
  errors.push(message)
}

const pathExists = async (targetPath) => {
  try {
    await fs.access(targetPath)
    return true
  } catch {
    return false
  }
}

const readJsonFile = async (filePath, context) => {
  let raw
  try {
    raw = await fs.readFile(filePath, "utf8")
  } catch {
    addError(`${context} is missing: ${filePath}`)
    return null
  }

  try {
    return JSON.parse(raw)
  } catch (error) {
    addError(`${context} contains invalid JSON (${filePath}): ${error.message}`)
    return null
  }
}

const normalizeNewlines = (content) => content.replace(/\r\n/g, "\n")

const parseFrontmatter = (content) => {
  const normalized = normalizeNewlines(content)
  if (!normalized.startsWith("---\n")) return null

  const closingIndex = normalized.indexOf("\n---\n", 4)
  if (closingIndex === -1) return null

  const fields = {}
  for (const line of normalized.slice(4, closingIndex).split("\n")) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith("#")) continue
    const separator = line.indexOf(":")
    if (separator === -1) continue
    fields[line.slice(0, separator).trim()] = line.slice(separator + 1).trim()
  }
  return fields
}

const walkFiles = async (dirPath) => {
  const files = []
  const stack = [dirPath]

  while (stack.length > 0) {
    const current = stack.pop()
    const entries = await fs.readdir(current, { withFileTypes: true })
    for (const entry of entries) {
      const entryPath = path.join(current, entry.name)
      if (entry.isDirectory()) stack.push(entryPath)
      else if (entry.isFile()) files.push(entryPath)
    }
  }

  return files
}

const isSafeRelativePath = (value) => {
  if (typeof value !== "string" || value.length === 0) return false
  if (value.startsWith("http://") || value.startsWith("https://")) return true
  if (path.isAbsolute(value)) return false
  const normalized = path.posix.normalize(value.replace(/\\/g, "/"))
  return !normalized.startsWith("../") && normalized !== ".."
}

const main = async () => {
  if (await pathExists(path.join(pluginDir, ".cursor-plugin", "marketplace.json"))) {
    addError(
      "Single-plugin repos must not include .cursor-plugin/marketplace.json. Keep one plugin.json at the repo root.",
    )
  }

  const manifestPath = path.join(pluginDir, ".cursor-plugin", "plugin.json")
  const pluginManifest = await readJsonFile(manifestPath, "Plugin manifest")
  if (!pluginManifest) {
    summarizeAndExit()
    return
  }

  if (typeof pluginManifest.name !== "string" || !pluginNamePattern.test(pluginManifest.name)) {
    addError('"name" in plugin.json must be lowercase kebab-case.')
  }

  for (const field of requiredManifestFields) {
    if (pluginManifest[field] == null || pluginManifest[field] === "") {
      addError(`plugin.json is missing recommended field "${field}".`)
    }
  }

  if (!pluginManifest.author || typeof pluginManifest.author.name !== "string") {
    addError('plugin.json "author.name" is required.')
  }

  const logo = pluginManifest.logo
  if (typeof logo === "string") {
    if (!isSafeRelativePath(logo)) {
      addError(`plugin.json "logo" is not a safe relative path: "${logo}"`)
    } else if (!(await pathExists(path.join(pluginDir, logo)))) {
      addError(`plugin.json "logo" references a missing file: "${logo}"`)
    }
  }

  const mcpServers = pluginManifest.mcpServers
  if (typeof mcpServers === "string") {
    if (!isSafeRelativePath(mcpServers)) {
      addError(`plugin.json "mcpServers" is not a safe relative path: "${mcpServers}"`)
    } else if (!(await pathExists(path.join(pluginDir, mcpServers)))) {
      addError(`plugin.json "mcpServers" references a missing file: "${mcpServers}"`)
    }
  }

  const mcpPath = path.join(pluginDir, "mcp.json")
  const mcp = await readJsonFile(mcpPath, "MCP config")
  const server = mcp?.mcpServers?.rentstag
  if (!server || typeof server !== "object") {
    addError("mcp.json must define mcpServers.rentstag.")
  } else {
    if (server.type !== "http") {
      addError('mcp.json rentstag.type must be "http".')
    }
    if (server.url !== "https://mcp.rentstag.com") {
      addError("mcp.json rentstag.url must be https://mcp.rentstag.com.")
    }
  }

  for (const requiredFile of ["README.md", "LICENSE", "CHANGELOG.md"]) {
    if (!(await pathExists(path.join(pluginDir, requiredFile)))) {
      addError(`Missing ${requiredFile} (required by accepted Cursor plugins).`)
    }
  }

  const skillsDir = path.join(pluginDir, "skills")
  if (!(await pathExists(skillsDir))) {
    addError("skills/ directory is missing.")
  } else {
    const skillFiles = (await walkFiles(skillsDir)).filter(
      (file) => path.basename(file) === "SKILL.md",
    )
    if (skillFiles.length === 0) {
      addError("No skills/*/SKILL.md files found.")
    }
    for (const file of skillFiles) {
      const content = await fs.readFile(file, "utf8")
      const parsed = parseFrontmatter(content)
      const relativeFile = path.relative(pluginDir, file)
      const folderName = path.basename(path.dirname(file))
      if (!parsed) {
        addError(`Skill file missing YAML frontmatter: ${relativeFile}`)
        continue
      }
      if (!parsed.name || !skillNamePattern.test(parsed.name)) {
        addError(`Skill file missing kebab-case "name": ${relativeFile}`)
      } else if (parsed.name !== folderName) {
        addError(
          `Skill name "${parsed.name}" does not match folder "${folderName}" (${relativeFile}).`,
        )
      }
      if (!parsed.description) {
        addError(`Skill file missing "description": ${relativeFile}`)
      }
    }
  }

  summarizeAndExit()
}

const summarizeAndExit = () => {
  if (errors.length > 0) {
    console.error("Validation failed:")
    for (const error of errors) console.error(`- ${error}`)
    process.exit(1)
  }

  console.log("Validation passed.")
}

await main()
