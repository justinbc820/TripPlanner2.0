'use strict';

describe('Controller: NewtripCtrl', function () {

  // load the controller's module
  beforeEach(module('tripPlannerApp'));

  var NewtripCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    NewtripCtrl = $controller('NewtripCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
