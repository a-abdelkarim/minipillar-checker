import functools

import fiona
import geojson
import pyproj
import shapely.geometry
import shapely.ops
import json

omit = ['SHAPE_AREA', 'SHAPE_LEN']

def convert(f_in, f_out):
    with fiona.open(f_in) as source:
        # Use the recipe from the Shapely documentation:
        # http://toblerity.org/shapely/manual.html
        project = functools.partial(pyproj.transform,
                                    pyproj.Proj(**source.crs),
                                    pyproj.Proj(init='epsg:4326'))

        features = []
        for f in source:
            shape = shapely.geometry.shape(f['geometry'])
            projected_shape = shapely.ops.transform(project, shape)

            # Remove the properties we don't want
            props = f['properties']  # props is a reference
            for k in omit:
                if k in props:
                    del props[k]

            feature = geojson.Feature(id=f['id'],
                                      geometry=projected_shape, 
                                      properties=props)
            features.append(feature)

    fc = geojson.FeatureCollection(features)

    with open(f_out, 'w') as f:
        f.write(json.dumps(fc))
        
        

convert("modules\data\minipillar_wgs.shp","modules\data\minipillar_wgs.geojson.geojson")