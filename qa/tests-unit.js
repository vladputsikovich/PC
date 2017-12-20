var fortune = require('../lib/fortune');
var except = require('chai').expect;
suite('Тесты печеняк',function(){
    test('getFortune() должна возвращать предсказание',function(){
        except(typeof fortune.getFortune() ==='string');
    });
});