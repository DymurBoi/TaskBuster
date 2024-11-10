import { Routes, Route } from "react-router-dom";
import Links from './routes/Links.jsx'
import Post from './routes/Post.jsx'
import Read from './routes/Read.jsx'
import Put from './routes/Put.jsx'
import Delete from './routes/Delete.jsx'
import ReadTag from './routes/ReadTag.jsx'
import PostTag from './routes/PostTag.jsx'
import PutTag from './routes/PutTag.jsx'
import DeleteTag from './routes/DeleteTag.jsx'
export default function Router(){
    return(
        <Routes>
            <Route path='/' element={<Links/>}>
            <Route path='post' element={<Post/>}></Route>
            <Route path='read' element={<Read/>}></Route>
            <Route path='put' element={<Put/>}></Route>
            <Route path='delete' element={<Delete/>}></Route>
            <Route path='readTag' element={<ReadTag/>}></Route>
            <Route path='postTag' element={<PostTag/>}></Route>
            <Route path='putTag' element={<PutTag/>}></Route>
            <Route path='deleteTag' element={<DeleteTag/>}></Route>
            </Route>
        </Routes>
    )
}