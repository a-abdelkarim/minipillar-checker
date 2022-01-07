import json
from turfpy.measurement import nearest_point
from geojson import Point, Feature, FeatureCollection


class Geography:
    """Geography Functions"""

    def distance(self, org_point: list, dest_point: list):
        pass


    def nearest_point(self, featureCollection, point):
        """ Get Nearest point

        Args:
            featureCollection (object): feature collection of points
            point (list): device location

        Returns:
            object: the nearest point
        """
        # convert point to geographic point
        point = Feature(geometry=Point(point))
        # get the nearest point
        near_point = json.dumps(nearest_point(point ,featureCollection), indent=2, sort_keys=True)
        near_point = json.loads(near_point)
        # get the nearest point distance
        distance = float(near_point["properties"]["distanceToPoint"]) * 1000 # convert km to meter
        # check if the distance more than 5 meters
        if distance > 5:
            return False
        else: 
            return near_point
            




if __name__ == "__main__":
    fc = {
        "type": "FeatureCollection",
        "features": [
            {
            "type": "Feature",
            "properties": {},
            "geometry": {
                "type": "Point",
                "coordinates": [
                24.152918742656578,
                47.342517971992486
                
                ]
            }
            },
            {
            "type": "Feature",
            "properties": {},
            "geometry": {
                "type": "Point",
                "coordinates": [
                24.152571211461186,
                47.34205663204193
                
                ]
            }
            }
        ]
        }

    point = [24.152935874451618, 47.34250992536545]

    geoClass = Geography()
    geoClass.nearest_point(fc, point)
