// Re-created on every navigation inside the main site, so each page eases in (CSS animation, works before JS loads).
export default function Template({ children }) {
    return <div className="page-in">{children}</div>;
}
