import {useNavigate} from "react-router-dom";
import {Button, Typography} from "@mui/material";

const Unauthorized = () => {
    const navigate = useNavigate()

    const goBack = () => navigate(-1)

    return (
        <>
            <Typography variant="h1">
                Unauthorized
            </Typography>
            <br/>
            <Typography variant="body1">
                You do not have access to the requested page.
            </Typography>
            <Button onClick={goBack}>Go back</Button>
        </>
    )
}

export default Unauthorized