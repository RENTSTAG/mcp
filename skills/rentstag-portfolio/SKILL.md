---
name: rentstag-portfolio
description: Use the Rentstag MCP for occupancy, buildings, units, contracts, and rent. Call session_get first. Never guess write permissions.
---

# Rentstag portfolio

Use the hosted `rentstag` MCP server at `https://mcp.rentstag.com`.

1. Call `session_get` (or trust discover/initialize instructions). Stop if a tool is denied.
2. Call `schema_describe` before inventing contract states, payment statuses, or room types.
3. Reads: list and search tools only.
4. Writes (import commit, upserts) need an explicit yes (`confirm: true`). Do not write on analysis-only prompts.
