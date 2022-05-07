import zipfile
import os
from modules.shp2geojson import ShpToPG

class FileHandler:
    DATA_DIR = "media\\temp\\file\\data"
    def __init__(self, zip_file):
        self.zip_file = zip_file
        
    def is_valid_zip(self):
        if self.zip_file.endswith(".zip"):
            the_zip_file = zipfile.ZipFile(self.zip_file)
            ret = the_zip_file.testzip()

            if ret is not None:
                print (f"First bad file in zip: {the_zip_file}")
                return False
            else:
                print ("Zip file is good.")
                return True
        else:
            return False
        
    
    def extract(self):
        if self.is_valid_zip():
            try:
                with zipfile.ZipFile(self.zip_file, 'r') as zip_ref:
                    zip_ref.extractall(self.DATA_DIR)
                    return True
            except Exception as e:
                print(e)
                return False
        else:
            return False
        
        
    def get_shp_name(self):
        for filename in os.listdir(self.DATA_DIR):
            f = os.path.join(self.DATA_DIR, filename)
            # checking if it is a file
            if os.path.isfile(f) and filename.endswith(".shp"):
                return f
            
    def convert_shp(self):
        shpClass = ShpToPG(self.get_shp_name())
        point_list = shpClass.get_point_list()
        
        return point_list
    
    def clean(self):
        try:
            os.remove(self.DATA_DIR+".zip")

        except Exception as e:
            print(e)
    
    

def main():
    fileClass = FileHandler("modules\data\data.zip")
    fileClass.extract()
    fileClass.get_shp_name()
    
if __name__ == "__main__":
    main()