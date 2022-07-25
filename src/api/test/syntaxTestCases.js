const { ObjectId } = require('mongodb');

exports.idTestCases = [
    {
        description: 'ObjectId',
        value: new ObjectId(),
        expected: true
    },
    {
        description: 'String',
        value: 'aaaaaaaaaaaaaaaaaaaaaaa',
        expected: false  
    },
    {
        description: 'Number',
        value: 111111111111111111111111,
        expected: false
    },
    {
        description: 'Null',
        value: '',
        expected: false
    },
    {
        description: 'Undefined',
        value: undefined,
        expected: false
    }
];

exports.nameTestCases = [
    {
        description: 'correct',
        value: 'Jhon Dow',
        expected: true
    },
    {
        description: 'too short',
        value: 'Jo',
        expected: false
    },
    {
        description: 'too long',
        value: 'Jhonnnnnnnnnnnnnnnn',
        expected: false
    },
    {
        description: 'all lower case',
        value: 'jhon',
        expected: false
    },
    {
        description: 'a number',
        value: 1111111111111,
        expected: false
    },
    {
        description: 'an array',
        value: ['Jhon'],
        expected: false
    },
    {
        description: 'Null',
        value: ' ',
        expected: false
    },
    {
        description: 'Undefined',
        value: undefined,
        expected: false
    }
];

exports.emailTestCases = [
    {
        description: 'correct',
        value: 'jhonDowSherald@someServer.com',
        expected: true
    },
    {
        description: 'email with no name',
        value: '@someServer.com',
        expected: false
    },
    {
        description: 'email with no server',
        value: 'jhonDowSherald@.com',
        expected: false
    },
    {
        description: 'email with no end',
        value: 'jhonDowSherald@someServer',
        expected: false
    },
    {
        description: 'too short',
        value: 'd@som.c',
        expected: false
    },
    {
        description: 'too long',
        value: 'jhonDowSheraldddddddddddddddddd@someServer.com',
        expected: false
    },
    {
        description: 'a number',
        value: 1111111111111,
        expected: false
    },
    {
        description: 'an array',
        value: ['jhonDowSherald@someServer.com'],
        expected: false
    },
    {
        description: 'Null',
        value: '',
        expected: false
    },
    {
        description: 'Undefined',
        value: undefined,
        expected: false
    }
];

exports.passwordTestCases = [
    {
        description: 'Number',
        value: 111111111111111,
        expected: true
    },
    {
        description: 'string of numbers',
        value: '111111111111111',
        expected: true  
    },
    {
        description: 'string of letters',
        value: 'aaaaaaaaaaaaaa',
        expected: false  
    },
    {
        description: 'too short',
        value: 'aaaaa',
        expected: false  
    },
    {
        description: 'too long',
        value: 'aaaaaaaaaaaaaaaaa',
        expected: false  
    },
    {
        description: 'an array of numbers',
        value: [11111111111, 1, 1, 1],
        expected: false
    },
    {
        description: 'Null',
        value: '',
        expected: false
    },
    {
        description: 'Undefined',
        value: undefined,
        expected: false
    }
];

exports.booleanTestCases = [
    {
        description: 'true',
        value: true,
        expected: true
    },
    {
        description: 'any number',
        value: 1656,
        expected: false
    },
    {
        description: 'any string',
        value: 'string',
        expected: false
    },
    {
        description: 'an array ',
        value: [true],
        expected: false
    },
    {
        description: 'a string',
        value: 'true',
        expected: false
    },
    {
        description: 'Null',
        value: '',
        expected: false
    },
    {
        description: 'Undefined',
        value: undefined,
        expected: false
    }
];