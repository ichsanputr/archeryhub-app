import{computed as e,ref as l}from"vue";const n=l(null),useEventContext=()=>{const l=e(()=>null!==n.value),u=e(()=>{var e,l;return null!=(e=null==(l=n.value)?void 0:l.name)?e:null});return{currentEvent:e(()=>n.value),setEvent:e=>{n.value=e},clearEvent:()=>{n.value=null},isEventMode:l,eventTitle:u}};export{useEventContext as u};
//# sourceMappingURL=useEventContext-BDruv-CM.mjs.map
