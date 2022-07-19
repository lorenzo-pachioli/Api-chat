const { idValidate,
    nameValidate,
    emailValidate,
    passwordValidate,
    booleanValidate
} = require('../validate/syntaxCheck');
const {
    idTestCases,
    nameTestCases, 
    emailTestCases, 
    passwordTestCases, 
    booleanTestCases
} = require('./syntaxTestCases');

function syntaxTest(syntaxName, testCase, syntaxFunction){
    describe(`Form of ${syntaxName} when input is`, () => {
        testCase.forEach(({ description, value, expected }) => {
            test(description, () => {
                expect(syntaxFunction(value)).toBe(expected);
            });
        });
    });
};

syntaxTest('id', idTestCases, idValidate);
syntaxTest('name', nameTestCases, nameValidate);
syntaxTest('email', emailTestCases, emailValidate);
syntaxTest('password', passwordTestCases, passwordValidate);
syntaxTest('boolean', booleanTestCases, booleanValidate);
