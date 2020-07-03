import React, {useEffect} from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import {useImmerReducer} from 'use-immer'
import Axios from 'axios'

import StateContext from './StateContext'
import DispatchContext from './DispatchContext'
import FlashMessages from './components/FlashMessages/FlashMessages'

import "./index.css";
import Home from './components/Home/Home'
import Header from './components/Header/Header'
import Footer from './components/Footer/Footer'

// WP CORE
import BlogPostList from './components/Blog/BlogPostList'
import SinglePost from './components/Blog/SinglePost'

// MEDIA
import AddMedia from './components/Media/AddMedia'

import PageList from './components/Pages/PageList'
import SinglePage from './components/Pages/SinglePage'

// Add post / recipe /post type
import CreatePost from './components/Post/CreatePost'
import EditPost from './components/Post/EditPost'


// Custom post types
import CreateRecipe from './components/Post/CreateRecipe'
import EditRecipe from './components/Post/EditRecipe'

// RECIPES
import Recipe from './components/Recipe/Recipe'
import RecipeCategories from './components/Recipe/RecipeCategories'
import RecipeCategory from './components/Recipe/RecipeCategory'
import RecipePostLists from './components/Blog/RecipePostList'

// Buddypress
import Member from './components/BuddyPress/Member/Member';
import Members from './components/BuddyPress/Member/Members';

import Messages from './components/BuddyPress/Message/Messages'
import MessageThread from './components/BuddyPress/Message/MessageThread'
import AddMessageThread from "./components/BuddyPress/Message/AddMessageThread";

import Activity from './components/BuddyPress/Activity/Activity'
import SingleActivity from "./components/BuddyPress/Activity/SingleActivity";

import Signup from './components/BuddyPress/Auth/Signup'
import LoginForm from './components/BuddyPress/Auth/LoginForm'

import Groups from './components/BuddyPress/Group/Groups'
import SingleGroup from "./components/BuddyPress/Group/SingleGroup";

import NotificationsPage from './components/BuddyPress/Notifications/NotificationsPage'

// Custom components
import View from './components/View/View'
import ViewJarallax from "./components/View/ViewJarallax";

function App() {

    const localWordpress = "http://localhost/dashboard/OLEPETTER/WORDPRESS/BUDDYPRESS/"
    const camillahardilla = "https://camillahardilla.com/"
    const progitek = "https://progitek.no/privat/bp/wp-json/wp/v2/"

  const initialState = {
    loggedIn: Boolean(localStorage.getItem("token")),
    flashMessages: [],
    user: {
        token: localStorage.getItem("token"),
        user_email: localStorage.getItem("appEmail"),
        user_display_name: localStorage.getItem("appDisplayName"),
        user_nicename: localStorage.getItem("appUsername"),
        avatar: localStorage.getItem("appAvatar"),
        tokenExpiration: localStorage.getItem("appTokenExpiration"),
        appAdmin: localStorage.getItem("appAdmin"),
        appUserId: localStorage.getItem("appUserId"),
        appBPMemberId: localStorage.getItem("appBPMemberId"),
        appUserNotificationsCount: localStorage.getItem("appUserNotificationsCount")
    },
    isSearchOpen: false,
    darkBackground: false,
    wordpressUrl: camillahardilla + "wp-json/wp/v2/",
    wordpressBaseUrl: localWordpress
}

function ourReducer(draft, action) {
    switch (action.type) {
        case "login":
            draft.loggedIn = true
            draft.user = action.data
            return
        case "fetchAppUserId": 
            draft.appUserIdFetched = true
            draft.appUserId = action.value
            return
        case "appBPMemberIdFetched": 
            draft.appBPMemberIdFetched = true
            draft.user.appUserId = action.value
            return
        case "userNotificationsCount":
            draft.appUserNotifications = true
            draft.appUserNotificationsCount = action.value
            return
        case "logout":
            draft.loggedIn = false
            return
        case "flashMessage":
            draft.flashMessages.push(action.value)
            return 
        case "openSearch":
            draft.isSearchOpen = true
            return
        case "closeSearch":
            draft.isSearchOpen = false
            return            
        case "openModal":
            draft.darkBackground = true
            return
        case "closeModal":
            draft.darkBackground = false
            return
    }
}

const [state, dispatch] = useImmerReducer(ourReducer, initialState);

useEffect(() => {

    if (state.appUserNotifications) {
        localStorage.setItem("appUserNotificationsCount", state.user.appUserNotificationsCount)
    }

}, [state.appUserNotifications])

useEffect(() => {
    if (state.loggedIn) {

        if (state.user.user_email === "olepetter_kh@hotmail.no") {
            localStorage.setItem("appAdmin", state.user.appAdmin);
        }

        // Fetch user data / buddypress member data and get avatar and user_id
        localStorage.setItem("token", state.user.token)
        localStorage.setItem("appEmail", state.user.user_email)
        localStorage.setItem("appDisplayName", state.user.user_display_name)
        localStorage.setItem("appUsername", state.user.user_nicename)
        

        const expirationToken = new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 7)
        localStorage.setItem("appTokenExpiration", expirationToken)
    } else {
        localStorage.removeItem("appAdmin")
        localStorage.removeItem("token")
        localStorage.removeItem("appEmail")
        localStorage.removeItem("appDisplayName")
        localStorage.removeItem("appUsername")
        localStorage.removeItem("appTokenExpiration")
        localStorage.removeItem("appUserId")
        localStorage.removeItem("appUserNotificationsCount")
    }
}, [state.loggedIn])

useEffect(() => {
    if (state.appBPMemberIdFetched) {
        localStorage.setItem("appUserId", state.user.appUserId)
    } else {
        localStorage.removeItem("appUserId")
    }
}, [state.appBPMemberIdFetched])



const expirationToken = new Date(localStorage.getItem("appTokenExpiration")).getTime();
const currentTime = new Date().getTime()


const tokenRemainingTime = (expirationToken-currentTime)
const tokenRemainingTimeSeconds = (expirationToken-currentTime)/1000
const tokenRemainingTimeMinutes = tokenRemainingTimeSeconds/60
const tokenRemainingTimeHours = tokenRemainingTimeMinutes/60
const tokenRemainingTimeDays = tokenRemainingTimeHours/60


// Sjekk om token har utløpt eller ikke
useEffect(() => {

    const headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + state.user.token
    }

    if (state.loggedIn) {
        const ourRequest = Axios.CancelToken.source()
        async function fetchResults() {
            try {
                const response = await Axios.post(state.wordpressBaseUrl +  "wp-json/jwt-auth/v1/token/validate", {}, {headers: headers});

                if (!response.data) {
                    dispatch({type: "logout"});
                }
            } catch (error) {
                console.log("Validering feilet: ", error)
            }
            
        }
        fetchResults()
        return () => ourRequest.cancel()
    }

}, [])

    return (
      <StateContext.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>
      <BrowserRouter>
      <FlashMessages messages={state.flashMessages} />
        <Header />
          <Switch>
            <Route path="/" exact>
              <>
                <ViewJarallax image="https://upload.wikimedia.org/wikipedia/commons/f/f0/Sl%C3%A5tthaug_idrettsanlegg.jpg" preText="Velkommen til " text="buddypress" />
                <Home/>
              </>
            </Route>
            <Route path="/innlegg/:page" exact>
              <BlogPostList/>
            </Route>
            <Route path="/innlegg/single/:id" exact>
              <SinglePost/>
            </Route>

            <Route path="/sider" exact >
                <PageList />
            </Route>
            <Route path="/sider/single/:id" exact>
                <SinglePage />
            </Route>




            <Route path="/create-post" exact>
                <CreatePost/>
            </Route>
            <Route path="/edit-post/:id">
                <EditPost/>
            </Route>

            <Route path="/add-media" exact>
                <AddMedia />
            </Route>

            <Route path="/bp/members" exact>
                <Members />
            </Route>
            <Route path="/bp/members/:id" exact>
                {state.loggedIn ? <Member /> : <LoginForm message="Du må være logget inn for å se denne siden" />}
            </Route>

            <Route path="/bp/notifications" exact>
                <NotificationsPage/>
            </Route>
            <Route path="/bp/add-messagethread" exact>
                <AddMessageThread/>
            </Route>
            <Route path="/bp/messages" exact>
                <Messages />
            </Route>
            <Route path="/bp/messages/:id" exact>
                <MessageThread />
            </Route>

            <Route path="/bp/activity" exact>
                <Activity />
            </Route>
            <Route path="/bp/activity/:id" exact>
                <SingleActivity />
            </Route>
            <Route path="/bp/signup" exact>
                <Signup />
            </Route>
            <Route path="/bp/login" exact>
                <LoginForm />
            </Route>
            <Route path="/bp/groups" exact>
                <Groups />
            </Route>
            <Route path="/bp/groups/:id" exact>
                <SingleGroup/>
            </Route>

            <Route path="/create-recipe" exact>
                <CreateRecipe/>
            </Route>
            <Route path="/edit-recipe/:id">
                <EditRecipe/>
            </Route>
            <Route path="/oppskrift/:id" exact>
                <Recipe />
            </Route>
            <Route path="/categories" exact>
                <>
                    <View text="Kategorier" image="https://camillahardilla.com/wp-content/uploads/2020/02/flat-lay-photography-of-vegetable-salad-on-plate-1640777-scaled.jpg" />
                    <RecipeCategories />
                </>
            </Route>
            <Route path="/category/:id" exact>
                <RecipeCategory />
            </Route>
            
            <Route path="/oppskrifter/:page" exact>
                <RecipePostLists/>
            </Route>

          </Switch>
          <Footer />
      </BrowserRouter>
      </DispatchContext.Provider>
      </StateContext.Provider>
    );

}

export default App;
