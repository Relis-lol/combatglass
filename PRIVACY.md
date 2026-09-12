# Privacy

CombatGlass is designed to work locally without an account or CombatGlass-owned
backend.

## Current development preview

The current private application build uses synthetic Demo Mode data only. It
does not make live capture available and does not contact external services.

## Version 0.x commitments

- No telemetry, analytics, advertising, fingerprinting or crash-reporting SaaS.
- No account, login, device identity, licence server or cloud history.
- No automatic fight, screenshot or diagnostic upload.
- No silent external HTTP requests and no local network listener.
- No raw packet storage during normal operation.
- No logs containing payloads, IP or MAC addresses, Windows usernames, home
  paths, browser/Discord traffic, cookies, tokens or unrelated network data.
- Local history will be bounded, visible and deletable.
- Streamer Mode replaces player names locally with encounter-stable aliases.

## What CombatGlass will read

If live capture is validated and enabled in a future build, CombatGlass will
passively observe the narrowest practical subset of network traffic already
received by the PC that is necessary to derive supported combat events.
Unrelated traffic will be discarded as early as practical.

## What CombatGlass will not read or do

CombatGlass does not open the AION 2 process, read process memory, read the game
window title, read game installation files, install input hooks, inject code,
hook graphics APIs, send or modify packets, automate gameplay or operate as a
VPN/proxy.

## Local history and diagnostics

Persistent history is not implemented yet, so there is not yet a data-folder
location to publish. Before persistence ships, the app and this document will
name the exact folder and provide Open Data Folder, Clear History and Delete All
Local History controls.

Future diagnostic exports will show the categories included before a file is
saved. They may contain app/Windows/Npcap versions, capture/parser status,
recognized/rejected counts and internal error codes. They will not contain raw
packets, network addresses, hardware IDs, usernames, credentials or unrelated
traffic.

Last updated: 2026-09-12.

