describe('asdf', () => {
  it('', () => {
    const a = jest.fn().mockImplementation((object) => {
      return object;
    });

    a({
      data: {
        order: 1,
        idx: 1,
      },
    });

    expect(a).toHaveBeenCalledWith({
      data: {
        order: 1,
        idx: expect.any(Number),
      },
    });
  });
});
