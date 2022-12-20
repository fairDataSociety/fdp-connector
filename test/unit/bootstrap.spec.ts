
describe('bootstrap module', () => {
  it('should instantiate module with one provider', async () => {
    const json = 123
    const beeson = new BeeSon<number>({ json })
    expect(beeson.typeManager.type).toBe(Type.int32)
    expect(beeson.json).toBe(json)

    const value = beeson
    // encode a block
    const block = await Block.encode({ value, codec, hasher })
    const blockValue = {
      _json: 123,
      _typeManager: {
        _type: 113,
        _typeDefinitions: null,
        _version: '0.1.0',
        nullable: false,
        superBeeSon: false,
      },
    }

    const result = `bah6acgzagzzvlpstid4tluevw3vfaapezmhheclr5zstbrm7kzvi52jhaa4a`
    expect(block.value).toEqual(blockValue)
    expect(block.bytes.length).toBe(64)
    expect(block.cid.toString()).toBe(result)

    // decode a block
    const block2 = await Block.decode({
      bytes: block.bytes,
      codec: codec as any,
      hasher,
    })
    expect(await block2.value).toEqual(blockValue)

    // decode a block using create
    const block3 = await Block.create({
      bytes: block.bytes,
      codec: codec as any,
      cid: block.cid,
      hasher,
    })
    expect(await block3.value).toEqual(blockValue)
  })

})
