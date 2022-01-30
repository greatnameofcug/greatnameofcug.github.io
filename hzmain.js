const key = 'B3Hdjzt86GvHvSDXOMdA';
const attributions =
    '<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> ' +
    '<a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>';

const baseMap = new ol.layer.Tile({
    source: new ol.source.Stamen({
        layer:'terrain',
    }),
    className: 'bw',
});
var gaodeMapLayer = new ol.layer.Tile({
    source: new ol.source.XYZ({
        url: 'http://wprd0{1-4}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&style=7&x={x}&y={y}&z={z}'
    })
});


var styleFunction = function(feature) {
    var vclass = feature.get('管控类型');
    var cc;
    if (vclass == '封控区')
    {
        cc = [130,32,43,0.8]
    }else if(vclass == '管控区')
    {
        cc = [241,68,29,0.6]
    }else if(vclass == '防范区')
    {
        cc = [254,209,16,0.4]
    }else
    {
        cc = [0,0,0,1]
    }
    return new ol.style.Style({
        stroke: new ol.style.Stroke({
            color: [130,32,43,0.8],
            width: 2,
            opacity: 1
        }),
        fill: new ol.style.Fill({
            color: cc
            
            ///opacity: feature.get('fill-opacity')
        }),
    })
};


var layer = new ol.layer.Vector({
    title: 'add Layer',
    source: new ol.source.Vector({
        projection: 'EPSG:4326',
        url: "hz疫情管控区域数据.geojson",
        format: new ol.format.GeoJSON()
    }),
    style: styleFunction,
});

const map = new ol.Map({
    target: 'map',
    layers: [
    gaodeMapLayer,
    layer
    ],
    view: new ol.View({
    center: [120.181923,30.180508],
    zoom: 13,
    minZoom: 1,
    maxZoom: 19,
    projection: 'EPSG:4326',
    //extent: [115, 39, 118, 41],
    }),
});
var container = document.getElementById("popup");
var content = document.getElementById("popup-content");
var popupCloser = document.getElementById("popup-closer");
var overlay = new ol.Overlay({
    //设置弹出框的容器
    element: container,
    //是否自动平移，即假如标记在屏幕边缘，弹出时自动平移地图使弹出框完全可见
    autoPan: true
});

map.on('click',function(e){
    //在点击时获取像素区域
    var pixel = map.getEventPixel(e.originalEvent);
    map.forEachFeatureAtPixel(pixel,function(feature){
        //coodinate存放了点击时的坐标信息
        var coodinate = e.coordinate;
        //设置弹出框内容，可以HTML自定义
        console.log(feature.get('name'));
        if (feature.get('name')){
            content.innerHTML = "<p>" + feature.get('name') + "</p>";
        }
        else{
            content.innerHTML = "";
        }
        
        //设置overlay的显示位置
        overlay.setPosition(coodinate);
        //显示overlay
        map.addOverlay(overlay);
    });
});
/*
map.on('movestart', function () {
    content.innerHTML = '';
});
*/
map.on("pointermove", function (evt) {
    var hit = this.forEachFeatureAtPixel(evt.pixel, function(feature, layer) {
        return true;
    }); 
    if (hit) {
        this.getTargetElement().style.cursor = 'pointer';
    } else {
        this.getTargetElement().style.cursor = '';
    }
});
