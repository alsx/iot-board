/* This Source Code Form is subject to the terms of the Mozilla Public
* License, v. 2.0. If a copy of the MPL was not distributed with this
* file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import * as Redux from 'redux'
import * as Datasource from './datasource/datasource'
import * as DatasourceData from './datasource/datasourceData'
import * as Widgets from './widgets/widgets'
import * as DatasourcePlugins from './datasource/datasourcePlugins'
import * as Config from './config'
import * as Plugins from './pluginApi/pluginLoader'
import {IWidgetPluginsState} from "./widgets/widgetPlugins";
import {IModalDialogState} from "./modal/modalDialog.ui";

export type Dispatch = (action: any) => any
export type GetState = () => State
export type ThunkAction = Redux.ThunkAction<any, State, any>
export interface Action extends Redux.Action {
    doNotLog?: boolean
}
export type AnyAction = ThunkAction | Action
export type Reducer = Redux.Reducer<State>

export interface State {
    config: Config.IConfigState
    widgets: Widgets.IWidgetsState
    datasources: Datasource.IDatasourcesState
    datasourceData: DatasourceData.IDatasourceDataState
    datasourcePlugins: DatasourcePlugins.IDatasourcePluginsState
    widgetPlugins: IWidgetPluginsState
    pluginLoader: Plugins.IPluginLoaderState
    global: IGlobalState
    form: any,
    modalDialog: IModalDialogState
}

// TODO: move to dashboard/global when converted to ts
export interface IGlobalState {
    isReadOnly: boolean
}

export default State;
