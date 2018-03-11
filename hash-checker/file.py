'''
File class, defines a file name and CRC value.
'''
class File:        
    def __init__(self, fileName="", CRC=""):
        self.__fileName = fileName
        self.__CRC = CRC
        
    def __getFileName(self):
        return self.__fileName
    
    def __setFileName(self, value):
        self.__fileName = value

    def __getCRC(self):
        return self.__CRC
    
    def __setCRC(self, value ):
        self.__CRC = value
    
    # Gets the XML node representation of this object.
    def GetXmlNode(self):
        return "<file crc=\"{0}\"><![CDATA[{1}]]></file>\n".format(self.CRC, self.FileName)
    
    # Filename property
    FileName = property(__getFileName, __setFileName)    
    
    # CRC (SHA256) property
    CRC = property(__getCRC, __setCRC)
