# ForgeUI Power Flow Card

Native Component #13 presents application-supplied energy movement across configurable sources, storage, grid, and loads. ForgeUI never senses, calculates balance, controls equipment, or performs safety logic.

## Signed-power convention

- Solar, generator, wind, shore, and generic source values are positive when supplying power.
- Load values are positive when consuming power.
- Battery/storage values are negative while charging and positive while discharging.
- Grid values are positive while importing and negative while exporting.
- ForgeUI displays the supplied system balance unchanged and does not correct inconsistent inputs.

The semantic model contains exactly 17 node slots and 12 connection slots. Export uses fixed arrays, bounded 33-byte node labels and a 65-byte status buffer, no update allocation, no timers, and three base LVGL objects per card. State and node enums are emitted once across duplicates.

Runtime APIs include primary Solar, Load, Battery, Grid and Generator setters plus efficiency, energy, state, online/fault, status, generic node, and generic connection setters. Setters remain silent. Control-request UserEvents are generated only when explicitly enabled.

## ESP32-P4 proof plan

Render Compact, Standard, and System Dashboard cards covering all five topologies plus similarly named duplicates alongside Battery, KPI, Network, Alarm, and Device Summary components. Exercise solar, charge/discharge, import/export, generator, offline/fault, generic nodes/connections and UserEvents. Verify signed formatting, identity isolation, Wi-Fi, SD, Diagnostics, strict-warning compilation, stable RAM/FPS, no crash/watchdog, and a ten-minute soak before PROVEN.
