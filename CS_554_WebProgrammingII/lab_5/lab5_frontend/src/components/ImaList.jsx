import React from 'react'

import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';

import { useMutation } from '@apollo/client';
import queries from './queries';

export default function ImaList(props) {
    const postData = props.postData;

    const [bins] = useMutation(queries['updateImage']);

    const [delImg] = useMutation(queries['deleteImage']);

    return (
        Object.values(postData).map(ele => {
            return (
                <Grid item xs={5} key={ele.id}>
                    <Card sx={{ maxWidth: 345 }}>
                        <CardMedia
                            component="img"
                            height="140"
                            image={ele.url}
                            alt="green iguana"
                        />
                        <CardContent>
                            <Typography variant="body2" color="text.secondary">
                                Author: {ele.posterName}
                                <br />
                                Description: {ele.description}
                            </Typography>
                        </CardContent>
                        <CardActions>
                            <Button size="small" onClick={() => {
                                bins({
                                    variables: {
                                        "updateImageId": ele.id,
                                        "url": ele.url,
                                        "posterName": ele.posterName,
                                        "description": ele.description,
                                        "userPosted": ele.userPosted,
                                        "binned": !ele.binned
                                    }
                                });
                            }}>{ele.binned ? "Remove from bin" : "Add to bin"}</Button>
                            {
                                !ele.userPosted ?
                                    "" :
                                    <Button size="small"
                                        onClick={() => {
                                            delImg({
                                                variables: { "deleteImageId": ele.id }
                                            });
                                            delete postData[ele.id];
                                        }}>Delete</Button>
                            }
                        </CardActions>
                    </Card>
                </Grid >
            );
        })
    )
}
