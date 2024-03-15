import { ReactElement } from "react";
import { Redirect, Route } from "react-router";

interface Props {
  children: ReactElement;
  path: string;
  token: string | null;
}

function ProtectedPageRouter({ token, children, path, ...rest }: Props) {
  return (
    <Route
      path={path}
      {...rest}
      render={() => {
        return token ? children : <Redirect to="/login"></Redirect>;
      }}
    />
  );
}

export default ProtectedPageRouter;
