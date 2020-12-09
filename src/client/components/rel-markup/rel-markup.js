import React, {useState, useEffect} from 'react';
import { Typography } from '@material-ui/core';
import styled from 'styled-components';
import { connect } from 'react-redux';
import RelTable from './rel-table';


const Root = styled.header`
  display: flex;
  width: 69%;
  height: 100%;
  flex-direction: column;
  align-items: center;
  overflow-y: auto;
  box-shadow: rgba(0, 0, 0, 0.16) 0px 2px 2px 0px, rgba(0, 0, 0, 0.08) 0px 0px 0px 1px;
  background-color: white;
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
  position: relative;
`;

const RelMarkup = ({settings}) => {
  return (
    <Root>
      <RelTable />
    </Root>
  );
};

const mapStateToProps = ({ settings }) => {
  return { settings };
};

export default connect(mapStateToProps)(RelMarkup);
