const rules = [
 { type:'email', severity:'Medium', weight:20, regex:/\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi, advice:'Replace personal email addresses with placeholders when the exact address is unnecessary.' },
 { type:'phone', severity:'Medium', weight:15, regex:/(?:\+?\d[\d\s().-]{7,}\d)/g, advice:'Remove or mask phone numbers unless they are essential.' },
 { type:'apiKey', severity:'High', weight:35, regex:/\b(?:sk-[A-Za-z0-9_-]{16,}|(?:api[_-]?key|token)\s*[:=]\s*["']?[A-Za-z0-9_-]{12,})\b/gi, advice:'Rotate exposed credentials and store secrets in environment variables.' },
 { type:'passwordLike', severity:'High', weight:30, regex:/\b(?:password|passwd|pwd)\s*[:=]\s*\S+/gi, advice:'Remove password values. Change a real password if it was exposed.' }
];
function mask(type, value) {
 if(type==='email'){const [name,domain]=value.split('@');return `${name.slice(0,1)}***@${domain||'***'}`;}
 if(type==='phone') return `${value.slice(0,2)}***${value.slice(-2)}`;
 if(type==='apiKey') return `${value.slice(0,3)}***[REDACTED]`;
 if(type==='passwordLike') return `${value.split(/[:=]/)[0]}= ***[REDACTED]`;
 return '***[REDACTED]';
}
export function scanText(text) {
 const findings=[], categoryCounts={email:0,phone:0,apiKey:0,passwordLike:0}; let score=0;
 for(const rule of rules){rule.regex.lastIndex=0; for(const match of text.matchAll(rule.regex)){
  findings.push({type:rule.type,severity:rule.severity,maskedValue:mask(rule.type,match[0]),recommendation:rule.advice});
  categoryCounts[rule.type]++; score+=rule.weight;
 }}
 const riskScore=Math.min(100,score), riskLevel=riskScore>=60?'High':riskScore>=25?'Medium':'Low';
 const recommendations=[...new Set(findings.map(f=>f.recommendation))];
 if(!findings.length) recommendations.push('No supported patterns detected. This does not guarantee the text is free of sensitive information.');
 return {riskScore,riskLevel,totalFindings:findings.length,categoryCounts,findings,recommendations};
}
