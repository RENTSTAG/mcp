# Rentstag MCP

Hosted [Model Context Protocol](https://modelcontextprotocol.io/) server for occupancy, buildings, units, contracts, and rent.

**URL:** `https://mcp.rentstag.com`

Sign in with WorkOS when the client opens a browser. There is no API key.

## Cursor

1. Settings → **Plugins**
2. **Add from GitHub**
3. `RENTSTAG/mcp`
4. Install **Rentstag**, then complete sign-in

Or add the URL in Settings → **MCP**:

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

## Claude

**Claude.ai:** Settings → Connectors → Add custom MCP → `https://mcp.rentstag.com`

**Claude Code / Desktop:**

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

## ChatGPT

Developer Mode → MCP → add `https://mcp.rentstag.com` → complete sign-in.

## Other MCP clients

Use Streamable HTTP at `https://mcp.rentstag.com`. Server card: [`server.json`](./server.json) and `https://mcp.rentstag.com/.well-known/mcp.json`.

## What you can ask

Occupancy, buildings, units, contracts, and rent in the signed-in organisation. Import a pasted spreadsheet. Export a read-only portfolio snapshot.

Writes need an explicit yes. Viewers can read and analyse; members can commit.

## License

MIT
