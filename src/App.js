import React, { useState, useEffect } from 'react';
import './App.css';
import Post from './Post';
import { db, auth } from './firebase';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import { Button, Input } from '@material-ui/core';
import ImageUpload from './ImageUpload';
import { HiHome } from "react-icons/hi";
import Avatar from '@material-ui/core/Avatar';
import startingImage from './images/instagram.jpg';
import instagramLogo from './images/instagram_logo.jpg';
import profilePic from './images/IMG_5180_Original.jpg';
import { BsBoxArrowRight, BsHeart } from "react-icons/bs";
import { AiFillFacebook } from "react-icons/ai";
import 'react-slideshow-image/dist/styles.css';
import ReactTooltip from "react-tooltip";

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyle = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

function App() {
  const classess = useStyle();
  const [modalStyle] = useState(getModalStyle);
  const [posts, setPosts] = useState([]);
  const [open, setOpen] = useState(false);
  const [openSignIn, setOpenSignIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [user, setUser] = useState(null);
  const [login, setLogin] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        console.log(authUser);
        setUser(authUser);
      } else {
        setUser(null);
      }
    });

    return () => {
      // perform some cleanup actions
      unsubscribe(null);
    }
  }, [user, username]);


  useEffect(() => {
    db.collection('posts').orderBy('timestamp', 'desc').onSnapshot(snapshot => {
      setPosts(snapshot.docs.map(doc => ({
        id: doc.id,
        post: doc.data()
      })));
    });
  }, [posts])

  const signUp = (event) => {
    event.preventDefault();

    auth.createUserWithEmailAndPassword(email, password)
      .then((authUser) => {
        return authUser.user.updateProfile({
          displayName: username
        });
      })
      .catch((error) => alert(error.message));
  };

  const signIn = (event) => {
    event.preventDefault();

    auth
      .signInWithEmailAndPassword(email, password)
      .catch((error) => alert(error.message));

    setOpenSignIn(false);
    setLogin(true);
  };

  const logOut = (event) => {
    event.preventDefault();

    auth.signOut()
    setLogin(false);
  };

  return (
    <div className='app'>
      
      <Modal open={open} onClose={() => setOpen(false)} >
        <div style={modalStyle} className={classess.paper}>
          <form className='app__signup'>
            <center>
              <img
                className='app__headerImage'
                src={instagramLogo}
                alt=""
              />
            </center>
              
            <Input placeholder="username" type="text" value={username} onChange={(e) => setUsername(e.target.value)}>
            </Input>
            <Input placeholder="email" type="text" value={email} onChange={(e) => setEmail(e.target.value)}>
            </Input>
            <Input placeholder="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)}>
            </Input>
            <Button type="submit" onClick={signUp}>Sign Up</Button>
          </form>
        </div>
      </Modal>

      <Modal open={openSignIn} onClose={() => setOpenSignIn(false)} >
        <div style={modalStyle} className={classess.paper}>
          <form className='app__signup'>
            <center>
              <img
                className='app__headerImage'
                src={instagramLogo}
                alt=""
              />
            </center>
            <Input placeholder="email" type="text" value={email} onChange={(e) => setEmail(e.target.value)}>
            </Input>
            <Input placeholder="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)}>
            </Input>
            <Button type="submit" onClick={signIn}>Sign In</Button>
          </form>
        </div>
      </Modal>

      <div className='app__header'>
        <img
          className='app__headerBarImage'
          src={instagramLogo}
          alt=""
        />
        {user && login ? (
          <div className='app__loginedContainer'>
            <Button style={{width: "80%"}}
            >
              <HiHome className='home__icon' />
            </Button>
            <Button data-tip type="submit" onClick={logOut} data-for="logOut"><BsBoxArrowRight className='logOut__icon' /></Button>
            <ReactTooltip id="logOut" place="top">Click to logout</ReactTooltip>
            <Button><BsHeart className='like__icon' /></Button>
            <Avatar
              style={{
                width: '25px',
                height: '25px',
                borderRadius: '50%',
                marginTop: '7px'
              }}
              className='post__avatar'
              alt={username}
              src="/static/images/avatart/a.jpg"
              />
          </div>
        ): (
          <div className='app__loginContainer'>
            <Button onClick={() => setOpenSignIn(true)}>Sign In</Button>
            <Button onClick={() => setOpen(true)}>Sign Up</Button>
          </div>
        )}
      </div>

      {login ? (
        <div>
          <div className='app__posts'>
            <div className='app__postsLeft'>
              {
                posts.map(({id, post}) => (
                  <Post key={id} postId={id} user={user} username={post.username} caption={post.caption} imageUrl={post.imageUrl} location={post.location} />
                ))
              }
            </div>
            <div className='app__postsRight'>
              {user ? (
                <ImageUpload username={user.displayName} />
              ): (
                <h3>Sorry you need to login to upload</h3>
              )}
              <div className='app__postsRight_thingsToDo'>
                <h2 className='app__postsRight_thingsToDo_header'>
                  Things to do
                </h2>
                <p className='app__postsRight_thingsToDo_p'><span role="img" aria-label="check">✔️</span> Design web page currently working on</p>
                <p className='app__postsRight_thingsToDo_p'><span role="img" aria-label="check">✔️</span> Meet w/ Elle for Valentine day</p>
                <p className='app__postsRight_thingsToDo_p'><span role="img" aria-label="check">✔️</span> Pickup a package</p>
                <p className='app__postsRight_thingsToDo_p'><span role="img" aria-label="check">✔️</span> QT before the day</p>
              </div>
              <p className='app__postsRight_info'>
                About . Help . Press . API . Jobs . Privacy . Terms 
              </p>
              <p className='app__postsRight_info'>
                Locations . Top . Accounts . Hashtags . Language . English
              </p>
              <p className='app__postsRight_facebook'>
                © 2021 INSTAGRAM FROM FACEBOOK
              </p>
            </div>
          </div>
        </div>
      ): (
        <div className='start__container'>
          <img className='start__image' src={startingImage} alt="Start"/>
          <div className='start__loginRight'>
            <div className='start__login'>
              <form className='app__signup'>
                <center>
                  <img
                    className='app__headerImage_signIn'
                    src={instagramLogo}
                    alt=""
                  />
                </center>

                <Input className='signIn__input' placeholder="email" type="text" value={email} onChange={(e) => setEmail(e.target.value)}>
                </Input>
                <Input className='signIn__input' placeholder="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)}>
                </Input>
                <Button style={{backgroundColor: '#0095f6', margin: 'auto', width: '75%', color: '#fff', fontWeight: '600', fontSize: '12px', marginTop: '10px', textTransform: 'capitalize'}} type="submit" onClick={signIn}>Log In</Button>
                <p className='sigIn__p'>
                  <span className='sigIn__span'>
                    OR
                  </span>
                </p>
                <div className='facebook'>
                  <AiFillFacebook style={{verticalAlign: "middle", fontSize: "19px"}} /> Log in with Facebook
                  <p className='forgotPassword'>
                    Forgot password?
                  </p>
                </div>
              </form>
            </div>
            <div className='start_signUp'>
              Don't have an account?
              <Button style={{color: '#0095f6', fontSize: '13px', textTransform: 'capitalize', fontWeight: '600'}} onClick={() => setOpen(true)}>Sign Up</Button>
            </div>
            <div className='get__app'>
              Get the app.
            </div>
          </div>
        </div>
      )}
      
    </div>
  );
}

export default App;
