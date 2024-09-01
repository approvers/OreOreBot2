declare module '*.module.css' {
  const content: { [className: string]: string };
  export = content;
}

declare module '*.png' {
  const content: string;
  export = content;
}
