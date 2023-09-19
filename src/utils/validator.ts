class Validate {
    data: any;
    private validation = true;

    constructor(data: any) {
        this.data = data;
    }

    isNumber = (): Validate => {
        if (typeof this.data !== 'number' || isNaN(this.data)) {
            this.validation = false;
        }

        return this;
    }

    isString = (): Validate => {
        if (typeof this.data !== 'string') {
            this.validation = false;
        }

        return this;
    }

    isArray = (): Validate => {
        if (!Array.isArray(this.data)) {
            this.validation = false;
        }

        return this;
    }

    isObject = (): Validate => {
        if (typeof this.data !== 'object') {
            this.validation = false;
        }

        return this;
    }

    isNotNull = (): Validate => {
        if (this.data === null) {
            this.validation = false;
        }

        return this;
    }

    isNull = (): Validate => {
        if (this.data !== null) {
            this.validation = false;
        }

        return this;
    }

    testRegExp = (regExp: RegExp): Validate => { // 정규표현식 체크
        if (!this.validation) {
            return this;
        }

        this.validation = regExp.test(this.data);

        return this;
    }

    length = (min = -Infinity, max = Infinity): Validate => {
        if (!this.validation) {
            return this;
        }

        if (this.data.length < min || this.data.length > max) {
            this.validation = false;
        }

        return this;
    }

    range = (min = -Infinity, max = Infinity): Validate => {
        if (!this.validation) {
            return this;
        }

        if (this.data < min || this.data > max) {
            this.validation = false;
        }

        return this;
    }

    includes = (exists: Array<any>): Validate => {
        if (!this.validation) {
            return this;
        }

        if (!Array.isArray(exists)) {
            this.validation = false;
            return this;
        }

        if (!exists.includes(this.data)) {
            this.validation = false;
        }

        return this;
    }

    end = (): boolean => {
        return this.validation;
    }
}

export default (data: any): Validate => {
    return new Validate(data);
}
