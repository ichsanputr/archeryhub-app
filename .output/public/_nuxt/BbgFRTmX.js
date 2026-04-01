const r=(t,s)=>t!=null&&t.trim()?(t.startsWith("http"),t):s!=null&&s.trim()?`https://api.dicebear.com/7.x/initials/svg?seed=${s.split(" ").map(e=>e[0]).join("").substring(0,2).toUpperCase()}`:"/avatar-default.svg";export{r as u};
//# sourceMappingURL=BbgFRTmX.js.map
