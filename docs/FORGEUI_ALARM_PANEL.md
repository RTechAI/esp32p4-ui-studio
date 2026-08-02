# ForgeUI Alarm Panel

Alarm Panel is ForgeUI Native Component #6. It presents application-owned alarms
without owning fault detection, safety decisions or business logic.

It supports Information, Notice, Warning, Alarm and Critical severity; active,
acknowledged and cleared states; Compact, List and Banner presentation; fixed
16/32/64-record capacities; deterministic simulations; filtering and ordering.

The generated Runtime SDK is semantic and never exposes LVGL list primitives:

```c
FG_Add_Main_Alarm("ENGINE_TEMP", "Engine Temperature High", FG_ALARM_CRITICAL);
FG_Acknowledge_Main_Alarm("ENGINE_TEMP");
FG_Clear_Main_Alarm("ENGINE_TEMP");
FG_Clear_All_Main_Alarms();
```

Programmatic calls are silent. Genuine interaction may call
`FG_On_Main_Alarm_Selected`, `FG_On_Main_Alarm_Acknowledged` and
`FG_On_Main_Alarm_Cleared`, each with a stable alarm ID.

## ESP32-P4 proof plan

Export two panels with different capacities and duplicate one instance. Exercise
add, acknowledge, clear, clear-all, filtering and ordering while Wi-Fi remains
connected and SD is mounted. Record boot/free-heap diagnostics, run a 10-minute
alarm-storm soak, and confirm stable RAM, responsive interaction, no crash and no
watchdog reset before marking the component PROVEN.
