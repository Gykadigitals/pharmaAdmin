export const PERMISSION_GROUPS = [
    {
        title: "Daily Work & Field Operations",
        permissions: [
            { key: "DAY_PLAN", label: "Day Plan" },
            { key: "MY_ACTIVITY", label: "My Activity" },
            { key: "ADD_CLIENT", label: "Add Client" },
            { key: "EXPENSE", label: "Expense" },
            { key: "TOUR_PLAN", label: "Tour Plan" },
            { key: "SALE", label: "Sale/Target" },
            { key: "COMPLAINT", label: "Complaint Form" },
        ]
    },
    {
        title: "HRMS",
        permissions: [
            { key: "LEAVES", label: "Leaves" },
            { key: "HOLIDAYS", label: "Holidays" },
            { key: "PAY_SLIPS", label: "Pay Slips" },
            { key: "HR_DATA", label: "HR Data Hub" }
        ]
    },
    {
        title: "Reports",
        permissions: [
            { key: "REPORTS", label: "Reports Hub" },
        ]
    },
    {
        title: "Communication",
        permissions: [
            { key: "CHAT", label: "Internal Chat" },
            { key: "NOTIFICATIONS", label: "Push Notifications" },
        ]
    },
    {
        title: "Extra Features",
        permissions: [
            { key: "TODO", label: "To-Do List" },
        ]
    },
    {
        title: "Administration",
        permissions: [
            { key: "CREATE_USER", label: "Manage Users" },
            { key: "CREATE_ROLE", label: "Manage Roles" },
            { key: "MAP_VIEW", label: "Map View" },
            { key: "ASSESSMENT", label: "Full Assessment" },
            { key: "TARGET_VS_ACHIEVEMENT", label: "Target vs Ach." },
        ]
    }
];
