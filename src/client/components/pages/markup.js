import React, { useState, useEffect } from 'react';
import { postQuery, getQuery } from '../../services/query-service';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { settingsChanged } from './../../actions/settings';
import Typography from '@material-ui/core/Typography';
import { docInfoChanged, similarDocsChanged, statesChanged, relativeDocsChanged, doublesDocsChanged } from './../../actions/markup';

import Header from '../header';
import DocInfo from '../doc-info';
import RejectMarkup from '../reject-markup';
import RelMarkup from '../rel-markup/rel-markup';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';

import CircularProgress from '@material-ui/core/CircularProgress';

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
	overflow-y: auto;
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

const Markup = ({ settings, page, settingsChanged, match, docInfoChanged, statesChanged, markup:{docInfo, states}, similarDocsChanged, relativeDocsChanged, doublesDocsChanged }) => {
	const saveSettigs = async() => {
		await postQuery(`/setUserFilters`, {
			...settings
		});
	};

	const [nextId, setNextId] = useState('');
	const [arrSkip, setArrSkip] = useState([]);

	// для навигации по истории
	const [docsMarkedUp, setDocsMarkedUp] = useState(0);
	const [docIndex, setDocIndex] = useState(0);
	
	useEffect(() => {
		(async() => {
			setNextId('');
			statesChanged({});
			settingsChanged(null);
			docInfoChanged(null);
			similarDocsChanged(null);
			
			const userFilters = await getQuery(`/getUserFilters`, {});
			settingsChanged(userFilters);
			const docInfo = await getQuery('/getDocInfo', {id: match.params.id});
			docInfoChanged(docInfo);
			const states = await getQuery(`/getStates`, {id: match.params.id});
			statesChanged(states);
			const nextIdDoc = await getQuery(`/getNextDoc`, {id: match.params.id});
			setNextId(nextIdDoc.id);
			const relsId = await getQuery('/getRelativesId', {id: match.params.id});
			relativeDocsChanged(relsId);
			const doublesId = await getQuery('/getDoublesId', {id: match.params.id});
			doublesDocsChanged(doublesId);
			const similarDocs = await postQuery('/getSimilarDocs', {id: match.params.id, title: docInfo.title});
			similarDocsChanged(similarDocs);
		})();
	},[page, match]);

	useEffect(() => {
		let arr = [];
		if (settings.feeds) {
			Object.entries(settings.feeds).map(([key, value]) => {
				if (value) {
					let isInWork = true;
					for (let item in states[key]) {
						if (states[key][item]) {
							isInWork = false;
							break;
						}
					}
					if (isInWork) {
						arr.push(key);
					}
				}
			});
			setArrSkip(arr);
		}
	}, [states, settings]);
	
	const markSkip = async() => {
		await postQuery(`/setSkip`, {
			id: match.params.id,
			feeds: arrSkip
		});
	};

	const backButton = {
		disabled: docIndex === 0,
		onClick: (event) => {
			event.preventDefault();
			if (docIndex > 0) {
				setDocIndex(docIndex - 1);
				window.history.back();
			}
		},
		to: ""
	};

	const forwardButton = (docIndex === docsMarkedUp)
		? {
			disabled: nextId ? false : true,
			onClick: (evt) => {
				if (!nextId) {
					evt.preventDefault();
				} else {
					setDocIndex(docIndex + 1);
					setDocsMarkedUp(docsMarkedUp + 1);
					markSkip();
				}
			},
			to: `/markup/${nextId}`
		} : {
			disabled: false,
			onClick: (evt) => {
				evt.preventDefault();
				setDocIndex(docIndex + 1);
				window.history.forward();
			},
			to: ""
		};

	return (
		<Root>
			<Header page={page} saveSettigs={saveSettigs}/>
			<Content>
				{
					docInfo === null ?
					<Spinner /> :
					docInfo.error ?
					<ErrorDoc>{docInfo.error}</ErrorDoc>	:
					docInfo ?
					<>
					<MainBlock>
						<HeaderBlock>
							<Control
								disabled={backButton.disabled}
								onClick={backButton.onClick}
								to={backButton.to}
							>
								<ArrowForwardIosIcon style={{transform: 'rotateY(180deg)'}} 
									// Иконка ArrowBackIosIcon отличается от ArrowForwardIosIcon 
									// по толщине и криво отображается
								/>
							</Control>
							<DocInfo doc={docInfo} />
							<Control
								disabled={forwardButton.disabled}
								onClick={forwardButton.onClick}
								to={forwardButton.to}
							><ArrowForwardIosIcon /></Control>
						</HeaderBlock>
						<MarkupBlocks>
							<RelMarkup/>
							<RejectMarkup id={match.params.id} />
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
  settingsChanged, docInfoChanged, similarDocsChanged, statesChanged, relativeDocsChanged, doublesDocsChanged
};

export default connect(mapStateToProps, mapDispatchToProps)(Markup);
