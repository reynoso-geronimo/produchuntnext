import '../styles/globals.css'
import firebase, {FirebaseContext} from '../firebase';

function MyApp(props) {
  const { Component, pageProps }=props;
  
  return <FirebaseContext.Provider
    vlaue={{
      firebase
    }}
    >
   <Component {...pageProps} />
        </FirebaseContext.Provider>
}

export default MyApp
