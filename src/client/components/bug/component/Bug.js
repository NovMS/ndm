import React, {  useCallback, useLayoutEffect } from 'react'
import styled from 'styled-components';
import { useState } from 'react';
import BugReportIcon from '@material-ui/icons/BugReport';
import IconButton from '@material-ui/core/IconButton';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Tooltip from '@material-ui/core/Tooltip';
import Badge from '@material-ui/core/Badge';
import Modal from '@material-ui/core/Modal';
import DropZone from './DropZone'
import Paper from '@material-ui/core/Paper';
import { connect } from 'react-redux';
import { AddPhotos, DropPhotos, DropPhoto} from '../actions';
import Button from '@material-ui/core/Button';
import PreviewZone from './PreviewZone'
import TextField from '@material-ui/core/TextField';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import SendIcon from '@material-ui/icons/Send';
import blue from '@material-ui/core/colors/blue';
import CircularProgress from '@material-ui/core/CircularProgress';
import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/lab/Alert';

const StSnackbar = styled(Snackbar)`  
`;

const StAlert = styled(Alert)`
    & > div{
        & > svg{
            align-self: center;
        }
    }
`;


const StIconButton = styled(IconButton)`
    font-size : 28px;
    padding : 5px;
    margin-left : 10px;
    margin-right : 10px;
`;

const StBugIcon = styled(BugReportIcon)`
    color : white;
`;

const StBadge = styled(Badge)`
    & > span{
        top : 20%;
        right : 20%;
    }    
`;

const StPaper = styled(Paper)`
    position : absolute;
    top : calc( ${ props => props.size[1]/2}px - 30vmin);
    left : calc( ${ props => props.size[0]/2}px - 30vmin);
    background-color : rgba(245, 245, 245, 1);
    border : 4px solid #005cb2;
    height : 60vmin;
    width : 60vmin;
    border-radius : 100%;
`;

const BackPaper = styled(Paper)`
    outline: none;
    height : ${ props => props.size[1]}px;
    width : ${ props => props.size[0]}px;
    background-color : rgba(0, 0, 0, 0.2);
`;

const Base = styled(Paper)`
    background-color : white;
    margin-top : 5vh;
    margin-bottom : 5vh;
    width : 84vw;
    height : 90vh;
    outline: none;
`;

const StDiv = styled.div`
    outline: none;
    height : 100vh;
`;

const Desck = styled(Paper)`
    width : 50%;
    height : 100%;
    border : 1px solid lightgrey;
    overflow-y : auto;
    color : grey;
    text-align : center;
    padding : 20px;
`;

const MessagePaper = styled(Paper)`
    outline: none;
    width : 50%;
    height : 100%;
    overflow-y : auto;
    padding : 0;
`;

const STF = styled(TextField)`

`;

const STFTA = styled(TextField)`
    width : 50%;
`;

const FlexDiv = styled.div`
    display : flex;
`;

const StIcBuMG = styled(IconButton)`
    margin-top : 10px;
    padding : 10px;
`;

const StIcBu = styled(IconButton)`
    margin-top : 10px;
    padding : 10px;
`;

const StIcBuSend = styled(IconButton)`
    margin-top : 10px;
    padding : 10px;
    & > span{
        & > svg{
            color : ${blue[800]};
        }
    }
`;

const StCir = styled(CircularProgress)`

`;

const StDivCir = styled.div`

`;

const ClickDiv = styled.div`

`;

const Block = styled.div`

`;

function Bugs(props){

    const {photos , AddPhotos , DropPhotos} = props
    const [ open , setOpen ] = useState(false)
    const [ form , setForm ] = useState(false)
    const [ state , setState ] = useState('base')
    const [ err, setErr ] = useState('none')
    const [ message , setMessage ] = useState({
        email : 'mx181199@gmail.com',
        text  : ''
    })

    const [ size , setSize ] = useState([0,0])

    const updateMessage = ( mess )=> {
        setMessage({ ...message, ...mess})
    } 

    const onDrop = useCallback(acceptedFiles => {
        AddPhotos(acceptedFiles);
        setOpen(false);  
      }, []);

    const createDropZone = ()=>{
        setOpen(true)
    }

    useLayoutEffect(() => {
        function updateSize() {
          setSize([window.innerWidth, window.innerHeight]);
        }
        window.addEventListener('resize', updateSize);
        updateSize();
        return () => window.removeEventListener('resize', updateSize);
    }, []);

    const savePhoto = () => {
        let inp = document.getElementById('upload-photo')
        AddPhotos(inp.files)
    }


    const sendEmail = async ( images ) => {

        const data = new FormData()
        images.forEach( (element) => {
            data.append( 'photos', element , element.name ) 
        });
        data.append('email',message.email)
        data.append('text',message.text)        
        let response = await fetch('http://localhost:33033/api/mail', {
            method: 'POST',
            body: data
        });
        let result = await response.json();
        console.log('RESULT:::',result)
        if ( result.state == 'ok' ){
            setMessage({
                email : 'mx181199@gmail.com',
                text  : ''
            })
        } else {
            AddPhotos(images)
        }
        return result.state
    }

    const BlockSend = () => {
        setState('send')
            const MaxBlockMessageSize = 24000000;
            let NumberOfBlock = 0;
            let CurrentBlockSize = 0;
            let MassiveOfBlocks = {};
            let BigSizeArray = []
            MassiveOfBlocks[`${NumberOfBlock}`] = []
            photos.forEach( (element)=>{
                CurrentBlockSize += element.size;
                if( CurrentBlockSize <= MaxBlockMessageSize){
                    MassiveOfBlocks[`${NumberOfBlock}`].push(element)
                } else {
                    NumberOfBlock +=1;
                    CurrentBlockSize = element.size;
                    if( CurrentBlockSize <= MaxBlockMessageSize)
                    {
                        MassiveOfBlocks[`${NumberOfBlock}`] = []
                        MassiveOfBlocks[`${NumberOfBlock}`].push(element)
                    } else {
                        BigSizeArray.push(element)
                        CurrentBlockSize = 0;
                    }    
                }
            });
            DropPhotos();
            AddPhotos(BigSizeArray);
            for (let  block in MassiveOfBlocks) {
                setErr('ok')
                sendEmail(MassiveOfBlocks[block]).then( data => { if(data !== 'ok'){setErr('err')}  })
            }  
        setState('base')
    }

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
          return;
        }
        setErr('none');
      };


    return(
        <div>
            <Tooltip
                title='Сообщить о баге'
            >
                <StBadge 
                    badgeContent={photos.length} 
                    invisible = {photos.length <= 0}
                    max={99}
                    overlap="circle"
                >
                    <StIconButton onClick={()=>{setForm(true);}}>
                        <StBugIcon />
                    </StIconButton>
                </StBadge>
            </Tooltip>
            <Modal
                open={open}
            >
                <div>
                    <BackPaper size={size} onDrop={(e)=>{e.stopPropagation();e.preventDefault();setOpen(false);}}/>
                    <ClickAwayListener onClickAway={()=>{setOpen(false);setForm(true)}}>
                        <StPaper size={size} >
                            <DropZone size={size} onDrop={onDrop} accept={"image/*"}/>
                        </StPaper> 
                    </ClickAwayListener>    
                </div>       
            </Modal>
            <Modal
                open={form}
            >
                <StDiv  id={'dropzone'} onDragEnter={createDropZone} >
                    <ClickAwayListener onClickAway={()=>{setForm(false)}}>
                        <ClickDiv>
                            <StSnackbar  
                                open={err==='ok'} 
                                autoHideDuration={4000} 
                                onClose={handleClose} 
                                anchorOrigin = {{
                                    vertical: 'bottom',
                                    horizontal: 'right'
                                }}
                            >
                                <StAlert onClose={handleClose} severity="success">
                                    Сообщение успешно отправлено. Спасибо!!!
                                </StAlert>
                            </StSnackbar>
                            <StSnackbar  
                                open={err==='err'} 
                                autoHideDuration={8000} 
                                onClose={handleClose} 
                                anchorOrigin = {{
                                    vertical: 'bottom',
                                    horizontal: 'right'
                                }}
                            >
                                <StAlert onClose={handleClose} severity="error">
                                    Произошла ошибка, пожалуйста, попробуйте позже
                                </StAlert>
                            </StSnackbar>
                            <Base  >
                            {   state === 'base' 
                                ?
                                <div>
                                    <MessagePaper elevation={0}>
                                        <FlexDiv>
                                            <STFTA
                                                label={'Сообщение'}
                                                id='text-input'
                                                multiline
                                                rows={size[1]*0.27/30}
                                                variant="outlined"
                                                value={message.text}
                                                onChange={(e)=>{updateMessage({ text : e.target.value})}}
                                            />
                                            <Block>
                                                <Tooltip
                                                    title='Отправить'
                                                >
                                                    <StIcBuSend onClick={BlockSend}> 
                                                        <SendIcon />
                                                    </StIcBuSend>
                                                </Tooltip>
                                                <div>
                                                    <label htmlFor="upload-photo">
                                                        <input
                                                            style={{ display: "none" }}
                                                            id="upload-photo"
                                                            name="upload-photo"
                                                            type="file"
                                                            accept = "image/*"
                                                            multiple = {true}
                                                            onChange={()=>{savePhoto()}}
                                                        />
                                                        <Tooltip
                                                            title='Загрузить изображение'
                                                        >
                                                            <StIcBuMG  component="span">
                                                                <CloudUploadIcon />
                                                            </StIcBuMG>
                                                        </Tooltip>
                                                    </label>
                                                </div>
                                                <Tooltip
                                                    title='Удалить все изображения'
                                                >
                                                    <StIcBu onClick={()=>{DropPhotos()}}>
                                                        <DeleteForeverIcon />
                                                    </StIcBu>
                                                </Tooltip>
                                            </Block>    
                                        </FlexDiv>    
                                    </MessagePaper>
                                    <Desck>
                                        <PreviewZone/>
                                    </Desck>    
                                </div>
                                :
                                <StDivCir>
                                    <StCir/>
                                    <br/>
                                    <br/>
                                    <br/>
                                    Пожалуйста, подождите, сообщение отправляется
                                </StDivCir>
                            }       
                            </Base>
                        </ClickDiv>    
                    </ClickAwayListener>
                </StDiv>    
            </Modal>        
        </div>
    )
}

export default connect( (store)=>({ 
    photos : store.photos
}),{
    AddPhotos,
    DropPhotos,
    DropPhoto
})(Bugs)