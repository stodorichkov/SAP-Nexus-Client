import {Alert, Box, Snackbar, Tab} from "@mui/material";
import {useState} from "react";
import {TabContext, TabList, TabPanel} from "@mui/lab";
import Users from "./Users.jsx";
import Sales from "./Sales.jsx";
import Campaigns from "./Campaigns.jsx";
import CampaignProducts from "./CampaignProducts.jsx";

const Admin = () => {
    const [tab, setTab] = useState('Users');
    const [campaign, setCampaign] = useState(null);
    const [open, setOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const handleChangeTab = (event, newTab) => {
        setTab(newTab);
        setOpen(false);
    };
    const handleChangeCampaign= (newCampaign) => {
        setCampaign(newCampaign);
        setTab('Campaign products');
    }
    const handleError = (message) => {
        setErrorMessage(message);
        setOpen(true);
    }
    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpen(false);
    };

    const renderAlert  = () => {
        return (
            <Snackbar
                open={open}
                autoHideDuration={5000}
                anchorOrigin={{ vertical: 'top', horizontal: 'right'}}
                onClose={handleClose}
                sx={{marginTop: '8rem', maxWidth: '15%'}}
            >
                <Alert severity="error" variant="filled" onClose={handleClose}>
                    {errorMessage}
                </Alert>
            </Snackbar>
        )
    }

    return(
        <Box sx={{ width: '100%', typography: 'body1' }}>
            <TabContext value={tab}>
                <Box>
                    <TabList
                        onChange={handleChangeTab}
                        centered
                        textColor="inherit"
                        indicatorColor="inherit"
                        sx={{
                            borderBottom: 1,
                            borderColor: 'divider',
                            bgcolor: '#444',
                            color: '#fff'
                        }}
                    >
                        <Tab label="Users" value="Users"/>
                        <Tab label="Products" value="Products"/>
                        <Tab label="Campaigns" value="Campaigns"/>
                        <Tab label="Campaign products" value="Campaign products" disabled={campaign === null}/>
                        <Tab label="Sales" value="Sales"/>
                    </TabList>
                </Box>
                {renderAlert()}
                <TabPanel value="Users">
                    <Users handleError={handleError}/>
                </TabPanel>
                <TabPanel value="Products">
                    Item Two
                </TabPanel>
                <TabPanel value="Campaigns">
                    <Campaigns
                        handleError={handleError}
                        handleChangeCampaign={handleChangeCampaign}
                    />
                </TabPanel>
                <TabPanel value="Campaign products">
                    <CampaignProducts handleError={handleError} campaign={campaign}/>
                </TabPanel>
                <TabPanel value="Sales">
                    <Sales handleError={handleError}/>
                </TabPanel>
            </TabContext>
        </Box>
    )
}

export default Admin;