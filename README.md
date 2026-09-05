# Rentstag

Occupancy, buildings, units, contracts, and rent. Open your client, install the plugin, then sign in.

<details>
<summary>Cursor</summary>

1. Settings → **Plugins**
2. **Add from GitHub**
3. `RENTSTAG/mcp`
4. Install **Rentstag**, then sign in

</details>

<details>
<summary>Claude Desktop</summary>

Use Desktop, not Claude.ai.

1. Settings → **Plugins** → **Add** → **Add marketplace**
2. `RENTSTAG/mcp`
3. Sync, install **Rentstag**, then sign in

</details>

<details>
<summary>Claude Code</summary>

```
claude plugin marketplace add RENTSTAG/mcp
claude plugin install rentstag
```

Then sign in.

</details>

<details>
<summary>Claude.ai</summary>

Settings → Connectors → add `https://mcp.rentstag.com`.

Then upload each folder in [`plugins/rentstag/skills`](plugins/rentstag/skills) (or attach the `SKILL.md` files as project instructions). The URL alone is incomplete.

</details>

<details>
<summary>ChatGPT</summary>

1. Developer Mode → MCP → `https://mcp.rentstag.com` → sign in
2. Plugins → Skills → upload each folder in [`plugins/rentstag/skills`](plugins/rentstag/skills)

The URL alone is incomplete.

</details>

<details>
<summary>Other clients</summary>

Streamable HTTP at `https://mcp.rentstag.com` plus every folder in [`plugins/rentstag/skills`](plugins/rentstag/skills). Server card: [`server.json`](./server.json). The URL alone is incomplete.

</details>

## What you can ask

Occupancy, buildings, units, contracts, and rent in the signed-in organisation. Import a pasted spreadsheet. Export a read-only portfolio snapshot.

Writes need an explicit yes. Viewers can read and analyse; members can commit.

## License

MIT
