---
id: "0001"
title: "create-global-constitution-evolution-todo"
stage: "constitution"
date: "2025-12-28"
surface: "agent"
model: "sonnet-4-5-20250929"
feature: "none"
branch: "001-document-agents"
user: "sarosh"
command: "/sp.constitution"
labels: ["constitution","governance","sdd","project-rules"]
links:
  spec: "null"
  ticket: "null"
  adr: "null"
  pr: "null"
files:
  - /Users/sarosh/Desktop/bonsai/todo-app/.specify/memory/constitution.md
tests:
  - none
---

## Prompt

/sp.constitution /sp.constitution Create a single global constitution for the entire "Evolution of Todo" project covering Phase I through Phase V.

This constitution must define:

1. Spec-Driven Development as mandatory
   - No agent may write code without approved specs and tasks
   - All work must follow: Constitution → Specs → Plan → Tasks → Implement

2. Agent Behavior Rules
   - No manual coding by humans
   - No feature invention
   - No deviation from approved specifications
   - Refinement must occur at spec level, not code level

3. Phase Governance
   - Each phase is strictly scoped by its specification
   - Future-phase features must never leak into earlier phases
   - Architecture may evolve only through updated specs and plans

4. Technology Constraints
   - Python for backend
   - Next.js for frontend (later phases)
   - FastAPI, SQLModel, Neon DB
   - OpenAI Agents SDK, MCP
   - Docker, Kubernetes, Kafka, Dapr (later phases)

5. Quality Principles
   - Clean architecture
   - Stateless services where required
   - Clear separation of concerns
   - Cloud-native readiness

This constitution must remain stable across all phases and act as the supreme governing document for all agents.

## Response snapshot

Created comprehensive global constitution at `.specify/memory/constitution.md` (475 lines). The document establishes:

- **Part I**: Spec-Driven Development mandatory workflow (Constitution → Specs → Plan → Tasks → Implement)
- **Part II**: Agent behavior rules (no manual coding, no feature invention, no spec deviation)
- **Part III**: Phase governance (strict phase scoping, anti-leak rules, architecture evolution protocol)
- **Part IV**: Technology constraints per phase (Phase I-V technology stack)
- **Part V**: Quality principles (clean architecture, stateless design, separation of concerns, cloud-native readiness)
- **Part VI**: SDD workflow enforcement (PHR and ADR requirements)
- **Part VII**: Governance and compliance (constitution supremacy, amendment process)
- **Part VIII**: Failure modes and recovery procedures
- **Part IX**: Glossary and quick reference card

## Outcome

- ✅ Impact: Established supreme governing document for Evolution of Todo project across all 5 phases
- 🧪 Tests: N/A - governance document
- 📁 Files: 1 created (`.specify/memory/constitution.md`), 1 PHR record created
- 🔁 Next prompts: Phase I specification development, Phase I plan creation
- 🧠 Reflection: Constitution provides clear guardrails preventing scope creep and ensuring phase-appropriate technology usage

## Evaluation notes (flywheel)

- Failure modes observed: none
- Graders run and results (PASS/FAIL): N/A
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): N/A
