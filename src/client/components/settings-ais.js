import React, {useState} from 'react';
import { Typography } from '@material-ui/core';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { feedsTransform } from '../services/translator';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import { postQuery, getQuery } from '../services/query-service';
import { useEffect } from 'react';
import { statesChanged } from './../actions/markup';
import LoadingButton from './loading-button';


const Root = styled.header`
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
`;

const Buttons = styled.div`
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  padding: 10px;
  box-sizing: border-box;
  justify-content: space-between;
`;

const WorkBtn = styled(Button)`
  width: 48%;
  margin-right: ${(props) => props.last=='true' ? '0' : '4%'};
  margin-bottom: ${(props) => props.last=='true' ? '0' : '10px'};
  background-color: ${(props) => props.selected ? '#81c784' : 'white'};
  color: ${(props) => props.selected ? 'white' : 'black'};
  font-size: 12px;
  &:nth-child(2n) {
    margin-right: 0;
  };
`;

const ButtonWrapper = styled.div`
  width: 48%;
  margin-bottom: ${(props) => props.last=='true' ? '0' : '10px'};
`;

const WrLoadingButton = ({last, ...otherProps}) => {
  return (
    <ButtonWrapper last={last} >
      <LoadingButton {...otherProps} />
    </ButtonWrapper>
  )
}


const Comment = styled(TextField)`
  width: 96%;
  margin: 10px 0;
`;

const SettingsAis = ({settings, states, docInfo, statesChanged}) => {
  const [inWorkFeeds, setInWorkFeeds] = useState([]);
  useEffect(() => {
    if (states) {
      let newFeeds = [];
      for (const key in states) {
        if (states[key].inWork) {
          newFeeds.push(key);
        }
      }
      setInWorkFeeds(newFeeds);
    }
  },[states]);

  const onInWorkClick = async (value, feed) => {
    let newFeeds = [...inWorkFeeds];
    if (value) {
      newFeeds = newFeeds.filter(item => item != feed);
    } else {
      newFeeds.push(feed);
    }

    const newStates = await postQuery(`/setInWorkState`,
      {
        id: docInfo.id,
        iddoc: docInfo.id_ais,
        feeds: newFeeds
      }
    );
    statesChanged(newStates);
  };
  return (
    <Root>
    <Title>В работу</Title>
    <Buttons>
    {
      Object.entries(states).map(([key]) => {
        return(
          <WrLoadingButton
            key={key}
            onClick={async () => await onInWorkClick(states[key].inWork, key)}
            selected={states[key].inWork}>{feedsTransform(key)}</WrLoadingButton>
        );
      })
    }
    </Buttons>
    <Title>Комментарий</Title>
    <Comment
      multiline
      rows={4}
      value={docInfo.comment ? docInfo.comment : ''}
      placeholder="Комментарий"
      variant="outlined"
    />
    </Root>
  );
};

const mapStateToProps = ({ settings, markup:{ states, docInfo } }) => {
  return { settings, states, docInfo };
};

const mapDispatchToProps = {
  statesChanged
};

export default connect(mapStateToProps, mapDispatchToProps)(SettingsAis);
