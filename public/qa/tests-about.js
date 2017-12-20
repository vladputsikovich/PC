suite('Тесты страницы эбаут', function(){
    test('страница должна содержать ссылку на стрницу контактов ' , function(){
        assert($('a[href = "/concat"]').length);
    });
});