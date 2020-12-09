import React, { useState, useEffect } from 'react';
import { postQuery, getQuery } from '../../services/query-service';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { settingsChanged } from './../../actions/settings';
import { docInfoChanged, similarDocsChanged, statesChanged, relativeDocsListChanged, doublesDocsListChanged } from './../../actions/markup';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';

import Header from '../header';
import DocInfo from '../doc-info';
import SettingsAis from '../settings-ais';
import DocsAis from '../docs-ais/docs-ais';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';

const Root = styled.div`
  width: 100%;
	height: 100vh;
  background-color: rgb(245, 245, 245);
`;

const Content = styled.div`
  width: 100%;
	height: calc(100vh - 50px);
	display: flex;
	justify-content: space-between;
`;

const Control = styled(Link)`
  width: 2%;
	height: 150px;
	background-color: rgba(0, 0, 0, 0.05);
	display: flex;
	justify-content: center;
	align-items: center;
	color: #1976d2;
	cursor: pointer;
`;

const MainBlock = styled.div`
	width: 100%;
	height: calc(100vh - 50px);
	padding: 20px;
	box-sizing: border-box;
	display: flex;
	flex-direction: column;
`;

const MarkupBlocks = styled.div`
	width: 100%;
	flex: 1;
	display: flex;
	justify-content: space-between;
	margin-top: 20px;
	box-sizing: border-box;
`;

const HeaderBlock = styled.div`
	width: 100%;
	display: flex;
	justify-content: space-between;
	box-shadow: rgba(0, 0, 0, 0.16) 0px 2px 2px 0px, rgba(0, 0, 0, 0.08) 0px 0px 0px 1px;
`;

const Spinner = styled(CircularProgress)`
	display: block;
  margin: 0 auto;
  margin-top: 15px;
`;

const ErrorDoc = styled(Typography)`
	display: block;
  margin: 0 auto;
  margin-top: 20px;
	font-size: 20px;
	color: rgba(0,0,0,0.5);
`;

const Ais = ({ settings, page, settingsChanged, match, docInfoChanged, statesChanged, markup:{docInfo}, similarDocsChanged, relativeDocsListChanged, doublesDocsListChanged }) => {
	const saveSettigs = async() => {
		await postQuery(`/setUserFilters`, {
			...settings
		});
	};

	const [nextId, setNextId] = useState('');

	useEffect(() => {
		(async() => {
			statesChanged({});
			settingsChanged(null);
			docInfoChanged(null);
			similarDocsChanged(null);
			relativeDocsListChanged(null);
			doublesDocsListChanged(null);
			
			const userFilters = await getQuery(`/getUserFilters`, {});
			settingsChanged(userFilters);
			
			const docInfo = await getQuery('/getDocInfo', {id: match.params.id});
			docInfoChanged(docInfo);

			const relativeDocs = await getQuery('/getRelatedDocs', {id: match.params.id});
			relativeDocsListChanged(relativeDocs);

			const states = await getQuery(`/getStates`, {id: match.params.id});
			statesChanged(states);

			const nextIdDoc = await getQuery(`/getNextDoc`, {id: match.params.id});
			setNextId(nextIdDoc.id);

			const doublesDocs = await postQuery('/getSimilarDocs', {id: match.params.id, title:docInfo.title, isAis: true});
			doublesDocsListChanged(doublesDocs);
		})();
	},[page, match]);

	return (
		<Root>
			<Header page={page} saveSettigs={saveSettigs}/>
			<Content>
				{
					docInfo === null ?
					<Spinner>Загрузка</Spinner> :
					docInfo.error ?
					<ErrorDoc>{docInfo.error}</ErrorDoc>	:
					docInfo ?
					<>
					<MainBlock>
						<HeaderBlock>
							<DocInfo doc={docInfo} page={page}/>
							{
								page != 'markup-ais' ?
								<Control to={`/markup/${nextId}`}><ArrowForwardIosIcon /></Control> : null
							}
						</HeaderBlock>
						<MarkupBlocks>
							<DocsAis />
							<SettingsAis />
						</MarkupBlocks>
					</MainBlock>
					</> : null
				}
			</Content>
		</Root>
  )
}

const mapStateToProps = ({ filters, settings, markup }) => {
  return { filters, settings, markup };
};

const mapDispatchToProps = {
  settingsChanged, docInfoChanged, similarDocsChanged, statesChanged, relativeDocsListChanged, doublesDocsListChanged
};

export default connect(mapStateToProps, mapDispatchToProps)(Ais);
