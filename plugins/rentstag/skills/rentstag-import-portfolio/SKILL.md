---
name: rentstag-import-portfolio
description: Import buildings, units, tenants, and recurring rent into Rentstag via MCP. Use when the user pastes a spreadsheet, CSV, or JSON portfolio.
---

# Rentstag import portfolio

Load a portfolio (buildings → units → tenants → rent) into the active company using the Rentstag MCP server. Never guess permissions, enums, or write paths.

## Before you start

1. Call `session_get` (or trust MCP discover/initialize instructions). If a tool is denied, stop and tell the user they lack permission. Do not retry with a different write tool.
2. Call `schema_describe` before inventing contract states, payment statuses, room types, or recurring periods.
3. Read this skill fully. Do not rely on the description alone.

## Permissions

| Role | Can analyse | Can commit |
| --- | --- | --- |
| `org_viewer` | Yes (`import_analyze`) | No — a member or admin must commit |
| `org_member` and above | Yes | Yes (`import_commit` with `confirm: true`) |

`import_commit` requires `company:content:write` (member+). Viewers can preview only.

## Import flow

1. Confirm the active company (from session or the user).
2. `import_analyze` — pass pasted tables, CSV, or JSON. This returns a proposal only; it does not write.
3. Show the proposal — buildings → units → tenants → rent amounts/cadence. Highlight counts, assumptions, and anything ambiguous. Ask the user to confirm.
4. Wait for an explicit yes — “yes”, “commit”, “go ahead”. Vague acknowledgement is not enough.
5. `import_commit` — pass the analysed structure with `confirm: true`. Without that flag the server rejects the commit.

## Rent rules

- Monthly (or other recurring) rent → `rent_setup_recurring` on the contract, or let `import_commit` create recurring rules from the proposal.
- Never simulate monthly rent with a loop of `payments_upsert`. One-off payments are for deposits, adjustments, and ad-hoc charges only.

## Batch limits

Per `import_commit` call:

- Max 40 buildings
- Max 200 units (total across all buildings in that commit)

If the file is larger, split into multiple commits (by building group or geography). Use multiple `import_commit` calls, not an invented orchestration layer.

## Encrypted fields

Address and email are stored encrypted. Do not log raw addresses or emails in chat, terminal output, or telemetry. Refer to buildings, units, and tenants by name or temp id.

## Optional file upload

For large spreadsheets or lease PDFs, `files_create_upload` mints a short-lived upload URL. Prefer pasted or inline data for small imports.

## Failure handling

- Tool denied — quote the denial from session; suggest switching org or asking an admin to upgrade the role.
- Over batch limit — explain the cap and propose a split before committing.
- Validation error — re-run `schema_describe`, fix enum/status values, re-analyse if needed.
- Do not write outside these MCP tools. Imports go through MCP only.

## Checklist

- [ ] `session_get` or trusted initialize instructions
- [ ] `schema_describe` before enums
- [ ] `import_analyze` → proposal shown
- [ ] Explicit user yes
- [ ] `import_commit` with `confirm: true`
- [ ] Recurring rent via `rent_setup_recurring` / import recurring rules, not payment loops
- [ ] Batches ≤ 40 buildings / 200 units
- [ ] No logged addresses or emails
