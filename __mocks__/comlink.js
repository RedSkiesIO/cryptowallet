export const expose = (func) => { return func; };

export const wrap = jest.fn().mockImplementation(() => {
  return (wallet, funcs, fullRefresh) => { return { wallet, funcs, fullRefresh }; };
});

export const proxy = jest.fn().mockImplementation((funcs) => { return funcs; });
