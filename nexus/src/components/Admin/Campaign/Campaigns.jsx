import {useCallback, useEffect, useState} from "react";
import {admin} from "../../../api/axios.jsx";
import {JwtConstants} from "../../../constants/JwtConstats.js";
import {useNavigate} from "react-router-dom";
import {
    Button,
    Container, Fab, IconButton,
    Paper,
    Stack,
    Table, TableBody,
    TableCell,
    TableContainer,
    TableHead, TablePagination,
    TableRow, Tooltip
} from "@mui/material";
import dayjs from "dayjs";
import {
    Add,
    Edit,
    OpenInNew,
    PlayCircle,
    StopCircle
} from "@mui/icons-material";
import CampaignDialogue from "./CampaignDialogue.jsx";

const Campaigns = (props) => {
    const CAMPAIGNS_URL = '/campaigns';
    const CAMPAIGN_URL = '/campaign/';
    const dateFormat = 'DD/MM/YYYY';

    // eslint-disable-next-line react/prop-types
    const handleError = props.handleError;
    // eslint-disable-next-line react/prop-types
    const handleChangeCampaign = props.handleChangeCampaign;

    const [campaigns, setCampaigns] = useState([]);
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(5);
    const [totalElements, setTotalElements] = useState(0);
    const [dialogue, setDialogue] = useState(false);
    const [campaign, setCampaign] = useState(null);

    const navigate = useNavigate();

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    }
    const handleChangePageSize = (event) => {
        setPageSize(+event.target.value);
        setPage(0);
    }
    const handleOpenDialogue = (campaign) => {
        setDialogue(true);
        setCampaign(campaign);
    }
    const handleCloseDialogue = () => {
        setDialogue(false);
    }

    const getCampaigns = useCallback(async () => {
        const params = {
            page: page,
            size: pageSize
        };

        try {
            const response = await admin.get(CAMPAIGNS_URL, {
                params: params
            });

            setCampaigns(response.data.content);
            setTotalElements(response.data.totalElements);
        } catch (err) {
            if (err.response.status === 401) {
                localStorage.removeItem(JwtConstants.KEY);
                navigate(0);
            } else {
                handleError(err.response?.data);
            }
        }
    }, [page, pageSize, handleError, navigate]);

    useEffect(() => {
        getCampaigns().then(null);
    }, [getCampaigns, dialogue]);

    const formatDate = (date) => {
        return dayjs(date).isValid() ? dayjs(date).format(dateFormat) : '-';
    }

    const startCampaign = async (campaign) => {
        const url = CAMPAIGN_URL + campaign.name + '/start';

        try {
            await admin.patch(url);

            getCampaigns().then(null);
        } catch (err) {
            if (err.response.status === 401) {
                localStorage.removeItem(JwtConstants.KEY);
                navigate(0);
            } else {
                handleError(err.response?.data);
            }
        }
    }

    const stopCampaign = async (campaign) => {
        const url = CAMPAIGN_URL + campaign.name + '/stop';

        try {
            await admin.patch(url);

            getCampaigns().then(null);
        } catch (err) {
            if (err.response.status === 401) {
                localStorage.removeItem(JwtConstants.KEY);
                navigate(0);
            } else {
                handleError(err.response?.data);
            }
        }
    }

    const renderButtons = (campaign) => {
        const buttons = [];

        if (campaign.isActive) {
            buttons.push(
                <Tooltip title="Stop campaign" key="stop">
                    <IconButton color="error" onClick={() => stopCampaign(campaign)}>
                        <StopCircle/>
                    </IconButton>
                </Tooltip>
            );
        } else {
            buttons.push(
                <Tooltip title="Start campaign" key="start">
                    <IconButton color="success" onClick={() => startCampaign(campaign)}>
                        <PlayCircle/>
                    </IconButton>
                </Tooltip>
            );
        }

        buttons.push(
            <Tooltip title="Edit" key="edit">
                <IconButton onClick={() => handleOpenDialogue(campaign)}>
                    <Edit/>
                </IconButton>
            </Tooltip>
        );

        return(
            <Stack
                direction="row"
                spacing={1}
            >
                {buttons}
            </Stack>
        );

    }

    const renderCampaigns = () => {
        return (
            <>
                {campaigns.map((campaign) => (
                <TableRow
                    key={campaign.name}
                >
                    <TableCell sx={{minWidth: 170}}>
                        <Tooltip title="See campaign products" key="products">
                        <Button
                            sx={{textTransform: "none", color: "black", fontWeight: "bold"}}
                            endIcon={<OpenInNew/>}
                            onClick={() => handleChangeCampaign(campaign.name)}
                        >
                            {campaign.name}
                        </Button>
                        </Tooltip>
                    </TableCell>
                    <TableCell sx={{minWidth: 50}}>
                        {formatDate(campaign.startDate)}
                    </TableCell>
                    <TableCell sx={{minWidth: 50}}>
                        {formatDate(campaign.endDate)}
                    </TableCell>
                    <TableCell>
                        {renderButtons(campaign)}
                    </TableCell>
                </TableRow>
                ))}
            </>
        );
    }

    return (
        <Container maxWidth="md">
            <Paper>
                <TableContainer sx={{height: '38rem'}}>
                    <Table stickyHeader>
                        <TableHead sx={{
                            '& th': {
                                color: 'white',
                                backgroundColor: '#444'
                            }
                        }}>
                            <TableRow>
                                <TableCell>Name</TableCell>
                                <TableCell>Start date</TableCell>
                                <TableCell>End date</TableCell>
                                <TableCell>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {renderCampaigns()}
                        </TableBody>
                    </Table>
                </TableContainer>
                <Stack sx={{borderTop: '1px solid rgba(224, 224, 224, 1)'}}>
                    <TablePagination
                        rowsPerPageOptions={[5, 10, 25]}
                        component="div"
                        count={totalElements}
                        rowsPerPage={pageSize}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangePageSize}
                    />
                </Stack>
            </Paper>
            <Fab
                color="primary"
                aria-label="add"
                sx={{
                    position: 'absolute',
                    bottom: 16,
                    right: 16,
                }}
                onClick={() => handleOpenDialogue(null)}
            >
                <Add />
            </Fab>
            {/*<AddCampaign open={add} handleClose={handleCloseAdd} handleError={handleError}/>*/}
            {/*<EditCampaign campaign={campaign} open={edit} handleClose={handleCloseEdit} handleError={handleError}/>*/}
            <CampaignDialogue
                campaign={campaign}
                open={dialogue}
                handleClose={handleCloseDialogue}
                handleError={handleError}
            />
        </Container>
    )
}

export default Campaigns