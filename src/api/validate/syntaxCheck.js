const { ObjectId } = require('mongodb');

exports.idValidate = (id) => {

    if (!ObjectId(id).getTimestamp()) {
        throw new Error("Incorrect id form");
    };
    return true;
}

exports.nameValidate = (name) => {
    const regExName = /^([A-ZÁÉÍÓÚ]{1}[a-zñáéíóú]+[\s]*)+$/;

    if (name.length >= 18) {
        throw new Error("name introduce is too long");
    }
    if (name.length <= 3) {
        throw new Error("name introduce is too short");
    }
    if (!regExName.test(name)) {
        throw new Error("Incorrect name form");
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

exports.emailValidate = (email) => {
    const regExEmail = /^[-\w.%+]{1,30}@(?:[A-Z0-9-]{4,30}\.)[A-Z]{2,20}$/i;

    if (!regExEmail.test(email)) {
        throw new Error("Incorrect email form");
    };
    return true;
    /* 
    regExEmail : 'name@server.end'
                - name length between 1 and 30
                - server length between 4 and 30
                - end length between 2 and 20
    */
}

exports.passwordValidate = (pass) => {
    const regExComplete = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&#.$($)$-$_])[A-Za-z\d$@$!%*?&#.$($)$-$_]{6,15}$/;
    const onlyNumbers = /^(.*\d){6,15}$/;
    
    if (onlyNumbers.test(pass)) {
        return true;
    } else {
        throw new Error("Incorrect password form");
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

exports.booleanValidate = (boolean) => {
    if (boolean === true || boolean === false) {
        return true;
    };
    throw new Error("Incorrect online form");
}