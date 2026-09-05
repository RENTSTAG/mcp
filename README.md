# Rentstag MCP

The Cursor plugin is the install. It wires MCP at `https://mcp.rentstag.com` and loads the four skills. Adding the MCP URL alone is incomplete.

Skills live in `plugins/rentstag/skills/` and are:

- `rentstag-portfolio`
- `rentstag-import-portfolio`
- `rentstag-export-portfolio`
- `rentstag-troubleshoot`

Sign in with WorkOS when the client opens a browser. There is no API key.

## Cursor (recommended)

1. Settings → **Plugins**
2. **Add from GitHub**
3. `RENTSTAG/mcp`
4. Install **Rentstag**, then sign in with WorkOS

## Cursor without the plugin

Use this only if you cannot install the plugin. You still need the skills.

Add the HTTP MCP server:

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

Then copy all four folders from `plugins/rentstag/skills/` into the project's `.cursor/skills/` (or `.agents/skills/`).

## Claude Code (recommended)

```
/plugin marketplace add RENTSTAG/mcp
/plugin install rentstag@rentstag
```

Then sign in.

## Claude.ai / Claude Desktop without the plugin

Settings → Connectors → add `https://mcp.rentstag.com`.

Then upload each folder in `plugins/rentstag/skills` as skills (or attach the `SKILL.md` files as project instructions).

## ChatGPT

Do not add the MCP URL alone.

1. Developer Mode → MCP → `https://mcp.rentstag.com` → sign in
2. Plugins → Skills → upload each folder from `plugins/rentstag/skills`

## Other MCP clients

Use Streamable HTTP at `https://mcp.rentstag.com` plus the four skills as instructions. Server card: [`server.json`](./server.json) and `https://mcp.rentstag.com/.well-known/mcp.json`.

## What you can ask

Occupancy, buildings, units, contracts, and rent in the signed-in organisation. Import a pasted spreadsheet. Export a read-only portfolio snapshot.

Writes need an explicit yes. Viewers can read and analyse; members can commit.

## License

MIT
