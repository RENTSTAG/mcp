---
name: rentstag-portfolio
description: Use the Rentstag MCP for occupancy, buildings, units, contracts, and rent. Call session_get first. Never guess write permissions.
---

# Rentstag portfolio

Use the hosted `rentstag` MCP server at `https://mcp.rentstag.com`.

1. Call `session_get` (or trust discover/initialize instructions). They are authoritative for organisations, roles, allowed tools, and denied tools. Stop if a tool is denied.
2. Call `schema_describe` before inventing contract states, payment statuses, room types, or recurring periods.
3. Reads: list and search tools only. Home-screen KPIs come from `metrics_get`, not from counting list rows.
4. Writes (import commit, upserts) need an explicit yes (`confirm: true`). Do not write on analysis-only prompts.
5. Recurring rent uses `rent_setup_recurring`. Never loop `payments_upsert` for monthly rent.
6. Do not log addresses or emails. Refer to buildings, units, and tenants by name.
