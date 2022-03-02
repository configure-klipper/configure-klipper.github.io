/**
 * A class of validation methods.
 *
 */
export default class Validation{
    /**
     * Checks if a variable is an array
     * 
     * @param {mixed} input - the variable to test.
     * @returns {boolean} is the input an array
     */ 
    isArray(input){
        return input.constructor == Array
    }

    /**
     * Checks if a variable is not an empty array
     * 
     * @param {mixed} input - the variable to test.
     * @returns {boolean} true if input is an array, and isn't empty
     */ 
    nonEmptyArray(input){
        if(this.isArray(input)){
            if (input.length > 0){
                return true;
            }

            return false;
        }

        return false;
    }

    /**
     * Checks if a variable is an object
     * 
     * @param {mixed} input - the variable to test.
     * @returns {boolean} if the input an object
     */ 
    isObject(input){
        if(typeof input === 'object'){
            // is an object
            if(!Array.isArray(input)){
                // isn't an array
                if(input !== null){
                    // isn't null
                    if(typeof {}.getMonth != 'function'){
                        // isn't a date object
                        if(input.constructor != RegExp){
                            // isn't a regex
                            return true;
                        }

                        return false;
                    }

                    return false;
                }

                return false;
            }

            return false;
        }

        return false;
    }

    /**
     * Checks if a variable is an object, and has the given properties
     * 
     * @param {mixed} input - the variable to test.
     * @param {array} properties - the properties the object is required to have. 
     * example - ['name', 'description', 'path']
     * @throws {TypeError} If properties isn't an array
     * @returns {boolean} if the input an object and has the required propertied
     */ 
    objectwithProperties(input, properties){
        if(!this.nonEmptyArray(properties)){
            throw new TypeError('properties is not a nonEmptyArray');
        }

        if(!this.isObject(input)){
            return false;
        }

        for (var i = 0; i < properties.length; i++){
            if(!input.hasOwnProperty(properties[i])){
                return false;
            }
        }

        return true;
    }

    /**
     * Checks if a variable is an array of objects
     * 
     * @param {mixed} input - the variable to test.
     * @returns {boolean} true if input is an array, isn't empty, and only contains objects
     */ 
    nonEmptyArrayOfObjects(input){
        if(!this.nonEmptyArray(input)){
            return false;
        }

        for (var i = 0; i < input.length; i++){
            if(!this.isObject(input[i])){
                return false;
            }
        }

        return true;
    }

    /**
     * Checks if a string is a valid cfg file path 
     * 
     * @param {mixed} input - the variable to test.
     * @throws {TypeError} If input isn't a string
     * @returns {boolean}
     * 
     */ 
    isFilePath(input){
        if(typeof input != 'string'){
            throw new TypeError('input is not a string');
        }

        // the file path can be just a file name or a file name with a relative path

        // the name can contain letters, numbers, none sequential periods, hyphens, and underscores 
        // the name can't start or end with a period, hyphen, or underscore
        
        if(input.includes('..')){
            // no double dots in file paths
            return false;
        }

        if(!input.endsWith('.cfg') && !input.endsWith('.json')){
            return false;
        }

        if(input.endsWith('.cfg')){
            input = input.slice(0, -4); 
        }

        if(input.endsWith('.json')){
            input = input.slice(0, -5);
        }
         
        let filename = input.substring(input.lastIndexOf('/')+1);
        let regex = /^[a-zA-Z0-9]+[a-zA-Z0-9_\-.]*[a-zA-Z0-9]+$/;
        if(!regex.test(filename)){
            return false;
        }

        let path = input.substring(0,input.lastIndexOf('/')+1);
        if (path.length >= 1){
            return this.isRealtiveDirectory(path)
        }else{
            return true;
        }
    }


    /**
     * Checks if a string is a valid relative directory 
     * 
     * @param {mixed} input - the variable to test.
     * @throws {TypeError} If input isn't a string
     * @returns {boolean}
     * 
     */ 
    isRealtiveDirectory(input){
        if(typeof input != 'string'){
            throw new TypeError('input is not a string');
        }

        // the name can contain letters, numbers, none sequential periods, hyphens, and underscores  
        // the name can't start or end with a period, hyphen, or underscore
        // must end with a /

        if(input.includes('..')){
            // no double dots in file paths
            return false;
        }

        let reg = /^(([a-zA-Z0-9]+[a-zA-Z0-9_\-.]*[a-zA-Z0-9]+)\/)+$/;
        return reg.test(input);    
    }

    /**
     * Checks if a string is a valid absolute directory 
     * 
     * @param {mixed} input - the variable to test.
     * @throws {TypeError} If input isn't a string
     * @returns {boolean}
     * 
     */ 
    isAbsoluteDirectory(input){
        if(typeof input != 'string'){
            throw new TypeError('input is not a string');
        }

        // the name can contain letters, numbers, none sequential periods, hyphens, and underscores  
        // the name can't start or end with a period, hyphen, or underscore
        // must end and start with a /

        if(input.includes('..')){
            // no double dots in file paths
            return false;
        }

        let reg = /^\/(([a-zA-Z0-9]+[a-zA-Z0-9_\-.]*[a-zA-Z0-9]+)\/)+$/;
        return reg.test(input);    
    }

    /**
     * Checks if a string is safe to inject into html safe
     * 
     * @param {mixed} input - the variable to test.
     * @throws {TypeError} If input isn't a string
     * @returns {boolean}
     * 
     */ 
    isHtmlSafe(input){
        if(typeof input != 'string'){
            throw new TypeError('input is not a string');
        }

        let reg = /^[^\"><]+$/;
        return reg.test(input);    
    }

    /**
     * Checks if a variable is an object, and has the given properties and that the 
     * properties are of the correct type. 
     * 
     * @param {mixed} input - the variable to test.
     * @param {opject} properties - the properties the object is required to have, 
     * and the type they are required to be. 
     * example - {'name':'string', 'description':'string', 'template':'boolean'}
     * @throws {TypeError} If properties isn't an object, it's empty, or if a validation type is unknown
     * @returns {boolean} if the input an object and has the required propertied
     */ 
    objectwithPropertiesOfType(input, properties){
        if(!this.isObject(properties)){
            throw new TypeError('properties is not an object');
        }

        let names = Object.getOwnPropertyNames(properties);
        if(!this.objectwithProperties(input, names)){
            // a property don't exist
            return false;
        }

        for (var i = 0; i < names.length; i++){
            switch (properties[names[i]]){
                case 'number':
                    if(typeof input[names[i]] != 'number'){
                        return false;
                    }
                    break;
                case 'string':
                    if(typeof input[names[i]] != 'string'){
                        return false;
                    }
                    break;
                case 'boolean':
                    if(typeof input[names[i]] != 'boolean'){
                        return false;
                    }
                    break;
                case 'nonEmptyArray':
                    if(!this.nonEmptyArray(input[names[i]])){
                        return false;
                    }
                    break;
                case 'isObject':
                    if(!this.isObject(input[names[i]])){
                        return false;
                    }
                    break;
                case 'nonEmptyArrayOfObjects':
                    if(!this.nonEmptyArrayOfObjects(input[names[i]])){
                        return false;
                    }
                    break;
                 case 'isFilePath':
                    if(!this.isFilePath(input[names[i]])){
                        return false;
                    }
                    break;
                 case 'isRealtiveDirectory':
                    if(!this.isRealtiveDirectory(input[names[i]])){
                        return false;
                    }
                    break;
                 case 'isAbsoluteDirectory':
                    if(!this.isAbsoluteDirectory(input[names[i]])){
                        return false;
                    }
                    break;
                 case 'isHtmlSafe':
                    if(!this.isHtmlSafe(input[names[i]])){
                        return false;
                    }
                    break;

                default:
                    throw new TypeError(properties[names[i]] + ' is not a known type');
            }
        }

        return true;
    }
}