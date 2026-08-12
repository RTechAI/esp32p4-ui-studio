# Validation

Status: VALIDATED

The normal linted and type-checked Next.js production build is VALIDATED in Hosted mode. The focused regression pass completed 23 suites and 184 tests with no failures, covering runtime capabilities, shared local materialization, hosted route restrictions, name/path rejection, workspace isolation, concurrent exports, zero/one/multiple assets, ZIP contents and cleanup, LOCAL-mode behavior, and Hosted AI gating.

The built production server is VALIDATED for the Studio HTTP response, health endpoint, blocked local-machine routes, image conversion, asset-bearing ZIP export, ZIP structure and path hygiene, and temporary-workspace cleanup. A project downloaded through the Hosted export path clean-built with ESP-IDF 5.5.4.

Interactive browser actions and browser-console inspection remain PLANNED as a manual private-environment proof. The Docker definition is IMPLEMENTED but is not yet VALIDATED because Docker was unavailable locally.

VPS deployment and production operation remain PLANNED.
