import { Typography } from '@material-ui/core';
import React, {useEffect, useState} from 'react';
import styled from 'styled-components';
import ReactMarkdownWithHtml from 'react-markdown/with-html';
import gfm from 'remark-gfm';
import README from '../../../../README.md'

const Root = styled.div`
	max-width: 1000px;
	margin: 0 auto;
	padding: 15px 0;
`;

const Markdown = styled(ReactMarkdownWithHtml)`
	* {
		font-family: "Roboto", "Helvetica", "Arial", sans-serif;
	}
`;

const InfoBlock = () => {
	const [markdown, setMarkdown] = useState(null)
	useEffect(() => {
		(async () => {
			let md = await fetch(README);
			md = await md.text();
			setMarkdown(md)
		})();
	}, [])

	return (
	  <Root>
			<Markdown plugins={[gfm]} children={markdown} allowDangerousHtml />
	  </Root>
  )
}

export default InfoBlock;
