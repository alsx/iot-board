import "expose?$!expose?jQuery!jquery";
import "expose?React!react";
import "expose?_!lodash";
import helper from "./widgetHelper";
import "file?name=[name].[ext]!./widget.html";
import * as React from "react";
import {ITypeInfo, IWidgetProps} from "../pluginApi/pluginTypes";
import {FrameWidgetInstance} from "./frameWidgetInstance";


let widgetUrl = location.hash.replace(/#/, "");
const appElement = document.getElementById('widget');

let pluginInstance = new FrameWidgetInstance(widgetUrl, appElement);

const pluginApi = {
    registerDatasourcePlugin: () => {
        console.error("Can not register datasource in widget context")
    },
    registerWidgetPlugin: (typeInfo: ITypeInfo, widget: React.ComponentClass<IWidgetProps>) => {
        pluginInstance.initialSetTypeInfo(typeInfo);
        pluginInstance.initialSetWidgetComponent(widget);
    }
};

// TO be robust during tests in node and server side rendering
if (window) {
    (<any>window).iotDashboardApi = pluginApi;
    (<any>window).widgetHelper = helper;
}

