# configure-klipper.github.io

This repository contains a web applicaiton designed to build modular Klipper configurations. 

Do to the range of MCUs Klipper supports, and the wide variety of hardware configurations that can bee seen on printers running Klipper, its hard to provide a single firmware configuration, that would allow people to convert to klipper easilly.
To help address this, the aplicaiton splits Klipper configurations into a number of discrete components/modules, allowing the user to easily pick and choose components via the interface to match their build.

**Documentation**
- [User Documentation](#user-documentation)
- [Developer Documentation](#developer-documentation)

### User Documentation
Generating a modular configuration, is very simple thanks to the simplicity of the user interface. To generate a custom configuration follow the steps below.
1. Navigate the the [applicaiton interface](https://configure-klipper.github.io/).
2. Select the printer you want to generate a configuration for. 
3. Select the Mcu your printer is using.
4. select the components/modules used by your printer.
5. click the **_Generate_** button to generate a the configuraiton.
6. unzip the the download and follow the steps listed in printer.cfg.

### Developer Documentation
