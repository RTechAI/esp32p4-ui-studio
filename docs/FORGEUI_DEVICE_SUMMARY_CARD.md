# ForgeUI Device Summary Card

Native Component #11 is the high-level semantic overview for an embedded controller, HMI, gateway, machine, or device. It presents application-supplied identity, firmware, uptime, explicit health, connectivity, storage, alarms, power, and maintenance state. ForgeUI formats and displays this data; it does not detect hardware, aggregate health, manage devices, or read other component instances.

The card supports Compact, Detailed, and System Dashboard modes, deterministic preview scenarios, visibility controls, duplicate-safe identities, fixed buffers, silent Runtime SDK setters, and developer-owned UserEvents in `95_UserEvents.c`.

Generated enums are `fg_device_health_t`, `fg_device_power_t`, and the shared `fg_network_state_t`. Primary setters cover name, type, model, firmware, build, health, uptime seconds, network state, IP, storage/free bytes, alarm counts, power source, battery percentage, maintenance, and status.

Export composition uses one private root, title, and summary label plus three optional action button/label pairs (up to nine LVGL objects). Static semantic storage is approximately 500 bytes per instance, depending on target ABI, with bounded arrays and no allocation or timers during updates.

## ESP32-P4 proof plan

Create Compact, Detailed, and System Dashboard cards plus two similarly named duplicates alongside Network Status, Battery, Alarm Panel, IO Monitor, and Tank Level components. Enable Wi-Fi, SD, and Diagnostics. Exercise every Device setter and UserEvent; verify formatting, visibility, independent targeting, silent setters, stable RAM/FPS, strict-warning compilation, no crash/watchdog, and a ten-minute soak. Browser tests establish readiness only; physical evidence is required before PROVEN.
