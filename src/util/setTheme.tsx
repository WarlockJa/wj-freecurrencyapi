// overriding the preference for dark mode using passed url parameter as a class name

import { useEffect } from "react";

const setTheme = (themeClass: string) => {
  useEffect(() => {
    document.body.classList.add(themeClass);
  }, [themeClass]);
};

export default setTheme;
