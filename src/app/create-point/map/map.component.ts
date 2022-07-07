import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';

//map
import OSM from 'ol/source/OSM';
import Feature from 'ol/Feature';
import Map from 'ol/Map';
import Point from 'ol/geom/Point';
import VectorSource from 'ol/source/Vector';
import View from 'ol/View';
import {Icon, Style} from 'ol/style';
import {Tile as TileLayer, Vector as VectorLayer} from 'ol/layer';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {

  


  @Input() coordinates!: string

  @Output() pointCoordinates = new EventEmitter<string>();

  constructor(){  }

  getView:any

  zoom:any;

  map!:Map

  center!:any
  


  ngOnInit(): void {
    console.log("init");

   }

   ngOnChanges(changes: SimpleChanges) {

    if(!this.map){
      this.map = new Map({
        layers: [
          new TileLayer({
            source: new OSM(),
          }),
  
        ],
        target: 'map',
        view: new View({ 
          projection: 'EPSG:4326',
          center: [30.579421563767006, 50.372276186868866],
          zoom: 5,
          maxZoom: 18,
  
        }),
      });
  
    }

    if (this.coordinates){
      console.log("ngOnChanges");
      let splited = this.coordinates.split(", ", 2);
      let lon = splited[0];
      let lat = splited[1];
      console.log(lat, lon);


      function createStyle(src:any, img:any) {
        return new Style({
          image: new Icon({
            anchor: [0.5, 0.96],
            crossOrigin: 'anonymous',
            src: src,
            img: img,
            imgSize: img ? [img.width, img.height] : undefined,
          }),
        });
      }

      const iconFeature = new Feature(new Point([Number(lat), Number(lon)]));
      iconFeature.set('style', createStyle('../../../assets/img/point.png', undefined));

      let layers = [
        new TileLayer({
          source: new OSM(),
        }),

        new VectorLayer({
          style: function (feature) {
            return feature.get('style');
          },
          source: new VectorSource({features: [iconFeature]}),
        }),
      ]
  
      this.map.setView(new View({projection: 'EPSG:4326',
      center: [Number(lat), Number(lon)],
      zoom: this.zoom || 18,
      maxZoom: 18,
    }));

    this.map.setLayers(layers)


    
  
    }


    
  }
  
  getCoord(event:any){

    let coordinate = this.map.getEventCoordinate(event);
    this.getView = this.map.getView();
    this.zoom = this.getView.values_.zoom;
    this.center = this.getView.values_.center;
    console.log(this.zoom, this.center);
    
    
    let pointCoordinates = `${coordinate[1]}, ${coordinate[0]}`;
    this.pointCoordinates.emit(pointCoordinates);
    
    
  }

}
