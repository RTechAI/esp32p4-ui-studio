# ForgeUI Battery Card

Battery Card is Native Component #8. It presents application-supplied battery
condition, electrical measurements, health, energy and time estimates. It is not
a BMS and owns no sensing, charger, contactor, protection or safety logic.

The exported `fg_battery_state_t` is stable. Semantic APIs set state of charge,
state, electrical values, energy, health, estimates and status text. Runtime SDK
calls are silent; genuine card selection may emit a Battery Selected callback.

## ESP32-P4 proof plan

Export multiple duplicated cards, exercise all states and setters with Wi-Fi and
SD active, verify Live/Standalone parity, monitor free RAM, and run a 10-minute
measurement update soak without crashes or watchdog resets before PROVEN status.
