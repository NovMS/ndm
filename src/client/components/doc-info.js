import React, {useState} from 'react';
import { Typography } from '@material-ui/core';
import styled, {css} from 'styled-components';
import { Link } from 'react-router-dom';
import Dialog from '@material-ui/core/Dialog';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import OpenInBrowserIcon from '@material-ui/icons/OpenInBrowser';
import TransitEnterexitIcon from '@material-ui/icons/TransitEnterexit';
import moment from 'moment';
import logoKP from './../img/logokp.png'
import {getBDM} from './../services/getBDM';

const Root = styled.div`
  width: ${(props) => props.page != 'markup-ais' ? '98%' : '100%'};
  display: flex;
  flex-direction: column;
  align-items: center;
 
  height: 150px;
  overflow-y: auto;
  background-color: white;
  padding: 10px;
`;

const Title = styled(Typography)`
  text-align: center;
  margin-top: 10px;
`;

const IDAis = styled(Typography)`
  margin-right: 10px;
`;

const Info = styled.div`
  display: flex;
  margin-top: 10px;
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
  font-family: "Roboto", "Helvetica", "Arial", sans-serif;
`;

const BDMText = styled.p`
  margin: 0;
  margin-right: 5px;
  font-style: italic;
`;

const ControlButton = styled(IconButton)`
  margin: 0;
  color: #1976d2;
`;

const Ifame = styled(Dialog)`
  width: 100%;
  & .MuiDialog-paperWidthSm {
    max-width: 100%;
  }
`;

const SourceLink = styled.a`
  color: black;
  font-family: "Roboto", "Helvetica", "Arial", sans-serif;
  margin-right: 10px;
  ${props => (props.disabled) && css`
    pointer-events: none;
    cursor: default;
    text-decoration: none;
  `}
`;

const DocDate = styled.div`
  display: flex;
  margin-left: 5px;
  justify-content: center;
`;

const DocInfo = ({doc, page}) => {
  const [isShowIframe, setShowClick] = useState(false);
  return (
    <Root page={page}>
      <Title>{doc.title}</Title>
      <Info>
        <Typography><strong>Источник: </strong></Typography>
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
        <SourceLink disabled = {(doc.url && (doc.url.indexOf('http') != -1)) ? '' : true} href={doc.url} target="_blank">
          {doc.source}
        </SourceLink>
        {
          page=='markup-ais' ? <IDAis><strong>ID АИС: </strong><span>{doc.id_ais}</span></IDAis> : null
        }
        {
          page=='markup-ais' ?
          <Typography><strong>Дата:</strong></Typography>
          : <Typography><strong>Дата публикации:</strong></Typography>
        }
        <DocDate>
        {
          page=='markup-ais' ?
          <Typography>{ (doc.indexed_at) ? moment(doc.indexed_at).format('DD.MM.YYYY') : 'Неизвестно' }</Typography>
          : <Typography>{ (doc.publicated_at) ? moment(doc.publicated_at).format('DD.MM.YYYY') : 'Неизвестно' }</Typography>
        }
        </DocDate>
      </Info>
      <Ifame fullWidth={true} onClose={() => setShowClick(false)} open={isShowIframe}>
      {
        (isShowIframe && doc.url) ?
        <iframe src={((doc.url.slice(-5).indexOf('doc') != -1) || ((doc.url.slice(-7).indexOf('ppt')) != -1)) ? `https://docs.google.com/viewer?url=${doc.url}&embedded=true` : doc.url} width="100%" height="5000px"/>
        : null
      }
      </Ifame>
    </Root>
  );
};

export default DocInfo;
