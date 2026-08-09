# ForgeUI Weather Background Pack

The Weather Background Pack is a reusable, Studio-owned set of seventeen local assets:

Hot Sunny, Windy, First Light, Last Light, Golden, Sunny, Partly Cloudy Night, Rain Night, Frosty, Snow, Fog, Thunderstorm, Rain, Overcast, Partly Cloudy Day, Clear Night, and Clear Day.

The original PNGs under `firmware/ForgeUI-One/main/assets/uploads/_input` are permanent Studio-owned source assets. `studio/src/forgeui/weather/ForgeUIWeatherBackgrounds.ts` owns their semantic registry and the Weather 04 mapping, and `studio/src/forgeui/ForgeUIAssetRegistry.ts` exposes the pack to Studio. The ten runtime RGB565 C sources under `firmware/ForgeUI-One/main/assets/uploads` are permanent, source-controlled derived assets. They are distinct from hash-named Fi icon conversion outputs, which are ephemeral and must be materialized by the canonical icon pipeline before strict export validation.

## Weather 04 V1 dependency set

Hardware Example 04 can reach exactly ten backgrounds: Clear Day, Clear Night, Partly Cloudy Day, Partly Cloudy Night, Overcast, Fog, Rain, Rain Night, Snow, and Thunderstorm. Hot Sunny, Windy, First Light, Last Light, Golden, Sunny, and Frosty remain manual/future library choices. A seventeen-item Studio library does not imply seventeen compiled firmware assets.

Selection uses the existing Open-Meteo `weather_code` and `is_day`. Runtime changes the source on the existing LVGL background image, does not rebuild the screen, avoids a duplicate assignment when the selection is unchanged, and makes no extra network request. All artwork is local ForgeUI content; Open-Meteo supplies data, not these images.

## Export and cleanup contract

Export is dependency-driven. Unrelated projects do not inherit Weather sources. Canonical `assets/...` paths resolve relative to `firmware/ForgeUI-One/main`, and standalone export copies the corresponding structure into its own `main`. Source PNGs, the semantic registry and ten permanent derived sources survive firmware build deletion, Studio restart and repository clone. Cleanup must not rely on build, cache, temporary or prior-export copies. Strict validation refuses a missing generated C source.
