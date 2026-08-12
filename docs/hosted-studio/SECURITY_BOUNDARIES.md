# Security Boundaries

Status: IMPLEMENTED

Hosted Next APIs expose only health, image conversion, and ZIP export. Local flash, serial, Explorer, cleanup, restart, shutdown, and process-control routes remain in the separately launched local bridge. AI endpoints return 404 in hosted server mode.

Controls include body/image limits, strict relative asset paths, sanitized project names, random 144-bit workspace IDs, bounded concurrent exports, subprocess timeouts, non-sensitive errors, no client output paths, and cleanup on success/error/response close. Authentication and account rate limits remain PLANNED.
