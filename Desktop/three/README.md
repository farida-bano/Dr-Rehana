# Project Name

Welcome to your new project built with the Spec-Driven Development (SDD) methodology! This project follows a structured approach to software development that emphasizes clear specifications, architectural planning, and traceable development tasks.

## Overview

This project implements the SDD framework, which includes:
- Clear specification documents for each feature
- Detailed architectural plans
- Traceable task breakdowns
- Prompt History Records (PHRs) for all development decisions
- Architecture Decision Records (ADRs) for significant choices

## Directory Structure

```
project-root/
├── specs/                    # Feature specifications
│   ├── authentication/       # Authentication feature spec
│   ├── api-client/           # API client feature spec
│   ├── architecture/         # Architecture feature spec
│   ├── backend/              # Backend feature spec
│   └── frontend/             # Frontend feature spec
├── history/                  # Historical records
│   ├── prompts/              # Prompt History Records (PHRs)
│   └── adr/                  # Architecture Decision Records
├── .specify/                 # SDD framework configuration
│   ├── memory/               # Project memory (constitution, etc.)
│   ├── scripts/              # Automation scripts
│   └── templates/            # Template files
└── README.md                 # This file
```

## Getting Started

1. **Review the project constitution** in `.specify/memory/constitution.md` to understand the core principles and guidelines.

2. **Explore existing specifications** in the `specs/` directory to understand planned features.

3. **Follow the SDD workflow**:
   - Define specifications (`specs/<feature>/spec.md`)
   - Create architectural plans (`specs/<feature>/plan.md`)
   - Break down tasks (`specs/<feature>/tasks.md`)
   - Implement features following the defined specifications

## SDD Workflow

### 1. Specification Phase
- Define what needs to be built in `specs/<feature>/spec.md`
- Include acceptance criteria and requirements

### 2. Planning Phase
- Create architectural plans in `specs/<feature>/plan.md`
- Document decisions and trade-offs

### 3. Tasking Phase
- Break down implementation into testable tasks in `specs/<feature>/tasks.md`
- Include test cases and validation criteria

### 4. Implementation Phase
- Follow the tasks to implement features
- Create PHRs for significant development decisions
- Document important architectural decisions as ADRs

## Key Concepts

### Prompt History Records (PHRs)
PHRs capture important development conversations and decisions. They are stored in `history/prompts/` and organized by topic.

### Architecture Decision Records (ADRs)
ADRs document significant architectural decisions and their rationale. They are stored in `history/adr/`.

### Specifications
Specifications define what needs to be built, including requirements, constraints, and acceptance criteria.

## Contributing

1. Review the project constitution in `.specify/memory/constitution.md`
2. Follow the SDD workflow outlined above
3. Create PHRs for significant decisions
4. Document architectural decisions as ADRs when appropriate
5. Ensure all code changes have corresponding tests

## Next Steps

1. Customize this README with your project's specific details
2. Define your first feature specification in the `specs/` directory
3. Review and update the constitution in `.specify/memory/constitution.md` as needed
4. Set up your development environment according to your project's technology stack