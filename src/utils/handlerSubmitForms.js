import {getErrorMessage} from "./getErrorMessage.js";

export default async function handleSubmitForms(api, form) {
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    if (data.is_active) {
        data.is_active = data.is_active === 'active' ? 1 : 0;

    }

    if (data.is_system) {
        data.is_system = data.is_system ? 1 : 0;
    }

    if (data.permissions) {
        data.permissions = formData.getAll('permissions')
    }

    try {
        let response;

        if (form.target === 'update') {
            response = await api(form.name, data);
        } else {
            response = await api(data);
        }

        const dataResponse = response.data;

        if (response.status === 200 || response.status === 201) {
            return {
                data: dataResponse.data,
                notify: {
                    title: "Success",
                    color: "green",
                    message: dataResponse.data.message
                }
            };
        }

        return {
            data: null,
            notify: {
                title: "Fail",
                color: "red",
                message: dataResponse.success
                    ? getErrorMessage(dataResponse.data.code)
                    : dataResponse.error.message
            }
        };

    } catch (error) {
        console.error(error);

        return {
            data: null,
            notify: {
                title: "Error",
                color: "red",
                message: "Something went wrong"
            }
        };
    }
}