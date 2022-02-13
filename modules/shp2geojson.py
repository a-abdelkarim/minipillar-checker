import os
import requests
import geopandas
import json
import psycopg2


class ShpToPG:
    """import shapefile to postgres DB
    """

    def __init__(self, shapefile_path):
        self.shapefile_path = shapefile_path

    # Methods
    def shp_to_geojson(self):
        """convert shapefile to json

        Returns:
            [object]: json object
        """

        shp_file = geopandas.read_file(self.shapefile_path)
        shp_file.to_file('{}.geojson'.format(self.shapefile_path), driver='GeoJSON')

        with open('{}.geojson'.format(self.shapefile_path)) as f:
            contents = f.read()
            json_object = json.loads(contents)
        
        # os.remove('{}.geojson'.format(self.shapefile_path))

        return json_object
    
    def json_to_pg(self, json_object):
        """export json object to pg table
        """
        auth_token='23fe479b3bb49c5a1cc8bb409330b06060430af9'
        hed = {'Authorization': 'Token ' + auth_token}
        url = 'http://localhost:8000/api/minipillar/import'
        data = {
            "name":"sss",
            "json_object": json.dumps(json_object) 
        }
        
        response = requests.post(url, headers=hed, data=data)
        print(response)
        # data = {'json_object' : json_object, "name": name}

        
        # for feature in json_object["features"][:11]:
        #     try:
        #         connection = psycopg2.connect(user="postgres",
        #                                     password="postgres",
        #                                     host="127.0.0.1",
        #                                     port="5432",
        #                                     database="mini-pillar")
        #         cursor = connection.cursor()

        #         postgres_insert_query = """ INSERT INTO minipillars (longitude, latitude) VALUES (%s,%s)"""
        #         record_to_insert = (feature["geometry"]["coordinates"][0], feature["geometry"]["coordinates"][1])
        #         cursor.execute(postgres_insert_query, record_to_insert)

        #         connection.commit()
        #         count = cursor.rowcount
        #         print(count, "Record inserted successfully into mobile table")

        #     except (Exception, psycopg2.Error) as error:
        #         print("Failed to insert record into mobile table", error)

        #     finally:
        #         # closing database connection.
        #         if connection:
        #             cursor.close()
        #             connection.close()
        #             print("PostgreSQL connection is closed")

    
if __name__ == "__main__":
    shpClass = ShpToPG("E:\Projects\mini-pillar\modules\data\minipillar_wgs.shp")
    json_object = shpClass.shp_to_geojson()
    # shpClass.json_to_pg(json_object)
    


    