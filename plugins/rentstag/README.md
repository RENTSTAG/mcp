# Rentstag

Rentstag is software for landlords. Sign in and Cursor can work from your rental portfolio.

Site: [rentstag.com](https://rentstag.com)

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
      "type": "http",
      "url": "https://mcp.rentstag.com"
    }
  }
}
```

## Skills

Cursor loads these with the plugin:

| Skill | When |
| --- | --- |
| `rentstag-portfolio` | Any Rentstag MCP work — session first, no guessed writes |
| `rentstag-import-portfolio` | Pasted spreadsheet / CSV / JSON into Manage |
| `rentstag-export-portfolio` | Read-only snapshot of buildings, units, contracts, rent |
| `rentstag-troubleshoot` | Tool failures, OAuth, occupancy or rent looking wrong |

## What this repo is

A public Cursor plugin. The MCP server itself stays in the private Rentstag app. This repo only publishes the install card and the skills Cursor should follow.

## Local

For the Rentstag monorepo, keep using `http://localhost:2172/` in that workspace. This plugin is for production.
