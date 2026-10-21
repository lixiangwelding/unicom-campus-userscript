// ==UserScript==
// @name         联通党校-刷课助手
// @namespace    codex.local/unicom-campus-personal
// @version      1.2.3
// @description  联通党校专题课程助手，支持功能预览、新手教程、断点续跑与进度展示；使用功能需激活，每码支持4个浏览器。
// @author       Personal
// @antifeature  payment 课程任务功能需有效授权码，每码最多绑定4个浏览器。
// @antifeature  tracking 向授权服务上报随机浏览器编号、页面会话编号、脚本版本与任务运行状态，用于最近5分钟使用数量及24小时趋势统计；不上传账号密码、Cookie或课程内容。
// @match        *://*.campus.chinaunicom.cn/*
// @match        *://campus.chinaunicom.cn/*
// @require      https://cdn.jsdelivr.net/npm/jsencrypt@2.3.1/bin/jsencrypt.min.js
// @require      https://cdn.jsdelivr.net/npm/blueimp-md5@2.19.0/js/md5.min.js
// @connect      campus.chinaunicom.cn
// @connect      license.ddtgm.cn
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @run-at       document-idle
// @downloadURL  https://license.ddtgm.cn/unicom-campus.user.js
// @updateURL    https://license.ddtgm.cn/unicom-campus.meta.js
// ==/UserScript==

(function () {
'use strict';
const LICENSE_CONFIG = {
  "apiBase": "https://license.ddtgm.cn",
  "shopUrl": "https://wzyp.cn/shop/2U92NO5U/nh6hd3",
  "version": "1.2.3",
  "shopQrDataUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQAAAAEACAYAAABccqhmAAAAAklEQVR4AewaftIAAAblSURBVO3BUW4sQXIEQY/E3P/KofcrgAWIhd7WcNPN0n+QtNIgaa1B0lqDpLUGSWsNktYaJK01SFprkLTWIGmtQdJag6S1BklrDZLWGiStNUhaa5C01iBprUHSWoOktQZJaw2S1hokrTVIWmuQtNYgaa1B0lqDpLU+vCwJf11bTpLwk7Z8iySctOVNSfittpwk4a9ry1sGSWsNktYaJK01SFprkLTWIGmtD1+kLd8iCTfa8ltJuNGWG225kYSTtpwk4aQtb2nLt0jCNxgkrTVIWmuQtNYgaa1B0lqDpLU+/BFJeFpbvl1bbiThpC3fIgm/1ZanJeFpbfl2g6S1BklrDZLWGiStNUhaa5C01gc9Kgk/acuNJNxoy0kSbrTlRltuJEH/WYOktQZJaw2S1hokrTVIWmuQtNYH/b9ry0kSbiThTUl4Wlv0nzVIWmuQtNYgaa1B0lqDpLUGSWt9+CPaslFbbiThRltutOUkCTeS8JO2PK0tGw2S1hokrTVIWmuQtNYgaa1B0lofvkgSNkrCSVtOknDSlpMk3EjCSVtutOUkCU9Kgv63QdJag6S1BklrDZLWGiStNUha68PL2rJREk7acpKEk7Y8LQknbXlTW36rLfq/GyStNUhaa5C01iBprUHSWoOktT68LAknbXlaEk7acpKEJ7XlJAknbTlJwtPaciMJJ205ScJf1pYbSThpy1sGSWsNktYaJK01SFprkLRW+g9fIgk32vItkvCTtjwtCSdtuZGEG205ScJJW06S8JO2nCThpC0nSfgWbXnLIGmtQdJag6S1BklrDZLWGiStlf7Dl0jCSVtOknDSlpMk3GjLt0vCt2jLN0jCSVvelISTtrxlkLTWIGmtQdJag6S1BklrDZLW+vCyJNxIwo0k3GjLW5Jw0paTJNxoy0kSbrTlJAknbfmtJJy05WlJOGnLSRK+3SBprUHSWoOktQZJaw2S1hokrfXhZW05ScJJW06ScKMtJ0l4UltuJOGkLSdJeFpbbrTlJAknbfkGbXlaW77BIGmtQdJag6S1BklrDZLWGiStlf7Dl0jCSVueloSTtpwk4bfaciMJf0FbTpJw0pYnJeGva8tbBklrDZLWGiStNUhaa5C01iBprQ9/RBLelIQnJeGkLU9ry40kfIskPKktN5Jwoy0nSfgGg6S1BklrDZLWGiStNUhaa5C01oeXJeGkLSdJOGnLSRJO2vK0JPykLTfacpKEG0k4acuNJJy05SQJv9WWG0m40ZYbSfh2g6S1BklrDZLWGiStNUhaa5C01oeXteUkCSdtOUnCSVtuJOFGW75BEp6WhJO2nCThpC0nSfhJEk7acqMtb2rLNxgkrTVIWmuQtNYgaa1B0lqDpLXSf3hREp7WlpMknLTlGyThpC0nSThpy40knLTlJAknbXlLEt7UlpMk3GjLWwZJaw2S1hokrTVIWmuQtNYgaa30H/6AJJy05UYSbrTlt5Jw0paTJPwFbTlJwklb3pKEG205ScJJW06ScNKWtwyS1hokrTVIWmuQtNYgaa1B0lof/gsk4UZbbiThpC2/lYQ3teUkCU9ry5OScNKWN7XlJAnfbpC01iBprUHSWoOktQZJaw2S1vrwsiTcaMubknDSlre05SQJb2rLm5LwW0l4WhJO2nLSlpMkfINB0lqDpLUGSWsNktYaJK314WVt+QvaciMJP2nLSRLelIQbSThpy40k/FZbnpaEk7b8txokrTVIWmuQtNYgaa1B0lqDpLU+vCwJf11bvkFbnpaEpyXhLUk4acuNJNxoy7cbJK01SFprkLTWIGmtQdJag6S1PnyRtnyLJNxoy0+ScCMJN9pykoSTttxIwjdoy9PaciMJ326QtNYgaa1B0lqDpLUGSWsNktb68Eck4WlteVoSfqstJ0k4actJEm4k4aQtJ205ScKTkvCmJJy05UZbvsEgaa1B0lqDpLUGSWsNktYaJK31QY9qy0+S8LQknLTlRhJOknDSlpO2fIMknLRlo0HSWoOktQZJaw2S1hokrTVIWuuDXtGWG225kYSTtjwtCTfa8ltJOGnLSVtuJOFpSThpy1sGSWsNktYaJK01SFprkLTWIGmtD39EWzZKwklbntaWG0k4actJEn6rLU9Lwo22nCTh2w2S1hokrTVIWmuQtNYgaa1B0lofvkgS/rokPKktJ0m4kYSTttxoy0kSTtpykoSfJOFNbXlaW77BIGmtQdJag6S1BklrDZLWGiStlf6DpJUGSWsNktYaJK01SFprkLTWIGmtQdJag6S1BklrDZLWGiStNUhaa5C01iBprUHSWoOktQZJaw2S1hokrTVIWmuQtNYgaa1B0lqDpLUGSWsNktb6HzK0PSbxGVDZAAAAAElFTkSuQmCC"
};
function createCourseDashboard(host) {
  const css = document.createElement('style');
  css.textContent = `
    .ucl-dashboard{min-width:0}.ucl-dash-eyebrow{color:#8c7882;font-size:10px;letter-spacing:.5px}.ucl-dash-heading{display:flex;justify-content:space-between;align-items:flex-start;gap:12px;margin:4px 0 16px}.ucl-dash-heading strong{font-size:19px;letter-spacing:-.4px}.ucl-data-badge{font-size:10px;background:#f6f1f3;border:1px solid #e9dfe4;border-radius:20px;padding:3px 9px;color:#866b78;white-space:nowrap}.ucl-charts{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:18px}.ucl-chart{border:1px solid #ece5e9;border-radius:13px;padding:14px;min-width:0}.ucl-chart-label{font-size:11px;color:#7c6c76;margin-bottom:10px}.ucl-ring-row{display:flex;align-items:center;gap:15px}.ucl-ring{position:relative;width:90px;height:90px;flex:0 0 90px}.ucl-ring svg{width:90px;height:90px;transform:rotate(-90deg)}.ucl-ring strong{position:absolute;inset:0;display:grid;place-items:center;font-size:21px}.ucl-chart-numbers b{display:block;font-size:20px;line-height:1.4;font-variant-numeric:tabular-nums}.ucl-chart-numbers small{display:block;color:#81727b;font-size:10px;margin-top:4px}.ucl-stacked{height:9px;border-radius:20px;overflow:hidden;background:#eee8ec;display:flex;margin:16px 0}.ucl-stacked span{height:100%}.ucl-legend-row{display:flex;justify-content:space-between;font-size:11px;margin-top:7px}.ucl-legend-row i{display:inline-block;width:7px;height:7px;border-radius:50%;margin-right:6px}.ucl-legend-row b{font-variant-numeric:tabular-nums}.ucl-category-title{font-size:12px;font-weight:650;margin:16px 0 8px}.ucl-categories{display:flex;flex-wrap:wrap;gap:7px}.ucl-category{font-size:10px!important;padding:5px 9px;border:1px solid #e7dde2;border-radius:7px;background:#fff;color:#78626f}.ucl-category[aria-pressed="true"]{color:#a22039;background:#fbf0f3;border-color:#e9c5cf}.ucl-course-tools{display:flex;align-items:center;justify-content:space-between;gap:8px;margin:19px 0 9px}.ucl-course-tools b{font-size:12px}.ucl-course-tools input{width:170px!important;height:30px!important;border:1px solid #e9e0e5;border-radius:7px;font:11px inherit;padding:0 8px;background:#fff}.ucl-course-table{overflow:auto;border:1px solid #ece5e9;border-radius:10px;max-height:255px}.ucl-course-table table{border-collapse:collapse;width:100%;font-size:11px!important;table-layout:fixed}.ucl-course-table th{background:#f8f5f6;text-align:left;color:#85717e;font-weight:500;padding:10px;position:sticky;top:0}.ucl-course-table td{padding:11px 10px;border-top:1px solid #f0eaee;vertical-align:middle}.ucl-course-table th:first-child{width:48%}.ucl-course-table th:nth-child(2){width:15%}.ucl-course-table th:nth-child(3){width:17%}.ucl-course-table th:nth-child(4){width:20%}.ucl-course-name{font-size:11px;color:#40323a;font-weight:600}.ucl-course-sub{font-size:9px;color:#9b8994;margin-top:3px}.ucl-course-percent{font-size:11px;font-variant-numeric:tabular-nums}.ucl-mini-track{height:3px;background:#f0e8ed;border-radius:5px;margin-top:5px;overflow:hidden}.ucl-mini-track i{display:block;height:100%;background:#b4233b;border-radius:5px}.ucl-page-note{display:flex;justify-content:space-between;align-items:center;gap:8px;margin-top:9px;font-size:9px;color:#998591}.ucl-page-buttons{display:flex;gap:5px}.ucl-page-buttons button{font-size:10px!important;padding:3px 8px;border:1px solid #e9dfe4;background:white;border-radius:5px;color:#785d6d}.ucl-page-buttons button:disabled{opacity:.35;cursor:default!important}.ucl-source-note{font-size:9px;color:#9a8792;margin-top:13px;line-height:1.7}.ucl-chart-empty{font-size:12px;color:#8d7a86;line-height:1.9;padding:15px 0}.ucl-compact .ucl-charts{grid-template-columns:1fr 1fr}.ucl-compact .ucl-ring-row{gap:8px}.ucl-compact .ucl-ring,.ucl-compact .ucl-ring svg{width:68px;height:68px;flex-basis:68px}.ucl-compact .ucl-ring strong{font-size:16px}.ucl-compact .ucl-chart-numbers b{font-size:15px}.ucl-compact .ucl-chart{padding:10px}.ucl-compact .ucl-course-table th:first-child{width:45%}@media(max-width:650px){.ucl-charts{gap:8px}.ucl-chart{padding:10px}.ucl-ring,.ucl-ring svg{width:66px;height:66px;flex-basis:66px}.ucl-ring strong{font-size:16px}.ucl-ring-row{gap:8px}.ucl-chart-numbers b{font-size:15px}.ucl-course-tools input{width:135px!important}.ucl-dash-heading strong{font-size:17px}}
  `;
  document.head.append(css);
  const root = document.createElement('div'); root.className = 'ucl-dashboard'; host.append(root);
  let search = ''; let selectedDemo = '全部'; let refreshTimer;
  const demo = [
    ['AI工具使用入门',0.25,100,'AI工具使用技巧系列课程',128],['提示词基础与实践',0.4,62,'AI工具使用技巧系列课程',96],
    ['信息安全基础',0.5,100,'2026年开发课程',180],['服务能力提升',0.3,35,'2026年开发课程',112],
    ['团队协作方法',0.6,0,'2025年开发课程',203],['数字办公技巧',0.35,0,'2025年开发课程',175],
  ].map(([name,hours,progress,category,learners]) => ({name,hours,progress,category,learners}));
  function data() {
    const module = document.querySelector('.allcourses') || document.querySelector('.coursesModule');
    const categories = module ? [...module.querySelectorAll('.classification-item li')].map(el => el.textContent.trim()).filter(Boolean) : ['全部','AI工具使用技巧系列课程','2026年开发课程','2025年开发课程'];
    const category = module?.querySelector('.classification-item li.red-item')?.textContent.trim() || selectedDemo;
    const cards = module ? [...module.querySelectorAll('.item-cont')].filter(el => el.querySelector('.item-title')).map(el => {
      const text = el.querySelector('.item-classify')?.textContent || '';
      const percent = el.querySelector('[role="progressbar"]')?.getAttribute('aria-valuenow');
      const parsed = percent === null || percent === undefined ? NaN : Number(percent);
      return { name: el.querySelector('.item-title').textContent.trim(), hours: Number(text.match(/([\d.]+)\s*学时/)?.[1]) || null,
        learners: Number(text.match(/(\d+)\s*人学习/)?.[1]) || null, progress: Number.isFinite(parsed) ? Math.max(0,Math.min(100,parsed)) : null,
        category: category === '全部' ? '当前页 · 分类未标注' : category };
    }) : demo.filter(r => category === '全部' || r.category === category);
    const page = module?.querySelector('.el-pager .active')?.textContent.trim() || '1';
    const pages = module?.querySelector('.el-pagination input[max]')?.getAttribute('max') || '1';
    const title = document.querySelector('.TCH-rigth .title')?.textContent.trim() || '课程专题示例';
    // Only render course and topic information; never copy header/account/profile content.
    const summary = document.querySelector('.TCH-rigth')?.textContent || '';
    const totalHours = Number(summary.match(/课程总学时[\s：:]*([\d.]+)\s*学时/)?.[1]);
    const learnedMatch = summary.match(/已学习[\s\S]{0,120}?([\d.]+)\s*学时\s*([\d.]+)\s*%/);
    const hourSummary = module && Number.isFinite(totalHours) && totalHours > 0 && learnedMatch
      ? {total:totalHours,learned:Number(learnedMatch[1]),percent:Number(learnedMatch[2]),official:true}
      : {total:cards.reduce((n,r)=>n+(r.hours||0),0),learned:cards.reduce((n,r)=>n+(r.hours||0)*(r.progress||0)/100,0),official:false};
    return {module,categories,category,cards,page,pages,title,hourSummary};
  }
  function text(tag, value, className) { const el=document.createElement(tag);el.textContent=value;if(className)el.className=className;return el; }
  function render(keepFocus = false) {
    const d=data(); const rows=d.cards.filter(r=>r.name.toLowerCase().includes(search.toLowerCase()));
    const finished=d.cards.filter(r=>r.progress===100).length; const ongoing=d.cards.filter(r=>r.progress>0&&r.progress<100).length;
    const unstarted=d.cards.filter(r=>r.progress===0).length; const unknown=d.cards.filter(r=>r.progress===null).length;
    const percent=d.hourSummary.official?d.hourSummary.percent:(d.hourSummary.total?d.hourSummary.learned/d.hourSummary.total*100:0);
    root.replaceChildren(); root.append(text('div',d.module?'当前专题 · 页面实时读取':'功能预览 · 演示数据','ucl-dash-eyebrow'));
    const heading=document.createElement('div');heading.className='ucl-dash-heading';heading.append(text('strong',d.title),text('span',d.module?'当前页面':'示例','ucl-data-badge'));root.append(heading);
    const charts=document.createElement('div');charts.className='ucl-charts';
    const hours=document.createElement('section');hours.className='ucl-chart';
    hours.innerHTML=`<div class="ucl-chart-label">${d.hourSummary.official?'专题官方学时':'当前页学时估算'}</div><div class="ucl-ring-row"><div class="ucl-ring"><svg viewBox="0 0 100 100" aria-hidden="true"><circle cx="50" cy="50" r="40" fill="none" stroke="#f0e7ec" stroke-width="7"/><circle cx="50" cy="50" r="40" fill="none" stroke="#b4233b" stroke-width="7" stroke-linecap="round" stroke-dasharray="${Math.max(0,Math.min(100,percent))*2.5133} 251.33"/></svg><strong>${Math.round(percent)}%</strong></div><div class="ucl-chart-numbers"><b>${d.hourSummary.learned.toFixed(2)}</b><small>/ ${d.hourSummary.total.toFixed(2)} 学时</small></div></div>`;
    const states=document.createElement('section');states.className='ucl-chart';states.append(text('div','当前页课程状态','ucl-chart-label'));
    const stacked=document.createElement('div');stacked.className='ucl-stacked';
    [[finished,'#b4233b'],[ongoing,'#db9bab'],[unstarted+unknown,'#e9dfe5']].forEach(([count,color])=>{const span=document.createElement('span');span.style.width=`${d.cards.length?count/d.cards.length*100:0}%`;span.style.background=color;stacked.append(span);});states.append(stacked);
    [[finished,'已完成','#b4233b'],[ongoing,'进行中','#db9bab'],[unstarted,'未开始','#cbbdc6']].forEach(([n,label,color])=>{const row=document.createElement('div');row.className='ucl-legend-row';const name=text('span',label);const dot=document.createElement('i');dot.style.background=color;name.prepend(dot);row.append(name,text('b',`${n} 门`));states.append(row);});
    if(unknown)states.append(text('small',`${unknown} 门未提供进度`));charts.append(hours,states);root.append(charts);
    root.append(text('div','课程大类','ucl-category-title'));const categories=document.createElement('div');categories.className='ucl-categories';
    d.categories.forEach(name=>{const button=text('button',name,'ucl-category');button.type='button';button.setAttribute('aria-pressed',String(name===d.category));button.addEventListener('click',()=>{
      if(d.module){const source=[...d.module.querySelectorAll('.classification-item li')].find(el=>el.textContent.trim()===name);source?.click();}
      else{selectedDemo=name;render();}
    });categories.append(button);});root.append(categories);
    const tools=document.createElement('div');tools.className='ucl-course-tools';tools.append(text('b',`课程明细 · 当前页 ${d.cards.length} 门`));const input=document.createElement('input');input.placeholder='搜索当前页课程';input.setAttribute('aria-label','搜索当前页课程');input.value=search;input.addEventListener('input',()=>{search=input.value;render(true);});tools.append(input);root.append(tools);
    const wrap=document.createElement('div');wrap.className='ucl-course-table';const table=document.createElement('table');table.innerHTML='<thead><tr><th>课程 / 大类</th><th>学时</th><th>学习人数</th><th>进度</th></tr></thead>';const tbody=document.createElement('tbody');
    rows.forEach(row=>{const tr=document.createElement('tr');const title=document.createElement('td');title.append(text('div',row.name,'ucl-course-name'),text('div',row.category,'ucl-course-sub'));tr.append(title,text('td',row.hours===null?'—':row.hours.toFixed(2)),text('td',row.learners===null?'—':String(row.learners)));const progress=document.createElement('td');progress.append(text('span',row.progress===null?'未提供':`${row.progress}%`,'ucl-course-percent'));const track=document.createElement('div');track.className='ucl-mini-track';const bar=document.createElement('i');bar.style.width=`${row.progress||0}%`;track.append(bar);progress.append(track);tr.append(progress);tbody.append(tr);});
    if(!rows.length){const tr=document.createElement('tr');const td=text('td',d.module?'当前页面尚未加载到课程，或没有匹配结果。':'没有匹配结果。');td.colSpan=4;tr.append(td);tbody.append(tr);}table.append(tbody);wrap.append(table);root.append(wrap);
    const foot=document.createElement('div');foot.className='ucl-page-note';foot.append(text('span',`第 ${d.page} / ${d.pages} 页 · 仅统计当前页`));const pagination=document.createElement('div');pagination.className='ucl-page-buttons';[['上一页','.btn-prev'],['下一页','.btn-next']].forEach(([label,selector])=>{const source=d.module?.querySelector(`.el-pagination ${selector}`);const button=text('button',label);button.type='button';button.disabled=!source||source.disabled;button.addEventListener('click',()=>source.click());pagination.append(button);});foot.append(pagination);root.append(foot);
    root.append(text('div',d.hourSummary.official?'学时来自平台官方汇总，平台注明非实时；课程图表与明细仅反映当前页。分类切换与翻页只读取课程列表。':'学时按当前页课程时长和进度估算；演示不发起课程请求。未加载的分类与分页不计入当前统计。','ucl-source-note'));
    if(keepFocus){const input=root.querySelector('input');input.focus();input.setSelectionRange(search.length,search.length);}
  }
  render();
  const source=document.querySelector('.allcourses') || document.querySelector('.coursesModule');
  const observer=new MutationObserver(()=>{clearTimeout(refreshTimer);refreshTimer=setTimeout(()=>render(),120);});
  if(source)observer.observe(source,{subtree:true,childList:true,characterData:true,attributes:true,attributeFilter:['aria-valuenow','class']});
  return { refresh:render, destroy(){observer.disconnect();clearTimeout(refreshTimer);css.remove();root.remove();} };
}

function createLicenseView(config) {
  const style = document.createElement('style');
  style.textContent = `
    #ucl-dialog,#ucl-badge{--ucl-red:#b4233b;--ucl-ink:#282329;--ucl-muted:#766d73;--ucl-line:#eae5e7;--ucl-soft:#f7f5f6;font:14px/1.65 -apple-system,BlinkMacSystemFont,"Segoe UI","Microsoft YaHei",sans-serif;color:var(--ucl-ink);box-sizing:border-box}
    #ucl-dialog *{box-sizing:border-box}#ucl-dialog{position:fixed;z-index:2147483647;right:24px;top:44px;width:460px;max-height:calc(100dvh - 88px);border:1px solid #e6dfe3;border-radius:20px;background:#fff;box-shadow:0 20px 70px #36172724;overflow:auto;overscroll-behavior:contain;scrollbar-width:thin}
    #ucl-dialog [hidden],#ucl-dialog[hidden],#ucl-badge[hidden]{display:none!important}#ucl-dialog h2,#ucl-dialog h3,#ucl-dialog p{margin:0}#ucl-dialog button{font:inherit;cursor:pointer}#ucl-dialog button:focus-visible,#ucl-dialog summary:focus-visible,#ucl-dialog input:focus-visible,#ucl-badge:focus-visible{outline:3px solid #b4233b40;outline-offset:3px}
    .ucl-top{padding:22px 24px 18px;display:flex;gap:12px;align-items:center}.ucl-mark{display:grid;place-items:center;flex:0 0 42px;height:42px;border-radius:12px;background:var(--ucl-red);color:#fff;font-size:21px;font-weight:700}.ucl-brand{flex:1;min-width:0}#ucl-dialog h2{font-size:18px;line-height:1.4;letter-spacing:-.4px}.ucl-sub{font-size:11px;color:var(--ucl-muted);margin-top:3px}.ucl-close{border:0;background:transparent;color:#81747c;padding:4px 8px;font-size:22px!important}
    .ucl-tabs{display:flex;gap:22px;padding:0 24px;border-bottom:1px solid var(--ucl-line)}.ucl-tabs button{padding:10px 0 12px;border:0;border-bottom:2px solid transparent;background:none;color:var(--ucl-muted);font-size:13px!important;font-weight:600!important}.ucl-tabs button[aria-selected="true"]{border-color:var(--ucl-red);color:var(--ucl-red)}.ucl-pane{padding:22px 24px}.ucl-kicker{font-size:11px;letter-spacing:1px;color:var(--ucl-red);font-weight:700}#ucl-dialog h3{font-size:21px;letter-spacing:-.5px;line-height:1.5;margin:6px 0 8px}.ucl-intro{font-size:12px;color:var(--ucl-muted);line-height:1.8}.ucl-demo{margin:18px 0 15px;border:1px solid var(--ucl-line);border-radius:12px;overflow:hidden}.ucl-demo-head{padding:9px 13px;background:var(--ucl-soft);display:flex;justify-content:space-between;font-size:11px;color:#73676e}.ucl-demo-head span:last-child{color:#a26473}.ucl-demo-body{padding:15px}.ucl-demo-title{display:flex;justify-content:space-between;gap:12px;align-items:center;font-size:13px;font-weight:650}.ucl-demo-status{font-size:10px;background:#edf5ef;color:#3f7051;border-radius:5px;padding:2px 7px;white-space:nowrap}.ucl-demo-track{height:5px;background:#f2ebee;border-radius:9px;margin:12px 0}.ucl-demo-track i{display:block;background:var(--ucl-red);height:100%;width:62%;border-radius:9px}.ucl-demo-stats{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}.ucl-demo-stats strong{display:block;font-size:17px;line-height:1.4;font-variant-numeric:tabular-nums}.ucl-demo-stats small{font-size:10px;color:var(--ucl-muted)}.ucl-demo-toggle{margin-top:13px;width:100%;border:1px solid var(--ucl-line);border-radius:7px;background:#fff;color:#6f5864;padding:6px;font-size:11px!important}
    .ucl-features{display:grid;grid-template-columns:1fr 1fr;gap:12px 16px}.ucl-feature b{font-size:12px;display:block}.ucl-feature p{font-size:11px;color:var(--ucl-muted);line-height:1.6;margin-top:3px!important}.ucl-primary{display:block;border:0;border-radius:10px;background:var(--ucl-red);color:#fff;min-height:44px;width:100%;font-weight:650!important;padding:10px 14px}.ucl-primary:hover{background:#941c31}.ucl-primary:disabled{opacity:.55;cursor:wait!important}.ucl-primary:active,.ucl-shop:active{transform:scale(.99)}.ucl-cta{margin-top:20px}.ucl-quiet{display:block;font-size:10px;color:var(--ucl-muted);text-align:center;margin-top:8px}.ucl-bottom{display:flex;align-items:center;justify-content:space-between;gap:10px;padding:14px 24px;border-top:1px solid var(--ucl-line);background:#fcfbfc}.ucl-bottom span{font-size:10px;color:var(--ucl-muted)}.ucl-shop{background:none;color:var(--ucl-red);border:0;padding:3px 0;font-size:12px!important;font-weight:600!important}
    .ucl-steps{list-style:none;padding:0;margin:15px 0}.ucl-steps li{position:relative;padding:0 0 18px 35px}.ucl-steps li:last-child{padding-bottom:0}.ucl-step-number{position:absolute;left:0;top:0;display:grid;place-items:center;width:23px;height:23px;border:1px solid #e9cdd5;border-radius:50%;color:var(--ucl-red);font-size:11px;font-weight:700}.ucl-steps b{font-size:13px}.ucl-steps p{color:var(--ucl-muted);font-size:12px;line-height:1.8;margin-top:4px!important}.ucl-faq{border-top:1px solid var(--ucl-line);padding:10px 0}.ucl-faq summary{font-size:12px;cursor:pointer;font-weight:600}.ucl-faq p{font-size:11px;color:var(--ucl-muted);line-height:1.8;padding:8px 0 0}.ucl-label{display:block;font-size:12px;font-weight:600;margin:20px 0 8px}#ucl-code{display:block;width:100%;height:46px;padding:0 12px;border:1px solid #d8cdd3;border-radius:9px;background:white;color:var(--ucl-ink);font:12px ui-monospace,Consolas,monospace}#ucl-code:focus{border-color:var(--ucl-red)}#ucl-message{min-height:38px;margin:10px 0 13px!important;font-size:11px;color:var(--ucl-muted);overflow-wrap:anywhere}.ucl-rule{margin:17px 0 0;padding:13px;background:var(--ucl-soft);border-radius:9px;font-size:11px;color:var(--ucl-muted);line-height:1.9}.ucl-reload{margin-top:10px;width:100%;padding:10px;border:1px solid var(--ucl-line);border-radius:9px;background:#fff}.ucl-status-label{display:inline-block;color:var(--ucl-red);background:#faeef1;padding:3px 8px;border-radius:5px;font-size:10px;margin-bottom:6px}
    #ucl-badge{position:fixed;z-index:2147483646;bottom:18px;right:22px;padding:9px 15px;border:1px solid #e9d8df;border-radius:24px;background:#fff;color:#945064;font-size:11px;box-shadow:0 4px 18px #35132612;cursor:pointer}@media(max-width:520px){#ucl-dialog{top:12px;right:10px;left:10px;width:auto;max-height:calc(100dvh - 24px)}.ucl-top{padding:18px 18px 15px}.ucl-tabs{padding:0 18px;gap:20px}.ucl-pane{padding:18px}.ucl-bottom{padding:12px 18px}#ucl-dialog h2{font-size:17px}#ucl-dialog h3{font-size:20px}}@media(prefers-reduced-motion:no-preference){#ucl-dialog button{transition:background 140ms ease-out,transform 120ms ease-out}.ucl-demo-track i{transition:width 160ms ease-out}}
  `;
  style.textContent += `
    #ucl-dialog.ucl-wide{width:min(1120px,calc(100vw - 48px));left:50%;right:auto;transform:translateX(-50%);top:24px;max-height:calc(100dvh - 48px)}
    .ucl-wide #ucl-preview{display:grid;grid-template-columns:285px minmax(0,1fr);gap:32px;padding:26px}.ucl-wide .ucl-presentation{padding-right:24px;border-right:1px solid var(--ucl-line)}.ucl-wide .ucl-demo{display:none}.ucl-wide .ucl-features{grid-template-columns:1fr;gap:15px;margin-top:24px}.ucl-layout{font-size:11px!important;white-space:nowrap;padding:6px 10px;background:#faf7f8;color:#8a6377;border:1px solid #e9dfe4;border-radius:7px}.ucl-dashboard-host{margin-top:24px;padding-top:20px;border-top:1px solid var(--ucl-line)}.ucl-wide .ucl-dashboard-host{margin:0;padding:0;border:0}.ucl-wide #ucl-tutorial,.ucl-wide #ucl-activate{max-width:780px;margin:auto;width:100%;padding:28px 32px}.ucl-wide .ucl-bottom{position:sticky;bottom:0}.ucl-compact .ucl-presentation>.ucl-demo{display:none}@media(max-width:760px){#ucl-dialog.ucl-wide{width:calc(100vw - 20px);top:10px;max-height:calc(100dvh - 20px)}.ucl-wide #ucl-preview{display:block;padding:18px}.ucl-wide .ucl-presentation{padding:0 0 18px;margin-bottom:18px;border-right:0;border-bottom:1px solid var(--ucl-line)}.ucl-wide .ucl-features{grid-template-columns:1fr 1fr;gap:12px;margin-top:16px}.ucl-wide .ucl-cta{margin-top:16px}.ucl-layout{font-size:10px!important;padding:5px}.ucl-top{gap:8px}#ucl-dialog h2{font-size:16px}.ucl-sub{font-size:10px}.ucl-close{padding:2px 4px}.ucl-wide #ucl-tutorial,.ucl-wide #ucl-activate{padding:18px}}
  `;
  document.head.append(style);
  const dialog = document.createElement('section'); dialog.id = 'ucl-dialog'; dialog.setAttribute('aria-label', '联通党校-刷课助手');
  dialog.innerHTML = `<header class="ucl-top"><span class="ucl-mark" aria-hidden="true">联</span><div class="ucl-brand"><h2>联通党校-刷课助手</h2><div class="ucl-sub">专题课程 · 进度管理 · 断点续跑</div></div><button class="ucl-close" type="button" aria-label="收起助手介绍">×</button></header>
    <nav class="ucl-tabs" role="tablist" aria-label="助手介绍"><button id="ucl-tab-preview" role="tab" aria-selected="true" aria-controls="ucl-preview" data-tab="preview">功能预览</button><button id="ucl-tab-tutorial" role="tab" aria-selected="false" aria-controls="ucl-tutorial" data-tab="tutorial" tabindex="-1">新手教程</button><button id="ucl-tab-activate" role="tab" aria-selected="false" aria-controls="ucl-activate" data-tab="activate" tabindex="-1">激活授权</button></nav>
    <section class="ucl-pane" id="ucl-preview" role="tabpanel" aria-labelledby="ucl-tab-preview"><div class="ucl-kicker">永久使用 · 持续更新</div><h3>课程进度，一眼看清。</h3><p class="ucl-intro">专题课程扫描、章节进度与断点续跑，集中在一个小面板里。</p>
      <div class="ucl-demo"><div class="ucl-demo-head"><span>专题学习面板</span><span>演示数据 · 非真实进度</span></div><div class="ucl-demo-body"><div class="ucl-demo-title"><span>专题课程示例</span><span class="ucl-demo-status">演示运行中</span></div><div class="ucl-demo-track"><i></i></div><div class="ucl-demo-stats"><div><strong>8</strong><small>专题课程</small></div><div><strong>5 / 8</strong><small>章节进度</small></div><div><strong>62%</strong><small>演示完成度</small></div></div><button class="ucl-demo-toggle" type="button" aria-pressed="false">体验暂停 / 继续</button></div></div>
      <div class="ucl-features"><div class="ucl-feature"><b>专题扫描</b><p>整理当前专题的未完成章节。</p></div><div class="ucl-feature"><b>断点续跑</b><p>暂停保留进度，刷新后可继续。</p></div><div class="ucl-feature"><b>进度回读</b><p>查看课程、章节及服务端回执。</p></div><div class="ucl-feature"><b>播放设置</b><p>详情页倍速与任务参数可调整。</p></div></div><button class="ucl-primary ucl-cta" data-go="activate" type="button">输入激活码，开始使用</button><small class="ucl-quiet">预览不会发起学习请求 · 每码最多 4 个浏览器</small></section>
    <section class="ucl-pane" id="ucl-tutorial" role="tabpanel" aria-labelledby="ucl-tab-tutorial" hidden><div class="ucl-kicker">三步上手</div><h3>第一次使用？从这里开始。</h3><ol class="ucl-steps"><li><span class="ucl-step-number">1</span><b>安装并进入课程页面</b><p>在 Tampermonkey 导入此脚本并启用，登录联通党校，进入一个专题或课程详情页。首次请求授权域名时，允许脚本连接。</p></li><li><span class="ucl-step-number">2</span><b>填写激活码</b><p>切换到“激活授权”，粘贴管理员提供的激活码。一个码可绑定 4 个浏览器配置，同一浏览器多标签不重复占位。</p></li><li><span class="ucl-step-number">3</span><b>使用助手面板</b><p>激活后查看专题概况，确认设置再开始。需要中断时点击“停止并保留进度”；下次继续前检查登录状态。</p></li></ol><details class="ucl-faq"><summary>更换电脑或清空数据怎么办？</summary><p>新浏览器配置可能占用新名额。若已满 4 个，请联系管理员释放旧绑定；复制浏览器数据不能作为可靠的设备迁移方式。</p></details><details class="ucl-faq"><summary>为什么需要联网验证？</summary><p>脚本启动和运行期间会向授权服务发送激活码、随机浏览器编号，以验证使用权限。授权请求不发送党校密码、Cookie 或课程内容。</p></details><details class="ucl-faq"><summary>面板没有出现或提示验证失败？</summary><p>检查脚本是否启用、当前是否为联通党校页面，以及网络是否可访问授权服务；保留激活码后重试。提示停用、过期或名额已满时联系管理员。</p></details><button class="ucl-primary ucl-cta" data-go="activate" type="button">我已了解，去激活</button></section>
    <section class="ucl-pane" id="ucl-activate" role="tabpanel" aria-labelledby="ucl-tab-activate" hidden><span class="ucl-status-label">等待激活</span><h3>激活你的助手。</h3><p class="ucl-intro">输入激活码，验证通过后自动打开助手面板。</p><form><label class="ucl-label" for="ucl-code">激活码</label><input id="ucl-code" type="text" autocomplete="off" spellcheck="false" placeholder="粘贴管理员提供的激活码" maxlength="80"><p id="ucl-message" role="status" aria-live="polite">首次使用需要激活，后续会自动验证。</p><button class="ucl-primary" type="submit">激活并使用</button></form><div class="ucl-rule">永久使用，持续更新。<br>每码最多绑定 4 个浏览器配置。<br>授权状态以服务端校验为准；网络异常时可保留输入重试。</div></section>
    <footer class="ucl-bottom"><span>联通党校-刷课助手 · v${config.version}</span><button class="ucl-shop" type="button">前往链动小铺 ↗</button></footer>`;
  const intro = dialog.querySelector('#ucl-preview');
  if (config.shopUrl && config.shopQrDataUrl?.startsWith('data:image/png;base64,')) {
    const purchase = document.createElement('aside'); purchase.id = 'ucl-purchase';
    purchase.setAttribute('aria-label', '链动小铺购买入口');
    const qr = document.createElement('img'); qr.src = config.shopQrDataUrl; qr.width = 144; qr.height = 144; qr.alt = '链动小铺商品二维码，扫码获取激活码';
    const info = document.createElement('div');
    const title = document.createElement('strong'); title.textContent = '还没有激活码？';
    const copy = document.createElement('p'); copy.textContent = '手机扫码前往链动小铺，或点击底部入口购买。永久使用，持续更新；每码支持 4 个浏览器。';
    const address = document.createElement('small'); address.textContent = config.shopUrl;
    info.append(title, copy, address); purchase.append(qr, info); dialog.querySelector('#ucl-activate').append(purchase);
    const showQr = document.createElement('button'); showQr.type = 'button'; showQr.className = 'ucl-shop ucl-show-qr'; showQr.textContent = '扫码获取激活码';
    showQr.addEventListener('click', () => { selectTab('activate'); purchase.scrollIntoView?.({ block: 'nearest', behavior: 'smooth' }); });
    dialog.querySelector('.ucl-bottom').insertBefore(showQr, dialog.querySelector('.ucl-shop'));
    style.textContent += '#ucl-purchase{display:flex;align-items:center;gap:18px;margin-top:20px;padding:16px;border:1px solid var(--ucl-line);border-radius:12px;background:#fcfafb}#ucl-purchase img{flex:0 0 144px;background:white;image-rendering:pixelated}#ucl-purchase strong{font-size:14px}#ucl-purchase p{font-size:12px;color:var(--ucl-muted);margin:6px 0!important}#ucl-purchase small{font-size:10px;overflow-wrap:anywhere;color:var(--ucl-muted)}.ucl-bottom{flex-wrap:wrap}.ucl-bottom>span{margin-right:auto}@media(max-width:520px){#ucl-purchase{flex-direction:column;gap:8px;text-align:center}}';
  }
  const presentation = document.createElement('div'); presentation.className = 'ucl-presentation';
  while (intro.firstChild) presentation.append(intro.firstChild);
  const dashboardHost = document.createElement('div'); dashboardHost.className = 'ucl-dashboard-host';
  intro.append(presentation, dashboardHost);
  const dashboard = createCourseDashboard(dashboardHost);
  const layout = document.createElement('button'); layout.type = 'button'; layout.className = 'ucl-layout';
  let compact = GM_getValue('uc-display-mode', 'wide') === 'compact';
  function applyLayout() { dialog.classList.toggle('ucl-wide', !compact); dialog.classList.toggle('ucl-compact', compact); layout.textContent = compact ? '切换宽屏' : '切换小卡片'; }
  applyLayout(); layout.addEventListener('click', () => { compact = !compact; GM_setValue('uc-display-mode', compact ? 'compact' : 'wide'); applyLayout(); });
  dialog.querySelector('.ucl-top').insertBefore(layout, dialog.querySelector('.ucl-close'));
  const badge = document.createElement('button'); badge.id = 'ucl-badge'; badge.type = 'button'; badge.hidden = true; badge.textContent = '刷课助手 · 预览 / 教程';
  document.body.append(dialog, badge);
  const workspaceTab = document.createElement('button'); workspaceTab.id = 'ucl-tab-workspace'; workspaceTab.type = 'button'; workspaceTab.setAttribute('role', 'tab'); workspaceTab.setAttribute('aria-controls', 'ucl-workspace'); workspaceTab.setAttribute('aria-selected', 'false'); workspaceTab.dataset.tab = 'workspace'; workspaceTab.textContent = '运行控制'; workspaceTab.hidden = true;
  dialog.querySelector('.ucl-tabs').append(workspaceTab);
  const workspace = document.createElement('section'); workspace.id = 'ucl-workspace'; workspace.className = 'ucl-pane'; workspace.hidden = true; workspace.setAttribute('role', 'tabpanel'); workspace.setAttribute('aria-labelledby', 'ucl-tab-workspace');
  const workspaceChart = document.createElement('div'); const workspaceControls = document.createElement('div'); workspaceControls.className = 'ucl-workspace-controls'; workspace.append(workspaceChart, workspaceControls); dialog.insertBefore(workspace, dialog.querySelector('.ucl-bottom'));
  createCourseDashboard(workspaceChart);
  style.textContent += '#ucl-workspace{display:grid;grid-template-columns:minmax(0,1.3fr) minmax(310px,.9fr);gap:26px}#ucl-dialog #ucp-panel{position:relative!important;top:auto!important;right:auto!important;left:auto!important;bottom:auto!important;width:100%!important;box-shadow:none!important;margin:0!important;max-width:none!important;z-index:auto!important}#ucl-dialog #ucp-body{max-height:none!important;overflow:visible!important}#ucl-dialog #ucp-header .ucp-icon-button{display:none}#ucl-dialog #ucp-panel.ucp-collapsed{display:block}.ucl-compact #ucl-workspace{grid-template-columns:1fr}@media(max-width:760px){#ucl-workspace{grid-template-columns:1fr;gap:20px}}';
  const tabButtons = [...dialog.querySelectorAll('[data-tab]')];
  function selectTab(name, focus = false) {
    for (const button of tabButtons) { const selected = button.dataset.tab === name; button.setAttribute('aria-selected', String(selected)); button.tabIndex = selected ? 0 : -1; if (selected && focus) button.focus(); }
    for (const pane of dialog.querySelectorAll('[role="tabpanel"]')) pane.hidden = pane.id !== `ucl-${name}`;
  }
  for (const button of tabButtons) {
    button.addEventListener('click', () => selectTab(button.dataset.tab));
    button.addEventListener('keydown', event => {
      const visible = tabButtons.filter(tab => !tab.hidden); const i = visible.indexOf(button); const next = event.key === 'ArrowRight' ? (i + 1) % visible.length : event.key === 'ArrowLeft' ? (i + visible.length - 1) % visible.length : event.key === 'Home' ? 0 : event.key === 'End' ? visible.length - 1 : -1;
      if (next >= 0) { event.preventDefault(); selectTab(visible[next].dataset.tab, true); }
    });
  }
  dialog.querySelectorAll('[data-go]').forEach(button => button.addEventListener('click', () => { selectTab(button.dataset.go); dialog.querySelector('#ucl-code').focus(); }));
  dialog.querySelector('.ucl-close').addEventListener('click', () => { dialog.hidden = true; badge.hidden = false; });
  const demoButton = dialog.querySelector('.ucl-demo-toggle');
  demoButton.addEventListener('click', () => {
    const paused = demoButton.getAttribute('aria-pressed') !== 'true'; demoButton.setAttribute('aria-pressed', String(paused));
    dialog.querySelector('.ucl-demo-status').textContent = paused ? '演示已暂停' : '演示运行中'; demoButton.textContent = paused ? '继续演示' : '体验暂停 / 继续';
  });
  dialog.querySelector('.ucl-demo').remove();
  return { dialog, badge, selectTab, dashboard,
    attachPanel(panel, launcher) { workspaceControls.append(panel); launcher.hidden = true; workspaceTab.hidden = false; selectTab('workspace'); dialog.hidden = false; },
    lockWorkspace() { workspaceTab.hidden = true; }
  };
}

// Best-effort telemetry has its own native timer/request and never gates learning.
function createUsageReporter(config, native) {
  let enabled = false, learning = false, code = '', browserId = '', sessionId = '', sequence = 0, epoch = 0;
  let timer, handle, busy = false, dirty = false;
  function later(delay) {
    native.clearTimeout(timer);
    if (enabled) timer = native.setTimeout(send, delay);
  }
  function videoPlaying() {
    try { return Array.from(document.querySelectorAll("video")).some(video => !video.paused && !video.ended); }
    catch { return false; }
  }
  try {
    for (const event of ["play", "pause", "ended"]) document.addEventListener(event, () => {
      dirty = true; if (enabled && !busy) later(1000);
    }, true);
  } catch { /* Page media is optional. */ }
  function send() {
    if (!enabled || busy) return;
    busy = true; dirty = false;
    const currentEpoch = epoch;
    let done = false;
    const finish = () => {
      if (done || currentEpoch !== epoch) return;
      done = true; busy = false; handle = undefined;
      later(dirty ? 1000 : 120000);
    };
    try {
      handle = native.request({ method: 'POST', url: `${config.apiBase}/api/usage`, timeout: 3000, anonymous: true,
        headers: { 'Content-Type': 'application/json' },
        data: JSON.stringify({ code, browserId, sessionId, sequence: ++sequence, learning: learning || videoPlaying(), version: config.version }),
        onload: finish, onerror: finish, ontimeout: finish, onabort: finish });
    } catch { finish(); }
  }
  return {
    start(nextCode, nextBrowser) {
      try {
        if (enabled && code === nextCode && browserId === nextBrowser) return;
        epoch++; busy = false;
        try { handle?.abort(); } catch { /* Previous report is expendable. */ }
        code = nextCode; browserId = nextBrowser;
        if (!sessionId) sessionId = crypto.randomUUID();
        enabled = true; later(1000);
      } catch { enabled = false; }
    },
    setLearning(value) {
      try {
        if (learning === Boolean(value)) return;
        learning = Boolean(value); dirty = true;
        if (!busy) later(1000);
      } catch { /* Statistics must not affect the task state. */ }
    },
    stop() {
      epoch++; enabled = false; learning = false;
      try { native.clearTimeout(timer); handle?.abort(); } catch { /* Best effort. */ }
      busy = false;
    },
  };
}
// This function is embedded into the userscript by scripts/build.mjs.
function createLicenseGate(config) {
  const KEYS = { code: 'uc-license-v1-code', browser: 'uc-license-v1-browser' };
  const native = {
    setTimeout: window.setTimeout.bind(window), clearTimeout: window.clearTimeout.bind(window),
    setInterval: window.setInterval.bind(window), clearInterval: window.clearInterval.bind(window),
    request: GM_xmlhttpRequest,
  };
  const usage = createUsageReporter(config, native);
  const timers = new Set(); const requests = new Set(); const lockHandlers = [];
  let allowed = false; let started = false; let onGranted; let checking = false; let recheckTimer;
  let expiresAt = null; let checkedAt = 0; let dialog; let input; let message; let submit; let badge;
  let browserId = GM_getValue(KEYS.browser, '');
  if (!/^[0-9a-f-]{36}$/i.test(browserId)) {
    browserId = crypto.randomUUID();
    GM_setValue(KEYS.browser, browserId);
  }
  function validNow() {
    return allowed && Date.now() - checkedAt < 30 * 60 * 1000
      && (expiresAt === null || Date.now() < expiresAt);
  }
  function shop() {
    if (!config.shopUrl) { dialog._licenseSelectTab('activate'); message.textContent = '链动小铺链接暂未配置，请联系管理员获取激活码。'; return; }
    try {
      const url = new URL(config.shopUrl);
      if (url.protocol !== 'https:') throw new Error('invalid URL');
      window.open(url.href, '_blank', 'noopener,noreferrer');
    } catch { dialog._licenseSelectTab('activate'); message.textContent = '小铺链接配置无效，请联系管理员。'; }
  }
  function mount() {
    if (dialog) return;
    const view = createLicenseView(config);
    dialog = view.dialog; badge = view.badge;
    dialog._licenseSelectTab = view.selectTab;
    dialog._licenseAttachPanel = view.attachPanel;
    dialog._licenseLockWorkspace = view.lockWorkspace;
    input = dialog.querySelector('#ucl-code'); message = dialog.querySelector('#ucl-message'); submit = dialog.querySelector('[type="submit"]');
    input.value = GM_getValue(KEYS.code, '');
    dialog.querySelector('form').addEventListener('submit', event => { event.preventDefault(); void verify(true); });
    dialog.querySelector('.ucl-shop:not(.ucl-show-qr)').addEventListener('click', shop);
    badge.addEventListener('click', () => {
      dialog.hidden = !dialog.hidden;
      if (!dialog.hidden && validNow()) {
        message.textContent = '当前浏览器已激活。可前往小铺或重新校验授权。'; submit.textContent = '重新验证';
      }
    });
  }
  function lock(reason) {
    usage.stop();
    const hadAccess = allowed; allowed = false; checkedAt = 0;
    for (const timer of timers) { native.clearTimeout(timer); native.clearInterval(timer); }
    timers.clear();
    for (const handle of [...requests]) { try { handle.abort(); } catch { /* Already finished. */ } }
    requests.clear();
    if (hadAccess) lockHandlers.forEach(fn => fn());
    mount(); dialog.hidden = false; dialog._licenseSelectTab('activate'); badge.hidden = true; message.textContent = reason; submit.textContent = '激活 / 重试';
    dialog.querySelector('.ucl-status-label').textContent = hadAccess ? '需要重新验证' : '等待激活';
    dialog._licenseLockWorkspace();
  }
  function call(path, code) {
    return new Promise((resolve, reject) => {
      let settled = false;
      const finish = (error, result) => { if (settled) return; settled = true; error ? reject(error) : resolve(result); };
      native.request({ method: 'POST', url: `${config.apiBase}${path}`, timeout: 10000, anonymous: true,
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, data: JSON.stringify({ code, browserId }),
        onload(response) {
          try {
            const b = JSON.parse(response.responseText);
            if (response.status !== 200 || b.ok !== true || b.status !== 'active' || b.maxBrowsers !== 4
              || !Number.isInteger(b.boundCount) || b.boundCount < 1 || b.boundCount > 4
              || !(b.expiresAt === null || (typeof b.expiresAt === 'string' && Number.isFinite(Date.parse(b.expiresAt)) && Date.parse(b.expiresAt) > Date.now()))) {
              finish(new Error(typeof b.message === 'string' ? b.message.slice(0, 160) : '授权验证未通过，请稍后重试')); return;
            }
            finish(null, b);
          } catch { finish(new Error('授权响应无效，请稍后重试')); }
        },
        onerror() { finish(new Error('无法连接授权服务，请检查网络后重试')); },
        ontimeout() { finish(new Error('授权验证超时，请稍后重试')); },
        onabort() { finish(new Error('授权验证已取消')); },
      });
    });
  }
  async function verify(activate = false) {
    if (checking) return;
    mount();
    const code = input.value.trim();
    if (!code) { lock('请输入激活码，也可通过链动小铺联系管理员。'); return; }
    if (!/^https:\/\//.test(config.apiBase)) { lock('授权服务地址尚未配置，请联系管理员。'); return; }
    checking = true; submit.disabled = true; message.textContent = '正在验证授权…';
    const wasVisible = !dialog.hidden;
    try {
      const previous = GM_getValue(KEYS.code, '');
      if (allowed && code !== previous) lock('正在切换激活码，原任务已暂停。');
      const result = await call(activate ? '/api/activate' : '/api/check', code);
      GM_setValue(KEYS.code, code); expiresAt = result.expiresAt === null ? null : Date.parse(result.expiresAt);
      checkedAt = Date.now(); allowed = true;
      usage.start(code, browserId);
      badge.hidden = false; badge.textContent = `授权已激活 · ${result.boundCount}/4 浏览器 · 小铺`;
      message.textContent = `激活成功，已绑定 ${result.boundCount}/4 个浏览器。`;
      dialog.querySelector('.ucl-status-label').textContent = '授权已激活';
      dialog.hidden = started ? !wasVisible : true;
      if (!started) { started = true; onGranted?.(); }
      else if (timers.size === 0 && lockHandlers.length) {
        dialog.hidden = false; message.textContent = '授权已恢复，请刷新页面继续。';
        if (!dialog.querySelector('.ucl-reload')) {
          const button = document.createElement('button'); button.type = 'button'; button.className = 'ucl-reload'; button.textContent = '刷新并继续';
          button.addEventListener('click', () => location.reload()); dialog.querySelector('form').append(button);
        }
      }
      native.clearTimeout(recheckTimer);
      recheckTimer = native.setTimeout(() => { void verify(false); }, Math.max(1, Math.min(30 * 60 * 1000, expiresAt === null ? Infinity : expiresAt - Date.now())));
    } catch (error) { lock(error.message); }
    finally { checking = false; submit.disabled = false; }
  }
  function guard() {
    if (validNow()) return true;
    lock('授权需要重新验证，请重试后继续。');
    if (!checking && GM_getValue(KEYS.code, '')) void verify(false);
    return false;
  }
  function interval(fn, ms, ...args) {
    const id = native.setInterval(() => { if (guard()) fn(...args); }, ms); timers.add(id); return id;
  }
  function timeout(fn, ms, ...args) {
    const id = native.setTimeout(() => { timers.delete(id); if (guard()) fn(...args); }, ms); timers.add(id); return id;
  }
  function request(details) {
    if (!guard()) { native.setTimeout(() => details.onerror?.({ error: 'license_required' }), 0); return { abort() {} }; }
    let handle; let finished = false;
    const options = { ...details };
    for (const event of ['onload','onerror','ontimeout','onabort']) {
      options[event] = (...args) => {
        finished = true; requests.delete(handle);
        if (event === 'onload' && !validNow()) { details.onerror?.({ error: 'license_required' }); return; }
        const fn = details[event] || (event === 'onabort' ? details.onerror : undefined); fn?.(...args);
      };
    }
    handle = native.request(options); if (!finished) requests.add(handle); return handle;
  }
  return {
    setLearning(value) { usage.setLearning(value); },
    mount, lock, verify, validNow, request, setInterval: interval, setTimeout: timeout,
    clearInterval(id) { timers.delete(id); native.clearInterval(id); }, clearTimeout(id) { timers.delete(id); native.clearTimeout(id); },
    onLock(fn) { lockHandlers.push(fn); },
    attachPanel(panel, launcher) { mount(); dialog._licenseAttachPanel(panel, launcher); },
    start(fn) {
      onGranted = fn; mount();
      if (GM_getValue(KEYS.code, '')) { dialog._licenseSelectTab('activate'); void verify(false); }
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible' && allowed && !validNow()) { lock('正在重新验证授权…'); void verify(false); }
      });
    },
  };
}

const licenseGate = createLicenseGate(LICENSE_CONFIG);
licenseGate.start(function launchAssistant() {
const setInterval = licenseGate.setInterval;
const setTimeout = licenseGate.setTimeout;
const clearInterval = licenseGate.clearInterval;
const clearTimeout = licenseGate.clearTimeout;
const GM_xmlhttpRequest = licenseGate.request;
(function () {
  'use strict';

  const VERSION = '1.2.3';
  const API = {
    list: 'https://campus.chinaunicom.cn/training/app/themeColumn/getMyAreaInfoCourse',
    info: 'https://campus.chinaunicom.cn/training/app/course/info',
    progress: 'https://campus.chinaunicom.cn/training/app/course/playtimeV2',
  };
  const PUBLIC_KEY = 'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAooxomrujIP9vcxxNmS+Q1xxnaoxAfluwFvDR3+G+p84QMsePXDD67cLjJ+7n+79u2xoG7fVvDnzHDW+X5D/0/Dv9ajUaBpFQl3jqKwRiP3Lrx08seYzWIWDGHEjurbZrWGHRJNdoM7tEQPdPZftZC6iOm7kSjDIDiuqaIh9g3hqFSVQ5r15Dvae6qtREo1nDWKsf3tH6nkvVD2pIh3TBJUoGdfbPqnw/tNvzhwOX9tg7NjhZ8Yet1ctVt297G5HCwPSIBjhUKEtLYLk/8scPrzXnQpAU05m5WnHfDhfvvG2xoVXckveNvZhv6lvxTZqRkUBOI1pU16U9Tz4aDpCU7QIDAQAB';
  const KEYS = {
    settings: 'uc-personal-v1-settings',
    resume: 'uc-personal-v1-resume',
    position: 'uc-personal-v1-position',
    rateDefaultMigrated: 'uc-personal-v1-rate-default-migrated-105',
  };
  const DEFAULTS = {
    concurrency: 10,
    chunkSeconds: 150,
    roundDelay: 32,
    batchGap: 1,
    retries: 3,
    autoResume: true,
    skipFinished: true,
    playerRate: 1,
  };

  const storedSettings = GM_getValue(KEYS.settings, DEFAULTS);
  if (!GM_getValue(KEYS.rateDefaultMigrated, false)) {
    storedSettings.playerRate = 1;
    GM_setValue(KEYS.settings, storedSettings);
    GM_setValue(KEYS.rateDefaultMigrated, true);
  }
  let settings = normalizeSettings(storedSettings);
  let state = {
    running: false,
    stopping: false,
    phase: 'idle',
    themeId: null,
    totalCourses: 0,
    pendingCourses: 0,
    totalTasks: 0,
    doneTasks: 0,
    failedTasks: 0,
    round: 0,
    batch: 0,
    totalBatches: 0,
    currentCourse: '',
    currentChapter: '',
    serverProgress: null,
    currentSeconds: 0,
    totalSeconds: 0,
    submitted: 0,
    submitFailed: 0,
    readbackConfirmed: 0,
    readbackTotal: 0,
    lastAckAt: null,
    nextRoundIn: null,
    themeTotalHours: null,
    themeLearnedHours: null,
    themePercent: null,
    wakeLock: null,
  };
  let panel = null;
  let lastRoute = '';
  licenseGate.onLock(() => {
    stopRun();
    state.stopping = true; licenseGate.setLearning(false);
    state.running = false; licenseGate.setLearning(false);
    releaseWakeLock();
    if (panel) { panel.remove(); panel = null; }
    document.getElementById('ucp-launcher')?.remove();
  });

  function clamp(value, min, max, fallback) {
    const number = Number(value);
    return Number.isFinite(number) ? Math.min(max, Math.max(min, number)) : fallback;
  }

  function normalizeSettings(input) {
    const rawConcurrency = Number(input.concurrency);
    return {
      concurrency: Number.isFinite(rawConcurrency) && rawConcurrency >= 1
        ? Math.floor(rawConcurrency)
        : DEFAULTS.concurrency,
      chunkSeconds: Math.round(clamp(input.chunkSeconds, 30, 179, DEFAULTS.chunkSeconds)),
      roundDelay: Math.round(clamp(input.roundDelay, 30, 120, DEFAULTS.roundDelay)),
      batchGap: clamp(input.batchGap, 0.5, 10, DEFAULTS.batchGap),
      retries: Math.round(clamp(input.retries, 0, 8, DEFAULTS.retries)),
      autoResume: input.autoResume !== false,
      skipFinished: input.skipFinished !== false,
      playerRate: clamp(input.playerRate, 1, 6, DEFAULTS.playerRate),
    };
  }

  function token() {
    const match = document.cookie.match(/(?:^|;\s*)token=([^;]+)/);
    if (!match) throw new Error('登录状态已失效，请重新登录党校');
    return decodeURIComponent(match[1]);
  }

  function randomString(length = 32) {
    const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    let output = '';
    for (let index = 0; index < length; index += 1) {
      output += chars[Math.floor(Math.random() * chars.length)];
    }
    return output;
  }

  function commonParams() {
    return {
      token: token(),
      timestamp: Math.floor(Date.now() / 1000),
      companyId: localStorage.getItem('companyId') || 0,
      from: 'WEB',
      organizationId: localStorage.getItem('organizationId') || 0,
      randomStr: randomString(),
    };
  }

  function signed(params) {
    let serialized = '';
    Object.keys(params).sort().forEach((key) => {
      if (params[key] !== null && params[key] !== undefined) {
        serialized += `${key}=${params[key]}&`;
      }
    });
    const rsa = new JSEncrypt();
    rsa.setPublicKey(PUBLIC_KEY);
    const signature = rsa.encrypt(md5(serialized));
    if (!signature) throw new Error('请求签名生成失败');
    return `${serialized}sign=${encodeURIComponent(signature)}`;
  }

  function request(url, params, retries = 0) {
    return new Promise((resolve, reject) => {
      GM_xmlhttpRequest({
        method: 'POST',
        url: `${url}?${signed(params)}`,
        timeout: 30000,
        headers: {
          Accept: 'application/json, text/plain, */*',
          'Content-Type': 'application/x-www-form-urlencoded',
          Origin: 'https://campus.chinaunicom.cn',
          Referer: location.href,
        },
        onload(response) {
          try {
            const body = JSON.parse(response.responseText || response.response || '{}');
            if (body.success && Number(body.code) === 200) resolve(body);
            else reject(new Error(body.message || `接口返回 ${body.code || response.status}`));
          } catch (error) {
            reject(new Error(`响应解析失败：${error.message}`));
          }
        },
        onerror() {
          if (retries > 0) resolve(request(url, params, retries - 1));
          else reject(new Error('网络请求失败'));
        },
        ontimeout() {
          if (retries > 0) resolve(request(url, params, retries - 1));
          else reject(new Error('请求超时'));
        },
      });
    });
  }

  function themeIdFromUrl() {
    const match = location.href.match(/[?&]id=(\d+)/);
    return match ? match[1] : null;
  }

  function courseIdFromUrl() {
    const match = location.href.match(/course_courseDetails\/(\d+)/);
    return match ? match[1] : null;
  }

  function listParams(themeId, page, pageSize = 8) {
    return {
      ...commonParams(),
      id: themeId,
      subjectId: '',
      status: 1,
      name: '',
      currentPage: page,
      pageSize,
      total: 0,
    };
  }

  async function fetchAllCourses(themeId, progressCallback) {
    const first = await request(API.list, listParams(themeId, 1), 1);
    const firstPage = first.entity && first.entity.page ? first.entity.page : {};
    const total = Number(firstPage.totalResultSize || firstPage.total || 0);
    const pageSize = 8;
    const pages = Math.max(1, Math.ceil(total / pageSize));
    const pageNumbers = Array.from({ length: Math.max(0, pages - 1) }, (_, index) => index + 2);
    const results = [first];
    let completed = 1;
    await pool(pageNumbers, Math.min(settings.concurrency, 4), async (page) => {
      const result = await request(API.list, listParams(themeId, page, pageSize), 1);
      results[page - 1] = result;
      completed += 1;
      if (progressCallback) progressCallback(completed, pages);
    });
    const collected = results.flatMap((result) => result && result.entity && Array.isArray(result.entity.courseList)
      ? result.entity.courseList
      : []);
    const unique = Array.from(new Map(collected.map((course) => [String(course.id), course])).values());
    if (total > 0 && unique.length !== total) {
      throw new Error(`专题分页不完整：应有 ${total} 门，实际读取 ${unique.length} 门`);
    }
    return unique;
  }

  async function fetchCourseInfo(course) {
    const result = await request(API.info, {
      ...commonParams(),
      courseId: course.id,
    }, 1);
    return {
      id: course.id,
      name: course.name || `课程 ${course.id}`,
      kpointList: result.entity && Array.isArray(result.entity.kpointList)
        ? result.entity.kpointList
        : [],
    };
  }

  function findKpointById(kpointList, kpointId) {
    const targetId = String(kpointId);
    const stack = Array.isArray(kpointList) ? [...kpointList] : [];
    while (stack.length) {
      const current = stack.shift();
      if (String(current && current.id) === targetId) return current;
      if (current && Array.isArray(current.childKpointList)) {
        stack.push(...current.childKpointList);
      }
    }
    return null;
  }

  async function verifyServerProgress(task, expectedValue) {
    const course = await fetchCourseInfo({ id: task.courseId, name: task.courseName });
    const kpoint = findKpointById(course.kpointList, task.kpointId);
    if (!kpoint) throw new Error(`服务端回读未找到章节 ${task.kpointId}`);
    const actual = Math.max(0, Number.parseInt(kpoint.userPlayTime, 10) || 0);
    const progress = Math.max(0, Number.parseFloat(kpoint.progress) || 0);
    return {
      actual,
      progress,
      accepted: actual >= expectedValue || progress >= 100,
    };
  }

  function resetLiveMetrics() {
    Object.assign(state, {
      round: 0,
      batch: 0,
      totalBatches: 0,
      currentCourse: '',
      currentChapter: '',
      serverProgress: null,
      currentSeconds: 0,
      totalSeconds: 0,
      submitted: 0,
      submitFailed: 0,
      readbackConfirmed: 0,
      readbackTotal: 0,
      lastAckAt: null,
      nextRoundIn: null,
    });
    renderLive();
  }

  function liveSnapshot() {
    return {
      round: state.round,
      batch: state.batch,
      totalBatches: state.totalBatches,
      currentCourse: state.currentCourse,
      currentChapter: state.currentChapter,
      serverProgress: state.serverProgress,
      currentSeconds: state.currentSeconds,
      totalSeconds: state.totalSeconds,
      submitted: state.submitted,
      submitFailed: state.submitFailed,
      readbackConfirmed: state.readbackConfirmed,
      readbackTotal: state.readbackTotal,
      lastAckAt: state.lastAckAt,
      nextRoundIn: state.nextRoundIn,
    };
  }

  function applyTaskToLive(task) {
    state.currentCourse = task.courseName || `课程 ${task.courseId}`;
    state.currentChapter = task.name || `章节 ${task.kpointId}`;
    state.serverProgress = Number.isFinite(task.serverProgress) ? task.serverProgress : null;
    state.currentSeconds = Math.max(0, Number(task.current) || 0);
    state.totalSeconds = Math.max(0, Number(task.total) || 0);
    state.lastAckAt = Date.now();
    renderLive();
  }

  function readThemeSummaryFromPage() {
    if (!panel || !themeIdFromUrl()) return;
    const pageText = document.body ? document.body.innerText : '';
    const match = pageText.match(/课程总学时[\s：:]*(\d+(?:\.\d+)?)\s*学时[\s\S]{0,180}?已学习\s*(\d+(?:\.\d+)?)\s*学时\s*(\d+(?:\.\d+)?)\s*%/);
    if (!match) return;
    state.themeTotalHours = Number(match[1]);
    state.themeLearnedHours = Number(match[2]);
    state.themePercent = Number(match[3]);
    renderLive();
  }

  async function verifyTaskSample(tasks, limit = 3) {
    const sample = tasks
      .filter((task) => task.lastSubmittedAt)
      .sort((left, right) => right.lastSubmittedAt - left.lastSubmittedAt)
      .slice(0, limit);
    if (!sample.length || state.stopping) return;
    state.readbackTotal += sample.length;
    renderLive();
    const results = await Promise.allSettled(sample.map((task) => verifyServerProgress(task, task.current)));
    results.forEach((result, index) => {
      if (result.status !== 'fulfilled') return;
      const task = sample[index];
      const verification = result.value;
      task.current = Math.max(task.current, verification.actual);
      task.serverProgress = verification.progress;
      task.done = verification.progress >= 100
        || (verification.progress === 0 && task.current >= task.total);
      if (verification.accepted) state.readbackConfirmed += 1;
      applyTaskToLive(task);
    });
    renderLive();
  }

  async function reconcileAllTasks(tasks) {
    const byCourse = new Map();
    tasks.forEach((task) => {
      const key = String(task.courseId);
      if (!byCourse.has(key)) byCourse.set(key, []);
      byCourse.get(key).push(task);
    });
    const groups = Array.from(byCourse.entries());
    let checked = 0;
    setPhase('verify', '正在进行平台最终复核');
    await pool(groups, Math.min(settings.concurrency, 8), async ([courseId, courseTasks]) => {
      if (state.stopping) return;
      try {
        const course = await fetchCourseInfo({ id: courseId, name: courseTasks[0].courseName });
        courseTasks.forEach((task) => {
          state.readbackTotal += 1;
          const kpoint = findKpointById(course.kpointList, task.kpointId);
          if (!kpoint) {
            task.done = false;
            task.lastError = '平台复核未找到章节';
            return;
          }
          const total = parseTime(kpoint.time) || task.total;
          const actual = Math.max(0, Number.parseInt(kpoint.userPlayTime, 10) || 0);
          const progress = Math.max(0, Number.parseFloat(kpoint.progress) || 0);
          task.total = total;
          task.current = actual;
          task.serverProgress = progress;
          task.done = progress >= 100 || (progress === 0 && total > 0 && actual >= total);
          task.lastError = '';
          state.readbackConfirmed += 1;
          applyTaskToLive(task);
        });
      } catch (error) {
        state.readbackTotal += courseTasks.length;
        courseTasks.forEach((task) => {
          task.done = false;
          task.lastError = `平台复核失败：${error.message}`;
        });
      }
      checked += 1;
      setStatus(`平台复核 ${checked}/${groups.length} 门课程`);
      renderLive();
    });
    state.doneTasks = tasks.filter((task) => task.done).length;
    state.pendingCourses = new Set(tasks.filter((task) => !task.done).map((task) => String(task.courseId))).size;
    renderStats();
    renderLive();
    return tasks.filter((task) => !task.done);
  }

  function parseTime(value) {
    if (value === null || value === undefined || value === '') return 0;
    if (!Number.isNaN(Number(value))) return Math.round(Number(value));
    const text = String(value).trim();
    if (/^\d{1,2}:\d{1,2}(?::\d{1,2})?$/.test(text)) {
      return text.split(':').map(Number).reduce((sum, item) => sum * 60 + item, 0);
    }
    const match = text.match(/(?:(\d+)\s*小时)?(?:(\d+)\s*分)?(?:(\d+)\s*秒)?/);
    return match ? (Number(match[1] || 0) * 3600) + (Number(match[2] || 0) * 60) + Number(match[3] || 0) : 0;
  }

  function flattenTasks(courses) {
    const tasks = [];
    courses.forEach((course) => {
      course.kpointList.forEach((parent) => {
        const videos = Array.isArray(parent.childKpointList) && parent.childKpointList.length
          ? parent.childKpointList
          : [parent];
        videos.forEach((video) => {
          const total = parseTime(video.time);
          const current = Math.max(0, Number.parseInt(video.userPlayTime, 10) || 0);
          const progress = Number.parseInt(video.progress, 10) || 0;
          if (total > 0 && progress < 100 && current < total) {
            tasks.push({
              courseId: course.id,
              courseName: course.name,
              kpointId: video.id,
              name: video.name || parent.name || `章节 ${video.id}`,
              current,
              total,
              failures: 0,
              done: false,
            });
          }
        });
      });
    });
    return tasks;
  }

  async function sendProgress(task, nextValue) {
    state.currentCourse = task.courseName || `课程 ${task.courseId}`;
    state.currentChapter = task.name || `章节 ${task.kpointId}`;
    state.currentSeconds = task.current;
    state.totalSeconds = task.total;
    renderLive();
    const result = await request(API.progress, {
      ...commonParams(),
      accrualType: 0,
      type: 'playback',
      kpointId: task.kpointId,
      courseId: task.courseId,
      breakpoint: nextValue,
      studyTime: nextValue,
    }, 1);
    const serverProgress = Number(result.entity);
    task.current = nextValue;
    task.serverProgress = Number.isFinite(serverProgress) ? serverProgress : null;
    task.done = Number.isFinite(serverProgress)
      ? serverProgress >= 100
      : task.current >= task.total;
    task.failures = 0;
    task.lastSubmittedAt = Date.now();
    task.lastSubmittedRound = state.round;
    state.submitted += 1;
    applyTaskToLive(task);
    return result;
  }

  async function pool(items, limit, worker) {
    let cursor = 0;
    const runners = Array.from({ length: Math.min(limit, Math.max(1, items.length)) }, async () => {
      while (cursor < items.length) {
        const index = cursor;
        cursor += 1;
        await worker(items[index], index);
      }
    });
    await Promise.all(runners);
  }

  const sleep = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));

  function isCourseFinished(course) {
    return Number(course.finish) === 1 || Number(course.courseProgress) >= 100 || Number(course.progress) >= 100;
  }

  async function prepareTasks(themeId) {
    setPhase('scan', '正在读取专题全部课程');
    const courses = await fetchAllCourses(themeId, (done, total) => {
      setStatus(`正在读取专题页 ${done}/${total}`);
      setProgress(done / total * 18);
    });
    state.totalCourses = courses.length;
    const pending = settings.skipFinished ? courses.filter((course) => !isCourseFinished(course)) : courses;
    state.pendingCourses = pending.length;
    renderStats();
    if (!pending.length) return [];

    setPhase('prepare', `正在整理 ${pending.length} 门未完成课程`);
    const details = new Array(pending.length);
    let completed = 0;
    await pool(pending, settings.concurrency, async (course, index) => {
      if (state.stopping) return;
      details[index] = await fetchCourseInfo(course);
      completed += 1;
      setStatus(`正在整理课程 ${completed}/${pending.length}`);
      setProgress(18 + completed / pending.length * 17);
      await sleep(settings.batchGap * 1000);
    });
    return flattenTasks(details.filter(Boolean));
  }

  function saveResume(tasks, paused = false) {
    GM_setValue(KEYS.resume, {
      version: VERSION,
      themeId: state.themeId,
      savedAt: Date.now(),
      tasks,
      totalCourses: state.totalCourses,
      pendingCourses: state.pendingCourses,
      live: liveSnapshot(),
      verificationPending: state.phase === 'verify',
      paused,
    });
  }

  async function runTasks(tasks) {
    state.totalTasks = tasks.length;
    state.doneTasks = tasks.filter((task) => task.done).length;
    renderStats();
    if (!tasks.length) {
      finishRun('这个专题已经全部完成');
      return;
    }

    saveResume(tasks);
    let round = 0;
    let finalVerificationAttempts = 0;
    while (state.running && !state.stopping) {
      const pending = tasks.filter((task) => !task.done && task.failures <= settings.retries);
      if (!pending.length) {
        if (tasks.some((task) => !task.done)) break;
        setPhase('verify', '正在准备平台最终复核');
        saveResume(tasks);
        const unresolved = await reconcileAllTasks(tasks);
        if (!unresolved.length || state.stopping) break;
        finalVerificationAttempts += 1;
        if (finalVerificationAttempts > settings.retries) {
          unresolved.forEach((task) => { task.failures = settings.retries + 1; });
          break;
        }
        unresolved.forEach((task) => { task.failures = 0; });
        setPhase('run', `平台复核发现 ${unresolved.length} 个章节未完成`);
        setStatus('已自动加回任务队列');
        saveResume(tasks);
        continue;
      }
      round += 1;
      state.round = round;
      state.batch = 0;
      state.totalBatches = Math.ceil(pending.length / settings.concurrency);
      state.nextRoundIn = null;
      renderLive();
      setPhase('run', `第 ${round} 轮，${pending.length} 个章节待完成`);
      for (let index = 0; index < pending.length && state.running && !state.stopping; index += settings.concurrency) {
        const batch = pending.slice(index, index + settings.concurrency);
        state.batch = Math.floor(index / settings.concurrency) + 1;
        renderLive();
        setStatus(`并发处理 ${Math.min(index + batch.length, pending.length)}/${pending.length}`);
        await Promise.all(batch.map(async (task) => {
          const next = Math.min(task.total, task.current + settings.chunkSeconds);
          try {
            await sendProgress(task, next);
          } catch (error) {
            task.failures += 1;
            task.lastError = error.message;
            state.submitFailed += 1;
            state.currentCourse = task.courseName;
            state.currentChapter = task.name;
            renderLive();
          }
        }));
        state.doneTasks = tasks.filter((task) => task.done).length;
        state.failedTasks = tasks.filter((task) => !task.done && task.failures > settings.retries).length;
        saveResume(tasks);
        renderStats();
        setProgress(35 + state.doneTasks / state.totalTasks * 65);
        if (index + settings.concurrency < pending.length) await sleep(settings.batchGap * 1000);
      }
      if (state.running && !state.stopping) {
        const submittedThisRound = tasks.filter((task) => task.lastSubmittedRound === round);
        setStatus('正在抽样回读平台进度');
        await verifyTaskSample(submittedThisRound, Math.min(3, submittedThisRound.length));
        saveResume(tasks);
      }
      const stillPending = tasks.some((task) => !task.done && task.failures <= settings.retries);
      if (stillPending && state.running && !state.stopping) {
        await countdown(settings.roundDelay);
      }
    }

    if (state.stopping) {
      saveResume(tasks, true);
      state.running = false; licenseGate.setLearning(false);
      state.stopping = false;
      setPhase('paused', '已安全停止，可继续上次进度');
      updateControls();
      renderLive();
      releaseWakeLock();
      return;
    }

    const failed = tasks.filter((task) => !task.done).length;
    if (failed) {
      saveResume(tasks, true);
      state.running = false; licenseGate.setLearning(false);
      setPhase('error', `${failed} 个章节连续失败，已自动暂停`);
      setStatus('可检查登录状态后点击继续');
      updateControls();
      renderLive();
      releaseWakeLock();
    } else {
      GM_deleteValue(KEYS.resume);
      finishRun('专题课程已全部跑完');
    }
  }

  async function countdown(seconds) {
    for (let remaining = seconds; remaining > 0 && state.running && !state.stopping; remaining -= 1) {
      state.nextRoundIn = remaining;
      renderLive();
      setStatus(`本轮完成，${remaining} 秒后继续`);
      await sleep(1000);
    }
    state.nextRoundIn = null;
    renderLive();
  }

  async function startRun(forceFresh = false) {
    if (state.running) return;
    const themeId = themeIdFromUrl();
    if (!themeId) {
      setPhase('error', '请先进入一个主题专栏');
      return;
    }
    readSettingsFromUI();
    state.running = true; licenseGate.setLearning(true);
    state.stopping = false;
    state.themeId = themeId;
    state.failedTasks = 0;
    resetLiveMetrics();
    updateControls();
    requestWakeLock();
    try {
      const resume = GM_getValue(KEYS.resume, null);
      let tasks;
      if (!forceFresh && resume && String(resume.themeId) === String(themeId) && Array.isArray(resume.tasks)) {
        tasks = resume.tasks;
        state.totalCourses = resume.totalCourses || 0;
        state.pendingCourses = resume.pendingCourses || 0;
        setPhase('prepare', `已恢复 ${tasks.filter((task) => !task.done).length} 个待处理章节`);
      } else {
        if (forceFresh) GM_deleteValue(KEYS.resume);
        tasks = await prepareTasks(themeId);
      }
      if (state.stopping) throw new Error('用户停止');
      await runTasks(tasks);
    } catch (error) {
      state.running = false; licenseGate.setLearning(false);
      state.stopping = false;
      setPhase(error.message === '用户停止' ? 'paused' : 'error', error.message === '用户停止' ? '已停止' : error.message);
      setStatus(error.message === '用户停止' ? '可以随时继续' : '请检查登录状态或稍后重试');
      updateControls();
      renderLive();
      releaseWakeLock();
    }
  }

  function stopRun() {
    if (!state.running) return;
    state.stopping = true; licenseGate.setLearning(false);
    setPhase('stopping', '正在安全停止');
    setStatus('当前请求结束后暂停');
    updateControls();
  }

  function finishRun(message) {
    state.running = false; licenseGate.setLearning(false);
    state.stopping = false;
    setPhase('done', message);
    setStatus('无需再操作');
    setProgress(100);
    updateControls();
    renderLive();
    releaseWakeLock();
  }

  async function concurrencyProbe() {
    const themeId = themeIdFromUrl();
    if (!themeId || state.running) return;
    readSettingsFromUI();
    const button = panel.querySelector('[data-action="probe"]');
    button.disabled = true;
    const targetConcurrency = settings.concurrency;
    resetLiveMetrics();
    setPhase('test', `正在检测 ${targetConcurrency} 路并发`);
    setStatus(`会给 ${targetConcurrency} 个未完成章节各增加约 1 秒进度`);
    try {
      const allCourses = await fetchAllCourses(themeId);
      const courses = allCourses.filter((course) => !isCourseFinished(course));
      state.totalCourses = allCourses.length;
      state.pendingCourses = courses.length;
      renderStats();
      const details = [];
      for (const course of courses) {
        details.push(await fetchCourseInfo(course));
        const tasks = flattenTasks(details);
        const distinct = tasks
          .filter((task) => task.total - task.current > 5)
          .filter((task, index, list) => list.findIndex((item) => item.courseId === task.courseId) === index);
        if (distinct.length >= targetConcurrency) {
          const started = performance.now();
          const samples = distinct.slice(0, targetConcurrency);
          const expectedValues = new Map(samples.map((task) => [String(task.kpointId), Math.min(task.total, task.current + 1)]));
          await Promise.all(samples.map((task) => sendProgress(task, expectedValues.get(String(task.kpointId)))));
          await sleep(800);
          const verifications = await Promise.all(samples.map((task) => verifyServerProgress(
            task,
            expectedValues.get(String(task.kpointId)),
          )));
          state.readbackTotal += verifications.length;
          verifications.forEach((verification, index) => {
            const task = samples[index];
            task.current = Math.max(task.current, verification.actual);
            task.serverProgress = verification.progress;
            if (verification.accepted) state.readbackConfirmed += 1;
            applyTaskToLive(task);
          });
          const rejected = verifications.filter((verification) => !verification.accepted);
          if (rejected.length) {
            throw new Error(`${rejected.length} 路提交成功但服务端回读未增长`);
          }
          const elapsed = ((performance.now() - started) / 1000).toFixed(1);
          setPhase('done', `${targetConcurrency} 路并发已记账，耗时 ${elapsed} 秒`);
          setStatus('提交后已重新读取课程详情，平台进度确认增长');
          return;
        }
      }
      throw new Error(`未找到 ${targetConcurrency} 门可用于检测的未完成课程`);
    } catch (error) {
      setPhase('error', `并发检测失败：${error.message}`);
      setStatus('建议先使用单路模式');
    } finally {
      button.disabled = false;
    }
  }

  async function requestWakeLock() {
    if (!('wakeLock' in navigator)) return;
    try {
      state.wakeLock = await navigator.wakeLock.request('screen');
    } catch (_) {
      state.wakeLock = null;
    }
  }

  async function releaseWakeLock() {
    if (!state.wakeLock) return;
    try { await state.wakeLock.release(); } catch (_) { /* no-op */ }
    state.wakeLock = null;
  }

  function applyPlayerRate() {
    const video = document.querySelector('video');
    if (!video) return false;
    const rate = settings.playerRate;
    if (video.playbackRate !== rate) video.playbackRate = rate;
    video.defaultPlaybackRate = rate;
    return true;
  }

  function installStyles() {
    if (document.getElementById('ucp-style')) return;
    const style = document.createElement('style');
    style.id = 'ucp-style';
    style.textContent = `
      :root { --uc-red:#b4233b; --uc-red-hover:#961b30; --uc-ink:#18181b; --uc-muted:#71717a; --uc-line:#e4e4e7; --uc-soft:#f4f4f5; --uc-ok:#087f5b; --uc-warn:#9a6700; --uc-danger:#b42318; }
      #ucp-panel, #ucp-panel * { box-sizing:border-box; }
      #ucp-panel { position:fixed; z-index:2147483645; top:88px; right:24px; width:360px; color:var(--uc-ink); font:14px/1.5 -apple-system,BlinkMacSystemFont,"Segoe UI","PingFang SC","Microsoft YaHei",sans-serif; filter:drop-shadow(0 18px 42px rgba(24,24,27,.18)); }
      #ucp-card { overflow:hidden; background:rgba(255,255,255,.98); border:1px solid rgba(24,24,27,.12); border-radius:18px; }
      #ucp-header { display:flex; align-items:center; gap:12px; min-height:60px; padding:12px 14px 12px 16px; border-bottom:1px solid var(--uc-line); cursor:move; user-select:none; }
      .ucp-mark { display:grid; place-items:center; width:34px; height:34px; flex:0 0 auto; border-radius:11px; color:#fff; background:var(--uc-red); font-weight:750; letter-spacing:-1px; }
      .ucp-heading { min-width:0; flex:1; }
      .ucp-title { font-size:15px; font-weight:720; letter-spacing:-.2px; }
      .ucp-subtitle { display:flex; align-items:center; gap:7px; margin-top:1px; color:var(--uc-muted); font-size:12px; }
      .ucp-dot { width:7px; height:7px; border-radius:50%; background:#a1a1aa; box-shadow:0 0 0 3px #f4f4f5; }
      #ucp-panel[data-phase="run"] .ucp-dot, #ucp-panel[data-phase="scan"] .ucp-dot, #ucp-panel[data-phase="prepare"] .ucp-dot, #ucp-panel[data-phase="test"] .ucp-dot { background:var(--uc-red); box-shadow:0 0 0 3px #fce7eb; }
      #ucp-panel[data-phase="done"] .ucp-dot { background:var(--uc-ok); box-shadow:0 0 0 3px #dff7ed; }
      #ucp-panel[data-phase="error"] .ucp-dot { background:var(--uc-danger); box-shadow:0 0 0 3px #fee4e2; }
      .ucp-icon-button { display:grid; place-items:center; width:44px; height:44px; border:0; border-radius:12px; background:transparent; color:#52525b; cursor:pointer; font-size:20px; }
      .ucp-icon-button:hover { background:var(--uc-soft); }
      #ucp-body { max-height:calc(100dvh - 176px); padding:16px; overflow-y:auto; overscroll-behavior:contain; scrollbar-width:thin; }
      .ucp-callout { padding:14px; border:1px solid var(--uc-line); border-radius:14px; background:#fafafa; }
      #ucp-phase { font-size:15px; font-weight:680; line-height:1.35; }
      #ucp-status { min-height:20px; margin-top:5px; color:var(--uc-muted); font-size:12px; }
      .ucp-progress { height:6px; margin-top:12px; overflow:hidden; border-radius:999px; background:#e8e8eb; }
      #ucp-progress-bar { width:0%; height:100%; border-radius:inherit; background:var(--uc-red); transition:width 180ms ease-out; }
      .ucp-stats { display:grid; grid-template-columns:repeat(3,1fr); gap:8px; margin:12px 0; }
      .ucp-stat { min-width:0; padding:10px 8px; border-radius:12px; background:var(--uc-soft); text-align:center; }
      .ucp-stat strong { display:block; font-variant-numeric:tabular-nums; font-size:18px; line-height:1.15; }
      .ucp-stat span { display:block; margin-top:3px; color:var(--uc-muted); font-size:11px; }
      .ucp-live { margin:0 0 12px; padding:12px; border:1px solid var(--uc-line); border-radius:14px; background:#fff; }
      .ucp-live-head { display:flex; align-items:center; justify-content:space-between; gap:10px; }
      .ucp-live-head strong { font-size:13px; font-weight:700; }
      .ucp-live-badge { flex:0 0 auto; padding:3px 7px; border-radius:999px; background:#edf8f3; color:var(--uc-ok); font-size:10px; font-weight:700; }
      .ucp-topic-summary { display:flex; align-items:center; gap:8px; margin-top:9px; padding:8px 9px; border-radius:10px; background:var(--uc-soft); }
      .ucp-topic-summary span { flex:0 0 auto; color:var(--uc-muted); font-size:10px; }
      .ucp-topic-summary strong { min-width:0; flex:1; overflow:hidden; font-size:11px; font-variant-numeric:tabular-nums; text-align:right; text-overflow:ellipsis; white-space:nowrap; }
      .ucp-topic-summary em { flex:0 0 auto; color:var(--uc-warn); font-size:9px; font-style:normal; }
      #ucp-live-course { margin-top:9px; overflow:hidden; color:#27272a; font-size:12px; font-weight:650; text-overflow:ellipsis; white-space:nowrap; }
      #ucp-live-chapter { margin-top:2px; overflow:hidden; color:var(--uc-muted); font-size:11px; text-overflow:ellipsis; white-space:nowrap; }
      .ucp-live-track { height:5px; margin-top:9px; overflow:hidden; border-radius:999px; background:#ececef; }
      #ucp-live-bar { width:0%; height:100%; border-radius:inherit; background:var(--uc-ok); transition:width 180ms ease-out; }
      .ucp-live-grid { display:grid; grid-template-columns:1fr 1fr; gap:7px 12px; margin-top:10px; }
      .ucp-live-item { min-width:0; }
      .ucp-live-item span { display:block; color:var(--uc-muted); font-size:10px; }
      .ucp-live-item strong { display:block; margin-top:1px; overflow:hidden; font-size:12px; font-variant-numeric:tabular-nums; text-overflow:ellipsis; white-space:nowrap; }
      .ucp-live-foot { margin-top:9px; padding-top:8px; border-top:1px solid #f0f0f2; color:var(--uc-muted); font-size:10px; }
      .ucp-primary, .ucp-secondary, .ucp-danger { width:100%; min-height:48px; border-radius:13px; font:inherit; font-weight:680; cursor:pointer; transition:background 160ms ease-out, transform 120ms ease-out, opacity 160ms ease-out; }
      .ucp-primary { border:1px solid var(--uc-red); background:var(--uc-red); color:#fff; }
      .ucp-primary:hover { background:var(--uc-red-hover); }
      .ucp-primary:active, .ucp-secondary:active, .ucp-danger:active { transform:scale(.985); }
      .ucp-secondary { border:1px solid var(--uc-line); background:#fff; color:var(--uc-ink); }
      .ucp-secondary:hover { background:var(--uc-soft); }
      .ucp-danger { display:none; border:1px solid #f5c2c7; background:#fff5f5; color:var(--uc-danger); }
      #ucp-panel[data-running="true"] .ucp-primary { display:none; }
      #ucp-panel[data-running="true"] .ucp-danger { display:block; }
      button:disabled { cursor:not-allowed!important; opacity:.46; }
      #ucp-advanced { margin-top:12px; border-top:1px solid var(--uc-line); }
      #ucp-advanced summary { display:flex; align-items:center; min-height:46px; color:#3f3f46; cursor:pointer; font-weight:620; list-style:none; }
      #ucp-advanced summary::-webkit-details-marker { display:none; }
      #ucp-advanced summary::after { content:'+'; margin-left:auto; color:var(--uc-muted); font-size:20px; font-weight:400; }
      #ucp-advanced[open] summary::after { content:'−'; }
      .ucp-grid { display:grid; grid-template-columns:1fr 1fr; gap:12px; padding:2px 0 14px; }
      .ucp-field { display:flex; flex-direction:column; gap:6px; color:#52525b; font-size:12px; }
      .ucp-field input[type="number"] { width:100%; height:44px; padding:0 11px; border:1px solid #d4d4d8; border-radius:10px; background:#fff; color:var(--uc-ink); font:inherit; font-size:14px; }
      .ucp-check { display:flex; align-items:center; gap:9px; min-height:44px; cursor:pointer; color:#3f3f46; font-size:13px; }
      .ucp-check input { width:18px; height:18px; accent-color:var(--uc-red); }
      .ucp-actions { display:grid; grid-template-columns:1fr 1fr; gap:8px; margin-top:8px; }
      .ucp-actions button { min-height:44px; }
      .ucp-note { margin:10px 0 0; color:var(--uc-muted); font-size:11px; line-height:1.55; }
      #ucp-launcher { display:none; position:fixed; z-index:2147483645; top:120px; right:18px; min-width:112px; height:46px; padding:0 15px; border:1px solid rgba(180,35,59,.2); border-radius:14px; background:#fff; color:var(--uc-red); box-shadow:0 12px 30px rgba(24,24,27,.16); cursor:pointer; font:650 13px -apple-system,BlinkMacSystemFont,"Segoe UI","PingFang SC",sans-serif; }
      #ucp-panel.ucp-collapsed { display:none; }
      #ucp-panel.ucp-collapsed + #ucp-launcher { display:block; }
      #ucp-panel :focus-visible, #ucp-launcher:focus-visible { outline:3px solid rgba(180,35,59,.28); outline-offset:2px; }
      @media (max-width:600px) { #ucp-panel { top:auto!important; right:10px!important; bottom:10px; left:10px!important; width:auto; } #ucp-body { max-height:68dvh; overflow:auto; } #ucp-launcher { top:auto; right:10px; bottom:12px; } }
      @media (prefers-reduced-motion:reduce) { #ucp-panel *, #ucp-launcher { scroll-behavior:auto!important; transition:none!important; animation:none!important; } }
    `;
    document.head.appendChild(style);
  }

  function renderPanel() {
    if (panel || (!themeIdFromUrl() && !courseIdFromUrl())) return;
    installStyles();
    panel = document.createElement('section');
    panel.id = 'ucp-panel';
    panel.dataset.phase = 'idle';
    panel.dataset.running = 'false';
    panel.setAttribute('aria-label', '联通党校-刷课助手');
    panel.innerHTML = `
      <div id="ucp-card">
        <header id="ucp-header">
          <div class="ucp-mark" aria-hidden="true">联</div>
          <div class="ucp-heading">
            <div class="ucp-title">联通党校-刷课助手</div>
            <div class="ucp-subtitle"><span class="ucp-dot" aria-hidden="true"></span><span>专属版 ${VERSION}</span></div>
          </div>
          <button class="ucp-icon-button" data-action="collapse" aria-label="收起助手" title="收起">×</button>
        </header>
        <div id="ucp-body">
          <div class="ucp-callout" aria-live="polite">
            <div id="ucp-phase">准备就绪</div>
            <div id="ucp-status">一键读取并完成当前专题的未完成课程</div>
            <div class="ucp-progress"><div id="ucp-progress-bar"></div></div>
          </div>
          <div class="ucp-stats">
            <div class="ucp-stat"><strong id="ucp-total">0</strong><span>专题课程</span></div>
            <div class="ucp-stat"><strong id="ucp-pending">0</strong><span>未完成</span></div>
            <div class="ucp-stat"><strong id="ucp-done">0/0</strong><span>章节进度</span></div>
          </div>
          <section class="ucp-live" aria-label="平台实时进度" aria-live="polite">
            <div class="ucp-live-head"><strong>平台实时进度</strong><span class="ucp-live-badge" id="ucp-live-state">等待开始</span></div>
            <div class="ucp-topic-summary"><span>专题官方汇总</span><strong id="ucp-theme-summary">正在读取页面数据</strong><em>非实时</em></div>
            <div id="ucp-live-course">尚未处理课程</div>
            <div id="ucp-live-chapter">点击一键按钮后显示当前章节</div>
            <div class="ucp-live-track"><div id="ucp-live-bar"></div></div>
            <div class="ucp-live-grid">
              <div class="ucp-live-item"><span>平台进度</span><strong id="ucp-live-percent">--</strong></div>
              <div class="ucp-live-item"><span>已学时长</span><strong id="ucp-live-time">--</strong></div>
              <div class="ucp-live-item"><span>轮次 / 批次</span><strong id="ucp-live-round">--</strong></div>
              <div class="ucp-live-item"><span>提交成功 / 失败</span><strong id="ucp-live-submit">0 / 0</strong></div>
              <div class="ucp-live-item"><span>服务端回读</span><strong id="ucp-live-readback">0 / 0</strong></div>
              <div class="ucp-live-item"><span>下轮等待</span><strong id="ucp-live-countdown">--</strong></div>
            </div>
            <div class="ucp-live-foot" id="ucp-live-updated">尚无平台记账回执</div>
          </section>
          <button class="ucp-primary" data-action="start">一键刷完整个专题</button>
          <button class="ucp-danger" data-action="stop">停止并保留进度</button>
          <details id="ucp-advanced">
            <summary>高级设置</summary>
            <div class="ucp-grid">
              <label class="ucp-field">并发路数（不限上限）<input id="ucp-concurrency" type="number" min="1" step="1"></label>
              <label class="ucp-field">单次学习秒数<input id="ucp-chunk" type="number" min="30" max="179" step="1"></label>
              <label class="ucp-field">轮次间隔秒<input id="ucp-delay" type="number" min="30" max="120" step="1"></label>
              <label class="ucp-field">批次间隔秒<input id="ucp-gap" type="number" min="0.5" max="10" step="0.5"></label>
              <label class="ucp-field">失败重试次数<input id="ucp-retries" type="number" min="0" max="8" step="1"></label>
              <label class="ucp-field">详情页倍速<input id="ucp-rate" type="number" min="1" max="6" step="0.25"></label>
            </div>
            <label class="ucp-check"><input id="ucp-resume" type="checkbox">刷新页面后自动续跑</label>
            <label class="ucp-check"><input id="ucp-skip" type="checkbox">自动跳过已完成课程</label>
            <div class="ucp-actions">
              <button class="ucp-secondary" data-action="probe">检测当前并发</button>
              <button class="ucp-secondary" data-action="fresh">重新扫描专题</button>
            </div>
            <p class="ucp-note">默认设置：并发 10 路、单次 150 秒、轮次间隔 32 秒。并发不设硬上限，实际不会超过剩余章节数；高并发可能触发平台限流，连续失败后脚本会自动暂停。</p>
          </details>
        </div>
      </div>`;
    const launcher = document.createElement('button');
    launcher.id = 'ucp-launcher';
    launcher.textContent = '刷课助手';
    launcher.setAttribute('aria-label', '展开联通党校-刷课助手');
    document.body.append(panel, launcher);
    licenseGate.attachPanel(panel, launcher);
    hydrateSettingsUI();
    bindUI(launcher);
    restorePosition();
    installDrag();
    renderStats();
    renderLive();
    readThemeSummaryFromPage();

    if (courseIdFromUrl()) {
      setPhase('player', `详情页倍速 ${settings.playerRate}×`);
      setStatus('播放器出现后会自动应用倍速');
      setInterval(applyPlayerRate, 1200);
      panel.querySelector('[data-action="start"]').textContent = '应用详情页倍速';
    } else {
      const saved = GM_getValue(KEYS.resume, null);
      const hasResume = saved
        && String(saved.themeId) === String(themeIdFromUrl())
        && Array.isArray(saved.tasks)
        && (saved.verificationPending === true || saved.tasks.some((task) => !task.done));
      if (hasResume) {
        state.totalCourses = saved.totalCourses || 0;
        state.pendingCourses = saved.pendingCourses || 0;
        state.totalTasks = saved.tasks.length;
        state.doneTasks = saved.tasks.filter((task) => task.done).length;
        if (saved.live && typeof saved.live === 'object') Object.assign(state, saved.live);
        renderStats();
        renderLive();
      }
      if (settings.autoResume && hasResume && saved.paused !== true) {
        setTimeout(() => startRun(false), 800);
      } else if (hasResume) {
        const remaining = saved.tasks.filter((task) => !task.done).length;
        setPhase('paused', `已暂停，${remaining} 个章节待处理`);
        setStatus('点击主按钮继续上次进度');
        setProgress(state.totalTasks ? state.doneTasks / state.totalTasks * 100 : 0);
      } else {
        previewTheme();
      }
    }
  }

  async function previewTheme() {
    const id = themeIdFromUrl();
    if (!id || state.running) return;
    try {
      setPhase('scan', '正在读取专题概况');
      const first = await request(API.list, listParams(id, 1), 1);
      const page = first.entity && first.entity.page ? first.entity.page : {};
      state.totalCourses = Number(page.totalResultSize || page.total || 0);
      setPhase('idle', '准备就绪');
      setStatus(`当前专题共 ${state.totalCourses} 门课程`);
      renderStats();
    } catch (error) {
      setPhase('error', error.message);
      setStatus('请确认登录状态后刷新页面');
    }
  }

  function hydrateSettingsUI() {
    panel.querySelector('#ucp-concurrency').value = settings.concurrency;
    panel.querySelector('#ucp-chunk').value = settings.chunkSeconds;
    panel.querySelector('#ucp-delay').value = settings.roundDelay;
    panel.querySelector('#ucp-gap').value = settings.batchGap;
    panel.querySelector('#ucp-retries').value = settings.retries;
    panel.querySelector('#ucp-rate').value = settings.playerRate;
    panel.querySelector('#ucp-resume').checked = settings.autoResume;
    panel.querySelector('#ucp-skip').checked = settings.skipFinished;
  }

  function readSettingsFromUI() {
    settings = normalizeSettings({
      concurrency: panel.querySelector('#ucp-concurrency').value,
      chunkSeconds: panel.querySelector('#ucp-chunk').value,
      roundDelay: panel.querySelector('#ucp-delay').value,
      batchGap: panel.querySelector('#ucp-gap').value,
      retries: panel.querySelector('#ucp-retries').value,
      playerRate: panel.querySelector('#ucp-rate').value,
      autoResume: panel.querySelector('#ucp-resume').checked,
      skipFinished: panel.querySelector('#ucp-skip').checked,
    });
    GM_setValue(KEYS.settings, settings);
    hydrateSettingsUI();
    applyPlayerRate();
  }

  function bindUI(launcher) {
    panel.addEventListener('click', (event) => {
      const button = event.target.closest('[data-action]');
      if (!button) return;
      const action = button.dataset.action;
      if (action === 'collapse') panel.classList.add('ucp-collapsed');
      if (action === 'start') courseIdFromUrl() ? (readSettingsFromUI(), applyPlayerRate()) : startRun(false);
      if (action === 'stop') stopRun();
      if (action === 'probe') concurrencyProbe();
      if (action === 'fresh') startRun(true);
    });
    panel.addEventListener('change', (event) => {
      if (event.target.matches('input')) readSettingsFromUI();
    });
    launcher.addEventListener('click', () => panel.classList.remove('ucp-collapsed'));
  }

  function setPhase(phase, text) {
    if (!panel) return;
    state.phase = phase;
    panel.dataset.phase = phase;
    panel.querySelector('#ucp-phase').textContent = text;
  }

  function setStatus(text) {
    if (panel) panel.querySelector('#ucp-status').textContent = text;
  }

  function setProgress(value) {
    if (panel) panel.querySelector('#ucp-progress-bar').style.width = `${clamp(value, 0, 100, 0)}%`;
  }

  function renderStats() {
    if (!panel) return;
    panel.querySelector('#ucp-total').textContent = state.totalCourses || 0;
    panel.querySelector('#ucp-pending').textContent = state.pendingCourses || 0;
    panel.querySelector('#ucp-done').textContent = `${state.doneTasks || 0}/${state.totalTasks || 0}`;
  }

  function formatDuration(seconds) {
    const value = Math.max(0, Math.round(Number(seconds) || 0));
    const hours = Math.floor(value / 3600);
    const minutes = Math.floor((value % 3600) / 60);
    const rest = value % 60;
    return hours > 0
      ? `${hours}:${String(minutes).padStart(2, '0')}:${String(rest).padStart(2, '0')}`
      : `${minutes}:${String(rest).padStart(2, '0')}`;
  }

  function renderLive() {
    if (!panel) return;
    const computed = state.totalSeconds > 0 ? state.currentSeconds / state.totalSeconds * 100 : null;
    const percent = Number.isFinite(state.serverProgress) ? state.serverProgress : computed;
    panel.querySelector('#ucp-live-course').textContent = state.currentCourse || '尚未处理课程';
    panel.querySelector('#ucp-theme-summary').textContent = Number.isFinite(state.themeTotalHours)
      && Number.isFinite(state.themeLearnedHours)
      && Number.isFinite(state.themePercent)
      ? `${state.themeLearnedHours} / ${state.themeTotalHours} 学时 · ${state.themePercent.toFixed(2)}%`
      : '正在读取页面数据';
    panel.querySelector('#ucp-live-chapter').textContent = state.currentChapter || '点击一键按钮后显示当前章节';
    panel.querySelector('#ucp-live-percent').textContent = Number.isFinite(percent) ? `${clamp(percent, 0, 100, 0).toFixed(1)}%` : '--';
    panel.querySelector('#ucp-live-time').textContent = state.totalSeconds > 0
      ? `${formatDuration(state.currentSeconds)} / ${formatDuration(state.totalSeconds)}`
      : '--';
    panel.querySelector('#ucp-live-round').textContent = state.round
      ? `第 ${state.round} 轮 · ${state.batch || 0}/${state.totalBatches || 0} 批`
      : '--';
    panel.querySelector('#ucp-live-submit').textContent = `${state.submitted || 0} / ${state.submitFailed || 0}`;
    panel.querySelector('#ucp-live-readback').textContent = `${state.readbackConfirmed || 0} / ${state.readbackTotal || 0}`;
    panel.querySelector('#ucp-live-countdown').textContent = Number.isFinite(state.nextRoundIn) ? `${state.nextRoundIn} 秒` : '--';
    panel.querySelector('#ucp-live-bar').style.width = `${Number.isFinite(percent) ? clamp(percent, 0, 100, 0) : 0}%`;
    const badge = panel.querySelector('#ucp-live-state');
    badge.textContent = state.running
      ? (state.nextRoundIn ? '等待下轮' : '实时记账')
      : (state.lastAckAt ? '已保存' : '等待开始');
    panel.querySelector('#ucp-live-updated').textContent = state.lastAckAt
      ? `最后记账 ${new Date(state.lastAckAt).toLocaleTimeString('zh-CN', { hour12: false })}`
      : '尚无平台记账回执';
  }

  function updateControls() {
    if (!panel) return;
    panel.dataset.running = state.running ? 'true' : 'false';
    panel.querySelectorAll('#ucp-advanced input, #ucp-advanced button').forEach((control) => {
      control.disabled = state.running;
    });
    panel.querySelector('[data-action="stop"]').disabled = state.stopping;
  }

  function installDrag() {
    const header = panel.querySelector('#ucp-header');
    let start = null;
    header.addEventListener('pointerdown', (event) => {
      if (event.target.closest('button') || matchMedia('(max-width:600px)').matches) return;
      const rect = panel.getBoundingClientRect();
      start = { x: event.clientX, y: event.clientY, left: rect.left, top: rect.top };
      header.setPointerCapture(event.pointerId);
    });
    header.addEventListener('pointermove', (event) => {
      if (!start) return;
      panel.style.left = `${clamp(start.left + event.clientX - start.x, 8, innerWidth - panel.offsetWidth - 8, 8)}px`;
      panel.style.top = `${clamp(start.top + event.clientY - start.y, 8, innerHeight - 80, 8)}px`;
      panel.style.right = 'auto';
    });
    header.addEventListener('pointerup', () => {
      if (!start) return;
      GM_setValue(KEYS.position, { left: panel.style.left, top: panel.style.top });
      start = null;
    });
  }

  function restorePosition() {
    const saved = GM_getValue(KEYS.position, null);
    if (!saved || matchMedia('(max-width:600px)').matches) return;
    panel.style.left = saved.left;
    panel.style.top = saved.top;
    panel.style.right = 'auto';
  }

  function handleRoute() {
    const route = location.href;
    if (route === lastRoute) return;
    lastRoute = route;
    if (panel) {
      panel.nextElementSibling && panel.nextElementSibling.id === 'ucp-launcher' && panel.nextElementSibling.remove();
      panel.remove();
      panel = null;
    }
    renderPanel();
  }

  handleRoute();
  setInterval(handleRoute, 1000);
  setInterval(readThemeSummaryFromPage, 5000);
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible' && state.running) requestWakeLock();
  });
})();
});
})();
