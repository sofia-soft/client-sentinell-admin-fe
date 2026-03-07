const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
};

const request = async (method, url, data) => {
    try {
        const options = {
            method,
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-Token': getCookie('csrf_token') || '',
            },
            credentials: 'include',
        };

        if (method !== 'GET' && data) {
            options.body = JSON.stringify(data);
        }

        let response = await fetch(url, options);

        if (response.status === 401 && !url.includes('/auth/login') && !url.includes('/auth/refresh')) {
            const refreshRes = await fetch('/api/auth/refresh', {
                method: 'POST',
                credentials: 'include',
                headers: { 'X-CSRF-Token': getCookie('csrf_token') || '' }
            });

            if (refreshRes.ok) {
                options.headers['X-CSRF-Token'] = getCookie('csrf_token');
                response = await fetch(url, options);
            } else {
                window.location.href = '/login';
                return { error: "Session expired" };
            }
        }

        const result = await response.json();
        return { data: result, status: response.status };

    } catch (err) {
        if (err instanceof TypeError) {
            return { error: "Service unavailable. Please try again." };
        }
        return { error: "An unexpected error occurred." };
    }
};

export const get = request.bind(null, 'GET');
export const post = request.bind(null, 'POST');
export const put = request.bind(null, 'PUT');
export const patch = request.bind(null, 'PATCH');
export const del = request.bind(null, 'DELETE');