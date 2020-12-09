import React, {useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';

import CircularProgress from '@material-ui/core/CircularProgress';

import Typography from '@material-ui/core/Typography';

import Tooltip from '@material-ui/core/Tooltip';
import { docsLoaded, docsLoading, newDocsLoaded, docsLoadingChange } from './../../actions/docs';
import { postQuery } from '../../services/query-service';

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
  width: 98%;
  height: 100%;
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
`

const Help = styled(HelpOutlineIcon)`
  margin-left: 5px;
  cursor: pointer;
`

const MainTable = ({ filters, settings, loadingDocs, docs, docsLoading, newDocsLoaded, docsLoaded, page, docsLoadingChange}) => {
  const count = 20;
  const [offset, onOffsetChange] = useState(0);
  const [isEnded, onEnded] = useState(false);

  const filtersRef = useRef();
  const settingsRef = useRef();
  filtersRef.current = filters;
  settingsRef.current = settings;

  useEffect(() => {
    onEnded(false);
    onOffsetChange(0);
  }, []);

  useEffect(() => {
    (async () => {
      if ((docs.length > 0) && offset != 0) {
				const newDocs = await postQuery(`/getLastDocs`, {
          offset,
          count,
					sources: JSON.stringify(settings.sources),
          feeds: JSON.stringify(settings.feeds),
          competitors: JSON.stringify(settings.competitors),
          page,
          ...filters
        });
        newDocsLoaded(newDocs);
        if  (newDocs.length == 0) {
          onEnded(true)
        }
      }
    })();
  }, [offset]);

  useEffect(() => {
    (async () => {
      const newOffset = 0;
      docsLoading();
      onEnded(false);
      onOffsetChange(newOffset);
      const docs = await postQuery(`/getLastDocs`, {
        newOffset,
        count,
        sources: JSON.stringify(settings.sources),
        page,
        feeds: JSON.stringify(settings.feeds),
        competitors: JSON.stringify(settings.competitors),
        ...filters
      });
      
      const filtersUpToDate = JSON.stringify(filters) == JSON.stringify(filtersRef.current);
      const settingsUpToDate = JSON.stringify(settings) == JSON.stringify(settingsRef.current);

      if (filtersUpToDate && settingsUpToDate) {
        docsLoaded(docs);
      }
    })();
  }, [filters, settings]);

  const onScrollTable = (e) => {
    if (!loadingDocs) {
      downloadNewSnippents(e.target.scrollHeight, e.target.clientHeight, e.target.scrollTop)
    }
  }

  const downloadNewSnippents = (height, cliHeight, scroll) => {
    if(((scroll+cliHeight) > (height - (cliHeight/2))) && !loadingDocs && !isEnded) {
      docsLoadingChange(true);
      onOffsetChange(prevOffset => prevOffset + count);
    }
  }

  return (
    <Root component={Paper} onScroll={onScrollTable}>
      <Table stickyHeader  size="small" >
        <TableHead>
          <TableRow>
            <Cell width={page == 'ais' ? '30%' : page == 'competitors' ? '50%' : '40%'}><Typography>Название документа</Typography></Cell>
            <Cell width={page == 'competitors' ? '25%' : '15%'}><Typography>Источник</Typography></Cell>
            {
              page == 'ais' ?
                <Cell width="10%"><Typography>Дата</Typography></Cell> :
                <Cell width={page == 'competitors' ? '25%' : '15%'}><Typography>Дата индексации/<br/>дата публикации</Typography></Cell>
            }
            {
              page != 'competitors' ?
              <>
                <Cell width="15%"><Typography>Статус</Typography></Cell>
                <Cell width="20%"><Typography>Комментарий</Typography></Cell>
              </>
              : null
            }
            {page == 'ais' ? <Cell width="10%">ID в АИС</Cell> : null}
          </TableRow>
        </TableHead>
        <TableBody>
        {
          docs.map((doc, i) => {
            return(
              <Row key={i} doc={doc} page={page}/>
            )
          })
        }
        {
          loadingDocs ? <TableRow><CellSpinner colSpan={10}><Spinner /></CellSpinner></TableRow>: null
        }
        </TableBody>
      </Table>
    </Root>
  );
}

const mapStateToProps = ({ filters, settings, docs:{ loadingDocs, docs } }) => {
  return { filters, settings, loadingDocs, docs };
};

const mapDispatchToProps = {
  docsLoaded, docsLoading, newDocsLoaded, docsLoadingChange
};

export default connect(mapStateToProps, mapDispatchToProps)(MainTable);
