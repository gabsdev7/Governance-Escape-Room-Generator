# MCP Configuration

This document describes how to configure the Model Context Protocol (MCP) integration for the hint system.

## Overview

The Governance Escape Room uses MCP to fetch best-practice hints from Microsoft Learn. When a player requests a hint, the system queries the MCP endpoint for relevant governance guidance.

There are two hint providers:

1. **MCPHintProvider**: Queries a remote MCP server (default: Microsoft Learn)
2. **LocalHintProvider**: Uses curated local hints (fallback/offline mode)

## Environment Variables

### `MCP_ENDPOINT`

The MCP server URL to query for hints.

```env
MCP_ENDPOINT=https://learn.microsoft.com/api/mcp
```

- **Default**: `https://learn.microsoft.com/api/mcp`
- **Server-side only**: Not exposed to client

### `MCP_API_KEY`

Optional API key for MCP authentication. Only required if the MCP endpoint requires authentication.

```env
MCP_API_KEY=your-api-key-here
```

- **Default**: None (no authentication)
- **Server-side only**: Never sent to client
- **Security**: Passed per-request in Authorization header, never persisted in memory

### `HINT_PROVIDER`

Which hint provider to use as primary.

```env
HINT_PROVIDER=mcp
```

- **Options**: `mcp` (default), `local`
- **Fallback**: If `mcp` is selected but the request fails, automatically falls back to `local`

### `NEXT_PUBLIC_ENABLE_TELEMETRY`

Enable telemetry logging (see separate telemetry documentation).

```env
NEXT_PUBLIC_ENABLE_TELEMETRY=false
```

## Provider Selection

```
┌─────────────────┐
│  Hint Request   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐     ┌─────────────────┐
│ HINT_PROVIDER?  │────►│ LocalHintProvider│
│   = 'local'     │     └─────────────────┘
└────────┬────────┘
         │ = 'mcp'
         ▼
┌─────────────────┐
│ MCPHintProvider │
└────────┬────────┘
         │
    Success?
         │
    ┌────┴────┐
   Yes       No
    │         │
    ▼         ▼
┌─────────┐ ┌─────────────────┐
│ Return  │ │ LocalHintProvider│
│  Hint   │ │   (fallback)     │
└─────────┘ └─────────────────┘
```

## Security Considerations

### Data Sent to MCP

The hint provider only sends non-sensitive context:

**Sent:**
- Scenario ID (e.g., `scenario-1-leaky-sharepoint`)
- Category if specified (e.g., `DATA_ACCESS`)
- Generic topic keywords

**NOT Sent:**
- User-entered text
- User identifiers
- Session data
- Selected control IDs
- Any PII or confidential information

### Authentication

- API keys are passed per-request in the Authorization header
- Keys are never persisted in client-side storage
- Keys are read from environment variables, not hardcoded

### Request Logging

When `ENABLE_LOGGING` is true on the MCPHintProvider:

```typescript
const provider = new MCPHintProvider(
  endpoint,
  apiKey,
  true // enableLogging
);
```

Logs include:
- Request timestamp
- Query sent (no sensitive data)
- Response result count
- Any errors

Logs are written to the server console and should be forwarded to your logging infrastructure for audit purposes.

## Swapping Providers

### Use Local Only (Offline Mode)

```env
HINT_PROVIDER=local
```

The local provider uses curated hints from `src/lib/hints/local-hints.json`. Edit this file to customize hints.

### Use Custom MCP Server

```env
MCP_ENDPOINT=https://your-mcp-server.example.com/api
MCP_API_KEY=your-api-key
HINT_PROVIDER=mcp
```

The MCPHintProvider expects responses in this format:

```json
{
  "results": [
    {
      "title": "Result Title",
      "snippet": "Helpful guidance text...",
      "url": "https://learn.microsoft.com/..."
    }
  ]
}
```

## Adding Custom Hints

To add or modify local hints, edit `src/lib/hints/local-hints.json`:

```json
{
  "scenario-id": {
    "general": "General hint for this scenario...",
    "DATA_ACCESS": "Hint about data access controls...",
    "INFORMATION_PROTECTION": "Hint about labeling..."
  }
}
```

Categories:
- `general` - Always available, used for first hint
- `DATA_ACCESS`
- `INFORMATION_PROTECTION`
- `DLP_COMPLIANCE`
- `IDENTITY_ACCESS`
- `AGENT_SAFETY`
- `MONITORING_LIFECYCLE`

## Testing the Hint System

### Test Local Provider

```env
HINT_PROVIDER=local
```

All hints will come from local storage, marked with `source: 'local'`.

### Test MCP Provider

```env
HINT_PROVIDER=mcp
MCP_ENDPOINT=https://learn.microsoft.com/api/mcp
```

Hints will attempt MCP first, falling back to local on failure.

### Verify in UI

Hint source is displayed in the UI:
- "MS Learn" badge = MCP provider
- "Local" badge = Local provider

## Troubleshooting

### Hints Always Use Local

Check:
1. `HINT_PROVIDER` is set to `mcp`
2. `MCP_ENDPOINT` is accessible from your server
3. No network/firewall blocks
4. Server logs for MCP errors

### MCP Returns Empty Results

The MCP search query is built from scenario metadata. Check:
1. Scenario ID matches expected format
2. MCP endpoint returns results for governance queries
3. Response format matches expected structure

### Authentication Failures

If MCP returns 401/403:
1. Verify `MCP_API_KEY` is set correctly
2. Check key hasn't expired
3. Verify key has appropriate permissions

## Rate Limiting

The hint system includes basic rate limiting:
- Maximum 3 hints per game session
- Client-side enforcement
- 5-second timeout on MCP requests

For production, consider adding:
- Server-side rate limiting by IP
- Request throttling
- Cache layer for repeated queries
