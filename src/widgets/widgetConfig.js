import * as Widgets from "./widgets";
import {START_CREATE_WIDGET, START_CONFIGURE_WIDGET} from "../actionNames";
import * as Modal from "../modal/modalDialog";
import * as ModalIds from "../modal/modalDialogIds";

const initialState = {
    type: null,
    name: null,
    props: {}
};

/**
 * Triggered when the user intends to create a widget of a certain type
 */
export function createWidget(type) {
    return (dispatch, getState) => {
        const state = getState();
        const widgetPlugin = state.widgetPlugins[type];
        if (!widgetPlugin.typeInfo.settings && widgetPlugin.typeInfo.settings.length > 0) {
            dispatch(Widgets.addWidget(type));
            return;
        }
        dispatch(openWidgetCreateDialog(type));
    }
}

/**
 * Creates or updates an actual widget
 */
export function createOrUpdateWidget(id, type, props) {
    return (dispatch, getState) => {
        const state = getState();

        const widget = state.widgets[id];

        if (widget && widget.type !== type) {
            throw new Error("Can not update widget of type " + widget.type + " with props of type " + type);
        }
        if (widget) {
            dispatch(Widgets.updateWidgetProps(id, props));
        }
        else {
            dispatch(Widgets.addWidget(type, props));
        }
    }
}

export function openWidgetCreateDialog(type) {
    return (dispatch) => {
        dispatch({
            type: START_CREATE_WIDGET,
            widgetType: type
        });
        dispatch(Modal.showModal(ModalIds.WIDGET_CONFIG));
    }
}

/**
 * Open the dialog with the settings and values of the given widget
 */
export function openWidgetConfigDialog(id) {
    return (dispatch, getState) => {
        const state = getState();
        const widget = state.widgets[id];
        dispatch({
            type: START_CONFIGURE_WIDGET,
            widget: widget
        });
        dispatch(Modal.showModal(ModalIds.WIDGET_CONFIG));
    }
}

export function widgetConfigDialog(state = initialState, action) {
    switch (action.type) {
        case START_CREATE_WIDGET:
            return {
                ...state,
                type: action.widgetType,
                id: null,
                name: action.widgetType,
                props: {}
            };
        case START_CONFIGURE_WIDGET:
            return {
                ...state,
                type: action.widget.type,
                id: action.widget.id,
                name: action.widget.name,
                props: action.widget.props
            };
        default:
            return state;
    }
}