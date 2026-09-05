#!/usr/bin/env node

import { promises as fs } from "node:fs"
import path from "node:path"
import process from "node:process"
import { fileURLToPath } from "node:url"

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
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

const validatePlugin = async (pluginDir, pluginName) => {
  const manifestPath = path.join(pluginDir, ".cursor-plugin", "plugin.json")
  const pluginManifest = await readJsonFile(manifestPath, `${pluginName} plugin manifest`)
  if (!pluginManifest) return

  if (typeof pluginManifest.name !== "string" || !pluginNamePattern.test(pluginManifest.name)) {
    addError(`${pluginName}: "name" in plugin.json must be lowercase kebab-case.`)
  }

  if (pluginManifest.name && pluginManifest.name !== pluginName) {
    addError(
      `${pluginName}: marketplace entry name does not match plugin.json name ("${pluginManifest.name}").`,
    )
  }

  for (const field of requiredManifestFields) {
    if (pluginManifest[field] == null || pluginManifest[field] === "") {
      addError(`${pluginName}: plugin.json is missing recommended field "${field}".`)
    }
  }

  if (!pluginManifest.author || typeof pluginManifest.author.name !== "string") {
    addError(`${pluginName}: plugin.json "author.name" is required.`)
  }

  const logo = pluginManifest.logo
  if (typeof logo === "string") {
    if (!isSafeRelativePath(logo)) {
      addError(`${pluginName}: plugin.json "logo" is not a safe relative path: "${logo}"`)
    } else if (!(await pathExists(path.join(pluginDir, logo)))) {
      addError(`${pluginName}: plugin.json "logo" references a missing file: "${logo}"`)
    }
  }

  const mcpServers = pluginManifest.mcpServers
  if (typeof mcpServers === "string") {
    if (!isSafeRelativePath(mcpServers)) {
      addError(
        `${pluginName}: plugin.json "mcpServers" is not a safe relative path: "${mcpServers}"`,
      )
    } else if (!(await pathExists(path.join(pluginDir, mcpServers)))) {
      addError(`${pluginName}: plugin.json "mcpServers" references a missing file: "${mcpServers}"`)
    }
  }

  const mcp = await readJsonFile(path.join(pluginDir, "mcp.json"), `${pluginName} MCP config`)
  const server = mcp?.mcpServers?.rentstag
  if (!server || typeof server !== "object") {
    addError(`${pluginName}: mcp.json must define mcpServers.rentstag.`)
  } else {
    if (server.type !== "http") {
      addError(`${pluginName}: mcp.json rentstag.type must be "http".`)
    }
    if (server.url !== "https://mcp.rentstag.com") {
      addError(`${pluginName}: mcp.json rentstag.url must be https://mcp.rentstag.com.`)
    }
  }

  for (const requiredFile of ["README.md", "LICENSE", "CHANGELOG.md"]) {
    if (!(await pathExists(path.join(pluginDir, requiredFile)))) {
      addError(`${pluginName}: missing ${requiredFile}.`)
    }
  }

  const skillsDir = path.join(pluginDir, "skills")
  if (!(await pathExists(skillsDir))) {
    addError(`${pluginName}: skills/ directory is missing.`)
    return
  }

  const skillFiles = (await walkFiles(skillsDir)).filter(
    (file) => path.basename(file) === "SKILL.md",
  )
  if (skillFiles.length === 0) {
    addError(`${pluginName}: no skills/*/SKILL.md files found.`)
  }
  for (const file of skillFiles) {
    const content = await fs.readFile(file, "utf8")
    const parsed = parseFrontmatter(content)
    const relativeFile = path.relative(repoRoot, file)
    const folderName = path.basename(path.dirname(file))
    if (!parsed) {
      addError(`${pluginName}: skill file missing YAML frontmatter: ${relativeFile}`)
      continue
    }
    if (!parsed.name || !skillNamePattern.test(parsed.name)) {
      addError(`${pluginName}: skill file missing kebab-case "name": ${relativeFile}`)
    } else if (parsed.name !== folderName) {
      addError(
        `${pluginName}: skill name "${parsed.name}" does not match folder "${folderName}" (${relativeFile}).`,
      )
    }
    if (!parsed.description) {
      addError(`${pluginName}: skill file missing "description": ${relativeFile}`)
    }
  }
}

const main = async () => {
  if (await pathExists(path.join(repoRoot, ".cursor-plugin", "plugin.json"))) {
    addError(
      "Do not put plugin.json next to marketplace.json. Cursor Add from GitHub expects a marketplace at repo root and each plugin in its own folder.",
    )
  }

  const marketplace = await readJsonFile(
    path.join(repoRoot, ".cursor-plugin", "marketplace.json"),
    "Marketplace manifest",
  )
  if (!marketplace) {
    summarizeAndExit()
    return
  }

  if (typeof marketplace.name !== "string" || marketplace.name.length === 0) {
    addError('Marketplace "name" is required.')
  }

  if (!marketplace.owner || typeof marketplace.owner.name !== "string") {
    addError('Marketplace "owner.name" is required.')
  }

  if (!Array.isArray(marketplace.plugins) || marketplace.plugins.length === 0) {
    addError('Marketplace "plugins" must be a non-empty array.')
    summarizeAndExit()
    return
  }

  for (const [index, entry] of marketplace.plugins.entries()) {
    if (!entry || typeof entry !== "object") {
      addError(`plugins[${index}] must be an object.`)
      continue
    }
    if (typeof entry.name !== "string" || !pluginNamePattern.test(entry.name)) {
      addError(`plugins[${index}].name must be lowercase kebab-case.`)
      continue
    }
    if (typeof entry.source !== "string" || !isSafeRelativePath(entry.source)) {
      addError(`${entry.name}: source must be a relative path without "./" or "..".`)
      continue
    }
    if (entry.source.startsWith("./")) {
      addError(`${entry.name}: source "${entry.source}" must not use a "./" prefix.`)
    }
    const pluginDir = path.join(repoRoot, entry.source)
    if (!(await pathExists(pluginDir))) {
      addError(`${entry.name}: source directory does not exist: ${entry.source}`)
      continue
    }
    await validatePlugin(pluginDir, entry.name)
  }

  const serverCard = await readJsonFile(path.join(repoRoot, "server.json"), "MCP server card")
  if (serverCard) {
    const remote = serverCard.remotes?.[0]
    if (serverCard.name !== "rentstag/mcp") {
      addError('server.json "name" must be "rentstag/mcp".')
    }
    if (remote?.type !== "streamable-http" || remote?.url !== "https://mcp.rentstag.com") {
      addError("server.json must declare a streamable-http remote at https://mcp.rentstag.com.")
    }
  }

  for (const requiredFile of ["README.md", "LICENSE", "CHANGELOG.md"]) {
    if (!(await pathExists(path.join(repoRoot, requiredFile)))) {
      addError(`Missing ${requiredFile} at the repository root.`)
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
