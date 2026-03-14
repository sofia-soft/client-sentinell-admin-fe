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

        console.log(response)
        if (response.status === 401 && !url.includes('/login') && !url.includes('/refresh')) {
            const refreshRes = await fetch('/api/v1/auth/refresh/', {
                method: 'POST',
                credentials: 'include',
                headers: {'X-CSRF-Token': getCookie('csrf_token') || ''}
            });

            if (refreshRes.ok) {
                options.headers['X-CSRF-Token'] = getCookie('csrf_token') || '';
                response = await fetch(url, options);
            } else {
                localStorage.removeItem('user');
                window.dispatchEvent(new Event('auth-expired'));
                return { data: { data: [] }, error: "Session expired", status: 401 };
            }
        }

        const isJson = response.headers.get('content-type')?.includes('application/json');
        const result = isJson ? await response.json() : null;

        return {data: result, status: response.status};

    } catch (err) {
        console.log(err)
        return {error: "Service unavailable", status: 503};
    }
};

export const get = request.bind(null, 'GET');
export const post = request.bind(null, 'POST');
export const put = request.bind(null, 'PUT');
export const patch = request.bind(null, 'PATCH');
export const del = request.bind(null, 'DELETE');