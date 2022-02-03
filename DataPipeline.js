var geometry = /* color: #d63000 */ee.Geometry.Polygon(
        [[[-39.70617235458249, 22.504782116696806],
          [-39.26671922958249, 42.934177915307615],
          [-66.02941454208249, 42.676248335853465],
          [-67.21593797958249, 44.0815397347864],
          [-69.76476610458249, 42.86979634635751],
          [-68.57824266708249, 41.60093517878928],
          [-72.44543016708249, 40.23956749200174],
          [-73.67589891708249, 38.91868141664022],
          [-74.77453172958249, 37.64237024888699],
          [-74.51085985458249, 35.810988523002194],
          [-75.65343797958249, 34.590113505253655],
          [-78.86144579208249, 32.502664285322666],
          [-80.83898485458249, 30.819553683527513],
          [-80.13585985458249, 28.991170690935736],
          [-79.52062547958249, 27.36429332996136]]]);

// constants determining downloaded image size/resolution
var R_e = 6370;
var alfa = (1/R_e) * 180/(3.1415);
var gsd = 266;
var box_size = gsd/1000 * 400;

// create joint dataset with all the necessary bands, <5% cloud cover
var proc_collection = ee.ImageCollection('LANDSAT/LC08/C02/T1_L2')
    .filterBounds(geometry)
    .select(['SR_B1', 'SR_B2', 'SR_B3', 'SR_B4', 'ST_B10'])
    .filter('CLOUD_COVER < .05');
print('Collection: ', proc_collection);

var raw_collection = ee.ImageCollection('LANDSAT/LC08/C02/T1')
    .filterBounds(geometry)
    .select(['B1', 'B2', 'B3', 'B4', 'B10'])
    .filter('CLOUD_COVER < .05');
print('Collection: ', raw_collection);

var filter = ee.Filter.equals({
  leftField: 'system:index',
  rightField: 'system:index'
});

var innerJoin = ee.Join.inner('primary', 'secondary');

var toyJoin = innerJoin.apply(proc_collection, raw_collection, filter);

var joined = toyJoin.map(function(feature) {
  return ee.Image.cat(feature.get('primary'), feature.get('secondary'));
});

print('Dataset:', joined);

var n = joined.size().getInfo();
var colList = joined.toList(n);

for(var i = 0; i < 1; i++){
    // get name and center coordinates of current image
    var img = ee.Image(colList.get(i));
    var name = img.get('system:index').getInfo().substring(0,20);
    Map.centerObject(img);
    Map.addLayer(img, {bands: ['B1']}, 'aerosol');
    var center = Map.getCenter().coordinates().getInfo();
    print(name)

    // create region around center of current image
    var one = ee.Number(center[0]).add(ee.Number(-box_size * alfa/2));
    var two = ee.Number(center[1]).add(ee.Number(-box_size * alfa/2));
    var three = ee.Number(center[0]).add(ee.Number(box_size * alfa/2));
    var four = ee.Number(center[1]).add(ee.Number(box_size * alfa/2));
    var site = ee.Geometry.Rectangle([one, two, three, four])
    print(site)
    
    // visualize image bands for download
    var imageB4 = img.select(['B4']);
    var imageB3 = img.select(['B3']);
    var imageB2 = img.select(['B2']);
    var imageB1 = img.select(['B1']);
    var imageB10 = img.select(['B10']);
    var imageSR1 = img.select(['SR_B1']);
    var imageSR2 = img.select(['SR_B2']);
    var imageSR3 = img.select(['SR_B3']);
    var imageSR4 = img.select(['SR_B4']);
    var imageST10 = img.select(['ST_B10']);
    
    // // Map.addLayer(site,
    // //             {'color': 'black'},
    // //             'Geometry [black]: rectangle');
    
    // download images
    Export.image.toDrive({
      image: imageB4,
      scale: gsd,
      description: name + '_B4',
      region: site,
      folder: 'test',
      fileFormat: 'GeoTIFF',
      formatOptions: {"cloudOptimized": false}
      });
      
    Export.image.toDrive({
      image: imageB3,
      scale: gsd,
      description: name + '_B3',
      region: site,
      folder: 'test',
      fileFormat: 'GeoTIFF',
      formatOptions: {"cloudOptimized": false}
      });
      
    Export.image.toDrive({
      image: imageB2,
      scale: gsd,
      description: name + '_B2',
      region: site,
      folder: 'test',
      fileFormat: 'GeoTIFF',
      formatOptions: {"cloudOptimized": false}
      });
      
    Export.image.toDrive({
      image: imageB1,
      scale: gsd,
      description: name + '_B1',
      region: site,
      folder: 'test',
      fileFormat: 'GeoTIFF',
      formatOptions: {"cloudOptimized": false}
      });
      
    Export.image.toDrive({
      image: imageB10,
      scale: gsd,
      description: name + '_B10',
      region: site,
      folder: 'test',
      fileFormat: 'GeoTIFF',
      formatOptions: {"cloudOptimized": false}
      });
      
    Export.image.toDrive({
      image: imageSR1,
      scale: gsd,
      description: name + '_SR1',
      region: site,
      folder: 'test',
      fileFormat: 'GeoTIFF',
      formatOptions: {"cloudOptimized": false}
      });
      
    Export.image.toDrive({
      image: imageSR2,
      scale: gsd,
      description: name + '_SR2',
      region: site,
      folder: 'test',
      fileFormat: 'GeoTIFF',
      formatOptions: {"cloudOptimized": false}
      });

    Export.image.toDrive({
      image: imageSR3,
      scale: gsd,
      description: name + '_SR3',
      region: site,
      folder: 'test',
      fileFormat: 'GeoTIFF',
      formatOptions: {"cloudOptimized": false}
      });
    
    Export.image.toDrive({
      image: imageSR4,
      scale: gsd,
      description: name + '_SR4',
      region: site,
      folder: 'test',
      fileFormat: 'GeoTIFF',
      formatOptions: {"cloudOptimized": false}
      });
      
    Export.image.toDrive({
      image: imageST10,
      scale: gsd,
      description: name + '_ST10',
      region: site,
      folder: 'test',
      fileFormat: 'GeoTIFF',
      formatOptions: {"cloudOptimized": false}
      });

}
