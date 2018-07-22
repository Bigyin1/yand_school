



let config = {

    nightStep:false,

    nightBegin(){
        let i = new Date();
        i.setHours(0, 0, 0);
        return i

        //return 0
    },


    nightEnd(){
        let i = new Date();

        i.setHours(6, 0, 0);
        return i

    },
    dayBegin(){
        let i = new Date();
        i.setHours(12, 0, 0);
        return i
    },
    dayEnd(){
        let i = new Date();
        i.setHours(18, 0, 0);
        return i
    },
    // nightLen(){
    //
    //     return this.nightStep ? this.nightEnd() + 24 - this.nightBegin() : this.nightEnd() - this.nightBegin()
    //
    // },
    // dayLen(){
    //
    //     return this.dayEnd - this.dayBegin
    // },
    dayDevices:0,
    nightDevices:0,


};


module.exports = config;