import fs from 'node:fs'

const envText = fs.readFileSync('.env', 'utf8')

const apiKeyLine = envText
  .split(/\r?\n/)
  .find((line) => line.startsWith('OPENAI_API_KEY='))

const apiKey = apiKeyLine
  ? apiKeyLine.substring('OPENAI_API_KEY='.length).trim()
  : ''

if (!apiKey) {
  console.error('OPENAI_API_KEY not found in .env')
  process.exit(1)
}

const controller = new AbortController()
const timer = setTimeout(() => controller.abort(), 15000)

try {
  const response = await fetch('https://api.openai.com/v1/models', {
    headers: {
      Authorization: `Bearer ${apiKey}`,
    },
    signal: controller.signal,
  })

  console.log('STATUS:', response.status)
  console.log(await response.text())
} catch (error) {
  console.error('AUTHENTICATED NODE FETCH FAILED:')
  console.error(error)
} finally {
  clearTimeout(timer)
}