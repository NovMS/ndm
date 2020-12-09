import React, { useState, useEffect } from 'react';
import { postQuery, getQuery } from '../../services/query-service';
import styled from 'styled-components';
import { connect } from 'react-redux';

import { docsLoaded, docsLoading } from './../../actions/docs';
import { settingsChanged } from './../../actions/settings';

import Header from '../header';
import Filters from './../filters';
import MainTable from '../main-table/main-table';


const Root = styled.div`
  width: 100%;
  background-color: rgb(245, 245, 245);
`;

const Content = styled.div`
  width: 100%;
  display: flex;
  height: calc(100vh - 50px - 80px - 15px);
  justify-content: center;
`;

const Main = ({ docsLoaded, docsLoading, filters, settings, settingsChanged, page }) => {
	const getDocs = async (userFilters) => {
		docsLoading();
		let sources = {},
				feeds = {},
				competitors = {};
		if (userFilters && userFilters.sources && userFilters.feeds && userFilters.competitors) {
			sources = userFilters.sources;
			feeds = userFilters.feeds;
			competitors = userFilters.competitors;
		} else if (settings && settings.sources && settings.feeds && settings.competitors) {
			sources = settings.sources;
			feeds = settings.feeds;
			competitors = settings.competitors;
		}

		const docs = await postQuery(`/getLastDocs`, {
			sources: JSON.stringify(sources),
			feeds: JSON.stringify(feeds),
			competitors: JSON.stringify(competitors),
			page,
			...filters
		});
		docsLoaded(docs);
	};

	const saveSettigs = async() => {
		await postQuery(`/setUserFilters`, {
			...settings
		});
	};

	useEffect(() => {
		(async() => {
			const userFilters = await getQuery(`/getUserFilters`, {});
			settingsChanged(userFilters);
			await getDocs(userFilters);

		})();
	},[page]);
	
	return (
	  <Root>
	    <Header page={page} getDocs={getDocs} saveSettigs={saveSettigs}/>
			<Filters page={page}/>
			<Content>
				<MainTable page={page}/>
			</Content>
	  </Root>
  )
}

const mapStateToProps = ({ filters, settings }) => {
  return { filters, settings };
};

const mapDispatchToProps = {
  docsLoaded, settingsChanged, docsLoading
};

export default connect(mapStateToProps, mapDispatchToProps)(Main);
