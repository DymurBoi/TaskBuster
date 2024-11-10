import { Link, Outlet } from "react-router-dom";

export default function Lyrics(){
    return(
        <>
        <h1>CRUD Thingy</h1>
        <h2>
        <Link to="/post"><button>Create Task</button></Link>
        <Link to="/read"><button>Read Task</button></Link>
        <Link to="/put"><button>Update Task</button></Link>
        <Link to="/delete"><button>Delete Task</button></Link>
        </h2> 
        <h2>
        <Link to="/readTag"><button>Read Tag</button></Link>
        <Link to="/postTag"><button>Post Tag</button></Link>
        <Link to="/putTag"><button>Put Tag</button></Link>
        <Link to="/deleteTag"><button>Delete Tag</button></Link>   
        </h2>
        <Outlet/> 
        </>
    )
}