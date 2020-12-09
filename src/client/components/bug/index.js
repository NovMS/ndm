import React from 'react';
import { Provider } from 'react-redux';
import Bug from './component/Bug'
import BugStore from './store'

const Main = () => {
    return(
        <Provider store={BugStore}>
            <Bug/>
        </Provider>
    )
}

export default Main