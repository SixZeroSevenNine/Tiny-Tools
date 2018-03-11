'''
Main module.
'''
import sys
import logging

import tools
from config import Config
from database import Database

''' 
Main class
'''
class Program:
    version = "0.2"
        
    def __init__(self):
        pass

    # Runs the program.
    def Run(self, argv):
        try:
            if len(argv) != 2:
                tools.Logger.error("Syntax: hash-checker <configuration file>")
            else:
                config = Config(argv[1])
                
                # Override default log level from configuration.
                tools.Logger.setLevel(config.LogLevel)
                
                # Scan files.
                tools.Logger.info("hash-checker version [{0}]. Database [{1}]. Configuration file [{2}].".format(self.version, config.Database, config.ScanPath))
                database = Database(config.Database, config.ScanPath)
                
                # See how many differ from database data.
                mismatchCount, totalFiles = database.Compare()
                tools.Logger.info("Mismatch count [{0}]. Total files processed [{1}].".format(mismatchCount, totalFiles))
                exit(mismatchCount)
        except Exception as ex:
            tools.Logger.critical("Fatal exception [{0}], exiting.".format(ex))
            exit(-1)

# Main()
if __name__ == '__main__':
    if not tools.Logger:
        # Initialize logger with default values.
        logging.basicConfig(format="[%(asctime)-6s] - [%(name)s] - [%(levelname)s] - %(message)s")
        tools.Logger = logging.getLogger("hash-checker")
        tools.Logger.setLevel(logging.ERROR)
    
    program = Program()
    program.Run(sys.argv);    
