import * as React from 'react';
import axios from 'axios';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { BACKEND } from "../../constants";

export default function Fav({ walletId, isFav }) {
    const [statusFavChanged, setStatusFavChanged] = React.useState(isFav);

    const switchFav = async (wId, fav) => {
        const token = localStorage.getItem('token');
        const form = {
            fav: (fav ? 1 : 0)
        };
        await axios.put(BACKEND + "/api/v1/wallet/fav/" + wId, form, {
            headers: ({
                Authorization: 'Bearer ' + token
            })
        });

        setStatusFavChanged(fav);
    }

    if (!statusFavChanged) {
        return (
            <FavoriteBorderIcon onClick={(e) => switchFav(walletId, true)} />
        )
    } else {
        return (
            <FavoriteIcon onClick={(e) => switchFav(walletId, false)} />
        )
    }
}