import React, { useState, useEffect } from 'react';
import './Post.css';
import Avatar from '@material-ui/core/Avatar';
import { db } from './firebase';
import firebase from 'firebase';
import { BsHeart, BsChat, BsBookmark } from "react-icons/bs";
import { FaRegPaperPlane } from "react-icons/fa";

function Post({ postId, user, username, caption, imageUrl, location, time }) {
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState('');

  useEffect(() => {
    let unsubscribe;
    if (postId) {
      unsubscribe = db.collection("posts")
        .doc(postId)
        .collection('comments')
        .orderBy('timestamp', 'desc')
        .onSnapshot((snapshot) => {
          setComments(snapshot.docs.map((doc) => doc.data()));
      });

    }

    return () => {
      unsubscribe();
    };
  }, [postId]);

  const postComment = (event) => {
    event.preventDefault();

    db.collection("posts").doc(postId).collection("comments").add({
      text: comment,
      username: user.displayName,
      timestamp: firebase.firestore.FieldValue.serverTimestamp()
    });
    setComment('');
  }

  return (
    <div className='post'>
      <div className='post__header'>
        <Avatar
          style={{
            width: '27px',
            height: '27px',
            marginLeft: '5px'
          }}
          className='post__avatar'
          alt={username}
          src="/static/images/avatart/a.jpg"
          />
        <div className='post__header_container'>
          <h3 className='post__header_username'>{username}</h3>
          <p className='post__header_location'>{location}</p>
        </div>
      </div>
      
      {/* header -> avator + username */}

      <img className='post__image' src={imageUrl} alt="" />
      <div className='post__iconContainer'>
        <div className='post__iconsRight'>
          <BsHeart className='header__icon' />
          <BsChat className='header__icon' />
          <FaRegPaperPlane className='header__icon' />
        </div>
         <BsBookmark className='header__icon' />
      </div>
      <h4 className='post__text'><b className='comment__username'>{username}</b> {caption}</h4>
    
      <div className='post__comments'>
        {comments.map((comment) => (
          <div className='comment__container'>
            <p className='comment'>
              <b className='comment__username'>{comment.username}</b> {comment.text}
            </p> 
            <BsHeart className='like__icon' />
          </div>
        ))}
      </div>

      {time}

      
      <form className='post__commentBox'>
        <input
          className='post__input'
          type="text"
          placeholder="Add a comment..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          />
        <button className='post__button' disabled={!comment} type="submit" onClick={postComment}>
          Post
        </button>
      </form>
    </div>
  )
}

export default Post
