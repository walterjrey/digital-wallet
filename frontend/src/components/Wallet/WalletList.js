import * as React from 'react';
import Typography from '@mui/material/Typography';
import { Container } from '@mui/material';
import Grid from '@mui/material/Grid';
import { useNavigate } from 'react-router-dom'
import axios from 'axios';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import Switch from '@mui/material/Switch';
import CircularProgress from '@mui/material/CircularProgress';
import { BACKEND } from "../../constants";
import WalletItem from '../WalletItem/WalletItem';
import { ethers } from "ethers";

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

export default function WalletList({ setLoggedIn }) {
    const [wallets, setWallets] = React.useState([])
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const [address, setAddress] = React.useState("")
    const [title, setTitle] = React.useState("")
    const [errorMessage, setErrorMessage] = React.useState(false)
    const [working, setWorking] = React.useState(false);
    const [byFav, setByFav] = React.useState(false);

    const ChangeOrderByFav = async (e) => {
        e.preventDefault();
        await fetchData(e.target.checked);
        setByFav(!e.target.checked);
    }

    const connectToMetamask = async () => {
        let provider;
        if (window.ethereum == null) {
            console.log("MetaMask not installed; using read-only defaults")
            provider = ethers.getDefaultProvider()
            setErrorMessage("You are not connected to Ethereum.");
            return;

        } else {
            provider = new ethers.BrowserProvider(window.ethereum)
        }
        const accounts = await provider.send("eth_requestAccounts", []);
        setAddress(accounts[0]);
        setErrorMessage("");
    }

    const submitForm = async (e) => {
        e.preventDefault();
        setWorking(true);

        if(!ethers.isAddress(address)) {
            setErrorMessage("Wallet address not valid.");
            return;
        }

        const form = {
          title : title,
          address: address
        };

        try {
            const token = localStorage.getItem('token');
            await axios.post(BACKEND + "/api/v1/wallet", form, {
                headers: ({
                    Authorization: 'Bearer ' + token
                })
            });
            setTitle("");
            setAddress("");
            setOpen(false);
            setWorking(false);
            console.log('fetchData(byFav)', byFav);
            fetchData(byFav);
        } catch(e) {
            setLoggedIn(false);
            navigate('/');
        }
    }

    const navigate = useNavigate();

    const fetchData = async (orderByFav) => {
        try {
            const token = localStorage.getItem('token');
            const {data} = await axios.get(BACKEND + "/api/v1/wallet?orderByFav=" + orderByFav, {
                headers: ({
                    Authorization: 'Bearer ' + token
                })
            });
            setWallets(data)

        } catch {
            setLoggedIn(false);
            navigate('/')
        }
    }

    React.useEffect(() => {
        fetchData(byFav);
    }, [navigate, setLoggedIn]);
    return (
        <Container>
            <p />
            <Button variant="contained" onClick={handleOpen}>Add New Wallet</Button>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        <Box component="form" onSubmit={submitForm} noValidate sx={{ mt: 1 }}>
                            <label>Wallet Title:</label>
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="title"
                                name="title"
                                autoFocus
                                onChange={(e) => setTitle(e.target.value)}
                            />
                            <label>Wallet Address:</label>
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="address"
                                name="address"
                                value={address}
                                autoFocus
                                onChange={(e) => setAddress(e.target.value)}
                            />
                            {working && 
                            <CircularProgress />
                            }
                            {!working &&
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                sx={{ mt: 3, mb: 2 }}
                            >
                                Submit
                            </Button>
                            }
                            <p />
                            {errorMessage && 
                            <Alert severity="error">{errorMessage}</Alert>
                            }
                            <Button
                                type="button"
                                onClick={(e) => connectToMetamask()}
                                fullWidth
                                variant="contained"
                                sx={{ mt: 3, mb: 2 }}
                            >
                                Get Address from Ethereum
                            </Button>
                        </Box>
                    </Typography>
                </Box>
            </Modal>
            <p />
            <FormGroup>
                <FormControlLabel control={<Switch onChange={(e) => ChangeOrderByFav(e)} />} label="Favourites first" />
            </FormGroup>
            <p />
            <Grid container spacing={2}>
                    {wallets.map((wallet) => {
                        return <WalletItem key={'wa' + wallet._id} wallet={wallet} />
                    })}
            </Grid>
        </Container >
    );
}
