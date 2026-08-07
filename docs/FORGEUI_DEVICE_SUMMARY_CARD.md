# ForgeUI Device Summary Card

Status: **HARDWARE VALIDATED** (ESP32-P4, 2026-08-07)

Device Summary Card is ForgeUI Native Component #12. It is a compact,
monitoring-only overview of device identity and essential system state, not a
replacement for System Diagnostics.

The default 240 x 145 card shows a title, device name, overall status, uptime,
firmware version, network state, and storage state. Its resize minimum is
220 x 128. Studio Canvas, Browser Preview, Live Studio, and generated LVGL use
the same schema-1 semantic model. Long values use bounded storage and ellipsis.

The Inspector exposes the monitoring fields, four status colours, and Runtime
SDK generation. Overall status uses the safe enum `0` Offline, `1` Online, `2`
Warning, and `3` Error.

Generated silent Runtime SDK APIs derive from the persisted component ID:

- `FG_Set_<Card>_Device_Name(const char *name)`
- `FG_Set_<Card>_Status(int32_t status)`
- `FG_Set_<Card>_Uptime(const char *value)`
- `FG_Set_<Card>_Firmware_Version(const char *value)`
- `FG_Set_<Card>_Network_Status(const char *value)`
- `FG_Set_<Card>_Storage_Status(const char *value)`

Display-name changes do not alter API identity. Duplicate cards receive
distinct persisted IDs, fixed character storage, LVGL object names, and Runtime
SDK functions. Setters are silent. The card has no operator control and
generates zero UserEvents.

No combined authoritative device-summary backend snapshot exists in this pass.
Fields therefore remain authored initial values and runtime-settable. The
component does not invent a manager or couple itself to Wi-Fi, storage,
diagnostics, or an optional System UI page. Applications may project existing
backend snapshots through the semantic setters, independently of optional
System UI page visibility.

The two-instance 1024 x 600 proof payload is
`device-summary-card-proof-payload.json`. Physical ESP32-P4 rendering remains
the outstanding certification gate.
