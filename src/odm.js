"use strict";

function JsonOdm () {
    var self = this;
    this.sources = {};
    this.selectedSource = {};
    this.addSource = function (sourceId, source, selectSource) {
        if (typeof source == "object") {
            if (typeof self.sources[sourceId] == "undefined") self.sources[sourceId] = source;
            if(selectSource) self.selectedSource = source;
        }
    };
    this.selectSource = function (sourceId) {
        if(typeof self.sources[sourceId] != "undefined") self.selectedSource = self.sources[sourceId];
    };
}

if(!window.jsonOdm) window.jsonOdm = new JsonOdm();
