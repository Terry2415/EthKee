const Backbone = require('backbone');
const SettingsStore = require('../comp/settings-store');

const RuntimeDataModel = Backbone.Model.extend({
    defaults: {},

    initialize: function() {
        this.listenTo(this, 'change', this.save);
    },

    load: function() {
        return SettingsStore.load('runtime-data').then(data => {
            if (data) {
                this.set(data, {silent: true});
            }
        });
    },

    save: function() {
        SettingsStore.save('runtime-data', this.attributes);
    }
});

RuntimeDataModel.instance = new RuntimeDataModel();

module.exports = RuntimeDataModel;
