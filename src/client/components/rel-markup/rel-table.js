import React, {useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';

import CircularProgress from '@material-ui/core/CircularProgress';

import Tooltip from '@material-ui/core/Tooltip';
import { docsLoaded, docsLoading, newDocsLoaded } from './../../actions/docs';
import { postQuery } from '../../services/query-service';

import Typography from '@material-ui/core/Typography';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

import Row from './row';

import HelpOutlineIcon from '@material-ui/icons/HelpOutline';


const Root = styled(TableContainer)`
  width: 100%;
  height: 100%;
`;

const Cell = styled(TableCell)`
  width: ${props => props.width ? props.width : 'auto'};
  top: ${props => props.top ? props.top : '0'};
  height: 45px;
  text-align: center;
`;

const CellSpinner = styled(TableCell)`
  width: 100%;
  border: none;
`;

const Spinner = styled(CircularProgress)`
  display: block;
  margin: 0 auto; 
  margin-top: 15px;
`

const Help = styled(HelpOutlineIcon)`
  margin-left: 5px;
  cursor: pointer;
`

const RelTable = ({similarDocs}) => {
  return (
    <Root component={Paper}>
      <Table stickyHeader  size="small" >
        <TableHead>
          <TableRow>
            <Cell width="35%"><Typography>Название документа</Typography></Cell>
            <Cell width="15%"><Typography>Дата</Typography></Cell>
            <Cell width="20%"><Typography>Статус</Typography></Cell>
            <Cell width="15%"><Typography>ID в АИС</Typography></Cell>
            <Cell width="15%"><Typography>Действия</Typography></Cell>
          </TableRow>
        </TableHead>
        <TableBody>
        {
          !similarDocs ? <TableRow><CellSpinner colSpan={10}><Spinner /></CellSpinner></TableRow>: 
          similarDocs.map((doc, i) => {
            return(
              <Row key={i} doc={doc}/>
            )
          })
        }
        </TableBody>
      </Table>
    </Root>
  );
}

const mapStateToProps = ({ markup: {similarDocs} }) => {
  return { similarDocs };
};

export default connect(mapStateToProps)(RelTable);
