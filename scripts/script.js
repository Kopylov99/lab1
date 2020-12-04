ymaps.ready(init);
var myMap, 
    placemark1,
    placemark2,
    placemark3,
    placemark4;

function init(){ 
    if (!ymaps.panorama.isSupported()) {
        return;
    }
    myMap = new ymaps.Map("map", {
        center: [53.304618, 34.305064],
        zoom: 17
    }); 

    placemark1 = new ymaps.Placemark([53.305077, 34.305080], {
        hintContent: 'БГТУ',
        balloonContent: 'БГТУ, 1 корпус',
        panoLayer: 'yandex#panorama'},{
            preset: 'islands#nightIcon',
            openEmptyBalloon: true,
            balloonPanelMaxMapArea: 0
    });
    placemark1.__direction__ = [25, 0];
    placemark2 = new ymaps.Placemark([53.304442, 34.303849], {
        hintContent: 'БГТУ',
        balloonContent: 'БГТУ, 2 корпус',
        panoLayer: 'yandex#panorama'},{
            preset: 'islands#nightIcon',
            openEmptyBalloon: true,
            balloonPanelMaxMapArea: 0
    });
    placemark2.__direction__ = [120, 0];
    placemark3 = new ymaps.Placemark([53.304991, 34.306688], {
        hintContent: 'БГТУ',
        balloonContent: 'БГТУ, 3 корпус',
        panoLayer: 'yandex#panorama'},{
            preset: 'islands#nightIcon',
            openEmptyBalloon: true,
            balloonPanelMaxMapArea: 0,
    });
    placemark3.__direction__ = [-65, 0];
    placemark4 = new ymaps.Placemark([53.303247, 34.305358], {
        hintContent: 'БГТУ',
        balloonContent: 'БГТУ, 4 корпус',
        panoLayer: 'yandex#panorama'},{
            preset: 'islands#nightIcon',
            openEmptyBalloon: true,
            balloonPanelMaxMapArea: 0
    });
    placemark4.__direction__ = [-65, 0];
    function setBalloonContentLayout (placemark, panorama) {
        
        var BalloonContentLayout = ymaps.templateLayoutFactory.createClass(
            '<div id="panorama" style="width:256px;height:156px"></div>', {
                
                build: function () {
                   
                    BalloonContentLayout.superclass.build.call(this);
                    
                    this._openPanorama();
                },
                
                clear: function () {
                    this._destroyPanoramaPlayer();
                    BalloonContentLayout.superclass.clear.call(this);
                },
                
                _openPanorama: function () {
                    if (!this._panoramaPlayer) {
                        
                        var el = this.getParentElement().querySelector('#panorama');
                        this._panoramaPlayer = new ymaps.panorama.Player(el, panorama, {
                            controls: ['panoramaName'],
                            direction: placemark.__direction__ || auto
                        });
                    }
                },
              
                _destroyPanoramaPlayer: function () {
                    if (this._panoramaPlayer) {
                        this._panoramaPlayer.destroy();
                        this._panoramaPlayer = null;
                    }
                }
            });
        
        placemark.options.set('balloonContentLayout', BalloonContentLayout);
    }

    function requestForPanorama (e) {
        var placemark = e.get('target'),
           
            coords = placemark.geometry.getCoordinates(),
            
            panoLayer = placemark.properties.get('panoLayer');

        placemark.properties.set('balloonContent', "Идет проверка на наличие панорамы...");

        // Запрашиваем объект панорамы.
        ymaps.panorama.locate(coords, {
            layer: panoLayer
        }).then(
            function (panoramas) {
                if (panoramas.length) {
                    // Устанавливаем для балуна макет, содержащий найденную панораму.
                    setBalloonContentLayout(placemark, panoramas[0]);
                } else {
                    // Если панорам не нашлось, задаем
                    // в содержимом балуна простой текст.
                    placemark.properties.set('balloonContent', "Для данной точки панорамы нет.");
                }
            },
            function (err) {
                placemark.properties.set('balloonContent',
                    "При попытке открыть панораму произошла ошибка: " + JSON.stringify(err));
            }
        );
    }

    myMap.geoObjects.add(placemark1);
    myMap.geoObjects.add(placemark2);
    myMap.geoObjects.add(placemark3);
    myMap.geoObjects.add(placemark4);

    placemark1.events.once('balloonopen', requestForPanorama);
    placemark2.events.once('balloonopen', requestForPanorama);
    placemark3.events.once('balloonopen', requestForPanorama);
    placemark4.events.once('balloonopen', requestForPanorama);
}

