# OpenAI API Setup

## Overview

ForgeUI Studio includes optional AI-assisted tools that use the OpenAI API.

Examples include:

- AI Layout Creator
- AI Layout Prompt Builder
- AI Theme Generator
- AI Artwork Assistance
- Future AI-powered Studio features

ForgeUI Studio **does not require an OpenAI API key to operate**.

Without an API key, all normal Studio features continue to function.

Only AI-assisted features are unavailable.

---

# Requirements

You will need:

- An OpenAI account
- A valid OpenAI API key
- Internet access when using AI features

---

# Step 1 — Create an OpenAI Account

Visit:

https://platform.openai.com/

Create an account or sign in.

---

# Step 2 — Create an API Key

Open:

**API Keys**

Create a new Secret API Key.

Copy the key immediately.

OpenAI only displays the full key once.

Store it securely.

---

# Step 3 — Locate the ForgeUI Studio Folder

Navigate to the ForgeUI Studio installation directory.

Example:

```text
C:\ForgeUI\Projects\esp32p4-ui-studio
```

---

# Step 4 — Create the .env File

Create a new file named:

```text
.env
```

Place it in the root of the ForgeUI Studio project.

Example:

```text
C:\ForgeUI\Projects\esp32p4-ui-studio\.env
```

---

# Step 5 — Add Your API Key

Inside the file place:

```env
OPENAI_API_KEY=sk-your-api-key-here
```

Replace:

```text
sk-your-api-key-here
```

with your own API key.

Example:

```env
OPENAI_API_KEY=sk-proj-XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
```

---

# Step 6 — Restart ForgeUI Studio

Restart ForgeUI Studio.

The application will automatically detect the API key.

AI features will become available.

---

# Security

Never:

- Upload your API key to GitHub
- Commit the .env file
- Email your API key
- Share screenshots containing your API key
- Include your API key inside exported ESP-IDF projects

Your API key should remain private.

---

# .gitignore

ForgeUI Studio excludes:

```text
.env
```

from source control.

Do not remove this rule.

---

# AI Features

Once configured, ForgeUI Studio can use the OpenAI API for features including:

- AI Layout Creation
- AI Prompt Builder
- AI Theme Generation
- AI Artwork Assistance
- Future AI workflow tools

Additional AI features may be introduced in future releases.

---

# Without an API Key

ForgeUI Studio continues to operate normally.

Available:

- Canvas
- Browser Preview
- Theme Manager
- Dashboard Designer
- Asset Manager
- LVGL Export
- Runtime API Generation
- Build & Flash
- ESP-IDF Export

Unavailable:

- AI-assisted Studio features

---

# Troubleshooting

## AI buttons disabled

Check:

- .env exists
- File is in the Studio root folder
- Variable name is:

```text
OPENAI_API_KEY
```

- The API key is valid
- ForgeUI Studio has been restarted

---

## Invalid API Key

Create a new API key from the OpenAI Platform.

Replace the existing value inside:

```text
.env
```

Restart ForgeUI Studio.

---

## API Quota

OpenAI API usage is billed through your own OpenAI account.

ForgeUI Studio does not provide API credits.

Refer to your OpenAI account for current pricing, limits and usage.

---

# Notes

ForgeUI Studio never embeds your API key into:

- Generated LVGL code
- Runtime APIs
- ESP-IDF exports
- Standalone projects

Your API key always remains on your local development machine.