'use strict';

describe('Controller: MapoverlayCtrl', function () {

  // load the controller's module
  beforeEach(module('tripPlannerApp'));

  var MapoverlayCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    MapoverlayCtrl = $controller('MapoverlayCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
