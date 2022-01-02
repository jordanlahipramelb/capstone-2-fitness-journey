import React from "react";
import { Switch, Redirect, Route } from "react-router-dom";

import ProtectedRoutes from "./ProtectedRoutes";
import Homepage from "../components/home/Homepage";
import PostList from "../components/posts/PostList";
import Post from "../components/posts/Post";
import NewPost from "../components/posts/NewPostForm";
import ExerciseList from "../components/exercises/ExerciseList";
import ExerciseDetails from "../components/exercises/ExerciseDetails";
import Profile from "../components/users/Profile";

import LoginForm from "../components/auth/LoginForm";
import RegisterForm from "../components/auth/RegisterForm";
import ProfileForm from "../components/users/ProfileForm";

const Routes = ({ login, register }) => {
  return (
    <Switch>
      <Route exact path="/">
        <Homepage />
      </Route>

      <Route exact path="/login">
        <LoginForm login={login} />
      </Route>

      <Route exact path="/register">
        <RegisterForm register={register} />
      </Route>

      <Route exact path="/exercises">
        <ExerciseList />
      </Route>

      <Route exact path="/exercises/:id">
        <ExerciseDetails />
      </Route>

      <Route exact path="/routines"></Route>

      <Route exact path="/routines/:name"></Route>

      <Route exact path="/forum/new">
        <NewPost />
      </Route>

      <Route exact path="/forum">
        <PostList />
      </Route>

      <Route exact path="/forum/:postId">
        <Post />
      </Route>

      <Route exact path="/athlete">
        <Profile />
      </Route>

      <ProtectedRoutes exact path="/athlete/edit">
        <ProfileForm />
      </ProtectedRoutes>

      <Route exact path="/athletes/:username"></Route>
      <Redirect to="/" />
    </Switch>
  );
};

export default Routes;
