# ForgeUI KPI Card

Native Component #12 presents application-owned metrics in Percentage, Numeric, Delta, Status, Progress, and Target vs Actual modes. ForgeUI owns bounded formatting, progress, delta, status colour, identity-scoped Runtime SDK functions, and Selected/Details UserEvents; it does not assign business meaning or derive values.

Each instance uses fixed storage for four floats, one RGB value, and bounded units/status/updated strings. Export composition uses a private root, title, value label, progress bar, and optional Details button/label: up to six LVGL objects. Setters allocate no memory, start no timers, and remain silent.

## ESP32-P4 proof plan

Render every mode plus similarly named duplicates beside Device Summary and Network Status cards. Exercise all eight setters and both UserEvents, confirm clamping, formatting, colour, target/delta presentation, independent identity routing, stable RAM/FPS, strict-warning compilation, and a ten-minute soak. Physical proof is required before PROVEN.
