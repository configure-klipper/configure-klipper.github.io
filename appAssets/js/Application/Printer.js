import Abstract from './Abstract.js';
import ComponentGroup from './ComponentGroup.js';

/**
 * a class that provides the interface for users to select, template, and configure a 
 * printers components
 */
export default class Printer extends Abstract{
    /**
     * holds mcu related info passed into the constructor
     * @type {array}
     */ 
    mcuInfo = [];

    /**
     * holds the replacements associated with the mcu
     * @type {array}
     */ 
    repacements = [];

    /**
     * holds the contents of components.json
     * @type {array}
     */ 
    comps = [];

    /**
     * The constructors does what you think it does.
     * 
     * @param {string} parentId - the parent gui element id for this object instance
     * @param {string} id - the gui element id for this object instance
     * @param {string} dir - the directory path of the printer
     * @param {object} mcuInfo - the required information abut the mcu the user selected
     */ 
    constructor(parentId = '', id = '', dir = '', mcuInfo ={}){
        // feed super a dummy path as its really not used by the printer class
        super(parentId, id, dir, 'dummy.cfg');

        let props = {'path':'isFilePath', 'replacementsPath':'isFilePath', 'template':'boolean'};
        if(!this.validator.objectwithPropertiesOfType(mcuInfo, props)){
            throw new TypeError('mcuInfo is missing or has invalid properties');
        }

        this.mcuInfo = mcuInfo;
        this.contents = [];
    }

    /**
     * handles loading the files needed to generate the printer configuration interface.  
     */ 
    async load(){
        await Promise.all([
            this.loadReplacements(),
            this.loadComponents()
        ]);

        let cnt = 0;

        // hard code the known required files and make 
        let  coreComponents = {
            'name':'coreComponents',
            'description':'coreComponents',
            'components':[
                {
                    'required': true,
                    'template': true,
                    'path':'printer.cfg', 
                    'name':'printer.cfg', 
                    'description':'printer.cfg'
                },  
                {
                    'required':true,
                    'template':this.mcuInfo.template,
                    'path':this.mcuInfo.path, 
                    'name':'mcu.cfg', 
                    'description':'mcu.cfg'
                },  
                {
                    'required':true,
                    'template':false,
                    'path':this.mcuInfo.replacementsPath, 
                    'name':'replacements.json', 
                    'description':'replacements.json'
                }  
            ]
        };
        this.contents.push(new ComponentGroup(this.dir, this.id, 'comp-' + cnt, coreComponents));


        for (var i = 0; i < this.comps.length; i++){
            cnt += 1; 
            this.contents.push(new ComponentGroup(this.dir, this.id, 'comp-' + cnt, this.comps[i]));
        } 
    }

    /**
     * handles asynchronously loading & validating the muc related replacements. 
     */ 
    async loadReplacements(){
        this.repacements = await this.loadFile(this.dir + this.mcuInfo.replacementsPath , true);

        if(!this.validator.nonEmptyArrayOfObjects(this.repacements)){
            throw new TypeError(this.dir + this.mcuInfo.replacementsPath + ' contains invalid data');
        }

        let props = {'key':'string', 'value':'string'};
        for (var i = 0; i < this.repacements.length; i++){
            if(!this.validator.objectwithPropertiesOfType(this.repacements[i], props)){
                let msg = 'replacements [' + i + '] in ' + this.dir + this.mcuInfo.replacementsPath;
                msg += ' is missing or has invalid properties'; 
                throw new TypeError(msg);
            }
        } 
    }

    /**
     * handles asynchronously loading & validating the components & component groups json file. 
     */ 
    async loadComponents(){
        this.comps = await this.loadFile(this.dir + 'components.json' , true);

        if(!this.validator.nonEmptyArrayOfObjects(this.comps)){
            throw new TypeError(this.dir + path + ' contains invalid data');
        }
    }

    /**
     * handles generating HTML gui output for the printer 
     */ 
    async run(){

        let printer = document.createElement('div'); 
        printer.id = this.id;
        printer.classList.add('printer');
        document.getElementById(this.parentId).appendChild(printer);


        for (var i = 0; i < this.contents.length; i++){
            this.contents[i].run();
        } 

        let generateButton = document.createElement('button');
        generateButton.id = 'generateButton';
        generateButton.innerHTML = 'Generate';
        document.getElementById(this.parentId).appendChild(generateButton);

        // wait for the user to make their selections, then lock everything down
        await new Promise(r=>generateButton.addEventListener('click', r, {once:true}));
        for (var i = 0; i < this.contents.length; i++){
            this.contents[i].disable();
        }
        generateButton.disabled = true;

        await this.loadExternalFiles();
        this.templateFiles();
        await this.finish();
        location.reload();
    }

    /**
     * handles loading all the needed external files
     */ 
    async loadExternalFiles(){
        // load all the needed external files
        let proms = [];
        for (var i = 0; i < this.contents.length; i++){
            for (var j = 0; j < this.contents[i].components.length; j++){
                let sel = this.contents[i].components[j].isSelected();
                let req = this.contents[i].components[j].required;

                if (sel || req){
                    proms.push(this.contents[i].components[j].load())
                }
            }
        } 
        await Promise.all(proms);
    }

    /**
     * handles templating all the external files that require it
     */ 
    templateFiles(){
        for (var i = 0; i < this.contents.length; i++){
            for (var j = 0; j < this.contents[i].components.length; j++){
                let sel = this.contents[i].components[j].isSelected();
                let req = this.contents[i].components[j].required;
                let tem = this.contents[i].components[j].template;

                if ((sel || req) && tem){
                    let str = this.contents[i].components[j].contents;
                
                    for (var k = 0; k < this.repacements.length; k++){
                        let key = this.repacements[k].key;
                        let val = this.repacements[k].value;
                        str = str.replaceAll('$$' + key + '$$', val);    
                    }

                    this.contents[i].components[j].contents = str;
                }
            }
        } 
    }

    async finish(){
        let includes = '';
        let zip = new JSZip();

        for (var i = 0; i < this.contents.length; i++){
            for (var j = 0; j < this.contents[i].components.length; j++){
                let sel = this.contents[i].components[j].isSelected();
                let req = this.contents[i].components[j].required;

                if ((sel || req)){
                    let path = this.contents[i].components[j].path; 
                    let str = this.contents[i].components[j].contents;
                    let name = this.contents[i].components[j].name;

                    if(name == 'mcu.cfg' || sel){
                        includes += '[include ' + path + "]\n\n";
                    }

                    if(path == 'printer.cfg'){
                        str = "[include includes.cfg]\n\n" + str;
                        str = str + "\n\n[include user.cfg]";
                    }

                    zip.file(path, str);
                }
            }
        }

        zip.file('includes.cfg', includes);
        zip.file('user.cfg', '');

        let blob = await zip.generateAsync({type:'blob'}) 
        saveAs(blob, 'config.zip');
    }
}