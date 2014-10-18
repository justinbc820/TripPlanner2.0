'use strict';

describe('Controller: AcceptinviteCtrl', function () {

  // load the controller's module
  beforeEach(module('tripPlannerApp'));

  var AcceptinviteCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    AcceptinviteCtrl = $controller('AcceptinviteCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
