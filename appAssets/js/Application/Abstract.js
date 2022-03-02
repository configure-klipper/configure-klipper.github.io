import Validation from './Validation.js';

/**
 * an abstract file class.
 *
 * @abstract
 */
export default class Abstract{
    /**
     * Holds a validation object that can be used by the class
     * @type {Validation}
     */ 
    validator = new Validation();

    /**
     * if the object has any gui output, this is the id it should append it to
     * @type {string}
     */ 
    parentId = '';

    /**
     * if the object has any gui output, this is the unique id that should be used for it
     * @type {string}
     */ 
    id = '';

    /**
     * Holds the directory path that should be prepended to this.path 
     * @type {string}
     */ 
    dir = '';

    /**
     * Holds the path to the file related to the object instance, it can be just a file name 
     * or a relative path to this.dir 
     * @type {string}
     */ 
    path = '';

    /**
     * a generalized variable to hold the content of the file or files the instance represents.
     * @type {string|object|array}
     */ 
    contents = '';

    /**
     * The constructors does what you think it does.
     * 
     * @param {string} parentId - the parent gui element id for this object instance
     * @param {string} id - the gui element id for this object instance
     * @param {string} dir - the directory path that should be prepended to this.path 
     * @param {string} path - the path to the file related to the object instance
     */ 
    constructor(parentId = '', id = '', dir = '', path = ''){
        if(!this.validator.isHtmlSafe(parentId)){
                throw new TypeError('parentId is not valid');
        }

        if(!this.validator.isHtmlSafe(id)){
                throw new TypeError('id is not valid');
        }

        if(!this.validator.isRealtiveDirectory(dir)){
                throw new TypeError('dir is not valid');
        }

        if(!this.validator.isFilePath(path)){
            throw new TypeError('path is not valid');
        }

        this.parentId = parentId;
        this.id = id; 
        this.dir = dir;
        this.path = path;
    }

    /**
     * The method doesn't do anything and needs to be overridden by sub classes.
     * This method should be used to load and valiadte   
     */ 
    async load(){
        return;
    }

    /**
     * The method doesn't do anything and needs to be overridden by sub classes.
     * This method should be used to interact with the end users and do something useful  
     */ 
    async run(){
        return;
    }

    /**
     * handles asynchronously loading files. 
     *
     * @param {string} url - the url of the file to load
     * @param {boolean} json - is the response json
     */ 
    async loadFile(url, json = false){
        let response = await fetch(url);

        if(response.status != 200){
            throw new Error('None 200 response for : ' + url);
        }

        let result = await response.text();

        if(json){
            try{
               return JSON.parse(result); 
            }catch(e){
                throw new SyntaxError('Failed to json decode : ' + url);
            }
        }else{
            return result;
        }
    }
}