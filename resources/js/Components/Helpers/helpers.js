import {Decimal} from 'decimal.js';
import moment from "moment";

export function generateUniqueNum() {

    return Math.floor(Math.random() * Date.now());

}

export function pesosStringToNumber(value) {

    return parseInt(value.replace(',', ''));
}

export function mayorEdad() {
    let date = new Date();
    let year = new Date().getFullYear() - 18;

    return date.setUTCFullYear(year);
}

export function isHourIngresoEqualOrGreaterHourSalida(horaA, horaB) {

    let t1 = moment(horaA, "YYYY-MM-DD HH:mm:ss");
    let t2 = moment(horaB, "YYYY-MM-DD HH:mm:ss");

    if(t1.hour() > t2.hour()){
        return true;
    };

    return false;

}

export function formatFloat(num, decimalRequired = false){

    if(num){

        Decimal.set({ precision: 2 });

        let n = new Decimal(num);

        if(n.decimalPlaces() > 0){
            return n.toFixed(2);
        }else{

            if(decimalRequired){
                return n.toFixed(2);
            }else{
                return n.toNumber();
            }

        }

    }else{
        return '';
    }
}
