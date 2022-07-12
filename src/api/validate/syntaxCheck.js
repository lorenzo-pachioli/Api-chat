const { ObjectId } = require('mongodb');
const { toEvent } = require('../helper/SocketUtils');

exports.idValidate = (id, eventName) => {

    if (!ObjectId(id).getTimestamp()) {
        toEvent(eventName, { msg: "Incorrect id form", status: false });
        return false;
    };
    return true;
}

exports.nameValidate = (name, eventName) => {
    const regExName = /^([A-ZÁÉÍÓÚ]{1}[a-zñáéíóú]+[\s]*)+$/;

    if (name.length >= 18) {
        toEvent(eventName, { msg: "name introduce is too long", status: false });
        return false;
    }
    if (name.length <= 3) {
        toEvent(eventName, { msg: "name introduce is too short", status: false });
        return false;
    }
    if (!regExName.test(name)) {
        toEvent(eventName, { msg: "Incorrect name form", status: false });
        return false;
    }
    return true;
    /* 
    regExName : 
                - min 3 characters
                - max 18 characters
                -Starts with capital letter
                - admit spanish alfabet
    */
}

exports.emailValidate = (email, eventName) => {
    const regExEmail = /^[-\w.%+]{1,30}@(?:[A-Z0-9-]{4,30}\.)[A-Z]{2,20}$/i;

    if (!regExEmail.test(email)) {
        toEvent(eventName, { msg: "Incorrect email form", status: false });
        return false;
    };
    return true;
    /* 
    regExEmail : 'name@server.end'
                - name length between 1 and 30
                - server length between 4 and 30
                - end length between 2 and 20
    */
}

exports.passwordValidate = (pass, eventName) => {
    const regExComplete = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&#.$($)$-$_])[A-Za-z\d$@$!%*?&#.$($)$-$_]{6,15}$/;
    const onlyNumbers = /^(.*\d){6,15}$/;
    
    if (onlyNumbers.test(pass)) {
        return true;
    } else {
        toEvent(eventName, { msg: "Incorrect password form", status: false });
        return false;
    }
    /* regExComplete : 
                        - Minimo 8 caracteres
                        - Maximo 15
                        - Al menos una letra mayúscula
                        - Al menos una letra minucula
                        - Al menos un dígito
                        - No espacios en blanco
                        - Al menos 1 caracter especial 
    */
}

exports.booleanValidate = (boolean, eventName) => {
    if (boolean === true || boolean === false) {
        return true;
    }
    toEvent(eventName, { msg: "Incorrect online form", status: false });
    return false;
}