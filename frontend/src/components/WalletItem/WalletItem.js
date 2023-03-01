import * as React from 'react';
import axios from 'axios';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Fav from '../Fav/Fav';
import Alert from '@mui/material/Alert';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';
import CardHeader from '@mui/material/CardHeader';
import CardActions from '@mui/material/CardActions';
import IconButton from '@mui/material/IconButton';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import DeleteIcon from '@mui/icons-material/Delete';
import { currencyFormat, currencySymbol, getCurrencyRate, formatBalance } from '../utils/currencies';
import { useSelector } from 'react-redux';
import { BACKEND } from "../../constants";

const ItemPaper = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#f1f1f1',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
    minHeight: '100px',
    boxShadow: 'none',
}));

export default function WalletItem({ wallet }) {
    const [currencySelected, setCurrencySelected] = React.useState('usd')
    const [balance, setBalance] = React.useState(wallet.balance)
    const [deleted, setDeleted] = React.useState(false);
    const version = useSelector((state) => state.value)

    const handleChangeCurrency = (currency) => {
        setCurrencySelected(currency);
    }

    const DeleteWallet = async (e, walletId) => {
        e.preventDefault();
        if(!window.confirm('Sure delete wallet?')) return;
        
        try {
            const token = localStorage.getItem('token');
            await axios.delete(BACKEND + "/api/v1/wallet/" + walletId, {
                headers: ({
                    Authorization: 'Bearer ' + token
                })
            });
            setDeleted(true);
        } catch(e) {
            console.log(e);
        }
    }

    const UpdateWalletBalance = async (e, walletId) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const result = await axios.put(BACKEND + "/api/v1/wallet/balance/" + walletId, {}, {
                headers: ({
                    Authorization: 'Bearer ' + token
                })
            });
            setBalance(result.data.balance);
        } catch(e) {
            console.log(e);
        }
    }

    const isOld = (wallet) => {
        if(wallet.firstTransactionTs === 0) return false;
        const date = new Date();
        date.setFullYear( date.getFullYear() - 1 );
        return parseInt(wallet.firstTransactionTs) < (date.getTime() / 1000); 
    }

    if(deleted) return (<></>);

    return (
            <Grid item xs={12} md={12} key={wallet._id + version}>
                <Card xs={12}>
                    <CardHeader
                        title={'Wallet ' + wallet.title}
                    />
                    {isOld(wallet) && 
                        <Alert severity="error" style={{marginBottom: 10}}>Wallet is old!</Alert>
                    }
                    <Grid container spacing={2}>
                        <Grid item xs={6}>
                            <ItemPaper>
                                <p>Balance</p>
                                <p><strong style={{fontSize: '1.5rem'}}>{formatBalance(balance)}</strong></p>
                            </ItemPaper>
                        </Grid>
                        <Grid item xs={6}>
                            <ItemPaper>
                                <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                style={{backgroundColor: 'white'}}
                                value={currencySelected}
                                onChange={(e) => handleChangeCurrency(e.target.value)}
                                >
                                    <MenuItem value={'usd'}>USD</MenuItem>
                                    <MenuItem value={'euro'}>EURO</MenuItem>
                                </Select>
                                <p />
                                <strong style={{fontSize: '1.5rem'}}>{currencySymbol(currencySelected)} {currencyFormat(formatBalance(balance) * getCurrencyRate(currencySelected))}</strong>
                            </ItemPaper>
                        </Grid>
                    </Grid>
                    <CardActions disableSpacing>
                        <IconButton title="Add / Remove from Favourites" aria-label="add to favorites">
                            <Fav style={{position: 'absolute', right: 5, top: 5}} walletId={wallet._id} isFav={wallet.fav} />
                        </IconButton>
                        <IconButton title="Refresh Balance" aria-label="refresh" onClick={(e) => UpdateWalletBalance(e, wallet._id)}>
                            <AutorenewIcon />
                        </IconButton>
                        <IconButton title="Delete Wallet" aria-label="delete" onClick={(e) => DeleteWallet(e, wallet._id)}>
                            <DeleteIcon />
                        </IconButton>
                    </CardActions>
                </Card>
            </Grid>
    )
}