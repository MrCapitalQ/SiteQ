import { Link } from "react-router-dom";

export function Home() {
    return (
        <>
            <h1>Home Page</h1>
            <Link to="/example">Example</Link>
        </>
    );
}
