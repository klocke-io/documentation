# This Dockerfile is deprecated - please use Dockerfile.dev or Dockerfile.build instead
# See the Make targets: docs-dev, docs-build, and docs-preview

FROM node:24-alpine

LABEL project=gardener_docs_deprecated

# Install required tools
RUN apk add --no-cache bash git

# Set working directory
WORKDIR /app

# Expose dev port
EXPOSE 5173

# Comment about deprecation
# This Dockerfile is kept for backward compatibility
# For development: Use "make docs-dev"
# For building: Use "make docs-build"
# For previewing: Use "make docs-preview"

# Note: Dependency installation moved to container runtime for volume mounting
CMD ["sh", "-c", "npm ci && npx vitepress dev --host 0.0.0.0"]