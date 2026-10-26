// Join class names without merging them. Client components on the homepage use this instead of
// `cn`: the `cn` package ships ~14 kB (gzip) of Tailwind class tables to the browser, which
// would break the page's JS budget. Only for class lists that never conflict; Server
// Components keep `cn`, which costs no client JavaScript.
export const cx = (...classes: (string | false | null | undefined)[]) => classes.filter(Boolean).join(" ")
