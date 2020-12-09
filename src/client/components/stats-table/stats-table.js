import React, {useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import moment from 'moment';

import CircularProgress from '@material-ui/core/CircularProgress';

import Tooltip from '@material-ui/core/Tooltip';
import { docsLoaded, docsLoading, newDocsLoaded, docsLoadingChange } from './../../actions/docs';
import { getQuery } from '../../services/query-service';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  DatePicker 
} from '@material-ui/pickers';
import ruLocale from "date-fns/locale/ru";

import Row from './row';
import { Typography } from '@material-ui/core';
import { sources } from '../../services/data';

const Root = styled(TableContainer)`
  width: 85%;
  height: 96%;
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

const DateInput = styled(DatePicker)`
  width: 0;
  height: 0;
  position: absolute;
  margin-top: -25px;
`;

const DocsDate = styled(Typography)`
  text-decoration: underline;
  cursor: pointer;
`;

const StatsTable = ({ page }) => {

  const [status, setStatus] = useState();
  const [loading, setLoading] = useState(true);
  const [date, setDate] = useState(`${moment()}`);
  const [isOpen, setIsOpen] = useState(false);
  const [sourcesArr, setSourcesArr] = useState([]);

  useEffect(() => {
    (async () => {
      let newSourcesArr = [];

      let newSources = await getQuery(`/getSources`, {});
      newSources.map((sourcesObj) => {
        Object.entries(sourcesObj).map(([key, value]) => {
          newSourcesArr.push({
            source: key,
            name: value
          });
        });
      });

      newSources = await getQuery(`/getCompetitors`, {});
      newSources.map((sourcesObj) => {
        Object.entries(sourcesObj).map(([key, value]) => {
          newSourcesArr.push({
            source: key,
            name: value
          });
        });
      })

      setSourcesArr(newSourcesArr);
    })();

    getStatus(date);
  }, []);

  const getStatus = async (date) => {
    setLoading(true);
    const parsers = await getQuery(`/getStatus`, {date: date});
    setStatus(parsers);
    setLoading(false);
  }

  return (
    <Root component={Paper}>
      <Table stickyHeader  size="small" >
        <TableHead>
          <TableRow>
            <Cell width="20%"><Typography>Источник</Typography></Cell>
            <Cell width="20%">
              <Typography>Количество документов за</Typography>
              <DocsDate onClick={() => setIsOpen(true)}>{moment(new Date(date)).format('DD.MM.YYYY')}</DocsDate>
              <MuiPickersUtilsProvider utils={DateFnsUtils} locale={ruLocale}>
                <DateInput
                  onOpen={() => setIsOpen(true)}
                  onClose={() => setIsOpen(false)}
                  open={isOpen}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  autoOk
                  onAccept={(date) => {
                    getStatus(date);
                  }}
                  variant="inline"
                  disableFuture={true}
                  ampm={false}
                  value={(date) ? date : null}
                  onChange={(date) => setDate(date)}
                  format="dd.MM.yyyy"
                  placeholder="дд.мм.гггг"
                />
              </MuiPickersUtilsProvider>
            </Cell>
            <Cell width="20%"><Typography>Дата последнего запуска</Typography></Cell>
            <Cell width="20%"><Typography>Статус последнего запуска</Typography></Cell>
            <Cell width="20%"><Typography>Добавлено за последний запуск</Typography></Cell>
          </TableRow>
        </TableHead>
        <TableBody>
        {
          (!loading && sourcesArr && sourcesArr.length > 0) ?
          sourcesArr.map((item) => {
            console.log(status);
            return (
              <Row key={item.source} item={item} status={status[item.source]}/>
            )
          }) : <TableRow><CellSpinner colSpan={10}><Spinner /></CellSpinner></TableRow>
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

export default connect(mapStateToProps, mapDispatchToProps)(StatsTable);
