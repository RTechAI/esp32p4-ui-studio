# ForgeUI Tank Level Card

Native Component #9 presents application-supplied storage levels. Sensors,
calibration, geometry, volume/flow calculations, controls and safety logic remain
application-owned. ForgeUI performs no engineering calculations.

The shared exporter emits stable `fg_tank_state_t`, semantic level, volume,
capacity, state, flow, threshold and status setters. Runtime setters are silent.

## ESP32-P4 proof plan

Export multiple duplicated tanks, exercise states, thresholds and setters with
Wi-Fi and SD active, monitor RAM, and run a 10-minute soak without cross-talk,
crashes or watchdog resets before PROVEN status.
