import { paramCase } from 'change-case';
import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link as RouterLink } from 'react-router-dom';

// @mui
import { styled } from '@mui/material/styles';
import { Box, Card, IconButton, Typography, CardContent, Grid, Button } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
// redux
import { getProduits, deleteProduit } from '../../../redux/actions/E-commerceActions/productActions';
// utils
import { fDate } from '../../../utils/formatTime';
import cssStyles from '../../../utils/cssStyles';
// components
import Image from '../../Image';
import TextMaxLine from '../../TextMaxLine';
import Iconify from '../../Iconify';
import LightboxModal from '../../LightboxModal';
import { deleteCollection } from '../../../redux/actions/collections';
import { PATH_DASHBOARD } from '../../../routes/paths';

// ----------------------------------------------------------------------

const CaptionStyle = styled(CardContent)(({ theme }) => ({
  ...cssStyles().bgBlur({ blur: 2, color: theme.palette.grey[900] }),
  bottom: 0,
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  position: 'absolute',
  justifyContent: 'space-between',
  color: theme.palette.common.white,
}));

// ----------------------------------------------------------------------

export default function ProfileArtistEcommerce() {
  const [openLightbox, setOpenLightbox] = useState(false);
  const dispatch = useDispatch();
  const [selectedImage, setSelectedImage] = useState(0);
  const [productList, setProductList] = useState([]);
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('profile')))

  // const imagesLightbox = collections.map((img) => img.cover);

  // const handleOpenLightbox = (url) => {
  //   const selectedImage = imagesLightbox.findIndex((index) => index === url);
  //   setOpenLightbox(true);
  //   setSelectedImage(selectedImage);
  // };

  useEffect(() => {
    getProduits(dispatch);
  }, [dispatch]);
  const produits = useSelector((state) => state.produits);
  console.log(produits);

  useEffect(() => {
    const newProd = produits.filter((produit) =>
      (produit.idUser === user.result._id)
    )
    setProductList(newProd)
   }, [produits]);


  return (
    <Box sx={{ mt: 5 }}>
      <Grid container spacing={5}>
        <Grid item xs={10}>
          <Typography variant="h4" sx={{ mb: 3 }}>
            Products
          </Typography>
        </Grid>
        {/* <Grid item xs={2}>
          <Button
            variant="contained"
            component={RouterLink}
            to={PATH_DASHBOARD.artist.add_collection}
            startIcon={<Iconify icon={'eva:plus-fill'} />}
          >
            New Collection
          </Button>
        </Grid> */}
      </Grid>

      <Card sx={{ p: 3 }}>
        <Box
          sx={{
            display: 'grid',
            gap: 3,
            gridTemplateColumns: {
              xs: 'repeat(1, 1fr)',
              sm: 'repeat(2, 1fr)',
              md: 'repeat(3, 1fr)',
            },
          }}
        >
          {productList.map((produit) => (
            <Grid key={produit._id} >
              {/* <GalleryItem produit={produit} onOpenLightbox={handleOpenLightbox} /> */}
              <ProductItem produit={produit} />
            </Grid>
          ))}
        </Box>

        {/* <LightboxModal
          images={imagesLightbox}
          mainSrc={imagesLightbox[selectedImage]}
          photoIndex={selectedImage}
          setPhotoIndex={setSelectedImage}
          isOpen={openLightbox}
          onCloseRequest={() => setOpenLightbox(false)}
        /> */}
      </Card>
    </Box>
  );
}

// ----------------------------------------------------------------------
// ProductItem.propTypes = {
//   produit: PropTypes.object,
// };

function ProductItem({ produit }) {
  // const { cover, title, createdAt } = collection;
  const dispatch = useDispatch();

  return (
    <Card sx={{ cursor: 'pointer', position: 'relative' }}>
      {/* <Image alt="gallery image" ratio="1/1" src={produit.image} onClick={() => onOpenLightbox(cover)} /> */}
      <Image alt="image" ratio="1/1" src={produit.image} />

      <CaptionStyle>
        <div>
          <TextMaxLine variant="subtitle1" line={1}>
            {produit.name}
          </TextMaxLine>
          <Typography variant="body2" sx={{ opacity: 0.72 }}>
            {fDate(produit.createdAt)}
          </Typography>
        </div>
        {/* <IconButton color="inherit">
          <Iconify icon={'eva:more-vertical-fill'} width={20} height={20} />
        </IconButton> */}
        {/* <Button
          size="small"
          color="primary"
        component={RouterLink}
        to={`/dashboard/artist/collection/edit/${paramCase(title)}`}
        state={{ single: collection }}
        >
          <EditIcon fontSize="small" /> &nbsp;Edit
        </Button> */}
        <Button size="small" color="primary" onClick={() => dispatch(deleteProduit(produit._id))}>
        <DeleteIcon fontSize="small" /> Delete
        </Button>
      </CaptionStyle>
    </Card>
  );
}
