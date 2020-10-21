import React, { useState } from "react";
import {
  Button,
  Form,
  Message,
  Segment,
  Header,
  Grid,
  Image,
} from "semantic-ui-react";
import { auth } from "../../firebase";
import representatorIcon from "./images/representators.png";

export const Login = ({ history }) => {
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [loading, setloading] = useState(false);
  const [error, setError] = useState(null);
  const [isPasswordReset, setIsPasswordReset] = useState(false);
  const [login, setLogin] = useState("login");

  const submit = async () => {
    const { email, password } = user;
    setloading(true);

    try {
      if (login === "login") {
        await auth.signInWithEmailAndPassword(email, password);
        history.push("/");
      } else if (login === "signup") {
        const newUser = await auth.createUserWithEmailAndPassword(
          email,
          password
        );
        return await newUser.user.updateProfile({
          displayName: user.name,
        });
      } else {
        await auth.sendPasswordResetEmail(email);
        setIsPasswordReset(true);
        setError(null);
        setloading(false);
      }
    } catch (err) {
      setError(err.message);
      setIsPasswordReset(false);
      setloading(false);
    }
  };

  const changeInput = (e) => {
    setUser({
      ...user,
      [e.target.name]: e.target.value,
    });
  };

  const setLoginStatus = (status) => {
    setLogin(status);
    setIsPasswordReset(false);
  };

  return (
    <Grid textAlign="center" style={{ height: "70vh" }} verticalAlign="middle">
      <Grid.Column style={{ maxWidth: 450 }}>
        <Header as="h1" textAlign="center">
          <Image src={representatorIcon} />
          התחברות למערכת מיוצגים
        </Header>
        <Form onSubmit={submit} size="large">
          <Segment stacked>
            <Form.Field>
              {login === "signup" && (
                <Form.Input
                  onChange={changeInput}
                  value={user.name}
                  name="name"
                  minLength="6"
                  type="text"
                  fluid
                  placeholder="שם"
                />
              )}
              <Form.Input
                onChange={changeInput}
                value={user.email}
                name="email"
                type="email"
                placeholder={
                  login ? "דואל" : "נא הכנס את כתובת הדואר האלקטרוני שלך"
                }
                fluid
              />
              {login !== "forgot" && (
                <Form.Input
                  onChange={changeInput}
                  value={user.password}
                  name="password"
                  minLength="6"
                  type="password"
                  fluid
                  placeholder="סיסמא"
                />
              )}
            </Form.Field>
            {isPasswordReset && (
              <Message positive>
                <Message.Header>השחזור עבר בהצלחה</Message.Header>
                <p>בדוק את תיבת הדוא"ל שלך ופעל בהתאם להוראות</p>
                <span
                  style={{ cursor: "pointer", fontWeight: "bold" }}
                  onClick={() => setLoginStatus("login")}
                >
                  חזרה להתחברות
                </span>
              </Message>
            )}
            {error && (
              <Message negative>
                <Message.Header>שגיאה, אנא נסה שנית</Message.Header>
                <p>{error}</p>
              </Message>
            )}
            <Button
              color="blue"
              loading={loading}
              disabled={
                loading || !user.email || (login !== "forgot" && !user.password)
              }
            >
              {login === "login"
                ? "התחברות"
                : login === "signup"
                ? "הרשמה"
                : "שחזר סיסמה"}
            </Button>

            <p
              style={{ paddingTop: 10 }}
              onClick={() =>
                setLoginStatus(login === "login" ? "signup" : "login")
              }
            >
              {login === "login"
                ? "אין לך חשבון עדיין? לחץ להרשמה"
                : login === "signup"
                ? "יש לך כבר חשבון? לחץ להתחברות"
                : null}
            </p>
          </Segment>
        </Form>
        {login !== "signup" && (
          <Message>
            {login === "login" ? "שכחת סיסמה?" : "זוכר את הסיסמה?"}{" "}
            <span
              style={{ cursor: "pointer", color: "green" }}
              onClick={() =>
                setLoginStatus(login === "forgot" ? "login" : "forgot")
              }
            >
              {login ? "לחץ כאן" : "חזרה להתחברות"}
            </span>
          </Message>
        )}
      </Grid.Column>
    </Grid>
  );
};
