# Edit Functionality Fix Plan

## Issue
The edit functionality in business opportunity received and visitors tabs is not working properly. The form data from DataForm component is not being properly passed to the backend update function.

## Root Cause
The `handleFormSubmit` function calls `saveEdit()` which uses stale `editForm` state instead of current form data from the DataForm component.

## Plan
1. Fix the `handleFormSubmit` function to pass current form data to the update function
2. Update the data hooks to accept form data in the `saveEdit` function
3. Ensure proper data synchronization between form and hook states

## Files to Edit
- `frontend/src/pages/Home.jsx` - Fix the handleFormSubmit function
- `frontend/src/config/BusinessData.jsx` - Update the saveEdit function to accept form data

## Steps
1. [ ] Update BusinessData.jsx hooks to accept form data in saveEdit function
2. [ ] Fix handleFormSubmit in Home.jsx to pass current form data
3. [ ] Test edit functionality for business opportunity received tab
4. [ ] Test edit functionality for visitors tab
5. [ ] Verify backend properly stores updated values
