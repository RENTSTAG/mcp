# Rentstag for Cursor

Hosted MCP for occupancy, buildings, units, contracts, and rent.

Install from GitHub in Cursor. Do not paste `mcp.json` by hand.

## Install

1. Cursor → **Settings → Plugins**
2. **Add from GitHub**
3. `RENTSTAG/mcp`
4. Sign in with WorkOS when Cursor opens the browser

That adds this server:

```json
{
  "mcpServers": {
    "rentstag": {
      "url": "https://mcp.rentstag.com"
    }
  }
}
```

## What this repo is

A public Cursor plugin. The MCP server itself stays in the private Rentstag app. This repo only publishes the install card Cursor reads from GitHub.

## Local

For the Rentstag monorepo, keep using `http://localhost:2172/` in that workspace. This plugin is for production.
