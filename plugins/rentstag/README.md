# Rentstag

Rentstag is software for landlords. Sign in and your AI client can work from your rental portfolio.

Site: [rentstag.com](https://rentstag.com)

## Install

### Claude Code

```
/plugin install rentstag --marketplace RENTSTAG/mcp
```

### Claude Desktop

1. Settings → **Plugins** → **Add** → **Add marketplace**
2. `RENTSTAG/mcp`
3. Sync, install **Rentstag**, then sign in

### Cursor

1. Cursor → **Settings → Plugins**
2. **Add from GitHub**
3. `RENTSTAG/mcp`
4. Sign in when Cursor opens the browser

Do not paste the MCP config by hand. The plugin adds this server:

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

| Skill | When |
| --- | --- |
| `rentstag-portfolio` | Any Rentstag MCP work — session first, no guessed writes |
| `rentstag-import-portfolio` | Pasted spreadsheet / CSV / JSON into Manage |
| `rentstag-export-portfolio` | Read-only snapshot of buildings, units, contracts, rent |
| `rentstag-troubleshoot` | Tool failures, OAuth, occupancy or rent looking wrong |

## Data

The plugin connects to the hosted Rentstag MCP server at `https://mcp.rentstag.com`. You sign in with your Rentstag account, and the server only reads or writes data in organisations your account can access. Writes need an explicit yes. Privacy: [rentstag.com](https://rentstag.com/).

## What this repo is

A public plugin. The MCP server itself stays in the private Rentstag app. This repo only publishes the install card and the skills your client should follow.
