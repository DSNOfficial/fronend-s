import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useHistory, useParams } from 'react-router-dom';

const MultiImagePage = ({ mode }) => {
  const { id } = useParams();
  const history = useHistory();
  const [postId, setPostId] = useState('');
  const [title, setTitle] = useState('');
  const [status, setStatus] = useState('');
  const [images, setImages] = useState([]);

  useEffect(() => {
    if (mode !== 'create' && id) {
      axios.get(`/api/multi_images/${id}`)
        .then(response => {
          const entry = response.data.list[0];
          setPostId(entry.postId);
          setTitle(entry.title);
          setStatus(entry.status);
        })
        .catch(error => {
          console.error('There was an error fetching the entry!', error);
        });
    }
  }, [mode, id]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (mode === 'create') {
      const formData = new FormData();
      formData.append('postId', postId);
      formData.append('title', title);
      formData.append('status', status);
      for (let i = 0; i < images.length; i++) {
        formData.append('images', images[i]);
      }

      try {
        const response = await axios.post('/api/multi_images/create', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        console.log(response.data);
        history.push('/');
      } catch (error) {
        console.error('There was an error creating the entry!', error);
      }
    } else if (mode === 'update') {
      try {
        const response = await axios.post('/api/multi_images/update', {
          id,
          postId,
          title,
          status
        });
        console.log(response.data);
        history.push('/');
      } catch (error) {
        console.error('There was an error updating the entry!', error);
      }
    } else if (mode === 'delete') {
      try {
        const response = await axios.post('/api/multi_images/delete', { postId });
        console.log(response.data);
        history.push('/');
      } catch (error) {
        console.error('There was an error deleting the entry!', error);
      }
    }
  };

  return (
    <div>
      <h1>{mode.charAt(0).toUpperCase() + mode.slice(1)} Entry</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Post ID:
          <input type="text" value={postId} onChange={(e) => setPostId(e.target.value)} required disabled={mode === 'delete'} />
        </label>
        <label>
          Title:
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required disabled={mode === 'delete'} />
        </label>
        <label>
          Status:
          <input type="text" value={status} onChange={(e) => setStatus(e.target.value)} required disabled={mode === 'delete'} />
        </label>
        {mode === 'create' && (
          <label>
            Images:
            <input type="file" onChange={(e) => setImages(e.target.files)} multiple required />
          </label>
        )}
        <button type="submit">{mode.charAt(0).toUpperCase() + mode.slice(1)}</button>
      </form>
    </div>
  );
}

export default MultiImagePage;
