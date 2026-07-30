import React, { useEffect, useMemo, useState } from 'react'
import { Box, Grid, Progress, Text, VStack } from '@chakra-ui/react'
import { useForgeTheme } from '~forgeui/theme/ForgeThemeContext'
import { useForgeUISystem } from './ForgeUISystemContext'
import {
  createUnavailableDiagnosticsModel,
  diagnosticHealth,
  diagnosticHealthColour,
  formatDiagnosticBytes,
} from './ForgeUIDiagnosticsModel'

const ValueGrid = ({ values }: { values: Array<[string, React.ReactNode]> }) => (
  <Grid templateColumns="minmax(120px, 1fr) 1fr" gap="5px 14px" fontSize="14px">
    {values.map(([label, value]) => (
      <React.Fragment key={label}>
        <Text opacity={0.68}>{label}</Text><Text fontWeight="semibold">{value ?? 'Not Available'}</Text>
      </React.Fragment>
    ))}
  </Grid>
)

const DiagnosticsPage: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const { palette, themeId } = useForgeTheme()
  const { previewWifi } = useForgeUISystem()
  const [, tick] = useState(0)
  useEffect(() => {
    const timer = window.setInterval(() => tick(value => value + 1), 1000)
    return () => window.clearInterval(timer)
  }, [])
  const model = useMemo(() => {
    const next = createUnavailableDiagnosticsModel()
    next.wifi = {
      connected: previewWifi.state === 'connected',
      ssid: previewWifi.ssid || null,
      rssi: previewWifi.rssi,
      ip: previewWifi.ip || null,
    }
    next.lvgl.theme = themeId
    next.lvgl.resolution = '1024 x 600'
    return next
  }, [previewWifi, themeId])
  const card = {
    bg: palette.surface, border: `1px solid ${palette.border}`,
    borderRadius: '14px', p: '16px', minWidth: 0,
  }
  const Memory = ({ title, memory }: { title: string; memory: typeof model.internalRam }) => {
    const health = diagnosticHealth(memory.free, memory.total)
    const percent = memory.free != null && memory.total
      ? Math.max(0, Math.min(100, 100 - memory.free / memory.total * 100)) : 0
    return (
      <Box {...card}>
        <Text fontSize="19px" fontWeight="bold" mb="9px">{title}</Text>
        <Progress value={percent} height="18px" borderRadius="full"
          bg={palette.surface2} sx={{ '& > div': { background: diagnosticHealthColour(health, palette) } }} />
        <ValueGrid values={[
          ['Free', formatDiagnosticBytes(memory.free)],
          ['Total', formatDiagnosticBytes(memory.total)],
          ['Minimum Ever Free', formatDiagnosticBytes(memory.minimumFree)],
        ]} />
      </Box>
    )
  }
  return (
    <Box height="100%" data-testid="system-diagnostics-page">
      <Box height="82px" display="flex" alignItems="center" borderBottom={`1px solid ${palette.border}`} px="22px">
        <Box as="button" aria-label="Back from Diagnostics" onClick={onBack}
          minWidth="132px" minHeight="54px" borderRadius="10px" bg={palette.surface} color={palette.text}>
          ← Back
        </Box>
        <Text flex="1" textAlign="center" fontSize="30px" fontWeight="bold">System Diagnostics</Text>
        <Text width="132px" textAlign="right" fontSize="12px" opacity={0.65}>Live · 1 s</Text>
      </Box>
      <Grid height="calc(100% - 82px)" overflowY="auto" p="18px 24px 28px"
        templateColumns="repeat(2, minmax(0, 1fr))" gap="14px">
        <Memory title="Internal RAM" memory={model.internalRam} />
        <Memory title="PSRAM" memory={model.psram} />
        <Box {...card}><Text fontSize="19px" fontWeight="bold" mb="9px">Flash Storage</Text>
          <ValueGrid values={[
            ['Used', formatDiagnosticBytes(model.flash.used)], ['Free', formatDiagnosticBytes(model.flash.free)],
            ['Total', formatDiagnosticBytes(model.flash.total)], ['Application Size', formatDiagnosticBytes(model.flash.applicationSize)],
            ['SPIFFS Used', formatDiagnosticBytes(model.flash.spiffsUsed)], ['SPIFFS Free', formatDiagnosticBytes(model.flash.spiffsFree)],
          ]} /></Box>
        <Box {...card}><Text fontSize="19px" fontWeight="bold" mb="9px">Performance</Text>
          <ValueGrid values={[
            ['FPS', model.performance.fps], ['LVGL Tick Rate', model.performance.lvglTickRate == null ? null : `${model.performance.lvglTickRate} Hz`],
            ['UI Update Time', model.performance.uiUpdateTimeUs == null ? null : `${model.performance.uiUpdateTimeUs} µs`],
            ['CPU Frequency', model.performance.cpuFrequencyMhz == null ? null : `${model.performance.cpuFrequencyMhz} MHz`],
            ['System Uptime', model.performance.uptimeSeconds == null ? null : `${model.performance.uptimeSeconds} s`],
            ['Build Version', model.performance.buildVersion],
          ]} /></Box>
        <Box {...card}><Text fontSize="19px" fontWeight="bold" mb="9px">LVGL Information</Text>
          <ValueGrid values={[
            ['LVGL Version', model.lvgl.version], ['Framebuffer Count', model.lvgl.framebufferCount],
            ['Resolution', model.lvgl.resolution], ['Theme', model.lvgl.theme],
            ['Current Screen', model.lvgl.currentScreen], ['Object Count', model.lvgl.objectCount],
          ]} /></Box>
        <VStack align="stretch" spacing="14px">
          <Box {...card}><Text fontSize="19px" fontWeight="bold" mb="9px">Wi-Fi Status</Text>
            <ValueGrid values={[
              ['Connected', model.wifi.connected == null ? null : model.wifi.connected ? 'Yes' : 'No'],
              ['SSID', model.wifi.ssid], ['RSSI', model.wifi.rssi == null ? null : `${model.wifi.rssi} dBm`], ['IP Address', model.wifi.ip],
            ]} /></Box>
          <Box {...card}><Text fontSize="19px" fontWeight="bold" mb="9px">SD Card</Text>
            <ValueGrid values={[
              ['Mounted', model.sd.mounted == null ? null : model.sd.mounted ? 'Yes' : 'No'],
              ['Capacity', formatDiagnosticBytes(model.sd.capacity)], ['Free Space', formatDiagnosticBytes(model.sd.freeSpace)], ['Files', model.sd.files],
            ]} /></Box>
        </VStack>
      </Grid>
    </Box>
  )
}

export default DiagnosticsPage
