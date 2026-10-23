import{useEffect,useState}from'react';import{NavLink,Routes,Route,Link}from'react-router-dom';import{ShieldCheck,LayoutDashboard,ScanSearch,History,ArrowUpRight,Trash2,AlertTriangle,LockKeyhole,Activity}from'lucide-react';import{scanText,getHistory,deleteScan}from'./api.js';
function Shell({children}){return <div className="shell"><aside className="side"><div className="brand"><ShieldCheck/> Privacy<span>Guard</span></div><small className="navlabel">WORKSPACE</small><NavLink to="/" end><LayoutDashboard size={17}/> Dashboard</NavLink><NavLink to="/scan"><ScanSearch size={17}/> New scan</NavLink><NavLink to="/history"><History size={17}/> Scan history</NavLink><div className="privacy"><ShieldCheck size={18}/><b>Privacy first</b><p>Original text is not saved in scan history.</p></div><small className="footnote">PRIVACYGUARD · MVP 1.0</small></aside><main><header>Security workspace <span>● Rule-based scanner</span></header><div className="content">{children}</div><footer>Educational privacy scanner · Detection is limited to supported patterns.</footer></main></div>}
function Badge({score,level}){return <span className={`badge ${level?.toLowerCase()}`}>{level} risk · {score}/100</span>}
function Dashboard() {
  const [h, setH] = useState([]);
  const [enabled, setEnabled] = useState(true);
  const [err, setErr] = useState('');

  useEffect(() => {
    getHistory()
      .then(d => {
        setH(d.scans || []);
        setEnabled(d.historyEnabled !== false);
      })
      .catch(e => setErr(e.message));
  }, []);

  return (
    <>
      <section className="hero">
        <div>
          <small className="eyebrow">PRIVACY RISK OVERVIEW</small>
          <h1>Know what your text<br /><em>might be revealing.</em></h1>
          <p>Check for selected sensitive data patterns before sharing text online.</p>
          <Link className="btn" to="/scan">
            <ScanSearch size={17} /> Scan text <ArrowUpRight size={16} />
          </Link>
        </div>
        <div className="heroicon">
          <ShieldCheck size={78} />
          <span>Pattern detection</span>
        </div>
      </section>

      <h2>Workspace overview</h2>
      <p className="muted">Your recent scanning activity at a glance.</p>

      {err && <p className="notice">{err}</p>}
      {!enabled && (
        <p className="notice">
          MongoDB is not configured; history will not persist.
        </p>
      )}

      <div className="stats">
        <article>
          <Activity />
          <small>Saved scans</small>
          <strong>{h.length}</strong>
        </article>
        <article>
          <AlertTriangle />
          <small>High-risk scans</small>
          <strong>{h.filter(x => x.riskLevel === 'High').length}</strong>
        </article>
        <article>
          <ScanSearch />
          <small>Findings recorded</small>
          <strong>{h.reduce((s, x) => s + x.totalFindings, 0)}</strong>
        </article>
      </div>

      <section className="panel">
        <div className="row">
          <h3>Recent scans</h3>
          <Link to="/history">View history ↗</Link>
        </div>

        {h.length === 0 ? (
          <div className="empty">
            <LockKeyhole size={28} />
            <b>No saved scans yet</b>
            <p>Run your first scan to see summary history here.</p>
            <Link className="btn secondary" to="/scan">Start a scan</Link>
          </div>
        ) : (
          <div className="tablewrap">
            <table>
              <thead>
                <tr><th>Date</th><th>Findings</th><th>Risk</th></tr>
              </thead>
              <tbody>
                {h.slice(0, 5).map(x => (
                  <tr key={x._id}>
                    <td>{new Date(x.createdAt).toLocaleString()}</td>
                    <td>{x.totalFindings}</td>
                    <td><Badge score={x.riskScore} level={x.riskLevel} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <p className="muted tiny">
        A low score does not guarantee that text is safe.
      </p>
    </>
  );
}
function Scanner(){const[text,setText]=useState(''),[result,setResult]=useState(null),[err,setErr]=useState(''),[busy,setBusy]=useState(false);async function submit(e){e.preventDefault();setBusy(true);setErr('');setResult(null);try{setResult(await scanText(text))}catch(x){setErr(x.message)}finally{setBusy(false)}}return <><small className="eyebrow">ANALYZE TEXT</small><h1>Privacy scanner</h1><p className="muted">Use synthetic examples. Original text is processed in memory and not saved in history.</p><div className="grid"><section className="panel"><h3>Text to scan</h3><form onSubmit={submit}><textarea maxLength={10000} required value={text} onChange={e=>setText(e.target.value)} placeholder="Paste text here…&#10;Example: Contact alex@example.com for details."/><div className="row muted tiny"><span>{text.length}/10,000 characters</span><button type="button" className="linkbutton" onClick={()=>setText('Please contact alex@example.com for details.')}>Load safe example</button></div>{err&&<p className="notice">{err}</p>}<div className="actions"><button className="btn" disabled={busy||!text.trim()}>{busy?'Scanning…':'Scan for risks'}</button><button type="button" className="btn secondary" onClick={()=>{setText('');setResult(null);setErr('')}}>Clear</button></div></form><p className="warning"><AlertTriangle size={17}/> Pattern-based detection may miss sensitive data or flag ordinary text incorrectly.</p></section><section className="panel"><h3>Scan results</h3>{!result?<div className="empty"><ScanSearch size={30}/><b>Ready when you are</b><p>Your score and findings appear here.</p></div>:<><div className="score"><strong>{result.riskScore}<small>/100</small></strong><Badge score={result.riskScore} level={result.riskLevel}/><p className="muted tiny">Educational indicator, not a guarantee of safety.</p></div><div className="categories">{Object.entries(result.categoryCounts).map(([k,v])=><div key={k}><span>{k}</span><b>{v}</b></div>)}</div><h4>Detected patterns ({result.totalFindings})</h4>{result.findings.map((f,i)=><div className="finding" key={i}><div><b>{f.type}</b><p>{f.maskedValue}</p></div><span className={`badge ${f.severity.toLowerCase()}`}>
  {f.severity} severity
</span></div>)}<h4>Recommendations</h4><ul className="recommend">{result.recommendations.map((r,i)=><li key={i}>{r}</li>)}</ul><button className="btn secondary" onClick={()=>{setText('');setResult(null)}}>New scan</button></>}</section></div></>}
function HistoryPage(){const[h,setH]=useState([]),[enabled,setEnabled]=useState(true),[err,setErr]=useState('');async function load(){try{const d=await getHistory();setH(d.scans||[]);setEnabled(d.historyEnabled!==false);setErr('')}catch(e){setErr(e.message)}}useEffect(()=>{load()},[]);async function remove(id){if(!confirm('Delete this scan summary?'))return;try{await deleteScan(id);setH(old=>old.filter(x=>x._id!==id))}catch(e){setErr(e.message)}}return <><small className="eyebrow">YOUR ACTIVITY</small><h1>Scan history</h1><p className="muted">Saved summary metadata only; original text is not stored.</p><section className="panel"><div className="row"><h3>Recent scan summaries</h3><button className="btn secondary" onClick={load}>Refresh</button></div>{!enabled&&<p className="notice">MongoDB is not configured; history is disabled.</p>}{err&&<p className="notice">{err}</p>}{!h.length?<div className="empty"><History size={28}/><b>No saved scans</b><p>Configure MongoDB and run a scan to save summary history.</p></div>:<div className="tablewrap"><table><thead><tr><th>Date</th><th>Findings</th><th>Categories</th><th>Risk</th><th>Delete</th></tr></thead><tbody>{h.map(x=><tr key={x._id}><td>{new Date(x.createdAt).toLocaleString()}</td><td>{x.totalFindings}</td><td>{Object.entries(x.categoryCounts||{}).filter(([,v])=>v>0).map(([k,v])=>`${k}: ${v}`).join(', ')||'None'}</td><td><Badge score={x.riskScore} level={x.riskLevel}/></td><td><button className="delete" onClick={()=>remove(x._id)} aria-label="Delete summary"><Trash2 size={15}/></button></td></tr>)}</tbody></table></div>}</section></>}
export default function App(){return <Shell><Routes><Route path="/" element={<Dashboard/>}/><Route path="/scan" element={<Scanner/>}/><Route path="/history" element={<HistoryPage/>}/></Routes></Shell>}
