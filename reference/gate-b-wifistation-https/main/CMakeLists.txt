idf_component_register(SRCS "station_example_main.c"
                    INCLUDE_DIRS "."
                    PRIV_REQUIRES esp_wifi nvs_flash esp_event esp_netif esp_http_client mbedtls)
