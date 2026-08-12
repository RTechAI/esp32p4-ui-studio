FROM node:20-bookworm-slim AS build
WORKDIR /app/studio
COPY studio/package*.json ./
RUN npm ci --legacy-peer-deps
COPY studio ./
ENV NEXT_PUBLIC_FORGEUI_RUNTIME_MODE=hosted
ENV FORGEUI_RUNTIME_MODE=hosted
RUN npm run build

FROM node:20-bookworm-slim AS runtime
RUN apt-get update && apt-get install -y --no-install-recommends python3 python3-pip && rm -rf /var/lib/apt/lists/*
WORKDIR /app
COPY tools/requirements-hosted.txt /tmp/requirements-hosted.txt
RUN pip3 install --break-system-packages --no-cache-dir -r /tmp/requirements-hosted.txt
COPY --from=build /app/studio /app/studio
COPY firmware/ForgeUI-One /app/firmware/ForgeUI-One
COPY tools/ForgeUIImagePreprocessor.py /app/tools/ForgeUIImagePreprocessor.py
COPY tools/lvgl /app/tools/lvgl
ENV NODE_ENV=production
ENV FORGEUI_RUNTIME_MODE=hosted
ENV NEXT_PUBLIC_FORGEUI_RUNTIME_MODE=hosted
ENV FORGEUI_PYTHON=python3
ENV FORGEUI_TEMP_ROOT=/tmp/forgeui
ENV FORGEUI_STUDIO_ROOT=/app/studio
ENV FORGEUI_REPOSITORY_ROOT=/app
EXPOSE 3000
WORKDIR /app/studio
USER node
CMD ["npm", "start"]
