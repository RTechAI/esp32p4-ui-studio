# ARCHIVED HANDOFF — HARDWARE EXAMPLE 02 I2C PHYSICAL PROOF

Status: **COMPLETED / SUPERSEDED / CLOSED 2026-08-08**.

Hardware Example 02 is physically proven with an MB85RC256V at `0x50`, Device-ID
`00 A5 10`, write/read PASS and persistence PASS across a complete power cycle.
The authoritative closure record is
`11.02_ESP32_P4_WIFI6_TOUCH_7B__EXAMPLE_02__I2C_FRAM.md`. The text below is
retained only as historical pre-proof planning and is not a current mission.

## Established baseline

- The ForgeUI Native Component platform is already proven.
- Hardware Example infrastructure now exists in the Studio left tray.
- Hardware Example 01 establishes the editable GPIO input/output pattern for
  the Waveshare ESP32-P4-WIFI6-Touch-LCD-7B.
- The board master is
  `11_ESP32_P4_WIFI6_TOUCH_7B_BOARD_PINOUT_MASTER.md`; Example 01 is `11.01`.
- Developer-owned hardware behavior lives outside generated LVGL and uses the
  public generated Runtime SDK and genuine UserEvents.
- The board rear-photograph, connector evidence, pin-ownership audit, allocation
  register, and evidence-based physical-proof rules are established.
- Hardware Example 01 is the first fully physically proven ForgeUI Hardware
  Example. It proves physical digital input → ForgeUI UI and ForgeUI UI →
  physical digital output, while preserving the developer-owned hardware-code,
  generated Runtime SDK, and genuine UserEvent boundaries.
- Example 01 also establishes board-specific wiring/proof documentation and a
  permanent board GPIO allocation/proof record.

## Historical mission: Hardware Example 02 (completed)

Scott will supply the physical breakout and front/rear photographs in the next
session. Choose one real I2C breakout from that evidence; do not guess or invent
the device. First record:

- manufacturer, model, and chip;
- clear front and rear photographs;
- all printed pin labels;
- operating voltage;
- I2C address and address-selection options;
- interrupt pins, if present; and
- authoritative module documentation and chip datasheet.

Then audit the existing board master and current BSP/firmware ownership for the
correct available I2C connection. Do not assume that a photographed connector or
an I2C-labelled header is electrically available without reconciling ownership.

Create:

`11.02_ESP32_P4_WIFI6_TOUCH_7B__EXAMPLE_02__<DEVICE>.md`

Keep the first I2C proof deliberately simple:

`physical I2C device → developer driver/read logic → ForgeUI Runtime SDK → live editable widget`

Where appropriate, also prove:

`ForgeUI control → genuine UserEvent → developer-owned I2C write → physical device`

Leave behind an editable UI, wiring guide, developer code, generated API usage,
physical proof record, and board allocation update. Continue progressively:
GPIO → I2C → sensors/actuators → joystick/ADC/PWM → I3C → CAN → RS485 → Modbus.

Physical proof must remain evidence-based throughout.
