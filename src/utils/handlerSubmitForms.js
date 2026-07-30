import {getErrorMessage} from "./getErrorMessage.js";

export default async function handleSubmitForms(api, form, imagePath, clearData) {
    let data;

    if(clearData) {
        data = clearData;
    } else {
        const formData = new FormData(form);
        data = Object.fromEntries(formData.entries());

        console.log(data)
        if (imagePath) {
            data.main_image = imagePath;
        }
        if (data.is_active) {
            data.is_active = data.is_active === 'active' ? 1 : 0;

        }

        if (data.price) {
            data.price = Number.parseFloat(data.price.replace('€', '').trim())
        }

        if (data.is_system) {
            data.is_system = data.is_system ? 1 : 0;
        }

        if (data.approved) {
            data.approved = data.approved === 'on' ? 1 : 0;
        }

        if (data.permissions) {
            data.permissions = formData.getAll('permissions')
        }

        if (data.role_name) {
            data.name = data.role_name
            delete data.role_name
        }

        if (data.stock_quantity) {
            data.stock_quantity = Number.parseInt(data.stock_quantity)
        }
    }

        try {
        let response;

        if (form.target === 'update') {

            response = await api(form.name, data);
        } else {
            response =  form.name ? await api(form.name, data) : await api(data);
        }

        const dataResponse = response.data;

        if (response.status === 200 && !('success' in (dataResponse)) || response.status === 201 && !('success' in (dataResponse)) ) {
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
                    : dataResponse.data.error
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