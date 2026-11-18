# Changelog

## 1.4.0

Document the shared MCP limits (per person and per organisation, heavier tools count more) and the limit message, and the two admin-only tools `mcp_usage_get` and `get_change_history`. Troubleshoot skill: wait on the limit message, route admin usage and history questions. Bump plugin and server card to 1.4.0. The tools and limits ship with the hosted server release from rentstag-app PRs 178 and 182.

## 1.3.0

Document MCP Events in the root and plugin READMEs (subscribe, list, unsubscribe; client-neutral). Bump plugin and server card to 1.3.0.

## 1.2.0

Claude plugin directory readiness: `privacyPolicyUrl` in `.claude-plugin/plugin.json`, Claude manifest version aligned with Cursor and `server.json`, one-step Claude Code install line, client-neutral plugin README with a privacy link to rentstag.com and data note.

## 1.1.0

Sync plugin content from `rentstag-app` `dev` (`apps/mcp/cursor-plugin`): landlord README and install copy, square logo assets, `suggest_tools` guidance in the troubleshoot skill, import skill wording aligned with the monorepo, plugin description and version 1.1.0. Hosted MCP changes since September (JSON Schema tool inputs, tool ranking, MCP 2026 client metadata) ship from the monorepo deployment at `https://mcp.rentstag.com`; this release updates the public install card and skills only.

## 1.0.0

Plugin for Cursor, Claude, and ChatGPT. Hosted MCP plus portfolio skills.
