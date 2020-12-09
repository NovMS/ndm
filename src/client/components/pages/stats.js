import React, { useState, useEffect } from 'react';
import { postQuery, getQuery } from '../../services/query-service';
import styled from 'styled-components';
import { connect } from 'react-redux';

import { settingsChanged } from './../../actions/settings';

import Header from '../header';
import StatsTable from '../stats-table/stats-table';

const Root = styled.div`
  width: 100%;
  background-color: rgb(245, 245, 245);
`;

const Content = styled.div`
  width: 100%;
  display: flex;
  height: calc(100vh - 50px);
  justify-content: center;
	align-items: center;
`;

const Stats = ({ settings, settingsChanged, page }) => {

	const saveSettigs = async() => {
		await postQuery(`/setUserFilters`, {
			...settings
		});
	};

	useEffect(() => {
		(async() => {
			const userFilters = await getQuery(`/getUserFilters`, {});
			settingsChanged(userFilters);
		})();
	},[page]);
	
	return (
	  <Root>
	    <Header page={page} saveSettigs={saveSettigs}/>
			<Content>
				<StatsTable />
			</Content>
	  </Root>
  )
}

const mapStateToProps = ({ filters, settings }) => {
  return { filters, settings };
};

const mapDispatchToProps = {
  settingsChanged
};

export default connect(mapStateToProps, mapDispatchToProps)(Stats);
