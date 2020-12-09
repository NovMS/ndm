import React, {useState} from 'react';
import { Typography } from '@material-ui/core';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { similarDocsChanged, statesChanged, relativeDocsChanged } from './../actions/markup';
import { feedsTransform } from '../services/translator';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import { Link } from 'react-router-dom';

import Paper from '@material-ui/core/Paper';
import InputBase from '@material-ui/core/InputBase';
import IconButton from '@material-ui/core/IconButton';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import { useEffect } from 'react';
import { postQuery, getQuery } from '../services/query-service';
import LoadingButton from './loading-button';


const Root = styled.div`
  display: flex;
  width: 30%;
  height: 100%;
  flex-direction: column;
  align-items: center;
  overflow-y: auto;
  box-shadow: rgba(0, 0, 0, 0.16) 0px 2px 2px 0px, rgba(0, 0, 0, 0.08) 0px 0px 0px 1px;
  background-color: white;
`;

const Title = styled(Typography)`
  display: block; 
  background-color: #fafafa;
  border-bottom: 1px solid rgba(224, 224, 224, 1);
  border-top: 1px solid rgba(224, 224, 224, 1);
  text-align: center;
  width: 100%;
  &:first-child {
    border-top: 0;
  };
  display: flex;
  height: 45px;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
`;

const MainTitle = styled.div`
  font-weight: bold;
  background-color: #1976d2;
  color: white;
  border-bottom: 1px solid rgba(224, 224, 224, 1);
  border-top: 1px solid rgba(224, 224, 224, 1);
  text-align: center;
  padding: 10px;
  width: 100%;
`;

const Buttons = styled.div`
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  padding: 10px;
  box-sizing: border-box;
  justify-content: space-between;
`;

const RejBtn = styled(Button)`
  width: 48%;
  margin-right: 4%;
  margin-bottom: ${(props) => props.last ? '0' : '10px'};
  background-color: ${(props) => props.selected ? '#81c784' : 'white'};
  color: ${(props) => props.selected ? 'white' : 'black'};
  font-size: 12px;
  &:nth-child(2n) {
    margin-right: 0;
  };
`;

const AisBtn = styled(Button)`
  width: 100%;
  font-size: 12px;
  margin-top: 5px;
`;

const Blocks = styled.div`

`;

const NewAis = styled.div`
  width: 96%;
  box-sizing: border-box;
  padding: 10px 0;
`;

const Comment = styled(TextField)`
  width: 96%;
  margin: 10px 0;
`;

const AddDoc = styled(Paper)`
  display: flex;
  align-items: center;
  width: 96%;
  margin: 10px 0;
  padding-left: 10px;
`;

const AddDocInput = styled(InputBase)`
  flex: 1;
`;

const AddDocButton = styled(IconButton)`
  padding: 0px;
`;

const ErrorAis = styled(Typography)`
  margin: 0;
  margin-bottom: 5px;
  margin-top: -10px;
  color: #e33371;
  font-weight: bold;
`;

const AisLink = styled(Link)`
  text-decoration: underline;
  display: block;
  color: black;
  margin: 0;
  margin-top: 10px;
  font-weight: bold;
`;

const ButtonWrapper = styled.div`
  width: 48%;
  margin-bottom: ${({ isLast }) => isLast ? '0' : '10px'};
`;

const WrLoadingButton = ({isLast = false, ...otherProps}) => {
  return (
    <ButtonWrapper isLast={isLast}>
      <LoadingButton {...otherProps}/>
    </ButtonWrapper>
  );
}

const RejectMarkup = ({settings, states, id, similarDocsChanged, statesChanged, similarDocs, docInfo, relativeDocsChanged}) => {
  const [listInWork, setListInWork] = useState('');
  const [arrInWork, setArrInWork] = useState([]);
  const [isInWorkState, setIsInWorkState] = useState(false);
  const [idAis, setIdAis] = useState('');
  const [addedAis, setAddedAis] = useState(null);
  const [errorIdAis, setErrorIdAis] = useState('');
  const [comment, setComment] = useState();

  useEffect(() => {
    setComment(docInfo.comment);
  }, [docInfo])

  useEffect(() => {

    let isWork = false;
    Object.entries(states).map(([key, value]) => {
      if (value.inWork) {
        setIsInWorkState(true);
        isWork = true;
      }
    });

    if (!isWork) {
      let list = '';
      let arr = [];
      Object.entries(settings.feeds).map(([key, value]) => {
        
        if (value) {
          let isInWork = true;
          for (let item in states[key]) {
            if (states[key][item]) {
              isInWork = false;
              break;
            }
          }
          if (isInWork) {
            arr.push(key);
            if (list == '') {
              list+=`${feedsTransform(key)}`;
            } else {
              list+=`, ${feedsTransform(key)}`;
            }
          }
        }
      });
      setListInWork(list);
      setArrInWork(arr);
    }
  }, [states, settings]);

  const isEmptyObj = (obj) => {
    for (let key in obj) {
      return false;
    }
    return true;
  };

  const setStates = async (feed, key) => {
    const newStates = await postQuery(`/setStates`,
      {
        id: id,
        feed: feed,
        state: (states && states[feed] && states[feed][key]) ? 'false' : key
      }
    );
    statesChanged(newStates);
  };

  const getDocAis = async () => {
    const doc = await getQuery(`/getDocAisInfo`, {id: idAis});
    if (!doc.error) {
      setIdAis('');
      similarDocsChanged([doc, ...similarDocs]);
    } else {
      setErrorIdAis(doc.error)
    }
    
  };

  const sendComment = async () => {
   await postQuery(`/sendComment`, {id: id, text: comment});
  };

  const addAis = async () => {
   const info = await postQuery(`/addAis`, {id: id, feeds: arrInWork});
   setAddedAis(info);
   const newDoc = await getQuery(`/getDocAisInfo`, {id: info.ais});
   similarDocsChanged([newDoc, ...similarDocs]);
   const relsId = await getQuery('/getRelativesId', {id: id});
   relativeDocsChanged(relsId);
   const states = await getQuery(`/getStates`, {id: id});
   statesChanged(states);
  };

  return (
    <Root>
    {
      Object.entries(settings.feeds).map(([key, value]) => {
        if (value && !isEmptyObj(states)) {
          return(
            <Blocks key={key}>
              <Title>{feedsTransform(key)}</Title>
              <Buttons>
                <WrLoadingButton
                  onClick={async () => {
                    await setStates(key, 'exotic');
                  }}
                  selected={states[key].exotic ? 1 : 0}>Ниже экзотики 0</WrLoadingButton>
                <WrLoadingButton
                  onClick={async () => {
                    await setStates(key, 'info');
                  }}
                  selected={states[key].info ? 1 : 0}>Нет инфоповода</WrLoadingButton>
                <WrLoadingButton
                  onClick={async () => {
                    await setStates(key, 'accept');
                  }}
                  selected={states[key].accept ? 1 : 0}>Вряд ли примут</WrLoadingButton>
                <WrLoadingButton
                  onClick={async () => {
                    await setStates(key, 'audience');
                  }}
                  selected={states[key].audience ? 1 : 0}>Не аудит. ленты</WrLoadingButton>
                <WrLoadingButton
                  onClick={async () => {
                    await setStates(key, 'analog');
                  }}
                  selected={states[key].analog ? 1 : 0}>Аналог</WrLoadingButton>
                <WrLoadingButton
                  onClick={async () => {
                    await setStates(key, 'polit');
                  }}
                  selected={states[key].polit ? 1 : 0}>Политика</WrLoadingButton>
                <WrLoadingButton
                  onClick={async () => {
                    await setStates(key, 'other');
                  }}
                  last={1} selected={states[key].other ? 1 : 0}>Другое</WrLoadingButton>
                <WrLoadingButton
                  onClick={async () => {
                    await setStates(key, 'skip');
                  }}
                  last={1} selected={states[key].skip ? 1 : 0}>Пропущен</WrLoadingButton>
              </Buttons>
            </Blocks>
          );
        }
        
      })
    }
    <Title>Добавить похожий</Title>
    <AddDoc onSubmit={(evt) => {
                  evt.preventDefault();
                  getDocAis()
                }}
                component="form">
      <AddDocInput
        onChange={(evt) => { setErrorIdAis(''); setIdAis(evt.target.value)}}
        value={idAis}
        placeholder="ID АИС"
      />
      <AddDocButton type="submit">
        <AddCircleOutlineIcon />
      </AddDocButton>
    </AddDoc>
    {
      errorIdAis ? <ErrorAis>{errorIdAis}</ErrorAis> : null
    }
    {
      !isInWorkState && similarDocs ? 
      <>
      <Title>Создать новый АИС</Title>
      <NewAis>
        <Typography>Будет добавлен для следующих лент:</Typography>
        {
          listInWork == '' ?
          <Typography>Все ленты размечены</Typography> :
          <Typography><strong>{listInWork}</strong></Typography> 
        }
        <AisBtn variant="outlined" onClick={addAis}>Создать</AisBtn>
        {
          addedAis ? <AisLink to={`/markup-ais/${addedAis.id}`}>{`Создан новый АИС документ c ID ${addedAis.ais}`}</AisLink> : null
        }
      </NewAis>
      </> : null
    }
    <Title>Комментарий</Title>
    <Comment
      multiline
      rows={4}
      value={comment ? comment : ''}
      onChange={(evt) => setComment(evt.target.value)}
      placeholder="Комментарий"
      variant="outlined"
      onBlur={sendComment}
    />
    </Root>
  );
};

const mapStateToProps = ({ settings, markup:{ states, similarDocs, docInfo } }) => {
  return { settings, states, similarDocs, docInfo };
};

const mapDispatchToProps = {
  similarDocsChanged, statesChanged, relativeDocsChanged
};

export default connect(mapStateToProps, mapDispatchToProps)(RejectMarkup);
