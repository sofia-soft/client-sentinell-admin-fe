
const getApiBase = () => {
    const env = localStorage.getItem("api-env");

    return import.meta.env[`VITE_API_URL_${env}`];
};

const API_BASE = getApiBase();
const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return '';
};


let refreshPromise = null;

const doRefresh = () => {
    if (refreshPromise) return refreshPromise;

    refreshPromise = fetch(`${API_BASE}/api/v1/auth/refresh/`, {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRF-Token': getCookie('csrf_token'),
        },
    }).finally(() => {
        refreshPromise = null;
    });

    return refreshPromise;
};


const request = async (method, url, data) => {

    try {
        const isUpload = url.includes('upload-image');

        const buildOptions = (csrfOverride = null) => {
            const opts = {
                method,
                credentials: 'include',
                headers: {
                    'X-CSRF-Token': csrfOverride ?? getCookie('csrf_token'),
                },
            };
            if (method !== 'GET' && data !== undefined) {
                if (!isUpload) opts.headers['Content-Type'] = 'application/json';
                opts.body = isUpload ? data : JSON.stringify(data);
            }
            return opts;
        };

        let response = await fetch(`${API_BASE}${url}`, buildOptions());


        if (
            response.status === 401 &&
            !url.includes('/login') &&
            !url.includes('/refresh')
        ) {
            const refreshRes = await doRefresh();

            if (refreshRes.ok) {
                let newCsrf = null;
                try {
                    const refreshJson = await refreshRes.json();
                    newCsrf = refreshJson?.data?.csrf_token ?? null;
                } catch {
                }

                response = await fetch(`${API_BASE}${url}`, buildOptions(newCsrf));
            } else {
                localStorage.removeItem('user');
                window.dispatchEvent(new Event('auth-expired'));
                return {data: null, error: 'Session expired', status: 401};
            }
        }

        const isJson = response.headers.get('content-type')?.includes('application/json');
        const result = isJson ? await response.json() : null;

        return {data: result, status: response.status};

    } catch (err) {
        console.error('[API]', err);
        return {error: 'Service unavailable', status: 503};
    }
};

export const get = request.bind(null, 'GET');
export const post = request.bind(null, 'POST');
export const put = request.bind(null, 'PUT');
export const patch = request.bind(null, 'PATCH');
export const del = request.bind(null, 'DELETE');