# Rentstag

Plugin for Cursor and Claude Code. Occupancy, buildings, units, contracts, and rent.

## Cursor

1. Settings → **Plugins**
2. **Add from GitHub**
3. `RENTSTAG/mcp`
4. Install **Rentstag**, then sign in

## Claude Code

```
claude plugin marketplace add RENTSTAG/mcp
claude plugin install rentstag
```

Then sign in.

<details>
<summary>Manual setup</summary>

Use this only if the client has no plugin. You need both the MCP server and the skills. The URL alone is incomplete.

MCP: Streamable HTTP at `https://mcp.rentstag.com`. Server card: [`server.json`](./server.json).

Skills (copy or upload every folder in [`plugins/rentstag/skills`](plugins/rentstag/skills)):

- `rentstag-portfolio`
- `rentstag-import-portfolio`
- `rentstag-export-portfolio`
- `rentstag-troubleshoot`

**Cursor:** add the MCP URL, then copy the skill folders into `.cursor/skills/` (or `.agents/skills/`).

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

**Claude.ai / Claude Desktop:** Settings → Connectors → add the MCP URL, then upload each skill folder (or attach the `SKILL.md` files as project instructions).

**ChatGPT:** Developer Mode → MCP → add the URL and sign in, then Plugins → Skills → upload each skill folder.

</details>

## What you can ask

Occupancy, buildings, units, contracts, and rent in the signed-in organisation. Import a pasted spreadsheet. Export a read-only portfolio snapshot.

Writes need an explicit yes. Viewers can read and analyse; members can commit.

## License

MIT
