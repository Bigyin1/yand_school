let config = require("./conf");

class Device {
    constructor(input) {
        this.id = input.id;
        this.name = input.name;
        this.power = input.power;
        this.duration = input.duration;
        this.mode = input.mode || 'undefined';
        this.elCost = 0; // потрачено на эл.во
    }

}

// объект часа, всего их будет 24
class Hour {

    constructor(hour, price, period, maxPower) {
        this.hour = hour;
        this.price = price;
        this.period = period;
        this.relatedDevices = []; // в этом массиве будут хранится приборы работающие в этот час
        this.powerLeft = maxPower; // оставшаяся мощность

    }

    addDevice(device) {
        if ((this.powerLeft - device.power) < 0 || !device.duration) {
            return false
        }

        this.relatedDevices.push(device);
        device.elCost += this.price * (device.power / 1000);


        this.powerLeft -= device.power;
        device.duration--;

    }

    popDevice(device) {                     // удаление последненго добавленного прибора
        this.relatedDevices.pop();
        device.elCost -= this.price * (device.power / 1000);


        this.powerLeft += device.power;
        device.duration++;
    }


}

class TimeTable {


    constructor(input) {

        this.maxpower = input.maxpower;

        //приборы
        this.devices = [];

        //Создание массива объектов Device
        input.devices.forEach((item) => {
            this.devices.push(new Device(item))
        });

        //сортируем приборы по убыванию их мощности
        this.devices.sort((a, b) => {
            return a.power <= b.power
        });

        //часы
        this.hours = [];

        //создание массива объектов Hour на основе rates
        input.rates.forEach((rate) => {

            let from = new Date(); // используем Date для более удобной работы со временем
            let to = new Date();
            from.setHours(rate.from, 0, 0);
            to.setHours(rate.to, 0, 0);

            if (rate.to < rate.from) {

                to.setDate(to.getDate() + 1);

            }
            for (; from < to; from.setHours(from.getHours() + 1)) {
                this.hours.push(new Hour(from.getHours(), rate.value, this.period(from.getHours()), input.maxPower))
            }
        });

        //сортируем часы по вазростанию их цены
        this.hours.sort((a, b) => {
            return a.price - b.price
        });


    }

    //вспомогательный метод для определения периода суток для заданного часа
    period(time) {


        if (config.dayBegin <= time && time < config.dayEnd) {
            return "day"
        }

        if (config.nightBegin <= time || time < config.nightEnd) {
            return "night"
        }


    }

    //основной алгоритм составления расписания
    Task() {

        this.hours.forEach((hour, i) => {

            this.devices.forEach((device) => {


                if (device.mode === hour.period) {

                    hour.addDevice(device)
                }
                else if (device.mode === 'undefined' && device.duration > 0) {

                    hour.addDevice(device);
                    let checkHours = this.hours.slice(i).filter((a) => {
                        return a.period === hour.period
                    });
                    let checkDevices = this.devices.slice().filter((a) => {
                        return a.mode === hour.period
                    });

                    if (!this.check(checkHours, checkDevices)) { // в случае если проверка не пройдена, удаляем прибор

                        hour.popDevice(device)

                    }

                }

            })

        })

    }

    //метод для проверки того что при добавлении прибора 'undefined' , нам хватит места под приборы специализированные
    //под это время суток (day/night)
    check(hours, devices) {

        hours.forEach((hour) => {

            devices.forEach((device) => {

                hour.addDevice(device);

            })

        });

        devices.forEach((device) => {
            if (device.duration !== 0) {

                return false;
            }

        });
        return true

    }


    //вывод всей информации в необходимом формате
    print() {

        this.hours.sort((a, b) => {
            return a.hour - b.hour
        });

        let schedule = this.hours.map((h) => {
            return h.relatedDevices.map((d) => {
                return d.id
            })
        });

        let value = 0;

        let devices = {};

        this.devices.forEach((d) => {
            value += d.elCost;

            devices[d.id] = d.elCost;

        });

        return {schedule: {...schedule}, consumedEnergy: {value: value, devices: devices}}

    }

}

module.exports = TimeTable;