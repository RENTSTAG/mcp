---
name: rentstag-export-portfolio
description: Read-only export and summary of a Rentstag portfolio via MCP — buildings, units, contracts, tenants, and recurring rent. Use when the user asks what is in their portfolio.
---

# Rentstag export portfolio

Produce a clear, read-only summary of the user’s portfolio in the active company. No writes.

## Before you start

1. Call `session_get` (or trust MCP discover/initialize instructions) to confirm organisation, company, and allowed tools.
2. Viewers can export — this skill uses list and search tools only (`company:content:read`).

## Tools (read-only)

| Need | Tool |
| --- | --- |
| Cross-entity lookup | `search` |
| Home-screen KPIs (occupancy, rent/m², NOI, DSCR, received, outstanding, capex) | `metrics_get` — pass `metric` |
| Buildings | `buildings_list` |
| Units | `units_list` |
| Rooms | `rooms_list` |
| Tenants / clients | `clients_list` |
| Contracts | `contracts_list` |
| One-off payments | `payments_list` |
| Contract detail | `get_contract_overview` |
| Units on a contract | `list_contract_units` |

Portfolio totals come from `metrics_get`. That is the same path as the Rentstag home screen. Do not invent occupancy or rent-per-m² by counting `units_list` rows.

Do not call upsert, import, or statement write tools for export.

## Output format

Summarise for a human reader:

1. Scope — organisation and company name (ids only if the user asks).
2. Buildings — count and names; city if useful.
3. Units — count per building; occupancy hints where visible from contracts.
4. Contracts — active vs draft/archived; linked tenant names.
5. Recurring rent — amount, currency, cadence per contract where available.
6. Gaps — units without contracts, contracts without recurring rent.

Do not dump internal ids unless the user asks. Do not log addresses or emails. Do not mutate data to “fix” the export view.

## Large portfolios

Paginate or filter with `search` and list tools. If the portfolio is huge, offer a sectional summary (one building at a time).

## Checklist

- [ ] Session confirmed; read-only tools only
- [ ] Buildings, units, contracts, recurring rent covered
- [ ] Human-readable summary without internal ids (unless requested)
- [ ] No writes
