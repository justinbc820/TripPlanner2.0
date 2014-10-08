'use strict';

describe('Controller: TripeditCtrl', function () {

  // load the controller's module
  beforeEach(module('tripPlannerApp'));

  var TripeditCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    TripeditCtrl = $controller('TripeditCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
