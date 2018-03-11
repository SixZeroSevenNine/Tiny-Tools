'''
Database class, handles XML IO.
'''
import os
from xml.etree.ElementTree import ElementTree

import tools
from file import File

class Database:
    # Constructor, initializes the database.
    def __init__(self, database, scanPath):
        self.__database = database
        self.__scanPath = scanPath
        self.__allFiles = dict()
        self.__crcDatabase = dict()
        
        self.__ScanPath()
        if not os.path.exists(self.__database):
            self.__Export(self.__allFiles)
        self.__ReadDatabase()
       
    # Compares SHA256 hashes from scanned files with one in database.     
    def Compare(self):
        mismatchCount = 0
        totalFiles = 0
        for key,item in self.__allFiles.items():
            totalFiles = totalFiles + 1
            fileCrc = self.__crcDatabase.get(key)
            if not fileCrc:
                self.__crcDatabase[item.FileName] = item
                tools.Logger.warn("NEWFILE [{0}], SHA256 [{1}].".format(item.FileName, item.CRC))
            else:
                if item.CRC == fileCrc.CRC:
                    tools.Logger.debug("NOCHANGE [{0}], SHA256 [{1}].".format(fileCrc.FileName, fileCrc.CRC))
                else:
                    mismatchCount = mismatchCount + 1
                    tools.Logger.error("MD5MISMATCH [{0}], SHA256 [{1}].".format(fileCrc.FileName, fileCrc.CRC))
                    
        # Re-write database                    
        self.__Export(self.__crcDatabase)

        return mismatchCount, totalFiles
        
    # Reads database XML file and imports it into allFiles array
    def __ReadDatabase(self):
        tree = ElementTree()
        tree.parse(self.__database)
        nodes = tree.findall(".//*")
        for node in nodes:
            f = File(node.text, node.attrib["crc"])
            self.__crcDatabase[f.FileName] = f
            
    # Imports the file information into the allFiles array.
    def __ScanPath(self):
        for root, dirs, files in os.walk(self.__scanPath):
            for file in files:
                fileName = os.path.join(root,file)
                f = File(fileName, tools.Tools.GetHash(fileName))
                self.__allFiles[f.FileName] = f
                
    # Serializes allFiles into XML file. 
    def __Export(self, hashTable):
        databaseFile = open(self.__database, "w")
        databaseFile.write("<?xml version=\"1.0\"?><files>\n")
        for fileKey, fileEntry in hashTable.items():
            # Check if file exists
            if os.path.exists(fileEntry.FileName):
                databaseFile.write(fileEntry.GetXmlNode())
            else:
                tools.Logger.warn("Can't find file [{0}], removing from database.".format(fileEntry.FileName))
        databaseFile.write("</files>")    
        databaseFile.close()
