'use strict';

describe('Service: planData', function () {

  // load the service's module
  beforeEach(module('tripPlannerApp'));

  // instantiate service
  var planData;
  beforeEach(inject(function (_planData_) {
    planData = _planData_;
  }));

  it('should do something', function () {
    expect(!!planData).toBe(true);
  });

});
