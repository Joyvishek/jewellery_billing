(function () {

  angular
    .module('meanApp')
    .directive('quill', quill);

  function quill() {
    var injectScript = function(element) {
        var scriptTag = angular.element(document.createElement('script'));
        scriptTag.attr('charset', 'utf-8');
        scriptTag.attr('src', 'https://cdn.quilljs.com/1.3.2/quill.min.js');
        element.append(scriptTag);

    };

    return {
        link: function(scope, element) {
            injectScript(element);
        }
    };
  }

})();
