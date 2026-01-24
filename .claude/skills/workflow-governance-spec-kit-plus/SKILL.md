---
name: workflow-governance-spec-kit-plus
description: Define, enforce, and evolve governed workflows using Spec-Kit Plus with clear specifications and policy controls.
---

# Workflow Governance (Spec-Kit Plus)

## Instructions

1. **Specification design**
   - Define workflows as versioned specifications
   - Separate intent (what) from execution (how)
   - Use clear inputs, outputs, and acceptance criteria

2. **Policy & controls**
   - Apply approval gates and validation rules
   - Enforce role-based responsibilities
   - Define compliance and audit requirements

3. **Lifecycle management**
   - Version and evolve specs safely
   - Track changes with change logs
   - Deprecate and migrate workflows predictably

4. **Integration & automation**
   - Integrate specs with CI/CD pipelines
   - Automate checks against governance rules
   - Surface violations early with clear feedback

## Best Practices
- Keep specs concise and unambiguous
- Prefer explicit rules over implicit behavior
- Version everything from day one
- Align workflows with business outcomes
- Automate governance checks wherever possible
- Review specs regularly with stakeholders

## Example Structure
```yaml
spec:
  name: release-workflow
  version: 1.2.0
  owners:
    - platform-team
  stages:
    - name: build
      required: true
    - name: review
      approvers: 2
    - name: deploy
      environment: production
  policies:
    - require-tests: true
    - block-on-failure: true
