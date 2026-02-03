import { useState } from "react";
import { LoginPage } from "./pages/LoginPage";
import { UploadPage } from "./pages/UploadPage";

export default function App() {
  const [loggedIn, setLoggedIn] = useState(false);

  return loggedIn ? (
    <UploadPage />
  ) : (
    <LoginPage onLoginSuccess={() => setLoggedIn(true)} />
  );
}
