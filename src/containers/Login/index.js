import React, { useContext } from "react";
import Page from "components/Page";
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
  } = useForm();
  const { mutate: doLogin, isLoading, isError } = useMutation(
    (data) =>
      backendFetch({
        endpoint: `auth/login/`,
        method: "POST",
        body: data,
        omitToken: true,
      }),
    {
      useErrorBoundary: false,
      onSuccess: (data) => {
        login({
          user: { email: null, username: null },
          token: data.token,
        });
      },
    }
  );

  const onSubmit = async (data) => {
    await doLogin(data);
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
          {isError && "Unable to login with the provided credentials"}
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
          <Button type="submit" disabled={isLoading}>
            Submit
          </Button>
        </form>
        <Link to="/register">Don't have an account? Get started here.</Link>
      </Card>
    </Page>
  );
}

export default Login;
