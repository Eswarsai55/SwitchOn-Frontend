import _ from "lodash";

export default class Validator {
    static isRequired = value => {
        if (_.isArray(value)) {
            return value.length !== 0;
        }

        if (_.isString(value)) {
            return value.trim().length !== 0;
        }

        if (_.isNull(value) || _.isUndefined(value)) {
            return false;
        }

        return true;
    };

    static isEqual = referenceValue => value => referenceValue === value;

    static matchRegex = regex => value => regex.test(value);

    static hasMinLength = min => value =>
        _.isArray(value) || _.isString(value) ? value.length >= min : false;

    static hasMaxLength = max => value =>
        _.isArray(value) || _.isString(value) ? value.length <= max : false;

    static isWithinLength = (min, max) => value =>
        _.isArray(value) || _.isString(value)
            ? value.length >= min && value.length <= max
            : false;

    static contains = seed => value =>
        _.isArray(value) || _.isString(value) ? value.indexOf(seed) !== -1 : false;

    static isString = value => _.isString(value);

    static isName = value =>
        Validator.matchRegex(
            /^([a-z,A-Z,' '+]+)$/i
        )(value);

    static isEmail = value =>
        Validator.matchRegex(
            /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i
        )(value);

    static isInt = value => _.isInteger(parseInt(value, 10));

    static isPositiveInt = value => Validator.isInt(value) && value > 0;

    static isWithinInt = (min, max) => value =>
        Validator.isInt(value) && value >= min && value <= max;

    static isNumeric = (precision, scale) => value => {
        const highestNumber = 10 ** (precision - scale) - 10 ** -scale;
        return value >= -highestNumber && value <= highestNumber;
    };

    static isPostiveNumeric = (precision, scale) => value =>
        Validator.isNumeric(precision, scale)(value) && value > 0;

    static isWithinNumeric = (precision, scale, min, max) => value =>
        Validator.isNumeric(precision, scale)(value) &&
        value >= min &&
        value <= max;

    static isLowercase = value => Validator.matchRegex(/^[a-z]*$/)(value);

    static isUppercase = value => Validator.matchRegex(/^[A-Z]*$/)(value);

    static isPassword = (
        requireSmallLetter = true,
        requireCapitalLetter = true,
        requireNumber = true,
        requireSpecialCharacter = true
    ) => value => {
        let passwordValidity = true;
        if (requireSmallLetter && passwordValidity) {
            passwordValidity = Validator.matchRegex(/[a-z]+/)(value);
        }
        if (requireCapitalLetter && passwordValidity) {
            passwordValidity = Validator.matchRegex(/[A-Z]+/)(value);
        }
        if (requireNumber && passwordValidity) {
            passwordValidity = Validator.matchRegex(/[0-9]+/)(value);
        }
        if (requireSpecialCharacter && passwordValidity) {
            passwordValidity = Validator.matchRegex(/[!@#$%^&*_]+/)(value);
        }
        return passwordValidity;
    };

    static isPhone = value =>
        Validator.matchRegex(/^\+?([0-9-]){9,}$/)(value);
}
