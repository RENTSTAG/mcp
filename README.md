# Rentstag

Cursor plugin that connects agents to [Rentstag](https://rentstag.com) through Rentstag's remote [Model Context Protocol](https://modelcontextprotocol.io/) server.

Ask about occupancy, buildings, units, contracts, and rent in the signed-in organisation. Import a pasted spreadsheet, export a read-only portfolio snapshot, or diagnose tool and permission failures.

## Install

1. Open **Cursor Settings → Plugins**.
2. **Add from GitHub** and enter `RENTSTAG/mcp`.
3. Click **Install**, then complete the WorkOS sign-in prompt.

After the plugin is listed in the Cursor Marketplace, you can also search for **Rentstag** or run `/add-plugin rentstag` in chat.

## MCP

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

Auth is OAuth 2.0 against WorkOS AuthKit. Cursor prompts for sign-in when the plugin connects. There is no API key.

## Skills

Cursor loads these with the plugin:

| Skill | When |
| --- | --- |
| `rentstag-portfolio` | Any Rentstag MCP work — session first, no guessed writes |
| `rentstag-import-portfolio` | Pasted spreadsheet, CSV, or JSON into Manage |
| `rentstag-export-portfolio` | Read-only snapshot of buildings, units, contracts, and rent |
| `rentstag-troubleshoot` | Tool failures, OAuth, occupancy or rent looking wrong |

## Docs

- Product: https://rentstag.com
- Plugin source: https://github.com/RENTSTAG/mcp

Logo is the Rentstag product mark from https://rentstag.com, placed on a white tile with padding so it reads well in the Cursor UI.

## License

MIT
