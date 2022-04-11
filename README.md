# configure-klipper.github.io

This repository contains a web application designed to build modular Klipper configurations. 

Do to the range of MCUs Klipper supports, and the wide variety of hardware configurations that can bee seen on printers running Klipper, its hard to provide a single firmware configuration, that would allow people to convert to klipper easily.
To help address this, the application splits Klipper configurations into a number of discrete components/modules, allowing the user to easily pick and choose components via the interface to match their build.

**Documentation**
- [User Documentation](#user-documentation)
- [Developer Documentation](#developer-documentation)

### User Documentation
Generating a modular configuration, is very simple thanks to the simplicity of the user interface. To generate a custom configuration follow the steps below.
1. Navigate the the [application interface](https://configure-klipper.github.io/).
2. Select the printer you want to generate a configuration for. 
3. Select the Mcu your printer is using.
4. select the components/modules used by your printer.
5. click the **_Generate_** button to generate the configuration.
6. unzip the the download and follow the steps listed in printer.cfg.

### Developer Documentation
As the application is currently written, it's just as easy to add a new component to an existing printer as it is to create an entirely new printer. Thus, to give a thorough understanding of how the application works the following documentation will walk through how to create a brand new printer step by step.

#### Initial steps
A printer is nothing more than a directory that contains various template and configuration files. Thus to create a new printer we need to create the directory and files and let the application know where they are.

1. Create a new appropriately named directory for the printer inside the [klipper](https://github.com/configure-klipper/configure-klipper.github.io/tree/main/klipper) directory. 
2. open [printers.json](https://github.com/configure-klipper/configure-klipper.github.io/blob/main/klipper/printers.json) and add a new printer to the list. Each printer is a simple object with 2 attributes. 
    - name : The name of the printer. (must be unique)
    - path : the path of the printer directory relative to the klipper directory.
3. add a [printer.cfg](https://github.com/configure-klipper/configure-klipper.github.io/blob/main/klipper/railcore-2-300zl/printer.cfg) klipper config file to the printer directory. It should only contain the most basic configuration settings, and post install comments/directions for end users.

#### MCU information
Klipper relies on pin names to function properly, but mcu manufacturers don’t follow a standard naming convention. Thus each mcu needs its own cfg file and a way of mapping its pins to a standard name used in the hardware component/module cfg files. The following steps will walk you through the process.

1.  Create a [mcus.json](https://github.com/configure-klipper/configure-klipper.github.io/blob/main/klipper/railcore-2-300zl/mcus.json) file in the printer directory.  Each mcu is a simple object with 4 attributes. 
    - name : The name of the mcu. (must be unique)
    - path : the path of the mcu cfg file relative to the printer directory.
    - replacementsPath : the path of the mcu pin replacements json file relative to the printer directory. 
    - template : should the mcu cfg file have pin replacement templating performed on it during the configuration generation process 
        - its recommended practice to put mcu cfg & json files in a "mcu" directory within the printer directory.

2. Create the [mcu.cfg](https://github.com/configure-klipper/configure-klipper.github.io/blob/main/klipper/railcore-2-300zl/mcu/duet2-duex5.cfg) file in the appropriate location, and fill it with the appropriate configuration information for Klipper.
3. Create the [mcu pin replacement json file](https://github.com/configure-klipper/configure-klipper.github.io/blob/main/klipper/railcore-2-300zl/mcu/duet2-duex5.json) in the appropriate location. The file is nothing more than an array of simple js objects. The application contains a pre-processor that allows the file to contain comments for readability and documentation purposes. Comment Lines must start with ”//”. Each replacement object must have the two following attributes.
    - key : The template string that will be found in cfg files and replaced.
    - value : the value the key will be replaced with.

#### Component/module information
Components are the meat and potatoes of the application, but are very simple to create. The following steps will walk you through the process.

1. Create a [components.json](https://github.com/configure-klipper/configure-klipper.github.io/blob/main/klipper/railcore-2-300zl/components.json) file in the printer directory. The components file is the most complex manifest file in the application but it still a fairly stray forward array of nested objects.

2. The highest level objects are the component group objects. Component groups exist purely to make the gui easier to understand for end users, and easier for developers to keep similar components organized. Each component group has 3 attributes
    - name : A short sting to describe the component group
    - description : A much longer string that can used to provide additional details or special instructions related to the components in the group   
    - components : an array of component objects

3. Components are the most common object type and have the 5 following attributes.
    - required : boolean flag to indicate if the component is required for the configuration. Note - required files will be included in the configuration they will not be automatically loaded by klipper, they must be explicitly included by a non required file. 
    - template : boolean flag to indicate if cfg file should have pin replacement templating performed on it during the configuration generation process
    - path : the path of the cfg file relative to the printer directory.
    - name : A short sting to describe the component.
    - description : A much longer string that can used to provide additional details or special instructions related to the component.

4. Templating
Templating is the mechanism that takes the [mcu replacement pins](https://github.com/configure-klipper/configure-klipper.github.io/blob/main/klipper/railcore-2-300zl/mcu/duet2-duex5.json), and injects them into the cfg files needed for Klipper to work. The templating engine takes each key found in the mcu pin replacement file, and looks for them in the cfg files that have templating set to true. If the key is found, it is replaced with its associated value. To ensure nothing is accidentally templated, the engine looks for the keys prefixed and postfixed with ‘’$$”, see the following example. 
```python
[stepper_x]
# Rear stepper motor
step_pin: $$X_STEP$$
dir_pin: $$X_DIR$$
enable_pin: $$X_EN$$
endstop_pin: $$X_STOP$$
```
