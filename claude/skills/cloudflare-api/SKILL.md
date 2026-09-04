---
name: cloudflare-api
description: Use when a task needs to read or edit Cloudflare DNS records, or Cloudflare Tunnel (cloudflared) ingress routing, via the REST API directly with curl.
---

# Cloudflare API

There is no Cloudflare MCP server configured. Use `curl` against
`https://api.cloudflare.com/client/v4` with the token in `$CLOUDFLARE_API_TOKEN`
(exported in `~/.zshrc`, available to both Claude Code and opencode shells).

```bash
curl -s "https://api.cloudflare.com/client/v4/<path>" \
  -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" -H "Content-Type: application/json"
```

## Scope of this token

- `Zone → DNS → Edit`, resource-limited to the **conolorapalomitas.es** zone only.
  It cannot see or edit DNS for any other zone (ayoub.es, radarpdi.es, etc.) —
  a `GET /zones?name=<other-domain>` will just come back empty.
- `Account → Cloudflare Tunnel → Edit`, which is **account-wide** — it can read
  and rewrite the ingress config of *any* tunnel on the account, not just
  conolorapalomitas's. Treat tunnel edits as touching shared infrastructure.

## Known IDs (Sergicrh@gmail.com's Account)

- Account ID: `f1d98085bfe002cf9610a123ba8671d9`
- Zone ID (conolorapalomitas.es): `b2e534b1af9146f4164d220239878552`
- Tunnel `vps` (healthy, runs on the shared VPS behind `ssh vps`, origin IP
  `79.117.136.8`): `8affd0ad-25ce-40bb-9eb9-6e71dc6bad89`
- Tunnel `vpn` (status: down, unused): `e48eef9b-25cd-4e89-be9e-4605e68b6ebd`

## DNS records (zone-scoped)

```bash
# list
curl -s "https://api.cloudflare.com/client/v4/zones/<zone_id>/dns_records" \
  -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN"

# create a proxied CNAME to a tunnel
curl -s -X POST "https://api.cloudflare.com/client/v4/zones/<zone_id>/dns_records" \
  -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" -H "Content-Type: application/json" \
  --data '{"type":"CNAME","name":"<subdomain>","content":"<tunnel_id>.cfargotunnel.com","proxied":true}'
```

## Tunnel ingress (account-wide, shared across projects)

The `vps` tunnel already routes `ayoub.es`/`www`/`dev.ayoub.es`/`origin.ayoub.es`
and `radarpdi.es`/`www`/`dev.radarpdi.es` to their own local Caddy ports.
`dev.conolorapalomitas.es` was added there too, pointing at `127.0.0.1:8082`
(conolorapalomitas's own Caddy container on the shared VPS, kept off the
public 80/443 ports that `ayoub-caddy` already owns).

**Always GET the current config, edit only the relevant entry in the JSON,
and PUT the whole thing back** — a PUT replaces the entire ingress list, and
this tunnel serves multiple unrelated sites. The catch-all
`{"service": "http_status:404"}` rule must stay last (Cloudflare matches
ingress rules top to bottom, first match wins).

```bash
# read current config
curl -s "https://api.cloudflare.com/client/v4/accounts/<account_id>/cfd_tunnel/<tunnel_id>/configurations" \
  -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN"

# write back (whole ingress array, catch-all last)
curl -s -X PUT "https://api.cloudflare.com/client/v4/accounts/<account_id>/cfd_tunnel/<tunnel_id>/configurations" \
  -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" -H "Content-Type: application/json" \
  --data '{"config":{"ingress":[...],"warp-routing":{"enabled":false}}}'
```

Because this mutates infrastructure shared with other live sites, confirm
the exact diff with the user before applying a PUT — don't just describe it,
show the added/changed/removed ingress entries.
