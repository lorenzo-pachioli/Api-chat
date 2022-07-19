const { ObjectId } = require('mongodb');

exports.idValidate = (id) => {
    if (ObjectId.isValid(id)) return true;
    return false;
}

exports.nameValidate = (name) => {
    const regExName = /^([A-ZÁÉÍÓÚ]{1}[a-zñáéíóú]+[\s]*)+$/;
    if (name === undefined) return false;
    if (name.length >= 18) {
        return false;
    }
    if (name.length <= 3) {
        return false;
    }
    if (!regExName.test(name)) {
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

exports.emailValidate = (email) => {
    const regExEmail = /^[-\w.%+]{1,30}@(?:[A-Z0-9-]{4,30}\.)[A-Z]{2,20}$/i;
    
    if (!regExEmail.test(email)) {
        return false;
    };
    if (typeof email !== 'string') return false;
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

    if (typeof pass !== 'number' && typeof pass !== 'string') return false;
    
    if (onlyNumbers.test(pass)) {
        return true;
    }
    return false;
    
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
    return false;
}