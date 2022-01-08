import React, { useContext } from "react";
import Page from "components/Page";
import * as _ from "lodash";
import { useMutation } from "react-query";
import { Redirect, Link } from "react-router-dom";
import { InputGroup, Intent, Button, Label, Card } from "@blueprintjs/core";
import { backendFetch } from "utils/api";
import { useForm, Controller } from "react-hook-form";
import { Tooltip2 } from "@blueprintjs/popover2";
import { AuthContext } from "context/AuthContext";

function Login() {
  const [showPassword, setShowPassword] = React.useState(false);
  const { state, login } = useContext(AuthContext);
  const { isAuthenticated } = state;
  const {
    control,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm();
  const { mutate: doRegister, isLoading } = useMutation(
    (data) =>
      backendFetch({
        endpoint: `auth/register/`,
        method: "POST",
        body: data,
        omitToken: true,
      }),
    {
      useErrorBoundary: false,
      onSuccess: (data) => {
        login({
          user: data.user,
          token: data.token,
        });
      },
      onError: (error) => {
        const errors = error.response?.data;
        const response = error.response;
        if (response.status > 400) {
          setError("general", {
            type: "manual",
            message: "something went wrong trying to register",
          });
        } else if (!_.isEmpty(_.keys(errors))) {
          _.keys(errors).forEach((errorKey) => {
            setError(errorKey, {
              type: "manual",
              message: errors[errorKey][0],
            });
          });
        }
      },
    }
  );
  const onSubmit = async (data) => {
    await doRegister(data);
  };
  const lockButton = (
    <Tooltip2 content={`${showPassword ? "Hide" : "Show"} Password`}>
      <Button
        icon={showPassword ? "unlock" : "lock"}
        intent={Intent.WARNING}
        minimal={true}
        onClick={() => setShowPassword(!showPassword)}
      />
    </Tooltip2>
  );
  if (isAuthenticated) {
    return <Redirect to="/" />;
  }
  return (
    <Page>
      <Card>
        <form onSubmit={handleSubmit(onSubmit)}>
          {errors?.general?.message || null}
          <Label>
            Username
            <Controller
              control={control}
              name="username"
              rules={{ required: "This field is required" }}
              render={({
                field: { onChange, onBlur, value, ref },
                formState,
              }) => (
                <InputGroup
                  large
                  onBlur={onBlur}
                  disabled={formState.isSubmitting || isLoading}
                  onChange={onChange}
                  placeholder="Username"
                  type="text"
                  inputRef={ref}
                />
              )}
            />
            {errors?.username?.message || null}
          </Label>
          <Label>
            Email
            <Controller
              control={control}
              name="email"
              rules={{ required: "This field is required" }}
              render={({
                field: { onChange, onBlur, value, ref },
                formState,
              }) => (
                <InputGroup
                  large
                  onBlur={onBlur}
                  disabled={formState.isSubmitting || isLoading}
                  onChange={onChange}
                  placeholder="Email"
                  type="text"
                  inputRef={ref}
                />
              )}
            />
            {errors?.email?.message || null}
          </Label>
          <Label>
            Password
            <Controller
              control={control}
              name="password"
              rules={{ required: "This field is required" }}
              render={({
                field: { onChange, onBlur, value, ref },
                formState,
              }) => (
                <InputGroup
                  large
                  onBlur={onBlur}
                  disabled={formState.isSubmitting || isLoading}
                  onChange={onChange}
                  placeholder="Password"
                  rightElement={lockButton}
                  type={showPassword ? "text" : "password"}
                  inputRef={ref}
                />
              )}
            />
            {errors?.password?.message || null}
          </Label>
          <Label>
            Re-enter Password
            <Controller
              control={control}
              name="confirmPassword"
              rules={{ required: "This field is required" }}
              render={({
                field: { onChange, onBlur, value, ref },
                formState,
              }) => (
                <InputGroup
                  large
                  onBlur={onBlur}
                  disabled={formState.isSubmitting || isLoading}
                  onChange={onChange}
                  placeholder="Confirm Password"
                  rightElement={lockButton}
                  type={showPassword ? "text" : "password"}
                  inputRef={ref}
                />
              )}
            />
            {errors?.password?.message || null}
          </Label>
          <Button type="submit" disabled={isLoading}>
            Submit
          </Button>
        </form>
        <Link to="/login">Already have an account? Log in here.</Link>
      </Card>
    </Page>
  );
}

export default Login;
