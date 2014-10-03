'use strict';

describe('Controller: AsideCtrl', function () {

  // load the controller's module
  beforeEach(module('tripPlannerApp'));

  var AsideCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    AsideCtrl = $controller('AsideCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
