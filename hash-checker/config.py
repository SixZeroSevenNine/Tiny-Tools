import logging
from xml.etree.ElementTree import ElementTree

import tools

'''
Config class, holds configuration information.
'''
class Config:
    __logLevels = {
        "CRITICAL" : logging.CRITICAL,
        "ERROR"    : logging.ERROR,
        "WARNING"  : logging.WARN,
        "INFO"     : logging.INFO,
        "DEBUG"    : logging.DEBUG,
        "NOTSET"   : logging.NOTSET
    }
           
    def __init__(self, configFileName):
        try:
            tree = ElementTree()
            tree.parse(configFileName)
            self.__scanPath = tree.getroot().find("scanPath").text
            self.__database = tree.getroot().find("database").text
            self.__logLevel = Config.__logLevels[tree.getroot().find("logLevel").text] 
            
            
            tools.Logger.info("Configuration: scanPath [{0}], database [{1}], logLevel [{2}].".format(self.__scanPath, self.__database, self.__logLevel))

        except Exception as ex:
            tools.Logger.error("Error [{0}] reading configuration file [{1}]".format(ex, configFileName))
            
        
    def __getScanPath(self):
        return self.__scanPath
        
    def __getDatabase(self):
        return self.__database
    
    def __getLogLevel(self):
        return self.__logLevel
    
    # Path to scan files.    
    ScanPath = property(__getScanPath)
    
    # XML Database name.
    Database = property(__getDatabase)
    
    # Log level.
    LogLevel = property(__getLogLevel)
