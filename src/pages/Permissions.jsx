import {PageContentTemplate} from "../components/PageContentTemplate.jsx";
import {PERMISSIONS_HEADER, PERMISSIONS_DATA, BUTTON_VISIBILITY} from "../config/permissionConfig.js";

export function Permissions() {


    return (
        <>
            <h1>Permissions</h1>

            <PageContentTemplate
                tableData={
                    {
                        header: PERMISSIONS_HEADER,
                        rows: PERMISSIONS_DATA,

                    }
                }
                buttonsVisible={BUTTON_VISIBILITY}
                resourceName="permissions"
            />
        </>

    )
}