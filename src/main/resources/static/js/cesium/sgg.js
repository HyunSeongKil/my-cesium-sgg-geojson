/**
 * geojson을 이용한 데모 - 행정구역별 인구수
 * @author gravity@vaiv.kr
 * @since 2021-04-28
 */
class SggDemo{
        //한반도 중심점
        LO_VALUE = 128.02025;
        LA_VALUE = 38.03375;
        AL_VALUE = 1500000;

        labelEntity = null;

    
    constructor(){
        this.viewer = null;

    }


    /**
     * 초기
     */
    init(){

        this.setEventHandler();


        //viewer 초기화
        this.viewer = this.initViewer();

        //label entity 생성
        this.initLabelEntity();

        //한반도 전경으로 이동
        this.flyTo(this.LO_VALUE, this.LA_VALUE, this.AL_VALUE);


        this.loadGeoJson();

    }


    /**
     * 
     */
    initLabelEntity(){
        this.labelEntity = this.viewer.entities.add({
            label: {
                show: false,
                showBackground: true,
                font: '14px monospace',
                horizontalOrigin: Cesium.HorizontalOrigin.LEFT,
                verticalOrigin: Cesium.VerticalOrigin.TOP,
                pixelOffset: new Cesium.Cartesian2(15,0),
                heightReference: Cesium.HeightReference.RELATIVE_TO_GROUND,
            }
        });

    }




    /**
     * 
     */
    loadGeoJson(){

        // Cesium.GeoJsonDataSource.crsNames['urn:ogc:def:crs:EPSG:3857'] = Cesium.GeoJsonDataSource.crsNames['EPSG:3857'];
        let ds = Cesium.GeoJsonDataSource.load('../data/National_SGG.geojson', {
            fill: Cesium.Color.fromAlpha(Cesium.Color.WHITESMOKE, 0.1),
            // stroke: Cesium.Color.fromAlpha(Cesium.Color.GRAY, 1),
            stroke: Cesium.Color.DARKGRAY,
            strokeWidth : 100,
        });
        this.viewer.dataSources.add(ds);
        this.viewer.zoomTo(ds);

    }


    /**
     * 
     */
    setEventHandler(){
        let self = this;

        //
        document.querySelector('button.xxx').addEventListener('click', ()=>{
            self.xxx('2021_03', ['5']);
        })


        //
        document.querySelector('button.start-picking').addEventListener('click', ()=>{
            let handler = new Cesium.ScreenSpaceEventHandler(self.viewer.scene.canvas);
            handler.setInputAction((evt)=>{                
                if(!Cesium.defined(evt) || !Cesium.defined(evt.endPosition)){
                    return;
                }

                if(Cesium.SceneMode.MORPHING === self.viewer.scene.mode){
                    return;
                }

                
                if(!self.viewer.scene.pickPositionSupported){
                    return;
                }

                let pickedObject = self.viewer.scene.pick(evt.endPosition);
                if(!Cesium.defined(pickedObject)){
                    return;
                }

                let ctsn = self.viewer.camera.pickEllipsoid(evt.endPosition, self.viewer.scene.globe.ellipsoid);
                if(!Cesium.defined(ctsn)){
                    self.labelEntity.label.show = false;
                    return;
                }


                let cartographic = Cesium.Cartographic.fromCartesian(ctsn);
                let lon = Cesium.Math.toDegrees(cartographic.longitude).toFixed(2);
                let lat = Cesium.Math.toDegrees(cartographic.latitude).toFixed(2);
                let heightString = cartographic.height.toFixed(2);
                let nm = self.getValue(pickedObject.id, '_SIG_KOR_NM');
                let co = self.getValue(pickedObject.id, '2021_03');
               
                self.labelEntity.position = ctsn;
                self.labelEntity.label.show = true;
                self.labelEntity.label.text = `○위치: ${lon}, ${lat}\n○행정구역: ${nm}\n○인구수: ${co}`;

                let z = -10000; //-cartographic.height * (self.viewer.scene.mode === Cesium.SceneMode.SCENE2D ? 1.5 : 1.0);
                self.labelEntity.label.eyeOffset = new Cesium.Cartesian3(0.0, 0.0, z);                

            }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
        });


        //
        document.querySelector('button.end-picking').addEventListener('click', ()=>{

        });
    }



    /**
     * 
     * @param {*} entity 
     * @param {*} key 
     * @returns 
     */
    getValue(entity, key){
        let v = entity.properties[key]._value;
        if('object' === typeof(v)){
            return '';
        }

        if(!isNaN(v)){
            return VV.formatNumber(v);
        }

        return v;
    }




    /**
     * 실제 처리
     * @param {string} propertyKey  property에서 꺼낼 키값
     * @param {array} indexes
     * @returns 
     */
    xxx(propertyKey, indexes){
        if(null == propertyKey || '' == propertyKey){
            return;
        }


        let self = this;

        let ds = self.viewer.dataSources._dataSources[0];
        let v;
        let i=0;
        let index;


        ds.entities.values.forEach(ent=>{
            v = ent.properties[propertyKey]._value;
            index = self.getIndex(v);

            if(-1 === index){
                return;
            }
            
            ent.polygon.fill = true;
            ent.polygon.material = self.createColorMaterialProperty(index);
            ent.polygon.extrudedHeight = v / 100;
            ent.polygon.outline = false;
           
            
        });

    }


    getIndex(v){
        if(isNaN(v) || 'object' === typeof(v)){
            return -1;
        }

        return 0;
    }


    /**
     * 
     * @param {number} index 
     * @returns 
     */
    createColorMaterialProperty(index){
        let color = Cesium.Color.fromRandom(); //new Cesium.Color.fromCssColorString(this.colors[index]);
        return new Cesium.ColorMaterialProperty(Cesium.Color.fromAlpha(color, 1.0));
    }


    /**
     * 카메라 이동
     * @param {*} lon 
     * @param {*} lat 
     * @param {*} alt 
     */
    flyTo(lon, lat, alt){
        this.viewer.camera.flyTo({
            destination: Cesium.Cartesian3.fromDegrees(lon, lat, alt)
        })
    }

    
    /**
     * viewer 초기화
     * @returns Viewer
     */
     initViewer(){
        let viewer = new Cesium.Viewer('cesium-container', {
            animation: false,
            baseLayerPicker: false,
            fullscreenButton: false,
            vrButton: false,
            homeButton: false,
            infoBox: false,
            sceneModePicker: false,
            selectionIndicator: false,
            timeline: false,
            navigationHelpButton: false,
            navigationInstructionsInitiallyVisible: false,
            scene3DOnly: false,
            shouldAnimate: false,
            skyBox: false,
            skyAtmosphere: false,
            // useDefaultRenderLoop: false,
            showRenderLoopErrors: false,
            useBrowserRecommendedResolution: false,
            automaticallyTrackDataSourceClocks: false,
            // globe: true,
            orderIndependentTranslucency: false,
            shadows: false,
            projectionPicker: false,
            requestRenderMode: false,
        });

        viewer.canvas.width = 1600;
        viewer.canvas.height = 900;
        
        console.log('<<initViewer', viewer);
        
        return viewer;
    }

}