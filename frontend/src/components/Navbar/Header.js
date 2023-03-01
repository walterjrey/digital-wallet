import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { currencyFormat } from '../utils/currencies';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { update } from '../utils/rates';
import { BACKEND } from "../../constants";

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

export default function SearchAppBar({isLoggedIn}) {
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const [rateUSD, setRateUSD] = React.useState(localStorage.getItem('rate_usd'));
    const [rateEURO, setRateEURO] = React.useState(localStorage.getItem('rate_euro'));
    const dispatch = useDispatch();

    const EditRates = async (e) => {
        e.preventDefault();
        const form = {
            usd: rateUSD,
            euro: rateEURO
        };
        const token = localStorage.getItem('token');
        await axios.post(BACKEND + "/api/v1/wallet/rates", form, {
            headers: ({
                Authorization: 'Bearer ' + token
            })
        });

        localStorage.setItem('rate_usd', rateUSD);
        localStorage.setItem('rate_euro', rateEURO);
        dispatch(update())
    }

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static">
                <Toolbar>
                    <Typography
                        variant="h6"
                        noWrap
                        component="div"
                        sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' } }}
                    >
                        Digital Wallet Dashboard
                    </Typography>
                    {isLoggedIn &&
                    <div>
                        <Stack direction="row" spacing={1} onClick={handleOpen}>
                            <Chip label={'$ ' + currencyFormat(rateUSD)} variant="outlined" style={{backgroundColor: '#fff'}} onClick={EditRates} />
                            <Chip label={'€ ' + currencyFormat(rateEURO)} variant="outlined" style={{backgroundColor: '#fff'}} onClick={EditRates} />
                        </Stack>
                        <Modal
                        open={open}
                        onClose={handleClose}
                        aria-labelledby="modal-modal-title"
                        aria-describedby="modal-modal-description"
                    >
                        <Box sx={style}>
                            <Typography id="modal-modal-title" variant="h6" component="h2">
                                <Box component="form" onSubmit={EditRates} noValidate sx={{ mt: 1 }}>
                                    <label>Price USD</label>
                                    <TextField
                                        margin="normal"
                                        required
                                        fullWidth
                                        id="usd"
                                        name="usd"
                                        value={rateUSD}
                                        autoFocus
                                        onChange={(e) => setRateUSD(e.target.value)}
                                    />
                                    <label>Price EURO</label>
                                    <TextField
                                        margin="normal"
                                        required
                                        fullWidth
                                        id="euro"
                                        name="euro"
                                        value={rateEURO}
                                        autoFocus
                                        onChange={(e) => setRateEURO(e.target.value)}
                                    />
                                    <Button
                                        type="submit"
                                        fullWidth
                                        variant="contained"
                                        sx={{ mt: 3, mb: 2 }}
                                    >
                                        Submit
                                    </Button>
                                </Box>
                            </Typography>
                        </Box>
                    </Modal>
                    </div>
                    }
                </Toolbar>
            </AppBar>
        </Box>
    );
}
