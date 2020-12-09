import React, {useState, useEffect} from 'react';
import { Typography } from '@material-ui/core';
import styled from 'styled-components';
import { connect } from 'react-redux';
import Table from './table';
import DoubTable from './doub-table/doub-table';


const Root = styled.header`
  width: 69%;
  height: 100%;
  overflow-y: auto;
  box-shadow: rgba(0, 0, 0, 0.16) 0px 2px 2px 0px, rgba(0, 0, 0, 0.08) 0px 0px 0px 1px;
  background-color: white;
`;

const MainTitle = styled.div`
  background-color: #fafafa;
  border-bottom: 1px solid rgba(224, 224, 224, 1);
  height: 45px;
  box-sizing: border-box;
  width: 100%;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const DocType = styled(Typography)`
  margin-right: 20px;
  font-weight: bold;
  cursor: pointer;
  color: ${(props) => props.active == '1' ? '#1976d2' : 'black'};
  &:last-child {
    margin-right: 0;
  }
`;

const DocsAis = ({settings}) => {
  const [menu, setMenu] = useState('rel');
  
  return (
    <Root>
      <MainTitle>
        <DocType
          active={menu == 'rel' ? '1' : '0'}
          onClick={() => setMenu('rel')}>Привязанные</DocType>
        <DocType
          active={menu == 'doub' ? '1' : '0'}
          onClick={() => setMenu('doub')}>Похожие</DocType>
      </MainTitle>
      {
        menu == 'rel' ?
        <Table menu={menu}/> :
        menu == 'doub' ?
        <DoubTable /> : null
      }
    </Root>
  );
};

const mapStateToProps = ({ settings }) => {
  return { settings };
};

export default connect(mapStateToProps)(DocsAis);
