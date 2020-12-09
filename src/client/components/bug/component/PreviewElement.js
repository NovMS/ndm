import React, { useState } from 'react'
import styled from 'styled-components';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import { connect } from 'react-redux';
import { DropPhoto } from '../actions';
import Modal from '@material-ui/core/Modal';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Paper from '@material-ui/core/Paper';

const CardSt = styled(Card)`
    width: 13vw;
    height: 16vw;
`;

const CardMediaSt = styled(CardMedia)`
    max-height : 13vw;
    width : auto;
    height : auto;
    max-width : 13vw;
`;

const CardActionAreaSt = styled(CardActionArea)`
    background-color : rgba(0,0,0,0.8);
    height : 13vw;
    align-items: center;
    display: flex;
`;

const CardActionsST = styled(CardActions)`
    & > button {
        font-size  : calc(6px + 0.7vw);
        margin-left : 1vw;
    }    
    padding : 0;
    height : 3vw ;
`;

const CardActionAreaBaseSt = styled(CardActionArea)`
    background-color : rgba(0,0,0,0.8);
    height : 96vh;
    width : 96vw;
    align-items: center;
    display: flex;
`;

const Base = styled(Card)`
    background-color : white;
    margin-left : 2vw;
    margin-right : 2vw;
    margin-top : 2vh;
    margin-bottom : 2vh;
    width : 96vw;
    height : 96vh;
    outline: none;
    display: flex;
    align-items: center;
`;

const CardMediaBaseSt = styled(CardMedia)`
    max-height : 96vh;
    max-width : 96vw;
    width : auto;
    height : auto;
`;

const StDiv = styled.div`
    outline: none;
`;

function PreviewElement(props){

    const { photo , index , DropPhoto} = props
    const [ open , setOpen ] = useState(false)
        let fr = new FileReader()
        fr.readAsDataURL(photo)
        fr.onload = () => {
            let img = document.getElementById(`IMG${index}`)
            let imgBig = document.getElementById(`IMGBIG${index}`)
            if ( img !== null){
                img.setAttribute('src', fr.result);
            }
            if ( imgBig !== null){
                imgBig.setAttribute('src', fr.result);
            }
        } 


    return(
        <div>
            <CardSt>
                <CardActionAreaSt onClick={()=>{setOpen(true)}}>
                    <CardMediaSt
                        component="img"
                        id={`IMG${index}`}
                        title={photo.name}
                    />
                </CardActionAreaSt>
                <CardActionsST>
                    <Button size="small" color="primary" onClick={()=>{DropPhoto(index)}}>
                        УДАЛИТЬ
                    </Button>
                </CardActionsST>
            </CardSt>
            <Modal
                open={open}
            >
                <StDiv>
                    <ClickAwayListener onClickAway={()=>{setOpen(false)}}>
                        <Base>
                            <CardActionAreaBaseSt onClick={()=>{setOpen(false)}}>
                                <CardMediaBaseSt
                                    component="img"
                                    id={`IMGBIG${index}`}
                                    title={photo.name}
                                />
                            </CardActionAreaBaseSt>
                        </Base> 
                    </ClickAwayListener>
                </StDiv>   
            </Modal>
        </div>
    )

}

export default connect( null , {
    DropPhoto
})(PreviewElement);