import {PageContentTemplate} from "../components/PageContentTemplate.jsx";
import {ROLES_HEADER, ROLES_DATA, BUTTON_VISIBILITY} from "../config/rolesConfig.js";

export function Roles() {

    return (
        <>
            <h1>Roles</h1>

            <PageContentTemplate tableData={
                {
                    header: ROLES_HEADER,
                    rows: ROLES_DATA
                }
            } buttonsVisible={BUTTON_VISIBILITY}/>
        </>
    )

}