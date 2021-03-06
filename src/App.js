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

import BlogPostList from './components/Blog/BlogPostList'
import SinglePostHeroku from './components/Blog/SinglePostHeroku'

import PageList from './components/Pages/PageList'
import SinglePage from './components/Pages/SinglePage'


import SingleTeam from './components/Team/Team'
import Teams from './components/Team/Teams'
import Sesonger from './components/Team/Sesonger'
import Sesong from './components/Team/Sesong'
import PlayerList from './components/Player/PlayerList';
import Player from './components/Player/Player'

import Kamper from './components/Kamp/Kamper'
import SingleKamp from './components/Kamp/SingleKamp'

import LightboxPage from "./components/Lightbox/Lightbox";
import Galleries from './components/Image/Galleries'
import Gallery from './components/Image/Gallery'
import Images from './components/Image/Images'
import SingleImage from './components/Image/SingleImage'

import ChartsPage from "./components/Charts/ChartsPage";
import Historikk from "./components/Historikk/Historikk";
import SingleHistorikk from "./components/Historikk/SingleHistorikk";
import Hostcup from './components/Hostcup/Hostcup'
import SingleHostcup from './components/Hostcup/SIngleHostcup'


// Buddypress new //
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




import Videos from './components/Footballstats/Videos'
import SingleVideo from './components/Footballstats/SingleVideo'

// ADMIN
import Admin from './components/Admin/Admin'
import AddImage from './components/Admin/AddImage'
import AddGallery from './components/Admin/AddGallery'
import GalleriesAdmin from "./components/Admin/GalleriesAdmin";
import SingleGalleryAdmin from "./components/Admin/SingleGalleryAdmin";


import Sponsor from "./components/Sponsor/Sponsor";
import ViewJarallax from "./components/View/ViewJarallax";
import BlogPostListHeroku from "./components/Blog/BlogPostListHeroku";
import SinglePost from "./components/Blog/SinglePostHeroku";

function App() {

    // appUserId is wordpress user id
    // appBPMemberId is Buddypress member id of user, which is different from appUserId
    const wordpressUrl = "https://smorasstats.com/v4/"

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
    wordpressBaseUrl: wordpressUrl
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
            draft.appBPMemberId = action.value
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
    if (state.appUserIdFetched) {
        localStorage.setItem("appUserId", state.user.appUserId)
    }
}, [state.appUserIdFetched])

useEffect(() => {
    if (state.appBPMemberIdFetched) {
        localStorage.setItem("appBPMemberId", state.user.appBPMemberId)
    }
}, [state.appUserIdFetched])

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
                const response = await Axios.post("https://smorasstats.com/v4/wp-json/jwt-auth/v1/token/validate", {}, {headers: headers});
                //console.log("Validering av token: ", response.data)
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
                <ViewJarallax image="https://upload.wikimedia.org/wikipedia/commons/f/f0/Sl%C3%A5tthaug_idrettsanlegg.jpg" preText="Velkommen til " text="Smørås IL" />
                <Home/>
              </>
            </Route>
            <Route path="/innlegg/:page" exact>
                <BlogPostList/>
            </Route>
            <Route path="/innlegg/single/:id" exact>
                <SinglePost/>
            </Route>
            <Route path="/innlegg/heroku/:page" exact>
              <BlogPostListHeroku/>
            </Route>
            <Route path="/innlegg/heroku/single/:id" exact>
              <SinglePostHeroku/>
            </Route>

            <Route path="/sider" exact >
                <PageList />
            </Route>
            <Route path="/sider/single/:id" exact>
                <SinglePage />
            </Route>

            <Route path="/historikk" exact>
              <Historikk />
            </Route>
            <Route path="/historikk/:id" exact>
              <SingleHistorikk/>
            </Route>
            <Route path="/hostcup" exact>
                <Hostcup />
            </Route>
            <Route path="/hostcup/single/:id" exact>
                <SingleHostcup />
            </Route>

            <Route path="/teams" exact>
                <Teams />
            </Route>
            <Route path="/teams/single/:id" exact>
                <SingleTeam />
            </Route> 
            <Route path="/sesonger" exact>
                <Sesonger />
            </Route>                            
            <Route path="/kamper" exact>
                <Kamper />
            </Route>
            <Route path="/kamper/:id" exact>
                <SingleKamp />
            </Route>
            
            <Route path="/sesonger/:id" exact>
                <Sesong />
            </Route>
            <Route path="/players" exact>
                <PlayerList />
            </Route>
            <Route path="/players/:id" exact>
                <Player />
            </Route>

            <Route path="/sponsor" exact>
                <Sponsor/>
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

            <Route path="/videos" exact>
                <Videos />
            </Route>

            <Route path="/video/:id" exact>
                <SingleVideo />
            </Route>

            <Route path="/galleries" exact>
                <Galleries />
            </Route>
            <Route path="/gallery/:id" exact>
                <Gallery />
            </Route>
            <Route path="/images" exact>
                <Images />
            </Route>
            <Route path="/images/:id" exact>
                <SingleImage />
            </Route>
            <Route path="/lightbox" exact>
              <LightboxPage/>
            </Route>
            <Route path="/chart" exact>
              <ChartsPage/>
            </Route>

            <Route path="/admin" exact>
                <Admin />
            </Route>
            <Route path="/admin/add-image" exact>
                <AddImage />
            </Route>
            <Route path="/admin/add-gallery" exact>
                <AddGallery />
            </Route>
            <Route path="/admin/galleries" exact>
                <GalleriesAdmin/>
            </Route>
            <Route path="/admin/gallery/:id" exact>
                <SingleGalleryAdmin/>
            </Route>

          </Switch>
          <Footer />
      </BrowserRouter>
      </DispatchContext.Provider>
      </StateContext.Provider>
    );

}

export default App;
