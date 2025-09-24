# Task: Migrate Business Sections to Use API Routes Instead of Hardcoded Data

## Information Gathered:
- Backend has generic routes in `/api/data/:sectionId` that can handle any section type (GET, POST, PUT, DELETE)
- Frontend has `businessDataService` and `useBusinessData` hook already implemented in `businessSections.jsx`
- Business sections currently have hardcoded data in the `data` property
- Connections and testimonials sections successfully use API routes via `useConnectionsData` and `useTestimonialsData` hooks
- Need to remove hardcoded data and make sections use `useBusinessData` hook instead

## Plan:
1. **Update businessSections.jsx**:
   - Remove hardcoded `data` arrays from all business sections
   - Add `useBusinessData` hook integration to sections that need dynamic data
   - Keep sections like 'connections' and 'testimonials' as placeholders since they're handled separately

2. **Create BusinessData.jsx**:
   - Create a new file similar to `ConnectionsTestimonialsData.jsx`
   - Implement specific hooks for each business section (useP2PData, useBusinessOpportunitiesData, etc.)
   - Include API service functions and utility functions

3. **Update components that use business sections**:
   - Modify any components that currently use hardcoded business data
   - Make them use the new hooks instead

4. **Test and verify**:
   - Ensure all business sections fetch data from API
   - Verify CRUD operations work correctly
   - Test error handling and loading states

## Dependent Files to be Edited:
- `frontend/src/config/businessSections.jsx` - Remove hardcoded data, add hook integration
- `frontend/src/config/BusinessData.jsx` - New file with hooks and services
- Any components using business sections (if needed)

## Followup Steps:
- Test API endpoints with different section IDs
- Verify data persistence in backend
- Update any UI components that display business section data
- Test error handling for failed API calls
- Ensure proper loading states are displayed
