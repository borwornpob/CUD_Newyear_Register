!function(e,t){for(var r in t)e[r]=t[r]}(exports,function(e){var t={};function r(n){if(t[n])return t[n].exports;var o=t[n]={i:n,l:!1,exports:{}};return e[n].call(o.exports,o,o.exports,r),o.l=!0,o.exports}return r.m=e,r.c=t,r.d=function(e,t,n){r.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:n})},r.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},r.t=function(e,t){if(1&t&&(e=r(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var n=Object.create(null);if(r.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var o in e)r.d(n,o,function(t){return e[t]}.bind(null,o));return n},r.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return r.d(t,"a",t),t},r.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},r.p="",r(r.s=0)}([function(e,t,r){const n=r(1),o=r(2),a=r(3),s=r(4),i=r(5),u=n(),c=n.Router();o.registerFont("./assets/Chakra_Petch/ChakraPetch-Medium.ttf",{family:"Chakra Petch"});c.get("/image",async(e,t)=>{const r=e.query.text||"John Doe",n=e.query.email||"placeholder@email.com",i=e.query.status||"Status",u=e.query.logLink||"https://google.co.th";try{const e=await(async(e,t,r,n)=>{const i=await s.toDataURL(n),u=await a.promises.readFile("./assets/cutopia_final.png"),c=new o.Image;c.src=u;const{width:l,height:f}=c,p=o.createCanvas(l,f),d=p.getContext("2d");console.log("Hello"),d.drawImage(c,0,0,l,f);const h=new o.Image;h.src=i;h.width,h.height;d.drawImage(h,290,295,435.5,416),d.fillStyle="#000000",d.font="48px 'Chakra Petch', sans-serif";const g=d.measureText(e).width,x=d.measureText(t).width;d.fillText(e,(l-g)/2,785),d.fillText(t,(l-x)/2,870),d.font="36px 'Chakra Petch', sans-serif";const m=d.measureText(r).width;return d.fillText(r,(l-m)/2,955),console.log(p.toBuffer()),p.toBuffer()})(r,n,i,u);console.log(e),t.json({image:e.toString("base64")})}catch(e){t.status(500).send({error:e.message})}}),u.use("/.netlify/functions/index",c),e.exports.handler=i(u)},function(e,t){e.exports=require("express")},function(e,t){e.exports=require("canvas")},function(e,t){e.exports=require("fs")},function(e,t){e.exports=require("qrcode")},function(e,t){e.exports=require("serverless-http")}]));