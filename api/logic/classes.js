
let config = require("./conf");

class Device {
    constructor(input){
        this.id = input.id;
        this.name = input.name;
        this.power = input.power;
        this.duration = input.duration;
        this.mode = input.mode || 'common';
        this.elCost = 0; // потрачено на эл.во
    }

    get info(){
        return this.id;
    }

}

class Hour {

    constructor(hour, price, period){
        this.hour = hour;
        this.price = price;
        this.period = period;
        this.relatedDevices = [];
        this.currentPower = 0;
        //this.maxpower = maxpower;

    }

    addDevice(device){


    }


}

class TimeTable{


    constructor(input){


        this.maxpower = input.maxpower;

        //приборы

        this.devices = [];

        input.devices.forEach((item) => {this.devices.push(new Device(item))});

        //config.dayDevices = this.devices.filter((item) => {item.mode === "day"}).length;

        this.devices.sort((a, b) => {return a.power <= b.power});
        console.log(this.devices);

        //часы
        this.hours = [];

        input.rates.forEach((rate) =>{

            let from = new Date();
            let to = new Date();
            from.setHours(rate.from, 0, 0);
            to.setHours(rate.to, 0, 0);

            if (rate.to < rate.from){

                to.setDate(to.getDate() + 1);

            }
            for( ;from < to; from.setHours(from.getHours() + 1)){
                this.hours.push(new Hour(from.getHours(), rate.value, this.period(from)))

            }


        })






    }

    period(time){

        console.log(config.nightBegin().toString(), config.nightEnd().toString());
        if (config.dayBegin() <= time && time < config.dayEnd()){
            return "day"
        }

        if(config.nightStep && (config.nightBegin().getHours() <= time.getHours() || time.getHours() < config.nightEnd().getHours())){
            return "night"
        }

        else if (config.nightBegin().getHours() <= time.getHours() && time.getHours() < config.nightEnd().getHours()){
            return "night"
        }
        return "common"


    }

    print(){

        return this.hours

    }


}

module.exports = TimeTable;