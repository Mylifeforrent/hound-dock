# ADR-004 — No MCP runtime and no HITL orchestration in the MVP

Status: Draft
Decision status: Proposed architecture baseline
Date: 2026-10-18
Owner: Lead architecture agent for the Docs Agent
Refs: CAP-003; CAP-014; CAP-036; BR-004; ENT-008; ENT-009; FLOW-005; TBD-BIZ-004; TBD-BIZ-007; TBD-INFRA-009
Supersedes: none

## Context

`CAP-003` confirms a governed MCP registry with recorded health. `BR-004` confirms that an unrecorded server may not be used and that a tool call to an unrecorded server is denied. Registration, connection testing, allowlisting, and invocation are outside the confirmed capability; `FLOW-005` is proposed and `McpTool.invoke` is `denied`.

The official MCP material describes a client–host–server protocol with prompts, resources, and tools. The official MCP Registry is a public metadata service for publicly accessible servers and explicitly does not support private servers or self-hosting. The MCP tools guidance recommends a human in the loop for tool invocation, but the product has no effective tool-invocation, approval, interruption, or resume flow.

## Decision

1. The MVP does **not** implement an MCP host, client, server runtime, transport, discovery call, connection test, tool listing, allowlist enforcement, or tool invocation.
2. `ENT-008` is an internal governance record. Its read side is server name, recorded health, and a credential-reference indicator. It is not the official MCP Registry record and does not adopt `server.json`.
3. `ENT-009` is reserved and not exposed: no tool name listing, no allowlist display, no invocation.
4. No MCP authorization flow (OAuth, dynamic client registration, protected-resource metadata) is implemented. A future integration must design the authorization boundary before connecting.
5. No HITL orchestration is introduced: no LangGraph human-in-the-loop, no interrupt, no checkpoint, no resume, no approval state. `CAP-014` is excluded and `FLOW-004`–`006` are proposed.
6. The MCP tools guidance that a human **SHOULD** be able to deny tool invocations is recorded as a **future re-entry trigger**, not as an effective rule.
7. Research conclusions are used for vocabulary and security boundaries only. No MCP runtime is a dependency of the architecture.

## Consequences

### Positive

- The MVP stays within the confirmed scope and does not introduce a protocol runtime or an unapproved approval flow.
- The registry record remains a governance artifact, distinct from a public MCP registry.
- A future MCP integration has a clear starting point: stateless core, authorization boundary, human confirmation, no token passthrough.

### Cost and limits

- The product cannot connect to, test, or call an MCP server. The MCP registry read side is metadata-only.
- A future integration will need a new decision, a security review, and probably a new TBD for authorization and data boundary.
- The absence of HITL means there is no resumable approval workflow; any such requirement must be designed from the start, not retrofitted silently.

## Alternatives considered

| Alternative | Why rejected |
|---|---|
| Implement an MCP client now | Registration and invocation are proposed/denied; `TBD-BIZ-004/007` are open |
| Adopt the official MCP Registry API | It excludes private servers and self-hosting; the product is an internal workspace |
| Reuse the MCP Tasks extension for business tasks | Different concept; the collision would confuse the domain and the protocol boundary |
| Add LangGraph HITL now | No effective human interruption, approval, or resume flow; adding it would invent a workflow |
| Add tool-call confirmation only | No tool invocation exists; a confirmation without a call is a dead surface |

## What this ADR does not decide

- Whether MCP registration or invocation ever enters the product (`TBD-BIZ-004/007`).
- Which MCP transport, SDK, or authorization provider would be used.
- The future approval model or HITL technology.
- The model gateway or its data boundary (`TBD-INFRA-009`).

## Revisit trigger

`FLOW-005` becomes effective; `McpTool.invoke` gains a grant; `CAP-014` or `CAP-036` enters the MVP; a TBD for MCP authorization/residency is registered.
