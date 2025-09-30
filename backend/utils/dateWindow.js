function getDefaultDateWindow(req) {
    const now = new Date();

    // gets start of week (monday)
    const startOfWeekUtc = new Date(Date.UTC(
        now.getUTCFullYear(),
        now.getUTCMonth(),
        now.getUTCDate()
    ));
    const dow = (startOfWeekUtc.getUTCDay() + 6) % 7;
    startOfWeekUtc.setUTCDate(startOfWeekUtc.getUTCDate() - dow);
    startOfWeekUtc.setUTCHours(0, 0, 0, 0);

    // add 28 days (current week + 3 weeks in advance)
    const endPlus2WeeksUtc = new Date(startOfWeekUtc);
    endPlus2WeeksUtc.setUTCDate(endPlus2WeeksUtc.getUTCDate() + 28);

    return {
        from: req.query.from ?? startOfWeekUtc.toISOString(),
        to: req.query.to ?? endPlus2WeeksUtc.toISOString()
    };
}

module.exports = { getDefaultDateWindow };