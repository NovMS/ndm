import React, {useState} from 'react';
import styled, { css } from 'styled-components';
import Typography from '@material-ui/core/Typography';
import { Link } from 'react-router-dom';
import moment from 'moment';
import { connect } from 'react-redux';

import logoKP from './../../../img/logokp.png'

import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import {getBDM} from './../../../services/getBDM';
import { feedsTransform, statesTransform } from './../../../services/translator';

import IconButton from '@material-ui/core/IconButton';
import OpenInBrowserIcon from '@material-ui/icons/OpenInBrowser';
import TransitEnterexitIcon from '@material-ui/icons/TransitEnterexit';

import Dialog from '@material-ui/core/Dialog';

import Tooltip from '@material-ui/core/Tooltip';

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


const Row = ({ doc }) => {
  const [isShowIframe, setShowClick] = useState(false);
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
      <Cell textalign="center" component="th" scope="row"><Typography>{doc.comment}</Typography></Cell>
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

const mapStateToProps = ({ markup:{docInfo} }) => {
  return { docInfo };
};

export default connect(mapStateToProps)(Row);
