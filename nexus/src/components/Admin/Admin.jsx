import {Box, Tab} from "@mui/material";
import {useState} from "react";
import {TabContext, TabList, TabPanel} from "@mui/lab";
import Users from "./Users.jsx";
import Sales from "./Sales.jsx";

const Admin = () => {
    const [tab, setTab] = useState('1');
    const handleChangeTab = (event, newTab) => {
        setTab(newTab);
    };

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
                        <Tab label="Users" value="1"/>
                        <Tab label="Products" value="2"/>
                        <Tab label="Campaigns" value="3"/>
                        <Tab label="Sales" value="4"/>
                    </TabList>
                </Box>
                <TabPanel value="1"><Users/></TabPanel>
                <TabPanel value="2">Item Two</TabPanel>
                <TabPanel value="3">Item Three</TabPanel>
                <TabPanel value="4"><Sales/></TabPanel>
            </TabContext>
        </Box>
    )
}

export default Admin;