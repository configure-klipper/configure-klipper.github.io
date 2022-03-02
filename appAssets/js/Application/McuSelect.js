import Abstract from './Abstract.js';

/**
 * a class that provides the interface for users to select the mcu they 
 * want to use.
 */
export default class McuSelect extends Abstract{
    /**
     * The constructors does what you think it does.
     * 
     * @param {string} parentId - the parent gui element id for this object instance
     * @param {string} id - the gui element id for this object instance
     * @param {string} dir - the directory path that should be prepended to this.path 
     */ 
    constructor(parentId = '', id = '', dir = ''){
        super(parentId, id, dir, 'mcus.json');
    }

    /**
     * The method loads the json mcu list.
     */ 
    async load(){
        this.contents = await this.loadFile(this.dir + this.path, true);

        if(!this.validator.nonEmptyArrayOfObjects(this.contents)){
            throw new TypeError(this.dir + this.path + ' contains invalid data');
        }

        let props = {'name':'isHtmlSafe', 'path':'isFilePath', 'replacementsPath':'isFilePath', 'template':'boolean'};
        for (var i = 0; i < this.contents.length; i++){
            if(!this.validator.objectwithPropertiesOfType(this.contents[i], props)){
                let msg = 'mcu [' + i + '] in ' + this.dir + this.path;
                msg += ' is missing or has invalid properties'; 
                throw new TypeError(msg);
            }
        }        
    }

    /**
     * The method generates the interface for a user to select what mcu they want to use
     * 
     * @returns {Mcu} an mcu object that's instantiated but not loaded
     */ 
    async run(){

        let mcuSelectSection = document.createElement('div'); 
        mcuSelectSection.id = this.id;
        mcuSelectSection.classList.add('dirSerlector');

        let mcuSelectLabel = document.createElement('label');
        mcuSelectLabel.id = this.id + 'Label';
        mcuSelectLabel.setAttribute('for', this.id + 'Field');
        mcuSelectLabel.innerHTML = 'Mcu:';
        mcuSelectSection.appendChild(mcuSelectLabel);  

        let mcuSelectField = document.createElement('select');
        mcuSelectField.id = this.id + 'Field';
        for (var i = 0; i < this.contents.length; i++){
            let option = document.createElement('option');
            option.value = i;
            option.text = this.contents[i].name;
            mcuSelectField.appendChild(option);
        }
        mcuSelectSection.appendChild(mcuSelectField);

        let mcuSelectButton = document.createElement('button');
        mcuSelectButton.id = this.id + 'Button';
        mcuSelectButton.innerHTML = 'Select';
        mcuSelectSection.appendChild(mcuSelectButton);

        document.getElementById(this.parentId).appendChild(mcuSelectSection);

        // wait for the user to choose and lock stuff down
        await new Promise(r=>mcuSelectButton.addEventListener('click', r, {once:true}));

        let selectedMcuName = mcuSelectField.options[mcuSelectField.selectedIndex].text;
        let selectedMcuId = mcuSelectField.value;

        mcuSelectField.remove();
        mcuSelectButton.remove();

        let mcuSelectName = document.createElement('span');
        mcuSelectName.id = this.id + 'Name';
        mcuSelectName.innerHTML = selectedMcuName;
        mcuSelectSection.appendChild(mcuSelectName);

        // get the fields needed to instantiate the mcu object
        let path = this.contents[selectedMcuId].path;
        let replacementsPath = this.contents[selectedMcuId].replacementsPath;
        let template = this.contents[selectedMcuId].template;
        return {'path':path, 'replacementsPath': replacementsPath, 'template':template};
    }
}