import React, { useState, useEffect } from 'react';
import { postQuery, getQuery } from '../../services/query-service';
import styled from 'styled-components';
import { connect } from 'react-redux';

import { settingsChanged } from './../../actions/settings';

import Header from '../header';
import InfoBlock from '../info-block';

const Root = styled.div`
  width: 100%;
  background-color: rgb(245, 245, 245);
`;

const Content = styled.div`
  width: 100%;
  height: calc(100vh - 50px);
	overflow-y: auto;
`;

const Info = ({ settings, settingsChanged, page }) => {

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
				<InfoBlock></InfoBlock>
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

export default connect(mapStateToProps, mapDispatchToProps)(Info);
