import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  DatePicker 
} from '@material-ui/pickers';
import ruLocale from "date-fns/locale/ru";

import { filtersChanged, filtersReset } from './../actions/filters';

import Paper from '@material-ui/core/Paper';
import InputBase from '@material-ui/core/InputBase';
import IconButton from '@material-ui/core/IconButton';
import SearchIcon from '@material-ui/icons/Search';

import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';

import BackspaceIcon from '@material-ui/icons/Backspace';

const Root = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  height: 80px;
  width: 98%;
  margin: 0 auto;
`;

const Search = styled(Paper)`
  display: flex;
  align-items: center;
  width: 400px;
  padding-left: 10px;
`;

const SearchInput = styled(InputBase)`
  flex: 1;
`;

const SearchButton = styled(IconButton)`
  padding: 10px;
`;

const Sort = styled(FormControl)`
  width: 200px;
  margin-left: 15px;
`;

const DateFromInput = styled(DatePicker)`
  width: 100px;
  margin-left: 15px;
`;

const DateToInput = styled(DatePicker)`
  width: 100px;
  margin-left: 15px;
`;

const ClearBtn = styled(IconButton)`
  margin-left: 15px;
  color: #1976d2;
`;

const Filters = ({ filters, filtersChanged, filtersReset, page }) => {

  const [searchValue, setSearchValue] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  const sortItems = {
    'all': 'Все документы',
    'my': 'Моя разметка',
    'withMarkup': 'Только с разметкой',
    'withoutMarkup': 'Без разметки',
    'withoutMarkupLents': 'Без разметки в моих лентах',
    'inWork': 'Взят в работу',
    'skip': 'Пропущенные',
    'skipLents': 'Пропущенные в моих лентах'
  }

  return (
      <Root>
        <Search onSubmit={(evt) => {
                  evt.preventDefault();
                  filtersChanged({searchValue: searchValue});
                }}
                component="form">
          <SearchInput
            onChange={(evt) => setSearchValue(evt.target.value)}
            value={searchValue}
            placeholder="Название документа"
          />
          <SearchButton type="submit">
            <SearchIcon />
          </SearchButton>
        </Search>

        <MuiPickersUtilsProvider utils={DateFnsUtils} locale={ruLocale}>
          <DateFromInput
            label="Дата инд. от"
            InputLabelProps={{
              shrink: true,
            }}
            autoOk
            onAccept={(date) => {
              filtersChanged({dateFrom: date})
            }}
            variant="inline"
            disableFuture={true}
            ampm={false}
            value={(dateFrom) ? dateFrom : null}
            onChange={(date) => setDateFrom(date)}
            minDateMessage={'Неверный формат'}
            invalidDateMessage={'Неверный формат'}
            format="dd.MM.yyyy"
            placeholder="дд.мм.гггг"
          />
        </MuiPickersUtilsProvider>

        <MuiPickersUtilsProvider utils={DateFnsUtils} locale={ruLocale}>
          <DateToInput
            label="Дата инд. до"
            InputLabelProps={{
              shrink: true,
            }}
            autoOk
            onAccept={(date) => {
              filtersChanged({dateTo: date})
            }}
            variant="inline"
            disableFuture={true}
            ampm={false}
            value={(dateTo) ? dateTo : null}
            onChange={(date) => setDateTo(date)}
            minDateMessage={'Неверный формат'}
            invalidDateMessage={'Неверный формат'}
            format="dd.MM.yyyy"
            placeholder="дд.мм.гггг"
          />
        </MuiPickersUtilsProvider>
        {
          page == 'ndm' ?
          <Sort>
            <InputLabel id="filters-status">Статус</InputLabel>
            <Select
              labelId="filters-status"
              value={filters.status}
              onChange={(evt) => filtersChanged({status: evt.target.value})}
            >
              {
                Object.entries(sortItems).map(([key, value]) => {
                  return(
                    <MenuItem key={key} value={key}>{value}</MenuItem>
                  )
                })
              }
            </Select>
          </Sort> : null
        }
        {
          (filters.searchValue != '' || filters.dateFrom != '' || filters.dateTo != '' || (filters.status != 'all' && page != 'ais')) ?
          <ClearBtn color='inherit'
            onClick={() => {
              filtersReset();
              setSearchValue('');
              setDateFrom('');
              setDateTo('');
            }}>
            <BackspaceIcon />
          </ClearBtn> : null
        }

      </Root>
  );
};

const mapStateToProps = ({ filters }) => {
  return { filters };
};

const mapDispatchToProps = {
  filtersChanged, filtersReset
};

export default connect(mapStateToProps, mapDispatchToProps)(Filters);
