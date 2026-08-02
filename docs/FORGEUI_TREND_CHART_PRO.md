# ForgeUI Trend Chart Pro

Trend Chart Pro is the premium, higher-capability companion to the lightweight
Trend Chart. It preserves the same semantic thresholds, fixed history buffer,
stable component identity, Runtime SDK and genuine-user event hooks.

Its optional presentation layer adds a restrained line glow, translucent fill,
threshold bands, premium latest-value marker, subdued engineering grid, compact
footer information, glass surface and shadow. All effects are bounded at export
time; point updates do not allocate memory. Marker pulse is disabled by default,
and animations can be disabled completely.

Use Trend Chart for the smallest deterministic footprint. Use Trend Chart Pro
when the target has PSRAM and a premium dashboard presentation is valuable.

Runtime APIs follow the standard component-ID-derived form:

```c
FG_Add_Engine_Rpm_Point(1825.0f);
FG_Clear_Engine_Rpm();
FG_Set_Engine_Rpm_Range(0.0f, 6000.0f);
FG_Set_Engine_Rpm_Thresholds(4500.0f, 5500.0f);
```

Programmatic SDK calls do not invoke UserEvents. Warning, Alarm and Cleared hooks
are reserved for genuine user/data-source event paths.
