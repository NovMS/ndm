import React from 'react'
import styled from 'styled-components';
import { connect } from 'react-redux';
import PreviewElement from './PreviewElement'
import Grid from '@material-ui/core/Grid';

const Stp = styled.p`
    font-size : calc( 20px + 1vw);
`;

const StpBig = styled.p`
    font-size : calc( 40px + 1vw);
`;

const PreviewZone = (props)=>{
    
    const   { photos } = props

    return(
        photos.length <= 0
        ?
        <div>
            <StpBig> Изображения отсутствуют</StpBig>
            <Stp> {`  Пожалуйста, добавьте изображение   `} </Stp>
        </div>
        
        :
        <div>
            <Grid
                container
                direction="row"
                justify="flex-start"
                alignItems="flex-start"
                spacing={5}
            >
                {   
                    photos.map( (el,index)=>{
                        return(
                            <Grid key={index} item>
                                <PreviewElement  index={index} photo={el} />
                            </Grid>
                        )
                    })
                }
             </Grid>
        </div>
    )
}

export default connect( (store)=>({
    photos : store.photos,
}),{
})(PreviewZone)