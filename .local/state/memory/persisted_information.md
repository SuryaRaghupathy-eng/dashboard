# Current Task

The user wants to remove steps 3 (Search Engines) and 4 (Competitors) from the multi-step wizard in the application.

## What needs to be done:
1. Update `client/src/pages/new-project.tsx`:
   - Change TOTAL_STEPS from 5 to 3
   - Remove imports for StepSearchEngines and StepCompetitors
   - Update renderStep() switch: case 3 should render StepReview (was case 5)
   - Remove validation for step 4 (competitors)
   - Remove case 3 and case 4 from switch statement

2. Update `client/src/components/wizard/progress-indicator.tsx`:
   - Change steps array to only have 3 steps: Project Details (1), Keywords (2), Review (3)

## Key files to modify:
- `client/src/pages/new-project.tsx` - Main wizard page  
- `client/src/components/wizard/progress-indicator.tsx` - Progress indicator component

## Files that can be deleted (optional cleanup):
- `client/src/components/wizard/step-search-engines.tsx`
- `client/src/components/wizard/step-competitors.tsx`

## Application Status:
- The application is running successfully on port 5000
- All packages have been installed
- Workflow "Start application" is running

## Implementation Plan:
1. Edit new-project.tsx to remove step 3 and 4 logic
2. Edit progress-indicator.tsx to show only 3 steps
3. Restart workflow and verify
