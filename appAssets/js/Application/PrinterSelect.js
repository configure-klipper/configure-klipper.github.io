import Abstract from './Abstract.js';

/**
 * a class that provides the interface for users to select the printer they 
 * want to configure.
 */
export default class PrinterSelect extends Abstract{
    /**
     * The constructors does what you think it does.
     * 
     * @param {string} parentId - the parent gui element id for this object instance
     * @param {string} id - the gui element id for this object instance
     * @param {string} dir - the directory path that should be prepended to this.path 
     */ 
    constructor(parentId = '', id = '', dir = ''){
        super(parentId, id, dir, 'printers.json');
    }

    /**
     * The method loads and validates the json printer list.
     */ 
    async load(){
        this.contents = await this.loadFile(this.dir + this.path, true);

        if(!this.validator.nonEmptyArrayOfObjects(this.contents)){
            throw new TypeError(this.dir + this.path + ' contains invalid data');
        }

        let props = {'name':'isHtmlSafe', 'path':'isRealtiveDirectory'};
        for (var i = 0; i < this.contents.length; i++){
            if(!this.validator.objectwithPropertiesOfType(this.contents[i], props)){
                let msg = 'printer [' + i + '] in ' + this.dir + this.path;
                msg += ' is missing or has invalid properties'; 
                throw new TypeError(msg);
            }
        }        
    }

    /**
     * The method generates the interface for a user to select what printer they want to configure
     * 
     * @returns {string} the path to the printer to configure
     */ 
    async run(){

        let printerSelectSection = document.createElement('div'); 
        printerSelectSection.id = this.id;
        printerSelectSection.classList.add('dirSerlector');

        let printerSelectLabel = document.createElement('label');
        printerSelectLabel.id = this.id + 'Label';
        printerSelectLabel.setAttribute('for', this.id + 'Field');
        printerSelectLabel.innerHTML = 'Printer:';
        printerSelectSection.appendChild(printerSelectLabel);  

        let printerSelectField = document.createElement('select');
        printerSelectField.id = this.id + 'Field';
        for (var i = 0; i < this.contents.length; i++){
            let option = document.createElement('option');
            option.value = this.contents[i].path;
            option.text = this.contents[i].name;
            printerSelectField.appendChild(option);
        }
        printerSelectSection.appendChild(printerSelectField);

        let printerSelectButton = document.createElement('button');
        printerSelectButton.id = this.id + 'Button';
        printerSelectButton.innerHTML = 'Select';
        printerSelectSection.appendChild(printerSelectButton);

        document.getElementById(this.parentId).appendChild(printerSelectSection);

        // wait for the user to choose and lock stuff down
        await new Promise(r=>printerSelectButton.addEventListener('click', r, {once:true}));

        let selectedPrinterName = printerSelectField.options[printerSelectField.selectedIndex].text;
        let selectedPrinterPath = printerSelectField.value;

        printerSelectField.remove();
        printerSelectButton.remove();

        let printerSelectName = document.createElement('span');
        printerSelectName.id = this.id + 'Name';
        printerSelectName.innerHTML = selectedPrinterName;
        printerSelectSection.appendChild(printerSelectName);

        return this.dir + selectedPrinterPath; 
    }
}