import { getIndexFields } from '../helpers'

describe('Utils', function() {
  describe('getIndexFields', function() {
    it('should return the fields that should be indexed', function() {
      const fields = getIndexFields({
        selector: {
          _id: { $gt: null },
          foo: 'bar'
        }
      })
      expect(fields).toEqual(['_id', 'foo'])
    })

    it('should return the fields that should be indexed (with sort)', function() {
      const fields = getIndexFields({
        selector: {
          _id: { $gt: null },
          foo: 'bar'
        },
        sort: { baz: true }
      })
      expect(fields).toEqual(['_id', 'foo', 'baz'])
    })

    it('should return the fields that should be indexed (with duplicates)', function() {
      const fields = getIndexFields({
        selector: {
          _id: { $gt: null },
          foo: 'bar'
        },
        sort: { baz: true, foo: true }
      })
      expect(fields).toEqual(['_id', 'foo', 'baz'])
    })
  })
})
