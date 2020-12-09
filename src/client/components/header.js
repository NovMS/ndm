import React, {useState} from 'react';
import { Typography } from '@material-ui/core';
import styled from 'styled-components';
import { postQuery, getQuery } from '../services/query-service';
import { Link } from 'react-router-dom';
import Drawer from '@material-ui/core/Drawer';
import IconButton from '@material-ui/core/IconButton';
import SettingsIcon from '@material-ui/icons/Settings';

import HelpIcon from '@material-ui/icons/Help';

import Settings from './settings/settings';
import { useEffect } from 'react';

const Root = styled.header`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  height: 50px;
  width: 100%;
  background-color: #1976d2;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.24);
  color: #fff;
  position: relative;
`;

const Name = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  position: absolute;
  left: 30px;
`;

const ShortName = styled(Typography)`
  font-size: 30px;
  font-weight: bold;
`;

const FullName = styled(Typography)`
  font-size: 12px;
  line-height: 13px;
  margin-left: 3px;
`;

const Navigation = styled.div`
  margin: 0 auto;
  display: flex;
`;

const LinkTo = styled(Link)`
  text-decoration: none;
  margin-right: 20px;
  &:last-child {
    margin-right: 0;
  }

`;

const LinkInfo = styled.a`
  text-decoration: none;
  color: white;
  margin: 0;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const LinkText = styled(Typography)`
  font-size: 22px;
  color: ${props => props.isactive=='true' ? 'white' : 'rgba(255,255,255,0.7)'};
  &:hover {
    color: white;
  }
`;

const SettingsBtn = styled(IconButton)`
  position: absolute;
  right: 15px;
`;

const InfoBtn = styled(IconButton)`
  position: absolute;
  right: 60px;
`;

const Header = ({ page, getDocs, saveSettigs }) => {
  const [nextId, setNextId] = useState('');

  useEffect(() => {
    (async() => {
      const nextIdDoc = await getQuery(`/getNextDoc`);
      setNextId(nextIdDoc.id);
    })();
  },[])

  const [isShowAdvancedFilters, onShowClick] = useState(false);

  return (
    <Root>
      <Name>
        <ShortName>НДМ</ShortName>
        <FullName>Мониторинг<br/>новых документов</FullName>
      </Name>
      <Navigation>
        <LinkTo to='/ndm'><LinkText isactive={(page=='ndm').toString()}>НДМ</LinkText></LinkTo>
        <LinkTo to='/ais'><LinkText isactive={(page=='ais').toString()}>АИС</LinkText></LinkTo>
        <LinkTo to='/competitors'><LinkText isactive={(page=='competitors').toString()}>Конкуренты</LinkText></LinkTo>
        <LinkTo
          disabled={nextId ? false : true}
          onClick={(evt) => {
            if (!nextId) {
              evt.preventDefault();
            }
          }}
          to={`/markup/${nextId}`}>
          <LinkText isactive={(page=='markup').toString()}>Разметка</LinkText>
        </LinkTo>
        <LinkTo to='/stats'><LinkText isactive={(page=='stats').toString()}>Статистика</LinkText></LinkTo>
      </Navigation>
      <InfoBtn color='inherit'>
        <LinkInfo href="http://dad-bookstack.consultant.ru/books/%D0%BD%D1%80%D1%81%D1%83%D0%B1%D0%B4-%D0%BF%D1%80%D0%BE%D0%B4%D1%83%D0%BA%D1%82%D1%8B/page/%D0%BE%D0%BF%D0%B8%D1%81%D0%B0%D0%BD%D0%B8%D0%B5-%D0%B8%D1%81%D1%82%D0%BE%D1%87%D0%BD%D0%B8%D0%BA%D0%BE%D0%B2-%D0%BD%D0%B4%D0%BC" target="_blank"><HelpIcon /></LinkInfo>
      </InfoBtn>
      <SettingsBtn color='inherit' onClick={() => onShowClick(true)}>
        <SettingsIcon />
      </SettingsBtn>
      <Drawer
        anchor={'right'}
        open={isShowAdvancedFilters}
        onClose={async() => {
          onShowClick(false);
          await saveSettigs();
          if ((page == 'ndm') || (page  == 'ais') || (page  == 'competitors')) {
            await getDocs();
          }
        }}>
        <Settings />
      </Drawer>
    </Root>
  );
};

export default Header;
