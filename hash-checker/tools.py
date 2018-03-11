import subprocess

# All modules can use this logger.
Logger = None

'''
Tools class, contains helper methods.
'''
class Tools:
    def __init__(self):
        pass

    # Generates an SHA256 digest from a file.
    @staticmethod
    def GetHash(fileName):
        Logger.debug("Getting SHA256 hash for [{0}].".format(fileName))
        result = subprocess.check_output(["/usr/bin/sha256sum","-b",fileName])
        hashResult = result.decode()
        hash = hashResult.split()
        Logger.debug("Result [{0}] for file [{1}].".format(hash[0], fileName))
        return hash[0]
