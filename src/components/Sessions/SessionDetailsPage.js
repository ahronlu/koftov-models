import React, { useState, useEffect } from "react";
import { Button, Tab } from "semantic-ui-react";
import ModelSessions from "./ModelSessions";
import { PageHero, PageLoader } from "../Ui";
import { deleteDoc, getDoc } from "../../services";
import { AddModelSession } from "./AddModelSession";
import { SessionForm } from ".";

export const SessionDetailsPage = ({ history, match }) => {
  const [session, setSession] = useState(null);
  const [isLoading, setLoading] = useState(true);
  const sessionId = match.params.id;
  const [tab, setTab] = useState(match.params.tab);

  const panes = [
    { menuItem: "פעולות" },
    {
      menuItem: "צפה במיוצגים המשתתפים ביום זה",
      render: () => (
        <Tab.Pane>
          <ModelSessions sessionId={sessionId} session={session} />
        </Tab.Pane>
      ),
    },
    {
      menuItem: "הוסף מיוצג ליום צילום",
      render: () => (
        <Tab.Pane>
          <AddModelSession sessionId={sessionId} history={history} />
        </Tab.Pane>
      ),
    },
    {
      menuItem: "עדכן",
      render: () => (
        <Tab.Pane>
          <SessionForm sessionId={sessionId} updateSession={setSession} />
        </Tab.Pane>
      ),
    },
    {
      menuItem: "מחק",
      render: () => (
        <Tab.Pane>
          <Button color="red" onClick={deleteSession}>
            מחק יום צילום
          </Button>
        </Tab.Pane>
      ),
    },
  ];

  useEffect(() => {
    setTab(match.params.tab);
    const getSession = async () => {
      try {
        const session = await getDoc("sessions", sessionId);
        setSession({ ...session, date: session.date.toDate() });
      } catch (err) {
        alert(err);
      }
      setLoading(false);
    };
    getSession();
  }, [sessionId, match.params.tab]);

  const deleteSession = async () => {
    if (window.confirm("למחוק את יום הצילום?")) {
      setLoading(true);
      try {
        await deleteDoc("sessions", sessionId);
        history.push("/sessions");
      } catch (err) {
        alert(err);
      }
    }
  };

  return (
    <>
      {isLoading ? (
        <PageLoader />
      ) : (
        <>
          {session && (
            <>
              <PageHero header={session.production} date={session.date} />
              <Tab
                defaultActiveIndex={tab}
                menu={{ attached: true, className: "wrapped" }}
                panes={panes}
              />
            </>
          )}
        </>
      )}
    </>
  );
};
