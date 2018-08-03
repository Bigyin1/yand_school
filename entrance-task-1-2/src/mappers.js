export function mapServerData(serverData) {
    return {
        type: "FeatureCollection",
        features: serverData.map((obj, index) => ({
            id: index,
            type: "Feature",
            isActive: obj.isActive,
            geometry:
                {
                    type: "Point",
                    coordinates: [obj.lat, obj.long] //здесь широта и долгота были перепутаны местами
                },
            properties: {
                iconCaption: obj.serialNumber,
                coordinates: [obj.lat, obj.long] // добавил это сюда чтобы можно было отрисовать в балуне
            },
            options: {
                preset: getObjectPreset(obj),
                balloonMaxHeight:300
            }
        }))
    };
}

function getObjectPreset(obj) {
    return obj.isActive
        ? 'islands#blueCircleDotIconWithCaption'
        : 'islands#redCircleDotIconWithCaption';
}
