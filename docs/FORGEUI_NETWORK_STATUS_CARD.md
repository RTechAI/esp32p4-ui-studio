# ForgeUI Network Status Card

Native Component #10 is the semantic communication-health card for Wi-Fi, Ethernet, MQTT, cloud, local API, internet, and future VPN/cellular presentation. The application owns drivers, protocols, credentials, security, clients, and reconnect logic; ForgeUI performs no networking.

It provides compact, detailed, and dashboard modes; eight stable network states; independent visibility; deterministic Browser Preview scenarios; duplicate-safe identities; fixed-size exported storage; silent Runtime SDK setters; and selected, reconnect-requested, and details-requested UserEvents.

```c
FG_Set_Main_Network_State(FG_NETWORK_STATE_ONLINE);
FG_Set_Main_Network_SSID("Workshop WiFi");
FG_Set_Main_Network_IP("192.168.1.42");
FG_Set_Main_Network_Gateway("192.168.1.1");
FG_Set_Main_Network_RSSI(-58);
FG_Set_Main_Network_Latency(24);
FG_Set_Main_Network_Cloud(true);
FG_Set_Main_Network_MQTT(true);
FG_Set_Main_Network_Status("Connected");
```

Setters update presentation only and never invoke UserEvents. Implement generated `FG_On_Main_Network_Selected`, `FG_On_Main_Network_Reconnect_Requested`, and `FG_On_Main_Network_Details_Requested` hooks in `95_UserEvents.c`.

## ESP32-P4 proof plan

1. Export two independently named Wi-Fi/Ethernet cards and compile with the target LVGL/ESP-IDF toolchain.
2. Feed state, signal, latency, reconnect, MQTT, and cloud values from application-owned networking through Runtime SDK setters.
3. Exercise all three UserEvents and confirm setters remain silent.
4. Verify Wi-Fi connected and SD mounted; exercise Ethernet where available.
5. Run a 10-minute update soak while monitoring RAM, watchdogs, crashes, and duplicate isolation.

Studio/export tests establish readiness; physical results are required before status becomes PROVEN.
