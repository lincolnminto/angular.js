'use strict';

describe('ngMock', function() {
  var noop = angular.noop;

  describe('TzDate', function() {

    function minutes(min) {
      return min * 60 * 1000;
    }

    it('should look like a Date', function() {
      var date = new angular.mock.TzDate(0,0);
      expect(angular.isDate(date)).toBe(true);
    });

    it('should take millis as constructor argument', function() {
      expect(new angular.mock.TzDate(0, 0).getTime()).toBe(0);
      expect(new angular.mock.TzDate(0, 1283555108000).getTime()).toBe(1283555108000);
    });

    it('should take dateString as constructor argument', function() {
      expect(new angular.mock.TzDate(0, '1970-01-01T00:00:00.000Z').getTime()).toBe(0);
      expect(new angular.mock.TzDate(0, '2010-09-03T23:05:08.023Z').getTime()).toBe(1283555108023);
    });


    it('should fake getLocalDateString method', function() {
      //0 in -3h
      var t0 = new angular.mock.TzDate(-3, 0);
      expect(t0.toLocaleDateString()).toMatch('1970');

      //0 in +0h
      var t1 = new angular.mock.TzDate(0, 0);
      expect(t1.toLocaleDateString()).toMatch('1970');

      //0 in +3h
      var t2 = new angular.mock.TzDate(3, 0);
      expect(t2.toLocaleDateString()).toMatch('1969');
    });


    it('should fake toISOString method', function() {
      var date = new angular.mock.TzDate(-1, '2009-10-09T01:02:03.027Z');

      if (new Date().toISOString) {
        expect(date.toISOString()).toEqual('2009-10-09T01:02:03.027Z');
      } else {
        expect(date.toISOString).toBeUndefined();
      }
    });


    it('should fake getHours method', function() {
      // avoid going negative due to #5017, so use Jan 2, 1970 00:00 UTC
      var jan2 = 24 * 60 * 60 * 1000;

      //0:00 in -3h
      var t0 = new angular.mock.TzDate(-3, jan2);
      expect(t0.getHours()).toBe(3);

      //0:00 in +0h
      var t1 = new angular.mock.TzDate(0, jan2);
      expect(t1.getHours()).toBe(0);

      //0:00 in +3h
      var t2 = new angular.mock.TzDate(3, jan2);
      expect(t2.getHours()).toMatch(21);
    });


    it('should fake getMinutes method', function() {
      //0:15 in -3h
      var t0 = new angular.mock.TzDate(-3, minutes(15));
      expect(t0.getMinutes()).toBe(15);

      //0:15 in -3.25h
      var t0a = new angular.mock.TzDate(-3.25, minutes(15));
      expect(t0a.getMinutes()).toBe(30);

      //0 in +0h
      var t1 = new angular.mock.TzDate(0, minutes(0));
      expect(t1.getMinutes()).toBe(0);

      //0:15 in +0h
      var t1a = new angular.mock.TzDate(0, minutes(15));
      expect(t1a.getMinutes()).toBe(15);

      //0:15 in +3h
      var t2 = new angular.mock.TzDate(3, minutes(15));
      expect(t2.getMinutes()).toMatch(15);

      //0:15 in +3.25h
      var t2a = new angular.mock.TzDate(3.25, minutes(15));
      expect(t2a.getMinutes()).toMatch(0);
    });


    it('should fake getSeconds method', function() {
      //0 in -3h
      var t0 = new angular.mock.TzDate(-3, 0);
      expect(t0.getSeconds()).toBe(0);

      //0 in +0h
      var t1 = new angular.mock.TzDate(0, 0);
      expect(t1.getSeconds()).toBe(0);

      //0 in +3h
      var t2 = new angular.mock.TzDate(3, 0);
      expect(t2.getSeconds()).toMatch(0);
    });


    it('should fake getMilliseconds method', function() {
      expect(new angular.mock.TzDate(0, '2010-09-03T23:05:08.003Z').getMilliseconds()).toBe(3);
      expect(new angular.mock.TzDate(0, '2010-09-03T23:05:08.023Z').getMilliseconds()).toBe(23);
      expect(new angular.mock.TzDate(0, '2010-09-03T23:05:08.123Z').getMilliseconds()).toBe(123);
    });


    it('should create a date representing new year in Bratislava', function() {
      var newYearInBratislava = new angular.mock.TzDate(-1, '2009-12-31T23:00:00.000Z');
      expect(newYearInBratislava.getTimezoneOffset()).toBe(-60);
      expect(newYearInBratislava.getFullYear()).toBe(2010);
      expect(newYearInBratislava.getMonth()).toBe(0);
      expect(newYearInBratislava.getDate()).toBe(1);
      expect(newYearInBratislava.getHours()).toBe(0);
      expect(newYearInBratislava.getMinutes()).toBe(0);
      expect(newYearInBratislava.getSeconds()).toBe(0);
    });


    it('should delegate all the UTC methods to the original UTC Date object', function() {
      //from when created from string
      var date1 = new angular.mock.TzDate(-1, '2009-12-31T23:00:00.000Z');
      expect(date1.getUTCFullYear()).toBe(2009);
      expect(date1.getUTCMonth()).toBe(11);
      expect(date1.getUTCDate()).toBe(31);
      expect(date1.getUTCHours()).toBe(23);
      expect(date1.getUTCMinutes()).toBe(0);
      expect(date1.getUTCSeconds()).toBe(0);


      //from when created from millis
      var date2 = new angular.mock.TzDate(-1, date1.getTime());
      expect(date2.getUTCFullYear()).toBe(2009);
      expect(date2.getUTCMonth()).toBe(11);
      expect(date2.getUTCDate()).toBe(31);
      expect(date2.getUTCHours()).toBe(23);
      expect(date2.getUTCMinutes()).toBe(0);
      expect(date2.getUTCSeconds()).toBe(0);
    });


    it('should throw error when no third param but toString called', function() {
      expect(function() { new angular.mock.TzDate(0,0).toString(); }).
                           toThrow('Method \'toString\' is not implemented in the TzDate mock');
    });
  });


  describe('$log', function() {
    angular.forEach([true, false], function(debugEnabled) {
      describe('debug ' + debugEnabled, function() {
        beforeEach(module(function($logProvider) {
          $logProvider.debugEnabled(debugEnabled);
        }));

        afterEach(inject(function($log) {
          $log.reset();
        }));

        it("should skip debugging output if disabled (" + debugEnabled + ")", inject(function($log) {
            $log.log('fake log');
            $log.info('fake log');
            $log.warn('fake log');
            $log.error('fake log');
            $log.debug('fake log');
            expect($log.log.logs).toContain(['fake log']);
            expect($log.info.logs).toContain(['fake log']);
            expect($log.warn.logs).toContain(['fake log']);
            expect($log.error.logs).toContain(['fake log']);
            if (debugEnabled) {
              expect($log.debug.logs).toContain(['fake log']);
            } else {
              expect($log.debug.logs).toEqual([]);
            }
          }));
      });
    });

    describe('debug enabled (default)', function() {
      var $log;
      beforeEach(inject(['$log', function(log) {
        $log = log;
      }]));

      afterEach(inject(function($log) {
        $log.reset();
      }));

      it('should provide the log method', function() {
        expect(function() { $log.log(''); }).not.toThrow();
      });

      it('should provide the info method', function() {
        expect(function() { $log.info(''); }).not.toThrow();
      });

      it('should provide the warn method', function() {
        expect(function() { $log.warn(''); }).not.toThrow();
      });

      it('should provide the error method', function() {
        expect(function() { $log.error(''); }).not.toThrow();
      });

      it('should provide the debug method', function() {
        expect(function() { $log.debug(''); }).not.toThrow();
      });

      it('should store log messages', function() {
        $log.log('fake log');
        expect($log.log.logs).toContain(['fake log']);
      });

      it('should store info messages', function() {
        $log.info('fake log');
        expect($log.info.logs).toContain(['fake log']);
      });

      it('should store warn messages', function() {
        $log.warn('fake log');
        expect($log.warn.logs).toContain(['fake log']);
      });

      it('should store error messages', function() {
        $log.error('fake log');
        expect($log.error.logs).toContain(['fake log']);
      });

      it('should store debug messages', function() {
        $log.debug('fake log');
        expect($log.debug.logs).toContain(['fake log']);
      });

      it('should assertEmpty', function() {
        try {
          $log.error(new Error('MyError'));
          $log.warn(new Error('MyWarn'));
          $log.info(new Error('MyInfo'));
          $log.log(new Error('MyLog'));
          $log.debug(new Error('MyDebug'));
          $log.assertEmpty();
        } catch (error) {
          var err = error.message || error;
          expect(err).toMatch(/Error: MyError/m);
          expect(err).toMatch(/Error: MyWarn/m);
          expect(err).toMatch(/Error: MyInfo/m);
          expect(err).toMatch(/Error: MyLog/m);
          expect(err).toMatch(/Error: MyDebug/m);
        } finally {
          $log.reset();
        }
      });

      it('should reset state', function() {
        $log.error(new Error('MyError'));
        $log.warn(new Error('MyWarn'));
        $log.info(new Error('MyInfo'));
        $log.log(new Error('MyLog'));
        $log.reset();
        var passed = false;
        try {
          $log.assertEmpty(); // should not throw error!
          passed = true;
        } catch (e) {
          passed = e;
        }
        expect(passed).toBe(true);
      });
    });
  });


  describe('$interval', function() {
    it('should run tasks repeatedly', inject(function($interval) {
      var counter = 0;
      $interval(function() { counter++; }, 1000);

      expect(counter).toBe(0);

      $interval.flush(1000);
      expect(counter).toBe(1);

      $interval.flush(1000);

      expect(counter).toBe(2);
    }));


    it('should call $apply after each task is executed', inject(function($interval, $rootScope) {
      var applySpy = spyOn($rootScope, '$apply').andCallThrough();

      $interval(noop, 1000);
      expect(applySpy).not.toHaveBeenCalled();

      $interval.flush(1000);
      expect(applySpy).toHaveBeenCalledOnce();

      applySpy.reset();

      $interval(noop, 1000);
      $interval(noop, 1000);
      $interval.flush(1000);
      expect(applySpy.callCount).toBe(3);
    }));


    it('should NOT call $apply if invokeApply is set to false',
        inject(function($interval, $rootScope) {
      var applySpy = spyOn($rootScope, '$apply').andCallThrough();

      var counter = 0;
      $interval(function increment() { counter++; }, 1000, 0, false);

      expect(applySpy).not.toHaveBeenCalled();
      expect(counter).toBe(0);

      $interval.flush(2000);
      expect(applySpy).not.toHaveBeenCalled();
      expect(counter).toBe(2);
    }));


    it('should allow you to specify the delay time', inject(function($interval) {
      var counter = 0;
      $interval(function() { counter++; }, 123);

      expect(counter).toBe(0);

      $interval.flush(122);
      expect(counter).toBe(0);

      $interval.flush(1);
      expect(counter).toBe(1);
    }));


    it('should allow you to specify a number of iterations', inject(function($interval) {
      var counter = 0;
      $interval(function() {counter++;}, 1000, 2);

      $interval.flush(1000);
      expect(counter).toBe(1);
      $interval.flush(1000);
      expect(counter).toBe(2);
      $interval.flush(1000);
      expect(counter).toBe(2);
    }));


    describe('flush', function() {
      it('should move the clock forward by the specified time', inject(function($interval) {
        var counterA = 0;
        var counterB = 0;
        $interval(function() { counterA++; }, 100);
        $interval(function() { counterB++; }, 401);

        $interval.flush(200);
        expect(counterA).toEqual(2);

        $interval.flush(201);
        expect(counterA).toEqual(4);
        expect(counterB).toEqual(1);
      }));
    });


    it('should return a promise which will be updated with the count on each iteration',
        inject(function($interval) {
      var log = [],
          promise = $interval(function() { log.push('tick'); }, 1000);

      promise.then(function(value) { log.push('promise success: ' + value); },
                   function(err) { log.push('promise error: ' + err); },
                   function(note) { log.push('promise update: ' + note); });
      expect(log).toEqual([]);

      $interval.flush(1000);
      expect(log).toEqual(['tick', 'promise update: 0']);

      $interval.flush(1000);
      expect(log).toEqual(['tick', 'promise update: 0', 'tick', 'promise update: 1']);
    }));


    it('should return a promise which will be resolved after the specified number of iterations',
        inject(function($interval) {
      var log = [],
          promise = $interval(function() { log.push('tick'); }, 1000, 2);

      promise.then(function(value) { log.push('promise success: ' + value); },
                   function(err) { log.push('promise error: ' + err); },
                   function(note) { log.push('promise update: ' + note); });
      expect(log).toEqual([]);

      $interval.flush(1000);
      expect(log).toEqual(['tick', 'promise update: 0']);
      $interval.flush(1000);

      expect(log).toEqual([
        'tick', 'promise update: 0', 'tick', 'promise update: 1', 'promise success: 2'
      ]);

    }));


    describe('exception handling', function() {
      beforeEach(module(function($exceptionHandlerProvider) {
        $exceptionHandlerProvider.mode('log');
      }));


      it('should delegate exception to the $exceptionHandler service', inject(
          function($interval, $exceptionHandler) {
        $interval(function() { throw "Test Error"; }, 1000);
        expect($exceptionHandler.errors).toEqual([]);

        $interval.flush(1000);
        expect($exceptionHandler.errors).toEqual(["Test Error"]);

        $interval.flush(1000);
        expect($exceptionHandler.errors).toEqual(["Test Error", "Test Error"]);
      }));


      it('should call $apply even if an exception is thrown in callback', inject(
          function($interval, $rootScope) {
        var applySpy = spyOn($rootScope, '$apply').andCallThrough();

        $interval(function() { throw "Test Error"; }, 1000);
        expect(applySpy).not.toHaveBeenCalled();

        $interval.flush(1000);
        expect(applySpy).toHaveBeenCalled();
      }));


      it('should still update the interval promise when an exception is thrown',
          inject(function($interval) {
        var log = [],
            promise = $interval(function() { throw "Some Error"; }, 1000);

        promise.then(function(value) { log.push('promise success: ' + value); },
                   function(err) { log.push('promise error: ' + err); },
                   function(note) { log.push('promise update: ' + note); });
        $interval.flush(1000);

        expect(log).toEqual(['promise update: 0']);
      }));
    });


    describe('cancel', function() {
      it('should cancel tasks', inject(function($interval) {
        var task1 = jasmine.createSpy('task1', 1000),
            task2 = jasmine.createSpy('task2', 1000),
            task3 = jasmine.createSpy('task3', 1000),
            promise1, promise3;

        promise1 = $interval(task1, 200);
        $interval(task2, 1000);
        promise3 = $interval(task3, 333);

        $interval.cancel(promise3);
        $interval.cancel(promise1);
        $interval.flush(1000);

        expect(task1).not.toHaveBeenCalled();
        expect(task2).toHaveBeenCalledOnce();
        expect(task3).not.toHaveBeenCalled();
      }));


      it('should cancel the promise', inject(function($interval, $rootScope) {
        var promise = $interval(noop, 1000),
            log = [];
        promise.then(function(value) { log.push('promise success: ' + value); },
                   function(err) { log.push('promise error: ' + err); },
                   function(note) { log.push('promise update: ' + note); });
        expect(log).toEqual([]);

        $interval.flush(1000);
        $interval.cancel(promise);
        $interval.flush(1000);
        $rootScope.$apply(); // For resolving the promise -
                             // necessary since q uses $rootScope.evalAsync.

        expect(log).toEqual(['promise update: 0', 'promise error: canceled']);
      }));


      it('should return true if a task was successfully canceled', inject(function($interval) {
        var task1 = jasmine.createSpy('task1'),
            task2 = jasmine.createSpy('task2'),
            promise1, promise2;

        promise1 = $interval(task1, 1000, 1);
        $interval.flush(1000);
        promise2 = $interval(task2, 1000, 1);

        expect($interval.cancel(promise1)).toBe(false);
        expect($interval.cancel(promise2)).toBe(true);
      }));


      it('should not throw a runtime exception when given an undefined promise',
          inject(function($interval) {
        var task1 = jasmine.createSpy('task1'),
            promise1;

        promise1 = $interval(task1, 1000, 1);

        expect($interval.cancel()).toBe(false);
      }));
    });
  });


  describe('defer', function() {
    var browser, log;
    beforeEach(inject(function($browser) {
      browser = $browser;
      log = '';
    }));

    function logFn(text) {
      return function() {
        log += text + ';';
      };
    }

    it('should flush', function() {
      browser.defer(logFn('A'));
      expect(log).toEqual('');
      browser.defer.flush();
      expect(log).toEqual('A;');
    });

    it('should flush delayed', function() {
      browser.defer(logFn('A'));
      browser.defer(logFn('B'), 10);
      browser.defer(logFn('C'), 20);
      expect(log).toEqual('');

      expect(browser.defer.now).toEqual(0);
      browser.defer.flush(0);
      expect(log).toEqual('A;');

      browser.defer.flush();
      expect(log).toEqual('A;B;C;');
    });

    it('should defer and flush over time', function() {
      browser.defer(logFn('A'), 1);
      browser.defer(logFn('B'), 2);
      browser.defer(logFn('C'), 3);

      browser.defer.flush(0);
      expect(browser.defer.now).toEqual(0);
      expect(log).toEqual('');

      browser.defer.flush(1);
      expect(browser.defer.now).toEqual(1);
      expect(log).toEqual('A;');

      browser.defer.flush(2);
      expect(browser.defer.now).toEqual(3);
      expect(log).toEqual('A;B;C;');
    });

    it('should throw an exception if there is nothing to be flushed', function() {
      expect(function() {browser.defer.flush();}).toThrow('No deferred tasks to be flushed');
    });
  });


  describe('$exceptionHandler', function() {
    it('should rethrow exceptions', inject(function($exceptionHandler) {
      expect(function() { $exceptionHandler('myException'); }).toThrow('myException');
    }));


    it('should log exceptions', function() {
      module(function($exceptionHandlerProvider) {
        $exceptionHandlerProvider.mode('log');
      });
      inject(function($exceptionHandler) {
        $exceptionHandler('MyError');
        expect($exceptionHandler.errors).toEqual(['MyError']);

        $exceptionHandler('MyError', 'comment');
        expect($exceptionHandler.errors[1]).toEqual(['MyError', 'comment']);
      });
    });

    it('should log and rethrow exceptions', function() {
      module(function($exceptionHandlerProvider) {
        $exceptionHandlerProvider.mode('rethrow');
      });
      inject(function($exceptionHandler) {
        expect(function() { $exceptionHandler('MyError'); }).toThrow('MyError');
        expect($exceptionHandler.errors).toEqual(['MyError']);

        expect(function() { $exceptionHandler('MyError', 'comment'); }).toThrow('MyError');
        expect($exceptionHandler.errors[1]).toEqual(['MyError', 'comment']);
      });
    });

    it('should throw on wrong argument', function() {
      module(function($exceptionHandlerProvider) {
        expect(function() {
          $exceptionHandlerProvider.mode('XXX');
        }).toThrow("Unknown mode 'XXX', only 'log'/'rethrow' modes are allowed!");
      });

      inject(); // Trigger the tests in `module`
    });

  });


  describe('$timeout', function() {
    it('should expose flush method that will flush the pending queue of tasks', inject(
        function($timeout) {
      var logger = [],
          logFn = function(msg) { return function() { logger.push(msg); }; };

      $timeout(logFn('t1'));
      $timeout(logFn('t2'), 200);
      $timeout(logFn('t3'));
      expect(logger).toEqual([]);

      $timeout.flush();
      expect(logger).toEqual(['t1', 't3', 't2']);
    }));


    it('should throw an exception when not flushed', inject(function($timeout) {
      $timeout(noop);

      var expectedError = 'Deferred tasks to flush (1): {id: 0, time: 0}';
      expect(function() {$timeout.verifyNoPendingTasks();}).toThrow(expectedError);
    }));


    it('should do nothing when all tasks have been flushed', inject(function($timeout) {
      $timeout(noop);

      $timeout.flush();
      expect(function() {$timeout.verifyNoPendingTasks();}).not.toThrow();
    }));


    it('should check against the delay if provided within timeout', inject(function($timeout) {
      $timeout(noop, 100);
      $timeout.flush(100);
      expect(function() {$timeout.verifyNoPendingTasks();}).not.toThrow();

      $timeout(noop, 1000);
      $timeout.flush(100);
      expect(function() {$timeout.verifyNoPendingTasks();}).toThrow();

      $timeout.flush(900);
      expect(function() {$timeout.verifyNoPendingTasks();}).not.toThrow();
    }));


    it('should assert against the delay value', inject(function($timeout) {
      var count = 0;
      var iterate = function() {
        count++;
      };

      $timeout(iterate, 100);
      $timeout(iterate, 123);
      $timeout.flush(100);
      expect(count).toBe(1);
      $timeout.flush(123);
      expect(count).toBe(2);
    }));
  });


  describe('angular.mock.dump', function() {
    var d = angular.mock.dump;


    it('should serialize primitive types', function() {
      expect(d(undefined)).toEqual('undefined');
      expect(d(1)).toEqual('1');
      expect(d(null)).toEqual('null');
      expect(d('abc')).toEqual('abc');
    });


    it('should serialize element', function() {
      var e = angular.element('<div>abc</div><span>xyz</span>');
      expect(d(e).toLowerCase()).toEqual('<div>abc</div><span>xyz</span>');
      expect(d(e[0]).toLowerCase()).toEqual('<div>abc</div>');
    });

    it('should serialize scope', inject(function($rootScope) {
      $rootScope.obj = {abc:'123'};
      expect(d($rootScope)).toMatch(/Scope\(.*\): \{/);
      expect(d($rootScope)).toMatch(/{"abc":"123"}/);
    }));

    it('should serialize scope that has overridden "hasOwnProperty"', inject(function($rootScope, $sniffer) {
      /* jshint -W001 */
      $rootScope.hasOwnProperty = 'X';
      expect(d($rootScope)).toMatch(/Scope\(.*\): \{/);
      expect(d($rootScope)).toMatch(/hasOwnProperty: "X"/);
    }));
  });


  describe('jasmine module and inject', function() {
    var log;

    beforeEach(function() {
      log = '';
    });

    describe('module', function() {

      describe('object literal format', function() {
        var mock = { log: 'module' };

        beforeEach(function() {
          module({
              'service': mock,
              'other': { some: 'replacement'}
            },
            'ngResource',
            function($provide) { $provide.value('example', 'win'); }
          );
        });

        it('should inject the mocked module', function() {
          inject(function(service) {
            expect(service).toEqual(mock);
          });
        });

        it('should support multiple key value pairs', function() {
          inject(function(service, other) {
            expect(other.some).toEqual('replacement');
            expect(service).toEqual(mock);
          });
        });

        it('should integrate with string and function', function() {
          inject(function(service, $resource, example) {
            expect(service).toEqual(mock);
            expect($resource).toBeDefined();
            expect(example).toEqual('win');
          });
        });

        describe('module cleanup', function() {
          function testFn() {

          }

          it('should add hashKey to module function', function() {
            module(testFn);
            inject(function() {
              expect(testFn.$$hashKey).toBeDefined();
            });
          });

          it('should cleanup hashKey after previous test', function() {
            expect(testFn.$$hashKey).toBeUndefined();
          });
        });

        describe('$inject cleanup', function() {
          function testFn() {

          }

          it('should add $inject when invoking test function', inject(function($injector) {
            $injector.invoke(testFn);
            expect(testFn.$inject).toBeDefined();
          }));

          it('should cleanup $inject after previous test', function() {
            expect(testFn.$inject).toBeUndefined();
          });

          it('should add $inject when annotating test function', inject(function($injector) {
            $injector.annotate(testFn);
            expect(testFn.$inject).toBeDefined();
          }));

          it('should cleanup $inject after previous test', function() {
            expect(testFn.$inject).toBeUndefined();
          });

          it('should invoke an already annotated function', inject(function($injector) {
            testFn.$inject = [];
            $injector.invoke(testFn);
          }));

          it('should not cleanup $inject after previous test', function() {
            expect(testFn.$inject).toBeDefined();
          });
        });
      });

      describe('in DSL', function() {
        it('should load module', module(function() {
          log += 'module';
        }));

        afterEach(function() {
          inject();
          expect(log).toEqual('module');
        });
      });


      describe('inline in test', function() {
        it('should load module', function() {
          module(function() {
            log += 'module';
          });
          inject();
        });

        afterEach(function() {
          expect(log).toEqual('module');
        });
      });
    });

    describe('inject', function() {
      describe('in DSL', function() {
        it('should load module', inject(function() {
          log += 'inject';
        }));

        afterEach(function() {
          expect(log).toEqual('inject');
        });
      });


      describe('inline in test', function() {
        it('should load module', function() {
          inject(function() {
            log += 'inject';
          });
        });

        afterEach(function() {
          expect(log).toEqual('inject');
        });
      });

      describe('module with inject', function() {
        beforeEach(module(function() {
          log += 'module;';
        }));

        it('should inject', inject(function() {
          log += 'inject;';
        }));

        afterEach(function() {
          expect(log).toEqual('module;inject;');
        });
      });


      describe('this', function() {

        it('should set `this` to be the jasmine context', inject(function() {
          expect(this instanceof jasmine.Spec).toBe(true);
        }));

        it('should set `this` to be the jasmine context when inlined in a test', function() {
          var tested = false;

          inject(function() {
            expect(this instanceof jasmine.Spec).toBe(true);
            tested = true;
          });

          expect(tested).toBe(true);
        });
      });


      it('should not change thrown Errors', inject(function($sniffer) {
        expect(function() {
          inject(function() {
            throw new Error('test message');
          });
        }).toThrow('test message');
      }));

      it('should not change thrown strings', inject(function($sniffer) {
        expect(function() {
          inject(function() {
            throw 'test message';
          });
        }).toThrow('test message');
      }));
    });
  });


  describe('$httpBackend', function() {
    var hb, callback, realBackendSpy;

    beforeEach(inject(function($httpBackend) {
      callback = jasmine.createSpy('callback');
      hb = $httpBackend;
    }));

    it('should provide "expect" methods for each HTTP verb', function() {
      expect(typeof hb.expectGET).toBe("function");
      expect(typeof hb.expectPOST).toBe("function");
      expect(typeof hb.expectPUT).toBe("function");
      expect(typeof hb.expectPATCH).toBe("function");
      expect(typeof hb.expectDELETE).toBe("function");
      expect(typeof hb.expectHEAD).toBe("function");
    });


    it('should provide "when" methods for each HTTP verb', function() {
      expect(typeof hb.whenGET).toBe("function");
      expect(typeof hb.whenPOST).toBe("function");
      expect(typeof hb.whenPUT).toBe("function");
      expect(typeof hb.whenPATCH).toBe("function");
      expect(typeof hb.whenDELETE).toBe("function");
      expect(typeof hb.whenHEAD).toBe("function");
    });


    it('should respond with first matched definition', function() {
      hb.when('GET', '/url1').respond(200, 'content', {});
      hb.when('GET', '/url1').respond(201, 'another', {});

      callback.andCallFake(function(status, response) {
        expect(status).toBe(200);
        expect(response).toBe('content');
      });

      hb('GET', '/url1', null, callback);
      expect(callback).not.toHaveBeenCalled();
      hb.flush();
      expect(callback).toHaveBeenCalledOnce();
    });


    it('should respond with a copy of the mock data', function() {
      var mockObject = {a: 'b'};

      hb.when('GET', '/url1').respond(200, mockObject, {});

      callback.andCallFake(function(status, response) {
        expect(status).toBe(200);
        expect(response).toEqual({a: 'b'});
        expect(response).not.toBe(mockObject);
        response.a = 'c';
      });

      hb('GET', '/url1', null, callback);
      hb.flush();
      expect(callback).toHaveBeenCalledOnce();

      // Fire it again and verify that the returned mock data has not been
      // modified.
      callback.reset();
      hb('GET', '/url1', null, callback);
      hb.flush();
      expect(callback).toHaveBeenCalledOnce();
      expect(mockObject).toEqual({a: 'b'});
    });


    it('should throw error when unexpected request', function() {
      hb.when('GET', '/url1').respond(200, 'content');
      expect(function() {
        hb('GET', '/xxx');
      }).toThrow('Unexpected request: GET /xxx\nNo more request expected');
    });


    it('should match headers if specified', function() {
      hb.when('GET', '/url', null, {'X': 'val1'}).respond(201, 'content1');
      hb.when('GET', '/url', null, {'X': 'val2'}).respond(202, 'content2');
      hb.when('GET', '/url').respond(203, 'content3');

      hb('GET', '/url', null, function(status, response) {
        expect(status).toBe(203);
        expect(response).toBe('content3');
      });

      hb('GET', '/url', null, function(status, response) {
        expect(status).toBe(201);
        expect(response).toBe('content1');
      }, {'X': 'val1'});

      hb('GET', '/url', null, function(status, response) {
        expect(status).toBe(202);
        expect(response).toBe('content2');
      }, {'X': 'val2'});

      hb.flush();
    });


    it('should match data if specified', function() {
      hb.when('GET', '/a/b', '{a: true}').respond(201, 'content1');
      hb.when('GET', '/a/b').respond(202, 'content2');

      hb('GET', '/a/b', '{a: true}', function(status, response) {
        expect(status).toBe(201);
        expect(response).toBe('content1');
      });

      hb('GET', '/a/b', null, function(status, response) {
        expect(status).toBe(202);
        expect(response).toBe('content2');
      });

      hb.flush();
    });


    it('should match data object if specified', function() {
      hb.when('GET', '/a/b', {a: 1, b: 2}).respond(201, 'content1');
      hb.when('GET', '/a/b').respond(202, 'content2');

      hb('GET', '/a/b', '{"a":1,"b":2}', function(status, response) {
        expect(status).toBe(201);
        expect(response).toBe('content1');
      });

      hb('GET', '/a/b', '{"b":2,"a":1}', function(status, response) {
        expect(status).toBe(201);
        expect(response).toBe('content1');
      });

      hb('GET', '/a/b', null, function(status, response) {
        expect(status).toBe(202);
        expect(response).toBe('content2');
      });

      hb.flush();
    });


    it('should match only method', function() {
      hb.when('GET').respond(202, 'c');
      callback.andCallFake(function(status, response) {
        expect(status).toBe(202);
        expect(response).toBe('c');
      });

      hb('GET', '/some', null, callback, {});
      hb('GET', '/another', null, callback, {'X-Fake': 'Header'});
      hb('GET', '/third', 'some-data', callback, {});
      hb.flush();

      expect(callback).toHaveBeenCalled();
    });


    it('should preserve the order of requests', function() {
      hb.when('GET', '/url1').respond(200, 'first');
      hb.when('GET', '/url2').respond(201, 'second');

      hb('GET', '/url2', null, callback);
      hb('GET', '/url1', null, callback);

      hb.flush();

      expect(callback.callCount).toBe(2);
      expect(callback.argsForCall[0]).toEqual([201, 'second', '', '']);
      expect(callback.argsForCall[1]).toEqual([200, 'first', '', '']);
    });


    describe('respond()', function() {
      it('should take values', function() {
        hb.expect('GET', '/url1').respond(200, 'first', {'header': 'val'}, 'OK');
        hb('GET', '/url1', undefined, callback);
        hb.flush();

        expect(callback).toHaveBeenCalledOnceWith(200, 'first', 'header: val', 'OK');
      });

      it('should default status code to 200', function() {
        callback.andCallFake(function(status, response) {
          expect(status).toBe(200);
          expect(response).toBe('some-data');
        });

        hb.expect('GET', '/url1').respond('some-data');
        hb.expect('GET', '/url2').respond('some-data', {'X-Header': 'true'});
        hb('GET', '/url1', null, callback);
        hb('GET', '/url2', null, callback);
        hb.flush();
        expect(callback).toHaveBeenCalled();
        expect(callback.callCount).toBe(2);
      });

      it('should default status code to 200 and provide status text', function() {
        hb.expect('GET', '/url1').respond('first', {'header': 'val'}, 'OK');
        hb('GET', '/url1', null, callback);
        hb.flush();

        expect(callback).toHaveBeenCalledOnceWith(200, 'first', 'header: val', 'OK');
      });

      it('should take function', function() {
        hb.expect('GET', '/some').respond(function(m, u, d, h) {
          return [301, m + u + ';' + d + ';a=' + h.a, {'Connection': 'keep-alive'}, 'Moved Permanently'];
        });

        hb('GET', '/some', 'data', callback, {a: 'b'});
        hb.flush();

        expect(callback).toHaveBeenCalledOnceWith(301, 'GET/some;data;a=b', 'Connection: keep-alive', 'Moved Permanently');
      });

      it('should default response headers to ""', function() {
        hb.expect('GET', '/url1').respond(200, 'first');
        hb.expect('GET', '/url2').respond('second');

        hb('GET', '/url1', null, callback);
        hb('GET', '/url2', null, callback);

        hb.flush();

        expect(callback.callCount).toBe(2);
        expect(callback.argsForCall[0]).toEqual([200, 'first', '', '']);
        expect(callback.argsForCall[1]).toEqual([200, 'second', '', '']);
      });

      it('should be able to override response of expect definition', function() {
        var definition = hb.expect('GET', '/url1');
        definition.respond('first');
        definition.respond('second');

        hb('GET', '/url1', null, callback);
        hb.flush();
        expect(callback).toHaveBeenCalledOnceWith(200, 'second', '', '');
      });

      it('should be able to override response of when definition', function() {
        var definition = hb.when('GET', '/url1');
        definition.respond('first');
        definition.respond('second');

        hb('GET', '/url1', null, callback);
        hb.flush();
        expect(callback).toHaveBeenCalledOnceWith(200, 'second', '', '');
      });

      it('should be able to override response of expect definition with chaining', function() {
        var definition = hb.expect('GET', '/url1').respond('first');
        definition.respond('second');

        hb('GET', '/url1', null, callback);
        hb.flush();
        expect(callback).toHaveBeenCalledOnceWith(200, 'second', '', '');
      });

      it('should be able to override response of when definition with chaining', function() {
        var definition = hb.when('GET', '/url1').respond('first');
        definition.respond('second');

        hb('GET', '/url1', null, callback);
        hb.flush();
        expect(callback).toHaveBeenCalledOnceWith(200, 'second', '', '');
      });
    });


    describe('expect()', function() {
      it('should require specified order', function() {
        hb.expect('GET', '/url1').respond(200, '');
        hb.expect('GET', '/url2').respond(200, '');

        expect(function() {
          hb('GET', '/url2', null, noop, {});
        }).toThrow('Unexpected request: GET /url2\nExpected GET /url1');
      });


      it('should have precedence over when()', function() {
        callback.andCallFake(function(status, response) {
          expect(status).toBe(300);
          expect(response).toBe('expect');
        });

        hb.when('GET', '/url').respond(200, 'when');
        hb.expect('GET', '/url').respond(300, 'expect');

        hb('GET', '/url', null, callback, {});
        hb.flush();
        expect(callback).toHaveBeenCalledOnce();
      });


      it('should throw exception when only headers differs from expectation', function() {
        hb.when('GET').respond(200, '', {});
        hb.expect('GET', '/match', undefined, {'Content-Type': 'application/json'});

        expect(function() {
          hb('GET', '/match', null, noop, {});
        }).toThrow('Expected GET /match with different headers\n' +
                   'EXPECTED: {"Content-Type":"application/json"}\nGOT:      {}');
      });


      it('should throw exception when only data differs from expectation', function() {
        hb.when('GET').respond(200, '', {});
        hb.expect('GET', '/match', 'some-data');

        expect(function() {
          hb('GET', '/match', 'different', noop, {});
        }).toThrow('Expected GET /match with different data\n' +
                   'EXPECTED: some-data\nGOT:      different');
      });


      it('should not throw an exception when parsed body is equal to expected body object', function() {
        hb.when('GET').respond(200, '', {});

        hb.expect('GET', '/match', {a: 1, b: 2});
        expect(function() {
          hb('GET', '/match', '{"a":1,"b":2}', noop, {});
        }).not.toThrow();

        hb.expect('GET', '/match', {a: 1, b: 2});
        expect(function() {
          hb('GET', '/match', '{"b":2,"a":1}', noop, {});
        }).not.toThrow();
      });


      it('should throw exception when only parsed body differs from expected body object', function() {
        hb.when('GET').respond(200, '', {});
        hb.expect('GET', '/match', {a: 1, b: 2});

        expect(function() {
          hb('GET', '/match', '{"a":1,"b":3}', noop, {});
        }).toThrow('Expected GET /match with different data\n' +
                   'EXPECTED: {"a":1,"b":2}\nGOT:      {"a":1,"b":3}');
      });


      it("should use when's respond() when no expect() respond is defined", function() {
        callback.andCallFake(function(status, response) {
          expect(status).toBe(201);
          expect(response).toBe('data');
        });

        hb.when('GET', '/some').respond(201, 'data');
        hb.expect('GET', '/some');
        hb('GET', '/some', null, callback);
        hb.flush();

        expect(callback).toHaveBeenCalled();
        expect(function() { hb.verifyNoOutstandingExpectation(); }).not.toThrow();
      });
    });


    describe('flush()', function() {
      it('flush() should flush requests fired during callbacks', function() {
        hb.when('GET').respond(200, '');
        hb('GET', '/some', null, function() {
          hb('GET', '/other', null, callback);
        });

        hb.flush();
        expect(callback).toHaveBeenCalled();
      });


      it('should flush given number of pending requests', function() {
        hb.when('GET').respond(200, '');
        hb('GET', '/some', null, callback);
        hb('GET', '/some', null, callback);
        hb('GET', '/some', null, callback);

        hb.flush(2);
        expect(callback).toHaveBeenCalled();
        expect(callback.callCount).toBe(2);
      });


      it('should throw exception when flushing more requests than pending', function() {
        hb.when('GET').respond(200, '');
        hb('GET', '/url', null, callback);

        expect(function() {hb.flush(2);}).toThrow('No more pending request to flush !');
        expect(callback).toHaveBeenCalledOnce();
      });


      it('should throw exception when no request to flush', function() {
        expect(function() {hb.flush();}).toThrow('No pending request to flush !');

        hb.when('GET').respond(200, '');
        hb('GET', '/some', null, callback);
        hb.flush();

        expect(function() {hb.flush();}).toThrow('No pending request to flush !');
      });


      it('should throw exception if not all expectations satisfied', function() {
        hb.expect('GET', '/url1').respond();
        hb.expect('GET', '/url2').respond();

        hb('GET', '/url1', null, angular.noop);
        expect(function() {hb.flush();}).toThrow('Unsatisfied requests: GET /url2');
      });
    });


    it('should abort requests when timeout promise resolves', function() {
      hb.expect('GET', '/url1').respond(200);

      var canceler, then = jasmine.createSpy('then').andCallFake(function(fn) {
        canceler = fn;
      });

      hb('GET', '/url1', null, callback, null, {then: then});
      expect(typeof canceler).toBe('function');

      canceler();  // simulate promise resolution

      expect(callback).toHaveBeenCalledWith(-1, undefined, '');
      hb.verifyNoOutstandingExpectation();
      hb.verifyNoOutstandingRequest();
    });


    it('should abort requests when timeout passed as a numeric value', inject(function($timeout) {
      hb.expect('GET', '/url1').respond(200);

      hb('GET', '/url1', null, callback, null, 200);
      $timeout.flush(300);

      expect(callback).toHaveBeenCalledWith(-1, undefined, '');
      hb.verifyNoOutstandingExpectation();
      hb.verifyNoOutstandingRequest();
    }));


    it('should throw an exception if no response defined', function() {
      hb.when('GET', '/test');
      expect(function() {
        hb('GET', '/test', null, callback);
      }).toThrow('No response defined !');
    });


    it('should throw an exception if no response for exception and no definition', function() {
      hb.expect('GET', '/url');
      expect(function() {
        hb('GET', '/url', null, callback);
      }).toThrow('No response defined !');
    });


    it('should respond undefined when JSONP method', function() {
      hb.when('JSONP', '/url1').respond(200);
      hb.expect('JSONP', '/url2').respond(200);

      expect(hb('JSONP', '/url1')).toBeUndefined();
      expect(hb('JSONP', '/url2')).toBeUndefined();
    });


    it('should not have passThrough method', function() {
      expect(hb.passThrough).toBeUndefined();
    });


    describe('verifyExpectations', function() {

      it('should throw exception if not all expectations were satisfied', function() {
        hb.expect('POST', '/u1', 'ddd').respond(201, '', {});
        hb.expect('GET', '/u2').respond(200, '', {});
        hb.expect('POST', '/u3').respond(201, '', {});

        hb('POST', '/u1', 'ddd', noop, {});

        expect(function() {hb.verifyNoOutstandingExpectation();}).
          toThrow('Unsatisfied requests: GET /u2, POST /u3');
      });


      it('should do nothing when no expectation', function() {
        hb.when('DELETE', '/some').respond(200, '');

        expect(function() {hb.verifyNoOutstandingExpectation();}).not.toThrow();
      });


      it('should do nothing when all expectations satisfied', function() {
        hb.expect('GET', '/u2').respond(200, '', {});
        hb.expect('POST', '/u3').respond(201, '', {});
        hb.when('DELETE', '/some').respond(200, '');

        hb('GET', '/u2', noop);
        hb('POST', '/u3', noop);

        expect(function() {hb.verifyNoOutstandingExpectation();}).not.toThrow();
      });
    });

    describe('verifyRequests', function() {

      it('should throw exception if not all requests were flushed', function() {
        hb.when('GET').respond(200);
        hb('GET', '/some', null, noop, {});

        expect(function() {
          hb.verifyNoOutstandingRequest();
        }).toThrow('Unflushed requests: 1');
      });
    });


    describe('resetExpectations', function() {

      it('should remove all expectations', function() {
        hb.expect('GET', '/u2').respond(200, '', {});
        hb.expect('POST', '/u3').respond(201, '', {});
        hb.resetExpectations();

        expect(function() {hb.verifyNoOutstandingExpectation();}).not.toThrow();
      });


      it('should remove all pending responses', function() {
        var cancelledClb = jasmine.createSpy('cancelled');

        hb.expect('GET', '/url').respond(200, '');
        hb('GET', '/url', null, cancelledClb);
        hb.resetExpectations();

        hb.expect('GET', '/url').respond(300, '');
        hb('GET', '/url', null, callback, {});
        hb.flush();

        expect(callback).toHaveBeenCalledOnce();
        expect(cancelledClb).not.toHaveBeenCalled();
      });


      it('should not remove definitions', function() {
        var cancelledClb = jasmine.createSpy('cancelled');

        hb.when('GET', '/url').respond(200, 'success');
        hb('GET', '/url', null, cancelledClb);
        hb.resetExpectations();

        hb('GET', '/url', null, callback, {});
        hb.flush();

        expect(callback).toHaveBeenCalledOnce();
        expect(cancelledClb).not.toHaveBeenCalled();
      });
    });


    describe('expect/when shortcuts', function() {
      angular.forEach(['expect', 'when'], function(prefix) {
        angular.forEach(['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'JSONP'], function(method) {
          var shortcut = prefix + method;
          it('should provide ' + shortcut + ' shortcut method', function() {
            hb[shortcut]('/foo').respond('bar');
            hb(method, '/foo', undefined, callback);
            hb.flush();
            expect(callback).toHaveBeenCalledOnceWith(200, 'bar', '', '');
          });
        });
      });
    });


    describe('MockHttpExpectation', function() {
      /* global MockHttpExpectation */

      it('should accept url as regexp', function() {
        var exp = new MockHttpExpectation('GET', /^\/x/);

        expect(exp.match('GET', '/x')).toBe(true);
        expect(exp.match('GET', '/xxx/x')).toBe(true);
        expect(exp.match('GET', 'x')).toBe(false);
        expect(exp.match('GET', 'a/x')).toBe(false);
      });


      it('should accept url as function', function() {
        var urlValidator = function(url) {
          return url !== '/not-accepted';
        };
        var exp = new MockHttpExpectation('POST', urlValidator);

        expect(exp.match('POST', '/url')).toBe(true);
        expect(exp.match('POST', '/not-accepted')).toBe(false);
      });


      it('should accept data as regexp', function() {
        var exp = new MockHttpExpectation('POST', '/url', /\{.*?\}/);

        expect(exp.match('POST', '/url', '{"a": "aa"}')).toBe(true);
        expect(exp.match('POST', '/url', '{"one": "two"}')).toBe(true);
        expect(exp.match('POST', '/url', '{"one"')).toBe(false);
      });


      it('should accept data as function', function() {
        var dataValidator = function(data) {
          var json = angular.fromJson(data);
          return !!json.id && json.status === 'N';
        };
        var exp = new MockHttpExpectation('POST', '/url', dataValidator);

        expect(exp.matchData({})).toBe(false);
        expect(exp.match('POST', '/url', '{"id": "xxx", "status": "N"}')).toBe(true);
        expect(exp.match('POST', '/url', {"id": "xxx", "status": "N"})).toBe(true);
      });


      it('should ignore data only if undefined (not null or false)', function() {
        var exp = new MockHttpExpectation('POST', '/url', null);
        expect(exp.matchData(null)).toBe(true);
        expect(exp.matchData('some-data')).toBe(false);

        exp = new MockHttpExpectation('POST', '/url', undefined);
        expect(exp.matchData(null)).toBe(true);
        expect(exp.matchData('some-data')).toBe(true);
      });


      it('should accept headers as function', function() {
        var exp = new MockHttpExpectation('GET', '/url', undefined, function(h) {
          return h['Content-Type'] == 'application/json';
        });

        expect(exp.matchHeaders({})).toBe(false);
        expect(exp.matchHeaders({'Content-Type': 'application/json', 'X-Another': 'true'})).toBe(true);
      });
    });
  });


  describe('$rootElement', function() {
    it('should create mock application root', inject(function($rootElement) {
      expect($rootElement.text()).toEqual('');
    }));
  });


  describe('$rootScopeDecorator', function() {

    describe('$countChildScopes', function() {

      it('should return 0 when no child scopes', inject(function($rootScope) {
        expect($rootScope.$countChildScopes()).toBe(0);

        var childScope = $rootScope.$new();
        expect($rootScope.$countChildScopes()).toBe(1);
        expect(childScope.$countChildScopes()).toBe(0);

        var grandChildScope = childScope.$new();
        expect(childScope.$countChildScopes()).toBe(1);
        expect(grandChildScope.$countChildScopes()).toBe(0);
      }));


      it('should correctly navigate complex scope tree', inject(function($rootScope) {
        var child;

        $rootScope.$new();
        $rootScope.$new().$new().$new();
        child = $rootScope.$new().$new();
        child.$new();
        child.$new();
        child.$new().$new().$new();

        expect($rootScope.$countChildScopes()).toBe(11);
      }));


      it('should provide the current count even after child destructions', inject(function($rootScope) {
        expect($rootScope.$countChildScopes()).toBe(0);

        var childScope1 = $rootScope.$new();
        expect($rootScope.$countChildScopes()).toBe(1);

        var childScope2 = $rootScope.$new();
        expect($rootScope.$countChildScopes()).toBe(2);

        childScope1.$destroy();
        expect($rootScope.$countChildScopes()).toBe(1);

        childScope2.$destroy();
        expect($rootScope.$countChildScopes()).toBe(0);
      }));


      it('should work with isolate scopes', inject(function($rootScope) {
        /*
                  RS
                  |
                 CIS
                /   \
              GCS   GCIS
         */

        var childIsolateScope = $rootScope.$new(true);
        expect($rootScope.$countChildScopes()).toBe(1);

        var grandChildScope = childIsolateScope.$new();
        expect($rootScope.$countChildScopes()).toBe(2);
        expect(childIsolateScope.$countChildScopes()).toBe(1);

        var grandChildIsolateScope = childIsolateScope.$new(true);
        expect($rootScope.$countChildScopes()).toBe(3);
        expect(childIsolateScope.$countChildScopes()).toBe(2);

        childIsolateScope.$destroy();
        expect($rootScope.$countChildScopes()).toBe(0);
      }));
    });


    describe('$countWatchers', function() {

      it('should return the sum of watchers for the current scope and all of its children', inject(
        function($rootScope) {

          expect($rootScope.$countWatchers()).toBe(0);

          var childScope = $rootScope.$new();
          expect($rootScope.$countWatchers()).toBe(0);

          childScope.$watch('foo');
          expect($rootScope.$countWatchers()).toBe(1);
          expect(childScope.$countWatchers()).toBe(1);

          $rootScope.$watch('bar');
          childScope.$watch('baz');
          expect($rootScope.$countWatchers()).toBe(3);
          expect(childScope.$countWatchers()).toBe(2);
      }));


      it('should correctly navigate complex scope tree', inject(function($rootScope) {
        var child;

        $rootScope.$watch('foo1');

        $rootScope.$new();
        $rootScope.$new().$new().$new();

        child = $rootScope.$new().$new();
        child.$watch('foo2');
        child.$new();
        child.$new();
        child = child.$new().$new().$new();
        child.$watch('foo3');
        child.$watch('foo4');

        expect($rootScope.$countWatchers()).toBe(4);
      }));


      it('should provide the current count even after child destruction and watch deregistration',
          inject(function($rootScope) {

        var deregisterWatch1 = $rootScope.$watch('exp1');

        var childScope = $rootScope.$new();
        childScope.$watch('exp2');

        expect($rootScope.$countWatchers()).toBe(2);

        childScope.$destroy();
        expect($rootScope.$countWatchers()).toBe(1);

        deregisterWatch1();
        expect($rootScope.$countWatchers()).toBe(0);
      }));


      it('should work with isolate scopes', inject(function($rootScope) {
        /*
                 RS=1
                   |
                CIS=1
                /    \
            GCS=1  GCIS=1
         */

        $rootScope.$watch('exp1');
        expect($rootScope.$countWatchers()).toBe(1);

        var childIsolateScope = $rootScope.$new(true);
        childIsolateScope.$watch('exp2');
        expect($rootScope.$countWatchers()).toBe(2);
        expect(childIsolateScope.$countWatchers()).toBe(1);

        var grandChildScope = childIsolateScope.$new();
        grandChildScope.$watch('exp3');

        var grandChildIsolateScope = childIsolateScope.$new(true);
        grandChildIsolateScope.$watch('exp4');

        expect($rootScope.$countWatchers()).toBe(4);
        expect(childIsolateScope.$countWatchers()).toBe(3);
        expect(grandChildScope.$countWatchers()).toBe(1);
        expect(grandChildIsolateScope.$countWatchers()).toBe(1);

        childIsolateScope.$destroy();
        expect($rootScope.$countWatchers()).toBe(1);
      }));
    });
  });


  describe('$controllerDecorator', function() {
    it('should support creating controller with bindings', function() {
      var called = false;
      var data = [
        { name: 'derp1', id: 0 },
        { name: 'testname', id: 1 },
        { name: 'flurp', id: 2 }
      ];
      module(function($controllerProvider) {
        $controllerProvider.register('testCtrl', function() {
          called = true;
          expect(this.data).toBe(data);
        });
      });
      inject(function($controller, $rootScope) {
        $controller('testCtrl', { scope: $rootScope }, { data: data });
        expect(called).toBe(true);
      });
    });
  });
});


describe('ngMockE2E', function() {
  describe('$httpBackend', function() {
    var hb, realHttpBackend, callback;

    beforeEach(function() {
      module(function($provide) {
        callback = jasmine.createSpy('callback');
        realHttpBackend = jasmine.createSpy('real $httpBackend');
        $provide.value('$httpBackend', realHttpBackend);
        $provide.decorator('$httpBackend', angular.mock.e2e.$httpBackendDecorator);
      });
      inject(function($injector) {
        hb = $injector.get('$httpBackend');
      });
    });


    describe('passThrough()', function() {
      it('should delegate requests to the real backend when passThrough is invoked', function() {
        hb.when('GET', /\/passThrough\/.*/).passThrough();
        hb('GET', '/passThrough/23', null, callback, {}, null, true);

        expect(realHttpBackend).toHaveBeenCalledOnceWith(
            'GET', '/passThrough/23', null, callback, {}, null, true);
      });

      it('should be able to override a respond definition with passThrough', function() {
        var definition = hb.when('GET', /\/passThrough\/.*/).respond('override me');
        definition.passThrough();
        hb('GET', '/passThrough/23', null, callback, {}, null, true);

        expect(realHttpBackend).toHaveBeenCalledOnceWith(
            'GET', '/passThrough/23', null, callback, {}, null, true);
      });

      it('should be able to override a respond definition with passThrough', inject(function($browser) {
        var definition = hb.when('GET', /\/passThrough\/.*/).passThrough();
        definition.respond('passThrough override');
        hb('GET', '/passThrough/23', null, callback, {}, null, true);
        $browser.defer.flush();

        expect(realHttpBackend).not.toHaveBeenCalled();
        expect(callback).toHaveBeenCalledOnceWith(200, 'passThrough override', '', '');
      }));
    });


    describe('autoflush', function() {
      it('should flush responses via $browser.defer', inject(function($browser) {
        hb.when('GET', '/foo').respond('bar');
        hb('GET', '/foo', null, callback);

        expect(callback).not.toHaveBeenCalled();
        $browser.defer.flush();
        expect(callback).toHaveBeenCalledOnce();
      }));
    });
  });

  describe('ngAnimateMock', function() {

    beforeEach(module('ngAnimate'));
    beforeEach(module('ngAnimateMock'));

    var ss, element, trackedAnimations;

    beforeEach(module(function($animateProvider) {
      trackedAnimations = [];
      $animateProvider.register('.animate', function($timeout) {
        return {
          leave: logFn('leave'),
          addClass: logFn('addClass')
        };

        function logFn(method) {
          return function(element) {
            trackedAnimations.push(getDoneCallback(arguments));
            // this will never finish an animation so we'll issue a call
            // to timeout so that the mock driver won't throw an exception
            $timeout(angular.noop, 0, false);
          };
        }

        function getDoneCallback(args) {
          for (var i = args.length; i > 0; i--) {
            if (angular.isFunction(args[i])) return args[i];
          }
        }
      });

      return function($animate, $rootElement, $document, $rootScope, $window) {
        if (ss) {
          ss.destroy();
        }
        ss = createMockStyleSheet($document, $window);

        element = angular.element('<div class="animate"></div>');
        $rootElement.append(element);
        angular.element($document[0].body).append($rootElement);
        $animate.enabled(true);
        $rootScope.$digest();
      };
    }));

    describe('$animate.queue', function() {
      it('should maintain a queue of the executed animations', inject(function($animate) {
        element.removeClass('animate'); // we don't care to test any actual animations
        var options = {};

        $animate.addClass(element, 'on', options);
        var first = $animate.queue[0];
        expect(first.element).toBe(element);
        expect(first.event).toBe('addClass');
        expect(first.options).toBe(options);

        $animate.removeClass(element, 'off', options);
        var second = $animate.queue[1];
        expect(second.element).toBe(element);
        expect(second.event).toBe('removeClass');
        expect(second.options).toBe(options);

        $animate.leave(element, options);
        var third = $animate.queue[2];
        expect(third.element).toBe(element);
        expect(third.event).toBe('leave');
        expect(third.options).toBe(options);
      }));
    });

    describe('$animate.flush()', function() {
      it('should throw an error if there is nothing to animate', inject(function($animate) {
        expect(function() {
          $animate.flush();
        }).toThrow('No pending animations ready to be closed or flushed');
      }));

      it('should trigger the animation to start',
        inject(function($animate) {

        expect(trackedAnimations.length).toBe(0);
        $animate.leave(element);
        $animate.flush();
        expect(trackedAnimations.length).toBe(1);
      }));

      it('should trigger the animation to end once run and called',
        inject(function($animate) {

        $animate.leave(element);
        $animate.flush();
        expect(element.parent().length).toBe(1);

        trackedAnimations[0]();
        $animate.flush();
        expect(element.parent().length).toBe(0);
      }));

      it('should trigger the animation promise callback to fire once run and closed',
        inject(function($animate) {

        var doneSpy = jasmine.createSpy();
        $animate.leave(element).then(doneSpy);
        $animate.flush();

        trackedAnimations[0]();
        expect(doneSpy).not.toHaveBeenCalled();
        $animate.flush();
        expect(doneSpy).toHaveBeenCalled();
      }));

      it('should trigger a series of CSS animations to trigger and start once run',
        inject(function($animate, $rootScope) {

        if (!browserSupportsCssAnimations()) return;

        ss.addRule('.leave-me.ng-leave', 'transition:1s linear all;');

        var i, elm, elms = [];
        for (i = 0; i < 5; i++) {
          elm = angular.element('<div class="leave-me"></div>');
          element.append(elm);
          elms.push(elm);

          $animate.leave(elm);
        }

        $rootScope.$digest();

        for (i = 0; i < 5; i++) {
          elm = elms[i];
          expect(elm.hasClass('ng-leave')).toBe(true);
          expect(elm.hasClass('ng-leave-active')).toBe(false);
        }

        $animate.flush();

        for (i = 0; i < 5; i++) {
          elm = elms[i];
          expect(elm.hasClass('ng-leave')).toBe(true);
          expect(elm.hasClass('ng-leave-active')).toBe(true);
        }
      }));

      it('should trigger parent and child animations to run within the same flush',
        inject(function($animate, $rootScope) {

        var child = angular.element('<div class="animate child"></div>');
        element.append(child);

        expect(trackedAnimations.length).toBe(0);

        $animate.addClass(element, 'go');
        $animate.addClass(child, 'start');
        $animate.flush();

        expect(trackedAnimations.length).toBe(2);
      }));

      it('should trigger animation callbacks when called',
        inject(function($animate, $rootScope) {

        var spy = jasmine.createSpy();
        element.on('$animate:before', spy);
        element.on('$animate:close', spy);

        $animate.addClass(element, 'on');
        expect(spy).not.toHaveBeenCalled();

        $animate.flush();
        expect(spy.callCount).toBe(1);

        trackedAnimations[0]();
        $animate.flush();
        expect(spy.callCount).toBe(2);
      }));
    });
  });
});

describe('make sure that we can create an injector outside of tests', function() {
  //since some libraries create custom injectors outside of tests,
  //we want to make sure that this is not breaking the internals of
  //how we manage annotated function cleanup during tests. See #10967
  angular.injector([function($injector) {}]);
});
