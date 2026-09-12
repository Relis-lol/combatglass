# Security

## Reporting a vulnerability

Please do not open a public issue for a vulnerability or attach sensitive data.
Use GitHub's private vulnerability reporting feature for this repository. If it
is unavailable, open a minimal public issue asking for a private contact channel
without including technical details.

Do not send packet captures, credentials, signing material, tokens, private logs
or unrelated traffic.

## Security posture

CombatGlass is designed around a receive-only boundary:

- no game-process access, injection or graphics hooks;
- no input hooks or automation;
- no packet sending, modification, delay or proxying;
- no local TCP, UDP or HTTP listener;
- bounded buffers, queues, frames, histories and replay data;
- fail-closed protocol handling;
- no network-controlled allocation sizes or file paths;
- normal-user UI with a minimal elevated capture helper only if required;
- no public executable until manual security and release approval.

The public repository contains no application source. Its CI rejects common
application-source, packet-capture, secret, signing and binary patterns.

## Release verification

There are no releases yet. Future official releases are expected to include a
recorded source commit, SHA-256 hashes and Authenticode signatures when signing
is available. CombatGlass is not currently represented as signed.

