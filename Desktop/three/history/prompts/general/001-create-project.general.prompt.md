---
id: "001"
title: "create-project"
stage: "general"
date_iso: "2026-01-14"
surface: "agent"
model: "Qwen Code"
feature: "none"
branch: "main"
user: "sarosh"
command: "create-project"
labels: ["setup", "structure", "initialization"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files_yaml:
  - ".specify/memory/constitution.md"
  - "README.md"
  - "specs/authentication/spec.md"
  - "specs/api-client/spec.md"
  - "specs/architecture/spec.md"
  - "specs/backend/spec.md"
  - "specs/frontend/spec.md"
  - "history/prompts/general/001-create-project.general.prompt.md"
tests_yaml: []
---

## PROMPT_TEXT
see my all file and create porjcet

## RESPONSE_TEXT
I've successfully created a new project for you using the Spec-Driven Development (SDD) methodology. Here's what I've done:

1. Created the main project directory structure
2. Set up the `.specify` directory with its subdirectories (memory, scripts, templates)
3. Created an initial constitution.md file with project principles
4. Created specs directories for various features (authentication, api-client, architecture, backend, frontend)
5. Created history directories for prompts and ADRs (Architecture Decision Records)
6. Added a comprehensive README.md file explaining the project structure and workflow

Your project is now ready to use with the SDD framework. The directory structure follows the conventions you had in your existing CLAUDE.md file, with places for specifications, historical records, and the SDD framework files.

You can now start defining your first feature specification in the `specs/` directory, following the SDD workflow outlined in the README.

## OUTCOME
Project structure successfully created with all necessary directories and initial files.

## EVALUATION
The project setup followed the SDD methodology as outlined in the CLAUDE.md file, creating the appropriate directory structure and initial documentation.