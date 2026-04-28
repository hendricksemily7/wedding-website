## Admin Handoff (Compact)

### Current State
1. Admin is split into routes with shared shell + one PIN session:
	- `/admin/guests`
	- `/admin/vendors`
	- `/admin/expenses`
	- `/admin/tasks`
2. `/admin` redirects to `/admin/guests`.
3. Shared PIN gate lives in `src/app/admin/AdminShell.tsx` and `src/app/admin/layout.tsx`.
4. Planning models/API implemented for Vendor, Expense, Task.
5. Vendor cards are editable inline on vendors page.
6. Seed data imported:
	- Vendors: 11 rows
	- Expenses: 28 rows

### Key Files
- `src/app/admin/AdminShell.tsx`
- `src/app/admin/layout.tsx`
- `src/app/admin/GuestAdmin.tsx`
- `src/app/admin/PlanningDashboard.tsx`
- `src/app/admin/guests/page.tsx`
- `src/app/admin/vendors/page.tsx`
- `src/app/admin/expenses/page.tsx`
- `src/app/admin/tasks/page.tsx`
- `src/app/admin/page.tsx`
- `src/db/planning.ts`
- `prisma/schema.prisma`

### Next Slice (Recommended)
1. Navigation clarity pass:
	- Reduce cross-section noise when in one planning section.
	- Keep top-level admin nav minimal; show section-local controls only.
2. Inline edit parity:
	- Add full inline edit to expenses and tasks (not only status changes).
3. Data integrity polish:
	- Link seeded expenses to matching vendors (`vendorId`).
4. Optional import/export:
	- CSV export for vendors/expenses/tasks.

### Resume Prompt For New Session
Use this exact prompt in a fresh chat:

"Continue from `src/app/admin/plan.md` handoff. Keep current routed admin architecture. Implement the navigation clarity pass first so each planning page feels focused (especially vendors page). Then add inline edit parity for expenses and tasks. Preserve existing styles and APIs unless needed. Run `npm run build` before finishing and summarize changed files."