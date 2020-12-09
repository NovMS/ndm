import React, {useState} from 'react';
import styled, { css } from 'styled-components';
import Typography from '@material-ui/core/Typography';
import { Link } from 'react-router-dom';
import moment from 'moment';
import { connect } from 'react-redux';
import { postQuery, getQuery } from '../../services/query-service';

import logoKP from './../../img/logokp.png'

import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import {getBDM} from './../../services/getBDM';
import { feedsTransform, statesTransform } from './../../services/translator';

import IconButton from '@material-ui/core/IconButton';
import OpenInBrowserIcon from '@material-ui/icons/OpenInBrowser';
import TransitEnterexitIcon from '@material-ui/icons/TransitEnterexit';

import Dialog from '@material-ui/core/Dialog';

import Tooltip from '@material-ui/core/Tooltip';
import Button from '@material-ui/core/Button';
import { useEffect } from 'react';
import { relativeDocsChanged, doublesDocsChanged, statesChanged } from './../../actions/markup';
import LoadingButton from '../loading-button';

const Cell = styled(TableCell)`
  width: ${props => props.width ? props.width : 'auto'};
  padding: 10px;
  vertical-align: top;
  text-align: ${ props => props.textalign ? props.textalign : 'left' };
`;

const DocTitle = styled(Link)`
  display: block;
  color: black;
  width: 100%;
  text-decoration: none;
  &:hover {
    color: #1976d2;
  }
  & span {
    color: #1976d2;
  }
`;

const ControlButton = styled(IconButton)`
  margin: 0;
  margin-right: 2px;
  color: #1976d2;
`;

const SourceLink = styled.a`
  color: black;
  ${props => (props.disabled) && css`
    pointer-events: none;
    cursor: default;
    text-decoration: none;
  `}
`;

const LinkKP = styled.a`
  display: inline-block;
  position: relative;
  top: 3px;
  margin-right: 5px;
  text-decoration: none;
  width: 20px;
  height: 20px;
  background-image: url(${logoKP});
  background-position: center;
  background-size: 100%;
`;

const BDMText = styled.p`
  margin: 0;
  margin-right: 5px;
  font-style: italic;
`;

const DocDate = styled.div`
  display: flex;
  margin-bottom: 7px;
  justify-content: center;
  &:last-child {
    margin-bottom: 0;
  }
`;

const Feed = styled(Typography)`
  margin: 0;
  margin-bottom: 7px;
  text-align: left;
  &:last-child {
    margin-bottom: 0;
  }
`;

const Ifame = styled(Dialog)`
  width: 100%;
  & .MuiDialog-paperWidthXs {
    max-width: 100%;
  }
`;

const ButtonWrapper = styled.div`
  width: 90%;
  margin-bottom: 10px;
  &:last-child {
    margin-bottom: 0;
  }
`;

// TODO: Когда получу доступ к портам, оттестировать и поместить на место ActBtn
const WrLoadingButton = (props) => {
  return (
    <ButtonWrapper>
      <LoadingButton {...props} />
    </ButtonWrapper>
  );
}

const ActBtn = styled(Button)`
  width: 90%;
  font-size: 12px;
  margin-bottom: 10px;
  &::last-child {
    margin-bottom: 0;
  };
  background-color: ${(props) => props.selected ? '#81c784' : 'white'};
`;


const Row = ({ doc, relativesDocs, relativeDocsChanged, docInfo, states, settings, statesChanged }) => {
  const [isShowIframe, setShowClick] = useState(false);
  const [arrInWork, setArrInWork] = useState([]);

  useEffect(() => {
    let arr = [];
    doc.states.map((state) => {
      if (state[1] == 'inWork') {
        arr.push(state[0]);
      }
    });
    setArrInWork(arr);
  }, [doc]);

  const onChangeRel = async(value) => {
    await postQuery(`/${value ? 'del' : 'set'}Relative`,
      {
        id_ndm: docInfo.id,
        id_ais: doc.id,
        url: docInfo.url,
        iddoc: doc.id_ais,
        feeds: arrInWork
      }
    );
    const relsId = await getQuery('/getRelativesId', {id: docInfo.id});
    relativeDocsChanged(relsId);
    const states = await getQuery(`/getStates`, {id: docInfo.id});
    statesChanged(states);
  };

  return (
    <>
    <TableRow>
      
      <Cell name="title" textalign="left" component="th" scope="row">
        <DocTitle to={`/markup-ais/${doc.id}`} dangerouslySetInnerHTML={{__html:doc.title}}></DocTitle>
        {
          (doc.url && (doc.url.indexOf('http') != -1)) ?
          <>
          <Tooltip title="Открыть в этом окне">
            <ControlButton
              size="small"
              color='inherit'
              onClick={() => setShowClick(true)}>
              <OpenInBrowserIcon fontSize="small" />
            </ControlButton>
          </Tooltip>

          <Tooltip title="Открыть сохраненную копию">
            <ControlButton
              size="small"
              color='inherit'
              onClick={() => window.open(`http://webcache.googleusercontent.com/search?q=cache:${doc.url}`, '_blank')}>
              <TransitEnterexitIcon fontSize="small" />
            </ControlButton>
          </Tooltip>
          </> :

          (doc.url && (doc.url.slice(0,2) == 'Б=')) ?
          <>
          <Tooltip title="Открыть в К+">
            <LinkKP
              href={`consultantplus://offline/main?base=${doc.url.split('=')[1].slice(0, -2)};n=${doc.url.split('=')[2].slice(0, -2)};dst=${doc.url.split('=')[3]};last`}></LinkKP>
          </Tooltip>
          <BDMText>{doc.url}</BDMText>
          </> :

          (doc.url && (doc.url.indexOf('consultantplus://offline') == 0)) ?
          <>
          <Tooltip title="Открыть в К+">
            <LinkKP
              href={`${doc.url}`}></LinkKP>
          </Tooltip>
          <BDMText>{getBDM(doc.url)}</BDMText>
          </> : null
        }
        <SourceLink disabled = {(doc.url && (doc.url.indexOf('http') != -1)) ? '' : true}
           href={doc.url} target="_blank">{doc.source}</SourceLink>
      </Cell>
      <Cell textalign="center" component="th" scope="row">
        <DocDate>
          <Typography>{ (doc.publicated_at) ? moment(doc.publicated_at).format('DD.MM.YYYY') : 'Неизвестно' }</Typography>
        </DocDate>
      </Cell>
      <Cell component="th" scope="row">
      {
        (doc.states) ?
        doc.states.map((state, i) => {
          return (
            <Feed key={i}><strong>{feedsTransform(state[0])}: </strong>{statesTransform(state[1])}</Feed>
          )
        }) : null
      }
      </Cell>
      <Cell textalign="center" component="th" scope="row">
      {
        doc.id_ais ?
        <Typography>{doc.id_ais}</Typography>
        : <Typography>-</Typography>
      }
      </Cell>
      <Cell textalign="center" component="th" scope="row">
        <ActBtn
          variant="outlined"
          onClick={() => onChangeRel(relativesDocs && relativesDocs.includes(doc.id))}
          selected={(relativesDocs && relativesDocs.includes(doc.id)) ? 1 : 0}>Привязать</ActBtn>
      </Cell>
    </TableRow>
    <Ifame fullWidth={true} maxWidth="xs" onClose={() => setShowClick(false)} open={isShowIframe}>
      {
        (isShowIframe && doc.url) ?
        <iframe src={((doc.url.slice(-5).indexOf('doc') != -1) || ((doc.url.slice(-7).indexOf('ppt')) != -1)) ? `https://docs.google.com/viewer?url=${doc.url}&embedded=true` : doc.url} width="100%" height="5000px"/>
        : null
      }
    </Ifame>
    </>
  )
}

const mapStateToProps = ({ settings, markup:{relativesDocs, docInfo, doublesDocs, states} }) => {
  return { relativesDocs, docInfo, doublesDocs, states, settings };
};

const mapDispatchToProps = {
  relativeDocsChanged, doublesDocsChanged, statesChanged
};

export default connect(mapStateToProps, mapDispatchToProps)(Row);
