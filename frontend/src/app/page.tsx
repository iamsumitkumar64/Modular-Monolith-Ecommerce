"use client";

import { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { Box, Card, CardContent, CardMedia, CircularProgress, Container, Typography, } from "@mui/material";
import styles from "./home.module.css";
import { RootState } from "@/redux/store";
import { getProducts } from "@/redux/feature/product/product-action";
import { enqueueSnackbar } from "notistack";
import { useAppDispatch, useAppSelector } from "@/redux/hooks.ts";

export default function Home() {
  const dispatch = useAppDispatch();
  const { products, totalDocuments, loading, } = useAppSelector((state: RootState) => state.productReducer);
  const [offset, setOffset] = useState(Number(process.env.page_offset) || 0);
  const limit = Number(process.env.page_limit) || 10;
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    fetchInitialProducts();
  }, []);

  const fetchInitialProducts = async () => {
    try {
      setOffset(0);

      await dispatch(getProducts({ limit, offset: 0, })).unwrap();
    } catch (err: any) {
      console.log(err);
      enqueueSnackbar(err, { variant: "warning", });
    }
  };

  const fetchMoreProducts = async () => {
    try {
      if (loading) return;
      if (products.length >= totalDocuments) return;

      const newOffset = offset + limit;
      setOffset(newOffset);

      const response = await dispatch(getProducts({ limit, offset: newOffset, })).unwrap();

      if (!response.data.length) {
        setHasMore(false);
        return;
      }

      if (products.length + response.data.length >= totalDocuments) {
        setHasMore(false);
      }
    } catch (err: any) {
      console.log(err);
      enqueueSnackbar(err, { variant: "warning", });
    }
  };

  return (
    <Container maxWidth="xl" className={styles.container}>
      <Box className={styles.header}>
        <Typography variant="h4" className={styles.heading}>
          Product Listing
        </Typography>

        <Typography className={styles.subHeading}>
          Infinite Scroll Products
        </Typography>
      </Box>

      <Box id="scrollableDiv" className={styles.scrollWrapper}>
        <InfiniteScroll
          dataLength={products.length}
          next={fetchMoreProducts}
          hasMore={hasMore}
          loader={<Box className={styles.loader}><CircularProgress size={30} /></Box>}
          endMessage={<Typography className={styles.endMessage}>Yay! You have seen it all</Typography>}
          scrollableTarget="scrollableDiv"
        >
          <Box className={styles.productWrapper}>
            {products.map((product: any) => (
              <Card
                key={product.uuid}
                className={styles.card}
                elevation={2}
              >
                <Box
                  className={styles.imageWrapper}
                >
                  <CardMedia
                    component="img"
                    image={product.image_url}
                    alt={product.name}
                    className={styles.image}
                  />
                </Box>

                <CardContent
                  className={
                    styles.cardContent
                  }
                >
                  <Typography
                    className={
                      styles.productName
                    }
                  >
                    {product.name}
                  </Typography>

                  <Typography
                    className={
                      styles.description
                    }
                  >
                    {product.description}
                  </Typography>

                  <Typography
                    className={styles.price}
                  >
                    ₹ {product.price}
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </Box>
        </InfiniteScroll>
      </Box>
    </Container>
  );
}