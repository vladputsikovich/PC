suite('Global tests', function () {
    test('У данной стрыницы допустимы заголовок', function () {
        assert(document.title && document.title.match(/\S/) &&
            document.title.toUpperCase() !== 'TODO');
    });
});