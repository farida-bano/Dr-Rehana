# Evolution of Todo - Global Constitution

**Supreme Governing Document for All Development Phases**

---

## Document Metadata

| Field | Value |
|-------|-------|
| **Version** | 1.0.0 |
| **Status** | Active |
| **Ratified** | 2025-12-28 |
| **Scope** | Phases I through V |
| **Authoritative Location** | `.specify/memory/constitution.md` |

---

## Preamble

This constitution establishes the foundational principles, governance rules, and operational constraints for the Evolution of Todo project across all five development phases. It serves as the supreme governing document, taking precedence over all other project documentation, agent instructions, and development practices.

All agents, automated systems, and human contributors are bound by these rules. Violations constitute a critical deviation from project standards and must be flagged immediately.

---

## Part I: Foundational Principles

### 1.1 Spec-Driven Development (SDD) - Mandatory Order of Operations

**No agent may write production code without approved specifications and tasks.**

The following workflow is NON-NEGOTIABLE and must be followed for every feature, enhancement, or bug fix:

```
Constitution → Specs → Plan → Tasks → Implement (Red-Green-Refactor)
```

**Mandatory Gates:**

1. **Constitution Level**: Establishes core principles and constraints (this document)
2. **Spec Level**: Feature requirements written in user story format with acceptance criteria
   - Location: `specs/<feature-name>/spec.md`
   - Must be human-approved before proceeding
3. **Plan Level**: Architectural decisions, API contracts, data models
   - Location: `specs/<feature-name>/plan.md`
   - Must address all non-functional requirements
4. **Tasks Level**: Atomic, testable work items with clear pass/fail criteria
   - Location: `specs/<feature-name>/tasks.md`
   - Each task must reference its spec and plan sections
5. **Implement Level**: TDD cycle (Red → Green → Refactor)
   - Red: Write failing test
   - Green: Write minimal code to pass
   - Refactor: Improve code while maintaining passing tests

**Enforcement:** Any code committed without passing through these gates is considered unauthorized and must be reverted.

---

### 1.2 Code-Freeze Until Specification Approval

- Zero lines of production code may be written before spec approval
- Prototyping/experimentation must be explicitly labeled as such and kept separate
- "Draft" or "experimental" code cannot merge into main branches
- Temporary branches for exploration must be clearly marked and eventually deleted

---

## Part II: Agent Behavior Rules

### 2.1 Manual Coding Prohibition

**Human developers must not write production code directly.**

- All implementation must flow through the agent pipeline
- Humans define intent; agents execute implementation
- Exception: Configuration files, .env templates, and documentation may be human-authored
- Exception: Emergency hotfixes require documented justification and post-fix spec reconciliation

### 2.2 Anti-Feature Creep Mandate

**No agent may invent, add, or suggest features not in the approved specification.**

- Scope is defined exclusively by the approved `spec.md` for a feature
- If an agent identifies a need for additional functionality, it must:
  1. Stop implementation
  2. Document the gap in a new spec request
  3. Wait for human approval before proceeding
- Suggestions for future phases must be logged separately, not implemented early

**Forbidden Actions:**
- Adding "nice to have" features not in spec
- Extending API endpoints beyond spec'd behavior
- Creating infrastructure for anticipated future needs (YAGNI)
- Adding configuration options without documented requirement

### 2.3 Specification Deviation Strictly Prohibited

**Implementation must match specification exactly.**

- If implementation cannot match spec, work stops immediately
- Agent must surface the conflict and request clarification
- No "reasonable interpretation" of ambiguous requirements—ask for clarification
- No "improving" the design during implementation—spec changes require re-approval

### 2.4 Refinement Boundary

**All refinement happens at the specification level, never at the code level.**

| Stage | Where Refinement Occurs | What Gets Refined |
|-------|------------------------|-------------------|
| Spec | `specs/<feature>/spec.md` | Requirements, acceptance criteria |
| Plan | `specs/<feature>/plan.md` | Architecture, API design, data models |
| Tasks | `specs/<feature>/tasks.md` | Work breakdown, test cases |
| Code | `src/` | Implementation details ONLY |

**Violation Example:**
- Spec says "return user list as JSON array"
- Agent decides to add pagination because "it's better"
- **This is a violation.** Pagination must be in the spec.

---

## Part III: Phase Governance

### 3.1 Phase Scoping Rules

**Each phase is strictly scoped by its specification document.**

| Phase | Primary Focus | Out of Scope |
|-------|--------------|--------------|
| **Phase I** | Console app, in-memory storage, basic CRUD | Web UI, persistence, authentication |
| **Phase II** | Web frontend, FastAPI backend, Neon DB | Multi-tenancy, advanced agents, containers |
| **Phase III** | OpenAI Agents SDK integration | Full orchestration, Kubernetes |
| **Phase IV** | MCP server integration | Sim-to-real deployment |
| **Phase V** | Dapr, Kafka, Kubernetes orchestration | Future expansion |

### 3.2 Future-Phase Feature Leak Prevention

**No future-phase features may be implemented in earlier phases.**

**Detection Rules:**
- If a feature requires technology from a later phase → Forbidden
- If a feature's complexity justifies later-phase infrastructure → Forbidden
- If a feature enables capabilities only usable in later phases → Forbidden

**Examples:**
| Action | Phase I | Phase II | Phase III |
|--------|---------|----------|-----------|
| Add Docker configuration | Forbidden | Required | Required |
| Implement agent handoffs | Forbidden | Forbidden | Required |
| Set up Kafka topics | Forbidden | Forbidden | Forbidden* |
| Design for Kubernetes | Forbidden (OK) | Forbidden (OK) | Required |

*Phase V only

### 3.3 Architecture Evolution Protocol

**Architecture may only evolve through updated specifications and plans.**

- Architectural changes require spec amendment and re-approval
- Breaking changes to API contracts require version bump and migration plan
- Database schema changes must include backward compatibility or migration strategy
- All architecture decisions must be documented in ADRs (Architecture Decision Records)

**Change Process:**
```
Proposed Change → Spec Amendment → Plan Amendment → Tasks Update → Implementation
     ↑                                              │
     └──────────────────────────────────────────────┘
     (Require re-approval at each stage)
```

---

## Part IV: Technology Constraints

### 4.1 Phase-Based Technology Stack

**Technology choices are constrained by current phase.**

#### Phase I: Foundation
| Category | Technology | Justification |
|----------|-----------|---------------|
| Language | Python 3.8+ | Simplicity, rapid development |
| Interface | CLI (argparse/click) | Focused on core logic |
| Storage | In-memory (dict/list) | Zero dependencies, easy testing |
| Testing | pytest | Standard Python testing |

#### Phase II: Web Application
| Category | Technology | Justification |
|----------|-----------|---------------|
| Frontend | Next.js | React framework, SSR support |
| Backend | FastAPI | High-performance, auto-docs |
| ORM | SQLModel | SQLAlchemy + Pydantic unification |
| Database | Neon PostgreSQL | Serverless, excellent DX |
| Validation | Pydantic | Type safety, FastAPI native |

#### Phase III: Intelligent Agents
| Category | Technology | Justification |
|----------|-----------|---------------|
| Agent Framework | OpenAI Agents SDK | Structured agent workflows |
| LLM | OpenAI GPT-4+ | Reasoning capabilities |
| Context | MCP (Model Context Protocol) | Tool integration |

#### Phase IV: Integration & MCP
| Category | Technology | Justification |
|----------|-----------|---------------|
| MCP Server | Custom MCP server | Expose capabilities |
| Integration | MCP clients | Consume external services |
| Tooling | MCP tools registry | Discoverability |

#### Phase V: Cloud-Native Orchestration
| Category | Technology | Justification |
|----------|-----------|---------------|
| Orchestration | Kubernetes | Container orchestration |
| Message Bus | Kafka | Event streaming |
| Distributed Patterns | Dapr | Sidecar patterns |
| Deployment | Helm | Package management |

### 4.2 Technology Addition Protocol

**New technologies require explicit approval in the specification.**

- No agent may introduce dependencies without spec approval
- Addition must include: justification, alternatives considered, migration cost
- Dependency count must be minimized (prefer stdlib where possible)
- All dependencies must have active maintenance and security audit

---

## Part V: Quality Principles

### 5.1 Clean Architecture Mandate

**All code must follow clean architecture principles.**

```
┌─────────────────────────────────────────────────────┐
│                   Presentation Layer                 │
│         (Controllers, CLI handlers, API routes)      │
└─────────────────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────┐
│                   Application Layer                  │
│              (Use Cases, Services, Business Logic)   │
└─────────────────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────┐
│                    Domain Layer                      │
│              (Entities, Domain Services)             │
└─────────────────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────┐
│                   Infrastructure Layer               │
│         (Repositories, External APIs, Database)      │
└─────────────────────────────────────────────────────┘
```

**Rules:**
- Inner layers cannot depend on outer layers
- Dependencies point inward
- Business logic is testable without infrastructure
- Frameworks are details, not the center

### 5.2 Stateless Service Design

**Services should be stateless where required.**

- Stateless services scale horizontally
- State is delegated to specialized stores (database, cache)
- Session state is externalized (JWT tokens, server-side sessions)
- Idempotency is built into all operations

### 5.3 Separation of Concerns

**Each component has a single, well-defined responsibility.**

| Layer | Responsibility | Examples |
|-------|---------------|----------|
| Repository | Data access abstraction | `TaskRepository` |
| Service | Business logic orchestration | `TaskService` |
| Controller | HTTP/CLI request handling | `TaskController` |
| Model | Domain entities | `Task`, `User` |
| DTO | Data transfer objects | `TaskCreateRequest` |

### 5.4 Cloud-Native Readiness

**All code is designed for cloud deployment from day one.**

- Configuration via environment variables (no hardcoded values)
- Graceful degradation on dependency failure
- Health check endpoints (for Phase II+)
- Structured logging (JSON format)
- Metrics export capability
- Configurable retry/backoff for external calls

---

## Part VI: SDD Workflow Enforcement

### 6.1 Prompt History Records (PHRs)

**Every user interaction must be recorded in a Prompt History Record.**

**Routing:**
- Constitution changes → `history/prompts/constitution/`
- Feature work → `history/prompts/<feature-name>/`
- General discussions → `history/prompts/general/`

**Required Fields:**
- `id`: Incremental identifier
- `title`: 3-7 word slug
- `stage`: constitution | spec | plan | tasks | red | green | refactor | explainer | misc | general
- `date`: ISO 8601 format
- `prompt_text`: Full verbatim user input
- `response_text`: Concise but representative output
- `files`: All created/modified files
- `tests`: All tests run/added

### 6.2 Architecture Decision Records (ADRs)

**Significant architectural decisions require ADRs.**

**Trigger Criteria (ALL must be met):**
1. Long-term consequences (affects future development)
2. Multiple viable alternatives considered
3. Cross-cutting concern influencing system design

**Process:**
```
Decision Point Detected → Suggest ADR Creation → Wait for Consent → Document
```

**Suggested Format:**
- Context and problem statement
- Considered options
- Decision and rationale
- Consequences (positive and negative)

---

## Part VII: Governance and Compliance

### 7.1 Constitution Supremacy

**This constitution supersedes all other project documentation.**

Hierarchy (highest to lowest):
1. This Constitution (`.specify/memory/constitution.md`)
2. Feature Specifications (`specs/<feature>/spec.md`)
3. Implementation Plans (`specs/<feature>/plan.md`)
4. Task Documents (`specs/<feature>/tasks.md`)
5. Code comments and documentation
6. Agent-specific instructions (CLAUDE.md, etc.)

### 7.2 Amendment Process

**Constitution amendments require formal process.**

1. Draft amendment with justification
2. Present to project stakeholders
3. Document impact on existing work
4. Receive explicit approval
5. Update version and date
6. Communicate to all agents

**Emergency Amendments:**
- Critical security or compliance issues may be fast-tracked
- Must be documented with rationale
- Full review within 7 days

### 7.3 Compliance Verification

**All pull requests must verify compliance with this constitution.**

Review Checklist:
- [ ] Spec exists and is approved
- [ ] Plan addresses all NFRs
- [ ] Tasks map to spec requirements
- [ ] No features outside scope
- [ ] Technology stack is phase-appropriate
- [ ] Clean architecture followed
- [ ] PHR created for the work
- [ ] ADRs documented for significant decisions

---

## Part VIII: Failure Modes and Recovery

### 8.1 Common Violations

| Violation | Detection | Response |
|-----------|-----------|----------|
| Code before spec | Code review | Revert, create spec |
| Feature creep | Code review | Revert, narrow scope |
| Wrong phase tech | Dependency scan | Remove dependency |
| Missing PHR | Commit hook | Create PHR immediately |
| Skipped ADR | PR review | Create ADR before merge |

### 8.2 Recovery Procedures

**When violations are detected:**

1. **Code Before Spec**: Revert changes, create specification, re-run workflow
2. **Feature Creep**: Revert to spec'd functionality, document gap as new spec request
3. **Phase Leak**: Remove incompatible code, add to future phase backlog
4. **Missing Documentation**: Create documentation before merge

---

## Part IX: Glossary

| Term | Definition |
|------|------------|
| **SDD** | Spec-Driven Development - methodology requiring specifications before code |
| **PHR** | Prompt History Record - documentation of user-agent interactions |
| **ADR** | Architecture Decision Record - documentation of significant decisions |
| **Phase** | Distinct stage of project evolution with defined scope and technology |
| **Feature** | Unit of functionality with dedicated spec/plan/tasks |
| **YAGNI** | "You Aren't Gonna Need It" - avoid speculative code |
| **Clean Architecture** | Organization principle with layered, dependency-inverted structure |

---

## Appendix A: Quick Reference Card

```
┌─────────────────────────────────────────────────────────────────┐
│                    EVOLUTION OF TODO - SDD FLOW                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   CONSTITUTION (this file)                                      │
│         │                                                       │
│         ▼                                                       │
│   SPEC: specs/<feature>/spec.md                                 │
│   [Human Approval Required]                                     │
│         │                                                       │
│         ▼                                                       │
│   PLAN: specs/<feature>/plan.md                                 │
│   [Architecture Decisions, API Contracts]                       │
│         │                                                       │
│         ▼                                                       │
│   TASKS: specs/<feature>/tasks.md                               │
│   [Atomic Work Items with Tests]                                │
│         │                                                       │
│         ▼                                                       │
│   RED: Write failing test                                       │
│   GREEN: Write minimal code                                     │
│   REFACTOR: Improve while passing                               │
│         │                                                       │
│         ▼                                                       │
│   CREATE PHR: history/prompts/<type>/<id>-.prompt.md            │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│                      PHASE TECHNOLOGY MAP                        │
├─────────────────────────────────────────────────────────────────┤
│   Phase I:  Python + In-Memory + CLI                            │
│   Phase II: Next.js + FastAPI + SQLModel + Neon                 │
│   Phase III: OpenAI Agents SDK                                  │
│   Phase IV:  MCP Server Integration                             │
│   Phase V:   Dapr + Kafka + Kubernetes                          │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

**Document Version**: 1.0.0
**Last Updated**: 2025-12-28
**Next Review**: 2026-03-28 (or upon major phase transition)
