/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/**
 * Rules for action names
 * ------------------------
 * (many of them are not applied but try to follow them in future)
 *
 * - Try to name Action after what happened not what should happen
 * -- i.e. "STARTED_LOADING_PLUGIN" rather than "START_LOADING_PLUGIN"
 */

export const CLEAR_STATE = "CLEAR_STATE";

// Config
export const SET_CONFIG_VALUE = "SET_CONFIG_VALUE";

// Dashboard
export const DASHBOARD_IMPORT = "DASHBOARD_IMPORT";
export const SET_READONLY = "SET_READONLY";

// Layouts
export const ADD_LAYOUT = "ADD_LAYOUT";
export const UPDATE_LAYOUT = "UPDATE_LAYOUT";
export const DELETE_LAYOUT = "DELETE_LAYOUT";
export const LOAD_LAYOUT = "LOAD_LAYOUT";
export const SET_CURRENT_LAYOUT = "SET_CURRENT_LAYOUT";

// Widgets
export const ADD_WIDGET = "ADD_WIDGET";
export const UPDATE_WIDGET_SETTINGS = "UPDATE_WIDGET_SETTINGS";
export const UPDATED_SINGLE_WIDGET_SETTING = "UPDATED_SINGLE_WIDGET_SETTING";
export const DELETE_WIDGET = "DELETE_WIDGET";
export const UPDATE_WIDGET_LAYOUT = "UPDATE_WIDGET_LAYOUT";

export const START_CREATE_WIDGET = "START_CREATE_WIDGET";
export const START_CONFIGURE_WIDGET = "START_CONFIGURE_WIDGET";

// Datasources
export const ADD_DATASOURCE = "ADD_DATASOURCE";
export const UPDATE_DATASOURCE = "UPDATE_DATASOURCE";
export const DELETE_DATASOURCE = "DELETE_DATASOURCE";

export const DATASOURCE_FINISHED_LOADING = "DATASOURCE_FINISHED_LOADING";

// Datasource data
export const FETCHED_DATASOURCE_DATA = "FETCHED_DATASOURCE_DATA";
export const CLEAR_DATASOURCE_DATA = "CLEAR_DATASOURCE_DATA";

// Plugins
export const WIDGET_PLUGIN_FINISHED_LOADING = "WIDGET_PLUGIN_FINISHED_LOADING";
export const PLUGIN_FAILED_LOADING = "PLUGIN_FAILED_LOADING";
export const DATASOURCE_PLUGIN_FINISHED_LOADING = "DATASOURCE_PLUGIN_FINISHED_LOADING";
export const DELETE_WIDGET_PLUGIN = "DELETE_WIDGET_PLUGIN";
export const DELETE_DATASOURCE_PLUGIN = "DELETE_DATASOURCE_PLUGIN";
export const USE_PUBLISHED_DATASOURCE_PLUGIN = "USE_PUBLISHED_DATASOURCE_PLUGIN";
export const USE_PUBLISHED_WIDGET_PLUGIN = "USE_PUBLISHED_WIDGET_PLUGIN";
export const STARTED_LOADING_PLUGIN_FROM_URL = "STARTED_LOADING_PLUGIN_FROM_URL";

// Modal
export const SHOW_MODAL = "SHOW_MODAL";
export const HIDE_MODAL = "HIDE_MODAL";
export const MODAL_ADD_USER_MESSAGE = "MODAL_ADD_USER_MESSAGE";
export const MODAL_DELETED_USER_MESSAGE = "MODAL_DELETED_USER_MESSAGE";

