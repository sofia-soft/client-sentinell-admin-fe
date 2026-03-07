import {PageContentTemplate} from "../components/PageContentTemplate.jsx";
import {
    USER_DATA,
    BUTTON_VISIBILITY,
    USER_HEADER
} from "../config/usersConfig.js"

export function Users() {
    return (
        <>
            <h1>Users</h1>

            <PageContentTemplate tableData={
                {
                    header: USER_HEADER,
                    rows: USER_DATA
                }
            } buttonsVisible={BUTTON_VISIBILITY}/>
        </>
    )
}