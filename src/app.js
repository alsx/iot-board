import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as Redux from 'redux';
import {Provider} from 'react-redux'
import {reducer as formReducer} from 'redux-form';
import Layout from './pageLayout'
import {valuesOf} from './util/collection'
import * as Persist from './persistence'
import 'semantic-ui-css/semantic.css';
import 'semantic-ui-css/semantic';
import 'c3css';
import createLogger from 'redux-logger';
import thunk from 'redux-thunk'
import * as Widgets from './widgets/widgets'
import * as WidgetConfig from './widgets/widgetConfig'
import * as Layouts from './layouts/layouts'
import * as Datasource from './datasource/datasource'
import {DASHBOARD_IMPORT} from './actionNames'
import WidgetPlugins from './widgets/widgetPlugins'
import * as TextWidget from './widgets/plugins/textWidget'
import * as ChartWidget from './widgets/plugins/chartWidget'
import * as DatasourceWorker from './datasource/datasourceWorker'
import DatasourcePlugins from './datasource/datasourcePlugins'
import * as RandomDatasource from './datasource/plugins/randomDatasource'
import * as TimeDatasource from './datasource/plugins/timeDatasource'

WidgetPlugins.register(TextWidget);
WidgetPlugins.register(ChartWidget);


DatasourcePlugins.register(RandomDatasource);
DatasourcePlugins.register(TimeDatasource);


function importReducerFactory(baseReducer:Function, name) {
    return importReducer.bind(this, baseReducer, name);
}

function importReducer(baseReducer:Function, name, state, action) {
    switch (action.type) {
        case DASHBOARD_IMPORT:
            return action.state[name];
        default:
            return baseReducer(state, action);
    }
}

let reducer = Redux.combineReducers({
    widgets: importReducerFactory(Widgets.widgets, "widgets"),
    widgetConfig: WidgetConfig.widgetConfigDialog,
    layouts: Layouts.layouts,
    currentLayout: Layouts.currentLayout,
    datasources: importReducerFactory(Datasource.datasources, "datasources"),
    form: formReducer
});


const logger = createLogger({
    duration: false, // Print the duration of each action?
    timestamp: true, // Print the timestamp with each action?
    logErrors: true, // Should the logger catch, log, and re-throw errors?
    predicate: (getState, action) => {
        if (action.doNotLog) {
            return false;
        }
        return true;
    }
});
let store = Redux.createStore(
    reducer,
    Persist.loadFromLocalStorage(),
    Redux.applyMiddleware(
        thunk,
        Persist.persistenceMiddleware,
        logger // must be last
    ));

const state = store.getState();
cleanupState();

function cleanupState() {
    valuesOf(state.widgets).forEach((widgetState) => {
        let widgetPlugin = WidgetPlugins.getPlugin(widgetState.type);
        if (!widgetPlugin) {
            console.error("No WidgetPlugin for type '" + widgetState.type + "'! Deleting the widget.");
            store.dispatch(Widgets.deleteWidget(widgetState.id));
            return null;
        }
    });
}

DatasourceWorker.initializeWorkers(store.getState().datasources, store.dispatch);


let element = document.getElementById('app');

if (element) {
    ReactDOM.render(
        <Provider store={store}>
            <Layout/>
        </Provider>,
        element);
}
else {
    console.warn("Can not get element '#app' from DOM. Okay for headless execution.");
}
