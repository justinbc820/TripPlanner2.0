'use strict';

describe('Controller: PlanCtrl', function () {

  // load the controller's module
  beforeEach(module('tripPlannerApp'));

  var PlanCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    PlanCtrl = $controller('PlanCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
