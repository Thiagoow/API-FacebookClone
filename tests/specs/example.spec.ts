import test from 'japa'

test.group('Example', () => {
  test('assert sum', (assert) => {
    const sum = 2 + 2

    assert.equal(sum, 4)
  })
})
