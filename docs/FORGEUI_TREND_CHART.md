# ForgeUI Native Component #5: Trend Chart

Trend Chart is ForgeUI's semantic live-value history component for industrial,
SCADA, energy, marine, automotive, environmental, and IoT dashboards. It is not
a generic LVGL Chart wrapper: projects provide engineering values while ForgeUI
owns buffering, clipping, range presentation, thresholds, and redraw.

## Semantic model

Trend Chart supports title, engineering units, semantic type, current value,
minimum and maximum, warning and alarm thresholds, 32/64/128/256-sample history,
line colour, fill, grid, axes, legend, latest marker, current-value and min/max
visibility, fixed or automatic scaling, preview simulation, border, background,
rounding, and padding.

Browser and Canvas previews provide deterministic sine, sawtooth, random-walk,
battery-discharge, temperature-drift, and RPM simulations. Runtime application
data replaces preview simulation in generated firmware.

## Runtime SDK

Every instance derives a stable API stem from its persisted component ID:

```c
FG_Add_Engine_Rpm_Point(1825.0f);
FG_Clear_Engine_Rpm();
FG_Set_Engine_Rpm_Range(0.0f, 6000.0f);
FG_Set_Engine_Rpm_Thresholds(4500.0f, 5500.0f);
```

Generated code uses a compile-time fixed `int32_t` history array and LVGL's
circular chart update mode. No allocation occurs when adding or clearing points.
Values are clipped to the active range. Automatic scaling scans only the fixed
instance buffer when a point is added.

Programmatic Runtime SDK calls never invoke UserEvents. Regeneration-safe hook
ownership remains in `95_UserEvents.c`; optional instance hooks are generated as
`FG_On_<Instance>_Warning`, `FG_On_<Instance>_Alarm`, and
`FG_On_<Instance>_Cleared` for application-owned event wiring.

## ESP32-P4 proof plan

1. Place two Trend Charts plus one duplicate on a 1024 x 600 page.
2. Configure 64-, 128-, and 256-sample histories with distinct stable IDs.
3. Export Live Studio and Standalone builds and compare layout, ranges, grids,
   markers, current values, and independent histories.
4. Feed each instance from separate periodic tasks through `FG_Add_*_Point`.
5. Exercise clear, range, and threshold APIs while updates continue.
6. Confirm programmatic calls do not invoke UserEvents; exercise application
   hook wiring independently in `95_UserEvents.c`.
7. Confirm SD remains mounted, Wi-Fi connected, and duplicate APIs remain
   independent.
8. Run a ten-minute continuous-update soak while observing watchdog, crashes,
   heap/PSRAM stability, redraw cadence, and task latency.

Hardware status remains **READY FOR ESP32-P4 PROOF** until this checklist is
executed on a connected board and captured in the proof record.
