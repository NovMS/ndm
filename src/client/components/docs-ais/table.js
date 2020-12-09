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
  height: calc(100% - 45px);
`;

const Cell = styled(TableCell)`
  width: ${props => props.width ? props.width : 'auto'};
  top: ${props => props.top ? props.top : '0'};
  padding: 5px;
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
`;

const Help = styled(HelpOutlineIcon)`
  margin-left: 5px;
  cursor: pointer;
`;

const EmptyDoc = styled(Typography)`
	display: block;
  text-align: center;
  margin-top: 20px;
	font-size: 20px;
	color: rgba(0,0,0,0.5);
`;

const RelTable = ({relativesDocsList, doublesDocsList, menu}) => {
  return (
    <Root component={Paper}>
      <Table stickyHeader  size="small" >
        <TableHead>
          <TableRow>
            <Cell width="70%"><Typography>Название документа</Typography></Cell>
            <Cell width="15%"><Typography>Дата</Typography></Cell>
            <Cell width="15%"><Typography>Действия</Typography></Cell>
          </TableRow>
        </TableHead>
        <TableBody>
        {
          menu == 'rel' ? (
          !relativesDocsList ? <TableRow><CellSpinner colSpan={10}><Spinner /></CellSpinner></TableRow>: 
          relativesDocsList.length == 0 ? <TableRow><CellSpinner colSpan={10}><EmptyDoc>Документы отсутствуют</EmptyDoc></CellSpinner></TableRow> :
          relativesDocsList.map((doc, i) => {
            return(
              <Row key={i} doc={doc} menu={menu}/>
            )
          })
          ) :
          menu == 'doub' ? (
          !doublesDocsList ? <TableRow><CellSpinner colSpan={10}><Spinner /></CellSpinner></TableRow>: 
          doublesDocsList.length == 0 ? <TableRow><CellSpinner colSpan={10}><EmptyDoc>Документы отсутствуют</EmptyDoc></CellSpinner></TableRow> :
          doublesDocsList.map((doc, i) => {
            return(
              <Row key={i} doc={doc} menu={menu}/>
            )
          })
          ) : null
        }
        </TableBody>
      </Table>
    </Root>
  );
}

const mapStateToProps = ({ markup: { relativesDocsList, doublesDocsList } }) => {
  return { relativesDocsList, doublesDocsList };
};

export default connect(mapStateToProps)(RelTable);
