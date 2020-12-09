import React from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';

import CircularProgress from '@material-ui/core/CircularProgress';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

import Row from './row';


const Root = styled(TableContainer)`
  width: 100%;
  height: calc(100% - 45px);
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

const DoubTable = ({doublesDocsList}) => {
  return (
    <Root component={Paper}>
      <Table stickyHeader  size="small" >
        <TableHead>
          <TableRow>
            <Cell width="40%">Название документа</Cell>
            <Cell width="20%">Дата</Cell>
            <Cell width="20%">Статус</Cell>
            <Cell width="20%">Комментарий</Cell>
          </TableRow>
        </TableHead>
        <TableBody>
        {
          !doublesDocsList ? <TableRow><CellSpinner colSpan={10}><Spinner /></CellSpinner></TableRow>: 
          doublesDocsList.map((doc, i) => {
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

const mapStateToProps = ({ markup: {doublesDocsList} }) => {
  return { doublesDocsList };
};

export default connect(mapStateToProps)(DoubTable);
