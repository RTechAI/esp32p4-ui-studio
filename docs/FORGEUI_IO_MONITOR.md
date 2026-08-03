# ForgeUI IO Monitor

IO Monitor is Native Component #7. Applications own GPIO, polarity, debounce,
drivers and safety logic; ForgeUI owns semantic presentation, grouping, stable
identity, Runtime SDK and genuine interaction events.

It supports 4, 8, 16, 24 or 32 fixed channels, Compact Grid, Detailed Grid and
List modes, fourteen semantic channel types and OFF, ON, Active, Inactive,
Fault, Disabled and Unknown states.

```c
FG_Set_Main_IO_Channel(0, true);
FG_Set_Main_IO_Channel_State(3, FG_IO_STATE_FAULT);
FG_Set_Main_IO_Label(3, "Engine Start");
FG_Set_Main_IO_All(false);
```

Programmatic setters are silent. Genuine interaction can invoke
`FG_On_Main_IO_Channel_Selected(uint32_t channel)` and
`FG_On_Main_IO_Output_Changed(uint32_t channel, bool enabled)`.

## ESP32-P4 proof plan

Export multiple and duplicated monitors at different capacities. Exercise every
setter, selectable writable outputs, filters and fault states with Wi-Fi connected
and SD mounted. Record free RAM, run a 10-minute update soak, and confirm stable
memory, no crash and no watchdog before promotion to PROVEN.
