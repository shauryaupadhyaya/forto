import {Outlet, Link} from "react-router-dom";
function Layout(){
    return(
        <div style={{display: "flex", height: "100vh" }}>
            <aside
                style={{
                    width: "230px",
                    background: "#0A589C",
                    padding: "20px",
                    color: "white",
                }}
            >
                <h2 style={{marginBottom: "20px"}}>Forto</h2>

                <nav
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "12px",
                    }}
                >
                    <Link to="/" style={{ color: "white"}}>Dashboard</Link>
                    <Link to="/tasks" style={{ color: "white"}}>Tasks</Link>
                    <Link to="/habits" style={{ color: "white"}}>Habits</Link>
                    <Link to="/pomodoro" style={{ color: "white"}}>Pomodoro</Link>
                    <Link to="/calendar" style={{ color: "white"}}>Calendar</Link>
                    <Link to="/analytics" style={{ color: "white"}}>Analytics</Link>
                    <Link to="/settings" style={{ color: "white"}}>Settings</Link>
                </nav>
            </aside>

            <main style={{flex:1, padding:"20px", background:"#f5f7fa"}}>
                <Outlet/>
            </main>
        </div>
    );
}

export default Layout;