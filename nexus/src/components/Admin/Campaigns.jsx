import {useCallback, useEffect, useState} from "react";
import {admin} from "../../api/axios.jsx";
import {JwtConstants} from "../../constants/JwtConstats.js";
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

const Campaigns = (props) => {
    const CAMPAIGNS_URL = '/campaigns';
    const CAMPAIGN_URL = '/campaign/';
    const dateFormat = 'DD/MM/YYYY';

    const handleError = props.handleError;
    const handleChangeCampaign = props.handleChangeCampaign;

    const [campaigns, setCampaigns] = useState([]);
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(5);
    const [totalElements, setTotalElements] = useState(0);

    const navigate = useNavigate();

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    }
    const handleChangePageSize = (event) => {
        setPageSize(+event.target.value);
        setPage(0);
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
            }

            handleError(err.response?.data);
        }
    }, [page, pageSize, handleError, navigate]);

    useEffect(() => {
        getCampaigns().then(null);
    }, [getCampaigns]);

    const formatDate = (date) => {
        return dayjs(date).isValid() ? dayjs(date).format(dateFormat) : '-';
    }

    const startCampaign = async (campaign) => {
        const url = CAMPAIGN_URL + campaign.name + '/start';

        try {
            await admin.patch(url);

            const updatedCampaign = {
                ...campaign,
                isActive: true
            };

            setCampaigns(campaigns.map(c => c.name === campaign.name ? updatedCampaign : c));
        } catch (err) {
            if (err.response.status === 401) {
                localStorage.removeItem(JwtConstants.KEY);
                navigate(0);
            }

            handleError(err.response?.data);
        }
    }

    const stopCampaign = async (campaign) => {
        const url = CAMPAIGN_URL + campaign.name + '/stop';

        try {
            await admin.patch(url);

            const updatedCampaign = {
                ...campaign,
                isActive: false,
                startDate: '-',
                endDate: '-'
            };

            setCampaigns(campaigns.map(c => c.name === campaign.name ? updatedCampaign : c));
        } catch (err) {
            if (err.response.status === 401) {
                localStorage.removeItem(JwtConstants.KEY);
                navigate(0);
            }

            handleError(err.response?.data);
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
                <IconButton>
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
                    <TableCell sx={{width: '40%'}}>
                        <Button
                            sx={{textTransform: "none", color: "black", fontWeight: "bold"}}
                            endIcon={<OpenInNew/>}
                            onClick={() => handleChangeCampaign(campaign.name)}
                        >
                            {campaign.name}
                        </Button>
                    </TableCell>
                    <TableCell sx={{width: '20%'}}>
                        {formatDate(campaign.startDate)}
                    </TableCell>
                    <TableCell sx={{width: '20%'}}>
                        {formatDate(campaign.endDate)}
                    </TableCell>
                    <TableCell sx={{width: '20%'}}>
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
            >
                <Add />
            </Fab>
        </Container>
    )
}

export default Campaigns