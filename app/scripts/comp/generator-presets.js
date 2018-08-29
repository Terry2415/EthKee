const AppSettingsModel = require('../models/app-settings-model');
const Locale = require('../util/locale');

const GeneratorPresets = {
    get defaultPreset() {
        return { name: 'Default', title: Locale.genPresetDefault,
            length: 16, upper: true, lower: true, digits: true };
    },

    get builtIn() {
        return [
            this.defaultPreset,
            { name: 'Pronounceable', title: Locale.genPresetPronounceable,
                length: 10, lower: true, upper: true },
            { name: 'Med', title: Locale.genPresetMed,
                length: 16, upper: true, lower: true, digits: true, special: true, brackets: true, ambiguous: true },
            { name: 'Long', title: Locale.genPresetLong,
                length: 32, upper: true, lower: true, digits: true },
            { name: 'Pin4', title: Locale.genPresetPin4,
                length: 4, digits: true },
            { name: 'Mac', title: Locale.genPresetMac,
                length: 17, upper: true, digits: true, special: true },
            { name: 'Hash128', title: Locale.genPresetHash128,
                length: 32, lower: true, digits: true },
            { name: 'Hash256', title: Locale.genPresetHash256,
                length: 64, lower: true, digits: true }
        ];
    },

    get all() {
        let presets = this.builtIn;
        presets.forEach(preset => { preset.builtIn = true; });
        const setting = AppSettingsModel.instance.get('generatorPresets');
        if (setting) {
            if (setting.user) {
                presets = presets.concat(setting.user.map(_.clone));
            }
            let hasDefault = false;
            presets.forEach(preset => {
                if (setting.disabled && setting.disabled[preset.name]) {
                    preset.disabled = true;
                }
                if (setting.default === preset.name) {
                    hasDefault = true;
                    preset.default = true;
                }
            });
            if (!hasDefault) {
                presets[0].default = true;
            }
        }
        return presets;
    },

    get enabled() {
        const allPresets = this.all.filter(preset => !preset.disabled);
        if (!allPresets.length) {
            allPresets.push(this.defaultPreset);
        }
        return allPresets;
    },

    getOrCreateSetting() {
        let setting = AppSettingsModel.instance.get('generatorPresets');
        if (!setting) {
            setting = { user: [] };
        }
        return setting;
    },

    add(preset) {
        const setting = this.getOrCreateSetting();
        if (preset.name && !setting.user.filter(p => p.name === preset.name).length) {
            setting.user.push(preset);
            this.save(setting);
        }
    },

    remove(name) {
        const setting = this.getOrCreateSetting();
        setting.user = setting.user.filter(p => p.name !== name);
        this.save(setting);
    },

    setPreset(name, props) {
        const setting = this.getOrCreateSetting();
        const preset = setting.user.filter(p => p.name === name)[0];
        if (preset) {
            _.extend(preset, props);
            this.save(setting);
        }
    },

    setDisabled(name, disabled) {
        const setting = this.getOrCreateSetting();
        if (disabled) {
            if (!setting.disabled) {
                setting.disabled = {};
            }
            setting.disabled[name] = true;
        } else {
            if (setting.disabled) {
                delete setting.disabled[name];
            }
        }
        this.save(setting);
    },

    setDefault(name) {
        const setting = this.getOrCreateSetting();
        if (name) {
            setting.default = name;
        } else {
            delete setting.default;
        }
        this.save(setting);
    },

    save: function(setting) {
        AppSettingsModel.instance.unset('generatorPresets', { silent: true });
        AppSettingsModel.instance.set('generatorPresets', setting);
    }
};

module.exports = GeneratorPresets;
