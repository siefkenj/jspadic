# jspadic

Javascript calculator for p-adic numbers

[p-adic numbers](https://en.wikipedia.org/wiki/P-adic_number) are an alternative number system
compared to the usual rationals/reals/complexes. `jspadic` is a TypeScript library for computing
with p-adic numbers.

[**Try out the playground**](https://siefkenj.github.io/jspadic/)

## Development

To develop `jspadic`, make sure you have `Node.js` installed. Then run

```bash
npm install
npx vite
```

This will start a live-reloading development server. To run the development tests,
use

```bash
npx vitest
```

### Program Structure

The library that handles p-adic arithmetic is in `src/lib/padic` while the frontend code is in `src/App.tsx`.
The frontend code is written in React/Typescript.

#### PAdic Library Code

`jspadic` builds p-adic objects out of simpler ones. The most basic p-adic object is `PAdicPrimitive`.
A `PAdicPrimitive` is an element of `Z×Z^N`. The first `Z` stores the lowest power in the padic number
and the subsequent `Z^N` stores the coefficients of the larger powers. For example, the p-adic number `2p^2+3p^3+7p^5` would be stores as `2,[2,3,0,7]`.

Expressions involving p-adics can be built from `PAdicSum`, `PAdicProd`, and `PAdicPrimitive`. Formulas involving p-adics can
be solved (digit-by-digit) using `solve`.
