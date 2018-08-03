import {loadList, loadDetails} from './api';
import {getDetailsContentLayout} from './details';
import {createFilterControl} from './filter';


export function initMap(ymaps, containerId) {
    let myMap = new ymaps.Map(containerId, {
        center: [55.76, 37.64],
        controls: [],
        zoom: 10
    });

    let objectManager = new ymaps.ObjectManager({
        clusterize: true,
        gridSize: 64,
        clusterIconLayout: 'default#pieChart',
        clusterDisableClickZoom: false,
        geoObjectOpenBalloonOnClick: false,
        geoObjectHideIconOnBalloonOpen: false,
        geoObjectBalloonContentLayout: getDetailsContentLayout(ymaps)
    });

    objectManager.objects.options.set('preset', 'islands#greenDotIcon');

    myMap.geoObjects.add(objectManager); // нужно для добавления objectManager-а на карту

    loadList().then(data => {
        objectManager.add(data);
    });


    //details
    objectManager.objects.events.add('click', event => {

        const objectId = event.get('objectId');
        let obj = objectManager.objects.getById(objectId);
        objectManager.objects.balloon.open(objectId);


        if (!obj.properties.details) {
            loadDetails(objectId).then(data => {
                obj.properties.details = data;
                objectManager.objects.balloon.setData(obj)

            })
        }
    });

    // filters
    const listBoxControl = createFilterControl(ymaps);
    myMap.controls.add(listBoxControl);

    let filterMonitor = new ymaps.Monitor(listBoxControl.state);
    filterMonitor.add('filters', filters => {
        objectManager.setFilter(
            obj => filters[obj.isActive ? 'active' : 'defective']
        );
    });
}
