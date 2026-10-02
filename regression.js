/* 엑셀의 중심합 최소제곱 계산과 동일한 회귀식. 외부 패키지가 필요 없다. */
function fitRegression(points) {
  if(points.length<3 || points.some(p=>p.length!==2||!p.every(Number.isFinite))) throw Error('유효한 X,Y 데이터가 3개 이상 필요합니다.');
  const n=points.length, mean=v=>v.reduce((a,b)=>a+b,0)/n;
  const mx=mean(points.map(p=>p[0])), my=mean(points.map(p=>p[1])), mz=mean(points.map(p=>p[0]**2));
  let xx=0,xz=0,zz=0,xy=0,zy=0,sst=0;
  for(const [x,y] of points){const dx=x-mx,dz=x*x-mz,dy=y-my;xx+=dx*dx;xz+=dx*dz;zz+=dz*dz;xy+=dx*dy;zy+=dz*dy;sst+=dy*dy;}
  if(xx===0) throw Error('X 값이 모두 같아 회귀식을 계산할 수 없습니다.');
  const determinant=xx*zz-xz*xz;
  if(Math.abs(determinant)<1e-12*Math.max(xx*zz,1e-30)) throw Error('2차 회귀에는 서로 다른 X 값이 3개 이상 필요합니다.');
  const b=xy/xx, a2=(zy*xx-xy*xz)/determinant,b2=(xy*zz-zy*xz)/determinant;
  const evaluate=(a,b,c)=>{const predict=x=>a*x*x+b*x+c,sse=points.reduce((s,[x,y])=>s+(y-predict(x))**2,0);return {a,b,c,predict,r2:sst===0?null:1-sse/sst,rmse:Math.sqrt(sse/n)};};
  return {linear:evaluate(0,b,my-b*mx),quadratic:evaluate(a2,b2,my-b2*mx-a2*mz),n};
}
if(typeof module!=='undefined') module.exports={fitRegression};
