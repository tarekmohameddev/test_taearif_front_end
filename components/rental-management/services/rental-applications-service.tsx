// This file has been refactored into a modular structure
// Please import from: ./rental-applications-service/index.tsx
// 
// The original large file (3882 lines) has been split into:
// - types/types.ts
// - utils/ (helpers, statusHelpers, translations)
// - services/api.ts
// - hooks/ (useRentalApplications, useRenewalDialog, useStatusChangeDialog, useRentalFilters)
// - components/ (AddRentalForm, EditRentalForm, RentalsFilters, RentalsTable, RentalsPagination)

export { RentalApplicationsService } from "./rental-applications-service/index";
