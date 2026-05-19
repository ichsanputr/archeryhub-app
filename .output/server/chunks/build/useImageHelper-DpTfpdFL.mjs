const useImageOrDefault=(t,i)=>{if(null==t?void 0:t.trim())return t.startsWith("http"),t;if(null==i?void 0:i.trim()){return`https://api.dicebear.com/7.x/initials/svg?seed=${i.split(" ").map(t=>t[0]).join("").substring(0,2).toUpperCase()}`}return"/avatar-default.svg"};export{useImageOrDefault as u};
//# sourceMappingURL=useImageHelper-DpTfpdFL.mjs.map
