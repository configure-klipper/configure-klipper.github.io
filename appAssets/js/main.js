import PrinterSelect from './Application/PrinterSelect.js';
import McuSelect from './Application/McuSelect.js';
import Printer from './Application/Printer.js';

let main = async function(){
    try{
        let selectPrinter = new PrinterSelect('page', 'printerSelect', 'klipper/');
        await selectPrinter.load();
        let printerPath = await selectPrinter.run();

        let selectMcu = new McuSelect('page', 'mcuSelect', printerPath);
        await selectMcu.load();
        let mcuInfo = await selectMcu.run();

        let printer = new Printer('page', 'printer', printerPath, mcuInfo);
        await printer.load();
        await printer.run();

    }catch(e){
        document.getElementById('errorBox').innerHTML = e.message;
        document.getElementById('errorBoxWrapper').style.display = 'block' ;
        console.assert(false, e);
    }
}

main();