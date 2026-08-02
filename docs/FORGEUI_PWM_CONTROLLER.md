# ForgeUI PWM Controller

Status: **IMPLEMENTED — READY FOR HARDWARE PROOF**. Physical ESP32-P4 proof has not yet been claimed.

PWM Controller is ForgeUI Native Component #4. One persisted Studio widget owns semantic label, subtitle, value, range, step, unit, enabled/presentation settings, orientation, accent and status. Its labels, slider, switch and card containers are private LVGL objects and are never persisted child widgets.

ForgeUI owns UI state only. GPIO selection, LEDC timers/channels, polarity, duty mapping and safety remain developer-owned in `95_UserEvents.c`.

## Generated contract

```c
void FG_Set_Comp_Fan_Output_Value(float value);
float FG_Get_Comp_Fan_Output_Value(void);
void FG_Set_Comp_Fan_Output_Enabled(bool enabled);
bool FG_Get_Comp_Fan_Output_Enabled(void);
void FG_On_Comp_Fan_Output_Value_Changed(float value);
void FG_On_Comp_Fan_Output_Enabled_Changed(bool enabled);
```

Setters clamp and step-quantize, update semantic state and LVGL, and suppress UserEvents. User interaction emits hooks. Symbols derive from stable persisted component ID, not editable label.

## ESP32-P4 proof procedure

1. Add two instances, rename their visible labels, and generate/flash Live firmware.
2. Confirm both render, Wi-Fi connects and SD remains mounted.
3. Drag through minimum, step-aligned intermediate values and maximum; confirm displayed values and one value hook log per deliberate change.
4. Toggle enable off/on; confirm disabled styling and one enabled hook log per deliberate toggle.
5. From LVGL task context call value setters below/above range and at a fractional value; confirm clamp/quantization, UI updates and no UserEvents.
6. Call enabled setters repeatedly; confirm UI updates and no UserEvents.
7. Regenerate after label changes; confirm customised hooks and persisted-ID symbols remain stable.
8. Build/flash Standalone Export and repeat steps 2–6.
9. Exercise for ten minutes; confirm Wi-Fi connected, SD mounted, no crash, watchdog or state coupling.

Only then promote to **PROVEN**.

## Hardware evidence received — 2026-08-02

The initial ESP32-P4 pass physically confirms that multiple PWM Controllers render and change independently. `Comp MSBOZT2 XBP996` and `Comp MSBOX6 QTG8 Z2 W` emitted separate value callbacks with correct identity routing and no observed cross-component routing. Value sweeps behaved correctly through 100. SD remained `READY`; no crash or watchdog reset occurred; and reported RAM remained within the established operational range.

Promotion remains explicitly gated on four results: independent enable-switch behavior, silent Runtime SDK setter behavior, connected-Wi-Fi stability, and the final five-to-ten-minute soak.

## Temporary Runtime SDK proof procedure

Run the following once from LVGL task context in a temporary developer-owned `95_UserEvents.c`/application proof path. Do not place it in managed `90_Studio_Export.c`, and remove it after validation. A and B use the two active persisted identities:

```c
/* TEMP PWM FINAL PROOF — remove after recording results. */
FG_Set_Comp_MSBOX6_QTG8_Z2_W_Value(-25.0f);
printf("PWM A below: %.3f\n", (double)FG_Get_Comp_MSBOX6_QTG8_Z2_W_Value());
FG_Set_Comp_MSBOX6_QTG8_Z2_W_Value(42.6f);
printf("PWM A fractional: %.3f\n", (double)FG_Get_Comp_MSBOX6_QTG8_Z2_W_Value());
FG_Set_Comp_MSBOX6_QTG8_Z2_W_Value(125.0f);
printf("PWM A above: %.3f\n", (double)FG_Get_Comp_MSBOX6_QTG8_Z2_W_Value());
FG_Set_Comp_MSBOX6_QTG8_Z2_W_Enabled(false);
printf("PWM A disabled: %s\n", FG_Get_Comp_MSBOX6_QTG8_Z2_W_Enabled() ? "true" : "false");
FG_Set_Comp_MSBOX6_QTG8_Z2_W_Enabled(true);
printf("PWM A enabled: %s\n", FG_Get_Comp_MSBOX6_QTG8_Z2_W_Enabled() ? "true" : "false");

FG_Set_Comp_MSBOZT2_XBP996_Value(-25.0f);
printf("PWM B below: %.3f\n", (double)FG_Get_Comp_MSBOZT2_XBP996_Value());
FG_Set_Comp_MSBOZT2_XBP996_Value(42.6f);
printf("PWM B fractional: %.3f\n", (double)FG_Get_Comp_MSBOZT2_XBP996_Value());
FG_Set_Comp_MSBOZT2_XBP996_Value(125.0f);
printf("PWM B above: %.3f\n", (double)FG_Get_Comp_MSBOZT2_XBP996_Value());
FG_Set_Comp_MSBOZT2_XBP996_Enabled(false);
printf("PWM B disabled: %s\n", FG_Get_Comp_MSBOZT2_XBP996_Enabled() ? "true" : "false");
FG_Set_Comp_MSBOZT2_XBP996_Enabled(true);
printf("PWM B enabled: %s\n", FG_Get_Comp_MSBOZT2_XBP996_Enabled() ? "true" : "false");
```

Expected getters are `0`, the configured step-quantized result for `42.6`, `100`, `false`, then `true`, independently for each card. The visible UI must follow only the addressed identity. No `FG_On_*_Value_Changed` or `FG_On_*_Enabled_Changed` output may appear for these calls.

## Next architecture sprint (recorded, not implemented)

After PWM promotion, the next platform milestone is the **ForgeUI ESP32-S3 Simulator Platform**: simulated digital inputs and outputs, PWM, analogue, battery, tank, motor and relay behavior; Wi-Fi communication; repeatable hardware validation; a future Test Certificate Card; and a public hardware-proof workflow. No simulator implementation belongs in this PWM closure task.
