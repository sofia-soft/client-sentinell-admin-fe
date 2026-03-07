/**
 * Търсене по свободен текст във всички колони
 */
export const filterBySearch = (data, search) => {
    const query = search.toLowerCase().trim();
    if (!query) return data;

    return data.filter((item) =>
        Object.values(item).some((value) =>
            String(value).toLowerCase().includes(query)
        )
    );
};

/**
 * @param {Array} data
 * @param {String} value
 * @param {String} key
 */
export const filterBySelect = (data, value, key) => {
    if (!value) return data;

    return data.filter((item) => {
        if (key === 'status' || key === 'system') {
            const realKey = key === "status" ? "is_active" : "is_system";
            const normalizedValue = value.value === 'active' || value.value === 'yes' ? 1 : 0;
            return item[realKey] === normalizedValue;
        }
        return String(item[key]) === String(value.value);
    });
};