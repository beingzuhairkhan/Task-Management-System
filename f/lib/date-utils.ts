export function formatDate(date?: string) {
    if (!date) return "No due date";

    const parsed = new Date(date);

    if (Number.isNaN(parsed.getTime())) {
        return "No due date";
    }

    return parsed.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });
}