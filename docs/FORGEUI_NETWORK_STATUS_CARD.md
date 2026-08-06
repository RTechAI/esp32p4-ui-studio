# ForgeUI Network Status Card

Status: **HARDWARE VALIDATED** (2026-08-07)

Network Status Card is ForgeUI Native Component #11. It is a compact, read-only
connectivity monitor for Wi-Fi, Ethernet, cellular, or another interface. The
Studio default is a connected `ForgeUI-Lab` network at `192.168.1.42`, 78%
signal, with `forgeui-p4` as the device label and `Online` status.

The Inspector exposes title, compact mode, interface type, connection state,
network name, IP address, signal strength, hostname, status text,
connected/disconnected colours, and Runtime SDK generation. Studio Canvas,
Browser Preview, Live Studio, and generated LVGL share the same semantic model.

Generated LVGL 9.2 uses ordinary labels, objects, and a bar with fixed character
buffers. Runtime APIs derive from persisted component identity, remain stable
across display-name changes, and isolate duplicate instances:

- `FG_Set_<Card>_Connected(bool connected)`
- `FG_Set_<Card>_Network_Name(const char *name)`
- `FG_Set_<Card>_IP_Address(const char *ip)`
- `FG_Set_<Card>_Signal_Strength(int32_t percent)`
- `FG_Set_<Card>_Status_Text(const char *text)`
- `FG_Set_<Card>_Network_Type(int32_t type)` (`0` Wi-Fi, `1` Ethernet, `2` cellular, `3` other)

Signal strength is clamped to 0–100. Setters update presentation silently. The
component has no controls and intentionally generates zero UserEvents.

Canvas values are design-time and initial LVGL values. On hardware, the
generated runtime obtains the live Wi-Fi snapshot and overrides the monitoring
fields when backend data becomes available. This projection is independent of
whether the optional System Wi-Fi Manager page is open.

Physical ESP32-P4 validation confirmed disconnected and connected projection,
real SSID and DHCP IPv4 display, RSSI-derived percentage updates, and
Online/Offline transitions without opening the System Wi-Fi Manager.

Native monitoring projections must not depend on optional System UI visibility.
The generated runtime order is:

```text
backend pump -> snapshot -> Native Component projection
             -> optional System UI page gate -> System UI projection
```
