export default {
    generate(name, key, values, variation = []) {
        let
            i = 0,
            j = 0,
            styles = {},
            value = '',
            styleName = '',
            valueName = '',
            keyName = '',
            keys = '',
            keyStyleName = '';

        const
            styleValues = this.parseThemeValues(values),
            valuesLength = styleValues.length,
            variationLength = variation.length;


        for (; i < valuesLength; ++i) {
            value = this.getValue(styleValues[i]);
            valueName = this.getValueName(styleValues[i]);
            keyName = this.getKeyName(name, valueName);

            styleName = this.translateKeys(keyName);

            if (this.guardAgainstCssNotSupportedInReactNative(key, this.translateValues(value))) {
                styles[styleName] = this.guardedKeyHandler(key, value);

                continue;
            }

            styles[styleName] = this.multipleKeyHandler(key, value);
        }

        if (variationLength) {
            j = 0;
            value = '';
            styleName = '';
            valueName = '';
            keyName = '';
            keyStyleName = '';

            for (; j < variationLength; ++j) {
                i = 0;
                keyName = `${name}-${variation[j][0]}`;
                keys = variation[j][1];

                for (; i < valuesLength; ++i) {
                    value = this.getValue(styleValues[i]);
                    valueName = this.getValueName(styleValues[i]);
                    keyStyleName = this.getKeyName(keyName, valueName);

                    styleName = this.translateKeys(keyStyleName);

                    if (this.guardAgainstCssNotSupportedInReactNative(keys, this.translateValues(value))) {
                        styles[styleName] = this.guardedKeyHandler(keys, value);

                        continue;
                    }

                    styles[styleName] = this.multipleKeyHandler(keys, value);
                }
            }
        }

        return styles
    },

    generateShadows(name, key, values) {
        let
            i = 0,
            styles = {},
            value = '',
            styleName = '',
            valueName = '',
            keyName = '',
            shadowValues = {};

        const
            styleValues = this.parseThemeValues(values),
            valuesLength = styleValues.length;

        for (; i < valuesLength; ++i) {
            value = this.getValue(styleValues[i]);
            valueName = this.getValueName(styleValues[i]);
            keyName = this.getKeyName(name, valueName);
            shadowValues = this.getShadowValues(value);

            styleName = this.translateKeys(keyName);
            styles[styleName] = {};

            styles[styleName][`${key}Color`] = shadowValues.color;
            styles[styleName][`${key}Offset`] = shadowValues.offset;
            styles[styleName][`${key}Radius`] = shadowValues.radius;

            if (key === 'shadow') {
                styles[styleName][`${key}Opacity`] = shadowValues.opacity;
                styles[styleName]['elevation'] = shadowValues.elevation;
            }
        }

        return styles
    },

    generateNegatives(name, key, values, variation = []) {
        let
            i = 0,
            j = 0,
            styles = {},
            value = '',
            styleName = '',
            valueName = '',
            keyName = '',
            keys = '',
            keyStyleName = '';

        const
            styleValues = this.parseThemeValues(values),
            valuesLength = styleValues.length,
            variationLength = variation.length;


        for (; i < valuesLength; ++i) {
            value = this.getValue(styleValues[i]);
            valueName = this.getValueName(styleValues[i]);
            keyName = this.getKeyName(name, valueName);

            styleName = this.translateKeys(keyName);

            if (this.guardAgainstCssNotSupportedInReactNative(key, this.translateValues(value))) {
                styles[styleName] = this.guardedKeyHandler(key, `-${value}`);

                continue;
            }

            styles[styleName] = this.multipleKeyHandler(key, `-${value}`);
        }

        if (variationLength) {
            j = 0;
            value = '';
            styleName = '';
            valueName = '';
            keyName = '';
            keyStyleName = '';

            for (; j < variationLength; ++j) {
                i = 0;
                keyName = `${name}-${variation[j][0]}`;
                keys = variation[j][1];

                for (; i < valuesLength; ++i) {
                    value = this.getValue(styleValues[i]);
                    valueName = this.getValueName(styleValues[i]);
                    keyStyleName = this.getKeyName(keyName, valueName);

                    styleName = this.translateKeys(keyStyleName);

                    if (this.guardAgainstCssNotSupportedInReactNative(keys, this.translateValues(value))) {
                        styles[styleName] = this.guardedKeyHandler(keys, `-${value}`);

                        continue;
                    }

                    styles[styleName] = this.multipleKeyHandler(keys, `-${value}`);
                }
            }
        }

        return styles
    },

    getValue(value) {
        let valueToReturn = value;

        if (typeof value === 'object') {
            valueToReturn = value[1];
        }

        if (typeof valueToReturn === 'object') {
            valueToReturn = valueToReturn[0];
        }

        return valueToReturn
    },

    getValueName(value) {
        if (typeof value === 'object') {
            return value[0];
        }

        return value
    },

    getKeyName(name, valueName) {
        let keyName = valueName;

        if (name !== '') {
            keyName = `${name}-${valueName}`;
        }

        return keyName
    },

    multipleKeyHandler(keys, value) {
        let i = 0, tempObject = {};
        const keysLength = keys.length;

        if (typeof keys === 'object') {
            for (; i < keysLength; ++i) {
                tempObject[keys[i]] = this.translateValues(value);
            }

            return tempObject;
        }

        tempObject[keys] = this.translateValues(value);

        return tempObject;
    },

    guardAgainstCssNotSupportedInReactNative(property, value) {
        if (property === 'zIndex' && typeof value !== 'number') {
            return true;
        }

        if (property === 'fontWeight' && typeof value === 'number') {
            return true;
        }

        return false;
    },

    guardedKeyHandler(property, value) {
        let tempObject = {};

        if (property === 'zIndex' && typeof value !== 'number') {
            tempObject[property] = 0
        }

        if (property === 'fontWeight') {
            tempObject[property] = `${value}`
        }

        return tempObject;
    },

    translateKeys(name, prefix = '') {
        let translatedKey = name;

        if (typeof name !== 'string') {
            return translatedKey
        }

        if (translatedKey.search('default') !== -1) {
            translatedKey = `${prefix}${translatedKey.replace('-default', '')}`;
        }

        if (translatedKey.search(/\//) !== -1) {
            translatedKey = `${prefix}${translatedKey.replace('/', '_')}`;
        }

        if (translatedKey.search('-') !== -1) {
            translatedKey = translatedKey.replace(/-([a-z])/g, (result) => {
                return result[1].toUpperCase()
            })
        }

        if (translatedKey.search(/^[0-9]+$/g) !== -1) {
            translatedKey = `${prefix}${translatedKey}`
        }

        if (translatedKey.search(/^-[0-9]/) !== -1) {
            translatedKey = `${prefix}${translatedKey.replace('-', '_')}`
        }

        if (translatedKey.search(/^[a-zA-Z]+-[0-9]/) !== -1) {
            translatedKey = `${prefix}${translatedKey.replace('-', '')}`;
        }


        if (prefix !== '' && translatedKey.search(prefix) === -1) {
            translatedKey = translatedKey.replace(/^([a-z])/g, (result) => {
                return result.toUpperCase()
            });

            translatedKey = `${prefix}${translatedKey}`
        }

        return translatedKey
    },

    translateValues(content) {
        let translatedValue = content;

        if (translatedValue === 'transparent') {
            return 'rgba(0,0,0,0)'
        }

        if (typeof translatedValue !== 'string') {
            return translatedValue
        }

        if (content.search(/^-?[0-9]*(\.[0-9]+)?px$/) !== -1) {
            translatedValue = content.replace('px', '');

            return parseInt(translatedValue)
        }

        if (content.search(/^-?[0-9]*(\.[0-9]+)?rem$/) !== -1) {
            translatedValue = content.replace('rem', '');

            translatedValue = parseFloat(translatedValue) * 16;

            return Math.round(translatedValue)
        }

        if (content.search(/^-?[0-9]*(\.[0-9]+)?em$/) !== -1) {
            translatedValue = content.replace('em', '');

            translatedValue = parseFloat(translatedValue) * 16;

            return Math.round(translatedValue)
        }

        if (content.search(/^-?[0-9]+$/) !== -1) {
            return parseInt(translatedValue)
        }

        if (content.search(/-?\.[0-9]+$/) !== -1) {
            return parseFloat(translatedValue)
        }

        return translatedValue
    },

    getShadowValues(content) {
        let results, color, elevation;

        if (content === 'none' || content.search(/inset/) !== -1) {
            return {
                color: 'rgba(0,0,0,0)',
                offset: {width: 0, height: 0},
                radius: 0,
                opacity: 0,
                elevation: 0,
            }
        }

        results = content.match(/^([0-9]+)p?x?\s([0-9]+)p?x?\s([0-9]+)p?x?\s(-?[0-9]+)?p?x?\s?(rgba?\(.+?\))?(#[a-zA-Z0-9]{3,8})?/);

        elevation = content.match(/,(?:\s+)?(-?[0-9]+)$/);

        color = results[5];

        elevation = elevation ? this.translateValues(elevation[1]) : this.translateValues(results[3]) / 2;

        if (typeof color === 'undefined') {
            color = results[6]
        }

        return {
            color: color,
            offset: {
                width: this.translateValues(results[1]),
                height: this.translateValues(results[2])
            },
            radius: this.translateValues(results[3]),
            opacity: 1,
            elevation: elevation,
        }
    },

    parseThemeValues(values) {
        if (typeof values === 'object' && !Array.isArray(values)) {
            return this.toArray(values)
        }

        return values;
    },

    toArray(object) {
        return Object.keys(object).map(value => {
            return [value, object[value]];
        });
    },

};
