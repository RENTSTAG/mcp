# Changelog

All notable changes to this plugin will be documented here.

## 1.0.0 — marketplace-ready packaging

- Manifest matches the Cursor plugin schema: `displayName`, `category`, `tags`, `minClientVersions`, `skills`, and `mcpServers`.
- MCP config declares `type: "http"` against `https://mcp.rentstag.com`.
- Logo is the Rentstag product mark on a padded white tile.
- Added MIT `LICENSE` and this changelog.

## 0.1.1

- Added import, export, and troubleshoot skills.

## 0.1.0 — initial release

- Added the `rentstag` MCP server pointing at `https://mcp.rentstag.com`.
- Auth is WorkOS sign-in, not an API key.
