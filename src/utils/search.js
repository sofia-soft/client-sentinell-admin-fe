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
 * Връща сравнимата стойност за дадена филтър-колона.
 * Специални случаи: status -> is_active, system -> is_system.
 * Ако колоната е обект (напр. role), взима .name / .value.
 */
export const getFilterValue = (item, key) => {
    if (key === 'status') {
        return item.is_active === 1 || item.is_active === true ? 'active' : 'inactive';
    }
    if (key === 'system') {
        return item.is_system === 1 || item.is_system === true ? 'yes' : 'no';
    }

    const raw = item[key];
    if (raw && typeof raw === 'object') return raw.name ?? raw.value ?? '';
    return raw;
};

/**
 * Уникалните опции за филтъра, извлечени от реалните данни.
 */
export const getFilterOptions = (data, key) => {
    if (!key) return [];
    if (key === 'status') return ['active', 'inactive'];
    if (key === 'system') return ['yes', 'no'];

    const unique = new Set();
    (data || []).forEach((item) => {
        const value = getFilterValue(item, key);
        if (value !== null && value !== undefined && value !== '') {
            unique.add(String(value));
        }
    });
    return [...unique];
};

export const filterBySelect = (data, value, key) => {
    if (!value) return data;

    return data.filter(
        (item) => String(getFilterValue(item, key)) === String(value)
    );
};