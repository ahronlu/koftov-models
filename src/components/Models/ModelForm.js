import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Form, Button, Segment, Header, Input } from "semantic-ui-react";
import { PageHero } from "../Ui";
import { updateDoc, addDoc, getDoc } from "../../services";

export const ModelForm = ({ history, match, modelId, updateModel }) => {
  const id = modelId || match.params.id;
  const [isLoading, setLoading] = useState(false);
  const [pageHeroHeader, setPageHeroHeader] = useState("צור מיוצג חדש");
  const [backLink, setBackLink] = useState("/");
  const [model, setModel] = useState({
    birthYear: "",
    city: "",
    height: "",
    name: "",
    gender: "",
    pantsSize: "",
    phone: "",
    shirtSize: "",
    shoeSize: "",
  });

  useEffect(() => {
    if (!id) return;
    if (modelId) {
      setBackLink(`/models/${modelId}`);
    } else {
      setBackLink(`/models/`);
    }

    const getModel = async () => {
      setLoading(true);
      setPageHeroHeader("עדכן מיוצג");
      try {
        const model = await getDoc("models", id);
        setModel(model);
      } catch (err) {
        alert(err);
      }
      setLoading(false);
    };
    getModel();
  }, [modelId, id]);

  const handleChange = (e) => {
    if (e.target.name !== "birthYear") {
      setModel({ ...model, [e.target.name]: e.target.value });
    } else {
      setModel({ ...model, birthYear: Number(e.target.value) });
    }
  };

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (id) {
      try {
        await updateDoc("models", id, model);
        if (modelId) {
          updateModel(model);
          setLoading(false);
        } else {
          history.push("/models");
        }
      } catch (err) {
        alert(err);
      }
    } else {
      try {
        const docRef = await addDoc("models", model);
        history.push(`/models/${docRef.id}`);
      } catch (err) {
        alert(err);
      }
    }
  };

  return (
    <>
      {model && (
        <>
          {!modelId && <PageHero header={pageHeroHeader} icon="modelAdd" />}
          <Segment loading={isLoading}>
            <Form onSubmit={submit}>
              <Header textAlign="right">פרטים אישיים:</Header>
              <Form.Group widths="equal">
                <Form.Field required>
                  <label>שם</label>
                  <Input
                    value={model.name}
                    name="name"
                    onChange={handleChange}
                    type="text"
                    placeholder="שם מלא"
                    required
                  />
                </Form.Field>
                <Form.Field required>
                  <label>מין</label>
                  <select
                    name="gender"
                    value={model.gender}
                    onChange={handleChange}
                    required
                  >
                    <option value="" disabled>
                      מין
                    </option>
                    <option value="male">זכר</option>
                    <option value="female">נקבה</option>
                  </select>
                </Form.Field>
                <Form.Field required>
                  <label>שנת לידה</label>
                  <Input
                    value={model.birthYear}
                    name="birthYear"
                    onChange={handleChange}
                    type="number"
                    min="1950"
                    max="2030"
                    placeholder="שנת לידה"
                    required
                  />
                </Form.Field>
                <Form.Field required>
                  <label>טלפון</label>
                  <input
                    value={model.phone}
                    name="phone"
                    onChange={handleChange}
                    minLength="8"
                    maxLength="11"
                    type="text"
                    placeholder="טלפון"
                    required
                  />
                </Form.Field>
                <Form.Field required>
                  <label>עיר מגורים</label>
                  <Input
                    value={model.city}
                    name="city"
                    onChange={handleChange}
                    type="text"
                    placeholder="עיר מגורים"
                    required
                  />
                </Form.Field>
              </Form.Group>
              <Header>מידות:</Header>
              <Form.Group widths="equal">
                <Form.Field>
                  <label>גובה:</label>
                  <Input
                    value={model.height}
                    name="height"
                    onChange={handleChange}
                    type="number"
                    min="120"
                    max="210"
                    placeholder="גובה"
                  />
                </Form.Field>
                <Form.Field>
                  <label>חולצה:</label>
                  <select
                    value={model.shirtSize}
                    name="shirtSize"
                    onChange={handleChange}
                  >
                    <option value="" disabled>
                      מידת חולצה
                    </option>
                    <option value="XS">XS</option>
                    <option value="S">S</option>
                    <option value="M">M</option>
                    <option value="L">L</option>
                    <option value="XL">XL</option>
                    <option value="XXL">XXL</option>
                    <option value="XXXL">XXXL</option>
                  </select>
                </Form.Field>
                <Form.Field>
                  <label>מכנסיים:</label>
                  <input
                    value={model.pantsSize}
                    name="pantsSize"
                    onChange={handleChange}
                    type="number"
                    min="20"
                    max="50"
                    placeholder="מידת מכנסיים"
                  />
                </Form.Field>
                <Form.Field>
                  <label>נעליים:</label>
                  <input
                    value={model.shoeSize}
                    name="shoeSize"
                    onChange={handleChange}
                    type="number"
                    min="24"
                    max="64"
                    placeholder="מידת נעליים"
                  />
                </Form.Field>
              </Form.Group>
              <Button
                centered="true"
                color="green"
                style={{ margin: 0 }}
                loading={isLoading}
                disabled={isLoading}
              >
                שמור
              </Button>
              {!modelId && (
                <Button
                  disabled={isLoading}
                  color="red"
                  as={Link}
                  to={backLink}
                >
                  ביטול
                </Button>
              )}
            </Form>
          </Segment>
        </>
      )}
    </>
  );
};
