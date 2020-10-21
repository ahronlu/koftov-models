import React from "react";
import { Link } from "react-router-dom";
import { Dropdown, Icon, Menu } from "semantic-ui-react";
import { auth } from "../../firebase";

export const Navbar = ({ user }) => {
  return (
    <Menu fluid className="noprint" color="blue" inverted pointing>
      {user && (
        <>
          <Menu.Item as={Link} to="/">
            מסך הבית
          </Menu.Item>
          <Dropdown item text=" מיוצגים ">
            <Dropdown.Menu>
              <Dropdown.Item
                as={Link}
                to="/createModel"
                style={{ textAlign: "center" }}
              >
                צור מיוצג חדש
              </Dropdown.Item>
              <Dropdown.Item
                as={Link}
                to="/models"
                style={{ textAlign: "center" }}
              >
                חפש מיוצגים
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
          <Dropdown item text=" ימי צילום ">
            <Dropdown.Menu>
              <Dropdown.Item
                as={Link}
                to="/createSession"
                style={{ textAlign: "center" }}
              >
                צור יום צילום חדש
              </Dropdown.Item>
              <Dropdown.Item
                as={Link}
                to="/sessions"
                style={{ textAlign: "center" }}
              >
                חפש ימי צילום
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
          <Menu.Item position="left" onClick={() => auth.signOut()}>
            {" "}
            <Icon name="sign out" label="Sign Out" />
          </Menu.Item>
        </>
      )}
    </Menu>
  );
};
