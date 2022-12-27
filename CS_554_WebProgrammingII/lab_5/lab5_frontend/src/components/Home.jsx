import React, { useEffect, useState } from 'react'
import { useQuery } from '@apollo/client';

import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';

import ImaList from "./ImaList";
import queries from './queries';

export default function Home() {
    
    const [pageNum, setPageNum] = useState(1);
    const [postData, setPostData] = useState({});

    const { data, error, fetchMore } = useQuery(queries["home"], {
        variables: { pageNum }
    });

    useEffect(() => {
        if (data) {
            const temp = {};
            data.unsplashImages.map(ele => {
                temp[ele.id] = ele;
            });
            setPostData({ ...postData, ...temp });
        }
        
    }, [data]);

    const getMore = () => {
        fetchMore({ variables: { pageNum: pageNum + 1 } });
        setPageNum(pageNum + 1);
    };

    return (
        <Box>
            <Grid container spacing={2} alignItems="center" justifyContent="center">
                <Grid container item xs={12} alignItems="center" justifyContent="center"><h1>Home</h1></Grid>
                {postData != {} ?
                    <>
                        <ImaList postData={postData} />
                        <Grid container item xs={12} alignItems="center" justifyContent="center">
                            <Button onClick={getMore}>Get More</Button>
                        </Grid>
                    </>
                    :
                    <h1>loading</h1>
                }
            </Grid>
        </Box>
    );
}