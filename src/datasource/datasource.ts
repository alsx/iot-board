/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import {genCrudReducer} from "../util/reducer.js";
import * as ActionNames from "../actionNames";
import * as Uuid from "../util/uuid.js";
import * as _ from "lodash";
import * as ModalIds from "../modal/modalDialogIds";
import * as Modal from "../modal/modalDialog.js";
import * as AppState from "../appState";
import {IPersistenceAction} from "../persistence";
import {IDatasourceState} from "../pluginApi/pluginTypes";

const initialDatasources: IDatasourcesState = {
    "initial_random_source": {
        id: "initial_random_source",
        type: "random",
        settings: {
            name: "Random",
            min: 10,
            max: 20,
            maxValues: 20
        },
        data: [],
        isLoading: true,
        replaceData: false
    }
};

export interface IDatasourceAction extends AppState.Action, IPersistenceAction {
    id?: string
    data?: any[]
    settings?: any
    dsType?: string
    maxValues?: number
    isLoading?: boolean
    replaceData?: boolean
}

export interface IDatasourcesState {
    [id: string]: IDatasourceState
}


export function createDatasource(type: string, settings: any, id: string = Uuid.generate()): IDatasourceAction {
    return addDatasource(type, settings, true, id);
}

export function updateDatasource(id: string, type: string, settings: any): AppState.ThunkAction {
    return (dispatch, getState) => {
        const state = getState();

        const dsState = state.datasources[id];
        if (!dsState) {
            throw new Error("Failed to update not existing datasource of type '" + type + "' with id '" + id + "'");
        }
        if (dsState.type !== type) {
            throw new Error("Can not update datasource of type '" + dsState.type + "' with props of type '" + type + "'");
        }
        dispatch(updateDatasourceSettings(id, settings));

    }
}

export function finishedLoading(id: string) {
    return {
        type: ActionNames.DATASOURCE_FINISHED_LOADING,
        id
    };
}

export function addDatasource(dsType: string, settings: any, isLoading: boolean = true, id: string = Uuid.generate()): IDatasourceAction {
    if (!dsType) {
        console.warn("dsType: ", dsType);
        console.warn("settings: ", settings);
        throw new Error("Can not add Datasource without Type");
    }

    return {
        type: ActionNames.ADD_DATASOURCE,
        id,
        dsType,
        settings,
        isLoading
    };
}

export function updateDatasourceSettings(id: string, settings: any): IDatasourceAction {
    // TODO: Working on that copy does not work yet. We need to notify the Datasource about updated settings!
    //let settingsCopy = {...settings};
    return {
        type: ActionNames.UPDATE_DATASOURCE,
        id,
        settings
    }
}

export function startCreateDatasource() {
    return Modal.showModal(ModalIds.DATASOURCE_CONFIG);
}
export function startEditDatasource(id: string): AppState.ThunkAction {
    return function (dispatch, getState) {
        const state = getState();
        const dsState = state.datasources[id];
        dispatch(Modal.showModal(ModalIds.DATASOURCE_CONFIG, {datasource: dsState}));
    }
}

export function deleteDatasource(id: string): IDatasourceAction {
    return {
        type: ActionNames.DELETE_DATASOURCE,
        id
    }
}

export function fetchedDatasourceData(id: string, data: any[]): IDatasourceAction {
    return {
        type: ActionNames.FETCHED_DATASOURCE_DATA,
        id,
        data,
        doNotLog: true,
        doNotPersist: true
    }
}

export function clearData(id: string): IDatasourceAction {
    return {
        type: ActionNames.CLEAR_DATASOURCE_DATA,
        id
    }
}

export function updatedMaxValues(id: string, maxValues: number): IDatasourceAction {
    return {
        type: ActionNames.UPDATED_MAX_VALUES,
        id,
        maxValues
    }
}
export function updatedFetchReplaceData(id: string, replaceData: boolean): IDatasourceAction {
    return {
        type: ActionNames.UPDATED_FETCH_REPLACE_DATA,
        id,
        replaceData
    }
}

const datasourceCrudReducer = genCrudReducer([ActionNames.ADD_DATASOURCE, ActionNames.DELETE_DATASOURCE], datasource);
export function datasources(state: IDatasourcesState = initialDatasources, action: IDatasourceAction): IDatasourcesState {
    state = datasourceCrudReducer(state, action);
    switch (action.type) {
        case ActionNames.DELETE_DATASOURCE_PLUGIN: { // Also delete related datasources
            const toDelete = _.valuesIn<IDatasourceState>(state).filter(dsState => {
                return dsState.type === action.id
            });
            const newState = _.assign({}, state);
            toDelete.forEach(dsState => {
                delete newState[dsState.id];
            });

            return newState;
        }
        case ActionNames.UPDATED_MAX_VALUES: {
            const newState = _.assign({}, state);
            return _.assign({}, state, {
                [action.id]: datasource(newState[action.id], action)
            });
        }
        case ActionNames.UPDATED_FETCH_REPLACE_DATA: {
            const newState = _.assign({}, state);
            return _.assign({}, state, {
                [action.id]: datasource(newState[action.id], action)
            });
        }
        case ActionNames.CLEAR_DATASOURCE_DATA: {
            const newState = _.assign({}, state);
            return _.assign({}, state, {
                [action.id]: datasource(newState[action.id], action)
            });
        }
        default:
            return state;
    }
}

function datasource(state: IDatasourceState, action: IDatasourceAction): IDatasourceState {
    switch (action.type) {
        case ActionNames.ADD_DATASOURCE:
            return {
                id: action.id,
                type: action.dsType,
                settings: action.settings,
                data: [],
                isLoading: true,
                replaceData: false
            };
        case ActionNames.SET_DATASOURCE_DATA:
            return _.assign({}, state, {
                data: action.data || []
            });
        case ActionNames.CLEAR_DATASOURCE_DATA:
            return _.assign({}, state, {
                data: []
            });
        case ActionNames.UPDATED_MAX_VALUES:
            let maxValues = action.maxValues;
            if (maxValues < 1) {
                maxValues = 1;
            }
            return _.assign({}, state, {
                settings: _.assign({}, state.settings, {maxValues: maxValues})
            });
        case ActionNames.FETCHED_DATASOURCE_DATA:
            let newData: any[];
            if (state.replaceData) {
                newData = action.data;
            }
            else {
                newData = _.clone(state.data).concat(action.data);
            }
            if (state.settings.maxValues) {
                newData = _.takeRight(newData, state.settings.maxValues);
            }
            return _.assign({}, state, {
                data: newData
            });
        case ActionNames.UPDATE_DATASOURCE:
            return _.assign({}, state, {
                settings: action.settings
            });
        case ActionNames.DATASOURCE_FINISHED_LOADING: {
            let newState = _.assign({}, state);
            newState.isLoading = false;
            return newState;
        }
        case ActionNames.UPDATED_FETCH_REPLACE_DATA: {
            let newState = _.clone(state);
            newState.replaceData = action.replaceData;
            return newState;
        }
        default:
            return state;
    }
}
