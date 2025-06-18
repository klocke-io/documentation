FROM node:24-alpine

LABEL project=gardener_docs

# Install bash (optional but useful)
RUN apk add --no-cache bash

# Needed for VitePress last updated feature
RUN apk add --no-cache git

# Set working directory
WORKDIR /app

# Expose dev port
EXPOSE 5173

# Default command to start VitePress dev
ENTRYPOINT ["./hack/start-docs.sh"]