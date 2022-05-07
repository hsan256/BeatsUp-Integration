import { useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { Button, Typography } from "@mui/material";
import { updateCart } from "../../../redux/actions/E-commerceActions/cartActions";


export default function QteProduct({ cart }) {

    const [qte, setQte] = useState(cart.qteItem);
    const dispatch = useDispatch();

    const [cartItemData, setCartItemData] = useState({
        _id: cart._id,
        nameItem: cart.nameItem,
        descriptionItem: cart.descriptionItem,
        imageItem: cart.imageItem,
        countInStockItem: cart.countInStockItem,
        priceItem: cart.priceItem,
        oldPriceItem: cart.oldPriceItem,
        familleItem: cart.familleItem,
        qteItem: cart.qteItem,
        totalpriceItem: cart.totalpriceItem,
        idItem: cart.idItem,
        idUser: cart.idUser,
        statusItem: cart.statusItem,
    });



    const inc = () => {
        setCartItemData({ ...cartItemData, qteItem: cartItemData.qteItem + 1, totalpriceItem: (cartItemData.qteItem + 1) * cart.priceItem })
        dispatch(updateCart(cart._id, cartItemData));
    };

    const dec = () => {
        setCartItemData({ ...cartItemData, qteItem: cartItemData.qteItem - 1, totalpriceItem: (cartItemData.qteItem - 1) * cart.priceItem })
        dispatch(updateCart(cart._id, cartItemData));
    };

    return (
        <>
            {cart.qteItem === 1 ? (
                <Button disabled onClick={dec}>-</Button>
            ) : (
                <Button onClick={dec}>-</Button>
            )}
            {cart.qteItem}
            {cart.qteItem === cart.countInStockItem ? (
                <Button disabled onClick={inc}>+</Button>
            ) : (
                <Button onClick={inc}>+</Button>
            )

            }
            <Typography variant="caption" component="div" sx={{ mt: 0, textAlign: 'center', color: 'text.secondary' }}>
                Available: {cart.countInStockItem}
            </Typography>
        </>
    );
}