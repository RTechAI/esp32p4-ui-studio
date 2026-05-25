const express = require('express')
const fs = require('fs')
const path = require('path')
const { exec } = require('child_process')

const app = express()

app.use(express.json({ limit: '5mb' }))

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    return res.sendStatus(200)
  }

  next()
})

app.post('/export', (req, res) => {
  try {
    const code = req.body.code || ''

    const target = path.resolve(
      __dirname,
      '../firmware/ForgeUI-One/main/90_Studio_Export.c'
    )

    fs.writeFileSync(target, code, 'utf8')

    console.log('Exported to:', target)

    res.json({
      ok: true,
      target,
    })
  } catch (err) {
    console.error(err)

    res.status(500).json({
      ok: false,
      error: String(err),
    })
  }
})

app.post('/flash', (req, res) => {
  try {
    const flashScript = path.resolve(
      __dirname,
      '../tools/flash-p4.bat'
    )

    console.log('Flash script path:', flashScript)

    exec(`cmd /c start "" "${flashScript}"`)

    console.log('Launching flash-p4.bat')

    res.json({
      ok: true,
    })
  } catch (err) {
    console.error(err)

    res.status(500).json({
      ok: false,
      error: String(err),
    })
  }
})

app.post('/clean-flash', (req, res) => {
  try {
    const flashScript = path.resolve(
      __dirname,
      '../tools/clean-flash-p4.bat'
    )

    console.log('Clean flash script path:', flashScript)

    exec(`cmd /c start "" "${flashScript}"`)

    console.log('Launching clean-flash-p4.bat')

    res.json({
      ok: true,
    })
  } catch (err) {
    console.error(err)

    res.status(500).json({
      ok: false,
      error: String(err),
    })
  }
})

app.listen(3030, () => {
  console.log('ForgeUI export server alive on :3030')
})