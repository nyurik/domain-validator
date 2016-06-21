'use strict';

var assert = require('assert'),
    validator = require('../src/domain-validator');

function makeValidator(domains, allowSubdomains) {
    var vld = validator(domains, allowSubdomains);
    vld.pass = function(url) {
        assert(this.test(url), url);
    };
    vld.fail = function(url) {
        assert(!this.test(url), url);
    };
    return vld;
}

describe('domain-validator', function() {

    it('empty, no subdomains', function () {
        var val = makeValidator([], false);
        val.fail();
        val.fail('');
        val.fail('aa');
    });

    it('empty, with subdomains', function () {
        var val = makeValidator([], true);
        val.fail();
        val.fail('');
        val.fail('aa');
    });

    it('no subdomains', function () {
        var val = makeValidator(['abc', 'xyz.org'], false);
        val.fail();
        val.fail('');
        val.fail('a');
        val.pass('abc');
        val.fail('abcd');
        val.fail('abcd.');
        val.fail('abc.a');
        val.fail('abc.abc');
        val.pass('xyz.org');
        val.fail('.xyz.org');
        val.fail('abc.xyz.org');
        val.fail('xyzaorg');
    });

    it('with subdomains', function () {
        var val = makeValidator(['abc', 'xyz.org'], true);
        val.fail();
        val.fail('');
        val.fail('a');
        val.pass('abc');
        val.pass('abc.abc');
        val.pass('nnn.ccc.abc');
        val.pass('xyz.org');
        val.fail('xyz.org.');
        val.pass('abc.xyz.org');
        val.pass('.xyz.org'); // this is not a valid domain per se, but it is safe from validation perspective
        val.fail('abcaxyz.org');
        val.fail('xyzaorg');
        val.fail('xabc');
    });

});
