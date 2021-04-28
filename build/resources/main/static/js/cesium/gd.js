/**
 * geojson을 이용한 데모 - 강우량별 색, 높이 변경
 * @author gravity@vaiv.kr
 * @since 2021-04-27
 */
class GeoJsonDemo{
        //한반도 중심점
        LO_VALUE = 128.02025;
        LA_VALUE = 38.03375;
        AL_VALUE = 1500000;

        

    
    constructor(){
        this.viewer = null;

        /**
         * 강수량별 색깔
         */
        this.colors = [
            '#EDF5F9',
            '#E2E8F7',
            '#D6DFF6',
            '#BCCBF5',
            '#A0B7F6',
            '#89A6FA',
            '#6B91FD',
            '#4B78FE',
            '#4C74E8',
            '#4E6DC9',
        ]
    }


    init(){

        this.setEventHandler();


        //viewer 초기화
        this.viewer = this.initViewer();


        //한반도 전경으로 이동
        this.flyTo(this.LO_VALUE, this.LA_VALUE, this.AL_VALUE);

        this.showLegendColor();


        this.loadGeoJson();
    }


    showLegendColor(){
        let self = this;
        let i=0;
        document.querySelectorAll('div.c').forEach(el=>{
            el.innerHTML = '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;';
            el.style.backgroundColor = self.colors[i];
            i++;
        });
    }



    /**
     * 
     */
    loadGeoJson(){

        // Cesium.GeoJsonDataSource.crsNames['urn:ogc:def:crs:EPSG:3857'] = Cesium.GeoJsonDataSource.crsNames['EPSG:3857'];
        let ds = Cesium.GeoJsonDataSource.load('../data/3km_Snow_Rain.geojson', {
            fill: Cesium.Color.fromAlpha(Cesium.Color.WHITESMOKE, 0.5),
            stroke: Cesium.Color.fromAlpha(Cesium.Color.WHITESMOKE, 0.1),
            strokeWidth : -1,
        });
        this.viewer.dataSources.add(ds);
        //this.viewer.zoomTo(ds);

    }


    /**
     * 
     */
    setEventHandler(){
        let self = this;


        document.querySelectorAll('input[type=checkbox].index').forEach(el=>{
            el.addEventListener('click', function(){
                self.xxx(self.getPropertyKey(), self.getIndexes());
            })
        });


        //change
        document.querySelector('select.sel').addEventListener('change', function(){
            self.xxx(self.getPropertyKey(), self.getIndexes());
        });


        //이전 버튼 click
        document.querySelector('button.prev').addEventListener('click', function(){
            let el = document.querySelector('select.sel');
            if(0 == el.selectedIndex){
                return;
            }

            el.selectedIndex = el.selectedIndex - 1;
            self.xxx(self.getPropertyKey(), self.getIndexes());
        });


        //다음 버튼 click
        document.querySelector('button.next').addEventListener('click', function(){
            let el = document.querySelector('select.sel');
            if(el.selectedIndex >= el.querySelectorAll('option').length - 1){
                return;
            }

            el.selectedIndex = el.selectedIndex + 1;
            
            self.xxx(self.getPropertyKey(), self.getIndexes());
        });


    }


    getPropertyKey(){
        return document.querySelector('select.sel').value;
    }

    getIndexes(){
        let els = document.querySelectorAll('input[type=checkbox].index');
        let arr=[];

        for(let i=0; i<els.length; i++){
            let el = els[i];
            
            if(el.checked){
                arr.push(el.value);
            }
        }

        console.log(arr);
        return arr;        

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

            if(indexes.includes(''+index)){
                ent.polygon.material = self.createColorMaterialProperty(index);
                ent.polygon.extrudedHeight = v*v;

            }else{
                ent.polygon.material = self.createColorMaterialProperty(0);
                if(0 != ent.polygon.extrudedHeight){
                    ent.polygon.extrudedHeight = 0;
                }
            }
            
            
        });

    }


    getIndex(v){
        let index = parseInt(v / 43);
        if(10 <= index){
            index = 9;
        }

        return index;
    }


    /**
     * 
     * @param {number} index 
     * @returns 
     */
    createColorMaterialProperty(index){
        let color = new Cesium.Color.fromCssColorString(this.colors[index]);
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