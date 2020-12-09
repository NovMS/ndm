import React, {useState, useEffect} from 'react';
import { Typography } from '@material-ui/core';
import styled from 'styled-components';
import CheckboxList from '../settings/checkboxList';
import { getQuery } from './../../services/query-service';
import {feeds} from '../../services/data';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import VisibilityIcon from '@material-ui/icons/Visibility';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';

const Root = styled.div`
  width: 520px;
  height: 100%;
  overflow-y: scroll;
`;

const Title = styled.div`
  background-color: #fafafa;
  border-bottom: 1px solid rgba(224, 224, 224, 1);
  border-top: 1px solid rgba(224, 224, 224, 1);
  text-align: center;
  padding: 5px;
  margin-bottom: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  user-select: none;
  cursor: pointer;
`;

const TitleText = styled(Typography)`
  font-size: 18px;
`;

const ControlButton = styled(IconButton)`
  margin: 0;
  margin-left: 5px;
  color: rgba(0, 0, 0, 0.54);
`;

const Settings = () => {
  const [sources, setSources] = useState([]);
  const [competitors, setCompetitors] = useState([]);
  const [isOpen, setIsOpen] = useState({
    feeds: true,
    sources: false,
    competitors: false
  });

  useEffect(() => {
    (async () => {
      const newSources = await getQuery(`/getSources`, {});
      setSources(newSources);

      const newCompetitors = await getQuery(`/getCompetitors`, {});
      setCompetitors(newCompetitors);
    })();
  }, []);

  return (
    <Root>
      <Title style={{cursor: 'default'}}>
        <TitleText>Ленты для разметки</TitleText>
      </Title>
      {
        isOpen.feeds ? <CheckboxList type='feeds' items={feeds}/> : null
      }
      <Title
        onClick={() => setIsOpen({...isOpen, sources: !isOpen.sources})}
      >
        <TitleText>Источники</TitleText>
        <Tooltip title={isOpen.sources ? 'Скрыть источники' : 'Показать источники'}>
          <ControlButton
            size="small"
            color='inherit'
          >
            {isOpen.sources ? <VisibilityOffIcon fontSize="small" /> : <VisibilityIcon fontSize="small" />}
          </ControlButton>
        </Tooltip>
      </Title>
      {
        (sources && (sources.length > 0) && (isOpen.sources)) ?
          <CheckboxList type='sources' items={sources}/>
        : null
      }
      <Title
        onClick={() => setIsOpen({...isOpen, competitors: !isOpen.competitors})}
      >
        <TitleText>Конкуренты</TitleText>
        <Tooltip title={isOpen.competitors ? 'Скрыть конкурентов' : 'Показать конкурентов'}>
          <ControlButton
            size="small"
            color='inherit'
          >
            {isOpen.competitors ? <VisibilityOffIcon fontSize="small" /> : <VisibilityIcon fontSize="small" />}
          </ControlButton>
        </Tooltip>
      </Title>
      {
        (competitors && (competitors.length > 0) && (isOpen.competitors)) ?
          <CheckboxList type='competitors' items={competitors}/>
        : null
      }
    </Root>
  );
};

export default Settings;
