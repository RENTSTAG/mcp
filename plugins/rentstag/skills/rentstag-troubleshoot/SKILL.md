---
name: rentstag-troubleshoot
description: Diagnose Rentstag MCP auth, permissions, and portfolio data issues. Use when tools fail, OAuth errors appear, contracts lack units, or rent looks wrong.
---

# Rentstag troubleshoot

Map symptoms to likely causes using session context and MCP tools. Fix guidance only — do not bypass auth or guess write permissions.

## Start here

1. `session_get` — or read MCP discover/initialize instructions. They are authoritative for user, organisations, roles, allowed tools, and denied tools.
2. `schema_describe` — when the issue involves invalid enums (contract state, payment status, room type, recurring period).

If a tool is denied, tell the user and stop. Do not retry with another write tool.

## Symptom map

| Symptom | Likely cause | What to check |
| --- | --- | --- |
| Occupancy / NOI / rent per m² looks invented or disagrees with the home screen | Counted units instead of the dashboard rollup | Call `metrics_get` with `metric` (`occupancy`, `noi`, `rentPerSquareMeter`, …) |
| Rent charged 12 times (monthly rent as one-off payments) | Wrong tool — should be recurring | Use `rent_setup_recurring`; never loop `payments_upsert` for monthly rent |
| Viewer cannot write | Expected — `org_viewer` has `company:content:read` only | User needs `org_member`+ for upserts and `import_commit` |
| OAuth 401 on MCP | Sign-in expired | Sign in again from Cursor Settings → Plugins. Reconnect Rentstag if the prompt does not appear |
| Financial statement tools fail or data looks wrong | Scope or contract id | `search_contract_financial_statement`, `get_contract_overview`; confirm company scope |
| Import rejected | Missing `confirm: true`, batch over limit, or viewer role | Max 40 buildings / 200 units per commit; member+ required |
| Invalid status / room type | Guessed enum | `schema_describe` — allowed values are listed there |

## Security

- Never print secrets, tokens, or env values.
- The hosted server at `https://mcp.rentstag.com` uses WorkOS sign-in, not an API key.
- Do not log encrypted fields (address, email).

## Do not

- Bypass MCP. Portfolio loads go through `import_analyze` / `import_commit`.
- Guess write permissions or retry a denied tool under a different name.

## Escalation

If session shows allowed tools but calls still fail, capture: tool name, error message (redact secrets), role, organisation id.

## Checklist

- [ ] `session_get` / initialize instructions read
- [ ] Symptom matched to the table above
- [ ] `schema_describe` if enums involved
- [ ] No secrets printed
