import functools
import fiona
import pyproj
import requests
import geopandas
import json
import geojson
import shapely


class ShpToPG:
    """import shapefile to postgres DB
    """

    def __init__(self, shapefile_path):
        self.shapefile_path = shapefile_path

    # Methods
    def get_point_list(self):
        """convert shapefile to json

        Returns:
            [object]: json object
        """
        # define points list
        point_list = []
        shp_file = geopandas.read_file(self.shapefile_path)
        print(shp_file)
        for index, row in shp_file.iterrows():
            point = [row['geometry'].x, row['geometry'].y]
            point_list.append(point)
            
        # shp_file.to_file('{}.geojson'.format(self.shapefile_path), driver='GeoJSON')

        # with open('{}.geojson'.format(self.shapefile_path)) as f:
        #     contents = f.read()
        #     json_object = json.loads(contents)
        
        # os.remove('{}.geojson'.format(self.shapefile_path))

        return point_list
    
    
    
if __name__ == "__main__":
    shpClass = ShpToPG("modules\data\minipillar_wgs.shp")
    json_object = shpClass.shp_to_geojson()
    # shpClass.json_to_pg(json_object)
    


    