'use strict';

/**
 * Convert a list of domains into an object with a test method.
 *   equivalent regex: (any-subdomain)\.(wikipedia\.org|wikivoyage\.org|...)
 *
 * @param domains
 * @param allowSubdomains
 * @returns {*}
 */
module.exports = function makeValidator(domains, allowSubdomains) {
    if (!domains || domains.length === 0) return {
        // Optimization - always return false
        test: function () {
            return false;
        }
    };
    return new RegExp(
        (allowSubdomains ? '^([^@/:]*\.)?(' : '^(') +
        domains
            .map(function (s) {
                return s.replace('.', '\\.');
            })
            .join('|') + ')$', 'i');
};
