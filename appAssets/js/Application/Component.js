import Abstract from './Abstract.js';

/**
 * The component class handles loading and processing standard text 
 * template files. 
 *
 */
export default class Component extends Abstract{
    /**
     * Holds the name of the component 
     * @type {string}
     */ 
    name = '';

    /**
     * Holds a short description of the component  
     * @type {string}
     */ 
    description = '';

    /**
     * Holds a flag indicating if the component is required. If true, the component
     * will automatically be included in the output of the application, and 
     * it will not be visible in the gui.      
     * @type {boolean}
     */ 
    required = false;

    /**
     * Holds a flag indicating if the component needs to be templated or not    
     * @type {boolean}
     */ 
    template = true;

    /**
     * The constructors does what you think it does.
     * 
     * @param {string} dir - the directory path that should be prepended to this.path 
     * @param {string} parentId - the parent gui element id for this object instance
     * @param {string} id - the gui element id for this object instance
     * @param {object} settings - the settings unique to this file.
     */ 
    constructor(dir = '', parentId = '', id = '', settings = {}){
        super(parentId, id, dir, 'dummyPath.cfg');

        let props = {'path':'isFilePath', 'name':'isHtmlSafe', 'description':'isHtmlSafe', 'required':'boolean', 'template':'boolean'};
        if(!this.validator.objectwithPropertiesOfType(settings, props)){
            let msg = 'component ' + id + ' is missing or has invalid properties'; 
            throw new TypeError(msg);
        }

        this.path = settings.path
        this.name = settings.name;
        this.description = settings.description;
        this.required = settings.required; 
        this.template = settings.template; 
    }

    /**
     * The method loads the file.
     */ 
    async load(){
        this.contents = await this.loadFile(this.dir + this.path);    
    }

    /**
     * handles generating HTML gui output for the component 
     */ 
    run(){
        if(this.required == false){

            let component = document.createElement('div'); 
            component.classList.add('component');

            let checkbox = document.createElement('input');
            checkbox.setAttribute('type', 'checkbox');
            checkbox.id = this.id;
            component.appendChild(checkbox);  

            let label = document.createElement('label');
            label.setAttribute('for', this.id);
            label.innerHTML = this.name;
            component.appendChild(label);  

            let link = document.createElement('a');
            link.classList.add('sLink');
            link.target = '_blank';
            link.title = "source";
            let linkText = document.createTextNode("source");
            link.appendChild(linkText);
            link.href = this.dir + this.path;
            component.appendChild(link); 

            let description = document.createElement('div');
            description.classList.add('componentDescription');
            description.innerHTML = this.description;
            component.appendChild(description); 

            document.getElementById(this.parentId).appendChild(component);
        }
    }

    /**
     * handles disabling the checkbox so the user can't change it while generation is happening
     */ 
    disable(){
        let check = document.getElementById(this.id);
        if (check !== null){
            check.disabled = true;
        }
    }

    /**
     * determines if the component was selected 
     * 
     * @returns {boolean} true if it is false otherwise
     */ 
    isSelected(){
        let checkbox = document.getElementById(this.id);
        if (checkbox !== null  && checkbox.checked){
            return true;
        }

        return false;
    }
}