import { useEffect, useState, useRef } from "react";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const QuillEditorPage = () => {
    const[content,setContent] =useState('');

    const handleContentChange = (value) =>{

        setContent(value);
    }


    return (
        <>

            <ReactQuill

                modules={{
                    toolbar: [
                        [{ 'header': '1' }, { 'header': '2' }, { 'font': [] }],
                        [{ size: [] }],
                        ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                        [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
                        ['link'],
                        ['clean']
                    ]
                }}

                value={content}
                onChange={handleContentChange}
                theme="snow"
                placeholder="សរសេរអត្ថបទ"
            />

        </>
    )
}

export default QuillEditorPage
