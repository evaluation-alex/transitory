
const { expect } = require('chai');
const BoundlessCache = require('../cache/boundless');
const RemovalCause = require('../utils/removal-cause');

describe('BoundlessCache', function() {
	it('Can create', function() {
		expect(new BoundlessCache({})).to.not.be.null;
	});

	it('Set value in cache', function() {
		const cache = new BoundlessCache({});
		cache.set('key', 'value');

		expect(cache.has('key')).to.equal(true);
		expect(cache.get('key')).to.equal('value');
	});

	it('Get non-existent value in cache', function() {
		const cache = new BoundlessCache({});

		expect(cache.get('key')).to.equal(null);
	});

	it('Delete works', function() {
		const cache = new BoundlessCache({});
		cache.set('key', 'value');

		cache.delete('key');
		expect(cache.get('key')).to.equal(null);
	});

	it('Clear for empty', function() {
		const cache = new BoundlessCache({});
		cache.clear();
		expect(cache.size).to.equal(0);
	});

	it('Clear for single', function() {
		const cache = new BoundlessCache({});
		cache.set('key', 'value');

		cache.clear();
		expect(cache.size).to.equal(0);
	});

	it('Getting keys work', function() {
		const cache = new BoundlessCache({});
		cache.set('key', 'value');

		expect(cache.keys()).to.deep.equal([ 'key' ]);
	});

	describe('Removal listeners', function() {
		it('Triggers on delete', function() {
			const listener = removalListener();
			const cache = new BoundlessCache({
				removalListener: listener
			});

			cache.set('one', 1234);
			expect(listener.removed).to.equal(null);

			cache.delete('one');
			expect(listener.removed).to.deep.equal({
				key: 'one',
				value: 1234,
				reason: RemovalCause.EXPLICIT
			});
		});

		it('Triggers on set', function() {
			const listener = removalListener();
			const cache = new BoundlessCache({
				removalListener: listener
			});

			cache.set('one', 1234);
			expect(listener.removed).to.equal(null);

			cache.set('one', 4321);
			expect(listener.removed).to.deep.equal({
				key: 'one',
				value: 1234,
				reason: RemovalCause.REPLACED
			});
		});

		it('Triggers on clear', function() {
			const listener = removalListener();
			const cache = new BoundlessCache({
				removalListener: listener
			});

			cache.set('one', 1234);
			expect(listener.removed).to.equal(null);

			cache.clear();
			expect(listener.removed).to.deep.equal({
				key: 'one',
				value: 1234,
				reason: RemovalCause.EXPLICIT
			});
		});
	})
});


function removalListener() {
	let result = (key, value, reason) => {
		result.removed = { key, value, reason };
	};
	result.removed = null;
	return result;
}
