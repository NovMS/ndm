import React, {useState, useEffect} from 'react';
import styled, { css } from 'styled-components';
import Typography from '@material-ui/core/Typography';
import { Link } from 'react-router-dom';
import moment from 'moment';

import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';

const Cell = styled(TableCell)`
  width: ${props => props.width ? props.width : 'auto'};
  padding: 10px;
  vertical-align: top;
  text-align: ${ props => props.textalign ? props.textalign : 'left' };
`;


const Row = ({item, status}) => {
  return (
    <>
    {
    status ?
    <TableRow>
      <Cell textalign="center" component="th" scope="row"><Typography>{item.name}</Typography></Cell>
      <Cell textalign="center" component="th" scope="row"><Typography>{status.count}</Typography></Cell>
      <Cell textalign="center" component="th" scope="row"><Typography>{moment(status.indexed_at).format('DD.MM.YYYY HH:mm')}</Typography></Cell>
      <Cell textalign="center" component="th" scope="row"><Typography>{status.status}</Typography></Cell>
      <Cell textalign="center" component="th" scope="row"><Typography>{status.inserted}</Typography></Cell>
    </TableRow> : null
    }
    </>
  )
}

export default Row;
