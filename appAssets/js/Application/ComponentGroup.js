import Validation from './Validation.js';
import Component from './Component.js';

/**
 * The component group class organizes and aides working with components 
 *
 */
export default class ComponentGroup{
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
     * Holds the unique html id that should be used to generate the qui for the component group 
     * @type {string}
     */ 
    id = '';

    /**
     * Holds the name of the component group
     * @type {string}
     */ 
    name = '';

    /**
     * Holds a short description of the component group  
     * @type {string}
     */ 
    description = '';

    /**
     *  an array of components associated with the group
     * @type {array}
     */ 
    components = [];

    /**
     * The constructors does what you think it does.
     * 
     * @param {string} dir - The directory that will be passed to the components
     * @param {string} parentId - the parent gui element for this object instance
     * @param {string} id - the unique html id for the component group
     * @param {object} componentGroup - the details of the group, and its components as 
     * pulled from components.json 
     */ 
    constructor(dir = '', parentId = '', id = '', componentGroup = {}){
        // no need to validate dir as it will only be passed to components and they will validate it

        if (!this.validator.isHtmlSafe(parentId)){
            throw new TypeError('parentId is not valid');
        }

        if (!this.validator.isHtmlSafe(id)){
            throw new TypeError('id is not valid');
        }

        let props = {'name':'isHtmlSafe', 'description':'isHtmlSafe', 'components':'nonEmptyArrayOfObjects'};
        if(!this.validator.objectwithPropertiesOfType(componentGroup, props)){
            throw new TypeError('The component group with Id = ' + id + ' is not valid');
        }

        this.parentId = parentId;
        this.id = id;
        this.name = componentGroup.name;
        this.description = componentGroup.description;

        // instantiate all the components in the group
        for (var i = 0; i < componentGroup.components.length; i++){
            let componentId = id + '-' + i;
            this.components.push(new Component(dir, id, componentId, componentGroup.components[i]));
        } 
    }

    /**
     * determines if the component groups should generate any html output 
     * 
     * @returns {boolean} true if output should be generated, false otherwise
     */ 
    hasGuiOutput(){
        for (var i = 0; i < this.components.length; i++){
            if (this.components[i].required == false){
                return true;
            }
        } 

        return false;
    }

    /**
     * handles generating HTML gui output for the group 
     */ 
    run(){
        if(this.hasGuiOutput()){

            let group = document.createElement('div'); 
            group.classList.add('componentGroup');
            group.id = this.id;

            let groupLabel = document.createElement('div');
            groupLabel.classList.add('componentGroupLabel');
            groupLabel.innerHTML = this.name + ':';
            group.appendChild(groupLabel);  

            let groupDescription = document.createElement('div');
            groupDescription.classList.add('componentGroupDescription');
            groupDescription.innerHTML = this.description;
            group.appendChild(groupDescription);

            document.getElementById(this.parentId).appendChild(group);  

            for (var i = 0; i < this.components.length; i++){
                this.components[i].run();
            }
        } 
    }

    /**
     * makes all the components in the group disable their input so the user can't change them. 
     */ 
    disable(){
        for (var i = 0; i < this.components.length; i++){
            this.components[i].disable();
        }
    }
}